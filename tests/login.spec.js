import { test, expect } from '@playwright/test';

const loginTestCases = [
  // ── VALIDATION: EMAIL ────────────────────────────────────────────────────
  {
    id: 'TC01',
    name: 'TRỐNG EMAIL',
    email: '',
    pass: '30122004',
    expectError: /nhập.*email/i
  },
  {
    id: 'TC02',
    name: 'SAI ĐỊNH DẠNG EMAIL',
    email: 'duy_sai_dinh_dang@',
    pass: '30122004',
    expectError: /email không chính xác/i
  },
  {
    id: 'TC03',
    name: 'EMAIL <= 2 KÝ TỰ',
    email: 'a',
    pass: '30122004',
    expectError: /email không chính xác/i
  },
  {
    id: 'TC04',
    name: 'EMAIL CÓ KHOẢNG TRẮNG',
    email: 'duy 3012@gmail.com',
    pass: '30122004',
    expectError: /email không chính xác/i
  },
  {
    id: 'TC05',
    name: 'EMAIL KHÔNG TỒN TẠI',
    email: 'chua_dang_ky_123@gmail.com',
    pass: 'Duy30122004@',
    expectError: /(đăng nhập|tài khoản).*sai/i
  },

  // ── VALIDATION: MẬT KHẨU ────────────────────────────────────────────────
  {
    id: 'TC06',
    name: 'TRỐNG MẬT KHẨU',
    email: 'quangduy@gmail.com',
    pass: '',
    expectError: /nhập.*(mật khẩu|password)/i
  },
  {
    id: 'TC07',
    name: 'MẬT KHẨU <= 2 KÝ TỰ',
    email: 'quangduy@gmail.com',
    pass: '12',
    expectError: /(mật khẩu|password|đăng nhập|).*sai/i
  },
  {
    id: 'TC08',
    name: 'SAI MẬT KHẨU',
    email: 'abcde@gmail.com',
    pass: 'matkhaushit123',
    expectError: /(mật khẩu|password|đăng nhập|).*sai/i
  },

  // ── HAPPY PATH ───────────────────────────────────────────────────────────
  {
    id: 'TC09',
    name: 'ĐĂNG NHẬP THÀNH CÔNG',
    email: 'duy3012@gmail.com',
    pass: 'duy30122004',
    expectError: /đăng nhập thành công/i
  },
];

for (const data of loginTestCases) {
  test(`${data.id} - ${data.name}`, async ({ page }) => {
    page.setDefaultTimeout(10000);

    await page.goto('https://nguyencongpc.vn/dang-nhap', { waitUntil: 'domcontentloaded' });

    let dialogActualMessage = '';
    page.on('dialog', async dialog => {
      dialogActualMessage = dialog.message();
      await dialog.accept();
    });

    await page.locator('#email').fill(data.email);
    await page.locator('#password').fill(data.pass);
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    await Promise.race([
      page.waitForEvent('dialog').catch(() => {}),
      page.waitForTimeout(2000),
    ]);

    const bodyText = await page.innerText('body');
    const passed = data.expectError.test(dialogActualMessage)
                || data.expectError.test(bodyText);

    if (passed) {
      console.log(`🏆 PASS [${data.id} - ${data.name}]`);
    } else {
      console.log(`❌ FAIL [${data.id} - ${data.name}]`);
      expect(passed, `
❌ FAIL [${data.id} - ${data.name}]
   Mong đợi: "${data.expectError}"
   Thực tế : "${dialogActualMessage || bodyText.trim().slice(0, 100)}"
      `).toBeTruthy();
    }
  });
}