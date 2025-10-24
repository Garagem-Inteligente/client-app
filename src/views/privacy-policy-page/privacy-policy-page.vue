<template>
  <ion-page>
    <ModernHeader title="Política de Privacidade" showBackButton />

    <ion-content class="custom-content">
      <div class="background-gradient"></div>
      <div class="background-pattern"></div>

      <div class="container">
        <!-- Hero Card -->
        <section class="hero-card">
          <div class="hero-icon">
            <ion-icon :icon="shieldCheckmarkOutline"></ion-icon>
          </div>
          <div class="hero-content">
            <span class="hero-chip">Última atualização: {{ lastUpdated }}</span>
            <h1>Transparência e Segurança em Primeiro Lugar</h1>
            <p>
              Respeitamos sua privacidade e tratamos os dados com responsabilidade.
              Esta política explica como coletamos, utilizamos e protegemos as informações
              da Garagem Inteligente nas plataformas web e mobile (Ionic + Capacitor).
            </p>
            <div class="hero-highlights">
              <span class="highlight-pill">
                <ion-icon :icon="documentLockOutline"></ion-icon>
                Conformidade LGPD
              </span>
              <span class="highlight-pill">
                <ion-icon :icon="cloudDownloadOutline"></ion-icon>
                Firebase Auth & Firestore
              </span>
              <span class="highlight-pill">
                <ion-icon :icon="constructOutline"></ion-icon>
                Aplicativo híbrido Android & iOS
              </span>
            </div>
          </div>
        </section>

        <!-- Policy Sections -->
        <section class="policy-grid">
          <article v-for="section in policySections" :key="section.title" class="policy-card">
            <div class="card-icon">
              <ion-icon :icon="section.icon"></ion-icon>
            </div>
            <div class="card-content">
              <h2>{{ section.title }}</h2>
              <p>{{ section.description }}</p>
              <ul>
                <li v-for="item in section.items" :key="item">
                  <ion-icon :icon="checkmarkCircleOutline" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </article>
        </section>

        <!-- Rights Section -->
        <section class="rights-card">
          <div class="rights-header">
            <div class="rights-icon">
              <ion-icon :icon="keyOutline"></ion-icon>
            </div>
            <div>
              <h2>Seus Direitos como Titular de Dados</h2>
              <p>
                Você pode exercer seus direitos a qualquer tempo via aplicativo ou entrando em contato
                com nossa equipe de privacidade. Nossa resposta ocorre em até 15 dias úteis.
              </p>
            </div>
          </div>
          <div class="rights-grid">
            <div v-for="right in rights" :key="right" class="right-pill">
              <ion-icon :icon="shieldCheckmarkOutline"></ion-icon>
              <span>{{ right }}</span>
            </div>
          </div>
        </section>

        <!-- Data Retention -->
        <section class="retention-card">
          <h2>
            <ion-icon :icon="timeOutline"></ion-icon>
            Retenção e Exclusão
          </h2>
          <div class="retention-grid">
            <div v-for="item in retention" :key="item.title" class="retention-item">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </section>

        <!-- Contact Card -->
        <section class="contact-card">
          <div class="contact-header">
            <div class="contact-icon">
              <ion-icon :icon="mailOutline"></ion-icon>
            </div>
            <div>
              <h2>Fale com o Encarregado de Proteção de Dados</h2>
              <p>Entre em contato sempre que precisar de esclarecimentos ou desejar exercer seus direitos.</p>
            </div>
          </div>
          <div class="contact-details">
            <div class="detail-item">
              <ion-icon :icon="personOutline"></ion-icon>
              <div>
                <span class="detail-label">Responsável</span>
                <span class="detail-value">Equipe Garagem Inteligente</span>
              </div>
            </div>
            <div class="detail-item">
              <ion-icon :icon="mailOutline"></ion-icon>
              <div>
                <span class="detail-label">Email</span>
                <a class="detail-link" href="mailto:privacidade@garageminteligente.com.br">
                  privacidade@garageminteligente.com.br
                </a>
              </div>
            </div>
            <div class="detail-item">
              <ion-icon :icon="readerOutline"></ion-icon>
              <div>
                <span class="detail-label">Canal no aplicativo</span>
                <span class="detail-value">Configurações &gt; Suporte &gt; Privacidade</span>
              </div>
            </div>
          </div>
          <AButton expand="block" size="large" @click="openPrivacyEmail">
            <template #icon-start>
              <ion-icon :icon="chatbubbleEllipsesOutline" />
            </template>
            Falar com a equipe de privacidade
          </AButton>
        </section>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonPage, IonContent, IonIcon } from '@ionic/vue'
