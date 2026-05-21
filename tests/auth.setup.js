const { test: setup, expect } = require('@playwright/test');

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('https://nguyencongpc.vn/');

  await page.getByRole('link', {
    name: 'Tài khoản'
  }).click();

  await page.locator('#email')
    .fill('duy3012@gmail.com');

  await page.locator('#password')
    .fill('duy30122004');

  await Promise.all([
    page.waitForURL(/taikhoan/),

    page.getByRole('button', {
      name: 'Đăng nhập'
    }).click()
  ]);

  await expect(page).toHaveURL(/taikhoan/);

  // lưu session login
  await page.context().storageState({
    path: authFile
  });
});