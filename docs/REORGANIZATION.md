Resumo da reorganização

Este repositório passou por uma reorganização para centralizar scripts e documentação:

- scripts/  -> scripts operacionais e helper scripts (.sh)
- docs/     -> documentação consolidada (setup, android build, ci-cd, auth, password-change)
- docs/archive/ -> cópias históricas de documentos antigos que foram consolidados

Backups e política de segurança

- Antes de remover arquivos do root, cópias foram preservadas como `scripts/*.orig` e os documentos originais foram arquivados em `docs/archive/`.
- Esta mudança foi feita para limpar a raiz do repositório e facilitar a navegação.

Se algo estiver faltando, recupere-o de `docs/archive/` ou dos backups `scripts/*.orig`.

Checklist rápida:

- [x] scripts movidos/normalizados
- [x] docs consolidados criados
- [x] arquivos legados arquivados em `docs/archive/`
- [x] backups `.orig` em `scripts/`

Autor: reorganizador automático
Data: 2025-10-18