import {
  shieldCheckmarkOutline,
  documentLockOutline,
  cloudDownloadOutline,
  constructOutline,
  lockClosedOutline,
  cloudUploadOutline,
  notificationsOutline,
  settingsOutline,
  laptopOutline,
  keyOutline,
  checkmarkCircleOutline,
  timeOutline,
  mailOutline,
  personOutline,
  readerOutline,
  chatbubbleEllipsesOutline
} from 'ionicons/icons'
import ModernHeader from '@/components/organisms/ModernHeader.vue'
import { AButton } from '@/components'

const lastUpdated = '19 de outubro de 2025'

const policySections = computed(() => [
  {
    title: 'Quais dados coletamos',
    icon: cloudDownloadOutline,
    description: 'Coletamos somente informações necessárias para operar os serviços da Garagem Inteligente.',
    items: [
      'Dados de identificação (nome, email e foto quando disponível)',
      'Informações de veículos: placa, modelo, histórico de manutenção',
      'Dados de uso anônimos para melhorar desempenho do aplicativo'
    ]
  },
  {
    title: 'Como utilizamos seus dados',
    icon: settingsOutline,
    description: 'Os dados são empregados para oferecer recursos de manutenção, alertas e compartilhamento seguro.',
    items: [
      'Sincronizar veículos e manutenções entre seus dispositivos',
      'Enviar notificações sobre manutenções e transferências',
      'Garantir segurança durante transferências de propriedade'
    ]
  },
  {
    title: 'Onde armazenamos e protegemos',
    icon: lockClosedOutline,
    description: 'Usamos Firebase (Google Cloud) com criptografia em trânsito e em repouso.',
    items: [
      'Autenticação segura com Firebase Auth e suporte a Google Sign-in',
      'Firestore com regras que isolam dados por usuário',
      'Backups automáticos e monitoramento contínuo de acesso'
    ]
  },
  {
    title: 'Compartilhamento responsável',
    icon: cloudUploadOutline,
    description: 'Compartilhamos dados somente quando necessário para concluir transferências ou cumprir leis.',
    items: [
      'Transferência de veículos após confirmação dupla dos envolvidos',
      'Integração com fornecedores apenas com consentimento explícito',
      'Atendimento a obrigações legais ou solicitações legítimas'
    ]
  },
  {
    title: 'Notificações e comunicação',
    icon: notificationsOutline,
    description: 'Enviamos lembretes e atualizações importantes para manter o cuidado com seu veículo em dia.',
    items: [
      'Alertas de manutenção via push e email',
      'Confirmações de transferência e mensagens entre usuários',
      'Comunicações de segurança e atualizações da plataforma'
    ]
  },
  {
    title: 'Plataformas suportadas',
    icon: laptopOutline,
    description: 'A política vale para as versões web, Android e iOS da Garagem Inteligente (Ionic + Capacitor).',
    items: [
      'Mesmo nível de segurança em todos os dispositivos',
      'Sincronização em tempo real com suporte offline do Firestore',
      'Logs de acesso para auditoria e prevenção de fraudes'
    ]
  }
])

const rights = [
  'Confirmação de tratamento',
  'Acesso aos dados',
  'Correção de inconsistências',
  'Anonimização, bloqueio ou eliminação',
  'Portabilidade quando aplicável',
  'Informação sobre compartilhamentos',
  'Revogação de consentimento',
  'Oposição ao tratamento'
]

const retention = [
  {
    title: 'Conta ativa',
    description: 'Mantemos seus dados enquanto a conta estiver ativa para garantir continuidade dos serviços.'
  },
  {
    title: 'Após exclusão de conta',
    description: 'Removemos informações pessoais em até 30 dias, preservando registros exigidos por lei.'
  },
  {
    title: 'Histórico de transferências',
    description: 'Retemos comprovantes por até 5 anos para auditoria e segurança jurídica entre as partes.'
  }
]

const openPrivacyEmail = () => {
  window.open('mailto:privacidade@garageminteligente.com.br', '_blank')
}
</script>

<style scoped>
.background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 320px;
  background: linear-gradient(180deg,
    rgba(var(--ion-color-primary-rgb), 0.12) 0%,
    rgba(var(--ion-color-primary-rgb), 0.05) 50%,
    transparent 100%);
  pointer-events: none;
  z-index: 0;
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 320px;
  background-image:
    radial-gradient(circle at 15% 40%, rgba(var(--ion-color-secondary-rgb), 0.12) 0%, transparent 55%),
    radial-gradient(circle at 80% 20%, rgba(var(--ion-color-tertiary-rgb), 0.12) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}

