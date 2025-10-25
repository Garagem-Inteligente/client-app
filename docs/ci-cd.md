````markdown
# 🛠️ CI/CD (Consolidado)

Reúne as instruções e fluxos de CI/CD para o repositório (build, checks, deploy hosting e build Android).

Conteúdo originado de: `CI-CD-SETUP.md`, `CI-CD-FLOW.md`, `GIT-CI-SETUP-FINAL.md`.

Principais pontos


Comandos úteis (manuais):

```bash
# Build web
pnpm run build

# Deploy hosting
firebase deploy --only hosting

# Gerar APK manualmente
./scripts/build-android.sh
```


> Mantenha os secrets atualizados no GitHub Actions (veja `GITHUB-SECRETS-SETUP.md`).

# 🛠️ CI/CD (Consolidado)

Este documento reúne as instruções essenciais do fluxo de CI/CD do projeto: verificações de qualidade (type-check, lint, build), deploy web (Firebase Hosting) e build Android (Capacitor/Gradle).

Origem: consolidação de vários guias e workflows em `docs/` e `.github/workflows/`.

Principais pontos

- Secrets obrigatórios no GitHub Actions:
	- `FIREBASE_SERVICE_ACCOUNT` / `FIREBASE_TOKEN` — deploy hosting
	- `SENDGRID_API_KEY` — envio de e-mails pelas Functions (se aplicável)

- Workflows típicos:
	- `quality-check` (type-check, lint, build)
	- `deploy-web` (hosting)
	- `build-android` (AAB/APK via Capacitor/Gradle)
	- `release` (gerar release notes, upload de artefatos)

Onde encontrar

- Arquivos de workflow: `.github/workflows/*.yml`

Comandos úteis (manuais)

```bash
# Instalar dependências (pnpm recomendado)
pnpm install

# Build web
pnpm run build

# Servidor de desenvolvimento
pnpm dev

# Deploy hosting (requer credenciais configuradas no CI)
firebase deploy --only hosting

# Gerar APK/AAB manualmente
./scripts/build-android.sh
```

Notas rápidas

- Verifique a versão de Node e pnpm usada no CI para evitar incompatibilidades locais.
- Em caso de falha no deploy, verifique os secrets configurados em `Settings > Secrets and variables` do repositório e os logs da run no GitHub Actions.

---

> Consulte `.github/workflows/` para a versão atual dos pipelines e ajuste localmente as versões de Node/pnpm conforme necessário.
````
