````markdown
# ⚙️ Setup do Projeto (Consolidado)

Este arquivo reúne os passos essenciais para começar a desenvolver localmente: instalação de dependências, configuração do `.env`, e setup de Firebase/SendGrid mínimo.

Conteúdo consolidado de: `README.md` (seções de setup), `docs/auth-google.md`, `GITHUB-SECRETS-SETUP.md`.

## Passos rápidos

1. Copie o arquivo de exemplo de env:

```bash
cp .env.example .env
```

2. Instale dependências (pnpm recomendado):

```bash
pnpm install
```

3. Configure variáveis do Firebase no `.env` (prefixo `VITE_FIREBASE_...`)

4. Functions (opcional — para envio de email):

```bash
./scripts/setup-functions.sh
```

## SendGrid

Registrar a chave em secrets (Firebase / GitHub Actions) — ver `docs/password-change.md` para detalhes.

---

> Arquivo consolidado automaticamente para centralizar instruções essenciais.

````
