// ================================================================
//  MIDDLEWARE.JS — Lớp bảo mật RIÊNG của Vercel, đặt TRƯỚC khi
//  người dùng chạm được tới admin.html / dieukhien.html.
//
//  Đây là lớp thứ 2, độc lập với mật khẩu đăng nhập trong app
//  (đã làm ở code.gs/admin.html). Ai đó phải vượt qua CẢ HAI lớp
//  mới vào được trang quản trị — kể cả khi biết chính xác URL.
//
//  Đặt file này ở THƯ MỤC GỐC của repo (ngang hàng với index.html).
//  Vercel sẽ tự nhận diện và chạy middleware này trước mọi request
//  khớp với "matcher" bên dưới — không cần cấu hình gì thêm.
// ================================================================

export const config = {
  // Áp dụng cho cả link cũ (.html) lẫn 2 link bí mật mới trong vercel.json
  // Nếu bạn đổi tên link bí mật trong vercel.json, nhớ sửa lại danh sách này cho khớp.
  matcher: ['/admin', '/admin.html', '/dieukhien', '/dieukhien.html', '/qtri-hn2026', '/led-hn2026', '/chutoa', '/chutoa.html'],
};

export default function middleware(request) {
  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASS;

  // Nếu quên cấu hình biến môi trường -> KHÔNG chặn, để tránh tự khoá
  // chính mình ngoài hệ thống. Hãy luôn cấu hình 2 biến này trong
  // Vercel > Settings > Environment Variables (xem hướng dẫn đi kèm).
  if (!user || !pass) {
    return;
  }

  const authHeader = request.headers.get('authorization');

  if (authHeader && authHeader.startsWith('Basic ')) {
    try {
      const decoded = atob(authHeader.slice(6));
      const sepIndex = decoded.indexOf(':');
      const u = decoded.slice(0, sepIndex);
      const p = decoded.slice(sepIndex + 1);
      if (u === user && p === pass) {
        return; // Đúng -> cho qua, Vercel sẽ phục vụ file admin.html/dieukhien.html như bình thường
      }
    } catch (e) {
      // decode lỗi -> rơi xuống trả 401 bên dưới
    }
  }

  return new Response('Khu vực này yêu cầu xác thực.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Khu vuc quan tri - Hoi nghi tiep xuc cu tri", charset="UTF-8"',
    },
  });
}
