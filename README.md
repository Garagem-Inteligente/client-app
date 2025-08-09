# AutoCare - Landing Page

Este é um projeto de landing page para um aplicativo de controle de manutenção de carros, desenvolvido com Vue 3, TypeScript, Vite e Tailwind CSS, incluindo componentes reutilizáveis e design moderno com tema escuro.

## Características

- 🚀 [Vue 3](https://v3.vuejs.org/) com [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html)
- 🔧 [TypeScript](https://www.typescriptlang.org/) para tipagem estática
- ⚡️ [Vite](https://vitejs.dev/) para desenvolvimento rápido
- 🎨 [Tailwind CSS](https://tailwindcss.com/) para estilização
- 🌑 Design moderno com tema escuro inspirado no visual da Rocketseat
- 📱 Layout responsivo com mockup de aplicativo móvel
- 🧩 Componentes reutilizáveis (Button, Card, Badge, LandingHero, FeaturesSection, TestimonialsSection, ComparisonSection, WaitlistSection, FAQSection, FooterSection)
- ✨ Animações suaves para melhor experiência do usuário
- 📝 Lista de espera para cadastro de usuários interessados
- ❓ Seção de perguntas frequentes (FAQ)
- 🆚 Comparativo com métodos tradicionais de manutenção

## Configuração Recomendada da IDE

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Começando

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Compilar para produção
npm run build

# Visualizar build de produção localmente
npm run preview
```

## Componentes Disponíveis

### LandingHero
O componente principal da landing page, que apresenta o aplicativo AutoCare com design moderno e responsivo.

```vue
<LandingHero />
```

### FeaturesSection
Componente da segunda dobra da landing page, que apresenta os recursos detalhados do aplicativo com visualização interativa.

```vue
<FeaturesSection />
```

### TestimonialsSection
Componente da terceira dobra da landing page, que exibe depoimentos de usuários e estatísticas do aplicativo.

```vue
<TestimonialsSection />
```

### ComparisonSection
Componente que apresenta um comparativo entre o AutoCare e métodos tradicionais de manutenção, destacando os benefícios da solução digital.

```vue
<ComparisonSection />
```

### WaitlistSection
Componente de lista de espera onde usuários podem se cadastrar para receber acesso antecipado ao aplicativo, incluindo formulário completo e benefícios exclusivos.

```vue
<WaitlistSection />
```

### FAQSection
Componente de perguntas frequentes com interface expansível para esclarecer dúvidas comuns sobre o AutoCare.

```vue
<FAQSection />
```

### FooterSection
Componente de rodapé completo com links de navegação, redes sociais, newsletter e informações legais.

```vue
<FooterSection />
```

### Button
Um componente de botão reutilizável com suporte a variantes primária e secundária.

```vue
<Button label="Baixar Agora" primary class="px-8 py-3 text-lg" />
```

### Badge
Um componente de badge para exibir rótulos ou tags com diferentes cores e tamanhos.

```vue
<Badge text="NOVO APP" color="purple" size="lg" rounded />
```

### Card
Um componente de card para exibir informações com título e conteúdo.

```vue
<Card title="Título do Card" content="Conteúdo do card aqui">
  <!-- Conteúdo adicional (slot) -->
</Card>
```

## Recursos do Aplicativo Apresentados

- 🔔 **Alertas de Manutenção**: Notificações sobre próximas manutenções necessárias
- 📄 **Gerenciamento de Notas Fiscais**: Organização de documentos de serviços e peças
- 📊 **Histórico Completo**: Registro detalhado de todas as manutenções do veículo
- 📅 **Agendamento de Serviços**: Marcação de revisões e manutenções diretamente pelo app
- 👥 **Depoimentos de Usuários**: Experiências reais de motoristas que utilizam o aplicativo
- 📈 **Estatísticas de Uso**: Dados sobre usuários ativos, satisfação e economia média
- 🆚 **Comparativo Detalhado**: Análise das vantagens em relação aos métodos tradicionais
- 📝 **Lista de Espera**: Sistema de cadastro para acesso antecipado com benefícios exclusivos
- ❓ **FAQ Interativo**: Seção de perguntas frequentes com respostas expansíveis
- 🌐 **Presença Digital**: Links para redes sociais e newsletter para atualizações

## Estrutura do Projeto

```
/
├── src/
│   ├── assets/      # Recursos (imagens, fontes, etc.)
│   ├── components/  # Componentes Vue
│   │   ├── Alert.vue         # Componente de alerta com diferentes tipos
│   │   ├── Badge.vue         # Componente de badge para rótulos e tags
│   │   ├── Button.vue        # Componente de botão reutilizável
│   │   ├── Card.vue          # Componente de card para exibir informações
│   │   ├── ComparisonSection.vue # Componente de comparativo com métodos tradicionais
│   │   ├── FAQSection.vue    # Componente de perguntas frequentes
│   │   ├── FeaturesSection.vue # Componente da segunda dobra com recursos detalhados
│   │   ├── FooterSection.vue # Componente de rodapé completo
│   │   ├── Input.vue         # Componente de entrada de texto com validação
│   │   ├── LandingHero.vue   # Componente da primeira dobra da landing page
│   │   ├── TestimonialsSection.vue # Componente da terceira dobra com depoimentos
│   │   ├── WaitlistSection.vue # Componente de lista de espera para cadastro
│   │   └── ThemeToggle.vue   # Alternador de tema claro/escuro
│   ├── App.vue      # Componente raiz que renderiza a landing page
│   ├── main.ts      # Ponto de entrada
│   └── style.css    # Estilos globais com Tailwind CSS
├── index.html       # Página HTML principal
├── tailwind.config.js # Configuração do Tailwind CSS (com suporte a modo escuro)
├── postcss.config.js  # Configuração do PostCSS
└── vite.config.ts   # Configuração do Vite
```
