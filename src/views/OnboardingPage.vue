<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- Background -->
      <div class="onboarding-background">
        <div class="gradient-overlay"></div>
        <div class="pattern-overlay"></div>
      </div>

      <!-- Skip Button -->
      <button v-if="!isLastSlide" class="skip-button" @click="skipOnboarding">Pular</button>

      <!-- Swiper Container -->
      <swiper
        :modules="modules"
        :pagination="{ clickable: true }"
        :speed="400"
        class="onboarding-swiper"
        @slideChange="onSlideChange"
        @swiper="setSwiper"
      >
        <!-- Slide 1: Bem-vindo -->
        <swiper-slide>
          <div class="slide-content">
            <div class="slide-icon welcome-icon">
              <ion-icon :icon="carSportOutline"></ion-icon>
            </div>
            <h1 class="slide-title">Bem-vindo ao<br />Garagem Inteligente</h1>
            <p class="slide-description">
              Seu assistente pessoal para gerenciar todos os seus veículos em um só lugar
            </p>
            <div class="slide-illustration">🚗 🏍️ 🚙</div>
          </div>
        </swiper-slide>

        <!-- Slide 2: Gerenciamento -->
        <swiper-slide>
          <div class="slide-content">
            <div class="slide-icon manage-icon">
              <ion-icon :icon="clipboardOutline"></ion-icon>
            </div>
            <h2 class="slide-title">Gerencie com<br />Facilidade</h2>
            <p class="slide-description">
              Cadastre seus veículos, acompanhe quilometragem e mantenha tudo organizado
            </p>
            <div class="feature-list">
              <div class="feature-item">
                <ion-icon :icon="checkmarkCircle"></ion-icon>
                <span>Cadastro rápido de veículos</span>
              </div>
              <div class="feature-item">
                <ion-icon :icon="checkmarkCircle"></ion-icon>
                <span>Controle de quilometragem</span>
              </div>
              <div class="feature-item">
                <ion-icon :icon="checkmarkCircle"></ion-icon>
                <span>Histórico completo</span>
              </div>
            </div>
          </div>
        </swiper-slide>

        <!-- Slide 3: Manutenções -->
        <swiper-slide>
          <div class="slide-content">
            <div class="slide-icon maintenance-icon">
              <ion-icon :icon="constructOutline"></ion-icon>
            </div>
            <h2 class="slide-title">Manutenções<br />Inteligentes</h2>
            <p class="slide-description">
              Registre todas as manutenções e receba alertas antes que algo quebre
            </p>
            <div class="feature-list">
              <div class="feature-item">
                <ion-icon :icon="checkmarkCircle"></ion-icon>
                <span>Histórico de manutenções</span>
              </div>
              <div class="feature-item">
                <ion-icon :icon="checkmarkCircle"></ion-icon>
                <span>Alertas de vencimento</span>
              </div>
              <div class="feature-item">
                <ion-icon :icon="checkmarkCircle"></ion-icon>
                <span>Controle de custos</span>
              </div>
            </div>
          </div>
        </swiper-slide>

        <!-- Slide 4: Estatísticas -->
        <swiper-slide>
          <div class="slide-content">
            <div class="slide-icon stats-icon">
              <ion-icon :icon="statsChartOutline"></ion-icon>
            </div>
            <h2 class="slide-title">Dados que<br />Importam</h2>
            <p class="slide-description">
              Visualize gráficos detalhados e tome decisões mais inteligentes
            </p>
            <div class="feature-list">
              <div class="feature-item">
                <ion-icon :icon="checkmarkCircle"></ion-icon>
                <span>Gráficos de gastos</span>
              </div>
              <div class="feature-item">
                <ion-icon :icon="checkmarkCircle"></ion-icon>
                <span>Análise de manutenções</span>
              </div>
              <div class="feature-item">
                <ion-icon :icon="checkmarkCircle"></ion-icon>
                <span>Relatórios detalhados</span>
              </div>
            </div>
          </div>
        </swiper-slide>

        <!-- Slide 5: Começar -->
        <swiper-slide>
          <div class="slide-content final-slide">
            <div class="slide-icon start-icon">
              <ion-icon :icon="rocketOutline"></ion-icon>
            </div>
            <h2 class="slide-title">Pronto para<br />Começar?</h2>
            <p class="slide-description">
              Junte-se a milhares de usuários que já organizam seus veículos de forma inteligente
            </p>

            <div class="cta-buttons">
              <button class="btn-primary" @click="goToRegister">
                <ion-icon :icon="personAddOutline"></ion-icon>
                Criar Conta Grátis
              </button>
              <button class="btn-secondary" @click="goToLogin">
                <ion-icon :icon="logInOutline"></ion-icon>
                Já tenho conta
              </button>
            </div>

            <p class="privacy-text">
              Seus dados estão seguros. Leia nossa
              <a href="/privacy-policy" @click.prevent="openPrivacyPolicy"
                >Política de Privacidade</a
              >
            </p>
          </div>
        </swiper-slide>
      </swiper>

      <!-- Progress Indicator -->
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progressWidth}%` }"></div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { IonPage, IonContent, IonIcon } from '@ionic/vue';
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Pagination } from 'swiper/modules';
  import {
    carSportOutline,
    clipboardOutline,
    constructOutline,
    statsChartOutline,
    rocketOutline,
    checkmarkCircle,
    personAddOutline,
    logInOutline,
  } from 'ionicons/icons';

  // Swiper styles
  import 'swiper/css';
  import 'swiper/css/pagination';

  const router = useRouter();
  const modules = [Pagination];

  // State
  const currentSlide = ref(0);
  const totalSlides = 5;
  const swiperInstance = ref<{ activeIndex: number } | null>(null);

  // Computed
  const isLastSlide = computed(() => currentSlide.value === totalSlides - 1);
  const progressWidth = computed(() => ((currentSlide.value + 1) / totalSlides) * 100);

  // Methods
  const setSwiper = (swiper: { activeIndex: number }) => {
    swiperInstance.value = swiper;
  };

  const onSlideChange = () => {
    if (swiperInstance.value) {
      currentSlide.value = swiperInstance.value.activeIndex;
    }
  };

  const skipOnboarding = () => {
    // Marca como visualizado
    localStorage.setItem('onboardingCompleted', 'true');
    router.replace('/login');
  };

  const goToLogin = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    router.replace('/login');
  };

  const goToRegister = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    router.replace('/register');
  };

  const openPrivacyPolicy = () => {
    router.push('/privacy-policy');
  };
</script>

<style scoped>
  ion-page {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    height: 100vh;
    min-height: 100vh;
    overflow: hidden;
  }

  ion-content {
    --background: transparent;
    --overflow: hidden;
    height: 100vh;
    min-height: 100vh;
    overflow: hidden;
  }

  ion-content::part(scroll) {
    overflow: hidden !important;
  }

  /* Background */
  .onboarding-background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    z-index: 0;
  }

  .gradient-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(59, 130, 246, 0.1) 0%,
      rgba(16, 185, 129, 0.05) 50%,
      rgba(139, 92, 246, 0.1) 100%
    );
  }

  .pattern-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(
        circle at 20% 50%,
        rgba(59, 130, 246, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
  }

  /* Skip Button */
  .skip-button {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 100;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 8px 16px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .skip-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  /* Swiper */
  .onboarding-swiper {
    height: 100vh;
    max-height: 100vh;
    overflow: hidden;
    --swiper-pagination-color: #3b82f6;
    --swiper-pagination-bullet-inactive-color: rgba(255, 255, 255, 0.3);
    --swiper-pagination-bullet-inactive-opacity: 1;
  }

  /* Slide Content */
  .slide-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    max-height: 100vh;
    padding: 40px 32px 100px;
    text-align: center;
    position: relative;
    z-index: 1;
    overflow: hidden;
    box-sizing: border-box;
  }

  /* Slide Icon */
  .slide-icon {
    width: 100px;
    height: 100px;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
  }

  .slide-icon::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 30px;
    padding: 2px;
    background: linear-gradient(135deg, #3b82f6, #10b981);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
  }

  .slide-icon ion-icon {
    font-size: 52px;
    color: white;
    z-index: 1;
  }

  .welcome-icon {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(16, 185, 129, 0.2));
  }

  .manage-icon {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.2));
  }

  .maintenance-icon {
    background: linear-gradient(135deg, rgba(251, 146, 60, 0.2), rgba(239, 68, 68, 0.2));
  }

  .stats-icon {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2));
  }

  .start-icon {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3));
  }

  /* Slide Title */
  .slide-title {
    font-size: 28px;
    font-weight: 700;
    color: white;
    margin: 0 0 12px 0;
    line-height: 1.2;
  }

  /* Slide Description */
  .slide-description {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.5;
    margin: 0 0 24px 0;
    max-width: 400px;
  }

  /* Slide Illustration */
  .slide-illustration {
    font-size: 40px;
    margin-top: 16px;
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  /* Feature List */
  .feature-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
    width: 100%;
    max-width: 350px;
    margin-top: 16px;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 10px 14px;
    width: 100%;
    text-align: left;
  }

  .feature-item ion-icon {
    font-size: 20px;
    color: #10b981;
    flex-shrink: 0;
  }

  .feature-item span {
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    font-weight: 500;
  }

  /* Final Slide */
  .final-slide {
    padding-bottom: 100px;
  }

  /* CTA Buttons */
  .cta-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 350px;
    margin-top: 20px;
  }

  .btn-primary,
  .btn-secondary {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 28px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    width: 100%;
  }

  .btn-primary {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(59, 130, 246, 0.5);
  }

  .btn-primary ion-icon {
    font-size: 20px;
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }

  .btn-secondary ion-icon {
    font-size: 20px;
  }

  /* Privacy Text */
  .privacy-text {
    margin-top: 24px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    max-width: 350px;
  }

  .privacy-text a {
    color: #3b82f6;
    text-decoration: underline;
  }

  /* Progress Bar */
  .progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    z-index: 100;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #10b981);
    transition: width 0.3s ease;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .slide-title {
      font-size: 28px;
    }

    .slide-icon {
      width: 100px;
      height: 100px;
    }

    .slide-icon ion-icon {
      font-size: 56px;
    }
  }

  /* Desktop - Garantir altura completa */
  @media (min-width: 1024px) {
    ion-page {
      height: 100vh;
      min-height: 100vh;
      max-height: 100vh;
      overflow: hidden;
    }

    ion-content {
      height: 100vh;
      min-height: 100vh;
      max-height: 100vh;
    }

    .onboarding-background {
      height: 100vh;
      min-height: 100vh;
      max-height: 100vh;
    }

    .onboarding-swiper {
      height: 100vh;
      max-height: 100vh;
      overflow: hidden;
    }

    .slide-content {
      padding: 60px 64px 120px;
      max-width: 1200px;
      margin: 0 auto;
      height: 100vh;
      max-height: 100vh;
      overflow: hidden;
    }

    .slide-title {
      font-size: 42px;
      margin-bottom: 16px;
    }

    .slide-description {
      font-size: 18px;
      max-width: 600px;
    }

    .slide-icon {
      width: 120px;
      height: 120px;
      margin-bottom: 24px;
    }

    .slide-icon ion-icon {
      font-size: 72px;
    }

    .feature-list {
      max-width: 500px;
      margin: 0 auto;
    }

    .feature-item {
      font-size: 18px;
    }

    .cta-buttons {
      gap: 24px;
    }

    .cta-button {
      min-width: 200px;
      height: 60px;
      font-size: 18px;
    }
  }
</style>
