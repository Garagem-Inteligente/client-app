<script setup lang="ts">
import LandingHero from './components/LandingHero.vue';
import FeaturesSection from './components/FeaturesSection.vue';
import TestimonialsSection from './components/TestimonialsSection.vue';
import ComparisonSection from './components/ComparisonSection.vue';
import WaitlistSection from './components/WaitlistSection.vue';
import FAQSection from './components/FAQSection.vue';
import FooterSection from './components/FooterSection.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <LandingHero />
    <FeaturesSection />
    <TestimonialsSection />
    <ComparisonSection />
    <WaitlistSection />
    <FAQSection />
    <FooterSection />
  </div>
</template>
