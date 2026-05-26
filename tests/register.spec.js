import { test, expect } from '@playwright/test';

test.setTimeout(60000);

const testCases = [
  // ── VALIDATION: EMAIL ────────────────────────────────────────────────────
  {
    id: 'TC01',
    name: 'Email sai format',
    email: 'abc',
    phone: '0967246142',
    password: 'Duy30122004@',
    fullName: 'Quang Duy',
    checkGender: true,
    address: 'Hà Nội',
    checkProvince: true,
    expectError: /email/i
  },
  {
    id: 'TC02',
    name: 'Email để trống',
    email: '',
    phone: '0967246142',
    password: 'Duy30122004@',
    fullName: 'Quang Duy',
    checkGender: true,
    address: 'Hà Nội',
    checkProvince: true,
    expectError: /email/i
  },
  {
    id: 'TC03',
    name: 'Email đã tồn tại',
    email: 'duy3012@gmail.com',
    phone: '0967246142',
    password: 'Duy30122004@',
    fullName: 'Quang Duy',
    checkGender: true,
    address: 'Hà Nội',
    checkProvince: true,
    expectError: /email|tồn tại|đã được đăng ký/i
  },

  // ── VALIDATION: SĐT ─────────────────────────────────────────────────────
  {
    id: 'TC04',
    name: 'SĐT để trống',
    email: `test${Date.now()}04@gmail.com`,
    phone: '',
    password: 'Duy30122004@',
    fullName: 'Quang Duy',
    checkGender: true,
    address: 'Hà Nội',
    checkProvince: true,
    expectError: /SĐT|điện thoại|phone/i
  },
  {
    id: 'TC05',
    name: 'SĐT thiếu số',
    email: `test${Date.now()}05@gmail.com`,
    phone: '123',
    password: 'Duy30122004@',
    fullName: 'Quang Duy',
    checkGender: true,
    address: 'Hà Nội',
    checkProvince: true,
    expectError: /SĐT|điện thoại|phone/i
  },
  {
    id: 'TC06',
    name: 'SĐT chứa chữ',
    email: `test${Date.now()}06@gmail.com`,
    phone: 'abcxyz',
    password: 'Duy30122004@',
    fullName: 'Quang Duy',
    checkGender: true,
    address: 'Hà Nội',
    checkProvince: true,
    expectError: /SĐT|điện thoại|phone/i
  },

  // ── VALIDATION: HỌ TÊN ──────────────────────────────────────────────────
  {
    id: 'TC07',
    name: 'Họ tên để trống',
    email: `test${Date.now()}07@gmail.com`,
    phone: '0967246142',
    password: 'Duy30122004@',
    fullName: '',
    checkGender: true,
    address: 'Hà Nội',
    checkProvince: true,
    expectError: /tên|name/i
  },
  {
    id: 'TC08',
    name: 'Họ tên quá ngắn',
    email: `test${Date.now()}08@gmail.com`,
    phone: '0967246142',
    password: 'Duy30122004@',
    fullName: 'a',
    checkGender: true,
    address: 'Hà Nội',
    checkProvince: true,
    expectError: /tên|name/i
  },

  // ── VALIDATION: MẬT KHẨU ────────────────────────────────────────────────
  {
    id: 'TC09',
    name: 'Mật khẩu để trống',
    email: `test${Date.now()}09@gmail.com`,
    phone: '0967246142',
    password: '',
    fullName: 'Quang Duy',
    checkGender: true,
    address: 'Hà Nội',
    checkProvince: true,
    expectError: /mật khẩu|password/i
  },
  {
    id: 'TC10',
    name: 'Mật khẩu quá ngắn',
    email: `test${Date.now()}10@gmail.com`,
    phone: '0967246142',
    password: '123',
    fullName: 'Quang Duy',
    checkGender: true,
    address: 'Hà Nội',
    checkProvince: true,
    expectError: /mật khẩu|password/i
  },
  {
    id: 'TC11',
    name: 'Mật khẩu không có ký tự đặc biệt',
    email: `test${Date.now()}11@gmail.com`,
    phone: '0967246142',
    password: 'Duy30122004',
    fullName: 'Quang Duy',
    checkGender: true,
    address: 'Hà Nội',
    checkProvince: true,
    expectError: /mật khẩu|password/i
  },
  {
    id: 'TC12',
    name: 'Mật khẩu không có chữ hoa',
    email: `test${Date.now()}12@gmail.com`,
    phone: '0967246142',
    password: 'duy30122004@',
    fullName: 'Quang Duy',
    checkGender: true,
    address: 'Hà Nội',
    checkProvince: true,
    expectError: /mật khẩu|password/i
  },
  {
    id: 'TC13',
    name: 'Mật khẩu xác nhận không khớp',
    email: `test${Date.now()}13@gmail.com`,
    phone: '0967246142',
    password: 'Duy30122004@',
    confirmPassword: 'Duy30122004@Wrong',
    fullName: 'Quang Duy',
    checkGender: true,
    address: 'Hà Nội',
    checkProvince: true,
    expectError: /mật khẩu|password|không khớp/i
  },

  // ── VALIDATION: CÁC TRƯỜNG KHÁC ─────────────────────────────────────────
  {
    id: 'TC14',
    name: 'Không chọn giới tính',
    email: `test${Date.now()}14@gmail.com`,
    phone: '0967246142',
    password: 'Duy30122004@',
    fullName: 'Quang Duy',
    checkGender: false,
    address: 'Hà Nội',
    checkProvince: true,
    expectError: /giới tính/i
  },
  {
    id: 'TC15',
    name: 'Địa chỉ để trống',
    email: `test${Date.now()}15@gmail.com`,
    phone: '0967246142',
    password: 'Duy30122004@',
    fullName: 'Quang Duy',
    checkGender: true,
    address: '',
    checkProvince: true,
    expectError: /địa chỉ/i
  },
  {
    id: 'TC16',
    name: 'Không chọn tỉnh và quận',
    email: `test${Date.now()}16@gmail.com`,
    phone: '0967246142',
    password: 'Duy30122004@',
    fullName: 'Quang Duy',
    checkGender: true,
    address: 'Hà Nội',
    checkProvince: false,
    expectError: /tỉnh|quận|huyện/i
  },
];

