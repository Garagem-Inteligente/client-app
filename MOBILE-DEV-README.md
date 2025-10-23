# 📱 Desenvolvimento Mobile - Garagem Inteligente

## 🚀 Desenvolvimento Direto do VSCode

Agora você pode desenvolver e testar o app mobile diretamente do VSCode com emulador integrado!

### Extensões Instaladas

- **Android iOS Emulator**: Executa emuladores Android/iOS diretamente do VSCode
- **Android Emulator Launcher**: Gerencia e lança emuladores Android

### Comandos Rápidos (Paleta de Comandos)

Use `Ctrl+Shift+P` e digite "Tasks: Run Task" para acessar:

- **Mobile Dev: Start** - Inicia tudo (servidor + emulador + hot reload)
- **Mobile Dev: Stop** - Para o servidor de desenvolvimento
- **Mobile Dev: Build Production** - Build para produção
- **Mobile Dev: Clean Config** - Remove configuração de desenvolvimento

### Workflow de Desenvolvimento

#### Opção 1: Comando Único (Recomendado)
```bash
# Na raiz do projeto
.\start-mobile-dev.ps1
```

#### Opção 2: Via VSCode Tasks
1. `Ctrl+Shift+P` → "Tasks: Run Task"
2. Selecionar "Mobile Dev: Start"
3. Tudo pronto!

### Debugging

- **Hot Reload**: Mudanças no código refletem automaticamente no emulador
- **Console Logs**: Aparecem no terminal do VSCode
- **Chrome DevTools**: Abra `chrome://inspect` para debugar o WebView

### Build de Produção

Antes de fazer build final:

```bash
.\dev-mobile.ps1 -Build
```

Ou via VSCode:
1. `Ctrl+Shift+P` → "Tasks: Run Task"
2. Selecionar "Mobile Dev: Build Production"

### Troubleshooting

#### Emulador não inicia
- Verifique se Android Studio está instalado
- Execute `flutter doctor -v` para diagnosticar problemas
- Use as extensões instaladas para gerenciar emuladores

#### Hot reload não funciona
- Verifique se o servidor Vite está rodando na porta 5173
- Confirme que o IP 192.168.2.113 está correto
- Execute `.\dev-mobile.ps1 -Clean` e depois `-Start`

#### Build falha
- Execute `.\dev-mobile.ps1 -Clean` primeiro
- Verifique se Java 21 está configurado corretamente
- Execute `pnpm build` manualmente para testar

### Configuração de Rede

O script está configurado para o IP `192.168.2.113`. Se seu IP local mudar:

1. Edite o arquivo `dev-mobile.ps1`
2. Mude a variável `$DevServerUrl`
3. Execute `.\dev-mobile.ps1 -Start`

### Extensões VSCode Úteis

Além das instaladas, considere:

- **Ionic Preview**: Preview do app Ionic em painel do VSCode
- **MobileView**: View responsiva mobile para testes web
- **Capacitor Tools**: Ferramentas específicas para Capacitor

---

**🎯 Resumo**: Agora é só executar `.\dev-mobile.ps1 -Start` e desenvolver com hot reload direto no emulador!