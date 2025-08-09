<script setup lang="ts">
import { ref } from 'vue';
import LandingHero from './components/LandingHero.vue';
import FeaturesSection from './components/FeaturesSection.vue';
import TestimonialsSection from './components/TestimonialsSection.vue';
import ComparisonSection from './components/ComparisonSection.vue';
import WaitlistSection from './components/WaitlistSection.vue';
import FAQSection from './components/FAQSection.vue';
import FooterSection from './components/FooterSection.vue';
import FeaturesPage from './components/FeaturesPage.vue';
import PricingPage from './components/PricingPage.vue';

const currentPage = ref('home');

const navigateTo = (page: string) => {
  currentPage.value = page;
  // Scroll para o topo quando navegar para uma nova página
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Home Page -->
    <div v-if="currentPage === 'home'">
      <LandingHero @navigate="navigateTo" />
      <FeaturesSection @navigate="navigateTo" />
      <TestimonialsSection />
      <ComparisonSection @navigate="navigateTo" />
      <WaitlistSection />
      <FAQSection />
      <FooterSection @navigate="navigateTo" />
    </div>
    
    <!-- Features Page -->
    <div v-else-if="currentPage === 'features'">
      <FeaturesPage @navigate="navigateTo" />
      <FooterSection @navigate="navigateTo" />
    </div>
    
    <!-- Pricing Page -->
    <div v-else-if="currentPage === 'pricing'">
      <PricingPage @navigate="navigateTo" />
      <FooterSection @navigate="navigateTo" />
    </div>
  </div>
</template>
