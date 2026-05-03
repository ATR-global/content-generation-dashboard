<template>
  <div class="page-layout">
    <AppHeader />
    <main class="page-main">
      <div class="page-content">
        <h1 class="page-title">Content Refreshed Pages</h1>

        <!-- Tabs -->
        <div class="tabs-bar">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'unpublished' }"
            @click="activeTab = 'unpublished'"
          >
            Unpublished
            <span class="tab-count">{{ unpublishedCount }}</span>
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'for_review' }"
            @click="activeTab = 'for_review'"
          >
            For Review
            <span class="tab-count">{{ forReviewCount }}</span>
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'published' }"
            @click="activeTab = 'published'"
          >
            Published
            <span class="tab-count">{{ publishedCount }}</span>
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'failed_score' }"
            @click="activeTab = 'failed_score'"
            v-tippy="'Pages with content score below 7.8'"
          >
            Failed Content Score
            <span class="tab-count">{{ failedScoreCount }}</span>
          </button>
        </div>

        <!-- Toolbar: Search + Filter + Bulk action -->
        <div class="toolbar">
          <div class="toolbar-left">
            <div class="search-box">
              <i class="pi pi-search search-icon"></i>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by title, URL, or ID..."
                class="search-input"
              />
            </div>
            <select v-if="activeTab === 'unpublished'" v-model="statusFilter" class="filter-select">
              <option value="">All Statuses</option>
              <option v-for="s in allStatuses" :key="s" :value="s">
                {{ statusLabels[s] }}
              </option>
            </select>
          </div>
          <div class="toolbar-right">
            <button
              v-if="(activeTab === 'unpublished' || activeTab === 'failed_score') && selectedIds.length > 0"
              class="redo-btn"
              @click="showRedoConfirm = true"
            >
              <i class="pi pi-refresh"></i>
              Redo Content ({{ selectedIds.length }})
            </button>
            <button
              v-if="activeTab === 'for_review' && selectedIds.length > 0"
              class="publish-btn"
              @click="showPublishConfirm = true"
            >
              <i class="pi pi-upload"></i>
              Publish Selected ({{ selectedIds.length }})
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="table-container" :class="{ 'is-loading': loading }">
          <div v-if="loading" class="table-loading-overlay">
            <i class="pi pi-spin pi-spinner"></i>
            <span>Loading…</span>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th v-if="hasCheckbox" class="col-checkbox">
                  <input
                    type="checkbox"
                    :checked="allVisibleSelected"
                    @change="toggleSelectAll"
                  />
                </th>
                <th class="col-id sortable-th" @click="toggleSort('id')">
                  ID
                  <i v-if="sortField === 'id'" class="pi" :class="sortDir === 'asc' ? 'pi-sort-amount-up' : 'pi-sort-amount-down'"></i>
                </th>
                <th class="col-title">Title</th>
                <th class="col-score sortable-th" @click="toggleSort('score')">
                  Score
                  <i v-if="sortField === 'score'" class="pi" :class="sortDir === 'asc' ? 'pi-sort-amount-up' : 'pi-sort-amount-down'"></i>
                </th>
                <th class="col-status">Status</th>
                <th class="col-type">Appliance Type</th>
                <th class="col-pages sortable-th" @click="toggleSort('metaPages')">
                  Pages
                  <i v-if="sortField === 'metaPages'" class="pi" :class="sortDir === 'asc' ? 'pi-sort-amount-up' : 'pi-sort-amount-down'"></i>
                </th>
                <th class="col-lang">Language</th>
                <th class="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in records" :key="row.id">
                <td v-if="hasCheckbox" class="col-checkbox">
                  <input
                    type="checkbox"
                    :checked="selectedIds.includes(row.id)"
                    @change="toggleSelect(row.id)"
                  />
                </td>
                <td class="col-id">{{ row.id }}</td>
                <td class="col-title">
                  <div class="title-cell">
                    <div class="title-row">
                      <a :href="row.pageUrl" target="_blank" class="title-link">
                        {{ row.title }}
                      </a>
                      <span
                        v-if="row.contentIssuesRecommendations"
                        class="issues-badge"
                        v-tippy="'Has content issues / recommendations'"
                      >
                        <i class="pi pi-exclamation-triangle"></i>
                      </span>
                    </div>
                    <span class="title-meta">WP #{{ row.wpPageId }}</span>
                  </div>
                </td>
                <td class="col-score">
                  <span
                    v-if="row.score !== null && row.score !== undefined"
                    class="score-badge"
                    :class="scoreClass(row.score)"
                  >
                    {{ row.score }}
                  </span>
                </td>
                <td class="col-status">
                  <span class="status-tag" :class="'status--' + row.status">
                    {{ statusLabels[row.status] || row.status }}
                  </span>
                </td>
                <td class="col-type">{{ row.metaApplianceType }}</td>
                <td class="col-pages">{{ row.metaPages }}</td>
                <td class="col-lang">{{ row.metaLanguage }}</td>
                <td class="col-actions">
                  <div class="actions-inner">
                    <button
                      class="action-btn"
                      v-tippy="'Edit Content'"
                      @click="openModal(row)"
                    >
                      <i class="pi pi-pencil"></i>
                    </button>
                    <a
                      :href="row.pageUrl"
                      target="_blank"
                      class="action-btn"
                      v-tippy="'View Page'"
                    >
                      <i class="pi pi-eye"></i>
                    </a>
                    <a
                      :href="row.wpPostUrl"
                      target="_blank"
                      class="action-btn"
                      v-tippy="'Open in WordPress'"
                    >
                      <i class="pi pi-globe"></i>
                    </a>
                  </div>
                </td>
              </tr>
              <tr v-if="records.length === 0">
                <td :colspan="hasCheckbox ? 9 : 8" class="empty-row">
                  No records found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination-bar" v-if="totalPages > 1">
          <span class="pagination-info">
            Showing {{ paginationStart + 1 }}–{{ paginationEnd }} of
            {{ totalRecords }}
          </span>
          <div class="pagination-controls">
            <button
              class="page-btn"
              :disabled="currentPage === 1"
              @click="currentPage = 1"
            >
              <i class="pi pi-angle-double-left"></i>
            </button>
            <button
              class="page-btn"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              <i class="pi pi-angle-left"></i>
            </button>
            <span class="page-indicator">Page {{ currentPage }} of {{ totalPages }}</span>
            <button
              class="page-btn"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              <i class="pi pi-angle-right"></i>
            </button>
            <button
              class="page-btn"
              :disabled="currentPage === totalPages"
              @click="currentPage = totalPages"
            >
              <i class="pi pi-angle-double-right"></i>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Edit Modal -->
    <div v-if="modalRecord" class="modal-overlay" @click.self="closeModal">
      <div class="modal-panel">
        <div class="modal-header">
          <h2 class="modal-title">{{ modalRecord.title }}</h2>
          <button class="modal-close" @click="closeModal">
            <i class="pi pi-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="modal-grid">
            <!-- Left column: metadata -->
            <div class="modal-section">
              <h3 class="section-title">Metadata</h3>
              <div class="field-group">
                <label class="field-label">Page URL</label>
                <a :href="modalRecord.pageUrl" target="_blank" class="field-link">
                  {{ modalRecord.pageUrl }}
                </a>
              </div>
              <div class="field-group">
                <label class="field-label">WP Post URL</label>
                <a :href="modalRecord.wpPostUrl" target="_blank" class="field-link">
                  {{ modalRecord.wpPostUrl }}
                </a>
              </div>
              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">Score</label>
                  <input
                    v-model.number="modalRecord.score"
                    type="number"
                    step="0.01"
                    class="field-input"
                    :disabled="isRecreating"
                  />
                </div>
                <div class="field-group">
                  <label class="field-label">Status</label>
                  <span class="status-tag" :class="'status--' + modalRecord.status">
                    {{ statusLabels[modalRecord.status] || modalRecord.status }}
                  </span>
                </div>
              </div>
              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">Format</label>
                  <span class="field-value">{{ modalRecord.metaFormat }}</span>
                </div>
                <div class="field-group">
                  <label class="field-label">Pages</label>
                  <span class="field-value">{{ modalRecord.metaPages }}</span>
                </div>
                <div class="field-group">
                  <label class="field-label">Language</label>
                  <span class="field-value">{{ modalRecord.metaLanguage }}</span>
                </div>
              </div>

              <h3 class="section-title">Preview Thumbnails</h3>
              <div v-if="modalRecord.previewThumbnails.length > 0" class="thumbnail-row">
                <button
                  v-for="(thumb, i) in modalRecord.previewThumbnails"
                  :key="i"
                  type="button"
                  class="thumbnail-tile"
                  v-tippy="'Click to enlarge'"
                  @click="openPreview(i)"
                >
                  <img
                    :src="thumb"
                    :alt="'Preview ' + (i + 1)"
                    class="thumbnail-img"
                    loading="lazy"
                  />
                  <span class="thumbnail-index">{{ i + 1 }}</span>
                </button>
              </div>
              <div v-else class="thumbnail-empty">No preview thumbnails available.</div>

              <h3 class="section-title">Compatible Models</h3>
              <div
                v-for="(_, i) in modalRecord.compatibleModels"
                :key="'model-' + i"
                class="editable-list-row"
              >
                <input
                  v-model="modalRecord.compatibleModels[i]"
                  class="field-input"
                  :disabled="isRecreating"
                />
                <button
                  type="button"
                  class="row-remove-btn"
                  v-tippy="'Remove'"
                  :disabled="isRecreating"
                  @click="modalRecord.compatibleModels.splice(i, 1)"
                >
                  <i class="pi pi-times"></i>
                </button>
              </div>
              <button
                type="button"
                class="row-add-btn"
                :disabled="isRecreating"
                @click="modalRecord.compatibleModels.push('')"
              >
                <i class="pi pi-plus"></i> Add model
              </button>

              <h3 class="section-title">Technical Specs</h3>
              <div
                v-for="(_, i) in modalRecord.technicalSpecs"
                :key="'spec-' + i"
                class="editable-list-row"
              >
                <input
                  v-model="modalRecord.technicalSpecs[i]"
                  class="field-input"
                  :disabled="isRecreating"
                />
                <button
                  type="button"
                  class="row-remove-btn"
                  v-tippy="'Remove'"
                  :disabled="isRecreating"
                  @click="modalRecord.technicalSpecs.splice(i, 1)"
                >
                  <i class="pi pi-times"></i>
                </button>
              </div>
              <button
                type="button"
                class="row-add-btn"
                :disabled="isRecreating"
                @click="modalRecord.technicalSpecs.push('')"
              >
                <i class="pi pi-plus"></i> Add spec
              </button>
            </div>

            <!-- Right column: content fields -->
            <div class="modal-section modal-section--content">
              <h3 class="section-title">Document Overview</h3>
              <textarea
                v-model="modalRecord.documentOverview"
                class="field-textarea"
                rows="4"
                :disabled="isRecreating"
              ></textarea>

              <h3 class="section-title">What This Manual Helps You Fix</h3>
              <div
                v-for="(_, i) in modalRecord.whatThisManualHelpsYouFix"
                :key="'fix-' + i"
                class="editable-list-row"
              >
                <input
                  v-model="modalRecord.whatThisManualHelpsYouFix[i]"
                  class="field-input"
                  :disabled="isRecreating"
                />
                <button
                  type="button"
                  class="row-remove-btn"
                  v-tippy="'Remove'"
                  :disabled="isRecreating"
                  @click="modalRecord.whatThisManualHelpsYouFix.splice(i, 1)"
                >
                  <i class="pi pi-times"></i>
                </button>
              </div>
              <button
                type="button"
                class="row-add-btn"
                :disabled="isRecreating"
                @click="modalRecord.whatThisManualHelpsYouFix.push('')"
              >
                <i class="pi pi-plus"></i> Add item
              </button>

              <h3 class="section-title">What's Inside This Manual</h3>
              <div
                v-for="(_, i) in modalRecord.whatsInsideThisManual"
                :key="'inside-' + i"
                class="editable-list-row"
              >
                <input
                  v-model="modalRecord.whatsInsideThisManual[i]"
                  class="field-input"
                  :disabled="isRecreating"
                />
                <button
                  type="button"
                  class="row-remove-btn"
                  v-tippy="'Remove'"
                  :disabled="isRecreating"
                  @click="modalRecord.whatsInsideThisManual.splice(i, 1)"
                >
                  <i class="pi pi-times"></i>
                </button>
              </div>
              <button
                type="button"
                class="row-add-btn"
                :disabled="isRecreating"
                @click="modalRecord.whatsInsideThisManual.push('')"
              >
                <i class="pi pi-plus"></i> Add item
              </button>

              <h3 class="section-title">Troubleshooting Q&A</h3>
              <div
                v-for="(_, i) in modalRecord.troubleshootingGuideQuestions"
                :key="'qa-' + i"
                class="qa-block"
              >
                <div class="qa-header">
                  <label class="field-label">Q{{ i + 1 }}</label>
                  <button
                    type="button"
                    class="row-remove-btn"
                    v-tippy="'Remove Q&A pair'"
                    :disabled="isRecreating"
                    @click="removeTroubleshootingPair(i)"
                  >
                    <i class="pi pi-times"></i>
                  </button>
                </div>
                <input
                  v-model="modalRecord.troubleshootingGuideQuestions[i]"
                  class="field-input"
                  :disabled="isRecreating"
                />
                <label class="field-label">A{{ i + 1 }}</label>
                <textarea
                  v-model="modalRecord.troubleshootingGuideAnswers[i]"
                  class="field-textarea"
                  rows="3"
                  :disabled="isRecreating"
                ></textarea>
              </div>
              <button
                type="button"
                class="row-add-btn"
                :disabled="isRecreating"
                @click="addTroubleshootingPair"
              >
                <i class="pi pi-plus"></i> Add Q&A
              </button>

              <template v-if="modalRecord.contentIssuesRecommendations">
                <h3 class="section-title section-title--warning">
                  Content Issues / Recommendations
                </h3>
                <textarea
                  v-model="modalRecord.contentIssuesRecommendations"
                  class="field-textarea field-textarea--warning"
                  rows="6"
                  :disabled="isRecreating"
                ></textarea>
              </template>

              <!-- Recreate Content -->
              <div class="recreate-section">
                <h3 class="section-title">Recreate Content</h3>
                <p class="recreate-help">
                  Recreate this item's content. Optionally provide extra guidance to steer the output.
                </p>
                <label class="field-label">
                  Additional Instructions <span class="optional">(optional)</span>
                </label>
                <textarea
                  v-model="recreateInstructions"
                  class="field-textarea"
                  rows="3"
                  placeholder="e.g. 'Make the overview more concise' or 'Add more troubleshooting cases'"
                  :disabled="isRecreating"
                ></textarea>
                <div class="recreate-actions">
                  <button
                    v-if="preRecreateSnapshot"
                    class="btn-link"
                    :disabled="isRecreating"
                    @click="revertRecreate"
                  >
                    <i class="pi pi-undo"></i>
                    Revert to previous
                  </button>
                  <button
                    class="btn-recreate"
                    :disabled="isRecreating"
                    @click="openRecreateConfirm"
                  >
                    <i class="pi pi-refresh" :class="{ 'pi-spin': isRecreating }"></i>
                    {{ isRecreating ? 'Regenerating...' : 'Recreate Content' }}
                  </button>
                </div>
              </div>

              <!-- Loading overlay on content column -->
              <div v-if="isRecreating" class="content-loading-overlay">
                <i class="pi pi-refresh pi-spin loading-icon"></i>
                <span class="loading-text">Regenerating content...</span>
                <span class="loading-subtext">This may take a moment.</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn-ghost"
            :disabled="isRecreating || isSaving"
            @click="closeModal"
          >
            Cancel
          </button>
          <button
            class="btn-primary"
            :disabled="isRecreating || isSaving"
            @click="saveModal"
          >
            <i v-if="isSaving" class="pi pi-spin pi-spinner"></i>
            {{
              isSaving
                ? PUBLISHED_STATUSES.has(modalRecord?.status ?? '')
                  ? 'Saving & republishing…'
                  : 'Saving…'
                : 'Save Changes'
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- Publish Confirmation Modal -->
    <div v-if="showPublishConfirm" class="modal-overlay" @click.self="showPublishConfirm = false">
      <div class="confirm-panel">
        <div class="confirm-icon confirm-icon--publish">
          <i class="pi pi-upload"></i>
        </div>
        <h3 class="confirm-title">Publish Selected Items</h3>
        <p class="confirm-text">
          You are about to publish <strong>{{ selectedIds.length }}</strong>
          {{ selectedIds.length === 1 ? 'item' : 'items' }}. This will make them live on the website.
        </p>
        <div class="confirm-actions">
          <button class="btn-ghost" @click="showPublishConfirm = false">Cancel</button>
          <button class="btn-primary" @click="confirmPublish">Publish</button>
        </div>
      </div>
    </div>

    <!-- Redo Content Confirmation Modal -->
    <div v-if="showRedoConfirm" class="modal-overlay" @click.self="showRedoConfirm = false">
      <div class="confirm-panel">
        <div class="confirm-icon confirm-icon--redo">
          <i class="pi pi-refresh"></i>
        </div>
        <h3 class="confirm-title">Redo Content</h3>
        <p class="confirm-text">
          You are about to redo content generation for <strong>{{ selectedIds.length }}</strong>
          {{ selectedIds.length === 1 ? 'item' : 'items' }}. The existing content will be recreated.
        </p>
        <div class="confirm-actions">
          <button class="btn-ghost" @click="showRedoConfirm = false">Cancel</button>
          <button class="btn-warning" @click="confirmRedo">Redo Content</button>
        </div>
      </div>
    </div>

    <!-- Recreate Single Item Confirmation Modal -->
    <div
      v-if="showRecreateConfirm"
      class="modal-overlay"
      @click.self="showRecreateConfirm = false"
    >
      <div class="confirm-panel confirm-panel--left">
        <div class="confirm-icon confirm-icon--redo">
          <i class="pi pi-refresh"></i>
        </div>
        <h3 class="confirm-title">Recreate Content</h3>
        <p class="confirm-text">
          The content fields for this item will be recreated<span
            v-if="recreateInstructions.trim()"
          >
            using your additional instructions</span>.
        </p>
        <div v-if="recreateInstructions.trim()" class="confirm-instructions">
          <label class="field-label">Instructions</label>
          <div class="confirm-instructions-text">{{ recreateInstructions }}</div>
        </div>
        <div v-if="hasUnsavedEdits" class="confirm-warning">
          <i class="pi pi-exclamation-triangle"></i>
          <span>
            You have unsaved edits to this item that will be
            <strong>overwritten</strong> by the recreated content.
          </span>
        </div>
        <div class="confirm-actions">
          <button class="btn-ghost" @click="showRecreateConfirm = false">Cancel</button>
          <button class="btn-warning" @click="confirmRecreate">Recreate</button>
        </div>
      </div>
    </div>

    <!-- Preview Image Modal -->
    <div
      v-if="previewIndex !== null && modalRecord"
      class="preview-overlay"
      @click.self="closePreview"
      @keydown.esc="closePreview"
    >
      <button class="preview-close" @click="closePreview" v-tippy="'Close (Esc)'">
        <i class="pi pi-times"></i>
      </button>
      <button
        v-if="modalRecord.previewThumbnails.length > 1"
        class="preview-nav preview-nav--prev"
        @click="navigatePreview(-1)"
        v-tippy="'Previous'"
      >
        <i class="pi pi-chevron-left"></i>
      </button>
      <img
        :src="modalRecord.previewThumbnails[previewIndex]"
        :alt="'Preview ' + (previewIndex + 1)"
        class="preview-img"
      />
      <button
        v-if="modalRecord.previewThumbnails.length > 1"
        class="preview-nav preview-nav--next"
        @click="navigatePreview(1)"
        v-tippy="'Next'"
      >
        <i class="pi pi-chevron-right"></i>
      </button>
      <div class="preview-counter">
        {{ previewIndex + 1 }} / {{ modalRecord.previewThumbnails.length }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useToast } from '@/composables/useToast';
import AppHeader from '@/components/common/AppHeader.vue';
import { allStatuses, statusLabels } from '@/data/statusLabels';
import {
  listJobs,
  updateJob,
  recreateJob,
  republishJob,
  bulkRedo as apiBulkRedo,
  bulkPublish as apiBulkPublish,
  getStats,
  type ListParams,
  type ManualRecord,
  type TabType,
} from '@/services/contentRefreshJobs';
import { recordRecreations } from '@/utils/recentRecreations';

const toast = useToast();
const PUBLISHED_STATUSES = new Set(['published']);

const activeTab = ref<TabType>('unpublished');
const searchQuery = ref('');
const statusFilter = ref('');
const selectedIds = ref<number[]>([]);
const currentPage = ref(1);
const pageSize = 50;
const records = ref<ManualRecord[]>([]);
const totalRecords = ref(0);
const loading = ref(false);
const tabCounts = ref<Record<string, number>>({});
const totalJobs = ref(0);
const failedScoreCount = ref(0);
const modalRecord = ref<ManualRecord | null>(null);
const modalOriginal = ref<ManualRecord | null>(null);
const showPublishConfirm = ref(false);
const showRedoConfirm = ref(false);
const showRecreateConfirm = ref(false);
const recreateInstructions = ref('');
const isRecreating = ref(false);
const preRecreateSnapshot = ref<ManualRecord | null>(null);
const sortField = ref<'id' | 'score' | 'metaPages' | null>(null);
const sortDir = ref<'asc' | 'desc'>('asc');

const hasCheckbox = computed(() => activeTab.value !== 'published');

const totalPages = computed(() => Math.max(1, Math.ceil(totalRecords.value / pageSize)));
const paginationStart = computed(() => (currentPage.value - 1) * pageSize);
const paginationEnd = computed(() =>
  Math.min(paginationStart.value + pageSize, totalRecords.value),
);

const unpublishedCount = computed(() => {
  const counts = tabCounts.value;
  const publishedExcluded = counts.published || 0;
  const reviewExcluded = counts.for_review || 0;
  return Math.max(0, totalJobs.value - publishedExcluded - reviewExcluded);
});
const forReviewCount = computed(() => tabCounts.value.for_review || 0);
const publishedCount = computed(() => tabCounts.value.published || 0);

const allVisibleSelected = computed(() => {
  const ids = records.value.map((r) => r.id);
  return ids.length > 0 && ids.every((id) => selectedIds.value.includes(id));
});

let searchDebounce: ReturnType<typeof setTimeout> | null = null;

async function fetchList() {
  loading.value = true;
  try {
    const params: ListParams = {
      tab: activeTab.value,
      status: statusFilter.value || undefined,
      q: searchQuery.value.trim() || undefined,
      sort: sortField.value || undefined,
      order: sortField.value ? sortDir.value : undefined,
      page: currentPage.value,
      pageSize,
    };
    const res = await listJobs(params);
    records.value = res.items;
    totalRecords.value = res.total;
  } catch (err) {
    console.error('[ContentRefreshedPage] list fetch failed', err);
  } finally {
    loading.value = false;
  }
}

async function refreshStats() {
  try {
    const stats = await getStats();
    tabCounts.value = stats.counts;
    totalJobs.value = stats.totalJobs;
    failedScoreCount.value = stats.failedScoreCount ?? 0;
  } catch (err) {
    console.error('[ContentRefreshedPage] stats fetch failed', err);
  }
}

async function refreshAll() {
  await Promise.all([fetchList(), refreshStats()]);
}

onMounted(() => {
  refreshAll();
});

watch([activeTab, statusFilter, sortField, sortDir, currentPage], () => {
  fetchList();
});

watch(activeTab, () => {
  currentPage.value = 1;
  selectedIds.value = [];
  sortField.value = null;
  statusFilter.value = '';
});

watch(searchQuery, () => {
  if (searchDebounce) clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    currentPage.value = 1;
    fetchList();
  }, 300);
});

