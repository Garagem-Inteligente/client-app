# 📝 Sistema Automatizado de Release Notes para Play Store

## 🎯 Visão Geral

O sistema gera automaticamente as **notas de versão** (release notes) para a Google Play Store baseado nos commits do Git, seguindo o padrão **Conventional Commits**.

## 🔧 Como Funciona

### 1. **Durante o Desenvolvimento**

Faça commits seguindo o padrão Conventional Commits:

```bash
# Novos recursos
git commit -m "feat: adicionar busca de oficinas por localização"
git commit -m "feat(veiculos): implementar multi-steps no cadastro"

# Correções de bugs
git commit -m "fix: corrigir tela preta no Android"
git commit -m "fix(navbar): resolver sobreposição com barra de gestos"

# Melhorias de performance
git commit -m "perf: otimizar carregamento de imagens"

# Melhorias visuais
git commit -m "style: ajustar cores do tema escuro"

# Refatorações
git commit -m "refactor: simplificar lógica de autenticação"
```

### 2. **Durante o Deploy (Automático)**

Quando você faz deploy via GitHub Actions:

```yaml
# .github/workflows/deploy-optimized.yml

- name: 📝 Generate Play Store Release Notes
  run: |
    chmod +x ./scripts/generate-play-store-notes.sh
    ./scripts/generate-play-store-notes.sh "$VERSION"
```

O script `generate-play-store-notes.sh`:
1. ✅ Coleta commits desde a última tag
2. ✅ Categoriza por tipo (feat, fix, perf, etc.)
3. ✅ Traduz termos técnicos para português
4. ✅ Formata com emojis e bullets
5. ✅ Limita a 500 caracteres (limite da Play Store)
6. ✅ Gera arquivos `whatsnew-*.txt`

### 3. **Upload para Play Store**

O workflow automaticamente envia as release notes:

```yaml
- name: 🚀 Deploy to Play Store
  uses: r0adkll/upload-google-play@v1.1.3
  with:
    whatsNewDirectory: android/whatsnew/  # ← Release notes
```

## 📋 Padrões de Commits

### Tipos Suportados

| Tipo | Emoji | Categoria | Exemplo |
|------|-------|-----------|---------|
| `feat:` | ✨ | Novidades | `feat: adicionar modo offline` |
| `fix:` | 🐛 | Correções | `fix: resolver crash ao abrir foto` |
| `perf:` | ⚡ | Melhorias | `perf: reduzir tempo de carregamento` |
| `style:` | 💄 | Melhorias | `style: atualizar design dos cards` |
| `refactor:` | ♻️ | Melhorias | `refactor: simplificar código de login` |
| `docs:` | 📝 | (ignorado) | `docs: atualizar README` |
| `test:` | ✅ | (ignorado) | `test: adicionar testes unitários` |
| `chore:` | 🔧 | (ignorado) | `chore: atualizar dependências` |

### Escopos (Opcional)

Você pode adicionar escopo para categorizar melhor:

```bash
feat(auth): implementar login com Google
fix(navbar): corrigir altura no Android
perf(images): comprimir fotos automaticamente
style(dashboard): redesenhar cards de estatísticas
```

## 📱 Formato das Release Notes

### Exemplo de Saída (pt-BR):

```
📱 Versão 2024.10.24

✨ Novidades:
• Implementar login com Google
• Adicionar busca de oficinas
• Multi-steps no cadastro de veículos

🐛 Correções:
• Corrigir tela preta no Android
• Resolver sobreposição da navbar
• Ajustar altura da TabBar

⚡ Melhorias:
• Comprimir fotos automaticamente
• Redesenhar cards de estatísticas
• Otimizar carregamento de dados

Obrigado por usar Garagem Inteligente! 🚗
```

### Limites e Regras

- ✅ **Máximo:** 500 caracteres (Play Store)
- ✅ **Idiomas:** pt-BR (principal) e en-US (fallback)
- ✅ **Priorização:** Features > Fixes > Improvements
- ✅ **Truncamento:** Se exceder limite, adiciona "• E mais..."

## 🚀 Uso Manual (Teste Local)

### Gerar Release Notes Manualmente

```bash
# Dar permissão de execução
chmod +x scripts/generate-play-store-notes.sh

# Gerar para versão atual
./scripts/generate-play-store-notes.sh

# Gerar para versão específica
./scripts/generate-play-store-notes.sh "2024.10.24"

# Ver resultado
cat android/whatsnew/whatsnew-pt-BR.txt
```

### Saída do Script

```
📱 Gerando Release Notes para Play Store...

Version: 2024.10.24
Output: android/whatsnew/whatsnew-pt-BR.txt

📋 Commits desde: v2024.10.20

✅ Release Notes geradas com sucesso!

📊 Estatísticas:
  • Novidades: 5
  • Correções: 3
  • Melhorias: 2
  • Caracteres: 387 / 500

📝 Preview (primeiras 10 linhas):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 Versão 2024.10.24

✨ Novidades:
• Implementar login com Google
• Adicionar busca de oficinas
...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Arquivo salvo em: android/whatsnew/whatsnew-pt-BR.txt
📤 Pronto para deploy na Play Store!
```

## 🔄 Integração com CI/CD

### Workflow Completo

