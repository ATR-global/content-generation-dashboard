import { defineCustomElement } from 'vue';
import WidgetElement from './Widget.ce.vue';

const Element = defineCustomElement(WidgetElement);

if (!customElements.get('starter-widget')) {
  customElements.define('starter-widget', Element);
}
