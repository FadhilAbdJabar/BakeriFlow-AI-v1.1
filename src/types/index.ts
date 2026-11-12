export type DeliveryType = 'Delivery' | 'Self-pickup';

export type OrderStatus = 'Baru' | 'Sedang Disediakan' | 'Siap Dibuat' | 'Selesai';

export type PaymentStatus = 'Belum Bayar' | 'Deposit Dibayar' | 'Selesai Bayar';

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  isCustom?: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryDate: string; // YYYY-MM-DD
  deliveryTime: string; // HH:mm
  deliveryType: DeliveryType;
  address: string;
  wordingOnCake: string;
  items: OrderItem[];
  itemChecklist: Record<string, boolean>; // itemId -> completed
  totalPrice: number;
  depositPaid: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  basePrice: number;
  category: string;
  description?: string;
}

export interface CloudSyncConfig {
  provider: 'local_only' | 'firebase' | 'supabase';
  enabled: boolean;
  syncStatus: 'synced' | 'pending' | 'offline' | 'local_only';
  lastSyncedAt?: string;
  deviceId?: string;
  projectId?: string;
}

export interface ShopProfile {
  shopName: string;
  phone: string;
  bankName: string;
  bankAccount: string;
  accountHolder: string;
  qrImageUrl: string;
  tagline: string;
  address?: string;
  pickupInstructions?: string;
  maxDailySlots: number; // Daily orders limit/capacity
  lastBackupDate?: string;
  cloudSync?: CloudSyncConfig;
}

export interface ParsedAIOrder {
  customerName: string;
  customerPhone: string;
  deliveryDate: string;
  deliveryTime: string;
  deliveryType: 'Delivery' | 'Self-pickup';
  address: string;
  wordingOnCake: string;
  detectedItems: Array<{
    itemName: string;
    quantity: number;
    estimatedPrice: number;
  }>;
}