```yaml
jobs:
  build:
    # ... build do app ...
    
  deploy-android:
    needs: build
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Importante: pega histórico completo
      
      - name: 📝 Generate Release Notes
        run: |
          chmod +x ./scripts/generate-play-store-notes.sh
          ./scripts/generate-play-store-notes.sh "${{ needs.build.outputs.version_name }}"
      
      - name: 🚀 Deploy to Play Store
        uses: r0adkll/upload-google-play@v1.1.3
        with:
          whatsNewDirectory: android/whatsnew/
          # ... outros parâmetros ...
```

## 📝 Personalização

### Traduzir Mais Termos

Edite `scripts/generate-play-store-notes.sh`:

```bash
# Adicione mais traduções na função format_commit_message()
message=$(echo "$message" | sed 's/login/acesso/gi')
message=$(echo "$message" | sed 's/dashboard/painel/gi')
message=$(echo "$message" | sed 's/settings/configurações/gi')
```

### Alterar Limite de Caracteres

```bash
# Linha 19 do script
MAX_CHARS=500  # Altere aqui
```

### Customizar Emojis

```bash
# Função get_commit_emoji()
if [[ "$message" =~ ^feat ]]; then
  echo "🎉"  # Altere o emoji aqui
fi
```

### Mensagem Genérica (Fallback)

Se não houver commits significativos:

```bash
# Linhas 156-160
RELEASE_NOTES="📱 Versão $VERSION"$'\n\n'
RELEASE_NOTES+="✨ Melhorias gerais de estabilidade e performance"$'\n'
RELEASE_NOTES+="🐛 Correções de bugs menores"$'\n'
RELEASE_NOTES+="💄 Ajustes visuais e de interface"$'\n'
```

## ✅ Boas Práticas

### ✓ DO (Faça)

```bash
# ✅ Mensagens claras e descritivas
git commit -m "feat: adicionar filtro de data no histórico"
git commit -m "fix: corrigir crash ao salvar foto sem internet"

# ✅ Use escopo quando aplicável
git commit -m "feat(auth): implementar recuperação de senha"
git commit -m "fix(navbar): resolver bug de scroll"

# ✅ Primeira pessoa do plural ou infinitivo
git commit -m "feat: adicionar modo escuro"
git commit -m "fix: corrige validação de email"
```

### ✗ DON'T (Evite)

```bash
# ❌ Mensagens vagas
git commit -m "fix: ajustes"
git commit -m "feat: melhorias"

# ❌ Muito técnico (usuários não entendem)
git commit -m "fix: refatorar useAuthStore para usar reactive()"
git commit -m "perf: lazy load com defineAsyncComponent"

# ❌ Commits de merge/bump/CI
git commit -m "Merge branch 'feature/xyz'"
git commit -m "chore: bump version to 1.2.3"
```

## 🧪 Testes

### Testar Localmente

```bash
# 1. Fazer alguns commits de teste
git commit -m "feat: adicionar busca" --allow-empty
git commit -m "fix: corrigir bug X" --allow-empty

# 2. Gerar release notes
./scripts/generate-play-store-notes.sh "teste-1.0.0"

# 3. Verificar resultado
cat android/whatsnew/whatsnew-pt-BR.txt

# 4. Limpar commits de teste
git reset HEAD~2
```

### Validar Tamanho

```bash
# Contar caracteres
wc -c android/whatsnew/whatsnew-pt-BR.txt

# Deve ser <= 500
```

## 🐛 Troubleshooting

### Problema: "Nenhuma tag encontrada"

**Causa:** Não há tags Git no repositório

**Solução:** 
```bash
# Criar primeira tag
git tag -a v1.0.0 -m "Primeira versão"
git push --tags

# Ou deixar o script usar últimos 10 commits
```

### Problema: Release notes vazias

**Causa:** Todos os commits são `chore`, `docs`, `test` ou merges

**Solução:**
- Use `feat`, `fix`, ou `perf` para commits importantes
- O script usa mensagem genérica se não houver commits relevantes

### Problema: Texto truncado na Play Store

**Causa:** Excedeu 500 caracteres

**Solução:**
```bash
# O script avisa e adiciona "• E mais..."
# Para ver tamanho:
wc -c android/whatsnew/whatsnew-pt-BR.txt
```

### Problema: Traduções erradas

**Causa:** Termos técnicos não foram traduzidos

**Solução:**
```bash
# Adicione tradução no script (linha ~55)
vim scripts/generate-play-store-notes.sh

# Adicione:
message=$(echo "$message" | sed 's/TERMO/TRADUÇÃO/gi')
```

## 📚 Referências

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Play Store Release Notes Guidelines](https://support.google.com/googleplay/android-developer/answer/9859348)
- [r0adkll/upload-google-play](https://github.com/r0adkll/upload-google-play)

## 🎓 Exemplos Reais

### Exemplo 1: Nova Feature

```bash
git commit -m "feat(veiculos): adicionar cadastro em múltiplas etapas com validação de CPF"
```

**Release Note:**
```
✨ Novidades:
• Adicionar cadastro em múltiplas etapas com validação de CPF
```

### Exemplo 2: Bug Fix

```bash
git commit -m "fix(android): corrigir sobreposição da navbar com barra de navegação por gestos"
```

**Release Note:**
```
🐛 Correções:
• Corrigir sobreposição da barra de navegação com barra de navegação por gestos
```

### Exemplo 3: Performance

```bash
git commit -m "perf(images): implementar compressão automática de fotos antes do upload"
```

**Release Note:**
```
⚡ Melhorias:
• Implementar compressão automática de fotos antes do upload
```

---

**Última atualização:** 24 de outubro de 2025
