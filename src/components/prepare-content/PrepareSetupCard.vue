<template>
  <section class="card">
    <header class="card-header">
      <div>
        <h2 class="card-title">Step 1 — Choose category, brand, product type</h2>
        <p class="card-subtitle">
          Look up a WooCommerce category by slug, pair it with a brand and product type,
          then prepare the refresh jobs.
        </p>
      </div>
    </header>

    <div class="card-body">
      <div class="field-row">
        <label class="field">
          <span class="field-label">Category slug (Woo)</span>
          <div class="field-with-button">
            <input
              v-model.trim="slug"
              type="text"
              class="field-input"
              placeholder="e.g. stoves"
              :disabled="locked || resolving"
              @keyup.enter="onLookup"
            />
            <button
              type="button"
              class="btn-secondary"
              :disabled="!slug || locked || resolving"
              @click="onLookup"
            >
              <i class="pi" :class="resolving ? 'pi-spin pi-spinner' : 'pi-search'"></i>
              Look up
            </button>
          </div>
          <div v-if="resolvedCategory" class="field-hint field-hint--ok">
            <i class="pi pi-check-circle"></i>
            {{ resolvedCategory.name }}
            <span class="field-hint-muted">
              (id: {{ resolvedCategory.id }}{{ resolvedCategory.count !== null ? `, ${resolvedCategory.count} products` : '' }})
            </span>
          </div>
          <div v-else-if="resolveError" class="field-hint field-hint--err">
            <i class="pi pi-exclamation-triangle"></i>
            {{ resolveError }}
          </div>
          <ul v-if="alternatives.length > 0" class="field-alts">
            <li v-for="alt in alternatives" :key="alt.id">
              Did you mean <button class="link" type="button" @click="selectAlternative(alt)">{{ alt.slug }}</button>?
            </li>
          </ul>
        </label>
      </div>

      <div class="field-row field-row--split">
        <label class="field">
          <span class="field-label">Brand</span>
          <select v-model.number="brandId" class="field-input" :disabled="locked">
            <option :value="0" disabled>Select brand…</option>
            <option v-for="b in brands" :key="b.id" :value="b.id">{{ b.name }}</option>
          </select>
        </label>
        <label class="field">
          <span class="field-label">Product type</span>
          <select v-model.number="productTypeId" class="field-input" :disabled="locked">
            <option :value="0" disabled>Select product type…</option>
            <option v-for="p in productTypes" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </label>
        <label class="field field--narrow">
          <span class="field-label">Per page</span>
          <input v-model.number="perPage" type="number" min="1" max="100" class="field-input" :disabled="locked" />
        </label>
      </div>

      <div class="card-actions">
        <button
          type="button"
          class="btn-primary"
          :disabled="!canPrepare || preparing || locked"
          @click="onPrepare"
        >
          <i class="pi" :class="preparing ? 'pi-spin pi-spinner' : 'pi-database'"></i>
          {{ preparing ? 'Preparing…' : 'Prepare Jobs' }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  resolveCategoryBySlug,
  preparePrepareRun,
  type BrandOption,
  type ProductTypeOption,
  type CategoryMatch,
  type RunRecord,
} from '@/services/prepareContentRefreshJobs';
import { useToast } from '@/composables/useToast';

const props = defineProps<{
  brands: BrandOption[];
  productTypes: ProductTypeOption[];
  locked: boolean;
}>();

const emit = defineEmits<{
  (e: 'prepared', run: RunRecord): void;
}>();

const { add: toast } = useToast();

const slug = ref('');
const brandId = ref<number>(0);
const productTypeId = ref<number>(0);
const perPage = ref<number>(100);

const resolvedCategory = ref<CategoryMatch | null>(null);
const alternatives = ref<CategoryMatch[]>([]);
const resolveError = ref<string | null>(null);
const resolving = ref(false);
const preparing = ref(false);

