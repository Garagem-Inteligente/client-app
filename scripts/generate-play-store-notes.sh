#!/bin/bash

# Script para gerar Release Notes para Google Play Store
# Formata commits em texto legível com limite de 500 caracteres
# Salva em formato compatível com r0adkll/upload-google-play

set -e

# Handler para erros que imprime contexto antes de sair
on_error() {
  local exit_code=$?
  echo -e "\n${RED}❌ Erro no script de geração de release notes (exit code: ${exit_code})${NC}"
  echo "Último comando: $BASH_COMMAND"
  echo "Conteúdo do diretório $OUTPUT_DIR:" 
  ls -la "$OUTPUT_DIR" || true
  echo "--- Commits coletados (primeiras 10 linhas) ---"
  printf "%s\n" "$COMMITS" | head -n 10 || true
  echo "--- fim do contexto ---"
  exit $exit_code
}

trap 'on_error' ERR

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📱 Gerando Release Notes para Play Store...${NC}"
echo ""

# Configuração
VERSION="${1:-$(date +%Y.%m.%d)}"
MAX_CHARS=500  # Limite da Play Store
OUTPUT_DIR="android/whatsnew"
OUTPUT_FILE="$OUTPUT_DIR/pt-BR.txt"

# Criar diretório se não existir
mkdir -p "$OUTPUT_DIR"

echo "Version: $VERSION"
echo "Output: $OUTPUT_FILE"
echo ""

# Coletar commits desde a última tag ou últimos 10 commits
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
if [ -z "$LAST_TAG" ]; then
  echo -e "${YELLOW}⚠️  Nenhuma tag encontrada. Usando últimos 10 commits.${NC}"
  if ! COMMITS=$(git log -10 --pretty=format:"%s" --no-merges 2>/dev/null); then
    echo -e "${YELLOW}⚠️  git log falhou; não será possível gerar release notes a partir de commits.${NC}"
    COMMITS=""
  fi
else
  echo "📋 Commits desde: $LAST_TAG"
  if ! COMMITS=$(git log $LAST_TAG..HEAD --pretty=format:"%s" --no-merges 2>/dev/null); then
    echo -e "${YELLOW}⚠️  git log desde a tag falhou; tentando últimos 10 commits como fallback.${NC}"
    COMMITS=$(git log -10 --pretty=format:"%s" --no-merges 2>/dev/null || true)
  fi
fi

# Função para limpar e formatar mensagem de commit
format_commit_message() {
  local message="$1"
  
  # Remove prefixo do tipo (feat:, fix:, etc.)
  message=$(echo "$message" | sed -E 's/^[a-z]+(\([^)]+\))?:[ ]*//')
  
  # Remove escopo entre parênteses se sobrou
  message=$(echo "$message" | sed -E 's/^\([^)]+\)[ ]*//')
  
  # Primeira letra maiúscula
  message=$(echo "$message" | sed 's/^./\U&/')
  
  # Traduz termos técnicos comuns para português amigável
  message=$(echo "$message" | sed 's/safe area/área segura/gi')
  message=$(echo "$message" | sed 's/safe-area/área segura/gi')
  message=$(echo "$message" | sed 's/navbar/barra de navegação/gi')
  message=$(echo "$message" | sed 's/header/cabeçalho/gi')
  message=$(echo "$message" | sed 's/rollout/lançamento/gi')
  message=$(echo "$message" | sed 's/edge-to-edge/tela cheia/gi')
  message=$(echo "$message" | sed 's/status bar/barra de status/gi')
  message=$(echo "$message" | sed 's/gesture navigation/navegação por gestos/gi')
  message=$(echo "$message" | sed 's/build/compilação/gi')
  message=$(echo "$message" | sed 's/APK/instalador/gi')
  message=$(echo "$message" | sed 's/AAB/pacote/gi')
  
  echo "$message"
}

# Função para obter emoji baseado no tipo de commit
get_commit_emoji() {
  local message="$1"
  
  if [[ "$message" =~ ^feat(\(.*\))?: ]]; then
    echo "✨"
  elif [[ "$message" =~ ^fix(\(.*\))?: ]]; then
    echo "🐛"
  elif [[ "$message" =~ ^perf(\(.*\))?: ]]; then
    echo "⚡"
  elif [[ "$message" =~ ^style(\(.*\))?: ]]; then
    echo "💄"
  elif [[ "$message" =~ ^refactor(\(.*\))?: ]]; then
    echo "♻️"
  elif [[ "$message" =~ ^docs(\(.*\))?: ]]; then
    echo "📝"
  elif [[ "$message" =~ ^test(\(.*\))?: ]]; then
    echo "✅"
  else
    echo "🔧"
  fi
}

# Categorizar commits
declare -a FEATURES
declare -a FIXES
declare -a IMPROVEMENTS