function toggleSort(field: 'id' | 'score' | 'metaPages') {
  if (sortField.value === field) {
    if (sortDir.value === 'asc') {
      sortDir.value = 'desc';
    } else {
      sortField.value = null;
      sortDir.value = 'asc';
    }
  } else {
    sortField.value = field;
    sortDir.value = 'asc';
  }
  currentPage.value = 1;
}

function toggleSelect(id: number) {
  const idx = selectedIds.value.indexOf(id);
  if (idx >= 0) {
    selectedIds.value.splice(idx, 1);
  } else {
    selectedIds.value.push(id);
  }
}

function toggleSelectAll() {
  const ids = records.value.map((r) => r.id);
  if (allVisibleSelected.value) {
    selectedIds.value = selectedIds.value.filter((id) => !ids.includes(id));
  } else {
    const newIds = ids.filter((id) => !selectedIds.value.includes(id));
    selectedIds.value.push(...newIds);
  }
}

async function confirmPublish() {
  try {
    await apiBulkPublish(selectedIds.value);
  } catch (err) {
    console.error('[ContentRefreshedPage] bulk publish failed', err);
  } finally {
    showPublishConfirm.value = false;
    selectedIds.value = [];
    refreshAll();
  }
}

async function confirmRedo() {
  const submittedIds = [...selectedIds.value];
  try {
    await apiBulkRedo(submittedIds);
    recordRecreations(submittedIds);
    toast.add({
      severity: 'success',
      summary: 'Recreation queued',
      detail: `${submittedIds.length} ${submittedIds.length === 1 ? 'job has' : 'jobs have'} been sent to the pipeline. Track progress on the In Progress tab.`,
      life: 5000,
    });
  } catch (err) {
    console.error('[ContentRefreshedPage] bulk redo failed', err);
    toast.add({
      severity: 'error',
      summary: 'Recreation failed',
      detail: err instanceof Error ? err.message : 'Could not enqueue these jobs.',
      life: 6000,
    });
  } finally {
    showRedoConfirm.value = false;
    selectedIds.value = [];
    refreshAll();
  }
}

