import { onMounted } from 'vue';

export function useAppTitle(title: string) {
  onMounted(() => {
    document.title = title;
  });
}
