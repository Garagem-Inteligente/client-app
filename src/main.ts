import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

/* Global background styles */
import './theme/backgrounds.css';

/* Responsive web improvements */
import './theme/responsive.css';
import './theme/responsive-classes.css';

/* Tailwind CSS */
import './style.css';

/* Performance optimization */
import { applyPerformanceMode } from './utils/performance';

/* Capacitor Plugins */
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

const app = createApp(App).use(IonicVue).use(router).use(createPinia());

// Apply performance optimizations
applyPerformanceMode();

// Configurar StatusBar (apenas em plataformas nativas)
if (Capacitor.isNativePlatform()) {
  StatusBar.setStyle({ style: Style.Dark }).catch(() => {
    console.log('StatusBar plugin not available');
  });
  
  StatusBar.setBackgroundColor({ color: '#1F2937' }).catch(() => {
    console.log('StatusBar setBackgroundColor not available');
  });
  
  // Garante que o conteúdo aparece sob a status bar (overlay)
  StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {
    console.log('StatusBar setOverlaysWebView not available');
  });
}

router.isReady().then(() => {
  app.mount('#app');
});
