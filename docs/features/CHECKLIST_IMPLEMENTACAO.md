# ✅ Checklist Prático: Implementação Completa

**Objetivo:** Guia passo a passo para implementar o sistema de notificação de atualização  
**Tempo Total:** 5-6 dias  
**Início:** [Data]  
**Conclusão Esperada:** [Data + 6 dias]

---

## 📋 FASE 1: Leitura & Compreensão (1-2h)

- [ ] Ler este checklist completamente
- [ ] Ler [README.md](./README.md) da pasta features
- [ ] Ler [FLUXO_VISUAL_AUTOMACAO.md](./visuals/FLUXO_VISUAL_AUTOMACAO.md)
- [ ] Assistir/Estudar sobre semantic versioning
- [ ] Entender o conceito de commits convencionais

**Status:** ⏳ Não começado | 🟡 Em progresso | ✅ Completo

---

## 🤖 FASE 2: Setup CI/CD (Dia 1 - 45 min)

**Documento:** [SEMANTIC_RELEASE_SETUP.md](./setup/SEMANTIC_RELEASE_SETUP.md)

### 2.1 Instalar Dependências

- [ ] Executar `pnpm add -D semantic-release @semantic-release/changelog @semantic-release/git @semantic-release/exec`
- [ ] Executar `pnpm add -D firebase-admin`
- [ ] Verificar com `pnpm list semantic-release`

**Verificação:** Ambos aparecem em `pnpm list`? ✓

### 2.2 Criar Arquivos de Configuração

- [ ] Criar `.releaserc.json` na raiz
- [ ] Copiar conteúdo do setup document
- [ ] Validar JSON (sem erros de sintaxe)

**Verificação:** `Test-Path "./.releaserc.json"` retorna `True`? ✓

### 2.3 Criar Scripts

- [ ] Criar `scripts/update-version.js`
- [ ] Copiar conteúdo do setup
- [ ] Validar sintaxe

**Verificação:** `Test-Path "./scripts/update-version.js"` retorna `True`? ✓

- [ ] Criar `scripts/publish-version.js`
- [ ] Copiar conteúdo do setup
- [ ] Validar sintaxe

**Verificação:** `Test-Path "./scripts/publish-version.js"` retorna `True`? ✓

### 2.4 Criar GitHub Actions Workflow

- [ ] Criar `.github/workflows/release.yml`
- [ ] Copiar conteúdo do setup
- [ ] Validar YAML (indentação correta)

**Verificação:** `Test-Path "./.github/workflows/release.yml"` retorna `True`? ✓

### 2.5 Configurar GitHub Secrets

- [ ] Obter FIREBASE_SERVICE_ACCOUNT_JSON
  - [ ] Firebase Console → Project Settings
  - [ ] Service Accounts → Generate New Private Key
  - [ ] Converter para base64
  - [ ] Copiar para clipboard

- [ ] Ir em GitHub → Repository → Settings → Secrets
- [ ] Adicionar secret: `FIREBASE_SERVICE_ACCOUNT_JSON` (base64)
- [ ] Adicionar secret: `VITE_FIREBASE_DATABASE_URL`

**Verificação:** Ambos secrets aparecem em GitHub? ✓

### 2.6 Criar src/version.json

- [ ] Criar `src/version.json`
- [ ] Adicionar conteúdo inicial:

```json
{
  "version": "1.0.0",
  "buildNumber": 1,
  "releaseDate": "2025-10-24T00:00:00Z",
  "changelog": []
}
```

**Verificação:** `Test-Path "./src/version.json"` retorna `True`? ✓

### 2.7 Teste Piloto da Automação

- [ ] Fazer commit de teste: `git commit --allow-empty -m "test: validando ci-cd"`
- [ ] Fazer push: `git push origin main`
- [ ] Ir em GitHub → Actions
- [ ] Observar workflow "Semantic Release & Build"
- [ ] Esperar conclusão (~5 min)

**Verificação:** 
- [ ] Workflow completou com sucesso? ✓
- [ ] Nova tag `v1.0.1` foi criada? ✓
- [ ] `src/version.json` foi atualizado? ✓
- [ ] CHANGELOG.md foi criado/atualizado? ✓
- [ ] Firebase foi atualizado com nova versão? ✓

**Status Fase 2:** ⏳ Não começado | 🟡 Em progresso | ✅ Completo

---

## 🏗️ FASE 3: Desenvolvimento Frontend (Dias 2-3)

**Documento:** [APP_UPDATE_NOTIFICATION_PRD.md](./prds/APP_UPDATE_NOTIFICATION_PRD.md) - Seção "Especificações Técnicas Detalhadas"

### 3.1 Criar Types TypeScript

- [ ] Criar `src/types/version.ts`
- [ ] Definir interface `VersionConfig`
- [ ] Definir interface `AppVersionState`
- [ ] Exportar tipos

**Verificação:**
- [ ] Arquivo existe? ✓
- [ ] `pnpm type-check` passa? ✓

### 3.2 Criar Composable useAppVersion

