import { Order, MenuItem, ShopProfile } from '../types';

const STORAGE_ORDERS_KEY = 'bakeriflow_orders_v1';
const STORAGE_MENU_KEY = 'bakeriflow_menu_v1';
const STORAGE_PROFILE_KEY = 'bakeriflow_profile_v1';

export const DEFAULT_MENU: MenuItem[] = [
  { id: 'm1', name: 'Kek Coklat Fudge Moist (7")', basePrice: 65, category: 'Kek Hari Jadi', description: 'Kek coklat lembap dilapisi chocolate ganache pekat' },
  { id: 'm2', name: 'Kek Pandan Gula Melaka (8")', basePrice: 75, category: 'Kek Hari Jadi', description: 'Kek span pandan asli beraroma dengan krim gula melaka' },
  { id: 'm3', name: 'Burnt Cheesecake Klasik (7")', basePrice: 70, category: 'Kek Keju', description: 'Basque burnt cheesecake berkrim lembut di dalam' },
  { id: 'm4', name: 'Korean Bento Cake Minimalist (4")', basePrice: 35, category: 'Kek Hari Jadi', description: 'Kek saiz comel dengan rekaan minimalist dan tulisan khas' },
  { id: 'm5', name: 'Nutella Brownies Kedut (Box 16pcs)', basePrice: 45, category: 'Brownies & Bar', description: 'Brownies coklat berkilat dengan swirl Nutella pekat' },
  { id: 'm6', name: 'Red Velvet Cream Cheese Cupcakes (Box 12pcs)', basePrice: 50, category: 'Cupcakes', description: 'Cupcake baldu merah lembut dengan frosting krim keju' },
  { id: 'm7', name: 'Pavlova Mini Buah Segar (Box 6pcs)', basePrice: 42, category: 'Pastri & Tart', description: 'Meringue rangup di luar dan lembut di dalam bersama buah segar' },
  { id: 'm8', name: 'Kek Keju Biscoff Leleh (7")', basePrice: 85, category: 'Kek Keju', description: 'Cheesecake sejuk dengan lapisan biskut Lotus Biscoff rangup' },
];

export const DEFAULT_PROFILE: ShopProfile = {
  shopName: 'Dapur Manis Che Siti',
  phone: '013-8892110',
  bankName: 'Maybank',
  bankAccount: '164285923810',
  accountHolder: 'Siti Nur Aishah',
  qrImageUrl: '',
  tagline: 'Kek & Pastri Buatan Rumah Dengan Kasih Sayang',
  address: 'No 15, Jalan Melati 2/1, Seksyen 7, 40000 Shah Alam, Selangor',
  pickupInstructions: 'Sila maklumkan 15 minit sebelum tiba di pagar utama.',
  maxDailySlots: 5,
  lastBackupDate: new Date().toISOString(),
  cloudSync: {
    provider: 'local_only',
    enabled: false,
    syncStatus: 'local_only',
    deviceId: 'DEVICE-' + Math.floor(1000 + Math.random() * 9000),
  },
};