function scoreClass(score: number | null) {
  if (score === null || score === undefined) return 'score--low';
  if (score >= 8.5) return 'score--high';
  if (score >= 7.0) return 'score--mid';
  return 'score--low';
}

function openModal(record: ManualRecord) {
  modalRecord.value = JSON.parse(JSON.stringify(record));
  modalOriginal.value = JSON.parse(JSON.stringify(record));
  recreateInstructions.value = '';
  preRecreateSnapshot.value = null;
  isRecreating.value = false;
  showRecreateConfirm.value = false;
  previewIndex.value = null;
}

function closeModal() {
  modalRecord.value = null;
  modalOriginal.value = null;
  recreateInstructions.value = '';
  preRecreateSnapshot.value = null;
  isRecreating.value = false;
  isSaving.value = false;
  showRecreateConfirm.value = false;
  previewIndex.value = null;
}

const previewIndex = ref<number | null>(null);

function openPreview(index: number) {
  previewIndex.value = index;
}

function closePreview() {
  previewIndex.value = null;
}

function navigatePreview(delta: number) {
  if (previewIndex.value === null || !modalRecord.value) return;
  const total = modalRecord.value.previewThumbnails.length;
  if (total === 0) return;
  previewIndex.value = (previewIndex.value + delta + total) % total;
}

