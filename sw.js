// Service Worker para ADLN-Market PWA
// Version: 1.0.0
// Cache first strategy for static resources

const CACHE_NAME = 'adln-market-v1.0.0';
const STATIC_CACHE = 'adln-static-v1.0.0';
const DYNAMIC_CACHE = 'adln-dynamic-v1.0.0';

// Recursos estáticos a serem cacheados no install
const STATIC_FILES = [
  '/',
  '/index.html',
  '/cart.html',
  '/category.html',
  '/style.css',
  '/script.js',
  '/commons/logo_adln.png',
  '/commons/icons/favicon-192x192.png',
  '/commons/icons/favicon-512x512.png',
  '/commons/icons/manifest.json',
  '/commons/banner_1.jpg',
  '/commons/banner_2.jpg',
  '/commons/banner_3.jpg',
  '/commons/banner_4.jpg',
  '/commons/banner_5.jpg',
  '/commons/banner_6.jpg',
  '/commons/banner_7.jpg'
];

// URLs da API que precisam ser cacheadas dinamicamente
const API_BASE = 'https://catalogo-products.pages.dev';

// Install Event - Cache inicial
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES.filter(file => 
          !file.includes('http') || file.startsWith('/')
        )).catch(err => {
          console.warn('[SW] Some files failed to cache:', err);
          // Continue even if some files fail
        });
      })
  );
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate Event - Cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all clients immediately
  self.clients.claim();
});

// Fetch Event - Cache strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle different types of requests
  if (request.url.includes(API_BASE)) {
    // API requests - Network first, cache fallback
    event.respondWith(handleAPIFetch(request));
  } else if (request.url.includes('.html') || request.url.includes('.css') || request.url.includes('.js')) {
    // HTML, CSS, JS - Cache first, network fallback
    event.respondWith(handleStaticFetch(request));
  } else if (request.url.includes('.jpg') || request.url.includes('.png') || request.url.includes('.jpeg')) {
    // Images - Stale while revalidate
    event.respondWith(handleImageFetch(request));
  } else {
    // Default - Network first
    event.respondWith(handleDefaultFetch(request));
  }
});

// Cache First Strategy for static files
async function handleStaticFetch(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('[SW] Static fetch failed:', error);
    // Return offline fallback for HTML
    if (request.destination === 'document') {
      return caches.match('/index.html');
    }
  }
}

// Network First Strategy for API
async function handleAPIFetch(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('[SW] API fetch failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for products
    return new Response(JSON.stringify({
      error: 'offline',
      message: 'Sem conexão com a internet. Verifique sua conectividade.',
      data: []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Stale While Revalidate for images
async function handleImageFetch(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse && networkResponse.status === 200) {
      const cache = caches.open(DYNAMIC_CACHE);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// Default strategy - Network first
async function handleDefaultFetch(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse;
  }
}

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      syncOfflineActions()
    );
  }
});

async function syncOfflineActions() {
  console.log('[SW] Syncing offline actions...');
  
  try {
    // Get offline data from IndexedDB
    const offlineCart = await getFromIndexedDB('offlineCart');
    const offlineOrders = await getFromIndexedDB('offlineOrders');
    
    // Sync if online
    if (!navigator.onLine) return;
    
    // Sync offline cart
    if (offlineCart) {
      await syncCartData(offlineCart);
    }
    
    // Sync offline orders
    if (offlineOrders && offlineOrders.length > 0) {
      await syncOrderData(offlineOrders);
    }
    
  } catch (error) {
    console.warn('[SW] Sync failed:', error);
  }
}

// Helper functions for IndexedDB
async function getFromIndexedDB(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ADLNMarketDB');
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const getRequest = store.getAll();
      
      getRequest.onsuccess = () => resolve(getRequest.result);
      getRequest.onerror = () => reject(getRequest.error);
    };
    request.onerror = () => reject(request.error);
  });
}

// Push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Nova notificação da ADLN-Market',
      icon: '/commons/icons/favicon-192x192.png',
      badge: '/commons/icons/favicon-72x72.png',
      tag: 'adln-notification',
      data: data.data || {},
      actions: [
        {
          action: 'view',
          title: 'Ver',
          icon: '/commons/icons/favicon-96x96.png'
        },
        {
          action: 'dismiss',
          title: 'Dispensar'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'ADLN-Market', options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Network status
self.addEventListener('online', () => {
  console.log('[SW] Network connection restored');
  syncOfflineActions();
});

self.addEventListener('offline', () => {
  console.log('[SW] Network connection lost');
});
