````markdown
# 🔑 Troca de Senha (Consolidado)

Documentação consolidada de: `PASSWORD-CHANGE-IMPLEMENTATION.md`, `PASSWORD-CHANGE-SENDGRID.md`.

Passos principais

1. Instalar e configurar functions: `./scripts/setup-functions.sh`
2. Configurar SendGrid API Key:

```bash
firebase functions:config:set sendgrid.key="SUA_KEY_AQUI"
```

3. Deploy das functions:

```bash
firebase deploy --only functions
```

Testes locais

```bash
# Emulador de functions
firebase emulators:start

# Rodar app
pnpm dev
```

Remetente (editar em `functions/src/index.ts` antes do deploy):

```ts
from: { email: "noreply@seudominio.com", name: "Garagem Inteligente" }
```

---

> Mantive instruções de troubleshooting e links para templates SendGrid.

````
