const CACHE_NAME = 'linkpermit-pro-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  // Tambahkan path ikon Anda di sini nanti
  // './icon-192.png',
  // './icon-512.png'
];

// 1. Tahap Install: Menyimpan aset ke Cache browser
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Mencaching aset utama');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Tahap Aktivasi: Membersihkan cache lama jika ada update
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('SW: Menghapus cache lama');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Strategi Fetch: Ambil dari internet, jika gagal/offline ambil dari cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// 4. Menangani Push Notification (Pesan dari Server/Supabase)
self.addEventListener('push', (event) => {
  let data = { 
    title: 'LinkPermit Pro', 
    body: 'Waktu izin Anda hampir habis!', 
    url: '/' 
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: 'icon-192.png', // Pastikan file ini ada
    badge: 'icon-192.png',
    vibrate: [200, 100, 200, 100, 200],
    data: {
      url: data.url
    },
    actions: [
      { action: 'open', title: 'Buka Aplikasi' },
      { action: 'close', title: 'Tutup' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 5. Menangani Klik pada Notifikasi
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Jika user klik "Buka Aplikasi" atau klik area notifikasi
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Jika aplikasi sudah terbuka, fokuskan saja
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Jika belum terbuka, buka jendela baru
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || '/');
      }
    })
  );
});
