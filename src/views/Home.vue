<script setup lang="ts">
import { useRouter } from 'vue-router'
import LandingHero from '../components/LandingHero.vue'
import FeaturesSection from '../components/FeaturesSection.vue'
import TestimonialsSection from '../components/TestimonialsSection.vue'
import ComparisonSection from '../components/ComparisonSection.vue'
import WaitlistSection from '../components/WaitlistSection.vue'
import FAQSection from '../components/FAQSection.vue'
import FooterSection from '../components/FooterSection.vue'

const router = useRouter()

const navigateTo = (page: string) => {
  router.push(`/${page === 'home' ? '' : page}`)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div>
    <LandingHero @navigate="navigateTo" />
    <FeaturesSection @navigate="navigateTo" />
    <TestimonialsSection />
    <ComparisonSection @navigate="navigateTo" />
    <WaitlistSection />
    <FAQSection />
    <FooterSection @navigate="navigateTo" />
  </div>
</template>