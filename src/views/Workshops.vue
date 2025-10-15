<script setup lang="ts">
import { onMounted } from 'vue'
import { useWorkshopsStore } from '@/stores/workshops'
import Container from '@/components/Container.vue'
import Card from '@/components/Card.vue'

const store = useWorkshopsStore()

onMounted(async () => {
  await store.fetchWorkshops()
})
</script>

<template>
  <Container>
    <div class="py-8">
      <h1 class="text-2xl font-semibold text-slate-800">Oficinas</h1>
      <p class="text-slate-500 mt-1">Plataforma para gestão de ordens de serviço (epic T007)</p>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        <Card title="Em breve">
          <p class="text-slate-600 text-sm">
            Estamos construindo a base da plataforma de oficinas. Em breve você poderá:
          </p>
          <ul class="mt-3 text-sm text-slate-600 list-disc list-inside">
            <li>Cadastrar oficinas parceiras</li>
            <li>Criar ordens de serviço vinculadas a veículos</li>
            <li>Listar serviços, peças e mão de obra</li>
            <li>Gerar orçamentos e aprovações</li>
          </ul>
        </Card>
      </div>
    </div>
  </Container>
</template>
