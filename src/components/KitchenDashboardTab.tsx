import React, { useState, useMemo } from 'react';
import { Order, OrderStatus, ShopProfile } from '../types';
import { formatCurrency, formatDateMalay, getDailySlotUsage } from '../utils/storage';
import {
  CalendarDays,
  Clock,
  CheckSquare2,
  Square,
  AlertCircle,
  Search,
  Printer,
  Trash2,
  Truck,
  Store,
  Plus,
  ExternalLink,
  MessageCircle,
  ChefHat,
  ChevronDown,
  Flame,
  X,
  Send,
  CheckCheck,
  CheckCircle2
} from 'lucide-react';

interface KitchenDashboardTabProps {
  orders: Order[];
  profile: ShopProfile;
  onUpdateOrder: (updatedOrder: Order) => void;
  onDeleteOrder: (orderId: string) => void;
  onOpenReceipt: (order: Order) => void;
  onNavigateToParser: () => void;
}

export const KitchenDashboardTab: React.FC<KitchenDashboardTabProps> = ({
  orders,
  profile,
  onUpdateOrder,
  onDeleteOrder,
  onOpenReceipt,
  onNavigateToParser,
}) => {
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'tomorrow' | 'week' | 'custom'>('all');
  const [customDate, setCustomDate] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWhatsAppModalOrder, setActiveWhatsAppModalOrder] = useState<Order | null>(null);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);
  const weekLaterStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  }, []);

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        if (dateFilter === 'today') {
          if (order.deliveryDate !== todayStr) return false;
        } else if (dateFilter === 'tomorrow') {
          if (order.deliveryDate !== tomorrowStr) return false;
        } else if (dateFilter === 'week') {
          if (order.deliveryDate < todayStr || order.deliveryDate > weekLaterStr) return false;
        } else if (dateFilter === 'custom' && customDate) {
          if (order.deliveryDate !== customDate) return false;
        }

        if (statusFilter !== 'all' && order.status !== statusFilter) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCustomer = order.customerName.toLowerCase().includes(q);
          const matchPhone = (order.customerPhone || '').includes(q);
          const matchWording = (order.wordingOnCake || '').toLowerCase().includes(q);
          const matchItems = order.items.some((it) => it.name.toLowerCase().includes(q));
          if (!matchCustomer && !matchPhone && !matchWording && !matchItems) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const dateCompare = a.deliveryDate.localeCompare(b.deliveryDate);
        if (dateCompare !== 0) return dateCompare;
        return (a.deliveryTime || '').localeCompare(b.deliveryTime || '');
      });
  }, [orders, dateFilter, customDate, statusFilter, searchQuery, todayStr, tomorrowStr, weekLaterStr]);

  const stats = useMemo(() => {
    const todayOrders = orders.filter((o) => o.deliveryDate === todayStr);
    const pendingPrep = orders.filter((o) => o.status === 'Baru' || o.status === 'Sedang Disediakan').length;
    const readyCount = orders.filter((o) => o.status === 'Siap Dibuat').length;
    const completedCount = orders.filter((o) => o.status === 'Selesai').length;
    const totalTodayRevenue = todayOrders.reduce((sum, o) => sum + o.totalPrice, 0);

    return {
      todayCount: todayOrders.length,
      pendingPrep,
      readyCount,
      completedCount,
      totalTodayRevenue,
    };
  }, [orders, todayStr]);

  // Slot capacity for current viewed date
  const activeDateTarget = dateFilter === 'today' ? todayStr : dateFilter === 'tomorrow' ? tomorrowStr : customDate || todayStr;
  const slotUsage = getDailySlotUsage(activeDateTarget, orders, profile.maxDailySlots || 5);

  const handleToggleItemCheck = (order: Order, itemId: string) => {
    const currentChecklist = { ...(order.itemChecklist || {}) };
    const nextVal = !currentChecklist[itemId];
    currentChecklist[itemId] = nextVal;

    const allChecked = order.items.every((it) => currentChecklist[it.id]);
    let nextStatus = order.status;
    if (allChecked && (order.status === 'Baru' || order.status === 'Sedang Disediakan')) {
      nextStatus = 'Siap Dibuat';
    } else if (!allChecked && order.status === 'Siap Dibuat') {
      nextStatus = 'Sedang Disediakan';
    }

    const updated: Order = {
      ...order,
      itemChecklist: currentChecklist,
      status: nextStatus,
    };

    onUpdateOrder(updated);
  };

  const handleStatusChange = (order: Order, newStatus: OrderStatus) => {
    const updated: Order = {
      ...order,
      status: newStatus,
    };
    onUpdateOrder(updated);
  };

  // Helper to open WhatsApp with custom message
  const triggerWhatsAppSend = (order: Order, rawMessage: string, autoUpdateStatus?: OrderStatus) => {
    let cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '6' + cleanPhone;
    else if (!cleanPhone.startsWith('60') && cleanPhone.length > 8) cleanPhone = '60' + cleanPhone;

    const encoded = encodeURIComponent(rawMessage);
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');

    if (autoUpdateStatus && autoUpdateStatus !== order.status) {
      handleStatusChange(order, autoUpdateStatus);
    }
    setActiveWhatsAppModalOrder(null);
  };

  // 4 WhatsApp Phase Messages + Spell-Check
  const getPhaseMessages = (order: Order) => [
    {
      title: 'Bahan sedang disediakan / Kek sedang dibakar',
      badge: 'Fasa Pembakaran',
      color: 'bg-amber-50 text-amber-900 border-amber-200',
      autoStatus: 'Sedang Disediakan' as OrderStatus,
      msg: `Hai ${order.customerName}! 👩‍🍳
Tempahan kek anda (${order.id}) kini sedang dalam proses: bahan sedang disediakan & kek sedang dibakar di dapur kami. Kami akan maklumkan perkembangan seterusnya nanti ya.

Terima kasih! ❤️
- ${profile.shopName}`,
    },
    {
      title: 'Kek sudah siap dihias & dimasukkan ke chiller',
      badge: 'Fasa Penghiasan Siap',
      color: 'bg-blue-50 text-blue-900 border-blue-200',
      autoStatus: 'Siap Dibuat' as OrderStatus,
      msg: `Hai ${order.customerName}! 🎂❄️
Kek anda (${order.id})${order.wordingOnCake ? ` dengan tulisan "${order.wordingOnCake}"` : ''} telah siap dihias cantik & kini disimpan selamat di dalam chiller untuk mengekalkan kesegarannya.

Terima kasih! ❤️
- ${profile.shopName}`,
    },
    {
      title: 'Kek sedia untuk diambil di pagar rumah',
      badge: 'Sedia Pickup',
      color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      autoStatus: 'Siap Dibuat' as OrderStatus,
      msg: `Hai ${order.customerName}! 🛍️
Tempahan anda (${order.id}) telah sedia untuk diambil di pagar rumah/premis kami. 

Sila maklumkan apabila anda tiba di pagar utama ya.
Alamat/Arahan: ${profile.pickupInstructions || profile.address || 'Pagar utama'}

Terima kasih! ❤️
- ${profile.shopName}`,
    },
    {
      title: 'Pemandu Lalamove/Grab telah mengambil kek anda',
      badge: 'Penghantaran Berjalan',
      color: 'bg-purple-50 text-purple-900 border-purple-200',
      autoStatus: 'Selesai' as OrderStatus,
      msg: `Hai ${order.customerName}! 🚗💨
Kek anda (${order.id}) telah diserahkan kepada pemandu penghantar (Lalamove/Grab) dan kini sedang dalam perjalanan ke alamat anda: ${order.address || 'mengikut tempahan'}.

Sila pastikan kek diletakkan di tempat rata berhawa dingin ya. Terima kasih! ❤️
- ${profile.shopName}`,
    },
    {
      title: 'Sahkan Ejaan Nama / Ucapan Kek',
      badge: 'Semakan Ejaan',
      color: 'bg-rose-50 text-[#881337] border-rose-200',
      autoStatus: undefined,
      msg: `Hai ${order.customerName}! 👋
Sebelum kami mula membakar & menghias kek anda (${order.id}) untuk ${formatDateMalay(order.deliveryDate)}, mohon sahkan ejaan nama / ucapan pada kek ini tepat 100% ya:

👉 "${order.wordingOnCake || 'Tiada nota ucapan'}"

Balas "OK" jika ejaan sudah betul. Terima kasih! ❤️
- ${profile.shopName}`,
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-[#e9dfd6] pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
            Jadual Tempahan & Senarai Semak Dapur
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Urus penyediaan harian mengikut tarikh dan masa siap. Tanda item apabila siap dibakar dan dihias.
          </p>
        </div>
        <button
          onClick={onNavigateToParser}
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg bg-[#881337] text-white hover:bg-[#72102e] transition-colors self-start sm:self-auto shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Tempahan</span>
        </button>
      </div>

      {/* KITCHEN LEDGER METRICS + CAPACITY BADGE */}
      <section aria-labelledby="ledger-metrics-heading" className="bg-white rounded-xl border border-[#e4d8cb] p-4 sm:p-5 shadow-2xs space-y-3">
        <h2 id="ledger-metrics-heading" className="sr-only">Ringkasan Dapur</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#ebdcd0]">
          <div className="pt-2 sm:pt-0 sm:px-3 first:pl-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Tempahan Hari Ini
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5">
              {stats.todayCount}
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Nilai: {formatCurrency(stats.totalTodayRevenue)}
            </span>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
              Menunggu Dibuat
            </span>
            <div className="text-2xl font-bold font-mono text-amber-950 mt-0.5">
              {stats.pendingPrep}
            </div>
            <span className="text-[11px] text-amber-700">Baru / Sedang Dibuat</span>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
              Siap Dihias
            </span>
            <div className="text-2xl font-bold font-mono text-emerald-950 mt-0.5">
              {stats.readyCount}
            </div>
            <span className="text-[11px] text-emerald-700">Sedia Serah/Hantar</span>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Selesai Diserah
            </span>
            <div className="text-2xl font-bold font-mono text-slate-700 mt-0.5">
              {stats.completedCount}
            </div>
            <span className="text-[11px] text-slate-500">Pesanan ditutup</span>
          </div>
        </div>

        {/* Daily Capacity Progress Bar */}
        <div className="pt-3 border-t border-[#f0e7de] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">
              Kapasiti Dapur ({formatDateMalay(activeDateTarget)}):
            </span>
            <span className="font-mono font-bold bg-[#faf7f2] px-2 py-0.5 rounded border border-[#d8c8b8] text-slate-800">
              {slotUsage.count} / {slotUsage.maxSlots} slot
            </span>
            {slotUsage.isFull ? (
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-600" />
                Slot Maksimum Tercapai
              </span>
            ) : (
              <span className="text-[11px] text-emerald-700 font-medium">
                Baki {slotUsage.remaining} slot kosong
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400">
            Had kapasiti boleh diubahsuai di tab Kedai (Lalai: {profile.maxDailySlots || 5} slot/hari)
          </span>
        </div>
      </section>

      {/* CONTROL TOOLBAR: Filters, Dates, and Search */}
      <section aria-labelledby="filter-toolbar-heading" className="bg-white rounded-xl border border-[#e4d8cb] p-4 shadow-2xs space-y-3">
        <h2 id="filter-toolbar-heading" className="sr-only">Penapis Tempahan</h2>
        {/* Date Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setDateFilter('all')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                dateFilter === 'all'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-[#faf7f2] text-slate-700 hover:bg-[#ede3d8]'
              }`}
            >
              Semua ({orders.length})
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                dateFilter === 'today'
                  ? 'bg-[#881337] text-white font-bold'
                  : 'bg-[#faf7f2] text-slate-700 hover:bg-[#ede3d8]'
              }`}
            >
              Hari Ini ({stats.todayCount})
            </button>
            <button
              onClick={() => setDateFilter('tomorrow')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                dateFilter === 'tomorrow'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-[#faf7f2] text-slate-700 hover:bg-[#ede3d8]'
              }`}
            >
              Esok
            </button>
            <button
              onClick={() => setDateFilter('week')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                dateFilter === 'week'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-[#faf7f2] text-slate-700 hover:bg-[#ede3d8]'
              }`}
            >
              7 Hari Akan Datang
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              aria-label="Pilih tarikh tempahan tertentu"
              value={customDate}
              onChange={(e) => {
                setCustomDate(e.target.value);
                setDateFilter('custom');
              }}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-[#d8c8b8] bg-[#faf7f2] font-mono text-slate-700"
            />
          </div>
        </div>

        {/* Status Filters & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-[#f2e9df]">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Status:</span>
            {['all', 'Baru', 'Sedang Disediakan', 'Siap Dibuat', 'Selesai'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === st
                    ? 'bg-rose-50 text-[#881337] font-bold border border-rose-200'
                    : 'text-slate-600 hover:bg-[#faf7f2]'
                }`}
              >
                {st === 'all' ? 'Semua' : st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              aria-label="Cari tempahan"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, no tel, tulisan kek..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-[#d8c8b8] focus:outline-hidden focus:ring-1 focus:ring-[#881337] bg-[#faf7f2]"
            />
          </div>
        </div>
      </section>

      {/* ORDERS LIST */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e4d8cb] p-10 text-center space-y-3">
          <div className="w-12 h-12 bg-[#faf7f2] border border-[#ebdcd0] rounded-xl flex items-center justify-center mx-auto text-slate-500">
            <ChefHat className="w-6 h-6 text-[#881337]" />
          </div>
          <h2 className="text-sm font-bold text-slate-800">Tiada Tempahan Dijumpai</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
              ? 'Sila sesuaikan penapis carian, tarikh atau status di atas.'
              : 'Belum ada tempahan. Tampal mesej WhatsApp di tab Ekstrak untuk mula mengurus.'}
          </p>
          <button
            onClick={onNavigateToParser}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-[#881337] text-white hover:bg-[#72102e] transition-colors shadow-2xs mt-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ekstrak Tempahan Baru</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 font-mono">
            <span>{filteredOrders.length} tempahan disenaraikan:</span>
            <span>Tanda kotak semak apabila item siap di dapur</span>
          </div>

          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const allChecked = order.items.every((it) => order.itemChecklist?.[it.id]);

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-xl border transition-all p-4 sm:p-5 shadow-2xs ${
                    order.status === 'Selesai'
                      ? 'border-[#e4d8cb] opacity-75'
                      : order.status === 'Siap Dibuat'
                      ? 'border-[#a7d4be] ring-1 ring-[#bce2d0]'
                      : 'border-[#e4d8cb] hover:border-[#d0bfaf]'
                  }`}
                >
                  {/* Docket Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#f0e7de]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-[#f5efe8] px-2 py-0.5 rounded text-slate-800 border border-[#e2d5c6]">
                        {order.id}
                      </span>
                      <span className="text-sm font-bold text-slate-900">{order.customerName}</span>

                      {order.customerPhone && (
                        <a
                          href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-800 bg-[#f0f7f4] hover:bg-[#e2f1ea] px-2 py-0.5 rounded border border-[#b8ddcb] transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{order.customerPhone}</span>
                        </a>
                      )}

                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                          order.deliveryType === 'Delivery'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-[#f7f2ec] text-slate-700 border border-[#e2d5c6]'
                        }`}
                      >
                        {order.deliveryType === 'Delivery' ? <Truck className="w-3 h-3" /> : <Store className="w-3 h-3" />}
                        <span>{order.deliveryType}</span>
                      </span>
                    </div>

                    {/* Due Date & Time */}
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-900 flex items-center justify-end gap-1">
                          <CalendarDays className="w-3.5 h-3.5 text-[#881337]" />
                          <span>{formatDateMalay(order.deliveryDate)}</span>
                        </div>
                        <div className="text-xs font-mono font-bold text-[#881337] flex items-center justify-end gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{order.deliveryTime || 'Masa belum set'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CRITICAL WORDING ON CAKE DOCKET (FR-002) */}
                  {order.wordingOnCake && (
                    <div className="my-3 p-3 rounded-lg bg-[#fffbeb] border border-[#f59e0b] text-[#92400e]">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#b45309] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        TULISAN ATAS KEK / NOTA KHAS
                      </div>
                      <div className="text-sm sm:text-base font-serif font-bold text-slate-900 mt-1">
                        "{order.wordingOnCake}"
                      </div>
                    </div>
                  )}

                  {/* Address if Delivery */}
                  {order.deliveryType === 'Delivery' && order.address && (
                    <div className="mb-3 text-xs bg-[#faf7f2] p-2 rounded-lg border border-[#ebdcd0] text-slate-700 flex items-start gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-blue-700 flex-shrink-0 mt-0.5" />
                      <span className="flex-1"><strong>Alamat:</strong> {order.address}</span>
                    </div>
                  )}

                  {/* Kitchen Checklist Items (FR-004) */}
                  <div className="mb-3 bg-[#faf7f2] p-3 rounded-xl border border-[#ebdcd0] space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      <span>Senarai Semak Pembakaran & Hiasan</span>
                      <span className="font-mono text-slate-500 font-normal">
                        {order.items.filter((it) => order.itemChecklist?.[it.id]).length}/{order.items.length} siap
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {order.items.map((item) => {
                        const isChecked = !!order.itemChecklist?.[item.id];
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleToggleItemCheck(order, item.id)}
                            className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition-colors ${
                              isChecked
                                ? 'bg-[#f0f7f4] border-[#b8ddcb] text-emerald-950'
                                : 'bg-white border-[#d8c8b8] text-slate-800 hover:border-slate-400'
                            }`}
                          >
                            {isChecked ? (
                              <CheckSquare2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            )}
                            <span className={`font-semibold flex-1 ${isChecked ? 'line-through text-emerald-900/60' : ''}`}>
                              {item.qty}x {item.name}
                            </span>
                            <span className="text-slate-500 text-[11px] font-mono">
                              {formatCurrency(item.price * item.qty)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {order.notes && (
                    <div className="text-xs text-slate-600 italic bg-[#faf7f2] p-2 rounded-lg mb-3 border border-[#ebdcd0]">
                      <strong>Nota Dapur:</strong> {order.notes}
                    </div>
                  )}

                  {/* Footer Bar: Status & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#f0e7de]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-semibold">Status:</span>
                      <select
                        aria-label={`Status tempahan ${order.id}`}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border focus:outline-hidden cursor-pointer ${
                          order.status === 'Baru'
                            ? 'bg-rose-50 border-rose-300 text-[#881337]'
                            : order.status === 'Sedang Disediakan'
                            ? 'bg-amber-50 border-amber-300 text-amber-900'
                            : order.status === 'Siap Dibuat'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            : 'bg-slate-100 border-slate-300 text-slate-700'
                        }`}
                      >
                        <option value="Baru">Baru</option>
                        <option value="Sedang Disediakan">Sedang Disediakan</option>
                        <option value="Siap Dibuat">Siap Dibuat</option>
                        <option value="Selesai">Selesai</option>
                      </select>

                      <span className="text-xs font-mono font-bold text-slate-900 ml-1">
                        {formatCurrency(order.totalPrice)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* 1-KLIK WHATSAPP MULTI-PHASE MODAL TRIGGER */}
                      <button
                        type="button"
                        onClick={() => setActiveWhatsAppModalOrder(order)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#f0f7f4] text-emerald-800 border border-[#b8ddcb] hover:bg-[#e2f1ea] transition-colors"
                        title="Pilih mesej fasa untuk WhatsApp pelanggan"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Mesej Fasa WA</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenReceipt(order)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white text-slate-800 border border-[#d8c8b8] hover:bg-[#faf7f2] transition-colors shadow-2xs"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#881337]" />
                        <span>Resit / QR</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Adakah anda pasti mahu memadamkan tempahan #${order.id} untuk ${order.customerName}?`)) {
                            onDeleteOrder(order.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Padam Tempahan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 1-CLICK WHATSAPP WORKFLOW PHASE DIALOG */}
      {activeWhatsAppModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-5 space-y-4 border border-[#e4d8cb] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#ebdcd0] pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Hantar Status Fasa ke WhatsApp Pelanggan
                </h3>
                <p className="text-[11px] text-slate-500">
                  Pilih templat mesej fasa mengikut status semasa tempahan #{activeWhatsAppModalOrder.id} ({activeWhatsAppModalOrder.customerName}):
                </p>
              </div>
              <button
                onClick={() => setActiveWhatsAppModalOrder(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {getPhaseMessages(activeWhatsAppModalOrder).map((phase, idx) => (
                <div
                  key={idx}
                  className="bg-[#faf7f2] p-3 rounded-lg border border-[#ebdcd0] hover:border-[#d0bfaf] transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <span>🔘</span>
                      <span>{phase.title}</span>
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${phase.color}`}>
                      {phase.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded border border-[#ebdcd0] font-mono whitespace-pre-line leading-relaxed">
                    {phase.msg}
                  </p>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => triggerWhatsAppSend(activeWhatsAppModalOrder, phase.msg, phase.autoStatus)}
                      className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Hantar Mesej Ini</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-[#ebdcd0]">
              <button
                type="button"
                onClick={() => setActiveWhatsAppModalOrder(null)}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
