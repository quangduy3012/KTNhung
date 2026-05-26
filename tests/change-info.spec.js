import { test, expect } from '@playwright/test';

const URL = '/taikhoan?view=change-info';

async function goToChangePage(page) {
  await page.goto(URL);
  await page.waitForLoadState('networkidle');
}

// ─────────────────────────────────────────────────────────────────────────────
// TC01 – Cập nhật họ tên hợp lệ → trang reload, lưu thành công
// ─────────────────────────────────────────────────────────────────────────────
test('TC01 - Cập nhật họ tên hợp lệ', async ({ page }) => {
  await goToChangePage(page);

  await page.locator('#fullname').clear();
  await page.locator('#fullname').fill('Nguyễn Văn Duy');
  await page.getByRole('button', { name: 'THAY ĐỔI' }).click();
  await page.waitForLoadState('networkidle');

  await goToChangePage(page);
  await expect(page.locator('#fullname')).toHaveValue('Nguyễn Văn Duy');
});

// ─────────────────────────────────────────────────────────────────────────────
// TC02 – Cập nhật họ tên để trống → phải có thông báo lỗi
// ─────────────────────────────────────────────────────────────────────────────
test('TC02 - Cập nhật họ tên để trống (expect thông báo lỗi)', async ({ page }) => {
  await goToChangePage(page);

  await page.locator('#fullname').clear();
  await page.getByRole('button', { name: 'THAY ĐỔI' }).click();
  await page.waitForLoadState('networkidle');

  const errorMsg = page.locator('text=/tên|name/i');
  await expect(errorMsg).toBeVisible();
});

// ─────────────────────────────────────────────────────────────────────────────
// TC03 – Cập nhật email hợp lệ → kỳ vọng trang reload thành công
//        THỰC TẾ: lỗi 500 → FAIL (bug)
// ─────────────────────────────────────────────────────────────────────────────
test('TC03 - Cập nhật email hợp lệ (expect trang reload thành công)', async ({ page }) => {
  await goToChangePage(page);

  await page.locator('#email').clear();
  await page.locator('#email').fill('duy3012@gmail.com');
  await page.getByRole('button', { name: 'THAY ĐỔI' }).click();
  await page.waitForLoadState('networkidle');

  // Kỳ vọng: KHÔNG có lỗi 500, trang reload bình thường
  const pageContent = await page.content();
  const has500 = pageContent.includes('HTTP ERROR 500') || pageContent.includes('unable to handle');
  expect(has500, 'BUG: Cập nhật email hợp lệ gây ra lỗi HTTP 500').toBeFalsy();

  // Và giá trị phải được lưu
  await goToChangePage(page);
  await expect(page.locator('#email')).toHaveValue('duy3012@gmail.com');
});

// ─────────────────────────────────────────────────────────────────────────────
// TC04 – Cập nhật email sai định dạng → kỳ vọng có thông báo lỗi /email/i
//        THỰC TẾ: lỗi 500 → FAIL (bug)
// ─────────────────────────────────────────────────────────────────────────────
test('TC04 - Cập nhật email sai định dạng (expect thông báo lỗi)', async ({ page }) => {
  await goToChangePage(page);

  await page.locator('#email').clear();
  await page.locator('#email').fill('duy3923');       // thiếu @domain
  await page.getByRole('button', { name: 'THAY ĐỔI' }).click();
  await page.waitForLoadState('networkidle');

  // Kỳ vọng: phải có thông báo lỗi email, KHÔNG được ra lỗi 500
  const errorMsg = page.locator('text=/email/i');
  await expect(errorMsg).toBeVisible();
});

// ─────────────────────────────────────────────────────────────────────────────
// TC05 – Cập nhật địa chỉ hợp lệ → trang reload, lưu thành công
// ─────────────────────────────────────────────────────────────────────────────
test('TC05 - Cập nhật địa chỉ hợp lệ', async ({ page }) => {
  await goToChangePage(page);

  await page.locator('#address').clear();
  await page.locator('#address').fill('123 Đường Lê Lợi, Quận 1');
  await page.getByRole('button', { name: 'THAY ĐỔI' }).click();
  await page.waitForLoadState('networkidle');

  await goToChangePage(page);
  await expect(page.locator('#address')).toHaveValue('123 Đường Lê Lợi, Quận 1');
});

// ─────────────────────────────────────────────────────────────────────────────
// TC06 – Địa chỉ để trống → phải có thông báo lỗi
//        THỰC TẾ: web vẫn lưu → FAIL (bug)
// ─────────────────────────────────────────────────────────────────────────────
test('TC06 - Địa chỉ để trống (expect thông báo lỗi)', async ({ page }) => {
  await goToChangePage(page);

  await page.locator('#address').clear();
  await page.getByRole('button', { name: 'THAY ĐỔI' }).click();
  await page.waitForLoadState('networkidle');

  const errorMsg = page.locator('text=/địa chỉ|address/i');
  await expect(errorMsg).toBeVisible();
});

// ─────────────────────────────────────────────────────────────────────────────
// TC07 – Cập nhật tỉnh/thành phố hợp lệ
// ─────────────────────────────────────────────────────────────────────────────
test('TC07 - Cập nhật tỉnh/thành phố hợp lệ', async ({ page }) => {
  await goToChangePage(page);

  await page.getByRole('combobox').selectOption('4');
  await page.getByRole('button', { name: 'THAY ĐỔI' }).click();
  await page.waitForLoadState('networkidle');

  await goToChangePage(page);
  await expect(page.getByRole('combobox')).toHaveValue('4');
});

