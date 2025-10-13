// Tipos e interfaces para transferência de veículos

export interface VehicleTransferRequest {
  id: string
  vehicleId: string
  currentOwnerId: string
  currentOwnerEmail: string
  newOwnerEmail: string
  currentOwnerCode: string
  newOwnerCode: string
  currentOwnerConfirmed: boolean
  newOwnerConfirmed: boolean
  status: 'pending' | 'confirmed' | 'cancelled' | 'expired'
  createdAt: Date
  expiresAt: Date
  completedAt?: Date
}

export interface TransferRequestInput {
  vehicleId: string
  newOwnerEmail: string
}

export interface ConfirmTransferInput {
  transferId: string
  confirmationCode: string
  userEmail: string
}

export interface TransferResult {
  success: boolean
  message: string
  transferId?: string
}

// Função para gerar código de confirmação de 6 dígitos
export function generateConfirmationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Função para verificar se a transferência expirou (48 horas)
export function isTransferExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt
}

// Função para calcular data de expiração (48 horas a partir de agora)
export function calculateExpirationDate(): Date {
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 48)
  return expiresAt
}
