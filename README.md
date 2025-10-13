# 🚗 AutoCare Platform

> Plataforma completa para gerenciamento de veículos e manutenções

[![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)](https://github.com)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.1-orange)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

## 📋 Sobre o Projeto

**AutoCare** é uma plataforma web completa que permite aos usuários gerenciar seus veículos e acompanhar o histórico de manutenções de forma organizada e inteligente. Com alertas automáticos e estatísticas detalhadas, nunca mais perca o prazo de uma manutenção importante!

### ✨ Features Principais

- 🔐 **Autenticação Segura**: Sistema completo de login/registro com Firebase Auth
- 🚗 **Gestão de Veículos**: Adicione, edite e gerencie múltiplos veículos
- 🔧 **Histórico de Manutenções**: Registre todas as manutenções com detalhes completos
- � **Upload de Anexos**: Notas fiscais e recibos armazenados como Base64 (100% gratuito)
- 🔄 **Transferência de Veículos**: Sistema de transferência com confirmação dupla
- 📊 **Dashboard Inteligente**: Visualize estatísticas, custos e alertas em tempo real
- ⚠️ **Alertas Automáticos**: Notificações de manutenções atrasadas, urgentes e próximas
- 💰 **Controle de Custos**: Acompanhe quanto gasta com cada veículo
- 📱 **Design Responsivo**: Funciona perfeitamente em mobile, tablet e desktop
- 🌑 **Tema Escuro**: Interface moderna inspirada no design da Rocketseat
- 🧪 **Testes E2E**: Suíte completa com Playwright
- 📄 **Landing Page Marketing**: Capte leads com lista de espera

## �️ Tecnologias

### Frontend
- **[Vue 3](https://v3.vuejs.org/)** - Framework progressivo com Composition API
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática para maior segurança
- **[Vite](https://vitejs.dev/)** - Build tool ultra-rápido
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Pinia](https://pinia.vuejs.org/)** - State management moderno
- **[Vue Router](https://router.vuejs.org/)** - Roteamento SPA

### Backend
- **[Firebase Authentication](https://firebase.google.com/docs/auth)** - Autenticação de usuários
- **[Cloud Firestore](https://firebase.google.com/docs/firestore)** - Banco de dados NoSQL em tempo real
- **[Firebase Analytics](https://firebase.google.com/docs/analytics)** - Análise de comportamento

## 🚀 Começando

### Pré-requisitos

- Node.js 16+ e npm/yarn
- Conta Firebase (gratuita)
- Git

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/autocare-landing-page.git
cd autocare-landing-page
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas credenciais Firebase
# IMPORTANTE: Obtenha as credenciais no Firebase Console
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

5. **Acesse no navegador**
```
http://localhost:5173
```

### Build de Produção

```bash
# Gera os arquivos otimizados na pasta dist/
npm run build

# Visualiza o build localmente
npm run preview
```

## 📁 Estrutura do Projeto

```
autocare-landing-page/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Alert.vue
│   │   ├── Button.vue
│   │   ├── Card.vue
│   │   ├── Navbar.vue
│   │   └── ...
│   ├── views/               # Páginas da aplicação
│   │   ├── Home.vue         # Landing page
│   │   ├── Dashboard.vue    # Dashboard principal
│   │   ├── Vehicles.vue     # Gestão de veículos
│   │   ├── Maintenance.vue  # Gestão de manutenções
│   │   └── auth/
│   │       ├── Login.vue
│   │       └── Register.vue
│   ├── stores/              # Gerenciamento de estado (Pinia)
│   │   ├── auth.ts          # Store de autenticação
│   │   └── vehicles.ts      # Store de veículos/manutenções
│   ├── router/              # Configuração de rotas
│   ├── firebase/            # Configuração Firebase
│   ├── App.vue              # Componente raiz
│   └── main.ts              # Entry point
├── .env                     # Variáveis de ambiente (não versionar!)
├── .env.example             # Template de variáveis
├── PLANO_DE_ACAO.md         # Roadmap detalhado do projeto
├── FIREBASE_SETUP.md        # Guia de configuração Firebase
└── package.json
```

## 📚 Documentação Adicional

- **[PLANO_DE_ACAO.md](./PLANO_DE_ACAO.md)** - Análise completa, roadmap e próximos passos
- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Configuração Firebase e deploy
- **[.github/copilot-instructions.md](./.github/copilot-instructions.md)** - Instruções para AI agents

## 🔒 Segurança

Este projeto implementa as melhores práticas de segurança:

- ✅ Variáveis de ambiente para credenciais sensíveis
- ✅ Firestore Security Rules (configure no Firebase Console)
- ✅ Guards de rota para proteção de páginas privadas
- ✅ Validação de autenticação em todas as operações

**IMPORTANTE:** Antes de colocar em produção, configure as Security Rules do Firestore. Veja [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) para instruções detalhadas.

## 📊 Status do Projeto

### ✅ MVP Completo (v1.0.0)
- [x] Landing page marketing
- [x] Sistema de autenticação
- [x] Dashboard com estatísticas
- [x] CRUD de veículos
- [x] CRUD de manutenções
- [x] Sistema de alertas
- [x] Design responsivo

### 🔄 Próximas Features (v2.0.0)
- [ ] Notificações push
- [ ] Upload de documentos (notas fiscais)
- [ ] Gráficos de custos
- [ ] Exportação de dados (PDF, CSV)
- [ ] Perfil do usuário

Veja o roadmap completo em [PLANO_DE_ACAO.md](./PLANO_DE_ACAO.md).

## 💰 Custos

O projeto utiliza **apenas recursos gratuitos** do Firebase:

| Serviço | Limite Gratuito | Estimativa (1000 usuários/mês) |
|---------|-----------------|--------------------------------|
| Authentication | 50.000 MAU | ~1.000 MAU (2%) |
| Firestore Reads | 50.000/dia | ~10.000/dia (20%) |
| Firestore Writes | 20.000/dia | ~2.000/dia (10%) |
| Firestore Storage | 1 GB | ~100 MB (10%) |

**Conclusão:** Suporta facilmente 500-1000 usuários ativos no plano gratuito.

## 🧪 Testes

```bash
# Testes unitários (a implementar)
npm run test

# Testes E2E (a implementar)
npm run test:e2e
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga estes passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Michel** - [GitHub](https://github.com/Mikeofic)

## 🙏 Agradecimentos

- Design inspirado em [Rocketseat](https://rocketseat.com.br/)
- Ícones por [Heroicons](https://heroicons.com/)
- Firebase por Google

---

**Status:** ✅ Production Ready  
**Versão:** 1.0.0  
**Última atualização:** Outubro 2025

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
