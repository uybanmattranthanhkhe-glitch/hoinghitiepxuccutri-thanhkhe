// =============================================================
//  /api/proxy.js — Vercel Serverless Function
//  Proxy trung gian giữa web app và Google Apps Script Web App.
//
//  Mục đích:
//   - Giấu WEBAPP_URL (link Google Apps Script / Google Sheet)
//     khỏi mã nguồn phía trình duyệt (view-source không thấy được).
//   - Kiểm tra mật khẩu quản trị NGAY TRÊN SERVER, không còn gửi
//     hash mật khẩu xuống client (config.js không còn chứa hash).
//
//  Cấu hình bắt buộc trên Vercel (Project Settings → Environment
//  Variables), KHÔNG được commit các giá trị này vào Git:
//
//   GOOGLE_SHEET_WEBAPP_URL   = https://script.google.com/macros/s/xxx/exec
//   ADMIN_PASSWORD_HASH       = (chuỗi SHA-256 của mật khẩu quản trị,
//                                tạo tại https://emn178.github.io/online-tools/sha256.html)
//
//  Sau khi thêm/đổi biến môi trường, phải Redeploy để có hiệu lực.
// =============================================================

module.exports = async function handler(req, res) {
  // Chỉ cho phép GET / POST — mọi phương thức khác đều bị chặn
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const WEBAPP_URL = process.env.GOOGLE_SHEET_WEBAPP_URL;
  if (!WEBAPP_URL) {
    return res.status(500).json({
      error: 'Server chưa cấu hình GOOGLE_SHEET_WEBAPP_URL trong Vercel Environment Variables',
    });
  }

  try {
    // ------------------------- GET -------------------------
    // Dùng cho mọi thao tác đọc dữ liệu: ?action=get ...
    if (req.method === 'GET') {
      const params = new URLSearchParams(req.query);
      params.set('t', Date.now().toString()); // chống cache
      const upstream = await fetch(`${WEBAPP_URL}?${params.toString()}`);
      const text = await upstream.text();
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      return res.status(upstream.status).send(text);
    }

    // ------------------------- POST -------------------------
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    if (!body || typeof body !== 'object') body = {};

    // --- Đăng nhập quản trị: xử lý riêng, KHÔNG chuyển tiếp lên Google Script ---
    // Client gửi lên SHA-256(mật khẩu người dùng nhập), server so sánh với
    // ADMIN_PASSWORD_HASH lưu trong biến môi trường. Hash thật không bao giờ
    // xuất hiện trong mã nguồn/HTML gửi cho trình duyệt.
    if (body.action === 'admin_login') {
      const expected = process.env.ADMIN_PASSWORD_HASH || '';
      const provided = String(body.passwordHash || '');
      const ok = Boolean(expected) && provided.toLowerCase() === expected.toLowerCase();
      return res.status(200).json({ success: ok });
    }

    // --- Mọi action khác (add, delete, delete_all, approve, toggle_form, save_state...) ---
    // được chuyển tiếp nguyên trạng tới Google Apps Script.
    const upstream = await fetch(WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
    });
    const text = await upstream.text();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(upstream.status).send(text);
  } catch (err) {
    console.error('proxy error:', err);
    return res.status(502).json({ error: 'Không kết nối được máy chủ dữ liệu' });
  }
}
