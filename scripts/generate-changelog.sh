#!/bin/bash

# Script para gerar changelog automaticamente baseado nos commits do Git
# Utiliza conventional commits para categorizar as mudanças

set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📝 Gerando Changelog...${NC}"
echo ""

# Pegar versão atual e data
VERSION="${1:-$(date +%Y.%m.%d)}"
DATE=$(date +%Y-%m-%d)

echo "Version: $VERSION"
echo "Date: $DATE"
echo ""

# Função para extrair tipo de commit
get_commit_type() {
  local message="$1"
  if [[ "$message" =~ ^feat(\(.*\))?:  ]]; then
    echo "feat"
  elif [[ "$message" =~ ^fix(\(.*\))?:  ]]; then
    echo "fix"
  elif [[ "$message" =~ ^perf(\(.*\))?:  ]]; then
    echo "perf"
  elif [[ "$message" =~ ^docs(\(.*\))?:  ]]; then
    echo "docs"
  elif [[ "$message" =~ ^style(\(.*\))?:  ]]; then
    echo "style"
  elif [[ "$message" =~ ^refactor(\(.*\))?:  ]]; then
    echo "refactor"
  elif [[ "$message" =~ ^test(\(.*\))?:  ]]; then
    echo "test"
  elif [[ "$message" =~ ^chore(\(.*\))?:  ]]; then
    echo "chore"
  else
    echo "chore"
  fi
}

# Função para extrair mensagem de commit
get_commit_message() {
  local message="$1"
  # Remove o tipo e escopo (se houver)
  echo "$message" | sed -E 's/^[a-z]+(\([^)]+\))?:[ ]*//' | sed 's/^./\u&/'
}

# Coletar commits desde a última tag ou todos se não houver tag
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
if [ -z "$LAST_TAG" ]; then
  echo -e "${YELLOW}Nenhuma tag encontrada. Usando todos os commits.${NC}"
  COMMITS=$(git log --pretty=format:"%s" --no-merges)
else
  echo "Commits desde: $LAST_TAG"
  COMMITS=$(git log $LAST_TAG..HEAD --pretty=format:"%s" --no-merges)
fi

# Arrays para armazenar diferentes tipos de mudanças
declare -a FEAT_COMMITS
declare -a FIX_COMMITS
declare -a PERF_COMMITS
declare -a DOCS_COMMITS
declare -a STYLE_COMMITS
declare -a REFACTOR_COMMITS
declare -a TEST_COMMITS
declare -a CHORE_COMMITS

# Processar commits
while IFS= read -r commit; do
  if [ -z "$commit" ]; then
    continue
  fi
  
  TYPE=$(get_commit_type "$commit")
  MESSAGE=$(get_commit_message "$commit")
  
  case "$TYPE" in
    feat)
      FEAT_COMMITS+=("$MESSAGE")
      ;;
    fix)
      FIX_COMMITS+=("$MESSAGE")
      ;;
    perf)
      PERF_COMMITS+=("$MESSAGE")
      ;;
    docs)
      DOCS_COMMITS+=("$MESSAGE")
      ;;
    style)
      STYLE_COMMITS+=("$MESSAGE")
      ;;
    refactor)
      REFACTOR_COMMITS+=("$MESSAGE")
      ;;
    test)
      TEST_COMMITS+=("$MESSAGE")
      ;;
    chore)
      CHORE_COMMITS+=("$MESSAGE")
      ;;
  esac
done <<< "$COMMITS"

# Gerar TypeScript changelog
CHANGELOG_FILE="src/constants/changelog.ts"
TEMP_FILE="${CHANGELOG_FILE}.tmp"

# Header do arquivo
cat > "$TEMP_FILE" << 'EOF'
export interface ChangelogEntry {
  version: string
  date: string
  changes: {
    type: 'feat' | 'fix' | 'perf' | 'docs' | 'style' | 'refactor' | 'test' | 'chore'
    message: string
  }[]
}

