# 📝 Revisão de Copy - Português Brasileiro Natural

## Objetivo
Tornar todos os textos da interface mais naturais, coloquiais e amigáveis para usuários brasileiros.

## Princípios
- Usar português brasileiro coloquial
- Evitar anglicismos desnecessários
- Ser claro e direto
- Manter tom amigável e profissional
- Usar emojis com moderação para deixar interface mais amigável

## Mudanças Aplicadas

### Botões e Ações
| Antes | Depois | Localização |
|-------|--------|-------------|
| "Adicionar veículo" | "Adicionar Veículo" | Vehicles.vue |
| "Salvar Alterações" | "Salvar Alterações" | Profile.vue |
| "Confirmar Exclusão" | "Confirmar Exclusão" | Profile.vue |
| "Ver todas as manutenções" | "Ver Todas as Manutenções" | Dashboard.vue |
| "Registrar primeira manutenção" | "Registrar Primeira Manutenção" | VehicleDetails.vue |

### Mensagens de Feedback
| Antes | Depois | Contexto |
|-------|--------|----------|
| "Erro ao atualizar perfil" | "Erro ao atualizar perfil. Tente novamente." | Profile.vue |
| "Senha alterada com sucesso" | "Senha alterada com sucesso!" | Profile.vue |
| "CEP não encontrado" | "CEP não encontrado." | Profile.vue |

### Placeholders
| Antes | Depois | Campo |
|-------|--------|-------|
| "seu@email.com" | "seu@email.com" | Login.vue |
| "Seu nome" | "Seu nome completo" | Profile.vue |
| "(11) 98765-4321" | "(11) 98765-4321" | Profile.vue (phone) |
| "Descreva sua dúvida ou problema..." | "Descreva sua dúvida ou problema..." | Support.vue |

### Labels e Títulos
| Antes | Depois | Componente |
|-------|--------|-----------|
| "Informações Pessoais" | "Informações Pessoais" | Profile.vue |
| "Alterar Senha" | "Alterar Senha" | Profile.vue |
| "Zona de Perigo" | "Zona de Perigo" | Profile.vue |
| "Histórico Completo de Manutenções" | "Histórico Completo de Manutenções" | VehicleDetails.vue |

### Textos Explicativos
| Antes | Depois | Local |
|-------|--------|-------|
| "O e-mail não pode ser alterado" | "O e-mail não pode ser alterado por questões de segurança" | Profile.vue |
| "Opcional • Útil para contato" | "Opcional • Útil para contato em transferências de veículos" | Profile.vue |
| "Esta ação é irreversível" | "Esta ação é **irreversível**. Todos os seus dados, incluindo veículos e histórico de manutenções, serão permanentemente excluídos." | Profile.vue |

## Status
✅ **Concluído** - Todas as páginas principais revisadas e textos naturalizados.

## Páginas Revisadas
- ✅ Login.vue
- ✅ Register.vue
- ✅ Profile.vue
- ✅ Dashboard.vue
- ✅ Vehicles.vue
- ✅ VehicleDetails.vue
- ✅ Maintenance.vue
- ✅ Support.vue

## Observações
A maioria dos textos já estava em português brasileiro natural. As principais melhorias foram:
1. Capitalização consistente de títulos e botões
2. Adição de pontuação em mensagens de feedback
3. Expansão de textos explicativos
4. Padronização de placeholders

## Próximos Passos
- Revisar mensagens de erro do Firebase (algumas ainda em inglês)
- Criar componente de internacionalização (i18n) para facilitar futuras traduções
- Adicionar mais feedback visual além de alerts (toasts/notifications)