function onPreviewKey(e: KeyboardEvent) {
  if (previewIndex.value === null) return;
  if (e.key === 'Escape') closePreview();
  else if (e.key === 'ArrowLeft') navigatePreview(-1);
  else if (e.key === 'ArrowRight') navigatePreview(1);
}

onMounted(() => {
  window.addEventListener('keydown', onPreviewKey);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onPreviewKey);
});

const isSaving = ref(false);

async function saveModal() {
  if (!modalRecord.value || isSaving.value) return;
  isSaving.value = true;
  const m = modalRecord.value;
  const wasPublished = PUBLISHED_STATUSES.has(m.status);

  let updated: ManualRecord;
  try {
    updated = await updateJob(m.id, {
      title: m.title,
      score: m.score ?? undefined,
      documentOverview: m.documentOverview,
      metaFormat: m.metaFormat,
      metaLanguage: m.metaLanguage,
      metaApplianceType: m.metaApplianceType,
      metaPages: m.metaPages,
      technicalSpecs: m.technicalSpecs,
      compatibleModels: m.compatibleModels,
      whatThisManualHelpsYouFix: m.whatThisManualHelpsYouFix,
      whatsInsideThisManual: m.whatsInsideThisManual,
      troubleshootingGuideQuestions: m.troubleshootingGuideQuestions,
      troubleshootingGuideAnswers: m.troubleshootingGuideAnswers,
    });
  } catch (err) {
    console.error('[ContentRefreshedPage] save failed', err);
    toast.add({
      severity: 'error',
      summary: 'Save failed',
      detail: err instanceof Error ? err.message : 'Could not save changes.',
      life: 5000,
    });
    isSaving.value = false;
    return;
  }

  if (wasPublished) {
    try {
      updated = await republishJob(m.id);
      toast.add({
        severity: 'success',
        summary: 'Saved & republished',
        detail: 'Changes were saved and pushed to WordPress.',
        life: 4000,
      });
    } catch (err) {
      console.error('[ContentRefreshedPage] republish failed', err);
      const idx = records.value.findIndex((r) => r.id === updated.id);
      if (idx >= 0) records.value[idx] = updated;
      toast.add({
        severity: 'warn',
        summary: 'Saved, but republish failed',
        detail:
          err instanceof Error
            ? err.message
            : 'Changes were saved but could not be published to WordPress. Try again from the modal.',
        life: 6000,
      });
      isSaving.value = false;
      return;
    }
  } else {
    toast.add({
      severity: 'success',
      summary: 'Saved',
      detail: 'Changes saved successfully.',
      life: 3000,
    });
  }

  const idx = records.value.findIndex((r) => r.id === updated.id);
  if (idx >= 0) records.value[idx] = updated;
  isSaving.value = false;
  closeModal();
  refreshStats();
}

