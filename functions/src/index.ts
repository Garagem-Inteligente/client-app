/**
 * Firebase Cloud Functions para AutoCare
 * Sistema de envio de emails via SendGrid
 */
/* eslint-disable max-len, operator-linebreak */

import {setGlobalOptions} from "firebase-functions";
import {onCall, HttpsError} from "firebase-functions/v2/https";
import {getAuth} from "firebase-admin/auth";
import {initializeApp as initAdmin} from "firebase-admin/app";
import * as logger from "firebase-functions/logger";
import sgMail from "@sendgrid/mail";
import {defineSecret} from "firebase-functions/params";

// Configuração global
setGlobalOptions({maxInstances: 10});
// Inicializar Admin SDK
try {
  initAdmin();
} catch (e) {
  // já inicializado em ambiente de emulador/teste
}

// Definir secrets do SendGrid
const sendgridApiKey = defineSecret("SENDGRID_API_KEY");
const sendgridFromEmail = defineSecret("SENDGRID_FROM_EMAIL");

// Interfaces
interface SendTransferEmailData {
  to: string;
  ownerName: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  transferCode: string;
  isOwner: boolean;
}

interface SendMaintenanceAlertData {
  to: string;
  userName: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  maintenanceType: string;
  dueDate: string;
  isOverdue: boolean;
}

interface SendWelcomeEmailData {
  to: string;
  userName: string;
}

interface CheckUserExistsData {
  email: string;
}

interface CreatePreRegistrationData {
  email: string;
  userName: string;
  ownerName: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  transferCode: string;
}

// Função: Enviar email de transferência de veículo
export const sendTransferEmail = onCall(
  {secrets: [sendgridApiKey, sendgridFromEmail]},
  async (request) => {
    // Configurar SendGrid com a API Key do secret
    sgMail.setApiKey(sendgridApiKey.value());
    const FROM_EMAIL = sendgridFromEmail.value();

    const data = request.data as SendTransferEmailData;
    const {
      to,
      ownerName,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      transferCode,
      isOwner,
    } = data;

    if (!to || !transferCode) {
      throw new HttpsError(
        "invalid-argument",
        "Email e código de transferência são obrigatórios"
      );
    }

    try {
      const subject = isOwner ?
        `🚗 Código de Transferência - ${vehicleMake} ${vehicleModel}` :
        `🚗 Você Recebeu um Veículo - ${vehicleMake} ${vehicleModel}`;

      const vehicle = `${vehicleMake} ${vehicleModel} ${vehicleYear}`;
      const html = isOwner ? `
      <div style="font-family: Arial, sans-serif;
        max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">
          🚗 Código de Transferência de Veículo
        </h2>
        <p>Olá <strong>${ownerName}</strong>,</p>
        <p>Você iniciou a transferência do seu veículo
        <strong>${vehicle}</strong>.</p>
        <div style="background: #f3f4f6; padding: 20px;
          border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #6b7280;">
            Código de Transferência:
          </p>
          <h1 style="margin: 10px 0; color: #2563eb;
            font-size: 32px; letter-spacing: 4px;">
            ${transferCode}
          </h1>
        </div>
        <p>Compartilhe este código com o novo proprietário
        para concluir a transferência.</p>
        <p style="color: #ef4444; font-weight: bold;">
          ⚠️ Este código expira em 24 horas!
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb;
          margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px;">
          AutoCare - Gestão Inteligente de Veículos
        </p>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif;
        max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">
          🎉 Você Recebeu um Veículo!
        </h2>
        <p><strong>${ownerName}</strong> está transferindo
        o veículo <strong>${vehicle}</strong> para você.</p>
        <div style="background: #f3f4f6; padding: 20px;
          border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #6b7280;">
            Use este código para aceitar a transferência:
          </p>
          <h1 style="margin: 10px 0; color: #2563eb;
            font-size: 32px; letter-spacing: 4px;">
            ${transferCode}
          </h1>
        </div>
        <p>Acesse <a href="https://autocare.com/transfers"
          style="color: #2563eb;">AutoCare</a> e insira
          o código acima para receber o veículo.</p>
        <p style="color: #ef4444; font-weight: bold;">
          ⚠️ Este código expira em 24 horas!
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb;
          margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px;">
          AutoCare - Gestão Inteligente de Veículos
        </p>
      </div>
    `;

      const msg = {
        to,
        from: FROM_EMAIL,
        subject,
        html,
      };

      await sgMail.send(msg);
      logger.info(`✅ Email de transferência enviado para ${to}`);
      return {success: true, message: "Email enviado com sucesso"};
    } catch (error) {
      logger.error("❌ Erro ao enviar email de transferência:", error);
      throw new HttpsError("internal", "Erro ao enviar email");
    }
  }
);

