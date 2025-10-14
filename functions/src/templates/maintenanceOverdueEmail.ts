/**
 * Template: Email de Manutenção Atrasada
 * Enviado quando a manutenção não foi realizada na data prevista
 */

interface MaintenanceOverdueData {
  userName: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  maintenanceType: string;
  dueDate: string;
  daysOverdue: number;
}

export const maintenanceOverdueEmailTemplate = (data: MaintenanceOverdueData): string => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manutenção Atrasada</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">🚨 Manutenção Atrasada!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 22px;">Atenção, ${data.userName}!</h2>
              
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                A manutenção do seu veículo está <strong style="color: #ef4444;">atrasada</strong>! É importante realizá-la o quanto antes para evitar problemas maiores.
              </p>
              
              <div style="background-color: #fee2e2; border: 2px solid #ef4444; padding: 30px; margin: 30px 0; border-radius: 8px;">
                <h3 style="margin: 0 0 20px; color: #991b1b; font-size: 18px; text-align: center;">⚠️ Detalhes da Manutenção Atrasada</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px 0; color: #7f1d1d; font-size: 14px;">Veículo:</td>
                    <td style="padding: 12px 0; color: #1f2937; font-size: 14px; font-weight: bold; text-align: right;">
                      ${data.vehicleMake} ${data.vehicleModel} ${data.vehicleYear}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #7f1d1d; font-size: 14px;">Tipo de Manutenção:</td>
                    <td style="padding: 12px 0; color: #1f2937; font-size: 14px; font-weight: bold; text-align: right;">
                      ${data.maintenanceType}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #7f1d1d; font-size: 14px;">Deveria ter sido feita em:</td>
                    <td style="padding: 12px 0; color: #ef4444; font-size: 16px; font-weight: bold; text-align: right;">
                      ${data.dueDate}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #7f1d1d; font-size: 14px;">Atraso:</td>
                    <td style="padding: 12px 0; color: #ef4444; font-size: 20px; font-weight: bold; text-align: right;">
                      ${data.daysOverdue} ${data.daysOverdue === 1 ? 'dia' : 'dias'}
                    </td>
                  </tr>
                </table>
              </div>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 10px; color: #92400e; font-size: 16px;">⚠️ Consequências de adiar manutenções:</h3>
                <ul style="margin: 10px 0 0; padding-left: 20px; color: #92400e; line-height: 1.8;">
                  <li><strong>Custos maiores:</strong> Problemas pequenos se tornam grandes e caros</li>
                  <li><strong>Perda de garantia:</strong> Algumas garantias exigem manutenção em dia</li>
                  <li><strong>Redução de vida útil:</strong> Componentes podem falhar prematuramente</li>
                  <li><strong>Riscos de segurança:</strong> Falhas mecânicas podem causar acidentes</li>
                  <li><strong>Desvalorização:</strong> Veículos mal cuidados perdem valor</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="https://autocare.com/maintenance" style="display: inline-block; background-color: #ef4444; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Agendar Manutenção Urgente
                </a>
              </div>
              
              <div style="background-color: #dcfce7; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0; color: #065f46; font-size: 14px; line-height: 1.6;">
                  <strong>✅ Depois de realizar a manutenção:</strong> Registre-a no AutoCare para manter seu histórico atualizado e receber os próximos lembretes automaticamente.
                </p>
              </div>
              
              <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                  <strong>💡 Dica profissional:</strong> Mantenha sempre um fundo de emergência para manutenções. O AutoCare calcula automaticamente seus custos médios mensais para ajudá-lo no planejamento.
                </p>
              </div>
              
              <p style="margin: 30px 0 0; color: #6b7280; font-size: 13px; text-align: center; line-height: 1.6;">
                Este alerta foi criado automaticamente para ajudá-lo a manter seu veículo em dia.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; text-align: center;">
                Precisa de ajuda para encontrar uma oficina? <a href="https://autocare.com/workshops" style="color: #2563eb; text-decoration: none;">Ver Oficinas Recomendadas</a>
              </p>
              <p style="margin: 10px 0; color: #6b7280; font-size: 14px; text-align: center;">
                Prefere não receber esses alertas? <a href="https://autocare.com/settings/notifications" style="color: #2563eb; text-decoration: none;">Gerenciar Notificações</a>
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
