/**
 * Template: Email de Boas-Vindas
 * Enviado quando um novo usuário se registra na plataforma
 */

export const welcomeEmailTemplate = (userName: string): string => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao AutoCare</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px;">🚗 AutoCare</h1>
              <p style="margin: 10px 0 0; color: #e0e7ff; font-size: 14px;">Gestão Inteligente de Veículos</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 24px;">Bem-vindo, ${userName}! 🎉</h2>
              
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Estamos muito felizes em tê-lo conosco! Você acaba de dar o primeiro passo para uma gestão profissional e organizada dos seus veículos.
              </p>
              
              <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 15px; color: #1e40af; font-size: 18px;">📊 O que você pode fazer no AutoCare:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #374151;">
                  <li style="margin-bottom: 10px; line-height: 1.6;">
                    <strong>Dashboard Inteligente:</strong> Visualize custos, manutenções e estatísticas em tempo real
                  </li>
                  <li style="margin-bottom: 10px; line-height: 1.6;">
                    <strong>Histórico Completo:</strong> Registre todas as manutenções preventivas e corretivas
                  </li>
                  <li style="margin-bottom: 10px; line-height: 1.6;">
                    <strong>Documentos Seguros:</strong> Armazene CRLV, CNH, seguro e outros documentos importantes
                  </li>
                  <li style="margin-bottom: 10px; line-height: 1.6;">
                    <strong>Transferências Fáceis:</strong> Transfira veículos com código seguro de 6 dígitos
                  </li>
                  <li style="margin-bottom: 10px; line-height: 1.6;">
                    <strong>Alertas Automáticos:</strong> Receba lembretes de manutenções próximas ou atrasadas
                  </li>
                  <li style="line-height: 1.6;">
                    <strong>Análises Detalhadas:</strong> Gráficos e relatórios para entender seus gastos
                  </li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="https://autocare.com/dashboard" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Acessar Meu Dashboard
                </a>
              </div>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  <strong>💡 Dica:</strong> Comece adicionando seu primeiro veículo e registrando as manutenções já realizadas. Assim você terá um histórico completo desde o início!
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; text-align: center;">
                Precisa de ajuda? Acesse nossa <a href="https://autocare.com/support" style="color: #2563eb; text-decoration: none;">Central de Ajuda</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                © 2025 AutoCare • Gestão Inteligente de Veículos
              </p>
              <p style="margin: 10px 0 0; color: #9ca3af; font-size: 11px; text-align: center;">
                Você está recebendo este email porque se registrou no AutoCare.
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