// Função: Enviar alerta de manutenção
export const sendMaintenanceAlert = onCall(
  {secrets: [sendgridApiKey, sendgridFromEmail]},
  async (request) => {
    sgMail.setApiKey(sendgridApiKey.value());
    const FROM_EMAIL = sendgridFromEmail.value();
    const data = request.data as SendMaintenanceAlertData;
    const {
      to,
      userName,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      maintenanceType,
      dueDate,
      isOverdue,
    } = data;

    if (!to || !maintenanceType) {
      throw new HttpsError(
        "invalid-argument",
        "Email e tipo de manutenção são obrigatórios"
      );
    }

    try {
      const vehicle = `${vehicleMake} ${vehicleModel}`;
      const subject = isOverdue ?
        `🚨 Manutenção Atrasada - ${vehicle}` :
        `⏰ Manutenção Próxima - ${vehicle}`;

      const statusMsg = isOverdue ?
        "A manutenção está <strong style=\"color: #ef4444;\">" +
      "atrasada</strong>!" :
        "A manutenção está <strong style=\"color: #f59e0b;\">" +
      "próxima</strong>!";

      const actionMsg = isOverdue ?
        "Realize a manutenção o quanto antes." :
        "Não se esqueça de agendar esta manutenção.";

      const html = `
      <div style="font-family: Arial, sans-serif;
        max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${isOverdue ? "#ef4444" : "#f59e0b"};">
          ${isOverdue ? "🚨 Atrasada!" : "⏰ Programada"}
        </h2>
        <p>Olá <strong>${userName}</strong>,</p>
        <p>${statusMsg}</p>
        <div style="background: #f3f4f6; padding: 20px;
          border-radius: 8px; margin: 20px 0;">
          <p><strong>Veículo:</strong>
            ${vehicleMake} ${vehicleModel} ${vehicleYear}
          </p>
          <p><strong>Tipo:</strong> ${maintenanceType}</p>
          <p><strong>Data:</strong> ${dueDate}</p>
        </div>
        <p>${actionMsg}</p>
        <a href="https://autocare.com/maintenance"
          style="display: inline-block; background: #2563eb;
          color: white; padding: 12px 24px;
          text-decoration: none; border-radius: 6px;
          margin: 20px 0;">
          Ver Manutenções
        </a>
        <hr style="border: none;
          border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px;">
          AutoCare - Gestão Inteligente de Veículos
        </p>
      </div>
    `;

      const msg = {
        to,
        from: FROM_EMAIL,
        subject,
        html,
      };

      await sgMail.send(msg);
      logger.info(`✅ Alerta de manutenção enviado para ${to}`);
      return {success: true, message: "Email enviado com sucesso"};
    } catch (error) {
      logger.error("❌ Erro ao enviar alerta de manutenção:", error);
      throw new HttpsError("internal", "Erro ao enviar email");
    }
  }
);