const canPrepare = computed(
  () =>
    !!resolvedCategory.value &&
    brandId.value > 0 &&
    productTypeId.value > 0 &&
    perPage.value > 0 &&
    perPage.value <= 100,
);

watch(slug, () => {
  resolvedCategory.value = null;
  alternatives.value = [];
  resolveError.value = null;
});

async function onLookup() {
  if (!slug.value) return;
  resolving.value = true;
  resolveError.value = null;
  resolvedCategory.value = null;
  alternatives.value = [];
  try {
    const res = await resolveCategoryBySlug(slug.value);
    if (res.category) {
      resolvedCategory.value = res.category;
      alternatives.value = res.alternatives;
    } else {
      resolveError.value = 'No category matches that slug.';
    }
  } catch (e) {
    resolveError.value = e instanceof Error ? e.message : String(e);
  } finally {
    resolving.value = false;
  }
}

function selectAlternative(alt: CategoryMatch) {
  slug.value = alt.slug;
  resolvedCategory.value = alt;
  alternatives.value = [];
}

async function onPrepare() {
  if (!canPrepare.value || !resolvedCategory.value) return;
  preparing.value = true;
  try {
    const res = await preparePrepareRun({
      categoryId: resolvedCategory.value.id,
      categorySlug: resolvedCategory.value.slug,
      categoryName: resolvedCategory.value.name,
      brandId: brandId.value,
      productTypeId: productTypeId.value,
      perPage: perPage.value,
    });
    toast({
      severity: 'success',
      summary: 'Jobs prepared',
      detail: `${res.run.jobsCreated} new jobs created · ${res.run.jobsSkippedExisting} skipped existing`,
    });
    emit('prepared', res.run);
  } catch (e) {
    toast({
      severity: 'error',
      summary: 'Prepare failed',
      detail: e instanceof Error ? e.message : String(e),
      life: 7000,
    });
  } finally {
    preparing.value = false;
  }
}
</script>

<style scoped>
.card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  margin-bottom: 16px;
}
.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
}
.card-title { font-size: 16px; font-weight: 600; color: var(--color-primary); margin: 0 0 4px 0; }
.card-subtitle { font-size: 12px; color: var(--color-text-muted); margin: 0; }
.card-body { padding: 16px 20px; }
.field-row { margin-bottom: 16px; }
.field-row--split { display: grid; grid-template-columns: 1fr 1fr 120px; gap: 12px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field--narrow { max-width: 140px; }
.field-label { font-size: 12px; font-weight: 600; color: var(--color-text-muted); }
.field-with-button { display: flex; gap: 8px; }
.field-input { flex: 1; padding: 8px 10px; border: 1px solid var(--color-border); border-radius: 6px; font-size: 14px; background: var(--color-white); }
.field-input:disabled { background: var(--color-bg); opacity: 0.7; }
.field-hint { font-size: 12px; display: inline-flex; align-items: center; gap: 6px; margin-top: 2px; }
.field-hint--ok { color: var(--color-success, #15803d); }
.field-hint--err { color: var(--color-danger, #b91c1c); }
.field-hint-muted { color: var(--color-text-muted); }
.field-alts { margin: 6px 0 0 0; padding: 0; list-style: none; font-size: 12px; color: var(--color-text-muted); }
.link { background: none; border: none; padding: 0; color: var(--color-brand); cursor: pointer; text-decoration: underline; }
.card-actions { display: flex; justify-content: flex-end; gap: 8px; }
.btn-primary, .btn-secondary {
  display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px;
  border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s ease;
}
.btn-primary { background: var(--color-brand); color: var(--color-white); border: 1px solid var(--color-brand); }
.btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
.btn-secondary { background: var(--color-white); color: var(--color-text-muted); border: 1px solid var(--color-border); }
.btn-secondary:hover:not(:disabled) { border-color: var(--color-brand); color: var(--color-brand); }
.btn-secondary:disabled { opacity: 0.55; cursor: not-allowed; }
</style>
