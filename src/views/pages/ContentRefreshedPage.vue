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
            <span class="tab-count">{{ unpublishedRecords.length }}</span>
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'published' }"
            @click="activeTab = 'published'"
          >
            Published
            <span class="tab-count">{{ publishedRecords.length }}</span>
          </button>
        </div>

        <!-- Toolbar: Search + Filter + Publish -->
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
            <select v-model="statusFilter" class="filter-select">
              <option value="">All Statuses</option>
              <option v-for="s in allStatuses" :key="s" :value="s">
                {{ statusLabels[s] }}
              </option>
            </select>
          </div>
          <div class="toolbar-right">
            <button
              v-if="activeTab === 'unpublished' && selectedIds.length > 0"
              class="publish-btn"
              @click="handlePublish"
            >
              <i class="pi pi-upload"></i>
              Publish Selected ({{ selectedIds.length }})
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th v-if="activeTab === 'unpublished'" class="col-checkbox">
                  <input
                    type="checkbox"
                    :checked="allVisibleSelected"
                    @change="toggleSelectAll"
                  />
                </th>
                <th class="col-id">ID</th>
                <th class="col-title">Title</th>
                <th class="col-score">Score</th>
                <th class="col-status">Status</th>
                <th class="col-type">Appliance Type</th>
                <th class="col-pages">Pages</th>
                <th class="col-lang">Language</th>
                <th class="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in paginatedRecords" :key="row.id">
                <td v-if="activeTab === 'unpublished'" class="col-checkbox">
                  <input
                    type="checkbox"
                    :checked="selectedIds.includes(row.id)"
                    @change="toggleSelect(row.id)"
                  />
                </td>
                <td class="col-id">{{ row.id }}</td>
                <td class="col-title">
                  <div class="title-cell">
                    <a :href="row.pageUrl" target="_blank" class="title-link">
                      {{ row.title }}
                    </a>
                    <span class="title-meta">WP #{{ row.wpPageId }}</span>
                  </div>
                </td>
                <td class="col-score">
                  <span class="score-badge" :class="scoreClass(row.score)">
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
                  <button class="action-btn" title="View / Edit" @click="openModal(row)">
                    <i class="pi pi-eye"></i>
                  </button>
                  <a
                    :href="row.wpPostUrl"
                    target="_blank"
                    class="action-btn"
                    title="Open in WordPress"
                  >
                    <i class="pi pi-external-link"></i>
                  </a>
                </td>
              </tr>
              <tr v-if="paginatedRecords.length === 0">
                <td :colspan="activeTab === 'unpublished' ? 9 : 8" class="empty-row">
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
            {{ filteredRecords.length }}
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
                    :disabled="activeTab === 'published'"
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
              <div class="thumbnail-row">
                <div
                  v-for="(thumb, i) in modalRecord.previewThumbnails"
                  :key="i"
                  class="thumbnail-placeholder"
                >
                  <i class="pi pi-image"></i>
                  <span>Preview {{ i + 1 }}</span>
                </div>
              </div>

              <h3 class="section-title">Compatible Models</h3>
              <div class="tags-row">
                <span
                  v-for="model in modalRecord.compatibleModels"
                  :key="model"
                  class="tag"
                >
                  {{ model }}
                </span>
              </div>

              <h3 class="section-title">Technical Specs</h3>
              <ul class="specs-list">
                <li v-for="spec in modalRecord.technicalSpecs" :key="spec">{{ spec }}</li>
              </ul>
            </div>

            <!-- Right column: content fields -->
            <div class="modal-section">
              <h3 class="section-title">Document Overview</h3>
              <textarea
                v-model="modalRecord.documentOverview"
                class="field-textarea"
                rows="4"
                :disabled="activeTab === 'published'"
              ></textarea>

              <h3 class="section-title">Source Integrity</h3>
              <textarea
                v-model="modalRecord.sourceIntegrity"
                class="field-textarea"
                rows="3"
                :disabled="activeTab === 'published'"
              ></textarea>

              <h3 class="section-title">What This Manual Helps You Fix</h3>
              <div
                v-for="(item, i) in modalRecord.whatThisManualHelpsYouFix"
                :key="'fix-' + i"
                class="editable-list-item"
              >
                <input
                  v-model="modalRecord.whatThisManualHelpsYouFix[i]"
                  class="field-input"
                  :disabled="activeTab === 'published'"
                />
              </div>

              <h3 class="section-title">What's Inside This Manual</h3>
              <div
                v-for="(item, i) in modalRecord.whatsInsideThisManual"
                :key="'inside-' + i"
                class="editable-list-item"
              >
                <input
                  v-model="modalRecord.whatsInsideThisManual[i]"
                  class="field-input"
                  :disabled="activeTab === 'published'"
                />
              </div>

              <h3 class="section-title">Troubleshooting Q&A</h3>
              <div
                v-for="(q, i) in modalRecord.troubleshootingGuideQuestions"
                :key="'qa-' + i"
                class="qa-block"
              >
                <label class="field-label">Q{{ i + 1 }}:</label>
                <input
                  v-model="modalRecord.troubleshootingGuideQuestions[i]"
                  class="field-input"
                  :disabled="activeTab === 'published'"
                />
                <label class="field-label">A{{ i + 1 }}:</label>
                <textarea
                  v-model="modalRecord.troubleshootingGuideAnswers[i]"
                  class="field-textarea"
                  rows="3"
                  :disabled="activeTab === 'published'"
                ></textarea>
              </div>

              <template v-if="modalRecord.contentIssuesRecommendations">
                <h3 class="section-title section-title--warning">
                  Content Issues / Recommendations
                </h3>
                <textarea
                  v-model="modalRecord.contentIssuesRecommendations"
                  class="field-textarea field-textarea--warning"
                  rows="6"
                  :disabled="activeTab === 'published'"
                ></textarea>
              </template>
            </div>
          </div>
        </div>
        <div class="modal-footer" v-if="activeTab === 'unpublished'">
          <button class="btn-ghost" @click="closeModal">Cancel</button>
          <button class="btn-primary" @click="saveModal">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import {
  sampleManuals,
  allStatuses,
  statusLabels,
  type ManualRecord,
} from '@/data/sampleData';