// Função: Enviar email de boas-vindas
export const sendWelcomeEmail = onCall(
  {secrets: [sendgridApiKey, sendgridFromEmail]},
  async (request) => {
    sgMail.setApiKey(sendgridApiKey.value());
    const FROM_EMAIL = sendgridFromEmail.value();
    const data = request.data as SendWelcomeEmailData;
    const {to, userName} = data;

    if (!to || !userName) {
      throw new HttpsError(
        "invalid-argument",
        "Email e nome são obrigatórios"
      );
    }

    try {
      const subject = "🚗 Bem-vindo ao AutoCare!";
      const html = `
      <div style="font-family: Arial, sans-serif;
        max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">
          🚗 Bem-vindo ao AutoCare!
        </h2>
        <p>Olá <strong>${userName}</strong>,</p>
        <p>Estamos muito felizes em tê-lo conosco! 🎉</p>
        <p>O AutoCare é sua plataforma completa
          para gestão de veículos:</p>
        <ul style="color: #374151; line-height: 1.8;">
          <li>📊 Acompanhar custos e estatísticas</li>
          <li>🔧 Gerenciar manutenções</li>
          <li>📄 Armazenar documentos importantes</li>
          <li>🔄 Transferir veículos facilmente</li>
          <li>📈 Visualizar análises detalhadas</li>
        </ul>
        <a href="https://autocare.com/dashboard"
          style="display: inline-block; background: #2563eb;
          color: white; padding: 12px 24px;
          text-decoration: none; border-radius: 6px;
          margin: 20px 0;">
          Acessar Dashboard
        </a>
        <hr style="border: none;
          border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280;">
          Precisa de ajuda? Entre em contato.
        </p>
        <p style="color: #6b7280; font-size: 12px;">
          AutoCare - Gestão Inteligente de Veículos
        </p>
      </div>
    `;

      const msg = {
        to,
        from: FROM_EMAIL,
        subject,
        html,
      };

      await sgMail.send(msg);
      logger.info(`✅ Email de boas-vindas enviado para ${to}`);
      return {success: true, message: "Email enviado com sucesso"};
    } catch (error) {
      logger.error("❌ Erro ao enviar email de boas-vindas:", error);
      throw new HttpsError("internal", "Erro ao enviar email");
    }
  }
);

// Função: Verificar se usuário existe por email
export const checkUserExists = onCall(async (request) => {
  const data = request.data as CheckUserExistsData;
  const {email} = data;
  if (!email) {
    throw new HttpsError("invalid-argument", "Email é obrigatório");
  }
  try {
    await getAuth().getUserByEmail(email);
    return {exists: true};
  } catch (err) {
    const e = err as {code?: string};
    if (e.code === "auth/user-not-found") {
      return {exists: false};
    }
    throw new HttpsError("internal", "Erro ao verificar usuário");
  }
});

// Função: Criar pré-cadastro com senha temporária e enviar email com credenciais
export const createPreRegistration = onCall(
  {secrets: [sendgridApiKey, sendgridFromEmail]},
  async (request) => {
    const data = request.data as CreatePreRegistrationData;
    const {
      email, userName, ownerName,
      vehicleMake, vehicleModel, vehicleYear,
      transferCode,
    } = data;

    if (!email || !userName || !transferCode) {
      throw new HttpsError("invalid-argument", "Parâmetros obrigatórios ausentes");
    }

    const auth = getAuth();
    // Criar senha temporária forte
    const tempPassword = Math.random().toString(36).slice(-10) + "A1!";

    try {
      // Tentar criar usuário; se já existir, apenas enviar e-mail com instruções
      let created = false;
      try {
        await auth.createUser({
          email,
          password: tempPassword,
          displayName: userName,
          emailVerified: false,
          disabled: false,
        });
        created = true;
      } catch (e) {
        const err = e as {code?: string};
        if (err.code !== "auth/email-already-exists") {
          throw e;
        }
      }

      // Enviar e-mail com credenciais e código
      sgMail.setApiKey(sendgridApiKey.value());
      const FROM_EMAIL = sendgridFromEmail.value();
      const subject = created ?
        "🚗 Acesse sua conta para aceitar o veículo" :
        "🚗 Você possui uma transferência pendente no AutoCare";

      const html = (
        await import("./templates/transferWithCredentialsEmail.js")
      ).transferWithCredentialsEmail({
        userName,
        ownerName,
        toEmail: email,
        vehicleMake,
        vehicleModel,
        vehicleYear,
        transferCode,
        tempPassword,
      });

      await sgMail.send({to: email, from: FROM_EMAIL, subject, html});
      return {success: true};
    } catch (error) {
      logger.error("Erro no pré-cadastro:", error);
      throw new HttpsError("internal", "Erro ao criar pré-cadastro");
    }
  }
);
