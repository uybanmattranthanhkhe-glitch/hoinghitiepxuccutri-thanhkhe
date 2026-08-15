// =============================================================
//  CONFIG.JS — Cấu hình toàn bộ ứng dụng Quản trị Hội nghị
//  Chỉnh sửa file này để cập nhật link, mật khẩu, tiêu đề...
//  Không cần đụng vào admin.html hay index.html
// =============================================================

const APP_CONFIG = {

    // ----------------------------------------------------------
    //  1. GOOGLE APPS SCRIPT WEB APP URL
    //     Thay bằng URL mới mỗi khi bạn deploy lại Google Script
    // ----------------------------------------------------------
    WEBAPP_URL: 'https://script.google.com/macros/s/AKfycbx6Dln4SMAfVqaOEOvJb0BOv7ueOUifTZxLEc8zWcUu6Vrq74XdCCRjSyZhWnOFEFM34A/exec',

    // ----------------------------------------------------------
    //  2. MẬT KHẨU QUẢN TRỊ
    //     ĐÃ CHUYỂN sang lưu ở phía server (Script Properties trong
    //     code.gs), KHÔNG còn nằm trong file này nữa — vì config.js
    //     là file public (ai xem source trên GitHub/Vercel cũng đọc
    //     được), để hash mật khẩu ở đây là không an toàn.
    //
    //     Để đổi mật khẩu: đăng nhập Admin như bình thường rồi vào
    //     mục "Đổi mật khẩu" trong trang admin.html. Nên đổi mật khẩu
    //     này sau MỖI LẦN tổ chức hội nghị.
    // ----------------------------------------------------------

    // ----------------------------------------------------------
    //  3. LIÊN KẾT ĐIỀU HƯỚNG
    // ----------------------------------------------------------
    HOME_URL: 'index.html',          // Trang chủ (Về trang chủ / bottom nav)

    // ----------------------------------------------------------
    //  4. TIÊU ĐỀ & NỘI DUNG HIỂN THỊ
    // ----------------------------------------------------------
    APP_TITLE:    'Duyệt Ý Kiến',
    APP_SUBTITLE: 'Quản lý phát biểu tại hội nghị',
    LOGIN_TITLE:  'Quản trị viên',
    LOGIN_SUB:    'Đăng nhập để quản lý ý kiến hội nghị',

    // ----------------------------------------------------------
    //  5. PHẢN HỒI MẶC ĐỊNH KHI "TIẾP NHẬN" Ý KIẾN
    // ----------------------------------------------------------
    DEFAULT_CT_FEEDBACK: 'Đã tiếp nhận ý kiến, chủ toạ sẽ trả lời khi kết luận',

    // ----------------------------------------------------------
    //  6. TẦN SUẤT TỰ ĐỘNG LÀM MỚI DANH SÁCH (mili-giây)
    //     12000 = 12 giây
    // ----------------------------------------------------------
    AUTO_REFRESH_MS: 12000,

};
