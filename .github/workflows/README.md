# 🤖 GitHub Actions Workflows

## 📋 Workflow Ativo

### ✅ `deploy-optimized.yml` - Deploy Completo (PRINCIPAL)

**Status:** ✅ **ATIVO**

**Trigger:**
- Push em `master`
- Tags `v*.*.*`
- Manual (workflow_dispatch com opções)

**O que faz:**
- **Job 1:** Build compartilhado (web assets + version + changelog)
- **Job 2:** Deploy Web (Firebase Hosting) - **Paralelo**
- **Job 3:** Build Android AAB - **Paralelo**
- **Job 4:** Deploy Play Store

**Vantagens:**
- ✅ Reutilização de build entre jobs
- ✅ Execução paralela de deploys (Web + Android)
- ✅ Workflow dispatch customizado
- ✅ Cache inteligente de dependências
- ✅ Deploy seletivo (apenas Web, apenas Android, ou ambos)

**Uso:**

```bash
# Deploy completo automático (Web + Android)
git push origin master

# Deploy manual customizado
GitHub → Actions → 🚀 Deploy Completo (Otimizado) → Run workflow
  ☑️ Deploy Web: true/false
  ☑️ Deploy Android: true/false
  📦 Track: internal/alpha/beta/production
```

---

## 🗑️ Workflows Desabilitados

Todos os workflows abaixo foram **desabilitados** para evitar execuções duplicadas.

### ❌ `deploy-android.yml.disabled`
- Workflow sequencial (1 job) sem otimizações
- **Substituído por:** `deploy-optimized.yml`
- **Motivo:** Execuções duplicadas + sem paralelização

### ❌ `deploy-simple.disabled`
- Workflow básico antigo
- Substituído por versões otimizadas

### ❌ `deploy-simple-fixed.yml.disabled`
- Versão intermediária com correções
- Substituído por versões otimizadas

> **⚠️ Importante:** Arquivos `.disabled` **NÃO** são executados pelo GitHub Actions.  
> Mantidos apenas para histórico/referência.

---

## 🎯 Workflow Recomendado

**Use EXCLUSIVAMENTE:** `deploy-optimized.yml` ✅

Todos os outros workflows foram desabilitados. Este workflow centralizado oferece:

- 🚀 **Performance:** Jobs paralelos economizam tempo
- 🔄 **Flexibilidade:** Deploy seletivo via workflow_dispatch
- 💾 **Eficiência:** Build compartilhado entre jobs
- 📦 **Completude:** Deploy Web + Android em um único workflow

---

## 🔧 Manutenção

### Desabilitar Workflow

```bash
mv workflow.yml workflow.yml.disabled
git add .
git commit -m "ci: desabilita workflow"
git push
```

### Reabilitar Workflow

```bash
mv workflow.yml.disabled workflow.yml
git add .
git commit -m "ci: reabilita workflow"
git push
```

### Deletar Workflow Permanentemente

```bash
git rm workflow.yml.disabled
git commit -m "ci: remove workflow obsoleto"
git push
```

---

## 📊 Arquitetura do Workflow Otimizado

```
┌───────────────────────────────────────┐
│  Job 1: BUILD (5-7 min)               │
│  - Install dependencies (cache)       │
│  - Build web assets                   │
│  - Generate version & changelog       │
│  - Upload artifacts                   │
└─────────────┬─────────────────────────┘
              │
    ┌─────────┴─────────┐
    ▼                   ▼
┌─────────────┐  ┌──────────────────┐
│ Job 2: WEB  │  │ Job 3: ANDROID   │
│ (2-3 min)   │  │ (6-8 min)        │
│             │  │                  │
│ - Firebase  │  │ - Sync Capacitor │
│   Hosting   │  │ - Build AAB      │
└─────────────┘  │ - Upload AAB     │
                 └────────┬─────────┘
                          ▼
                 ┌──────────────────┐
                 │ Job 4: DEPLOY    │
                 │ (2-3 min)        │
                 │                  │
                 │ - Play Store     │
                 └──────────────────┘

Total: ~13-16 minutos
Jobs paralelos: 2 (Web + Android Build)
```

---

## 🚀 Roadmap

- [x] Workflow otimizado com jobs paralelos
- [x] Deploy seletivo via workflow_dispatch
- [x] Cache inteligente de dependências
- [x] Desabilitar workflows duplicados
- [ ] Adicionar job de testes unitários
- [ ] Implementar matrix strategy (multi-plataforma)
- [ ] Adicionar análise de bundle size
- [ ] Configurar notificações Slack/Discord
- [ ] Deletar workflows `.disabled` antigos (após validação)

---

## 📚 Documentação Relacionada

- [CI/CD Optimization Guide](../docs/CI-CD-OPTIMIZATION.md) - Detalhes técnicos da otimização
- [Google Play Setup](../docs/GOOGLE-PLAY-CI-CD.md) - Configuração de secrets e service account
- [Release Notes Guide](../docs/RELEASE-NOTES-GUIDE.md) - Sistema de changelog automático
- [Fix Keystore Secret](../docs/FIX-KEYSTORE-SECRET.md) - Troubleshooting de secrets
