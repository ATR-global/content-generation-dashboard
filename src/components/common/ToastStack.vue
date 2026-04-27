<template>
  <Teleport to="body">
    <div class="toast-stack">
      <transition-group name="toast" tag="div" class="toast-stack-inner">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="toast"
          :class="'toast--' + t.severity"
          role="status"
        >
          <i class="toast-icon pi" :class="iconFor(t.severity)"></i>
          <div class="toast-body">
            <div class="toast-summary">{{ t.summary }}</div>
            <div v-if="t.detail" class="toast-detail">{{ t.detail }}</div>
          </div>
          <button
            type="button"
            class="toast-close"
            aria-label="Dismiss"
            @click="remove(t.id)"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>
      </transition-group>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast, type ToastSeverity } from '@/composables/useToast';

const { toasts, remove } = useToast();

function iconFor(severity: ToastSeverity): string {
  switch (severity) {
    case 'success':
      return 'pi-check-circle';
    case 'warn':
      return 'pi-exclamation-triangle';
    case 'error':
      return 'pi-times-circle';
    default:
      return 'pi-info-circle';
  }
}
</script>

<style scoped>
.toast-stack {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  pointer-events: none;
}

.toast-stack-inner {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
}

.toast {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 280px;
  max-width: 420px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 24px rgba(10, 37, 64, 0.12);
  font-size: 13px;
  color: var(--color-text);
}

.toast--success {
  border-left: 4px solid #16a34a;
}

.toast--info {
  border-left: 4px solid #0077e6;
}

.toast--warn {
  border-left: 4px solid #f59e0b;
}

.toast--error {
  border-left: 4px solid #dc2626;
}

.toast-icon {
  font-size: 18px;
  margin-top: 1px;
  flex-shrink: 0;
}

.toast--success .toast-icon {
  color: #16a34a;
}

.toast--info .toast-icon {
  color: #0077e6;
}

.toast--warn .toast-icon {
  color: #f59e0b;
}

.toast--error .toast-icon {
  color: #dc2626;
}

.toast-body {
  flex: 1;
  min-width: 0;
}

.toast-summary {
  font-weight: 600;
  color: var(--color-primary);
  line-height: 1.3;
}

.toast-detail {
  margin-top: 2px;
  color: var(--color-text-muted);
  line-height: 1.4;
  word-break: break-word;
}

.toast-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 11px;
}

.toast-close:hover {
  color: var(--color-text);
  background: var(--color-bg-section);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-leave-active {
  position: absolute;
}
</style>
