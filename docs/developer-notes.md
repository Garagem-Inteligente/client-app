# 📝 Notas do Desenvolvedor (Consolidadas)

Este documento reúne as decisões e ajustes de UI/UX aplicados recentemente no projeto — foco em consistência visual, acessibilidade e performance. As decisões abaixo consolidam o conteúdo de arquivos visuais previamente espalhados.

## Sumário rápido
- Dark cards (cards do dashboard e listas) — paleta e sombras unificadas
- TabBar redesign — barra inferior clean, 5 tabs, outline/filled icons
- Visual improvements — safe-area, espaçamentos, tipografia e animações

## Dark Cards — diretrizes
- Background base: `rgba(31, 41, 55, 0.75)` (gray-800, opacidade 75%) para cards com glassmorphism.
- Blur: `backdrop-filter: blur(15px)` (+webkit) para efeito consistente.
- Box-shadow: camadas com `0 4px 12px rgba(0,0,0,0.2)` e inset highlight `inset 0 1px 0 rgba(255,255,255,0.08)`.
- Hover: opacidade aumenta para 0.9 e sombra para `0 8px 20px rgba(0,0,0,0.25)`.
- Bordas coloridas de estatísticas mantidas (blue/green/purple/yellow) com opacidades leves para diferenciação.

Checklist de implementação (verify):
- [ ] Verificar `src/views/HomePage.vue` e `src/views/VehiclesPage.vue` para uso de variáveis de cor.
- [ ] Garantir fallback para navegadores sem `backdrop-filter`.

## TabBar (Redesign)
- Layout: full-width, sem margens, altura reduzida (65px), ícones outline quando inativos e filled quando selecionados.
- 5 tabs: Home, Veículos, Manutenção, Pedidos, Perfil.
- Acessibilidade: focus states, reduced-motion support e tamanhos de toque >= 44x44px.

Implementação recomendada:
- Use classes BEM/RSCSS: `.tabbar`, `.tabbar__button`, `.tabbar__icon--outline`, `.tabbar__icon--filled`.
- Remover wrappers desnecessários para reduzir DOM e melhorar performance.

## Melhorias visuais gerais
- Safe area: aplicar `padding-top: env(safe-area-inset-top)` em `ModernHeader`.
- Tipografia: reduzir tamanhos principais (welcome text, títulos) para economizar espaço vertical em mobile.
- Espaçamentos: diminuir paddings/margins conforme tabelas de economia (aprox. 25% em várias seções).
- Gradientes: usar variáveis CSS para paletas (ex.: `--gradient-primary`).
- Animações: usar apenas `transform` e `opacity` para melhor performance.

## Testes e QA recomendados
- Testar contraste e legibilidade em dispositivos reais (iOS/Android) e navegadores.
- Validar hover/active states, focus visibility e comportamento com reduced-motion.
- Confirmar builds: `pnpm build` e checar lint/types.

## Referências de implementação
- Arquivos afetados principais:
  - `src/views/HomePage.vue`
  - `src/views/TabsPage.vue`
  - `src/components/organisms/ModernHeader.vue`

---

> Este arquivo é a versão consolidada das notas de desenvolvedor visuais. Se desejar, posso renomeá-lo para `developer-notes.md` (substituindo o arquivo atual) e remover o antigo; confirme se deseja que eu faça a substituição automática.
