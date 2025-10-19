/**
 * Script de teste para SendGrid
 * 
 * Para usar:
 * 1. Configure a variável SENDGRID_API_KEY no arquivo .env
 * 2. Execute: node test-email.js
 */

require('dotenv').config();
const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

if (!SENDGRID_API_KEY || SENDGRID_API_KEY === 'your_sendgrid_api_key_here') {
  console.error('❌ ERRO: SENDGRID_API_KEY não está configurada no arquivo .env');
  console.log('\n📝 Como obter sua API Key do SendGrid:');
  console.log('1. Acesse: https://app.sendgrid.com/settings/api_keys');
  console.log('2. Clique em "Create API Key"');
  console.log('3. Nome: "Garagem Inteligente Functions"');
  console.log('4. Permissões: Full Access (ou Mail Send)');
  console.log('5. Copie a chave gerada');
  console.log('6. Cole no arquivo functions/.env na linha SENDGRID_API_KEY=');
  console.log('\n⚠️  IMPORTANTE: A API Key só é mostrada UMA VEZ!\n');
  process.exit(1);
}

sgMail.setApiKey(SENDGRID_API_KEY);

const testEmail = {
  to: 'mikeribeirooficial@gmail.com',
  from: {
    email: 'noreply@garageminteligente.app',
    name: 'Garagem Inteligente',
  },
  subject: '🧪 Teste de Email - Garagem Inteligente',
  html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Teste de Email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
      color: #ffffff;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.98) 100%);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 40px;
      text-align: center;
    }
    .icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      color: white;
    }
    .content {
      padding: 40px;
    }
    .message {
      font-size: 16px;
      line-height: 1.6;
      color: #9ca3af;
      margin-bottom: 20px;
    }
    .success-box {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 12px;
      padding: 20px;
      margin: 30px 0;
      text-align: center;
    }
    .success-text {
      font-size: 18px;
      font-weight: 600;
      color: #10b981;
    }
    .footer {
      background: rgba(17, 24, 39, 0.5);
      padding: 30px;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    .footer p {
      margin: 5px 0;
      font-size: 14px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="icon">✅</div>
      <h1>Teste de Email Bem-Sucedido!</h1>
    </div>
    
    <div class="content">
      <p class="message">
        Este é um <strong>email de teste</strong> do sistema Garagem Inteligente.
      </p>
      
      <div class="success-box">
        <div class="success-text">🎉 SendGrid está funcionando corretamente!</div>
      </div>
      
      <p class="message">
        Se você recebeu este email, significa que:
      </p>
      
      <ul style="color: #9ca3af; font-size: 14px; line-height: 1.8;">
        <li>✅ API Key do SendGrid está configurada</li>
        <li>✅ O domínio de envio está autorizado</li>
        <li>✅ Os emails serão entregues corretamente</li>
        <li>✅ A funcionalidade de PDF por email funcionará</li>
      </ul>
      
      <p class="message" style="margin-top: 30px; text-align: center;">
        Agora você pode usar todas as funcionalidades de email! 🚀
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Garagem Inteligente</strong></p>
      <p>Sistema de Gestão de Veículos</p>
      <p style="margin-top: 20px; font-size: 12px;">
        Timestamp: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
      </p>
    </div>
  </div>
</body>
</html>
  `,
};

console.log('📧 Enviando email de teste para: mikeribeirooficial@gmail.com');
console.log('⏳ Aguarde...\n');

sgMail
  .send(testEmail)
  .then(() => {
    console.log('✅ Email enviado com sucesso!');
    console.log('\n📬 Verifique sua caixa de entrada e pasta de spam');
    console.log('📧 Email: mikeribeirooficial@gmail.com');
    console.log('📄 Assunto: 🧪 Teste de Email - Garagem Inteligente\n');
    console.log('✨ SendGrid está configurado corretamente!\n');
  })
  .catch((error) => {
    console.error('❌ Erro ao enviar email:', error);
    
    if (error.response) {
      console.error('\n📋 Detalhes do erro:');
      console.error(JSON.stringify(error.response.body, null, 2));
    }
    
    console.log('\n💡 Possíveis causas:');
    console.log('1. API Key inválida ou expirada');
    console.log('2. Domínio de envio não verificado no SendGrid');
    console.log('3. Conta SendGrid com limitações');
    console.log('4. Email "from" não autorizado\n');
    
    process.exit(1);
  });
