# 🤖 GitHub Actions Workflows

## 📋 Workflows Ativos

### 1. `deploy-android.yml` - Deploy Android (Principal)
**Status:** ✅ **ATIVO**

**Trigger:**
- Push em `master` ou `release/android`
- Tags `v*.*.*`
- Manual (workflow_dispatch)

**O que faz:**
- Build web assets (pnpm build)
- Sync Capacitor Android
- Build AAB assinado
- Deploy no Google Play Console (internal track default)

**Uso:**
```bash
# Deploy automático
git push origin master

# Deploy manual
GitHub → Actions → 🚀 Deploy Android → Run workflow
```

---

### 2. `deploy-optimized.yml` - Deploy Completo (Otimizado)
**Status:** 🧪 **EXPERIMENTAL**

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
- ✅ Execução paralela de deploys
- ✅ Workflow dispatch customizado
- ✅ Cache inteligente de dependências

**Uso:**
```bash
# Deploy completo (Web + Android)
git push origin master

# Deploy seletivo
GitHub → Actions → 🚀 Deploy Completo (Otimizado) → Run workflow
  ☑️ Deploy Web: true/false
  ☑️ Deploy Android: true/false
  📦 Track: internal/alpha/beta/production
```

---

## 🗑️ Workflows Desabilitados

### ❌ `deploy-simple.disabled`
- Workflow antigo sem otimizações
- Substituído por `deploy-android.yml`

### ❌ `deploy-simple-fixed.yml.disabled`
- Versão intermediária com correções
- Substituído por `deploy-android.yml`

> **Nota:** Arquivos `.disabled` não são executados pelo GitHub Actions.  
> Mantidos apenas para histórico/referência.

---

## 🎯 Qual Workflow Usar?

### Para Deploy Rápido de Android
**Use:** `deploy-android.yml` (principal)
- ✅ Estável e testado
- ✅ Sequencial e previsível
- ✅ Menor complexidade

### Para Deploy Otimizado (Web + Android)
**Use:** `deploy-optimized.yml` (experimental)
- ✅ Deploys paralelos
- ✅ Build compartilhado
- ✅ Opções customizadas
- ⚠️  Mais complexo (4 jobs)

---

## 🔧 Manutenção

### Desabilitar Workflow
```bash
mv workflow.yml workflow.yml.disabled
git add .
git commit -m "ci: desabilita workflow antigo"
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

## 📊 Comparação

| Feature | deploy-android.yml | deploy-optimized.yml |
|---------|-------------------|---------------------|
| **Jobs** | 1 sequencial | 4 paralelos |
| **Tempo** | 13-18 min | 13-16 min |
| **Build Web** | 1x | 1x compartilhado |
| **Deploy Web** | ❌ Não | ✅ Sim (Firebase) |
| **Deploy Android** | ✅ Sim | ✅ Sim |
| **Workflow Dispatch** | Básico | Customizado |
| **Artifacts** | Final AAB | Web + AAB |
| **Cache** | Básico | Inteligente |
| **Complexidade** | 🟢 Baixa | 🟡 Média |
| **Status** | ✅ Produção | 🧪 Experimental |

---

## 🚀 Roadmap

- [ ] Testar `deploy-optimized.yml` em produção
- [ ] Migrar completamente para workflow otimizado
- [ ] Adicionar job de testes unitários
- [ ] Implementar matrix strategy (multi-plataforma)
- [ ] Adicionar análise de bundle size
- [ ] Deletar workflows `.disabled` antigos

---

## 📚 Documentação

- [CI/CD Optimization Guide](../docs/CI-CD-OPTIMIZATION.md)
- [Google Play Setup](../docs/GOOGLE-PLAY-CI-CD.md)
- [Release Notes Guide](../docs/RELEASE-NOTES-GUIDE.md)
