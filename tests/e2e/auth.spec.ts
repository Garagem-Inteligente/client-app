import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display landing page', async ({ page }) => {
    await expect(page).toHaveTitle(/AutoCare/)
    await expect(page.locator('h1')).toContainText('AutoCare')
  })

  test('should navigate to login page', async ({ page }) => {
    await page.click('text=Login')
    await expect(page).toHaveURL(/\/login/)
    await expect(page.locator('h1, h2')).toContainText(/Login|Entrar/)
  })

  test('should navigate to register page', async ({ page }) => {
    await page.click('text=Cadastrar')
    await expect(page).toHaveURL(/\/register/)
    await expect(page.locator('h1, h2')).toContainText(/Cadastr/)
  })

  test('should show validation errors on empty login form', async ({ page }) => {
    await page.goto('/login')
    await page.click('button[type="submit"]')
    
    // HTML5 validation should prevent submission
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeFocused()
  })

  test('should register new user', async ({ page }) => {
    await page.goto('/register')
    
    const timestamp = Date.now()
    const testEmail = `test-${timestamp}@autocare.test`
    
    await page.fill('input[name="name"], input[placeholder*="nome"]', 'Test User')
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', 'Test@123456')
    
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard or show success
    await page.waitForURL(/\/(dashboard|login)/, { timeout: 10000 })
  })

  test('should login existing user', async ({ page }) => {
    await page.goto('/login')
    
    // Use test credentials (you should have a test user in Firebase)
    await page.fill('input[type="email"]', 'test@autocare.com')
    await page.fill('input[type="password"]', 'Test@123')
    
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 })
    await expect(page.locator('h1')).toContainText('Dashboard')
  })
})
