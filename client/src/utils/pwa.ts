// PWA utilities for Sakshi Platform

// Register service worker
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      
      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // Check every hour
      
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  } else {
    console.warn('Service Workers not supported');
    return null;
  }
}

// Unregister service worker
export async function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    return registration.unregister();
  }
  return false;
}

// Check if app is installed as PWA
export function isInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
}

// Check if app can be installed
export function canInstall() {
  return !isInstalled() && 'beforeinstallprompt' in window;
}

// PWA install prompt handler
let deferredPrompt: any = null;

export function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing
    e.preventDefault();
    // Save the event for later use
    deferredPrompt = e;
    console.log('Install prompt ready');
    
    // Dispatch custom event to notify app
    window.dispatchEvent(new CustomEvent('pwa-install-available'));
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    deferredPrompt = null;
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('pwa-installed'));
  });
}

// Show install prompt
export async function showInstallPrompt() {
  if (!deferredPrompt) {
    throw new Error('Install prompt not available');
  }

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for user response
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response to install prompt: ${outcome}`);

  // Clear the deferred prompt
  deferredPrompt = null;

  return outcome === 'accepted';
}

// Check if device is online
export function isOnline() {
  return navigator.onLine;
}

// Setup online/offline listeners
export function setupNetworkListeners(
  onOnline?: () => void,
  onOffline?: () => void
) {
  window.addEventListener('online', () => {
    console.log('Network: Online');
    onOnline?.();
  });

  window.addEventListener('offline', () => {
    console.log('Network: Offline');
    onOffline?.();
  });
}

// Request notification permission
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

// Show local notification
export function showNotification(
  title: string,
  options?: NotificationOptions
) {
  if (Notification.permission === 'granted') {
    return new Notification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      ...options,
    });
  }
  return null;
}

// Subscribe to push notifications
export async function subscribeToPush(registration: ServiceWorkerRegistration) {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.VITE_VAPID_PUBLIC_KEY || ''
      ),
    });
    
    console.log('Push subscription:', subscription);
    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push:', error);
    throw error;
  }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Cache management
export async function clearCache() {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('All caches cleared');
  }
}

export async function getCacheSize() {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      
      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }
    
    return totalSize;
  }
  return 0;
}

// IndexedDB for offline data
export class OfflineStorage {
  private dbName = 'sakshi-offline';
  private version = 1;
  private db: IDBDatabase | null = null;

  async open() {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('pending-orders')) {
          db.createObjectStore('pending-orders', { keyPath: 'id', autoIncrement: true });
        }
        
        if (!db.objectStoreNames.contains('cached-menu')) {
          db.createObjectStore('cached-menu', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('user-preferences')) {
          db.createObjectStore('user-preferences', { keyPath: 'key' });
        }
      };
    });
  }

  async savePendingOrder(order: any) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['pending-orders'], 'readwrite');
      const store = transaction.objectStore('pending-orders');
      const request = store.add(order);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getPendingOrders() {
    const db = await this.open();
    return new Promise<any[]>((resolve, reject) => {
      const transaction = db.transaction(['pending-orders'], 'readonly');
      const store = transaction.objectStore('pending-orders');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async removePendingOrder(id: number) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['pending-orders'], 'readwrite');
      const store = transaction.objectStore('pending-orders');
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(undefined);
    });
  }

  async cacheMenu(menu: any[]) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cached-menu'], 'readwrite');
      const store = transaction.objectStore('cached-menu');
      
      // Clear existing menu
      store.clear();
      
      // Add new menu items
      menu.forEach(item => store.add(item));

      transaction.oncomplete = () => resolve(undefined);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getCachedMenu() {
    const db = await this.open();
    return new Promise<any[]>((resolve, reject) => {
      const transaction = db.transaction(['cached-menu'], 'readonly');
      const store = transaction.objectStore('cached-menu');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
}

// Export singleton instance
export const offlineStorage = new OfflineStorage();

// Initialize PWA features
export function initializePWA() {
  // Register service worker
  registerServiceWorker();
  
  // Setup install prompt
  setupInstallPrompt();
  
  // Setup network listeners
  setupNetworkListeners(
    () => {
      // Sync pending orders when online
      if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then(registration => {
          return (registration as any).sync.register('sync-orders');
        });
      }
    }
  );
  
  console.log('PWA initialized');
}
