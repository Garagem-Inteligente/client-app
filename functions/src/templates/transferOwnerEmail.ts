/**
 * Template: Email de Transferência (Proprietário)
 * Enviado ao proprietário atual quando ele inicia uma transferência
 */

interface TransferOwnerData {
  ownerName: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  transferCode: string;
}

export const transferOwnerEmailTemplate = (data: TransferOwnerData): string => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Código de Transferência</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">🚗 Transferência de Veículo</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 22px;">Olá, ${data.ownerName}!</h2>
              
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Você iniciou a transferência do seu veículo <strong>${data.vehicleMake} ${data.vehicleModel} ${data.vehicleYear}</strong>.
              </p>
              
              <div style="background-color: #eff6ff; border: 2px solid #2563eb; padding: 30px; margin: 30px 0; border-radius: 8px; text-align: center;">
                <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                  Código de Transferência
                </p>
                <h1 style="margin: 0; color: #2563eb; font-size: 48px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                  ${data.transferCode}
                </h1>
              </div>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 10px; color: #92400e; font-size: 16px;">📋 Como funciona:</h3>
                <ol style="margin: 10px 0 0; padding-left: 20px; color: #78350f; line-height: 1.8;">
                  <li>Compartilhe este código com o novo proprietário</li>
                  <li>O novo proprietário deve acessar o AutoCare</li>
                  <li>Inserir o código na área de transferências</li>
                  <li>Confirmar o recebimento do veículo</li>
                </ol>
              </div>
              
              <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6;">
                  <strong>⚠️ ATENÇÃO:</strong> Este código expira em <strong>24 horas</strong>. Após este período, será necessário gerar um novo código de transferência.
                </p>
              </div>
              
              <div style="background-color: #f3f4f6; padding: 20px; margin: 30px 0; border-radius: 6px;">
                <h3 style="margin: 0 0 15px; color: #374151; font-size: 16px;">📊 Detalhes da Transferência</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Veículo:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: bold; text-align: right;">
                      ${data.vehicleMake} ${data.vehicleModel}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Ano:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: bold; text-align: right;">
                      ${data.vehicleYear}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Código:</td>
                    <td style="padding: 8px 0; color: #2563eb; font-size: 16px; font-weight: bold; text-align: right; font-family: 'Courier New', monospace; letter-spacing: 2px;">
                      ${data.transferCode}
                    </td>
                  </tr>
                </table>
              </div>
              
              <div style="text-align: center; margin: 40px 0 20px;">
                <a href="https://autocare.com/transfers" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Ver Status da Transferência
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; text-align: center;">
                Dúvidas? Acesse nossa <a href="https://autocare.com/support" style="color: #2563eb; text-decoration: none;">Central de Ajuda</a>
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