while IFS= read -r commit; do
  if [ -z "$commit" ]; then
    continue
  fi
  
  EMOJI=$(get_commit_emoji "$commit")
  MESSAGE=$(format_commit_message "$commit")
  
  # Pular commits muito técnicos ou de merge
  if [[ "$MESSAGE" =~ ^(Merge|Update|Bump|Release|Version|CI|CD) ]] || \
     [[ "$MESSAGE" =~ (workflow|pipeline|dependency|dependencies) ]]; then
    continue
  fi
  
  # Categorizar por tipo
  if [[ "$commit" =~ ^feat(\(.*\))?: ]]; then
    FEATURES+=("$MESSAGE")
  elif [[ "$commit" =~ ^fix(\(.*\))?: ]]; then
    FIXES+=("$MESSAGE")
  elif [[ "$commit" =~ ^(perf|style|refactor)(\(.*\))?: ]]; then
    IMPROVEMENTS+=("$MESSAGE")
  fi
done <<< "$COMMITS"

# Construir release notes
RELEASE_NOTES=""
CHAR_COUNT=0

# Função para adicionar linha se couber
add_line() {
  local line="$1"
  local line_length=$((${#line} + 1))  # +1 para newline
  
  if [ $((CHAR_COUNT + line_length)) -le $MAX_CHARS ]; then
    RELEASE_NOTES="${RELEASE_NOTES}${line}"$'\n'
    CHAR_COUNT=$((CHAR_COUNT + line_length))
    return 0
  else
    return 1
  fi
}

# Adicionar versão
if ! add_line "📱 Versão $VERSION"; then
  echo -e "${RED}❌ Erro: Versão muito longa!${NC}"
  exit 1
fi

add_line ""

# Adicionar novidades (features)
if [ ${#FEATURES[@]} -gt 0 ]; then
  if add_line "✨ Novidades:"; then
    for feature in "${FEATURES[@]}"; do
      if ! add_line "• $feature"; then
        add_line "• E mais melhorias..."
        break
      fi
    done
    add_line ""
  fi
fi

# Adicionar correções (fixes)
if [ ${#FIXES[@]} -gt 0 ]; then
  if add_line "🐛 Correções:"; then
    for fix in "${FIXES[@]}"; do
      if ! add_line "• $fix"; then
        add_line "• E mais correções..."
        break
      fi
    done
    add_line ""
  fi
fi

# Adicionar melhorias (improvements)
if [ ${#IMPROVEMENTS[@]} -gt 0 ]; then
  if add_line "⚡ Melhorias:"; then
    for improvement in "${IMPROVEMENTS[@]}"; do
      if ! add_line "• $improvement"; then
        add_line "• E mais otimizações..."
        break
      fi
    done
    add_line ""
  fi
fi

# Se não houver mudanças significativas, usar mensagem genérica
if [ ${#FEATURES[@]} -eq 0 ] && [ ${#FIXES[@]} -eq 0 ] && [ ${#IMPROVEMENTS[@]} -eq 0 ]; then
  RELEASE_NOTES="📱 Versão $VERSION"$'\n\n'
  RELEASE_NOTES+="✨ Melhorias gerais de estabilidade e performance"$'\n'
  RELEASE_NOTES+="🐛 Correções de bugs menores"$'\n'
  RELEASE_NOTES+="💄 Ajustes visuais e de interface"$'\n'
  CHAR_COUNT=${#RELEASE_NOTES}
fi

# Adicionar footer se couber
if add_line "Obrigado por usar Garagem Inteligente! 🚗"; then
  :
fi

# Remover última linha vazia (compatível)
RELEASE_NOTES=$(printf "%s" "$RELEASE_NOTES" | sed -e :a -e '/^\s*$/{$d;N;ba' -e '}')

# Salvar arquivo
echo "$RELEASE_NOTES" > "$OUTPUT_FILE"

# Criar cópia para outros idiomas (Play Store exige)
if ! cp "$OUTPUT_FILE" "$OUTPUT_DIR/en-US.txt" 2>/dev/null; then
  echo -e "${YELLOW}⚠️  Não foi possível criar cópia en-US.txt (permissão ou sistema de arquivos). Continuando...${NC}"
fi

# Exibir resultado
echo -e "${GREEN}✅ Release Notes geradas com sucesso!${NC}"
echo ""
echo "📊 Estatísticas:"
echo "  • Novidades: ${#FEATURES[@]}"
echo "  • Correções: ${#FIXES[@]}"
echo "  • Melhorias: ${#IMPROVEMENTS[@]}"
echo "  • Caracteres: $CHAR_COUNT / $MAX_CHARS"
echo ""

# Exibir preview
echo -e "${BLUE}📝 Preview (primeiras 10 linhas):${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
head -10 "$OUTPUT_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Avisar se passou do limite
if [ $CHAR_COUNT -gt $MAX_CHARS ]; then
  echo -e "${RED}⚠️  ATENÇÃO: Release notes excedeu limite de $MAX_CHARS caracteres!${NC}"
  echo -e "${YELLOW}   Google Play pode truncar o texto.${NC}"
  echo ""
  exit 1
fi

echo -e "${GREEN}✅ Arquivo salvo em: $OUTPUT_FILE${NC}"
echo -e "${BLUE}📤 Pronto para deploy na Play Store!${NC}"

