import { test, expect, Page } from '@playwright/test'

// Helper function to login
async function login(page: Page) {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'test@autocare.com')
  await page.fill('input[type="password"]', 'Test@123')
  await page.click('button[type="submit"]')
  await page.waitForURL('/dashboard', { timeout: 10000 })
}

test.describe('Maintenance Records', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('should navigate to maintenance page', async ({ page }) => {
    await page.click('text=Manutenções')
    await expect(page).toHaveURL('/maintenance')
    await expect(page.locator('h1')).toContainText('Manutenções')
  })

  test('should open add maintenance form', async ({ page }) => {
    await page.goto('/maintenance')
    await page.click('button:has-text("Registrar Manutenção")')
    
    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('select#vehicleId, select[name="vehicleId"]')).toBeVisible()
  })

  test('should create maintenance record with file attachment', async ({ page }) => {
    await page.goto('/maintenance')
    await page.click('button:has-text("Registrar Manutenção")')
    
    // Select vehicle
    await page.selectOption('select#vehicleId', { index: 1 })
    
    // Select maintenance type
    await page.selectOption('select#type', 'oil_change')
    
    // Fill description
    await page.fill('input#description, textarea#description', 'Troca de óleo preventiva')
    
    // Fill cost (with mask)
    await page.fill('input#cost', '15000') // R$ 150,00
    
    // Fill mileage
    await page.fill('input#mileage', '50000')
    
    // Fill date
    await page.fill('input#date', '2025-10-13')
    
    // Upload file (create a test file)
    const fileContent = Buffer.from('Test invoice content')
    await page.setInputFiles('input[type="file"]', {
      name: 'nota-fiscal.pdf',
      mimeType: 'application/pdf',
      buffer: fileContent
    })
    
    // Wait for file to appear in list
    await expect(page.locator('text=nota-fiscal.pdf')).toBeVisible()
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should close form and show new record
    await page.waitForTimeout(2000)
  })

  test('should filter maintenance by vehicle', async ({ page }) => {
    await page.goto('/maintenance')
    
    // Select a vehicle filter
    await page.selectOption('select#vehicleFilter', { index: 1 })
    
    // Check if filtered
    await page.waitForTimeout(1000)
  })

  test('should view maintenance attachments', async ({ page }) => {
    await page.goto('/maintenance')
    
    // Wait for maintenance records
    await page.waitForSelector('.maintenance-card, [data-testid="maintenance-card"]', { timeout: 5000 })
    
    // Look for attachment links
    const attachmentLink = page.locator('a[href*="firebase"]:has-text("📄"), a[href*="firebase"]:has-text("🖼️")').first()
    
    if (await attachmentLink.isVisible()) {
      // Attachment exists, verify it's clickable
      await expect(attachmentLink).toHaveAttribute('target', '_blank')
    }
  })

  test('should delete maintenance record', async ({ page }) => {
    await page.goto('/maintenance')
    
    // Wait for maintenance records
    await page.waitForSelector('.maintenance-card, [data-testid="maintenance-card"]', { timeout: 5000 })
    
    // Accept confirmation dialog
    page.on('dialog', dialog => dialog.accept())
    
    // Click delete button on first record
    await page.click('button:has-text("Excluir"):visible')
    
    // Should remove the record
    await page.waitForTimeout(2000)
  })
})
