import React, { useState, useEffect } from 'react';
import { Order, MenuItem, ShopProfile } from './types';
import {
  getStoredOrders,
  saveOrders,
  getStoredMenu,
  saveMenu,
  getStoredProfile,
  saveProfile,
  DEFAULT_ORDERS,
  DEFAULT_MENU,
  DEFAULT_PROFILE,
} from './utils/storage';
import { Header } from './components/Header';
import { OrderParserTab } from './components/OrderParserTab';
import { KitchenDashboardTab } from './components/KitchenDashboardTab';
import { SettingsAndMenuTab } from './components/SettingsAndMenuTab';
import { ReceiptModal } from './components/ReceiptModal';
import { Download, X, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [orders, setOrders] = useState<Order[]>(() => getStoredOrders());
  const [menuCatalog, setMenuCatalog] = useState<MenuItem[]>(() => getStoredMenu());
  const [profile, setProfile] = useState<ShopProfile>(() => getStoredProfile());

  const [activeTab, setActiveTab] = useState<'parser' | 'dashboard' | 'settings'>('parser');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const [backupBannerDismissed, setBackupBannerDismissed] = useState(false);
  const [backupSuccessMsg, setBackupSuccessMsg] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    saveMenu(menuCatalog);
  }, [menuCatalog]);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  // Order Handlers
  const handleOrderSaved = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  // Menu Handlers
  const handleSaveMenu = (updatedMenu: MenuItem[]) => {
    setMenuCatalog(updatedMenu);
  };

  // Profile Handlers
  const handleSaveProfile = (updatedProfile: ShopProfile) => {
    setProfile(updatedProfile);
  };

  // Restore All Data from JSON
  const handleRestoreAllData = (data: { profile: ShopProfile; menu: MenuItem[]; orders: Order[] }) => {
    setProfile(data.profile);
    setMenuCatalog(data.menu);
    setOrders(data.orders);
  };

  // Reset to default sample data
  const handleResetToDefault = () => {
    setOrders(DEFAULT_ORDERS);
    setMenuCatalog(DEFAULT_MENU);
    setProfile(DEFAULT_PROFILE);
    saveOrders(DEFAULT_ORDERS);
    saveMenu(DEFAULT_MENU);
    saveProfile(DEFAULT_PROFILE);
  };

  // 1-Click Silent Auto-Backup Trigger
  const handleQuickBackupDownload = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile: {
        ...profile,
        lastBackupDate: new Date().toISOString(),
      },
      menu: menuCatalog,
      orders: orders,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bakeriflow_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setProfile((prev) => ({ ...prev, lastBackupDate: new Date().toISOString() }));
    setBackupSuccessMsg(true);
    setTimeout(() => {
      setBackupSuccessMsg(false);
      setBackupBannerDismissed(true);
    }, 3000);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrdersCount = orders.filter((o) => o.deliveryDate === todayStr).length;

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col font-sans text-slate-800 antialiased selection:bg-[#881337] selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ordersCount={orders.length}
        todayCount={todayOrdersCount}
        profile={profile}
      />

      {/* SILENT AUTO-BACKUP REMINDER BANNER */}
      {!backupBannerDismissed && orders.length >= 3 && (
        <div className="no-print bg-[#f5efe8] border-b border-[#e2d5c6] px-4 py-2">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="font-mono text-sm">📦</span>
              <span>
                Anda mempunyai <strong>{orders.length} rekod tempahan</strong> dalam peranti ini.
                Simpan salinan sandaran ke fail peribadi anda untuk keselamatan data.
              </span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {backupSuccessMsg ? (
                <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Fail Berjaya Dimuat Turun!
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleQuickBackupDownload}
                  className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md bg-white border border-[#d8c8b8] hover:bg-[#ede3d8] text-slate-800 transition-colors shadow-2xs"
                >
                  <Download className="w-3 h-3 text-emerald-700" />
                  <span>Muat Turun Sandaran (JSON)</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setBackupBannerDismissed(true)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                title="Tutup peringatan"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        {activeTab === 'parser' && (
          <OrderParserTab
            menuCatalog={menuCatalog}
            orders={orders}
            profile={profile}
            onOrderSaved={handleOrderSaved}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
            onOpenReceipt={(order) => setSelectedReceiptOrder(order)}
          />
        )}

        {activeTab === 'dashboard' && (
          <KitchenDashboardTab
            orders={orders}
            profile={profile}
            onUpdateOrder={handleUpdateOrder}
            onDeleteOrder={handleDeleteOrder}
            onOpenReceipt={(order) => setSelectedReceiptOrder(order)}
            onNavigateToParser={() => setActiveTab('parser')}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsAndMenuTab
            profile={profile}
            menuCatalog={menuCatalog}
            orders={orders}
            onSaveProfile={handleSaveProfile}
            onSaveMenu={handleSaveMenu}
            onRestoreAllData={handleRestoreAllData}
            onResetToDefault={handleResetToDefault}
          />
        )}
      </main>

      {/* Footer (Hidden on print) */}
      <footer className="no-print border-t border-[#e9dfd6] py-6 text-center text-xs text-slate-400 bg-[#f7f2ec]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-serif font-bold text-slate-700 tracking-tight">
            BakeriFlow <span className="font-mono text-[10px] text-slate-400 font-normal">v1.1</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Aplikasi Pengurusan Pesanan & Dapur Bakeri dari Rumah
          </div>
        </div>
      </footer>

      {/* Receipt Modal */}
      {selectedReceiptOrder && (
        <ReceiptModal
          order={selectedReceiptOrder}
          profile={profile}
          onClose={() => setSelectedReceiptOrder(null)}
        />
      )}
    </div>
  );
}
