# 🗺️ Roadmap de Migração - Portal do Cliente

## ✅ Fase 1: Fundação (COMPLETO)

- [x] Análise completa da plataforma web
- [x] PRD detalhado criado
- [x] Estrutura base do app
- [x] Firebase configurado
- [x] pnpm migrado
- [x] Store de veículos completa com manutenções

## 🔄 Fase 2: Utils e Helpers (2-3 horas)

### 2.1 Copiar Utils
- [ ] `/src/utils/errorMessages.ts` → App
- [ ] `/src/utils/fileUtils.ts` → App  
- [ ] `/src/utils/masks.ts` → App
- [ ] Criar `/src/utils/formatters.ts`
- [ ] Criar `/src/utils/validators.ts`

### 2.2 Copiar Constants
- [ ] `/src/constants/vehicles.ts` → App
- [ ] Adicionar labels de manutenção
- [ ] Adicionar labels de combustível

### 2.3 Copiar Services
- [ ] `/src/services/fipeApi.ts` → App (integração FIPE)

## 🎨 Fase 3: Componentes Atoms (4-6 horas)

### 3.1 Componentes Básicos
- [ ] Card (do projeto antigo)
- [ ] Button (adaptar para Ionic)
- [ ] Input (adaptar para Ionic)
- [ ] Badge (adaptar para Ionic)
- [ ] Alert (adaptar para Ionic)

### 3.2 Componentes Específicos
- [ ] Spinner/Loading
- [ ] Avatar
- [ ] Icon wrapper
- [ ] Toast notifications

## 🔨 Fase 4: Componentes Molecules (6-8 horas)

### 4.1 Formulários
- [ ] FormField (label + input + error)
- [ ] SearchableSelect (FIPE)
- [ ] DatePicker
- [ ] FileUpload (Base64)
- [ ] ImageUpload
- [ ] ImageCompare (antes/depois)

### 4.2 Específicos
- [ ] VehicleCard
- [ ] MaintenanceCard
- [ ] StatCard
- [ ] ConfirmModal

## 🏗️ Fase 5: Páginas Principais (8-10 horas)

### 5.1 Dashboard
- [ ] Estatísticas de veículos
- [ ] Estatísticas de manutenções
- [ ] Ações rápidas
- [ ] Manutenções pendentes
- [ ] Alertas

### 5.2 Veículos
- [ ] Lista de veículos
- [ ] Formulário de veículo (com FIPE)
- [ ] Detalhes do veículo
- [ ] Upload de foto
- [ ] Dados do seguro
- [ ] Documentos (CRLV, apólice)

### 5.3 Manutenções
- [ ] Lista de manutenções
- [ ] Formulário de manutenção
- [ ] Detalhes da manutenção
- [ ] Upload de anexos (múltiplos)
- [ ] Fotos antes/depois
- [ ] Garantias (peças e mão de obra)
- [ ] Cálculo automático de custos

### 5.4 Perfil
- [ ] Dados do usuário
- [ ] Configurações
- [ ] Notificações
- [ ] Logout

## 🔔 Fase 6: Funcionalidades Avançadas (4-6 horas)

### 6.1 Notificações
- [ ] Lista de notificações
- [ ] Marcar como lida
- [ ] Push notifications (Capacitor)
- [ ] Preferências de notificação

### 6.2 Transferências
- [ ] Listar transferências
- [ ] Solicitar transferência
- [ ] Aceitar transferência
- [ ] QR Code

### 6.3 Relatórios
- [ ] Exportar histórico (PDF?)
- [ ] Gráficos de gastos
- [ ] Análise de custos

## 🧪 Fase 7: Testes (3-4 horas)

### 7.1 Playwright Setup
- [ ] Configurar Playwright
- [ ] Teste de login
- [ ] Teste de cadastro de veículo
- [ ] Teste de manutenção
- [ ] Teste de navegação

### 7.2 Testes Unitários
- [ ] Testar stores
- [ ] Testar composables
- [ ] Testar utils

## 🐛 Fase 8: Bug Fixes (2-3 horas)

- [ ] Resolver warnings do Tailwind
- [ ] Resolver warnings do TypeScript
- [ ] Resolver warnings do ESLint
- [ ] Testar em dispositivo real
- [ ] Ajustar responsividade

## 📱 Fase 9: Capacitor (2-3 horas)

- [ ] Configurar plataformas (Android/iOS)
- [ ] Testar câmera
- [ ] Testar geolocalização
- [ ] Testar push notifications
- [ ] Build de teste

## 🚀 Fase 10: Deploy (1-2 horas)

- [ ] Build de produção
- [ ] Deploy Firebase Hosting (PWA)
- [ ] Gerar APK (Android)
- [ ] Gerar IPA (iOS)
- [ ] Documentar processo

---

## ⏱️ Estimativa Total: 35-50 horas

## 📊 Status Atual: ~15% Completo

### Tempo Investido até Agora: ~4 horas
- Análise e PRD: 1h
- Configuração: 1h
- Store completa: 2h

### Tempo Restante Estimado: 31-46 horas

---

## 🎯 Estratégia de Execução

### Opção A: Desenvolvimento Completo
- Executar todas as 10 fases
- Aplicativo 100% funcional
- Paridade completa com web
- **Tempo:** 35-50 horas

### Opção B: MVP Funcional
- Fases 1-5 + Fase 8 (essencial)
- 80% das funcionalidades
- Testável em dispositivos
- **Tempo:** 20-25 horas

### Opção C: Incremental
- Fazer uma funcionalidade por vez
- Testar cada uma antes de avançar
- Mais feedback durante processo
- **Tempo:** Variável (flexível)

---

## 💡 Recomendação

Dado o tamanho da tarefa, recomendo **Opção C (Incremental)**:

1. **Próximo Passo:** Copiar utils e criar componentes atoms
2. **Depois:** Implementar página de veículos completa
3. **Depois:** Implementar página de manutenções
4. **Por último:** Funcionalidades avançadas

Isso permite:
- Validar cada etapa
- Ajustar o design
- Corrigir bugs progressivamente
- Ver progresso tangível

---

**Quer que eu continue agora com alguma fase específica?**
