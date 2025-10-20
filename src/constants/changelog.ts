export interface ChangelogEntry {
  version: string
  date: string
  changes: {
    type: 'feat' | 'fix' | 'perf' | 'docs' | 'style' | 'refactor' | 'test' | 'chore'
    message: string
  }[]
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.0.0',
    date: '2025-10-20',
    changes: [
      { type: 'feat', message: 'Sistema de gerenciamento de veículos' },
      { type: 'feat', message: 'Controle de manutenções com lembretes' },
      { type: 'feat', message: 'Dashboard com estatísticas' },
      { type: 'feat', message: 'Autenticação com Google' },
      { type: 'feat', message: 'Upload de fotos de veículos' },
      { type: 'feat', message: 'Histórico completo de manutenções' },
    ],
  },
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
