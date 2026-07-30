// 1. ĐỔI SỐ PHIÊN BẢN (v1 -> v2). MỖI LẦN CẬP NHẬT CODE WEB, HÃY TĂNG SỐ NÀY LÊN (v3, v4...)
const CACHE_NAME = 'link-tree-cache-v3'; 
const urlsToCache = [
  './',
  './index.html',
  './qrcode.png', // Nhớ thêm file ảnh QR vào để nó lưu offline
  './manifest.json',
  // Thêm icon vào đây nếu bạn đã có file icon thực tế
  // './icon-192x192.png',
  // './icon-512x512.png'
];

// Quá trình cài đặt: Lưu các file vào Cache


// Phản hồi yêu cầu (Fetch): Chiến lược Network-First (Ưu tiên Mạng)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Nếu điện thoại có mạng và tải file thành công:
        // Mở cache ra và cập nhật lại file mới nhất vào cache
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // Nếu điện thoại mất mạng (offline):
        // Tìm và trả về file đã lưu sẵn trong bộ nhớ đệm
        return caches.match(event.request);
      })
  );
});



// Phản hồi yêu cầu (Fetch): Trả về từ Cache nếu có, nếu không thì lấy từ mạng
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Trả về kết quả đã cache
        }
        return fetch(event.request); // Tải từ Internet
      })
  );
});

// Cập nhật Service worker và xóa cache cũ
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Đã xóa cache cũ:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    // THÊM DÒNG NÀY: Ép Service Worker mới giành quyền kiểm soát trang web ngay lập tức
    .then(() => self.clients.claim()) 
  );
});
