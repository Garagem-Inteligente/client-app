import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as sgMail from "@sendgrid/mail";

// Initialize Firebase Admin
admin.initializeApp();

// Configure SendGrid
const SENDGRID_API_KEY = functions.config().sendgrid?.key || process.env.SENDGRID_API_KEY;
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

/**
 * Send password reset email with SendGrid
 */
export const sendPasswordResetEmail = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Usuário não autenticado"
    );
  }

  const { email } = data;

  if (!email) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Email é obrigatório"
    );
  }

  try {
    // Generate password reset link
    const resetLink = await admin.auth().generatePasswordResetLink(email);

    // Send email via SendGrid
    const msg = {
      to: email,
      from: {
        email: "noreply@garageminteligente.app",
        name: "Garagem Inteligente",
      },
      subject: "🔐 Redefinição de Senha - Garagem Inteligente",
      html: getPasswordResetEmailTemplate(resetLink),
    };

    await sgMail.send(msg);

    return {
      success: true,
      message: "Email de redefinição enviado com sucesso",
    };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Erro ao enviar email de redefinição de senha"
    );
  }
});

/**
 * Send password change confirmation email
 */
export const sendPasswordChangeConfirmation = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Usuário não autenticado"
    );
  }

  const { email, userName } = data;

  if (!email) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Email é obrigatório"
    );
  }

  try {
    // Send confirmation email via SendGrid
    const msg = {
      to: email,
      from: {
        email: "noreply@garageminteligente.app",
        name: "Garagem Inteligente",
      },
      subject: "✅ Senha Alterada com Sucesso - Garagem Inteligente",
      html: getPasswordChangeConfirmationTemplate(userName || "Usuário"),
    };

    await sgMail.send(msg);

    return {
      success: true,
      message: "Email de confirmação enviado com sucesso",
    };
  } catch (error) {
    console.error("Error sending password change confirmation:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Erro ao enviar email de confirmação"
    );
  }
});

/**
 * Modern password reset email template
 */
function getPasswordResetEmailTemplate(resetLink: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redefinição de Senha</title>
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
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      padding: 40px;
      text-align: center;
    }
    .logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
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
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
      color: #d1d5db;
    }
    .message {
      font-size: 16px;
      line-height: 1.6;
      color: #9ca3af;
      margin-bottom: 30px;
    }
    .button-container {
      text-align: center;
      margin: 40px 0;
    }
    .button {
      display: inline-block;
      padding: 16px 48px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
    }
    .warning {
      background: rgba(251, 191, 36, 0.1);
      border: 1px solid rgba(251, 191, 36, 0.3);
      border-radius: 12px;
      padding: 16px;
      margin: 20px 0;
      color: #fbbf24;
      font-size: 14px;
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
    .footer a {
      color: #3b82f6;
      text-decoration: none;
    }
    .expiry {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 12px;
      padding: 16px;
      margin: 20px 0;
      text-align: center;
      color: #ef4444;
      font-size: 14px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🚗</div>
      <h1>Garagem Inteligente</h1>
    </div>
    
    <div class="content">
      <p class="greeting">Olá! 👋</p>
      
      <p class="message">
        Recebemos uma solicitação para redefinir a senha da sua conta na <strong>Garagem Inteligente</strong>.
      </p>
      
      <p class="message">
        Se você solicitou essa alteração, clique no botão abaixo para criar uma nova senha:
      </p>
      
      <div class="button-container">
        <a href="${resetLink}" class="button">🔐 Redefinir Senha</a>
      </div>
      
      <div class="expiry">
        ⏰ Este link expira em 1 hora
      </div>
      
      <div class="warning">
        <strong>⚠️ Importante:</strong><br>
        Se você não solicitou a redefinição de senha, ignore este email. Sua senha permanecerá inalterada.
      </div>
      
      <p class="message" style="margin-top: 30px;">
        Por questões de segurança, nunca compartilhe este link com outras pessoas.
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Garagem Inteligente</strong></p>
      <p>Gerencie seus veículos de forma inteligente</p>
      <p style="margin-top: 20px;">
        <a href="https://app-garageminteligente.web.app">Acessar Aplicativo</a>
      </p>
      <p style="margin-top: 20px; font-size: 12px;">
        Este é um email automático, por favor não responda.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Password change confirmation email template
 */
function getPasswordChangeConfirmationTemplate(userName: string): string {
  const timestamp = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "full",
    timeStyle: "short",
  });

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Senha Alterada</title>
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
    .success-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
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
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
      color: #d1d5db;
    }
    .message {
      font-size: 16px;
      line-height: 1.6;
      color: #9ca3af;
      margin-bottom: 20px;
    }
    .info-box {
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 12px;
      padding: 20px;
      margin: 30px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #9ca3af;
      font-size: 14px;
    }
    .info-value {
      color: #3b82f6;
      font-weight: 600;
      font-size: 14px;
    }
    .warning {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 12px;
      padding: 16px;
      margin: 20px 0;
      color: #ef4444;
      font-size: 14px;
    }
    .security-tips {
      background: rgba(31, 41, 55, 0.5);
      border-radius: 12px;
      padding: 20px;
      margin: 30px 0;
    }
    .security-tips h3 {
      margin: 0 0 15px 0;
      color: #3b82f6;
      font-size: 16px;
    }
    .security-tips ul {
      margin: 0;
      padding-left: 20px;
      color: #9ca3af;
      font-size: 14px;
    }
    .security-tips li {
      margin-bottom: 8px;
      line-height: 1.5;
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
    .footer a {
      color: #3b82f6;
      text-decoration: none;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="success-icon">✅</div>
      <h1>Senha Alterada com Sucesso!</h1>
    </div>
    
    <div class="content">
      <p class="greeting">Olá, ${userName}! 👋</p>
      
      <p class="message">
        Sua senha foi alterada com sucesso na <strong>Garagem Inteligente</strong>.
      </p>
      
      <div class="info-box">
        <div class="info-row">
          <span class="info-label">📅 Data e Hora</span>
          <span class="info-value">${timestamp}</span>
        </div>
        <div class="info-row">
          <span class="info-label">🔐 Ação</span>
          <span class="info-value">Alteração de Senha</span>
        </div>
        <div class="info-row">
          <span class="info-label">✅ Status</span>
          <span class="info-value">Concluído</span>
        </div>
      </div>
      
      <div class="warning">
        <strong>⚠️ Você não fez essa alteração?</strong><br>
        Se você não solicitou essa mudança, sua conta pode estar comprometida. 
        Entre em contato conosco imediatamente.
      </div>
      
      <div class="security-tips">
        <h3>🛡️ Dicas de Segurança</h3>
        <ul>
          <li>Use senhas fortes com letras, números e símbolos</li>
          <li>Não compartilhe sua senha com outras pessoas</li>
          <li>Ative a autenticação em duas etapas quando disponível</li>
          <li>Evite usar a mesma senha em múltiplos serviços</li>
          <li>Troque sua senha regularmente</li>
        </ul>
      </div>
      
      <div class="button-container">
        <a href="https://app-garageminteligente.web.app" class="button">Acessar Minha Conta</a>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Garagem Inteligente</strong></p>
      <p>Gerencie seus veículos de forma inteligente</p>
      <p style="margin-top: 20px;">
        Precisa de ajuda? <a href="mailto:suporte@garageminteligente.app">Entre em contato</a>
      </p>
      <p style="margin-top: 20px; font-size: 12px;">
        Este é um email automático, por favor não responda.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