const hasUnsavedEdits = computed(() => {
  if (!modalRecord.value || !modalOriginal.value) return false;
  return JSON.stringify(modalRecord.value) !== JSON.stringify(modalOriginal.value);
});

function openRecreateConfirm() {
  showRecreateConfirm.value = true;
}

async function confirmRecreate() {
  if (!modalRecord.value) return;
  showRecreateConfirm.value = false;
  preRecreateSnapshot.value = JSON.parse(JSON.stringify(modalRecord.value));
  isRecreating.value = true;

  try {
    const updated = await recreateJob(modalRecord.value.id, recreateInstructions.value);
    recordRecreations([updated.id]);
    modalRecord.value = JSON.parse(JSON.stringify(updated));
    const idx = records.value.findIndex((r) => r.id === updated.id);
    if (idx >= 0) records.value[idx] = updated;
    toast.add({
      severity: 'success',
      summary: 'Recreation queued',
      detail: 'The pipeline will recreate this job\'s content. Track progress on the In Progress tab.',
      life: 5000,
    });
    refreshStats();
  } catch (err) {
    console.error('[ContentRefreshedPage] recreate failed', err);
    preRecreateSnapshot.value = null;
    toast.add({
      severity: 'error',
      summary: 'Recreation failed',
      detail: err instanceof Error ? err.message : 'Could not enqueue this job.',
      life: 6000,
    });
  } finally {
    isRecreating.value = false;
    recreateInstructions.value = '';
  }
}

