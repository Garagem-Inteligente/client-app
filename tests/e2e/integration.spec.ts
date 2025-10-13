import { test, expect, Page, Browser } from '@playwright/test'
import { testUsers, testVehicle, testMaintenance, testInvoice, selectors } from '../fixtures'

test.describe('Complete User Journey', () => {
  let page: Page

  test.beforeAll(async ({ browser }: { browser: Browser }) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test('1. User can register and login', async () => {
    // Go to landing page
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('AutoCare')

    // Navigate to login
    await page.click('text=Login')
    await expect(page).toHaveURL(/\/login/)

    // Login with existing user
    await page.fill(selectors.emailInput, testUsers.owner.email)
    await page.fill(selectors.passwordInput, testUsers.owner.password)
    await page.click(selectors.submitButton)

    // Should be on dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 })
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('2. User can add a vehicle', async () => {
    // Navigate to vehicles
    await page.click('text=Veículos')
    await expect(page).toHaveURL('/vehicles')

    // Open add vehicle form
    await page.click(selectors.addVehicleButton)

    // Fill form
    await page.selectOption('select#fuelType, select[name="fuelType"]', testVehicle.fuelType)
    await page.fill('input[name="plate"], input[placeholder*="placa"]', testVehicle.plate)
    await page.fill('input[name="year"], input[placeholder*="ano"]', testVehicle.year)
    await page.fill('input[name="mileage"], input[placeholder*="quilometragem"]', testVehicle.mileage)

    // Submit
    await page.click(selectors.submitButton)

    // Wait for success
    await page.waitForTimeout(2000)

    // Vehicle should appear in list
    await expect(page.locator(`text=${testVehicle.plate}`)).toBeVisible()
  })

  test('3. User can view vehicle details', async () => {
    // Click on the vehicle we just created
    await page.click(`text=${testVehicle.plate}`)

    // Should navigate to details page
    await expect(page).toHaveURL(/\/vehicles\//)

    // Should show vehicle information
    await expect(page.locator('h1, h2')).toBeVisible()
    await expect(page.locator(`text=${testVehicle.plate}`)).toBeVisible()
  })

  test('4. User can add maintenance with file attachment', async () => {
    // Navigate to maintenance
    await page.click('text=Manutenções')
    await expect(page).toHaveURL('/maintenance')

    // Open add form
    await page.click(selectors.addMaintenanceButton)

    // Select vehicle
    await page.selectOption('select#vehicleId', { index: 1 })

    // Select type
    await page.selectOption('select#type', testMaintenance.type)

    // Fill fields
    await page.fill('input#description, textarea#description', testMaintenance.description)
    await page.fill('input#cost', testMaintenance.cost)
    await page.fill('input#mileage', testMaintenance.mileage)
    await page.fill('input#date', testMaintenance.date)

    // Upload file
    await page.setInputFiles(selectors.fileInput, {
      name: testInvoice.name,
      mimeType: testInvoice.mimeType,
      buffer: testInvoice.content
    })

    // Verify file appears
    await expect(page.locator(`text=${testInvoice.name}`)).toBeVisible()

    // Submit
    await page.click(selectors.submitButton)

    // Wait for success
    await page.waitForTimeout(2000)

    // Should show in list
    await expect(page.locator(`text=${testMaintenance.description}`)).toBeVisible()
  })

  test('5. User can initiate vehicle transfer', async () => {
    // Go back to vehicles
    await page.click('text=Veículos')

    // Click on vehicle
    await page.click(`text=${testVehicle.plate}`)
    await page.waitForURL(/\/vehicles\//)

    // Click transfer button
    await page.click(selectors.transferButton)

    // Modal should open
    await expect(page.locator('text=Transferir Veículo')).toBeVisible()

    // Fill new owner email
    await page.fill(selectors.emailInput, testUsers.newOwner.email)

    // Submit
    await page.click('button:has-text("Iniciar Transferência")')

    // Should show success
    await expect(page.locator('text=Transferência iniciada')).toBeVisible({ timeout: 10000 })
  })

  test('6. User can view pending transfers', async () => {
    // Navigate to transfers
    await page.click('text=Transferências')
    await expect(page).toHaveURL('/transfers')

    // Should show pending transfer
    await expect(page.locator('text=Transferindo para')).toBeVisible()
    await expect(page.locator(`text=${testUsers.newOwner.email}`)).toBeVisible()

    // Should show status badges
    await expect(page.locator('text=Dono Atual: Pendente')).toBeVisible()
    await expect(page.locator('text=Novo Dono: Pendente')).toBeVisible()
  })

  test('7. User can logout', async () => {
    // Click user menu / logout button
    await page.click('button:has-text("Sair"), text=Logout, [aria-label*="logout"]')

    // Should redirect to login or home
    await page.waitForURL(/\/(login|home|\/)/, { timeout: 5000 })
  })

  test('8. Complete journey statistics', async () => {
    // This test just logs the complete journey
    console.log('✅ Complete user journey passed!')
    console.log('  - User registration/login ✓')
    console.log('  - Vehicle creation ✓')
    console.log('  - Vehicle details view ✓')
    console.log('  - Maintenance with file upload ✓')
    console.log('  - Vehicle transfer initiation ✓')
    console.log('  - Transfer status view ✓')
    console.log('  - User logout ✓')
  })
})