for (const data of testCases) {
  test(`${data.id} - ${data.name}`, async ({ page }) => {

    await page.goto('https://nguyencongpc.vn/dang-ky', { waitUntil: 'domcontentloaded' });

    if (data.email)    await page.locator('#email').fill(data.email);
    if (data.fullName) await page.locator('#full_name').fill(data.fullName);
    if (data.phone)    await page.locator('#tel').fill(data.phone);

    if (data.checkGender) {
      await page.getByRole('radio').first().check();
    }

    if (data.password) {
      await page.locator('#password').fill(data.password);
      await page.locator('#password1').fill(data.confirmPassword ?? data.password);
    }

    if (data.address) {
      await page.locator('#address').fill(data.address);
    }

    if (data.checkProvince) {
      const province = page.locator('#buyer_province');
      await province.selectOption({ label: 'Hà Nội' });
      await province.dispatchEvent('change');
      await page.waitForTimeout(500);

      const district = page.locator('#js-district-holder');
      await district.selectOption({ label: 'Huyện Ứng Hòa' });
      await district.dispatchEvent('change');
    }

    // Bẫy dialog phòng web dùng alert
    let dialogMsg = '';
    page.on('dialog', async dialog => {
      dialogMsg = dialog.message();
      await dialog.accept();
    });

    await page.getByRole('button', { name: 'ĐĂNG KÝ' }).click();
    await page.waitForTimeout(1000);

    // Lấy text đỏ hoặc dialog
    const errorText = dialogMsg || await page.locator('#js-contact-note').innerText().catch(() => '');
    const passed = data.expectError.test(errorText);

    if (!passed) {
      console.log(`\n❌ FAIL [${data.id} - ${data.name}]`);
      console.log(`   Email      : "${data.email}"`);
      console.log(`   Phone      : "${data.phone}"`);
      console.log(`   Pass       : "${data.password}"`);
      console.log(`   Tên        : "${data.fullName}"`);
      console.log(`   Giới tính  : ${data.checkGender ? 'có chọn' : 'không chọn'}`);
      console.log(`   Địa chỉ   : "${data.address || 'để trống'}"`);
      console.log(`   Tỉnh/Quận : ${data.checkProvince ? 'có chọn' : 'không chọn'}`);
      console.log(`   Mong đợi   : "${data.expectError}"`);
      console.log(`   Thực tế    : "${errorText.trim()}"`);
      expect(passed, `❌ FAIL [${data.id} - ${data.name}] — Mong: "${data.expectError}" | Thực tế: "${errorText.trim()}"`).toBeTruthy();
    }
  });
}

// ── TC17: HAPPY PATH - Đăng ký thành công ────────────────────────────────
test('TC17 - Đăng ký thành công', async ({ page }) => {
  const uniqueEmail = `test${Date.now()}@gmail.com`;

  await page.goto('https://nguyencongpc.vn/dang-ky', { waitUntil: 'domcontentloaded' });

  await page.locator('#email').fill(uniqueEmail);
  await page.locator('#full_name').fill('Quang Duy');
  await page.locator('#tel').fill('0967246142');
  await page.getByRole('radio').first().check();
  await page.locator('#password').fill('Duy30122004@');
  await page.locator('#password1').fill('Duy30122004@');
  await page.locator('#address').fill('Hà Nội');

  const province = page.locator('#buyer_province');
  await province.selectOption({ label: 'Hà Nội' });
  await province.dispatchEvent('change');
  await page.waitForTimeout(500);

  const district = page.locator('#js-district-holder');
  await district.selectOption({ label: 'Huyện Ứng Hòa' });
  await district.dispatchEvent('change');

  let dialogMsg = '';
  page.on('dialog', async dialog => {
    dialogMsg = dialog.message();
    await dialog.accept();
  });

  await page.getByRole('button', { name: 'ĐĂNG KÝ' }).click();
  await page.waitForTimeout(2000);

  const currentURL = page.url();
  const isRedirected = /taikhoan|thanh-cong|success/i.test(currentURL);
  const isSuccessMsg = /thành công|welcome|chào mừng/i.test(dialogMsg);

  expect(
    isRedirected || isSuccessMsg,
    `❌ FAIL [TC17 - Đăng ký thành công] — URL: "${currentURL}" | Dialog: "${dialogMsg}"`
  ).toBeTruthy();
});