function addTroubleshootingPair() {
  if (!modalRecord.value) return;
  modalRecord.value.troubleshootingGuideQuestions.push('');
  modalRecord.value.troubleshootingGuideAnswers.push('');
}

function removeTroubleshootingPair(i: number) {
  if (!modalRecord.value) return;
  modalRecord.value.troubleshootingGuideQuestions.splice(i, 1);
  modalRecord.value.troubleshootingGuideAnswers.splice(i, 1);
}

function revertRecreate() {
  if (!preRecreateSnapshot.value) return;
  modalRecord.value = JSON.parse(JSON.stringify(preRecreateSnapshot.value));
  preRecreateSnapshot.value = null;
}
</script>

<style scoped>
.page-layout {
  min-height: 100vh;
  background: var(--color-bg);
}

.page-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 20px 0;
}

/* Tabs */
.tabs-bar {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  border-bottom: 2px solid var(--color-border);
  padding-bottom: 0;
}

.tab-btn {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-muted);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.15s ease;
}

.tab-btn:hover {
  color: var(--color-brand);
}

.tab-btn.active {
  color: var(--color-brand);
  border-bottom-color: var(--color-brand);
}

.tab-count {
  background: var(--color-bg-section);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

.tab-btn.active .tab-count {
  background: var(--color-accent-light);
  color: var(--color-brand);
}

/* Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.toolbar-left {
  display: flex;
  gap: 12px;
  flex: 1;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  font-size: 14px;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  color: var(--color-text);
  background: var(--color-white);
  outline: none;
  transition: border-color 0.15s;
}

.search-input:focus {
  border-color: var(--color-brand);
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  color: var(--color-text);
  background: var(--color-white);
  outline: none;
  cursor: pointer;
}

.filter-select:focus {
  border-color: var(--color-brand);
}

.publish-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  background: var(--color-brand);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.publish-btn:hover {
  background: var(--color-brand-hover);
}

.redo-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  background: #f59e0b;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.redo-btn:hover {
  background: #d97706;
}

/* Table */
.table-container {
  position: relative;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow-x: auto;
  min-height: 120px;
}

.table-container.is-loading {
  pointer-events: none;
}

.table-loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  z-index: 4;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted);
  backdrop-filter: blur(1px);
}

