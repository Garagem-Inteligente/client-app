# 📱 Desenvolvimento Mobile

Guia para desenvolvimento mobile do Garagem Inteligente diretamente do VSCode.

## 🚀 Início Rápido

### Opção 1: Script Automatizado (Recomendado)

```powershell
# Na raiz do projeto
.\start-mobile-dev.ps1
```

Isso inicia:
- Servidor Vite (port 5173)
- Emulador Android
- Hot reload automático

### Opção 2: Tasks do VSCode

1. **Ctrl+Shift+P** → "Tasks: Run Task"
2. Selecione **"Mobile Dev: Start"**

## 📋 Tasks Disponíveis

Use `Ctrl+Shift+P` e digite "Tasks: Run Task":

| Task | Descrição |
|------|-----------|
| **Mobile Dev: Start** | Inicia servidor + emulador + hot reload |
| **Mobile Dev: Stop** | Para o servidor de desenvolvimento |
| **Mobile Dev: Build Production** | Build para produção |
| **Mobile Dev: Clean Config** | Remove configuração de desenvolvimento |

## 🔥 Hot Reload

Mudanças no código refletem **automaticamente** no emulador sem need de rebuild.

### Como funciona

1. Arquivo é salvo em VSCode
2. Vite detecta a mudança
3. Hot reload é enviado ao emulador
4. App recarrega em segundos

### Troubleshooting Hot Reload

- Verifique se servidor Vite está rodando (porta 5173)
- Verifique IP local no script `dev-mobile.ps1` (padrão: `192.168.2.113`)
- Se IP mudar, edite `dev-mobile.ps1` e atualize `$DevServerUrl`

## 🐛 Debugging

### Chrome DevTools

```
chrome://inspect
```

Abra Chrome em outro navegador e inspecione o WebView do app.

### Console Logs

Logs aparecem diretamente no terminal do VSCode (stdout).

### Breakpoints

Use debugger do Chrome DevTools para definir breakpoints no código JavaScript/TypeScript.

## 🏗️ Build de Produção

```powershell
# Via script
.\dev-mobile.ps1 -Build

# Ou via VSCode Task
Ctrl+Shift+P → "Tasks: Run Task" → "Mobile Dev: Build Production"
```

Isso:
1. Roda `pnpm build` (Vite)
2. Sincroniza com Capacitor
3. Gera APK/IPA buildado

## ⚙️ Configuração de Rede

O script usa `192.168.2.113` como IP padrão. Se seu IP local for diferente:

1. **Encontre seu IP:**
   ```powershell
   ipconfig | findstr /I "ipv4"
   ```

2. **Edite `dev-mobile.ps1`:**
   ```powershell
   $DevServerUrl = "http://SEU_IP_LOCAL:5173"
   ```

3. **Reinicie o servidor:**
   ```powershell
   .\dev-mobile.ps1 -Start
   ```

## 🔧 Troubleshooting

### Emulador não inicia

- Verifique se Android Studio está instalado
- Veja **[docs/android-studio-setup.md](android-studio-setup.md)**

### Erro "Port 5173 already in use"

```powershell
# Encontre o processo
Get-Process -Name node
# Encerre-o
Stop-Process -Name node -Force
# Reinicie
.\dev-mobile.ps1 -Start
```

### Hot reload não funciona

1. Verifique se Vite está rodando na porta 5173
2. Verifique IP local em `dev-mobile.ps1`
3. Limpe configuração:
   ```powershell
   .\dev-mobile.ps1 -Clean
   .\dev-mobile.ps1 -Start
   ```

### Build falha

```powershell
# Limpe e tente novamente
.\dev-mobile.ps1 -Clean
pnpm build
.\dev-mobile.ps1 -Build
```

## 📚 Próximos Passos

- Veja **[docs/setup.md](setup.md)** para setup geral do projeto
- Veja **[docs/android-studio-setup.md](android-studio-setup.md)** para configurar Android Studio
- Veja **[docs/ci-cd.md](ci-cd.md)** para deployments automatizados
- Veja **[docs/developer-notes.md](developer-notes.md)** para guias de UI/UX

## 💡 Dicas

- Sempre inicie com `.\start-mobile-dev.ps1` para setup automático
- Use Chrome DevTools para debug avançado
- Mantenha VSCode e emulador lado a lado para visualizar mudanças em tempo real
- Logs aparecem no terminal integrado do VSCode

---

**🎯 Resumo**: Execute `.\start-mobile-dev.ps1` e desenvolva com hot reload! 🚀