export const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ORD-1001',
    customerName: 'Puan Haliza',
    customerPhone: '0129876543',
    deliveryDate: new Date().toISOString().split('T')[0], // Today
    deliveryTime: '15:30',
    deliveryType: 'Self-pickup',
    address: '',
    wordingOnCake: 'Happy 10th Birthday Alya Amanda ❤️🎂',
    items: [
      { id: 'i1', name: 'Kek Coklat Fudge Moist (7")', qty: 1, price: 65 },
      { id: 'i2', name: 'Custom Acrylic Topper "Alya 10"', qty: 1, price: 12, isCustom: true },
      { id: 'i3', name: 'Lilin & Pisau Kek', qty: 1, price: 0, isCustom: true },
    ],
    itemChecklist: {
      i1: true,
      i2: false,
      i3: false,
    },
    totalPrice: 77,
    depositPaid: 40,
    paymentStatus: 'Deposit Dibayar',
    status: 'Sedang Disediakan',
    notes: 'Kek sudah siap dibakar. Perlu pasang topper dan piping tulisan ucapan jam 2 petang.',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'ORD-1002',
    customerName: 'Faiz Hakimi',
    customerPhone: '0173344556',
    deliveryDate: new Date().toISOString().split('T')[0], // Today
    deliveryTime: '17:00',
    deliveryType: 'Delivery',
    address: 'No 34, Jalan Seri Saujana 5, Taman Seri Saujana, Shah Alam',
    wordingOnCake: 'Happy Anniversary Mama & Papa 25th 💐',
    items: [
      { id: 'i4', name: 'Kek Pandan Gula Melaka (8")', qty: 1, price: 75 },
      { id: 'i5', name: 'Caj Penghantaran Lalamove', qty: 1, price: 15, isCustom: true },
    ],
    itemChecklist: {
      i4: false,
      i5: false,
    },
    totalPrice: 90,
    depositPaid: 90,
    paymentStatus: 'Selesai Bayar',
    status: 'Baru',
    notes: 'Pelanggan minta kurangkan sedikit manis pada buttercream.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'ORD-1003',
    customerName: 'Sarah Nadia',
    customerPhone: '0198877665',
    deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    deliveryTime: '11:00',
    deliveryType: 'Self-pickup',
    address: '',
    wordingOnCake: 'Selamat Pengantin Baru Farah & Zahid 💕',
    items: [
      { id: 'i6', name: 'Red Velvet Cream Cheese Cupcakes (Box 12pcs)', qty: 2, price: 50 },
      { id: 'i7', name: 'Kotak Hadiah Reben Mewah', qty: 2, price: 8, isCustom: true },
    ],
    itemChecklist: {
      i6: false,
      i7: false,
    },
    totalPrice: 116,
    depositPaid: 50,
    paymentStatus: 'Deposit Dibayar',
    status: 'Baru',
    notes: 'Reben warna champagne gold.',
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
];

export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_ORDERS_KEY);
    if (!raw) {
      saveOrders(DEFAULT_ORDERS);
      return DEFAULT_ORDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read orders from localStorage:', e);
    return DEFAULT_ORDERS;
  }
}

export function saveOrders(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders to localStorage:', e);
  }
}

export function getStoredMenu(): MenuItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_MENU_KEY);
    if (!raw) {
      saveMenu(DEFAULT_MENU);
      return DEFAULT_MENU;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read menu from localStorage:', e);
    return DEFAULT_MENU;
  }
}

export function saveMenu(menu: MenuItem[]): void {
  try {
    localStorage.setItem(STORAGE_MENU_KEY, JSON.stringify(menu));
  } catch (e) {
    console.error('Failed to save menu to localStorage:', e);
  }
}

export function getStoredProfile(): ShopProfile {
  try {
    const raw = localStorage.getItem(STORAGE_PROFILE_KEY);
    if (!raw) {
      saveProfile(DEFAULT_PROFILE);
      return DEFAULT_PROFILE;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      maxDailySlots: Number(parsed.maxDailySlots) || DEFAULT_PROFILE.maxDailySlots,
    };
  } catch (e) {
    console.error('Failed to read profile from localStorage:', e);
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: ShopProfile): void {
  try {
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to localStorage:', e);
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ms-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDateMalay(dateStr: string): string {
  if (!dateStr) return 'Tiada tarikh';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return new Intl.DateTimeFormat('ms-MY', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
    }
    return dateStr;
  } catch (e) {
    return dateStr;
  }
}

export function generateOrderId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${randomNum}`;
}

export function getDailySlotUsage(dateStr: string, orders: Order[], maxSlots: number = 5) {
  if (!dateStr) return { count: 0, maxSlots, isFull: false, remaining: maxSlots };
  const count = orders.filter((o) => o.deliveryDate === dateStr && o.status !== 'Selesai').length;
  return {
    count,
    maxSlots,
    isFull: count >= maxSlots,
    remaining: Math.max(0, maxSlots - count),
  };
}
