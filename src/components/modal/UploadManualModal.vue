<template>
  <div class="modal-overlay" @click.self="onCloseRequest">
    <div class="modal-panel">
      <div class="modal-header">
        <div class="modal-title-block">
          <h2 class="modal-title">Upload Manual</h2>
          <span class="modal-subtitle">{{ jobTitle }}</span>
        </div>
        <button class="modal-close" :disabled="isUploading" @click="onCloseRequest">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <section class="section">
          <h3 class="section-title">Current Manual</h3>
          <div v-if="isLoading" class="status-row">
            <i class="pi pi-spin pi-spinner"></i>
            <span>Loading current manual…</span>
          </div>
          <div v-else-if="loadError" class="status-row status-row--error">
            <i class="pi pi-exclamation-triangle"></i>
            <span>{{ loadError }}</span>
          </div>
          <div v-else-if="currentManual" class="current-manual">
            <i class="pi pi-file-pdf current-manual-icon"></i>
            <div class="current-manual-info">
              <a
                :href="currentManual.file"
                target="_blank"
                rel="noopener noreferrer"
                class="current-manual-link"
              >
                {{ currentManual.fileName || currentManual.name || currentManual.file }}
              </a>
              <span class="current-manual-hint">
                Hosted on DigitalOcean Spaces. Uploading a new file will replace this.
              </span>
            </div>
          </div>
          <div v-else class="status-row status-row--muted">
            <i class="pi pi-info-circle"></i>
            <span>No manual is currently uploaded for this product.</span>
          </div>
        </section>

        <section class="section">
          <h3 class="section-title">Manual Path (used by refresh)</h3>
          <p class="section-hint">
            The content refresh pipeline reads this path directly. Uploading a new
            file updates it automatically, or set/correct it manually below.
          </p>
          <div class="path-row">
            <input
              v-model="manualPath"
              type="text"
              class="path-input"
              placeholder="/aum/manual-file.pdf or full Spaces URL"
              spellcheck="false"
              :disabled="isUploading || isSavingPath || isLoading"
            />
            <button
              type="button"
              class="btn-secondary"
              :disabled="!canSavePath"
              @click="onSavePath"
            >
              <i v-if="isSavingPath" class="pi pi-spin pi-spinner"></i>
              <i v-else class="pi pi-save"></i>
              {{ isSavingPath ? 'Saving…' : 'Save path' }}
            </button>
          </div>
        </section>

        <section class="section">
          <h3 class="section-title">Upload New Manual (PDF only)</h3>
          <div
            class="dropzone"
            :class="{
              'dropzone--active': isDragging,
              'dropzone--has-file': !!selectedFile,
              'dropzone--disabled': isUploading,
            }"
            @dragover.prevent="onDragOver"
            @dragleave.prevent="onDragLeave"
            @drop.prevent="onDrop"
            @click="!isUploading && fileInputRef?.click()"
          >
            <input
              ref="fileInputRef"
              type="file"
              accept="application/pdf,.pdf"
              class="dropzone-input"
              :disabled="isUploading"
              @change="onFileInputChange"
            />
            <template v-if="!selectedFile">
              <i class="pi pi-cloud-upload dropzone-icon"></i>
              <p class="dropzone-text">
                <strong>Click to choose</strong> or drag and drop a PDF here
              </p>
              <p class="dropzone-hint">PDF files only</p>
            </template>
            <template v-else>
              <i class="pi pi-file-pdf dropzone-icon dropzone-icon--file"></i>
              <p class="dropzone-text">{{ selectedFile.name }}</p>
              <p class="dropzone-hint">{{ formatFileSize(selectedFile.size) }}</p>
              <button
                type="button"
                class="dropzone-clear"
                :disabled="isUploading"
                @click.stop="clearSelectedFile"
              >
                <i class="pi pi-times"></i>
                Remove
              </button>
            </template>
          </div>
          <div v-if="fileError" class="file-error">
            <i class="pi pi-exclamation-circle"></i>
            <span>{{ fileError }}</span>
          </div>
        </section>
      </div>

      <div class="modal-footer">
        <button class="btn-ghost" :disabled="isUploading" @click="onCloseRequest">
          Cancel
        </button>
        <button
          class="btn-primary"
          :disabled="!canSave"
          @click="onSave"
        >
          <i v-if="isUploading" class="pi pi-spin pi-spinner"></i>
          <i v-else class="pi pi-cloud-upload"></i>
          {{ isUploading ? 'Uploading…' : 'Save' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useToast } from '@/composables/useToast';
import {
  getCurrentManual,
  uploadManual,
  setManualPath,
  type ManualFileInfo,
} from '@/services/contentRefreshJobs';

const props = defineProps<{
  jobId: number;
  jobTitle: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'uploaded', manual: ManualFileInfo): void;
}>();