.container {
  position: relative;
  z-index: 1;
  padding: 20px;
  max-width: 960px;
  margin: 0 auto 120px;
}

.hero-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 24px;
  padding: 28px;
  border-radius: 24px;
  background: linear-gradient(135deg,
    rgba(var(--ion-color-primary-rgb), 0.95) 0%,
    rgba(var(--ion-color-primary-rgb), 0.85) 100%);
  color: white;
  box-shadow:
    0 20px 40px rgba(var(--ion-color-primary-rgb), 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  margin-bottom: 32px;
}

.hero-icon {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(12px);
}

.hero-icon ion-icon {
  font-size: 40px;
  color: white;
}

.hero-content h1 {
  margin: 12px 0 16px;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
}

.hero-content p {
  margin: 0 0 18px;
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.92);
}

.hero-chip {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
  font-size: 13px;
  font-weight: 600;
}

.hero-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.highlight-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.highlight-pill ion-icon {
  font-size: 18px;
}

.policy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.policy-card {
  background: var(--ion-card-background, white);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.policy-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(var(--ion-color-primary-rgb), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.card-icon ion-icon {
  font-size: 24px;
  color: var(--ion-color-primary);
}

.card-content h2 {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 700;
  color: var(--ion-color-dark);
}

.card-content p {
  margin: 0 0 14px;
  font-size: 14px;
  color: var(--ion-color-medium);
  line-height: 1.5;
}

.card-content ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-content li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  color: var(--ion-color-medium-shade);
}

.card-content li ion-icon {
  margin-top: 2px;
  font-size: 18px;
  color: var(--ion-color-success);
}

.rights-card {
  background: var(--ion-card-background, white);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 32px;
}

.rights-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 20px;
}

.rights-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba(var(--ion-color-secondary-rgb), 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.rights-icon ion-icon {
  font-size: 28px;
  color: var(--ion-color-secondary);
}

.rights-header h2 {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
}

.rights-header p {
  margin: 0;
  font-size: 14px;
  color: var(--ion-color-medium);
}

.rights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.right-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 14px;
  background: rgba(var(--ion-color-primary-rgb), 0.08);
  color: var(--ion-color-dark);
  font-size: 14px;
  font-weight: 600;
}

.right-pill ion-icon {
  font-size: 18px;
  color: var(--ion-color-primary);
}

.retention-card {
  background: var(--ion-card-background, white);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.retention-card h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 700;
  color: var(--ion-color-dark);
}

.retention-card h2 ion-icon {
  font-size: 22px;
  color: var(--ion-color-primary);
}

.retention-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

.retention-item h3 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.retention-item p {
  margin: 0;
  font-size: 14px;
  color: var(--ion-color-medium);
  line-height: 1.6;
}

.contact-card {
  background: var(--ion-card-background, white);
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
}

.contact-header {
  display: flex;
  gap: 18px;
  align-items: flex-start;
  margin-bottom: 24px;
}

.contact-icon {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  background: rgba(var(--ion-color-primary-rgb), 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-icon ion-icon {
  font-size: 30px;
  color: var(--ion-color-primary);
}

.contact-header h2 {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 700;
}

.contact-header p {
  margin: 0;
  font-size: 14px;
  color: var(--ion-color-medium);
}

.contact-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.detail-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.detail-item ion-icon {
  font-size: 22px;
  color: var(--ion-color-primary);
  margin-top: 2px;
}

.detail-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--ion-color-medium);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 2px;
}

.detail-value {
  font-size: 15px;
  color: var(--ion-color-dark);
}

.detail-link {
  font-size: 15px;
  color: var(--ion-color-primary);
  text-decoration: none;
  font-weight: 600;
}

.detail-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .hero-card {
    grid-template-columns: 1fr;
  }

  .hero-icon {
    width: 60px;
    height: 60px;
  }

  .hero-content h1 {
    font-size: 24px;
  }
}

@media (max-width: 576px) {
  .container {
    padding: 16px;
  }

  .hero-card {
    padding: 20px;
  }

  .rights-grid,
  .retention-grid,
  .contact-details {
    grid-template-columns: 1fr;
  }
}

@media (prefers-color-scheme: dark) {
  .policy-card,
  .rights-card,
  .retention-card,
  .contact-card {
    background: rgba(21, 25, 34, 0.9);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
  }

  .card-content p,
  .rights-header p,
  .retention-item p,
  .contact-header p {
    color: rgba(255, 255, 255, 0.7);
  }

  .card-content li,
  .detail-value {
    color: rgba(255, 255, 255, 0.75);
  }

  .right-pill {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.85);
  }

  .hero-card {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
  }
}
</style>
