# 📚 Documentação AutoCare

Bem-vindo à documentação completa do projeto AutoCare. Esta pasta contém toda a documentação técnica, guias de setup, planejamento e instruções de desenvolvimento.

## 📑 Índice

### 🏗️ Arquitetura
- **[ARCHITECTURE.md](architecture/ARCHITECTURE.md)** - Visão geral da arquitetura do sistema
- **[COMMANDS.md](architecture/COMMANDS.md)** - Comandos úteis para desenvolvimento
- **[MASKS_DOCUMENTATION.md](architecture/MASKS_DOCUMENTATION.md)** - Documentação de máscaras de input

### 🚀 Setup & Deploy
- **[QUICKSTART.md](setup/QUICKSTART.md)** - Guia rápido para iniciar o projeto (3 minutos)
- **[FIREBASE_SETUP.md](setup/FIREBASE_SETUP.md)** - Configuração completa do Firebase
- **[DEPLOY_INSTRUCTIONS.md](setup/DEPLOY_INSTRUCTIONS.md)** - Instruções para deploy em produção

### 🔄 Migração
- **[BASE64_MIGRATION.md](migration/BASE64_MIGRATION.md)** - Documentação técnica completa da migração Base64
- **[BASE64_SUMMARY.md](migration/BASE64_SUMMARY.md)** - Resumo executivo da migração

### 🧪 Testes
- **[QUICK_TEST.md](testing/QUICK_TEST.md)** - Guia rápido de testes (2 minutos)
- **[TESTING.md](testing/TESTING.md)** - Documentação completa de testes

### 📋 Planejamento
- **[IMPLEMENTATION_SUMMARY.md](planning/IMPLEMENTATION_SUMMARY.md)** - Resumo das implementações
- **[PLANO_DE_ACAO.md](planning/PLANO_DE_ACAO.md)** - Plano de ação e roadmap

### 💡 Projeto
- **[ideia-base.md](project/ideia-base.md)** - Conceito inicial do projeto
- **[ideia-expandida.md](project/ideia-expandida.md)** - Visão expandida e features
- **[lista-de-tarefas.md](project/lista-de-tarefas.md)** - Lista de tarefas e progresso

### 🤖 Copilot & Git
- **[COPILOT_INSTRUCTIONS.md](COPILOT_INSTRUCTIONS.md)** - Instruções técnicas para GitHub Copilot
- **[COPILOT_WORKFLOW.md](COPILOT_WORKFLOW.md)** - Workflow de documentação com Copilot
- **[COMMIT_MESSAGE.md](git/COMMIT_MESSAGE.md)** - Padrões de mensagens de commit

## 🎯 Por onde começar?

### Para novos desenvolvedores:
1. Leia o [QUICKSTART.md](setup/QUICKSTART.md) para configurar o ambiente
2. Entenda a arquitetura em [ARCHITECTURE.md](architecture/ARCHITECTURE.md)
3. Configure o Firebase usando [FIREBASE_SETUP.md](setup/FIREBASE_SETUP.md)
4. Execute os testes com [QUICK_TEST.md](testing/QUICK_TEST.md)

### Para deploy:
1. Siga [DEPLOY_INSTRUCTIONS.md](setup/DEPLOY_INSTRUCTIONS.md)

### Para entender o projeto:
1. Leia [ideia-base.md](project/ideia-base.md)
2. Explore [ideia-expandida.md](project/ideia-expandida.md)
3. Veja o progresso em [lista-de-tarefas.md](project/lista-de-tarefas.md)

### Para trabalhar com Copilot:
1. Configure usando [COPILOT_INSTRUCTIONS.md](COPILOT_INSTRUCTIONS.md)
2. Entenda o workflow em [COPILOT_WORKFLOW.md](COPILOT_WORKFLOW.md)
3. Use os padrões de commit em [COMMIT_MESSAGE.md](git/COMMIT_MESSAGE.md)

## 📂 Estrutura de Pastas

```
docs/
├── README.md                      # Este arquivo (índice)
├── COPILOT_INSTRUCTIONS.md        # Instruções técnicas para Copilot
├── COPILOT_WORKFLOW.md            # Workflow de documentação com Copilot
│
├── architecture/                  # Arquitetura do sistema
│   ├── ARCHITECTURE.md
│   ├── COMMANDS.md
│   └── MASKS_DOCUMENTATION.md
│
├── setup/                         # Configuração e deploy
│   ├── QUICKSTART.md
│   ├── FIREBASE_SETUP.md
│   └── DEPLOY_INSTRUCTIONS.md
│
├── migration/                     # Documentação de migrações
│   ├── BASE64_MIGRATION.md
│   └── BASE64_SUMMARY.md
│
├── testing/                       # Testes e QA
│   ├── QUICK_TEST.md
│   └── TESTING.md
│
├── planning/                      # Planejamento e roadmap
│   ├── IMPLEMENTATION_SUMMARY.md
│   └── PLANO_DE_ACAO.md
│
├── project/                       # Contexto do projeto
│   ├── ideia-base.md
│   ├── ideia-expandida.md
│   └── lista-de-tarefas.md
│
└── git/                          # Git e versionamento
    └── COMMIT_MESSAGE.md
```

## 🔧 Comandos Rápidos

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build produção
npm run build

# Testes
npm run test

# Deploy
npm run deploy
```

## 📝 Convenções

- Documentos em MAIÚSCULAS são guias técnicos/instruções
- Documentos em minúsculas são contexto/planejamento
- Sempre mantenha a documentação atualizada ao fazer mudanças

## 🤝 Contribuindo

Ao adicionar novas features ou fazer alterações significativas:

1. Atualize a documentação relevante
2. Adicione exemplos de uso quando aplicável
3. Mantenha o [PLANO_DE_ACAO.md](planning/PLANO_DE_ACAO.md) atualizado
4. Siga os padrões de commit em [COMMIT_MESSAGE.md](git/COMMIT_MESSAGE.md)

## 📞 Suporte

Para dúvidas sobre o projeto, consulte primeiro:
- [README.md principal](../README.md) na raiz do projeto
- Esta documentação organizada por tópico
- Issues no GitHub do projeto

---

**Última atualização:** 13 de outubro de 2025  
**Versão da documentação:** 1.0
