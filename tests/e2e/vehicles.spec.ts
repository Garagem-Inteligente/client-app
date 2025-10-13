import { test, expect, Page } from '@playwright/test'

// Helper function to login
async function login(page: Page) {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'test@autocare.com')
  await page.fill('input[type="password"]', 'Test@123')
  await page.click('button[type="submit"]')
  await page.waitForURL('/dashboard', { timeout: 10000 })
}

test.describe('Vehicle Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('should navigate to vehicles page', async ({ page }) => {
    await page.click('text=Veículos')
    await expect(page).toHaveURL('/vehicles')
    await expect(page.locator('h1')).toContainText('Veículos')
  })

  test('should open add vehicle form', async ({ page }) => {
    await page.goto('/vehicles')
    await page.click('button:has-text("Adicionar Veículo"), button:has-text("Novo Veículo")')
    
    // Form should be visible
    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('select, input[placeholder*="marca"]')).toBeVisible()
  })

  test('should create new vehicle', async ({ page }) => {
    await page.goto('/vehicles')
    await page.click('button:has-text("Adicionar Veículo"), button:has-text("Novo Veículo")')
    
    // Fill form (adjust selectors based on your actual form)
    await page.selectOption('select[name="fuelType"], #fuelType', 'gasoline')
    await page.fill('input[name="plate"], input[placeholder*="placa"]', 'ABC1234')
    await page.fill('input[name="year"], input[placeholder*="ano"]', '2020')
    await page.fill('input[name="mileage"], input[placeholder*="quilometragem"]', '50000')
    
    await page.click('button[type="submit"]')
    
    // Should show success or new vehicle in list
    await page.waitForTimeout(2000)
  })

  test('should view vehicle details', async ({ page }) => {
    await page.goto('/vehicles')
    
    // Wait for vehicles to load
    await page.waitForSelector('.vehicle-card, [data-testid="vehicle-card"]', { timeout: 5000 })
    
    // Click first vehicle
    await page.click('.vehicle-card:first-child, [data-testid="vehicle-card"]:first-child')
    
    await expect(page).toHaveURL(/\/vehicles\//)
    await expect(page.locator('h1, h2')).toBeVisible()
  })

  test('should delete vehicle', async ({ page }) => {
    await page.goto('/vehicles')
    
    // Wait for vehicles to load
    await page.waitForSelector('.vehicle-card, [data-testid="vehicle-card"]', { timeout: 5000 })
    
    // Click first vehicle to go to details
    await page.click('.vehicle-card:first-child, [data-testid="vehicle-card"]:first-child')
    
    await page.waitForURL(/\/vehicles\//)
    
    // Click delete button
    page.on('dialog', dialog => dialog.accept())
    await page.click('button:has-text("Excluir")')
    
    // Should redirect back to vehicles list
    await page.waitForURL('/vehicles')
  })
})