- [ ] Criar `src/composables/useAppVersion.ts`
- [ ] Implementar `fetchVersionConfig()` (conecta Firebase)
- [ ] Implementar `compareVersions()` (comparação semântica)
- [ ] Implementar `openPlayStore()` (abre link)
- [ ] Implementar refs reativas (currentVersion, latestVersion, etc)
- [ ] Implementar computed properties (isOutdated, hasUpdateAvailable)

**Verificação:**
- [ ] Arquivo existe? ✓
- [ ] Todas funções implementadas? ✓
- [ ] `pnpm type-check` passa? ✓
- [ ] `pnpm lint` passa? ✓

### 3.3 Criar Pinia Store

- [ ] Criar `src/stores/appVersion.ts`
- [ ] Definir state (dismissedUntil, lastCheckTime, forceCheckFlag)
- [ ] Definir getters (isBannerDismissed, shouldCheckVersion)
- [ ] Implementar `initVersionCheck()` action
- [ ] Implementar `dismissBanner()` action
- [ ] Implementar `forceCheck()` action

**Verificação:**
- [ ] Arquivo existe? ✓
- [ ] Todas actions implementadas? ✓
- [ ] `pnpm type-check` passa? ✓
- [ ] `pnpm lint` passa? ✓

### 3.4 Criar UpdateBanner Component

- [ ] Criar `src/views/home-page/components/UpdateBanner.vue`
- [ ] Implementar template com banner
- [ ] Aplicar estilos SCSS (glassmorphism, gradiente)
- [ ] Aplicar animação slide-down
- [ ] Implementar lógica de dismissão
- [ ] Implementar abertura do Play Store
- [ ] Implementar show/hide baseado em estado

**Verificação:**
- [ ] Arquivo existe? ✓
- [ ] Banner renderiza? ✓
- [ ] Clique "Atualizar Agora" abre Play Store? ✓
- [ ] Clique "Depois" dismissir banner? ✓
- [ ] Estilos aplicados (CSS variables)? ✓
- [ ] `pnpm lint` passa? ✓

### 3.5 Integrar em App.vue

- [ ] Adicionar `onMounted` hook
- [ ] Chamar `useAppVersionStore.initVersionCheck()`
- [ ] Tratamento de erros

**Verificação:**
- [ ] Hook executa ao abrir app? ✓
- [ ] Sem console errors? ✓

### 3.6 Integrar em HomePage

- [ ] Importar `UpdateBanner` component
- [ ] Renderizar logo após `ModernHeader`
- [ ] Passar props necessárias (se houver)

**Verificação:**
- [ ] Banner aparece quando há atualização? ✓
- [ ] Banner NÃO aparece quando app atualizado? ✓

**Status Fase 3:** ⏳ Não começado | 🟡 Em progresso | ✅ Completo

---

## 🧪 FASE 4: Testes Completos (Dia 4)

### 4.1 Testes Unitários - Composable

- [ ] Criar `src/composables/__tests__/useAppVersion.spec.ts`
- [ ] Teste `compareVersions()` com várias versões
- [ ] Teste `fetchVersionConfig()` (mock Firestore)
- [ ] Teste `isOutdated` computed
- [ ] Cobertura > 85%

**Executar:** `pnpm test -- useAppVersion.spec.ts --coverage`

**Verificação:**
- [ ] Todos testes passam? ✓
- [ ] Cobertura > 85%? ✓

### 4.2 Testes Unitários - Store

- [ ] Criar `src/stores/__tests__/appVersion.spec.ts`
- [ ] Teste `shouldCheckVersion` getter
- [ ] Teste `isBannerDismissed` getter
- [ ] Teste `initVersionCheck()` action
- [ ] Teste `dismissBanner()` action
- [ ] Cobertura > 85%

**Executar:** `pnpm test -- appVersion.spec.ts --coverage`

**Verificação:**
- [ ] Todos testes passam? ✓
- [ ] Cobertura > 85%? ✓

### 4.3 Testes Unitários - Componente

- [ ] Criar `src/views/home-page/components/__tests__/UpdateBanner.spec.ts`
- [ ] Teste renderização com isOutdated=true
- [ ] Teste não-renderização com isBannerDismissed=true
- [ ] Teste clique "Atualizar Agora"
- [ ] Teste clique "Depois"
- [ ] Teste animação
- [ ] Cobertura > 85%

**Executar:** `pnpm test -- UpdateBanner.spec.ts --coverage`

**Verificação:**
- [ ] Todos testes passam? ✓
- [ ] Cobertura > 85%? ✓

### 4.4 Validação de Qualidade

- [ ] Executar `pnpm type-check` (sem erros)
- [ ] Executar `pnpm lint` (sem warnings)
- [ ] Executar `pnpm build` (sem erros)

**Verificação:**
- [ ] `pnpm type-check` passa? ✓
- [ ] `pnpm lint` passa? ✓
- [ ] `pnpm build` passa? ✓

### 4.5 Testes E2E Manual

#### 4.5.1 Setup Local

