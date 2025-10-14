/**
 * Template: Email de Alerta de Manutenção (Próxima)
 * Enviado 7 dias antes da data de vencimento da manutenção
 */

interface MaintenanceDueData {
  userName: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  maintenanceType: string;
  dueDate: string;
  daysUntilDue: number;
}

export const maintenanceDueEmailTemplate = (data: MaintenanceDueData): string => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manutenção Programada</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">⏰ Manutenção Programada</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 22px;">Olá, ${data.userName}!</h2>
              
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                A manutenção do seu veículo está <strong style="color: #f59e0b;">próxima</strong>! Este é um lembrete para que você possa se programar.
              </p>
              
              <div style="background-color: #fef3c7; border: 2px solid #f59e0b; padding: 30px; margin: 30px 0; border-radius: 8px;">
                <h3 style="margin: 0 0 20px; color: #92400e; font-size: 18px; text-align: center;">📋 Detalhes da Manutenção</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px 0; color: #78350f; font-size: 14px;">Veículo:</td>
                    <td style="padding: 12px 0; color: #1f2937; font-size: 14px; font-weight: bold; text-align: right;">
                      ${data.vehicleMake} ${data.vehicleModel} ${data.vehicleYear}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #78350f; font-size: 14px;">Tipo de Manutenção:</td>
                    <td style="padding: 12px 0; color: #1f2937; font-size: 14px; font-weight: bold; text-align: right;">
                      ${data.maintenanceType}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #78350f; font-size: 14px;">Data Prevista:</td>
                    <td style="padding: 12px 0; color: #f59e0b; font-size: 16px; font-weight: bold; text-align: right;">
                      ${data.dueDate}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #78350f; font-size: 14px;">Faltam:</td>
                    <td style="padding: 12px 0; color: #f59e0b; font-size: 20px; font-weight: bold; text-align: right;">
                      ${data.daysUntilDue} ${data.daysUntilDue === 1 ? "dia" : "dias"}
                    </td>
                  </tr>
                </table>
              </div>
              
              <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 10px; color: #1e40af; font-size: 16px;">💡 Por que fazer manutenção preventiva?</h3>
                <ul style="margin: 10px 0 0; padding-left: 20px; color: #1e40af; line-height: 1.8;">
                  <li>Evita problemas maiores e mais caros no futuro</li>
                  <li>Mantém o veículo funcionando perfeitamente</li>
                  <li>Aumenta a vida útil do veículo</li>
                  <li>Garante sua segurança nas estradas</li>
                  <li>Preserva o valor de revenda</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="https://autocare.com/maintenance" style="display: inline-block; background-color: #f59e0b; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Ver Detalhes da Manutenção
                </a>
              </div>
              
              <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                  <strong>ℹ️ Dica:</strong> Já agende a manutenção com sua oficina de confiança para garantir disponibilidade de horário. Após realizar a manutenção, não esqueça de registrar no AutoCare!
                </p>
              </div>
              
              <p style="margin: 30px 0 0; color: #6b7280; font-size: 13px; text-align: center; line-height: 1.6;">
                Este lembrete foi criado automaticamente com base no seu histórico de manutenções.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; text-align: center;">
                Prefere não receber esses lembretes? <a href="https://autocare.com/settings/notifications" style="color: #2563eb; text-decoration: none;">Gerenciar Notificações</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                © 2025 AutoCare • Gestão Inteligente de Veículos
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
