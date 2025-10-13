// Test fixtures and helper data for E2E tests

export const testUsers = {
  owner: {
    email: 'test@autocare.com',
    password: 'Test@123',
    name: 'Test Owner'
  },
  newOwner: {
    email: 'test2@autocare.com',
    password: 'Test@123',
    name: 'New Owner'
  }
}

export const testVehicle = {
  make: 'Toyota',
  model: 'Corolla',
  year: '2020',
  plate: 'ABC1234',
  color: 'Prata',
  mileage: '50000',
  fuelType: 'gasoline'
}

export const testMaintenance = {
  type: 'oil_change',
  description: 'Troca de óleo preventiva',
  cost: '15000', // R$ 150,00 (with mask)
  mileage: '50000',
  date: '2025-10-13',
  serviceProvider: 'Oficina Teste',
  notes: 'Serviço realizado conforme manual do fabricante'
}

export const testInvoice = {
  name: 'nota-fiscal.pdf',
  content: Buffer.from('Test invoice content - NF-e 123456789'),
  mimeType: 'application/pdf'
}

export const testImage = {
  name: 'comprovante.jpg',
  content: Buffer.from('Test image content'),
  mimeType: 'image/jpeg'
}

// Selectors for common elements
export const selectors = {
  // Auth
  emailInput: 'input[type="email"]',
  passwordInput: 'input[type="password"]',
  submitButton: 'button[type="submit"]',
  
  // Vehicles
  addVehicleButton: 'button:has-text("Adicionar Veículo"), button:has-text("Novo Veículo")',
  vehicleCard: '.vehicle-card, [data-testid="vehicle-card"]',
  transferButton: 'button:has-text("Transferir")',
  
  // Maintenance
  addMaintenanceButton: 'button:has-text("Registrar Manutenção")',
  maintenanceCard: '.maintenance-card, [data-testid="maintenance-card"]',
  fileInput: 'input[type="file"]',
  
  // Transfers
  insertCodeButton: 'button:has-text("Inserir Código")',
  confirmationCodeInput: 'input[placeholder="000000"]',
  confirmButton: 'button:has-text("Confirmar")',
  cancelTransferButton: 'button:has-text("Cancelar Transferência")'
}

// Helper functions
export function generateTestEmail(): string {
  return `test-${Date.now()}@autocare.test`
}

export function generateTestPlate(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  
  return (
    letters[Math.floor(Math.random() * letters.length)] +
    letters[Math.floor(Math.random() * letters.length)] +
    letters[Math.floor(Math.random() * letters.length)] +
    numbers[Math.floor(Math.random() * numbers.length)] +
    numbers[Math.floor(Math.random() * numbers.length)] +
    numbers[Math.floor(Math.random() * numbers.length)] +
    numbers[Math.floor(Math.random() * numbers.length)]
  )
}

export function formatCurrency(value: number): string {
  return value.toString()
}

export function formatMileage(value: number): string {
  return value.toString()
}