.table-loading-overlay .pi {
  font-size: 18px;
  color: var(--color-brand);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table thead tr {
  background: var(--color-bg-section);
}

.data-table th {
  padding: 10px 12px;
  text-align: left;
  font-weight: 600;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.data-table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--color-border);
  vertical-align: middle;
}

.data-table tbody tr:hover {
  background: var(--color-highlight);
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.col-checkbox {
  width: 40px;
  text-align: center;
}

.col-id {
  width: 60px;
}

.col-score {
  width: 70px;
}

.col-status {
  width: 120px;
}

.col-type {
  width: 140px;
}

.col-pages {
  width: 70px;
}

.col-lang {
  width: 130px;
}

.col-actions {
  width: 120px;
}

.actions-inner {
  display: flex;
  gap: 6px;
  align-items: center;
}

.sortable-th {
  cursor: pointer;
  user-select: none;
}

.sortable-th:hover {
  color: var(--color-brand);
}

.sortable-th .pi {
  font-size: 11px;
  margin-left: 4px;
}

.title-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.issues-badge {
  display: inline-flex;
  align-items: center;
  color: #d97706;
  font-size: 14px;
  flex-shrink: 0;
}

.title-link {
  color: var(--color-brand);
  text-decoration: none;
  font-weight: 500;
}

.title-link:hover {
  text-decoration: underline;
}

.title-meta {
  font-size: 11px;
  color: var(--color-text-muted);
}

.score-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
}

.score--high {
  background: #ecfdf5;
  color: #166534;
}

.score--mid {
  background: #fffbeb;
  color: #92400e;
}

.score--low {
  background: #fef2f2;
  color: #991b1b;
}

.status-tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.status--pending {
  background: #fffbeb;
  color: #92400e;
}

.status--processing {
  background: #eff6ff;
  color: #1d4ed8;
}

.status--content_ready {
  background: #ebf5ff;
  color: #0077e6;
}

.status--content_error {
  background: #fef2f2;
  color: #dc2626;
}

.status--for_review {
  background: #e0f7fa;
  color: #00838f;
}

.status--published {
  background: #ecfdf5;
  color: #20501e;
}

.status--for_publishing {
  background: #f5f3ff;
  color: #6d28d9;
}

.status--failed {
  background: #fef2f2;
  color: #991b1b;
}

.status--error {
  background: #fff7ed;
  color: #c2410c;
}

.status--incorrect_manual {
  background: #f5f3ff;
  color: #6d28d9;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-white);
  color: var(--color-text-muted);
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s;
}

.action-btn:hover {
  color: var(--color-brand);
  border-color: var(--color-brand);
}

.empty-row {
  text-align: center;
  padding: 40px 12px;
  color: var(--color-text-muted);
}

/* Pagination */
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding: 0 4px;
}

.pagination-info {
  font-size: 13px;
  color: var(--color-text-muted);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-white);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.15s;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--color-brand);
  color: var(--color-brand);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-indicator {
  font-size: 13px;
  color: var(--color-text-muted);
  padding: 0 8px;
}

/* Edit Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 37, 64, 0.5);
  z-index: 200;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 24px;
  overflow-y: auto;
}

.modal-panel {
  background: var(--color-white);
  border-radius: 12px;
  width: 100%;
  max-width: 1100px;
  box-shadow: 0 20px 60px rgba(10, 37, 64, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
  flex: 1;
  margin-right: 16px;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-white);
  color: var(--color-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: var(--color-text);
  border-color: var(--color-text-muted);
}

.modal-body {
  padding: 24px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.modal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.modal-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modal-section--content {
  position: relative;
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 16px 0 8px 0;
}

.section-title:first-child {
  margin-top: 0;
}

.section-title--warning {
  color: #dc2626;
}

.field-group {
  margin-bottom: 12px;
}

.field-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
  margin-bottom: 4px;
}

.field-value {
  font-size: 14px;
  color: var(--color-text);
}

.field-link {
  font-size: 13px;
  color: var(--color-brand);
  word-break: break-all;
}

.field-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 13px;
  color: var(--color-text);
  background: var(--color-white);
  outline: none;
}

.field-input:focus {
  border-color: var(--color-brand);
}

.field-input:disabled {
  background: var(--color-bg-section);
  color: var(--color-text-muted);
}

.field-textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 13px;
  color: var(--color-text);
  font-family: inherit;
  resize: vertical;
  outline: none;
}

.field-textarea:focus {
  border-color: var(--color-brand);
}

.field-textarea:disabled {
  background: var(--color-bg-section);
  color: var(--color-text-muted);
}

.field-textarea--warning {
  border-color: #fca5a5;
  background: #fef2f2;
}

.field-row {
  display: flex;
  gap: 12px;
}

.field-row .field-group {
  flex: 1;
}

.thumbnail-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.thumbnail-tile {
  position: relative;
  width: 90px;
  height: 116px;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg-section);
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.thumbnail-tile:hover {
  border-color: var(--color-brand);
  box-shadow: 0 2px 12px rgba(0, 119, 230, 0.15);
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumbnail-index {
  position: absolute;
  top: 4px;
  left: 4px;
  padding: 1px 6px;
  background: rgba(10, 37, 64, 0.7);
  color: #fff;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.thumbnail-empty {
  font-size: 12px;
  color: var(--color-text-muted);
  font-style: italic;
}

/* Preview Image Modal */
.preview-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 37, 64, 0.85);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.preview-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.preview-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: background 0.15s;
}

