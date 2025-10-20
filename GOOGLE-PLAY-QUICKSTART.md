# 🚀 Quick Start - CI/CD Google Play

## ⚡ Início Rápido

### 1. Gerar Secrets
```bash
./scripts/generate-github-secrets.sh
```

### 2. Configurar Service Account
Siga o guia: [docs/GOOGLE-PLAY-CI-CD.md](docs/GOOGLE-PLAY-CI-CD.md)

### 3. Adicionar Secrets no GitHub
```
Settings → Secrets and variables → Actions → New repository secret
```

### 4. Fazer Deploy
```bash
# Opção 1: Push automático
git push origin master

# Opção 2: Manual no GitHub
Actions → Deploy Android → Run workflow
```

## 📦 Tracks Disponíveis

- **internal**: Teste interno (até 100 pessoas)
- **alpha**: Alpha testing
- **beta**: Beta testing  
- **production**: Produção

## 🔗 Links Úteis

- [Guia Completo](docs/GOOGLE-PLAY-CI-CD.md)
- [Google Play Console](https://play.google.com/console)
- [Google Cloud Console](https://console.cloud.google.com)
- [GitHub Actions](../../actions)
