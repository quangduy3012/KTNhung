import { test, expect } from '@playwright/test';

const testCases = [
  // EMAIL
  {
    name: 'email sai format',
    email: 'abc',
    phone: '0967246142',
    password: 'Duy30122004@',
    fullName: 'Quang Duy',
    expectError: /email/i
  },

  // PHONE
  {
    name: 'sdt thiếu số',
    email: `test${Date.now()}1@gmail.com`,
    phone: '123',
    password: 'Duy30122004@',
    fullName: 'Quang Duy',
    expectError: /điện thoại|phone/i
  },

  {
    name: 'sdt chứa chữ',
    email: `test${Date.now()}2@gmail.com`,
    phone: 'abcxyz',
    password: 'Duy30122004@',
    fullName: 'Quang Duy',
    expectError: /điện thoại|phone/i
  },

  // PASSWORD
  {
    name: 'password quá ngắn',
    email: `test${Date.now()}3@gmail.com`,
    phone: '0967246142',
    password: '123',
    fullName: 'Quang Duy',
    expectError: /mật khẩu|password/i
  },

  {
    name: 'password không có ký tự đặc biệt',
    email: `test${Date.now()}4@gmail.com`,
    phone: '0967246142',
    password: 'Duy30122004',
    fullName: 'Quang Duy',
    expectError: /mật khẩu|password/i
  },

  {
    name: 'password không có chữ hoa',
    email: `test${Date.now()}5@gmail.com`,
    phone: '0967246142',
    password: 'duy30122004@',
    fullName: 'Quang Duy',
    expectError: /mật khẩu|password/i
  },

  // FULL NAME
  {
    name: 'tên quá ngắn',
    email: `test${Date.now()}6@gmail.com`,
    phone: '0967246142',
    password: 'Duy30122004@',
    fullName: 'a',
    expectError: /tên|name/i
  }
];

for (const data of testCases) {

  test(data.name, async ({ page }) => {

    // 1. Đi tới trang chủ và đợi tải xong
    await page.goto('https://nguyencongpc.vn/');
    await page.waitForLoadState('networkidle');

    // 2. Mở form đăng ký từng bước một cách chậm rãi
    await page.getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
    await page.waitForTimeout(600); // Chờ hiệu ứng menu mở ra

    await page.getByRole('link', { name: 'Tài khoản' }).click();
    await page.waitForTimeout(600);

    await page.getByRole('link', { name: 'Đăng ký tài khoản' }).click();
    await page.waitForLoadState('networkidle');

    // Cấu hình gõ chậm: cách 100ms giữa mỗi ký tự để bạn nhìn rõ
    const typeDelay = { delay: 100 };

    // 3. Nhập dữ liệu vào các trường thông tin
    await page.locator('#email').fill(data.email, typeDelay);
    await page.waitForTimeout(300);

    await page.locator('#full_name').fill(data.fullName, typeDelay);
    await page.waitForTimeout(300);

    await page.locator('#tel').fill(data.phone, typeDelay);
    await page.waitForTimeout(300);

    await page.getByRole('radio').first().check();
    await page.waitForTimeout(300);

    await page.locator('#password').fill(data.password, typeDelay);
    await page.waitForTimeout(300);

    await page.locator('#password1').fill(data.password, typeDelay);
    await page.waitForTimeout(300);

    await page.locator('#address').fill('Hà Nội', typeDelay);
    await page.waitForTimeout(500);

    // 4. Cuộn màn hình xuống nút ĐĂNG KÝ để lộ phần thông báo lỗi bên dưới
    const registerButton = page.getByRole('button', { name: 'ĐĂNG KÝ' });
    await registerButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // Dừng 1 giây cho bạn nhìn lại form trước khi bấm

    // 5. Bấm ĐĂNG KÝ
    await registerButton.click();

    // 6. Đợi thông báo lỗi xuất hiện và giữ màn hình để bạn nhìn lỗi đỏ
    await page.waitForTimeout(1000); // Đợi lỗi render xong
    await registerButton.scrollIntoViewIfNeeded(); // Cuộn lại lần nữa phòng trường hợp lỗi đẩy layout xuống
    
    // Dừng hẳn 3 giây cuối mỗi test case để bạn kiểm tra danh sách chữ đỏ giống như trong ảnh
    await page.waitForTimeout(3000); 

    // 7. Kiểm tra kết quả (Assert)
    await expect(page.locator('body')).toContainText(data.expectError);

  });
}