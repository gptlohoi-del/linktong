// 1. ĐỔI SỐ PHIÊN BẢN (v1 -> v2). MỖI LẦN CẬP NHẬT CODE WEB, HÃY TĂNG SỐ NÀY LÊN (v3, v4...)
const CACHE_NAME = 'link-tree-cache-v2'; 
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
self.addEventListener('install', event => {
  // THÊM DÒNG NÀY: Bắt buộc Service Worker mới bỏ qua trạng thái "chờ" và cài đặt ngay
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Đã mở cache');
        return cache.addAll(urlsToCache);
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
