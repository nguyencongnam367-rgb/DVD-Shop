# Cách áp dụng bản cập nhật DVD-Shop

1. Copy đè toàn bộ thư mục `src/` + `package.json` + `.env.example` vào project (giữ nguyên các file không có trong bản này: models, routes home/cart/product, footer, footer.css, dashboard.css...).
2. `cp .env.example .env` rồi chỉnh `MONGO_URI`, `SESSION_SECRET`.
3. `npm install`
4. Bật MongoDB, chạy `npm run seed` (tạo admin/admin123, 3 thể loại, 6 DVD).
5. `npm run dev` → http://localhost:3000

Lưu ý:
- Cần xoá file `src/app/data/products.js` (không còn dùng).
- Trang chủ link chi tiết theo slug (`/home/:slug`), trang /products link theo `_id`.
- Icon Morphicons: dán SVG export từ morphicons.com vào `<span class="morph-icon">` trong home.hbs (hiện là icon giỏ hàng mẫu).
- Đổi mật khẩu admin sau khi seed.

Giao diện responsive: file mới `responsive.css` và `dashboard-responsive.css` (đã được link trong layout). Header/footer viết lại bằng class mới (`site-header`, `site-footer`) nên không xung đột CSS cũ.
