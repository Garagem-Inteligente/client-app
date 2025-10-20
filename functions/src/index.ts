import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2/options";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import sgMail from "@sendgrid/mail";
import { jsPDF } from "jspdf";
import { defineSecret } from "firebase-functions/params";
import cors from "cors";

// Define SendGrid API Key as Firebase Secret
const sendgridApiKey = defineSecret("SENDGRID_API_KEY");

// Set global options for all functions
setGlobalOptions({
  region: "us-central1",
  memory: "512MiB",
  timeoutSeconds: 60,
  maxInstances: 100,
});

// Initialize Firebase Admin
admin.initializeApp();

// Types
interface PasswordResetEmailData {
  email: string;
}

interface PasswordChangeConfirmationData {
  email: string;
  userName?: string;
}

interface FunctionResponse {
  success: boolean
  message: string
}

interface InitiateTransferData {
  vehicleId: string
  toEmail: string
  message?: string
}

interface ConfirmTransferData {
  transferId: string
  confirmationCode: string
  isNewOwner: boolean
}

interface CancelTransferData {
  transferId: string
}

/**
 * Send password reset email with SendGrid
 */
export const sendPasswordResetEmail = onCall<PasswordResetEmailData>(
  {
    cors: [
      "http://localhost:5173",
      "http://localhost:8100",
      "https://app-garageminteligente.web.app",
      "https://app-garageminteligente.firebaseapp.com",
      /\.firebaseapp\.com$/,
      /\.web\.app$/,
    ],
    secrets: [sendgridApiKey],
  },
  async (request): Promise<FunctionResponse> => {
    // Configure SendGrid with secret
    sgMail.setApiKey(sendgridApiKey.value());
    logger.info("Password reset email requested", {
      hasAuth: !!request.auth,
    });

    // Verify authentication
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Usuário não autenticado");
    }

    const { email } = request.data;

    if (!email) {
      throw new HttpsError("invalid-argument", "Email é obrigatório");
    }

    try {
      // Generate password reset link
      const resetLink = await admin.auth().generatePasswordResetLink(email);

      // Send email via SendGrid
      const msg = {
        to: email,
        from: {
          email: "contato@agenciaragnar.com.br",
          name: "Garagem Inteligente",
        },
        subject: "🔐 Redefinição de Senha - Garagem Inteligente",
        html: getPasswordResetEmailTemplate(resetLink),
      };

      await sgMail.send(msg);

      logger.info("Password reset email sent successfully", { email });

      return {
        success: true,
        message: "Email de redefinição enviado com sucesso",
      };
    } catch (error) {
      logger.error("Error sending password reset email:", error);
      throw new HttpsError(
        "internal",
        "Erro ao enviar email de redefinição de senha"
      );
    }
  }
);

/**
 * Send password change confirmation email
 */
export const sendPasswordChangeConfirmation = onCall<
  PasswordChangeConfirmationData
>(
  {
    cors: [
      "http://localhost:5173",
      "http://localhost:8100",
      "https://app-garageminteligente.web.app",
      "https://app-garageminteligente.firebaseapp.com",
      /\.firebaseapp\.com$/,
      /\.web\.app$/,
    ],
    secrets: [sendgridApiKey],
  },
  async (request): Promise<FunctionResponse> => {
    // Configure SendGrid with secret
    sgMail.setApiKey(sendgridApiKey.value());
    logger.info("Password change confirmation requested", {
      hasAuth: !!request.auth,
    });

    // Verify authentication
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Usuário não autenticado");
    }

    const { email, userName } = request.data;

    if (!email) {
      throw new HttpsError("invalid-argument", "Email é obrigatório");
    }

    try {
      // Send confirmation email via SendGrid
      const msg = {
        to: email,
        from: {
          email: "contato@agenciaragnar.com.br",
          name: "Garagem Inteligente",
        },
        subject: "✅ Senha Alterada com Sucesso - Garagem Inteligente",
        html: getPasswordChangeConfirmationTemplate(userName || "Usuário"),
      };

      await sgMail.send(msg);

      logger.info("Password change confirmation sent successfully", { email });

      return {
        success: true,
        message: "Email de confirmação enviado com sucesso",
      };
    } catch (error) {
      logger.error("Error sending password change confirmation:", error);
      throw new HttpsError(
        "internal",
        "Erro ao enviar email de confirmação"
      );
    }
  }
);

/**
 * Modern password reset email template
 * @param {string} resetLink - The password reset link
 * @return {string} - The HTML email template
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
 * @param {string} userName - The user's name
 * @return {string} - The HTML email template
 */
function getPasswordChangeConfirmationTemplate(userName: string): string {
  const timestamp = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

// Initialize CORS middleware
const corsHandler = cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:8100",
    "https://app-garageminteligente.web.app",
    "https://app-garageminteligente.firebaseapp.com",
  ],
  credentials: true,
});

/**
 * Generate maintenance history PDF for a vehicle (HTTP endpoint with CORS)
 */
