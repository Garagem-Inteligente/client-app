import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.garageminteligente.app',
  appName: 'Garagem Inteligente',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'http://192.168.2.113:5173',
    cleartext: true
  },
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com']
    }
  }
};

export default config;