const toast = useToast();

const isLoading = ref(true);
const loadError = ref<string | null>(null);
const currentManual = ref<ManualFileInfo | null>(null);

const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const fileError = ref<string | null>(null);
const isDragging = ref(false);
const isUploading = ref(false);

// manual_path is what the refresh pipeline actually reads (it has no WordPress
// fallback), so expose it as an editable field. It is pre-filled on open,
// auto-updated after a file upload, and can also be saved on its own.
const manualPath = ref('');
const savedManualPath = ref('');
const isSavingPath = ref(false);

const canSave = computed(
  () => !isUploading.value && !!selectedFile.value && !fileError.value,
);

const trimmedManualPath = computed(() => manualPath.value.trim());
const canSavePath = computed(
  () =>
    !isUploading.value &&
    !isSavingPath.value &&
    trimmedManualPath.value.length > 0 &&
    trimmedManualPath.value !== savedManualPath.value,
);

onMounted(async () => {
  isLoading.value = true;
  try {
    const res = await getCurrentManual(props.jobId);
    currentManual.value = res.manual;
    manualPath.value = res.manualPath ?? '';
    savedManualPath.value = res.manualPath ?? '';
  } catch (err) {
    loadError.value =
      err instanceof Error ? err.message : 'Failed to load current manual.';
  } finally {
    isLoading.value = false;
  }
});

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function validateFile(file: File): string | null {
  const isPdfMime = file.type === 'application/pdf';
  const isPdfExt = file.name.toLowerCase().endsWith('.pdf');
  if (!isPdfMime && !isPdfExt) {
    return 'Only PDF files are accepted.';
  }
  if (file.size === 0) {
    return 'Selected file is empty.';
  }
  return null;
}

function setFile(file: File | null) {
  if (!file) {
    selectedFile.value = null;
    fileError.value = null;
    return;
  }
  const error = validateFile(file);
  if (error) {
    fileError.value = error;
    selectedFile.value = null;
    return;
  }
  fileError.value = null;
  selectedFile.value = file;
}

function clearSelectedFile() {
  selectedFile.value = null;
  fileError.value = null;
  if (fileInputRef.value) fileInputRef.value.value = '';
}

function onFileInputChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0] ?? null;
  setFile(file);
}

function onDragOver() {
  if (isUploading.value) return;
  isDragging.value = true;
}

function onDragLeave() {
  isDragging.value = false;
}

function onDrop(e: DragEvent) {
  isDragging.value = false;
  if (isUploading.value) return;
  const file = e.dataTransfer?.files?.[0] ?? null;
  setFile(file);
}

function onCloseRequest() {
  if (isUploading.value || isSavingPath.value) return;
  emit('close');
}

async function onSave() {
  if (!selectedFile.value || isUploading.value) return;
  isUploading.value = true;
  try {
    const res = await uploadManual(props.jobId, selectedFile.value);
    if (res.manual) {
      currentManual.value = res.manual;
      emit('uploaded', res.manual);
    }
    if (res.manualPath) {
      manualPath.value = res.manualPath;
      savedManualPath.value = res.manualPath;
    }
    toast.add({
      severity: 'success',
      summary: 'Manual uploaded',
      detail:
        'The new manual was saved, the WordPress product was updated, and the manual path now points to it.',
      life: 4000,
    });
    emit('close');
  } catch (err) {
    console.error('[UploadManualModal] upload failed', err);
    toast.add({
      severity: 'error',
      summary: 'Upload failed',
      detail: err instanceof Error ? err.message : 'Could not upload the new manual.',
      life: 6000,
    });
  } finally {
    isUploading.value = false;
  }
}

