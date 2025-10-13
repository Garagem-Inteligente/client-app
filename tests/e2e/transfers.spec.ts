import { test, expect, Page, Browser } from '@playwright/test'

// Helper function to login
async function login(page: Page, email: string, password: string) {
  await page.goto('/login')
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL('/dashboard', { timeout: 10000 })
}

test.describe('Vehicle Transfer Flow', () => {
  let currentOwnerPage: Page
  let newOwnerPage: Page
  let transferId: string
  let currentOwnerCode: string
  let newOwnerCode: string

  test.beforeAll(async ({ browser }: { browser: Browser }) => {
    // Create two browser contexts for two users
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()
    
    currentOwnerPage = await context1.newPage()
    newOwnerPage = await context2.newPage()
    
    // Login as current owner
    await login(currentOwnerPage, 'test@autocare.com', 'Test@123')
    
    // Login as new owner (you need a second test account)
    await login(newOwnerPage, 'test2@autocare.com', 'Test@123')
  })

  test('should initiate vehicle transfer', async () => {
    // Navigate to vehicles
    await currentOwnerPage.click('text=Veículos')
    await currentOwnerPage.waitForURL('/vehicles')
    
    // Click on first vehicle
    await currentOwnerPage.waitForSelector('.vehicle-card, [data-testid="vehicle-card"]')
    await currentOwnerPage.click('.vehicle-card:first-child, [data-testid="vehicle-card"]:first-child')
    
    await currentOwnerPage.waitForURL(/\/vehicles\//)
    
    // Click transfer button
    await currentOwnerPage.click('button:has-text("Transferir")')
    
    // Modal should open
    await expect(currentOwnerPage.locator('text=Transferir Veículo')).toBeVisible()
    
    // Fill new owner email
    await currentOwnerPage.fill('input[type="email"]', 'test2@autocare.com')
    
    // Submit transfer
    await currentOwnerPage.click('button:has-text("Iniciar Transferência")')
    
    // Should show success message
    await expect(currentOwnerPage.locator('text=Transferência iniciada')).toBeVisible({ timeout: 10000 })
    
    // Extract confirmation codes from console (in real app, these would be in emails)
    currentOwnerPage.on('console', msg => {
      const text = msg.text()
      if (text.includes('Transfer ID:')) {
        transferId = text.split('Transfer ID: ')[1].split('\n')[0]
      }
      if (text.includes('Código do dono atual')) {
        currentOwnerCode = text.split(': ')[2].split('\n')[0]
      }
      if (text.includes('Código do novo dono')) {
        newOwnerCode = text.split(': ')[2].split('\n')[0]
      }
    })
    
    // Wait a bit for console logs
    await currentOwnerPage.waitForTimeout(2000)
  })

  test('should show pending transfer for current owner', async () => {
    await currentOwnerPage.click('text=Transferências')
    await currentOwnerPage.waitForURL('/transfers')
    
    // Should show pending transfer
    await expect(currentOwnerPage.locator('text=Transferindo para')).toBeVisible()
    await expect(currentOwnerPage.locator('text=test2@autocare.com')).toBeVisible()
  })

  test('should show pending transfer for new owner', async () => {
    await newOwnerPage.click('text=Transferências')
    await newOwnerPage.waitForURL('/transfers')
    
    // Should show pending transfer
    await expect(newOwnerPage.locator('text=Recebendo de')).toBeVisible()
    await expect(newOwnerPage.locator('text=test@autocare.com')).toBeVisible()
  })

  test('should confirm transfer as current owner', async () => {
    await currentOwnerPage.goto('/transfers')
    
    // Click to insert code
    await currentOwnerPage.click('button:has-text("Inserir Código")')
    
    // Fill confirmation code (you'll need to extract this from console or database)
    // For testing, we'll use a mock code
    await currentOwnerPage.fill('input[placeholder="000000"]', '123456')
    
    await currentOwnerPage.click('button:has-text("Confirmar")')
    
    // Should show confirmation message
    await expect(currentOwnerPage.locator('text=Confirmação registrada')).toBeVisible({ timeout: 5000 })
  })

  test('should confirm transfer as new owner', async () => {
    await newOwnerPage.goto('/transfers')
    
    // Click to insert code
    await newOwnerPage.click('button:has-text("Inserir Código")')
    
    // Fill confirmation code
    await newOwnerPage.fill('input[placeholder="000000"]', '654321')
    
    await newOwnerPage.click('button:has-text("Confirmar")')
    
    // Should show completion message
    await expect(newOwnerPage.locator('text=Transferência concluída')).toBeVisible({ timeout: 5000 })
  })

  test('should verify vehicle transferred to new owner', async () => {
    // Reload vehicles for new owner
    await newOwnerPage.goto('/vehicles')
    await newOwnerPage.waitForTimeout(2000)
    
    // New owner should see the vehicle
    // (This depends on the vehicle being properly transferred in the database)
    await expect(newOwnerPage.locator('.vehicle-card, [data-testid="vehicle-card"]')).toHaveCount(1, { timeout: 5000 })
  })

  test('should cancel transfer', async () => {
    // First, initiate another transfer
    await currentOwnerPage.goto('/vehicles')
    await currentOwnerPage.waitForSelector('.vehicle-card, [data-testid="vehicle-card"]')
    await currentOwnerPage.click('.vehicle-card:first-child, [data-testid="vehicle-card"]:first-child')
    
    await currentOwnerPage.click('button:has-text("Transferir")')
    await currentOwnerPage.fill('input[type="email"]', 'test2@autocare.com')
    await currentOwnerPage.click('button:has-text("Iniciar Transferência")')
    
    await currentOwnerPage.waitForTimeout(2000)
    
    // Go to transfers page
    await currentOwnerPage.goto('/transfers')
    
    // Accept cancellation dialog
    currentOwnerPage.on('dialog', dialog => dialog.accept())
    
    // Click cancel button
    await currentOwnerPage.click('button:has-text("Cancelar Transferência")')
    
    // Should show cancellation message
    await expect(currentOwnerPage.locator('text=Transferência cancelada')).toBeVisible({ timeout: 5000 })
  })
})