export const CHANGELOG: ChangelogEntry[] = [
EOF

# Adicionar nova versão
echo "  {" >> "$TEMP_FILE"
echo "    version: '$VERSION'," >> "$TEMP_FILE"
echo "    date: '$DATE'," >> "$TEMP_FILE"
echo "    changes: [" >> "$TEMP_FILE"

# Adicionar mudanças de cada tipo
add_changes() {
  local type="$1"
  shift
  local commits=("$@")
  
  for message in "${commits[@]}"; do
    # Escapar aspas e caracteres especiais
    escaped_message=$(echo "$message" | sed "s/'/\\\\'/g")
    echo "      { type: '$type', message: '$escaped_message' }," >> "$TEMP_FILE"
  done
}

[ ${#FEAT_COMMITS[@]} -gt 0 ] && add_changes "feat" "${FEAT_COMMITS[@]}"
[ ${#FIX_COMMITS[@]} -gt 0 ] && add_changes "fix" "${FIX_COMMITS[@]}"
[ ${#PERF_COMMITS[@]} -gt 0 ] && add_changes "perf" "${PERF_COMMITS[@]}"
[ ${#STYLE_COMMITS[@]} -gt 0 ] && add_changes "style" "${STYLE_COMMITS[@]}"
[ ${#REFACTOR_COMMITS[@]} -gt 0 ] && add_changes "refactor" "${REFACTOR_COMMITS[@]}"
[ ${#DOCS_COMMITS[@]} -gt 0 ] && add_changes "docs" "${DOCS_COMMITS[@]}"
[ ${#TEST_COMMITS[@]} -gt 0 ] && add_changes "test" "${TEST_COMMITS[@]}"
[ ${#CHORE_COMMITS[@]} -gt 0 ] && add_changes "chore" "${CHORE_COMMITS[@]}"

# Fechar nova versão
echo "    ]," >> "$TEMP_FILE"
echo "  }," >> "$TEMP_FILE"

# Adicionar versões antigas (se o arquivo já existe)
if [ -f "$CHANGELOG_FILE" ]; then
  # Extrair entradas antigas
  sed -n '/export const CHANGELOG: ChangelogEntry\[\] = \[/,/^\]/p' "$CHANGELOG_FILE" | \
    sed '1d;$d' | \
    sed '/^$/d' >> "$TEMP_FILE"
fi

# Footer do arquivo
cat >> "$TEMP_FILE" << 'EOF'
]

export const getChangeTypeLabel = (type: ChangelogEntry['changes'][0]['type']): string => {
  const labels: Record<ChangelogEntry['changes'][0]['type'], string> = {
    feat: '✨ Novidade',
    fix: '🐛 Correção',
    perf: '⚡ Performance',
    docs: '📝 Documentação',
    style: '💄 Visual',
    refactor: '♻️ Refatoração',
    test: '✅ Testes',
    chore: '🔧 Manutenção',
  }
  return labels[type]
}

export const getChangeTypeColor = (type: ChangelogEntry['changes'][0]['type']): string => {
  const colors: Record<ChangelogEntry['changes'][0]['type'], string> = {
    feat: 'success',
    fix: 'danger',
    perf: 'warning',
    docs: 'primary',
    style: 'secondary',
    refactor: 'tertiary',
    test: 'medium',
    chore: 'medium',
  }
  return colors[type]
}
EOF

# Substituir arquivo original
mv "$TEMP_FILE" "$CHANGELOG_FILE"

echo -e "${GREEN}✅ Changelog atualizado com sucesso!${NC}"
echo ""
echo "📊 Resumo:"
echo "  - Novidades: ${#FEAT_COMMITS[@]}"
echo "  - Correções: ${#FIX_COMMITS[@]}"
echo "  - Performance: ${#PERF_COMMITS[@]}"
echo "  - Visual: ${#STYLE_COMMITS[@]}"
echo "  - Refatorações: ${#REFACTOR_COMMITS[@]}"
echo "  - Outros: $((${#DOCS_COMMITS[@]} + ${#TEST_COMMITS[@]} + ${#CHORE_COMMITS[@]}))"
echo ""
echo -e "${BLUE}📝 Arquivo gerado: $CHANGELOG_FILE${NC}"
