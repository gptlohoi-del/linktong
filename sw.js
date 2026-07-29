// Đổi số phiên bản này MỖI LẦN bạn cập nhật code HTML/CSS
const CACHE_NAME = 'my-site-cache-v2'; 

// Cài đặt và ép buộc kích hoạt ngay lập tức
self.addEventListener('install', event => {
    self.skipWaiting(); // BẮT BUỘC: Ép Service Worker mới vượt qua trạng thái chờ
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/index_2.html',
                '/qrcode.png'
                // Thêm các file khác của bạn vào đây
            ]);
        })
    );
});

// Kích hoạt và dọn dẹp bộ nhớ đệm (cache) cũ
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Nếu tên cache không khớp với CACHE_NAME hiện tại -> Xóa nó
                    if (cacheName !== CACHE_NAME) {
                        console.log('Đang xóa cache cũ:', cacheName);
                        return caches.delete(cacheName); // BẮT BUỘC: Xóa cache cũ
                    }
                })
            );
        }).then(() => self.clients.claim()) // Ép Service Worker mới nắm quyền kiểm soát tab ngay lập tức
    );
});

// Trả về dữ liệu
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
