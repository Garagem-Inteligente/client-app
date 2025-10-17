import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.garageminteligente.app',
  appName: 'Garagem Inteligente',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
