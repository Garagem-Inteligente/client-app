# Copilot Instructions for AutoCare Landing Page

## Visão Geral
Este projeto é uma landing page para o app AutoCare, construída com Vue 3 (Composition API), TypeScript, Vite e Tailwind CSS. O foco é um design moderno, responsivo e com tema escuro, apresentando recursos do app, lista de espera e comparativos.

## Estrutura e Arquitetura
- **src/components/**: Componentes Vue altamente reutilizáveis (ex: `Button.vue`, `Card.vue`, `LandingHero.vue`, `FeaturesSection.vue`, `TestimonialsSection.vue`, `ComparisonSection.vue`, `WaitlistSection.vue`, `FAQSection.vue`, `FooterSection.vue`).
- **src/views/**: Páginas principais e rotas (ex: `Home.vue`, `Vehicles.vue`, `Maintenance.vue`).
- **src/stores/**: Gerenciamento de estado com Pinia (ex: `auth.ts`, `vehicles.ts`).
- **src/router/**: Definição de rotas SPA.
- **src/firebase/**: Configuração de integração com Firebase.
- **src/style.css**: Estilos globais, sempre usando Tailwind.
- **tailwind.config.js**: Customização de tema, cores e modo escuro.

## Convenções e Padrões
- **Sempre use Composition API** para lógica de componentes.
- **Estilização**: Use classes utilitárias do Tailwind. Não use CSS inline ou arquivos CSS separados.
- **Componentes são "presentational first"**: lógica mínima, foco em props e slots.
- **Reatividade**: Prefira `ref` e `computed` do Vue.
- **Estado global**: Use Pinia, nunca Vuex ou soluções customizadas.
- **Validação de formulários**: Feita nos componentes, sem libs externas.
- **Tema escuro**: Respeite o padrão do Tailwind e o componente `ThemeToggle.vue`.

## Fluxos de Desenvolvimento
- **Instalação**: `npm install`
- **Desenvolvimento**: `npm run dev`
- **Build produção**: `npm run build`
- **Preview local**: `npm run preview`
- **Adição de componente**: Crie em `src/components/`, registre via importação local.
- **Nova página/rota**: Adicione em `src/views/` e registre em `src/router/index.ts`.
- **Estado compartilhado**: Crie store em `src/stores/`.

## Integrações
- **Firebase**: Configuração em `src/firebase/config.ts`.
- **Não há backend custom**: Toda comunicação externa é via Firebase ou APIs públicas.

## Exemplos de Uso
```vue
<!-- Exemplo de uso de componente -->
<Button label="Baixar Agora" primary />
<WaitlistSection />
```

## Dicas para Agentes
- Consulte o `README.md` para detalhes de cada componente.
- Siga a estrutura e padrões acima para garantir consistência.
- Não adicione dependências externas sem necessidade.
- Prefira reutilizar componentes existentes.
- Documente novos componentes com exemplos de uso.

---
Para dúvidas sobre padrões, consulte este arquivo e o `README.md` antes de sugerir mudanças estruturais.
