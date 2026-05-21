import { test, expect } from '@playwright/test';

// 1. Danh sách đầy đủ các trường hợp kiểm thử
const loginTestCases = [
  { name: 'TRỐNG EMAIL', email: '', pass: '30122004', expectError: '- Mời bạn nhập email!' },
  { name: 'TRỐNG MẬT KHẨU', email: 'quangduy@gmail.com', pass: '', expectError: '- Mời bạn nhập mật khẩu!' },
  { name: 'SAI ĐỊNH DẠNG EMAIL', email: 'duy_sai_dinh_dang@', pass: '30122004', expectError: '- Email không đúng định dạng!' },
  { name: 'SAI EMAIL (KHÔNG TỒN TẠI)', email: 'chua_dang_ky_123@gmail.com', pass: 'Duy30122004@', expectError: '- Email hoặc mật khẩu không chính xác!' },
  { name: 'SAI MẬT KHẨU', email: 'abcde@gmail.com', pass: 'matkhaushit123', expectError: '- Email hoặc mật khẩu không chính xác!' },
];

// Cấu hình chạy lần lượt từng cái để không bị website chặn (429 Too Many Requests)
test.describe.configure({ mode: 'serial' });

for (const data of loginTestCases) {
  test(`Test: ${data.name}`, async ({ page }) => {
    
    // Tăng thời gian chờ mặc định cho mỗi thao tác
    page.setDefaultTimeout(10000);

    // 2. Đi tới trang chủ
    await page.goto('https://nguyencongpc.vn/');

    // Đợi 3s cho quảng cáo hiện rồi tắt (giúp bạn nhìn rõ)
    await page.waitForTimeout(3000); 
    const closePopup = page.locator('.popup-close, #adv-popup .close-popup').first();
    if (await closePopup.isVisible()) {
      await closePopup.click();
      console.log('✅ Đã tắt quảng cáo chặn màn hình.');
    }

    // 3. Vào trang Đăng nhập
    await page.getByRole('link').filter({ hasText: /^$/ }).nth(1).click();
    await page.getByRole('link', { name: 'Tài khoản' }).click();
    await page.waitForLoadState('networkidle');

    // 4. Nhập liệu từ từ
    await test.step(`Nhập dữ liệu cho case: ${data.name}`, async () => {
      const emailInput = page.locator('#email');
      const passInput = page.locator('#password');

      await emailInput.focus();
      await page.keyboard.type(data.email, { delay: 100 }); // Gõ từng chữ cho giống người thật
      await page.waitForTimeout(1000); // Nghỉ 1s để bạn nhìn

      await passInput.focus();
      await page.keyboard.type(data.pass, { delay: 100 });
      await page.waitForTimeout(1000); // Nghỉ 1s để bạn nhìn
    });

    // 5. "BẪY" DIALOG (Popup debug)
    let dialogActualMessage = '';
    let isDialogShown = false;

    page.on('dialog', async dialog => {
      isDialogShown = true;
      dialogActualMessage = dialog.message();
      
      console.log(`\n--- PHÁT HIỆN POPUP DEBUG ---`);
      console.log(`Nội dung hiển thị: "${dialogActualMessage}"`);
      
      // DỪNG LẠI 4 GIÂY Ở ĐÂY ĐỂ BẠN NHÌN THẤY CÁI POPUP TRÊN WEB
      await page.waitForTimeout(4000);
      
      await dialog.accept(); // Sau khi xem xong mới bấm OK
      console.log(`✅ Đã nhấn OK để đóng Popup.\n`);
    });

    // 6. Nhấn nút Đăng nhập
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    // 7. KIỂM TRA VÀ IN LỖI CHI TIẾT
    await test.step('Tổng kết kết quả', async () => {
      // Nếu không hiện Dialog, có thể lỗi hiện ra bằng Text trên trang web
      await page.waitForTimeout(2000); // Đợi xem có Text lỗi nào hiện lên không
      const bodyText = await page.innerText('body');

      // Kiểm tra lỗi có trong Dialog hoặc trong nội dung trang web không
      const foundInDialog = dialogActualMessage.includes(data.expectError);
      const foundInPage = bodyText.includes(data.expectError);

      if (foundInDialog || foundInPage) {
        console.log(`🏆 KẾT QUẢ: PASS [${data.name}]`);
        console.log(`- Web đã báo đúng lỗi: "${data.expectError}"`);
      } else {
        const detailFail = `
❌ KẾT QUẢ: FAIL [${data.name}]
   - Email đã nhập: "${data.email}"
   - Pass đã nhập: "${data.pass}"
   - Mong đợi thấy lỗi: "${data.expectError}"
   - Thực tế nhận được: "${dialogActualMessage || "Không thấy Popup lỗi nào"}"
        `;
        console.log(detailFail);
        
        // Báo lỗi cho Playwright Runner
        expect(foundInDialog || foundInPage, detailFail).toBeTruthy();
      }
    });

    // Nghỉ 2s trước khi sang case tiếp theo để bạn kịp định hình
    await page.waitForTimeout(2000);
  });
}