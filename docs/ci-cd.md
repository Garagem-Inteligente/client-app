````markdown
# 🛠️ CI/CD (Consolidado)

Reúne as instruções e fluxos de CI/CD para o repositório (build, checks, deploy hosting e build Android).

Conteúdo originado de: `CI-CD-SETUP.md`, `CI-CD-FLOW.md`, `GIT-CI-SETUP-FINAL.md`.

Principais pontos

- Verificar secrets: `FIREBASE_SERVICE_ACCOUNT` e `SENDGRID_API_KEY` (quando aplicável).
- Workflows: quality check, deploy web (hosting), build Android, criar release.

Comandos úteis (manuais):

```bash
# Build web
pnpm run build

# Deploy hosting
firebase deploy --only hosting

# Gerar APK manualmente
./scripts/build-android.sh
```

---

> Mantenha os secrets atualizados no GitHub Actions (veja `GITHUB-SECRETS-SETUP.md`).

````