.preview-close:hover {
  background: #fff;
}

.preview-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: background 0.15s;
}

.preview-nav:hover {
  background: #fff;
}

.preview-nav--prev {
  left: 24px;
}

.preview-nav--next {
  right: 24px;
}

.preview-counter {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 14px;
  background: rgba(10, 37, 64, 0.7);
  color: #fff;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 3px 10px;
  background: var(--color-accent-light);
  color: var(--color-accent);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.specs-list {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  color: var(--color-text);
}

.specs-list li {
  margin-bottom: 4px;
}

.editable-list-item {
  margin-bottom: 6px;
}

.editable-list-row {
  display: flex;
  align-items: stretch;
  gap: 6px;
  margin-bottom: 6px;
}

.editable-list-row .field-input {
  flex: 1 1 auto;
  width: auto;
  min-width: 0;
}

.row-remove-btn {
  flex: 0 0 auto;
  width: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-white);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 13px;
}

.row-remove-btn:hover:not(:disabled) {
  color: #dc2626;
  border-color: #fca5a5;
  background: #fef2f2;
}

.row-remove-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.row-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  padding: 7px 12px;
  background: transparent;
  color: var(--color-brand);
  border: 1px dashed var(--color-border);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.row-add-btn:hover:not(:disabled) {
  border-color: var(--color-brand);
  background: var(--color-accent-light);
}

.row-add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qa-block {
  margin-bottom: 12px;
}

.qa-block .field-label {
  margin-top: 4px;
}

.qa-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.qa-header .row-remove-btn {
  height: 28px;
  width: 28px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid var(--color-border);
}

/* Confirmation Modal */
.confirm-panel {
  background: var(--color-white);
  border-radius: 12px;
  width: 100%;
  max-width: 440px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(10, 37, 64, 0.2);
  text-align: center;
  margin-top: 120px;
}

.confirm-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.confirm-icon .pi {
  font-size: 24px;
}

.confirm-icon--publish {
  background: #ebf5ff;
  color: var(--color-brand);
}

.confirm-icon--redo {
  background: #fffbeb;
  color: #d97706;
}

.confirm-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 8px 0;
}

.confirm-text {
  font-size: 14px;
  color: var(--color-text-muted);
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.btn-primary {
  padding: 8px 20px;
  background: var(--color-brand);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:hover {
  background: var(--color-brand-hover);
}

.btn-warning {
  padding: 8px 20px;
  background: #f59e0b;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-warning:hover {
  background: #d97706;
}

.btn-ghost {
  padding: 8px 20px;
  background: transparent;
  color: var(--color-brand);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn-ghost:hover {
  border-color: var(--color-brand);
}

.btn-primary:disabled,
.btn-ghost:disabled,
.btn-warning:disabled,
.btn-recreate:disabled,
.btn-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Recreate Content section */
.recreate-section {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px dashed var(--color-border);
}

.recreate-help {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.optional {
  color: var(--color-text-muted);
  font-weight: 400;
}

.recreate-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.btn-recreate {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f59e0b;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  margin-left: auto;
}

.btn-recreate:hover:not(:disabled) {
  background: #d97706;
}

.btn-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: transparent;
  color: var(--color-brand);
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
}

.btn-link:hover:not(:disabled) {
  text-decoration: underline;
}

/* Loading overlay on content column */
.content-loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.82);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  z-index: 5;
  border-radius: 8px;
  backdrop-filter: blur(1px);
}

.loading-icon {
  font-size: 28px;
  color: #f59e0b;
}

.loading-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}

.loading-subtext {
  font-size: 12px;
  color: var(--color-text-muted);
}

/* Recreate confirm modal extras */
.confirm-panel--left {
  text-align: left;
}

.confirm-panel--left .confirm-icon {
  margin-left: 0;
}

.confirm-instructions {
  background: var(--color-bg-section);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 16px;
}

.confirm-instructions .field-label {
  margin-bottom: 6px;
}

.confirm-instructions-text {
  font-size: 13px;
  color: var(--color-text);
  white-space: pre-wrap;
  line-height: 1.5;
}

.confirm-warning {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #991b1b;
  line-height: 1.4;
}

.confirm-warning .pi {
  color: #dc2626;
  margin-top: 2px;
  flex-shrink: 0;
}

.confirm-panel--left .confirm-actions {
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .modal-grid {
    grid-template-columns: 1fr;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-left {
    flex-direction: column;
  }
}
</style>
