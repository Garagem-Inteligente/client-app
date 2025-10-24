````markdown
# ⚙️ Setup do Projeto (Consolidado)
# ⚙️ Setup do Projeto (Consolidado)

Este documento reúne os passos essenciais para preparar o ambiente de desenvolvimento do projeto (web e mobile), incluindo instalação de dependências, variáveis de ambiente e pontos específicos para builds nativos.

Observação: o projeto usa `pnpm` como gerenciador de pacotes. Use PowerShell no Windows (`pwsh`) para os comandos abaixo.

Passos iniciais

1. Copiar o arquivo de exemplo de variáveis de ambiente

```powershell
Copy-Item .env.example .env
# ou em sistemas Unix/macOS
cp .env.example .env
```

2. Instalar dependências

```bash
pnpm install
```

3. Configurar variáveis do Firebase

Preencha no `.env` as variáveis com prefixo `VITE_FIREBASE_...` conforme seu projeto Firebase.

4. Arquivos nativos (Android)

- Coloque `google-services.json` em `android/app/` quando for necessário testar ou gerar builds Android.

5. Functions / SendGrid (opcional)

Se o projeto depende de Cloud Functions que enviam e-mails (SendGrid), configure a chave `SENDGRID_API_KEY` nos secrets do Firebase/GitHub conforme o fluxo de deploy.

Comandos úteis

```bash
# Rodar o servidor de desenvolvimento (web)
pnpm dev

# Sincronizar com Capacitor (após build)
npx cap sync

# Rodar script de build Android (local)
./scripts/build-android.sh
```

Referências

- `MOBILE-DEV-README.md` — instruções específicas para desenvolvimento mobile e scripts `start-mobile-dev.ps1`.
- `CONSOLIDACAO-LOG.md` — histórico das mudanças na documentação.

---

> Use `pnpm dev` para desenvolvimento web; para testes em dispositivos/emuladores, sincronize com Capacitor via `npx cap sync` e siga `MOBILE-DEV-README.md`.