- [ ] Iniciar app: `pnpm dev`
- [ ] Ter Firestore com documento `app-config/version`:
  ```json
  {
    "currentVersion": "0.5.0",
    "latestVersion": "1.0.1",
    "updateUrl": "https://play.google.com/store/apps/details?id=com.garagem.inteligente"
  }
  ```

#### 4.5.2 Testes

- [ ] Abrir app
  - [ ] Banner aparece com versão 1.0.1? ✓
  - [ ] Sem console errors? ✓

- [ ] Clicar "Atualizar Agora"
  - [ ] Abre Play Store (ou link simulado)? ✓

- [ ] Clicar "Depois"
  - [ ] Banner desaparece? ✓
  - [ ] Continua usando app? ✓

- [ ] Fechar e reabrir app (< 12h)
  - [ ] Banner NÃO reaparece? ✓

- [ ] Mudar timestamp de dismissão (simular 12h+)
  - [ ] Banner reaparece? ✓

- [ ] Mudar Firestore (latestVersion = currentVersion)
  - [ ] Recarregar app
  - [ ] Banner NÃO aparece? ✓

- [ ] Testar em emulador Android
  - [ ] Banner aparece? ✓
  - [ ] Clique abre Play Store real? ✓
  - [ ] Responsivo em tela pequena? ✓

**Status Fase 4:** ⏳ Não começado | 🟡 Em progresso | ✅ Completo

---

## 🚀 FASE 5: Deploy & Validação (Dia 5)

### 5.1 Merge e Release

- [ ] Fazer commit: `git commit -m "feat: implementar notificação de atualização de versão"`
- [ ] Fazer push para main
- [ ] Aguardar CI/CD (~5 min)

**Verificação:**
- [ ] Build passou no GitHub Actions? ✓
- [ ] Nova versão foi criada (v1.x.x)? ✓
- [ ] CHANGELOG foi atualizado? ✓
- [ ] Firebase foi atualizado? ✓

### 5.2 Validação em Staging

- [ ] Fazer build Android: `./scripts/build-android.sh`
- [ ] Instalar em emulador
- [ ] Validar banner funciona

**Verificação:**
- [ ] App instala sem erros? ✓
- [ ] Banner funciona corretamente? ✓

### 5.3 Documentação

- [ ] Atualizar README.md do projeto
- [ ] Adicionar seção "Atualizações de Versão"
- [ ] Documentar convenção de commits obrigatória

**Status Fase 5:** ⏳ Não começado | 🟡 Em progresso | ✅ Completo

---

## 📊 FASE 6: Operação & Monitoramento (Contínuo)

### 6.1 Dia a Dia

- [ ] Toda vez que mergear PR, garantir que commit tem padrão convencional
- [ ] Validar que versão é gerada corretamente
- [ ] Monitorar feedback de usuários

### 6.2 Monitoramento

- [ ] Ver Firebase analytics
- [ ] Verificar taxa de atualização de usuários
- [ ] Coletar feedback

### 6.3 Melhorias Futuras (v1.1+)

- [ ] [ ] Implementar force update para versões críticas
- [ ] [ ] Adicionar suporte para App Store (iOS)
- [ ] [ ] Melhorar analytics
- [ ] [ ] Notificações push

**Status Fase 6:** ⏳ Não começado | 🟡 Em progresso | ✅ Completo

---

## 🎉 Resumo Final

| Fase | Status | Duração | Data Início | Data Fim |
|------|--------|---------|------------|----------|
| 1. Leitura | ⏳ | 1-2h | | |
| 2. Setup CI/CD | ⏳ | 45 min | | |
| 3. Frontend | ⏳ | 2-3 dias | | |
| 4. Testes | ⏳ | 1 dia | | |
| 5. Deploy | ⏳ | 1 dia | | |
| 6. Operação | ⏳ | Contínuo | | |
| **TOTAL** | ⏳ | **5-6 dias** | | |

---

## ❌ Troubleshooting

Se algo não funcionar:

### Build não passa type-check
```powershell
pnpm type-check
# Verificar erros e corrigir tipos
```

### GitHub Actions falha
```
GitHub → Actions → Último workflow → Ver logs
Erros comuns:
1. Firebase secret em formato errado
2. Commits não convencionais
3. Falta de arquivos
```

### Firestore não atualiza
```
1. Verificar se secrets estão corretos
2. Verificar se Firebase rules permitem escrita
3. Ver logs do script publish-version.js
```

### Banner não aparece
```
1. Verificar if composable foi inicializado
2. Verificar se Firestore tem documento app-config/version
3. Ver console browser
```

---

## 📞 Próximos Passos

Após completar este checklist:

1. ✅ Documentar no README que versão é automática
2. ✅ Treinar time em commits convencionais
3. ✅ Monitorar primeira semana de adoção
4. ✅ Coletar feedback de usuários
5. ✅ Planejar v1.1 (force update)

---

**Criado:** 24 de outubro de 2025  
**Versão:** 1.0  
**Atualizado por:** [Seu Nome]