// ─────────────────────────────────────────────────────────────────────────────
// TC08 – Cập nhật SĐT di động hợp lệ
// ─────────────────────────────────────────────────────────────────────────────
test('TC08 - Cập nhật SĐT di động hợp lệ', async ({ page }) => {
  await goToChangePage(page);

  await page.locator('#mobile').clear();
  await page.locator('#mobile').fill('0912345678');
  await page.getByRole('button', { name: 'THAY ĐỔI' }).click();
  await page.waitForLoadState('networkidle');

  await goToChangePage(page);
  await expect(page.locator('#mobile')).toHaveValue('0912345678');
});

// ─────────────────────────────────────────────────────────────────────────────
// TC09 – SĐT di động quá ngắn → phải có thông báo lỗi
//        THỰC TẾ: web vẫn lưu → FAIL (bug)
// ─────────────────────────────────────────────────────────────────────────────
test('TC09 - SĐT di động quá ngắn (expect thông báo lỗi)', async ({ page }) => {
  await goToChangePage(page);

  await page.locator('#mobile').clear();
  await page.locator('#mobile').fill('094284');
  await page.getByRole('button', { name: 'THAY ĐỔI' }).click();
  await page.waitForLoadState('networkidle');

  const errorMsg = page.locator('text=/điện thoại|phone/i');
  await expect(errorMsg).toBeVisible();
});

// ─────────────────────────────────────────────────────────────────────────────
// TC10 – SĐT di động có chữ → phải có thông báo lỗi
//        THỰC TẾ: web vẫn lưu → FAIL (bug)
// ─────────────────────────────────────────────────────────────────────────────
test('TC10 - SĐT di động có chữ (expect thông báo lỗi)', async ({ page }) => {
  await goToChangePage(page);

  await page.locator('#mobile').clear();
  await page.locator('#mobile').fill('09abc45678');
  await page.getByRole('button', { name: 'THAY ĐỔI' }).click();
  await page.waitForLoadState('networkidle');

  const errorMsg = page.locator('text=/điện thoại|phone/i');
  await expect(errorMsg).toBeVisible();
});

// ─────────────────────────────────────────────────────────────────────────────
// TC11 – Cập nhật SĐT cố định hợp lệ
// ─────────────────────────────────────────────────────────────────────────────
test('TC11 - Cập nhật SĐT cố định hợp lệ', async ({ page }) => {
  await goToChangePage(page);

  await page.locator('#telephone').clear();
  await page.locator('#telephone').fill('02838123456');
  await page.getByRole('button', { name: 'THAY ĐỔI' }).click();
  await page.waitForLoadState('networkidle');

  await goToChangePage(page);
  await expect(page.locator('#telephone')).toHaveValue('02838123456');
});

// ─────────────────────────────────────────────────────────────────────────────
// TC12 – SĐT cố định quá ngắn → phải có thông báo lỗi
//        THỰC TẾ: web vẫn lưu → FAIL (bug)
// ─────────────────────────────────────────────────────────────────────────────
test('TC12 - SĐT cố định quá ngắn (expect thông báo lỗi)', async ({ page }) => {
  await goToChangePage(page);

  await page.locator('#telephone').clear();
  await page.locator('#telephone').fill('094248');
  await page.getByRole('button', { name: 'THAY ĐỔI' }).click();
  await page.waitForLoadState('networkidle');

  const errorMsg = page.locator('text=/điện thoại|phone/i');
  await expect(errorMsg).toBeVisible();
});

// ─────────────────────────────────────────────────────────────────────────────
// TC13 – SĐT cố định có chữ → phải có thông báo lỗi
//        THỰC TẾ: web vẫn lưu → FAIL (bug)
// ─────────────────────────────────────────────────────────────────────────────
test('TC13 - SĐT cố định có chữ (expect thông báo lỗi)', async ({ page }) => {
  await goToChangePage(page);

  await page.locator('#telephone').clear();
  await page.locator('#telephone').fill('028abc123');
  await page.getByRole('button', { name: 'THAY ĐỔI' }).click();
  await page.waitForLoadState('networkidle');

  const errorMsg = page.locator('text=/điện thoại|phone/i');
  await expect(errorMsg).toBeVisible();
});

// ─────────────────────────────────────────────────────────────────────────────
// TC14 – Cập nhật tất cả thông tin hợp lệ cùng lúc (không đổi email)
// ─────────────────────────────────────────────────────────────────────────────
test('TC14 - Cập nhật tất cả thông tin hợp lệ cùng lúc', async ({ page }) => {
  await goToChangePage(page);

  await page.locator('#fullname').fill('Nguyễn Văn Duy');
  await page.locator('#address').fill('123 Đường Lê Lợi, Quận 1');
  await page.getByRole('combobox').selectOption('4');
  await page.locator('#telephone').fill('02838123456');
  await page.locator('#mobile').fill('0912345678');

  await page.getByRole('button', { name: 'THAY ĐỔI' }).click();
  await page.waitForLoadState('networkidle');

  await goToChangePage(page);

  await expect(page.locator('#fullname')).toHaveValue('Nguyễn Văn Duy');
  await expect(page.locator('#address')).toHaveValue('123 Đường Lê Lợi, Quận 1');
  await expect(page.getByRole('combobox')).toHaveValue('4');
  await expect(page.locator('#telephone')).toHaveValue('02838123456');
  await expect(page.locator('#mobile')).toHaveValue('0912345678');
});