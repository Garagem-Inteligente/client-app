/**
 * Email Templates - AutoCare
 * Templates HTML responsivos para todos os emails do sistema
 * 
 * Todos os templates usam inline CSS para máxima compatibilidade
 * com clientes de email (Gmail, Outlook, Apple Mail, etc.)
 */

export {welcomeEmailTemplate} from "./welcomeEmail";
export {transferOwnerEmailTemplate} from "./transferOwnerEmail";
export {transferReceiverEmailTemplate} from "./transferReceiverEmail";
export {maintenanceDueEmailTemplate} from "./maintenanceDueEmail";
export {maintenanceOverdueEmailTemplate} from "./maintenanceOverdueEmail";

/**
 * Guia de uso dos templates:
 * 
 * 1. welcomeEmailTemplate(userName)
 *    - Enviado no registro de novo usuário
 *    - Apresenta funcionalidades da plataforma
 * 
 * 2. transferOwnerEmailTemplate(data)
 *    - Enviado ao proprietário que inicia transferência
 *    - Contém código para compartilhar
 * 
 * 3. transferReceiverEmailTemplate(data)
 *    - Enviado ao receptor do veículo
 *    - Instrui como aceitar a transferência
 * 
 * 4. maintenanceDueEmailTemplate(data)
 *    - Lembrete 7 dias antes da manutenção
 *    - Estilo amarelo/laranja (aviso)
 * 
 * 5. maintenanceOverdueEmailTemplate(data)
 *    - Alerta de manutenção atrasada
 *    - Estilo vermelho (urgente)
 * 
 * Características dos templates:
 * - ✅ Design responsivo (mobile-first)
 * - ✅ Inline CSS para compatibilidade
 * - ✅ Cores consistentes com brand
 * - ✅ CTAs claros e destacados
 * - ✅ Estrutura table-based (padrão email)
 * - ✅ Acessibilidade (role="presentation", alt text)
 * - ✅ Links funcionais para ações
 * - ✅ Footer com opt-out e suporte
 */