const activeTab = ref<'unpublished' | 'published'>('unpublished');
const searchQuery = ref('');
const statusFilter = ref('');
const selectedIds = ref<number[]>([]);
const currentPage = ref(1);
const pageSize = 50;
const modalRecord = ref<ManualRecord | null>(null);

// Split records: done = published, everything else = unpublished
const unpublishedRecords = computed(() =>
  sampleManuals.filter((r) => r.status !== 'done'),
);
const publishedRecords = computed(() =>
  sampleManuals.filter((r) => r.status === 'done'),
);

const activeRecords = computed(() =>
  activeTab.value === 'unpublished' ? unpublishedRecords.value : publishedRecords.value,
);

const filteredRecords = computed(() => {
  let records = activeRecords.value;

  if (statusFilter.value) {
    records = records.filter((r) => r.status === statusFilter.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    records = records.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.pageUrl.toLowerCase().includes(q) ||
        String(r.id).includes(q) ||
        String(r.wpPageId).includes(q),
    );
  }

  return records;
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRecords.value.length / pageSize)));
const paginationStart = computed(() => (currentPage.value - 1) * pageSize);
const paginationEnd = computed(() =>
  Math.min(paginationStart.value + pageSize, filteredRecords.value.length),
);
const paginatedRecords = computed(() =>
  filteredRecords.value.slice(paginationStart.value, paginationEnd.value),
);

const allVisibleSelected = computed(() => {
  const ids = paginatedRecords.value.map((r) => r.id);
  return ids.length > 0 && ids.every((id) => selectedIds.value.includes(id));
});

// Reset page and selection on tab/filter change
watch([activeTab, searchQuery, statusFilter], () => {
  currentPage.value = 1;
  selectedIds.value = [];
});

function toggleSelect(id: number) {
  const idx = selectedIds.value.indexOf(id);
  if (idx >= 0) {
    selectedIds.value.splice(idx, 1);
  } else {
    selectedIds.value.push(id);
  }
}

function toggleSelectAll() {
  const ids = paginatedRecords.value.map((r) => r.id);
  if (allVisibleSelected.value) {
    selectedIds.value = selectedIds.value.filter((id) => !ids.includes(id));
  } else {
    const newIds = ids.filter((id) => !selectedIds.value.includes(id));
    selectedIds.value.push(...newIds);
  }
}

function handlePublish() {
  // No-op for now; would call backend API
}

function scoreClass(score: number) {
  if (score >= 8.5) return 'score--high';
  if (score >= 7.0) return 'score--mid';
  return 'score--low';
}

function openModal(record: ManualRecord) {
  // Deep clone to allow editing without mutating source
  modalRecord.value = JSON.parse(JSON.stringify(record));
}

function closeModal() {
  modalRecord.value = null;
}

function saveModal() {
  // No-op for now; would persist changes to backend
  closeModal();
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

/* Table */
.table-container {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow-x: auto;
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
  width: 90px;
}

.title-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
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

.status--done {
  background: #ecfdf5;
  color: #20501e;
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

/* Modal */
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
}

.thumbnail-placeholder {
  width: 80px;
  height: 100px;
  border: 1px dashed var(--color-border);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--color-text-muted);
  font-size: 11px;
}

.thumbnail-placeholder .pi {
  font-size: 20px;
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

.qa-block {
  margin-bottom: 12px;
}

.qa-block .field-label {
  margin-top: 4px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid var(--color-border);
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