export const generateMaintenancePDF = onRequest(
  {
    memory: "512MiB",
    timeoutSeconds: 120,
    secrets: [sendgridApiKey],
  },
  async (req, res) => {
    // Configure SendGrid with secret
    sgMail.setApiKey(sendgridApiKey.value());
    // Handle CORS
    return corsHandler(req, res, async () => {
      try {
        // Get auth token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
          res.status(401).json({
            success: false,
            message: "Usuário não autenticado",
          });
          return;
        }

        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        const userId = decodedToken.uid;

        // Get request data
        const { vehicleId } = req.body.data || req.body;

        if (!vehicleId) {
          res.status(400).json({
            success: false,
            message: "vehicleId é obrigatório",
          });
          return;
        }

        logger.info("PDF generation requested", {
          vehicleId,
          userId,
        });

        // Fetch vehicle data
        const vehicleDoc = await admin
          .firestore()
          .collection("vehicles")
          .doc(vehicleId)
          .get();

        if (!vehicleDoc.exists) {
          throw new HttpsError("not-found", "Veículo não encontrado");
        }

        const vehicleData = vehicleDoc.data();

        // Verify ownership
        if (vehicleData?.userId !== userId) {
          throw new HttpsError(
            "permission-denied",
            "Você não tem permissão para acessar este veículo"
          );
        }

        // Fetch maintenance records
        const maintenanceSnapshot = await admin
          .firestore()
          .collection("maintenance")
          .where("vehicleId", "==", vehicleId)
          .where("userId", "==", userId)
          .orderBy("date", "desc")
          .get();

        const maintenanceRecords = maintenanceSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Generate PDF
        // eslint-disable-next-line new-cap
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Configure font for better Unicode support
        pdf.setFont("helvetica");

        // Header with logo placeholder
        pdf.setFillColor(30, 41, 59); // slate-800
        pdf.rect(0, 0, pageWidth, 40, "F");

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(24);
        pdf.setFont("helvetica", "bold");
        pdf.text("Garagem Inteligente", 15, 20);

        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        pdf.text("Histórico de Manutenção", 15, 30);

        // Vehicle info box
        pdf.setFillColor(241, 245, 249); // slate-100
        pdf.rect(15, 50, pageWidth - 30, 50, "F");

        pdf.setTextColor(15, 23, 42); // slate-900
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text(
          `${vehicleData?.make || ""} ${vehicleData?.model || ""}`,
          20,
          62
        );

        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Placa: ${vehicleData?.plate || "N/A"}`, 20, 70);
        pdf.text(`Ano: ${vehicleData?.year || "N/A"}`, 20, 77);
        pdf.text(
          `Quilometragem Atual: ${
            vehicleData?.mileage?.toLocaleString("pt-BR") || "N/A"
          } km`,
          20,
          84
        );
        pdf.text(
          `Combustível: ${
            translateFuelType(vehicleData?.fuelType) || "N/A"
          }`,
          20,
          91
        );

        pdf.setTextColor(100, 116, 139); // slate-500
        pdf.setFontSize(9);
        pdf.text(
          `Gerado em: ${new Date().toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}`,
          pageWidth - 15,
          95,
          { align: "right" }
        );

        // Summary statistics
        const totalMaintenance = maintenanceRecords.length;
        const totalCost = maintenanceRecords.reduce(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (sum: number, record: any) => sum + (record.cost || 0),
          0
        );

        pdf.setFontSize(14);
        pdf.setTextColor(15, 23, 42);
        pdf.setFont("helvetica", "bold");
        pdf.text("Resumo Geral", 15, 115);

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(
          `Total de Manutenções: ${totalMaintenance}`,
          20,
          125
        );
        pdf.text(
          `Investimento Total: R$ ${totalCost.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          20,
          132
        );

        if (totalMaintenance > 0) {
          const avgCost = totalCost / totalMaintenance;
          pdf.text(
            `Custo Médio por Manutenção: R$ ${avgCost.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            20,
            139
          );
        }

        // Timeline section
        let yPosition = 155;

        if (maintenanceRecords.length > 0) {
          pdf.setFontSize(14);
          pdf.setFont("helvetica", "bold");
          pdf.text("Linha do Tempo", 15, yPosition);

          yPosition += 10;

          // Draw timeline
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          maintenanceRecords.forEach((record: any, index: number) => {
          // Check if need new page
            if (yPosition > pageHeight - 40) {
              pdf.addPage();
              yPosition = 20;
            }

            const date = record.date?.toDate ?
              record.date.toDate() :
              new Date(record.date);
            const dateStr = date.toLocaleDateString("pt-BR");

            // Timeline dot and line
            pdf.setFillColor(59, 130, 246); // blue-500
            pdf.circle(20, yPosition, 2, "F");

            if (index < maintenanceRecords.length - 1) {
              pdf.setDrawColor(203, 213, 225); // slate-300
              pdf.setLineWidth(0.5);
              pdf.line(20, yPosition + 2, 20, yPosition + 18);
            }

            // Maintenance info
            pdf.setTextColor(15, 23, 42);
            pdf.setFontSize(11);
            pdf.setFont("helvetica", "bold");
            const maintenanceType = translateMaintenanceType(record.type);
            pdf.text(maintenanceType, 28, yPosition);

            pdf.setFontSize(9);
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(71, 85, 105); // slate-600
            pdf.text(dateStr, 28, yPosition + 5);

            pdf.setTextColor(100, 116, 139); // slate-500
            pdf.text(record.description || "", 28, yPosition + 10);

            // Cost and mileage
            pdf.setTextColor(15, 23, 42);
            pdf.text(
              `R$ ${(record.cost || 0).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}`,
              pageWidth - 60,
              yPosition
            );

            pdf.setTextColor(100, 116, 139);
            pdf.text(
              `${(record.mileage || 0).toLocaleString("pt-BR")} km`,
              pageWidth - 60,
              yPosition + 5
            );

            yPosition += 20;
          });
        } else {
          pdf.setFontSize(11);
          pdf.setFont("helvetica", "italic");
          pdf.setTextColor(100, 116, 139);
          pdf.text("Nenhuma manutenção registrada", 20, yPosition);
        }

        // Footer on last page
        const footerY = pageHeight - 15;
        pdf.setFontSize(8);
        pdf.setTextColor(148, 163, 184); // slate-400
        pdf.text(
          "Garagem Inteligente - Gestão Inteligente de Veículos",
          pageWidth / 2,
          footerY,
          { align: "center" }
        );
        pdf.text(
          `Página ${pdf.getCurrentPageInfo().pageNumber}`,
          pageWidth - 15,
          footerY,
          { align: "right" }
        );

        // Convert PDF to buffer
        const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

        // Upload to Firebase Storage
        const fileName = `maintenance-history-${vehicleId}-${Date.now()}.pdf`;
        const bucket = admin.storage().bucket();
        const file = bucket.file(`exports/${userId}/${fileName}`);

        await file.save(pdfBuffer, {
          metadata: {
            contentType: "application/pdf",
            metadata: {
              vehicleId,
              userId,
              generatedAt: new Date().toISOString(),
            },
          },
          public: true,
        });

        // Get public URL
        const url = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

        logger.info("PDF generated successfully", { vehicleId, fileName });

        // Get user email for sending the PDF
        const userDoc = await admin
          .firestore()
          .collection("users")
          .doc(userId)
          .get();

        const userData = userDoc.data();
        const userEmail = userData?.email || decodedToken.email;
        const userName = userData?.name || decodedToken.name || "Usuário";

        // Send PDF via email if user has email
        if (userEmail) {
          try {
            const vehicleInfo = `${vehicleData?.make || ""} ${vehicleData?.model || ""} - ${vehicleData?.plate || ""}`;

            const msg = {
              to: userEmail,
              from: {
                email: "contato@agenciaragnar.com.br",
                name: "Garagem Inteligente",
              },
              subject: `📄 Histórico de Manutenção - ${vehicleInfo}`,
              html: getPDFEmailTemplate(userName, vehicleInfo, url),
            };

            await sgMail.send(msg);
            logger.info("PDF email sent successfully", { email: userEmail, vehicleId });
          } catch (emailError) {
            logger.error("Error sending PDF email (non-blocking)", emailError);
            // Don't fail the request if email fails
          }
        }

        res.status(200).json({
          success: true,
          pdfUrl: url,
          message: "PDF gerado com sucesso e enviado por e-mail",
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        logger.error("Error generating PDF", error);

        res.status(500).json({
          success: false,
          message: `Erro ao gerar PDF: ${error.message || "Erro desconhecido"}`,
        });
      }
    });
  }
);

/**
 * Translates maintenance type code to Portuguese label
 * @param {string} type - The maintenance type code
 * @return {string} - The translated label
 */
function translateMaintenanceType(type: string): string {
  const types: Record<string, string> = {
    oil_change: "Troca de Oleo",
    oil_filter: "Filtro de Oleo",
    air_filter: "Filtro de Ar",
    fuel_filter: "Filtro de Combustivel",
    cabin_filter: "Filtro de Cabine",
    tire_rotation: "Rodizio de Pneus",
    tire_replacement: "Troca de Pneus",
    wheel_alignment: "Alinhamento",
    wheel_balancing: "Balanceamento",
    brake_pads: "Pastilhas de Freio",
    brake_discs: "Discos de Freio",
    brake_fluid: "Fluido de Freio",
    battery: "Bateria",
    spark_plugs: "Velas de Ignicao",
    timing_belt: "Correia Dentada",
    serpentine_belt: "Correia Serpentina",
    coolant: "Fluido de Arrefecimento",
    transmission_fluid: "Fluido de Transmissao",
    power_steering_fluid: "Fluido da Direcao",
    windshield_wipers: "Palhetas do Limpador",
    air_conditioning: "Ar Condicionado",
    suspension: "Suspensao",
    exhaust_system: "Sistema de Escape",
    general_inspection: "Inspecao Geral",
    other: "Outro",
  };

  return types[type] || type;
}

/**
 * Translates fuel type code to Portuguese label
 * @param {string} type - The fuel type code
 * @return {string} - The translated label
 */
function translateFuelType(type: string): string {
  const types: Record<string, string> = {
    "flex": "Flex (Gasolina/Etanol)",
    "gasoline": "Gasolina",
    "ethanol": "Etanol",
    "diesel": "Diesel",
    "electric": "Elétrico",
    "hybrid-plugin": "Híbrido Plugin",
    "hybrid-mild": "Híbrido Mild",
    "gnv": "GNV (Gás Natural)",
  };

  return types[type] || type;
}

/**
 * PDF export email template
 * @param {string} userName - The user's name
 * @param {string} vehicleInfo - The vehicle information
 * @param {string} pdfUrl - The PDF download URL
 * @return {string} - The HTML email template
 */
function getPDFEmailTemplate(
  userName: string,
  vehicleInfo: string,
  pdfUrl: string
): string {
  const timestamp = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Histórico de Manutenção Pronto</title>
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
    .vehicle-box {
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 12px;
      padding: 20px;
      margin: 30px 0;
      text-align: center;
    }
    .vehicle-info {
      font-size: 18px;
      font-weight: 600;
      color: #3b82f6;
      margin-bottom: 10px;
    }
    .timestamp {
      font-size: 14px;
      color: #9ca3af;
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
    .info-box {
      background: rgba(251, 191, 36, 0.1);
      border: 1px solid rgba(251, 191, 36, 0.3);
      border-radius: 12px;
      padding: 16px;
      margin: 20px 0;
      font-size: 14px;
      color: #fbbf24;
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
    .features {
      background: rgba(31, 41, 55, 0.5);
      border-radius: 12px;
      padding: 20px;
      margin: 30px 0;
    }
    .features h3 {
      margin: 0 0 15px 0;
      color: #3b82f6;
      font-size: 16px;
    }
    .features ul {
      margin: 0;
      padding-left: 20px;
      color: #9ca3af;
      font-size: 14px;
    }
    .features li {
      margin-bottom: 8px;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="icon">📄</div>
      <h1>Histórico de Manutenção Pronto!</h1>
    </div>
    
    <div class="content">
      <p class="greeting">Olá, ${userName}! 👋</p>
      
      <p class="message">
        Seu <strong>Histórico de Manutenção em PDF</strong> foi gerado com sucesso e está pronto para download!
      </p>
      
      <div class="vehicle-box">
        <div class="vehicle-info">🚗 ${vehicleInfo}</div>
        <div class="timestamp">Gerado em ${timestamp}</div>
      </div>
      
      <p class="message">
        O PDF contém todas as informações sobre as manutenções realizadas no seu veículo, incluindo:
      </p>
      
      <div class="features">
        <h3>📋 Conteúdo do Relatório</h3>
        <ul>
          <li>Informações completas do veículo</li>
          <li>Resumo geral de manutenções e custos</li>
          <li>Linha do tempo detalhada de todas as manutenções</li>
          <li>Valores investidos e quilometragem</li>
          <li>Histórico completo organizado por data</li>
        </ul>
      </div>
      
      <div class="button-container">
        <a href="${pdfUrl}" class="button">📥 Baixar PDF</a>
      </div>
      
      <div class="info-box">
        <strong>💡 Dica:</strong> Salve este PDF em local seguro para ter um
        registro completo da manutenção do seu veículo. 
        Esse documento pode ser útil na hora de vender o veículo ou para
        controle pessoal.
      </div>
      
      <p class="message" style="margin-top: 30px; text-align: center;">
        Continue gerenciando seu veículo de forma inteligente! 🚀
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

// ==================== VEHICLE TRANSFER SYSTEM ====================

/**
 * Generate a random 6-character confirmation code
 * @return {string} - Random code (alphanumeric uppercase)
 */
function generateConfirmationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Partially hide email for privacy
 * @param {string} email - Email to hide
 * @return {string} - Partially hidden email
 */
function hideEmail(email: string): string {
  const [username, domain] = email.split("@");
  if (!username || !domain) return email;
  
  if (username.length <= 2) {
    return `${username[0]}***@${domain}`;
  }
  
  return `${username[0]}***${username[username.length - 1]}@${domain}`;
}

/**
 * Current owner transfer confirmation email template
 * @param {string} ownerName - Current owner name
 * @param {string} vehicleInfo - Vehicle information
 * @param {string} toEmail - New owner email
 * @param {string} code - Confirmation code
 * @param {string} message - Optional message
 * @return {string} - HTML email template
 */
function getOwnerTransferConfirmationTemplate(
  ownerName: string,
  vehicleInfo: string,
  toEmail: string,
  code: string,
  message?: string
): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirme a Transferência do Veículo</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f3f4f6;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      padding: 30px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px;
    }
    .vehicle-box {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .warning-box {
      background: #fee2e2;
      border-left: 4px solid #ef4444;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .warning-box h3 {
      margin: 0 0 15px 0;
      color: #b91c1c;
    }
    .warning-box ul {
      margin: 0;
      padding-left: 20px;
    }
    .code-box {
      background: #1f2937;
      color: white;
      text-align: center;
      padding: 30px;
      margin: 30px 0;
      border-radius: 12px;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 8px;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: #f59e0b;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 10px 0;
    }
    .footer {
      background: #f9fafb;
      padding: 20px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔄 Confirme a Transferência</h1>
    </div>
    
    <div class="content">
      <p>Olá, <strong>${ownerName}</strong>!</p>
      
      <p>Você iniciou a transferência do veículo:</p>
      
      <div class="vehicle-box">
        <strong>🚗 ${vehicleInfo}</strong><br>
        Para: ${toEmail}
        ${message ? `<br><br>Mensagem: "${message}"` : ""}
      </div>
      
      <div class="warning-box">
        <h3>⚠️ ATENÇÃO - LEIA COM CUIDADO</h3>
        <p>Ao confirmar esta transferência:</p>
        <ul>
          <li>✓ Todo o histórico de manutenções será transferido</li>
          <li>✓ O novo proprietário terá acesso completo aos dados</li>
          <li>✓ Você não poderá mais editar o histórico deste veículo</li>
          <li>✓ O veículo será movido para "Carros Transferidos"</li>
          <li>✓ Você poderá apenas visualizar o histórico anterior</li>
        </ul>
        <p><strong>Esta ação é IRREVERSÍVEL após ambas as confirmações!</strong></p>
      </div>
      
      <p>Seu código de confirmação:</p>
      
      <div class="code-box">${code}</div>
      
      <p><strong>Para confirmar:</strong></p>
      <ol>
        <li>Acesse a plataforma Garagem Inteligente</li>
        <li>Vá em "Meus Veículos" > Selecione o veículo > "Transferir"</li>
        <li>Digite o código acima</li>
        <li>Aguarde a confirmação do novo proprietário</li>
      </ol>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://app-garageminteligente.web.app" class="button">
          Acessar Plataforma
        </a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        ⏰ Este código expira em 7 dias<br>
        ❌ Para cancelar, acesse a plataforma antes de confirmar
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Garagem Inteligente</strong></p>
      <p>Este é um email automático, por favor não responda.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * New owner transfer invitation email template
 * @param {string} fromName - Current owner name
 * @param {string} vehicleInfo - Vehicle information
 * @param {string} code - Confirmation code
 * @param {string} message - Optional message from seller
 * @return {string} - HTML email template
 */
function getNewOwnerTransferInvitationTemplate(
  fromName: string,
  vehicleInfo: string,
  code: string,
  message?: string
): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Você Recebeu um Veículo!</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f3f4f6;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 30px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px;
    }
    .vehicle-box {
      background: #d1fae5;
      border-left: 4px solid #10b981;
      padding: 15px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .info-box {
      background: #dbeafe;
      border-left: 4px solid #3b82f6;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .info-box h3 {
      margin: 0 0 15px 0;
      color: #1e40af;
    }
    .info-box ul {
      margin: 0;
      padding-left: 20px;
    }
    .code-box {
      background: #1f2937;
      color: white;
      text-align: center;
      padding: 30px;
      margin: 30px 0;
      border-radius: 12px;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 8px;
    }
    .message-box {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 20px 0;
      border-radius: 8px;
      font-style: italic;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: #10b981;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 10px 0;
    }
    .footer {
      background: #f9fafb;
      padding: 20px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Você Recebeu um Veículo!</h1>
    </div>
    
    <div class="content">
      <p>Olá!</p>
      
      <p><strong>${fromName}</strong> está transferindo o seguinte veículo para você:</p>
      
      <div class="vehicle-box">
        <strong>🚗 ${vehicleInfo}</strong>
      </div>
      
      ${message ? `
      <div class="message-box">
        <strong>💬 Mensagem do vendedor:</strong><br>
        "${message}"
      </div>
      ` : ""}
      
      <div class="info-box">
        <h3>📋 O que você vai receber:</h3>
        <ul>
          <li>✓ Histórico completo de manutenções</li>
          <li>✓ Todos os documentos e informações do veículo</li>
          <li>✓ Acesso total para edição e gerenciamento</li>
          <li>✓ Continuar registrando novas manutenções</li>
        </ul>
      </div>
      
      <p><strong>Como aceitar a transferência:</strong></p>
      
      <ol>
        <li>Se você ainda não tem conta, <strong>cadastre-se</strong> com este email</li>
        <li>Acesse a plataforma Garagem Inteligente</li>
        <li>Vá em "Transferências Pendentes"</li>
        <li>Digite o código de confirmação abaixo</li>
      </ol>
      
      <p>Seu código de confirmação:</p>
      
      <div class="code-box">${code}</div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://app-garageminteligente.web.app" class="button">
          Acessar Plataforma
        </a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        ⏰ Este código expira em 7 dias<br>
        ℹ️ A transferência só será concluída após ambas as partes confirmarem
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Garagem Inteligente</strong></p>
      <p>Gerencie seus veículos de forma inteligente</p>
      <p style="margin-top: 10px;">Este é um email automático, por favor não responda.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Transfer completion confirmation email template
 * @param {string} userName - User name
 * @param {string} vehicleInfo - Vehicle information
 * @param {boolean} isNewOwner - Whether this is the new owner
 * @return {string} - HTML email template
 */
function getTransferCompletionTemplate(
  userName: string,
  vehicleInfo: string,
  isNewOwner: boolean
): string {
  const timestamp = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isNewOwner) {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Transferência Concluída!</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f3f4f6;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 30px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px;
    }
    .success-box {
      background: #d1fae5;
      border-left: 4px solid #10b981;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
      text-align: center;
    }
    .info-box {
      background: #dbeafe;
      border-left: 4px solid #3b82f6;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: #10b981;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 10px 0;
    }
    .footer {
      background: #f9fafb;
      padding: 20px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Transferência Concluída!</h1>
    </div>
    
    <div class="content">
      <p>Parabéns, <strong>${userName}</strong>! 🎉</p>
      
      <div class="success-box">
        <h2 style="margin: 0 0 10px 0; color: #059669;">🚗 ${vehicleInfo}</h2>
        <p style="margin: 0; color: #065f46;">Agora é oficialmente seu!</p>
      </div>
      
      <p>A transferência foi concluída com sucesso em <strong>${timestamp}</strong>.</p>
      
      <div class="info-box">
        <h3 style="margin: 0 0 15px 0; color: #1e40af;">O que você pode fazer agora:</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li>✓ Visualizar todo o histórico de manutenções</li>
          <li>✓ Adicionar novas manutenções</li>
          <li>✓ Editar informações do veículo</li>
          <li>✓ Gerar relatórios em PDF</li>
          <li>✓ Gerenciar lembretes de manutenção</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://app-garageminteligente.web.app" class="button">
          Ver Meu Veículo
        </a>
      </div>
      
      <p style="text-align: center; color: #10b981; font-weight: 600;">
        Bem-vindo à Garagem Inteligente! 🚀
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Garagem Inteligente</strong></p>
      <p>Gerencie seus veículos de forma inteligente</p>
      <p style="margin-top: 10px;">Este é um email automático, por favor não responda.</p>
    </div>
  </div>
</body>
</html>
    `;
  } else {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Transferência Concluída</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f3f4f6;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      padding: 30px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px;
    }
    .info-box {
      background: #dbeafe;
      border-left: 4px solid #3b82f6;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
      text-align: center;
    }
    .access-box {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: #3b82f6;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 10px 0;
    }
    .footer {
      background: #f9fafb;
      padding: 20px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Transferência Concluída</h1>
    </div>
    
    <div class="content">
      <p>Olá, <strong>${userName}</strong>!</p>
      
      <div class="info-box">
        <h2 style="margin: 0 0 10px 0; color: #1e40af;">🚗 ${vehicleInfo}</h2>
        <p style="margin: 0; color: #1e40af;">Foi transferido com sucesso</p>
      </div>
      
      <p>A transferência foi concluída em <strong>${timestamp}</strong>.</p>
      
      <div class="access-box">
        <h3 style="margin: 0 0 15px 0; color: #d97706;">📖 Acesso ao Histórico</h3>
        <p style="margin: 0;">
          O veículo foi movido para <strong>"Carros Transferidos"</strong>.<br>
          Você pode visualizar o histórico completo, mas não poderá mais editá-lo.
        </p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://app-garageminteligente.web.app" class="button">
          Ver Carros Transferidos
        </a>
      </div>
      
      <p style="text-align: center; color: #6b7280;">
        Obrigado por usar a Garagem Inteligente! 🙏
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Garagem Inteligente</strong></p>
      <p>Gerencie seus veículos de forma inteligente</p>
      <p style="margin-top: 10px;">Este é um email automático, por favor não responda.</p>
    </div>
  </div>
</body>
</html>
    `;
  }
}

// ==================== VEHICLE TRANSFER CLOUD FUNCTIONS ====================

/**
 * Initiate vehicle transfer to a new owner
 */
export const initiateVehicleTransfer = onCall<InitiateTransferData>(
  {
    cors: [
      "http://localhost:5173",
      "http://localhost:8100",
      "https://app-garageminteligente.web.app",
      "https://app-garageminteligente.firebaseapp.com",
      /\.firebaseapp\.com$/,
      /\.web\.app$/,
    ],
    secrets: [sendgridApiKey],
  },
  async (request): Promise<FunctionResponse> => {
    // Configure SendGrid with secret
    sgMail.setApiKey(sendgridApiKey.value());
    
    logger.info("Vehicle transfer initiation requested", {
      hasAuth: !!request.auth,
    });

    // Verify authentication
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Usuário não autenticado");
    }

    const { vehicleId, toEmail, message } = request.data;
    const userId = request.auth.uid;

    // Validate inputs
    if (!vehicleId || !toEmail) {
      throw new HttpsError(
        "invalid-argument",
        "vehicleId e toEmail são obrigatórios"
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(toEmail)) {
      throw new HttpsError("invalid-argument", "Email inválido");
    }

    try {
      const db = admin.firestore();

      // Get vehicle data
      const vehicleDoc = await db.collection("vehicles").doc(vehicleId).get();

      if (!vehicleDoc.exists) {
        throw new HttpsError("not-found", "Veículo não encontrado");
      }

      const vehicleData = vehicleDoc.data();

      // Verify ownership
      if (vehicleData?.userId !== userId) {
        throw new HttpsError(
          "permission-denied",
          "Você não tem permissão para transferir este veículo"
        );
      }

      // Check if there's already a pending transfer for this vehicle
      const existingTransferQuery = await db
        .collection("transfers")
        .where("vehicleId", "==", vehicleId)
        .where("status", "in", ["pending", "confirmed"])
        .get();

      if (!existingTransferQuery.empty) {
        throw new HttpsError(
          "already-exists",
          "Já existe uma transferência pendente para este veículo"
        );
      }

      // Get current user data
      const userDoc = await db.collection("users").doc(userId).get();
      const userData = userDoc.data();
      const userName = userData?.name || request.auth.token.name || "Usuário";
      const userEmail = userData?.email || request.auth.token.email || "";

      // Generate confirmation codes
      const fromConfirmationCode = generateConfirmationCode();
      const toConfirmationCode = generateConfirmationCode();

      // Create vehicle info string
      const vehicleInfo =
        `${vehicleData?.make || ""} ${vehicleData?.model || ""} ` +
        `${vehicleData?.year || ""} - ${vehicleData?.plate || ""}`;

      // Create transfer document
      const transferDoc = {
        vehicleId,
        vehicleName: `${vehicleData?.make || ""} ${vehicleData?.model || ""}`,
        vehiclePlate: vehicleData?.plate || "",
        fromUserId: userId,
        fromUserName: userName,
        fromUserEmail: userEmail,
        toEmail: toEmail.toLowerCase().trim(),
        toUserId: null,
        toUserName: null,
        fromConfirmationCode,
        toConfirmationCode,
        fromConfirmed: false,
        toConfirmed: false,
        status: "pending",
        message: message || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: admin.firestore.Timestamp.fromDate(
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        ),
        completedAt: null,
      };

      const transferRef = await db.collection("transfers").add(transferDoc);

      logger.info("Transfer document created", {
        transferId: transferRef.id,
        vehicleId,
        fromUserId: userId,
        toEmail,
      });

      // Send email to current owner
      try {
        const ownerMsg = {
          to: userEmail,
          from: {
            email: "contato@agenciaragnar.com.br",
            name: "Garagem Inteligente",
          },
          subject: `🔄 Confirme a Transferência - ${vehicleInfo}`,
          html: getOwnerTransferConfirmationTemplate(
            userName,
            vehicleInfo,
            hideEmail(toEmail),
            fromConfirmationCode,
            message
          ),
        };

        await sgMail.send(ownerMsg);
        logger.info("Owner confirmation email sent", { email: userEmail });
      } catch (emailError) {
        logger.error("Error sending owner email (non-blocking)", emailError);
      }

      // Send email to new owner
      try {
        const newOwnerMsg = {
          to: toEmail,
          from: {
            email: "contato@agenciaragnar.com.br",
            name: "Garagem Inteligente",
          },
          subject: `🎉 Você Recebeu um Veículo - ${vehicleInfo}`,
          html: getNewOwnerTransferInvitationTemplate(
            userName,
            vehicleInfo,
            toConfirmationCode,
            message
          ),
        };

        await sgMail.send(newOwnerMsg);
        logger.info("New owner invitation email sent", { email: toEmail });
      } catch (emailError) {
        logger.error("Error sending new owner email (non-blocking)", emailError);
      }

      return {
        success: true,
        message: "Transferência iniciada com sucesso. Emails enviados para ambas as partes.",
      };
    } catch (error) {
      logger.error("Error initiating vehicle transfer", error);

      if (error instanceof HttpsError) {
        throw error;
      }

      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      throw new HttpsError("internal", `Erro ao iniciar transferência: ${errorMessage}`);
    }
  }
);

/**
 * Confirm vehicle transfer with confirmation code
 */
export const confirmVehicleTransfer = onCall<ConfirmTransferData>(
  {
    cors: [
      "http://localhost:5173",
      "http://localhost:8100",
      "https://app-garageminteligente.web.app",
      "https://app-garageminteligente.firebaseapp.com",
      /\.firebaseapp\.com$/,
      /\.web\.app$/,
    ],
    secrets: [sendgridApiKey],
  },
  async (request): Promise<FunctionResponse> => {
    // Configure SendGrid with secret
    sgMail.setApiKey(sendgridApiKey.value());
    
    logger.info("Vehicle transfer confirmation requested", {
      hasAuth: !!request.auth,
    });

    // Verify authentication
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Usuário não autenticado");
    }

    const { transferId, confirmationCode, isNewOwner } = request.data;
    const userId = request.auth.uid;

    // Validate inputs
    if (!transferId || !confirmationCode) {
      throw new HttpsError(
        "invalid-argument",
        "transferId e confirmationCode são obrigatórios"
      );
    }

    try {
      const db = admin.firestore();
      const transferRef = db.collection("transfers").doc(transferId);
      const transferDoc = await transferRef.get();

      if (!transferDoc.exists) {
        throw new HttpsError("not-found", "Transferência não encontrada");
      }

      const transferData = transferDoc.data();

      // Check if transfer is expired
      const expiresAt = transferData?.expiresAt?.toDate();
      if (expiresAt && expiresAt < new Date()) {
        await transferRef.update({
          status: "expired",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        throw new HttpsError("failed-precondition", "Esta transferência expirou");
      }

      // Check if transfer is still pending
      if (transferData?.status !== "pending" && transferData?.status !== "confirmed") {
        throw new HttpsError(
          "failed-precondition",
          `Esta transferência já foi ${transferData?.status === "completed" ? "concluída" : "cancelada"}`
        );
      }

      // Get user data
      const userDoc = await db.collection("users").doc(userId).get();
      const userData = userDoc.data();
      const userName = userData?.name || request.auth.token.name || "Usuário";
      const userEmail = userData?.email || request.auth.token.email || "";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Verify confirmation code and update accordingly
      if (isNewOwner) {
        // New owner confirmation
        if (confirmationCode !== transferData?.toConfirmationCode) {
          throw new HttpsError("invalid-argument", "Código de confirmação inválido");
        }

        // Verify email matches
        if (userEmail.toLowerCase() !== transferData?.toEmail?.toLowerCase()) {
          throw new HttpsError(
            "permission-denied",
            "Este código não pertence ao seu email"
          );
        }

        updateData.toConfirmed = true;
        updateData.toUserId = userId;
        updateData.toUserName = userName;
      } else {
        // Current owner confirmation
        if (confirmationCode !== transferData?.fromConfirmationCode) {
          throw new HttpsError("invalid-argument", "Código de confirmação inválido");
        }

        // Verify ownership
        if (userId !== transferData?.fromUserId) {
          throw new HttpsError(
            "permission-denied",
            "Você não é o proprietário deste veículo"
          );
        }

        updateData.fromConfirmed = true;
      }

      // Check if both parties have confirmed
      const bothConfirmed = isNewOwner ?
        (transferData?.fromConfirmed && true) :
        (true && transferData?.toConfirmed);

      if (bothConfirmed) {
        // Both confirmed - execute transfer
        updateData.status = "completed";
        updateData.completedAt = admin.firestore.FieldValue.serverTimestamp();

        // Start batch operation
        const batch = db.batch();

        // Update transfer document
        batch.update(transferRef, updateData);

        // Get vehicle data
        const vehicleRef = db.collection("vehicles").doc(transferData?.vehicleId);
        const vehicleDoc = await vehicleRef.get();
        const vehicleData = vehicleDoc.data();

        // Create historical snapshot for previous owner
        const transferredVehicleRef = db.collection("transferredVehicles").doc();
        batch.set(transferredVehicleRef, {
          id: transferredVehicleRef.id,
          vehicleId: transferData?.vehicleId,
          userId: transferData?.fromUserId,
          transferredAt: admin.firestore.FieldValue.serverTimestamp(),
          transferredTo: hideEmail(transferData?.toEmail),
          transferId,
          vehicleSnapshot: {
            make: vehicleData?.make || "",
            model: vehicleData?.model || "",
            year: vehicleData?.year || "",
            plate: vehicleData?.plate || "",
            mileage: vehicleData?.mileage || 0,
            imageUrl: vehicleData?.imageUrl || null,
          },
        });

        // Transfer vehicle ownership
        batch.update(vehicleRef, {
          userId: updateData.toUserId || transferData?.toUserId,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Update all maintenance records
        const maintenanceQuery = await db
          .collection("maintenance")
          .where("vehicleId", "==", transferData?.vehicleId)
          .get();

        maintenanceQuery.forEach((doc) => {
          batch.update(doc.ref, {
            userId: updateData.toUserId || transferData?.toUserId,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        });

        // Commit batch
        await batch.commit();

        logger.info("Vehicle transfer completed", {
          transferId,
          vehicleId: transferData?.vehicleId,
          fromUserId: transferData?.fromUserId,
          toUserId: updateData.toUserId || transferData?.toUserId,
        });

        // Send completion emails
        const vehicleInfo =
          `${vehicleData?.make || ""} ${vehicleData?.model || ""} ` +
          `${vehicleData?.year || ""} - ${vehicleData?.plate || ""}`;

        // Email to previous owner
        try {
          const prevOwnerMsg = {
            to: transferData?.fromUserEmail,
            from: {
              email: "contato@agenciaragnar.com.br",
              name: "Garagem Inteligente",
            },
            subject: `✅ Transferência Concluída - ${vehicleInfo}`,
            html: getTransferCompletionTemplate(
              transferData?.fromUserName || "Usuário",
              vehicleInfo,
              false
            ),
          };

          await sgMail.send(prevOwnerMsg);
          logger.info("Previous owner completion email sent");
        } catch (emailError) {
          logger.error("Error sending previous owner email", emailError);
        }

        // Email to new owner
        try {
          const newOwnerEmail = userEmail || transferData?.toEmail;
          const newOwnerMsg = {
            to: newOwnerEmail,
            from: {
              email: "contato@agenciaragnar.com.br",
              name: "Garagem Inteligente",
            },
            subject: `🎉 Parabéns! ${vehicleInfo} é Seu!`,
            html: getTransferCompletionTemplate(
              userName || transferData?.toUserName || "Usuário",
              vehicleInfo,
              true
            ),
          };

          await sgMail.send(newOwnerMsg);
          logger.info("New owner completion email sent");
        } catch (emailError) {
          logger.error("Error sending new owner email", emailError);
        }

        return {
          success: true,
          message: "Transferência concluída com sucesso! O veículo agora pertence ao novo proprietário.",
        };
      } else {
        // Only one party confirmed - update status to confirmed
        updateData.status = "confirmed";
        await transferRef.update(updateData);

        logger.info("Transfer partially confirmed", {
          transferId,
          isNewOwner,
          fromConfirmed: isNewOwner ? transferData?.fromConfirmed : true,
          toConfirmed: isNewOwner ? true : transferData?.toConfirmed,
        });

        return {
          success: true,
          message: "Confirmação registrada. Aguardando confirmação da outra parte.",
        };
      }
    } catch (error) {
      logger.error("Error confirming vehicle transfer", error);

      if (error instanceof HttpsError) {
        throw error;
      }

      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      throw new HttpsError("internal", `Erro ao confirmar transferência: ${errorMessage}`);
    }
  }
);

/**
 * Cancel a pending vehicle transfer
 */
export const cancelVehicleTransfer = onCall<CancelTransferData>(
  {
    cors: [
      "http://localhost:5173",
      "http://localhost:8100",
      "https://app-garageminteligente.web.app",
      "https://app-garageminteligente.firebaseapp.com",
      /\.firebaseapp\.com$/,
      /\.web\.app$/,
    ],
    secrets: [sendgridApiKey],
  },
  async (request): Promise<FunctionResponse> => {
    // Configure SendGrid with secret
    sgMail.setApiKey(sendgridApiKey.value());

    logger.info("Vehicle transfer cancellation requested", {
      hasAuth: !!request.auth,
    });

    // Verify authentication
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Usuário não autenticado");
    }

    const { transferId } = request.data;
    const userId = request.auth.uid;

    // Validate inputs
    if (!transferId) {
      throw new HttpsError("invalid-argument", "transferId é obrigatório");
    }

    try {
      const db = admin.firestore();
      const transferRef = db.collection("transfers").doc(transferId);
      const transferDoc = await transferRef.get();

      if (!transferDoc.exists) {
        throw new HttpsError("not-found", "Transferência não encontrada");
      }

      const transferData = transferDoc.data();

      // Only the current owner can cancel
      if (transferData?.fromUserId !== userId) {
        throw new HttpsError(
          "permission-denied",
          "Apenas o proprietário atual pode cancelar a transferência"
        );
      }

      // Check if transfer can be cancelled
      if (transferData?.status === "completed") {
        throw new HttpsError(
          "failed-precondition",
          "Transferência já foi concluída e não pode ser cancelada"
        );
      }

      if (transferData?.status === "cancelled") {
        throw new HttpsError(
          "failed-precondition",
          "Transferência já foi cancelada"
        );
      }

      if (transferData?.status === "expired") {
        throw new HttpsError("failed-precondition", "Transferência já expirou");
      }

      // Update transfer status to cancelled
      await transferRef.update({
        status: "cancelled",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      logger.info("Vehicle transfer cancelled", {
        transferId,
        vehicleId: transferData?.vehicleId,
        fromUserId: userId,
      });

      // Send cancellation email to new owner if they haven't confirmed yet
      if (!transferData?.toConfirmed) {
        try {
          const vehicleInfo =
            `${transferData?.vehicleName || ""} - ` +
            `${transferData?.vehiclePlate || ""}`;

          const cancellationMsg = {
            to: transferData?.toEmail,
            from: {
              email: "contato@agenciaragnar.com.br",
              name: "Garagem Inteligente",
            },
            subject: `❌ Transferência Cancelada - ${vehicleInfo}`,
            html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Transferência Cancelada</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f3f4f6;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      padding: 30px;
      text-align: center;
      color: white;
    }
    .content {
      padding: 30px;
    }
    .info-box {
      background: #fee2e2;
      border-left: 4px solid #ef4444;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .footer {
      background: #f9fafb;
      padding: 20px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>❌ Transferência Cancelada</h1>
    </div>

    <div class="content">
      <p>Olá!</p>

      <div class="info-box">
        <p><strong>${transferData?.fromUserName || "O proprietário"}</strong>
        cancelou a transferência do veículo:</p>
        <h3 style="margin: 10px 0; color: #dc2626;">🚗 ${vehicleInfo}</h3>
      </div>

      <p>Esta transferência foi cancelada e não é mais válida.</p>

      <p style="color: #6b7280;">
        Se você tinha interesse no veículo, entre em contato diretamente
        com o vendedor.
      </p>
    </div>

    <div class="footer">
      <p><strong>Garagem Inteligente</strong></p>
      <p>Este é um email automático, por favor não responda.</p>
    </div>
  </div>
</body>
</html>
            `,
          };

          await sgMail.send(cancellationMsg);
          logger.info("Cancellation email sent to new owner");
        } catch (emailError) {
          logger.error(
            "Error sending cancellation email (non-blocking)",
            emailError
          );
        }
      }

      return {
        success: true,
        message: "Transferência cancelada com sucesso",
      };
    } catch (error) {
      logger.error("Error cancelling vehicle transfer", error);

      if (error instanceof HttpsError) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      throw new HttpsError(
        "internal",
        `Erro ao cancelar transferência: ${errorMessage}`
      );
    }
  }
);