async function onSavePath() {
  if (!canSavePath.value) return;
  isSavingPath.value = true;
  try {
    const res = await setManualPath(props.jobId, trimmedManualPath.value);
    manualPath.value = res.manualPath;
    savedManualPath.value = res.manualPath;
    toast.add({
      severity: 'success',
      summary: 'Manual path saved',
      detail: 'The refresh pipeline will use this path on the next run.',
      life: 4000,
    });
  } catch (err) {
    console.error('[UploadManualModal] save manual path failed', err);
    toast.add({
      severity: 'error',
      summary: 'Could not save manual path',
      detail: err instanceof Error ? err.message : 'Failed to save the manual path.',
      life: 6000,
    });
  } finally {
    isSavingPath.value = false;
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 37, 64, 0.5);
  z-index: 220;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 60px 24px 24px;
  overflow-y: auto;
}

.modal-panel {
  background: var(--color-white);
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 20px 60px rgba(10, 37, 64, 0.2);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
  gap: 16px;
}

.modal-title-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
}

.modal-subtitle {
  font-size: 12px;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  flex-shrink: 0;
}

.modal-close:hover:not(:disabled) {
  color: var(--color-text);
  border-color: var(--color-text-muted);
}

.modal-close:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.modal-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.section-hint {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.4;
}

.path-row {
  display: flex;
  align-items: stretch;
  gap: 8px;
}

.path-input {
  flex: 1;
  min-width: 0;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 13px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  color: var(--color-text);
  background: var(--color-white);
}

.path-input:focus {
  outline: none;
  border-color: var(--color-brand);
}

.path-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--color-bg-section);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  white-space: nowrap;
  background: var(--color-white);
  color: var(--color-brand);
  border: 1px solid var(--color-brand);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-accent-light);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: var(--color-border);
  color: var(--color-text-muted);
}

.status-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: var(--color-bg-section);
  border-radius: 8px;
  font-size: 13px;
  color: var(--color-text-muted);
}

.status-row--muted {
  font-style: italic;
}

.status-row--error {
  background: #fef2f2;
  color: #991b1b;
}

.current-manual {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-section);
}

.current-manual-icon {
  font-size: 24px;
  color: #dc2626;
  flex-shrink: 0;
}

.current-manual-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
}

.current-manual-link {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-brand);
  text-decoration: none;
  word-break: break-all;
}

.current-manual-link:hover {
  text-decoration: underline;
}

.current-manual-hint {
  font-size: 12px;
  color: var(--color-text-muted);
}

.dropzone {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 28px 20px;
  border: 2px dashed var(--color-border);
  border-radius: 10px;
  background: var(--color-bg-section);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  text-align: center;
}

.dropzone:hover:not(.dropzone--disabled) {
  border-color: var(--color-brand);
  background: var(--color-accent-light);
}

.dropzone--active {
  border-color: var(--color-brand);
  background: var(--color-accent-light);
}

.dropzone--has-file {
  border-style: solid;
  border-color: #166534;
  background: #ecfdf5;
}

.dropzone--disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.dropzone-input {
  display: none;
}

.dropzone-icon {
  font-size: 32px;
  color: var(--color-brand);
}

.dropzone-icon--file {
  color: #166534;
}

.dropzone-text {
  font-size: 14px;
  color: var(--color-text);
  margin: 0;
}

.dropzone-text strong {
  color: var(--color-brand);
}

.dropzone-hint {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 0;
}

.dropzone-clear {
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--color-white);
  color: #b91c1c;
  border: 1px solid #fca5a5;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}

.dropzone-clear:hover:not(:disabled) {
  background: #fef2f2;
}

.dropzone-clear:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.file-error {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #991b1b;
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: 6px;
  padding: 8px 10px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid var(--color-border);
}

.btn-primary {
  display: inline-flex;
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
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-brand-hover);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.btn-ghost:hover:not(:disabled) {
  border-color: var(--color-brand);
}

.btn-ghost:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
