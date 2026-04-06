const CACHE_NAME = 'fun-game-hub-v2'; // Naikkan versi (v2, v3, dst) setiap kali ada perubahan file
const ASSETS_TO_CACHE = [
  '/',
  'index.html',
  'style.css',
  'main.js',
  'manifest.json',
  'favicon.ico',               // Sesuai screenshot
  'favicon-32x32.png',         // Sesuai screenshot
  'images/icon-192.png',       // Tambahkan path images/
  'images/icon-512.png',       // Tambahkan path images/
  'images/sanrio.png'          // Tambahkan path images/
];

// 1. Install - Simpan aset utama ke cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching aset utama...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting()) // Langsung ambil alih tanpa menunggu tab ditutup
  );
});

// 2. Activate - Hapus cache versi lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Menghapus cache lama:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Memastikan SW baru mengontrol semua tab aktif
  );
});

// 3. Fetch - Strategi Stale-While-Revalidate
// Browser akan kasih data dari cache (cepat), tapi sambil download versi terbaru di background
self.addEventListener('fetch', (event) => {
  // HANYA cache request GET. Abaikan POST (Leaderboard) atau skema chrome-extension
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Update cache hanya jika respons valid
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Return cachedResponse jika network gagal (offline)
        return cachedResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});

// 4. Listener untuk reload otomatis dari index.html
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});