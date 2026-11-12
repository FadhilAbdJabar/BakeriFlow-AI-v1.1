import React, { useState } from 'react';
import { MenuItem, Order, OrderItem, ParsedAIOrder, PaymentStatus, ShopProfile } from '../types';
import { formatCurrency, generateOrderId, getDailySlotUsage, formatDateMalay } from '../utils/storage';
import {
  Wand2,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Phone,
  User,
  ShoppingBag,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Truck,
  Store,
  ExternalLink,
  ClipboardPaste,
  CheckCheck,
  Flame,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface OrderParserTabProps {
  menuCatalog: MenuItem[];
  orders: Order[];
  profile: ShopProfile;
  onOrderSaved: (newOrder: Order) => void;
  onNavigateToDashboard: () => void;
  onOpenReceipt: (order: Order) => void;
}

export const OrderParserTab: React.FC<OrderParserTabProps> = ({
  menuCatalog,
  orders,
  profile,
  onOrderSaved,
  onNavigateToDashboard,
  onOpenReceipt,
}) => {
  const [rawText, setRawText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseNotice, setParseNotice] = useState<string | null>(null);
  const [clipboardNotice, setClipboardNotice] = useState<string | null>(null);
  const [spellCheckCopied, setSpellCheckCopied] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const d = new Date(Date.now() + 86400000);
    return d.toISOString().split('T')[0];
  });
  const [deliveryTime, setDeliveryTime] = useState('14:00');
  const [deliveryType, setDeliveryType] = useState<'Delivery' | 'Self-pickup'>('Self-pickup');
  const [address, setAddress] = useState('');
  const [wordingOnCake, setWordingOnCake] = useState('');
  const [items, setItems] = useState<OrderItem[]>([
    { id: 'item-1', name: 'Kek Coklat Fudge Moist (7")', qty: 1, price: 65 },
  ]);
  const [depositPaid, setDepositPaid] = useState<number>(30);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Deposit Dibayar');
  const [notes, setNotes] = useState('');
  const [savedSuccessOrder, setSavedSuccessOrder] = useState<Order | null>(null);

  // Daily Slot Capacity calculation
  const slotUsage = getDailySlotUsage(deliveryDate, orders, profile.maxDailySlots || 5);

  const sampleMessages = [
    {
      label: 'Kek Birthday & Topper',
      text: `Salam kak Siti, saya Mira. Nak order Kek Coklat Fudge Moist saiz 7 inci sebiji untuk hari sabtu 15/11/2026 pkl 3:30 petang. 
Tulis atas kek: "Happy 5th Birthday Rayyan Mikhail"
Self pickup kat rumah akak ya. Tolong add topper lilin sekali.
No phone saya 019-3456789. Terima kasih!`,
    },
    {
      label: 'Bento Cake & Delivery',
      text: `Hi sis! Nak tempah Korean Bento Cake 1 biji dan Nutella Brownies Kedut 1 kotak.
Tulisan kek: "Happy 1st Anniversary My Love"
Hantar tarikh 14/11/2026 jam 2 petang ke alamat: No 24, Jalan Kenanga 3/2, Bandar Baru Bangi.
Nama saya Farah, no 012-7788990. Minta caj delivery sekali ya.`,
    },
    {
      label: 'Cupcakes Majlis & Custom',
      text: `Kak Aishah, nak order 2 kotak Red Velvet Cream Cheese Cupcakes (Box 12pcs) untuk majlis esok ahad pkl 11:00 pagi.
Tulisan kotak/kad: "Tahniah Dr Aiman & Dr Sara"
Nota khas: Kurangkan manis pada cream cheese & letak kotak hadiah ribbon cantik.
Pickup sendiri. Call saya Nizam 013-4455667 bila dah siap.`,
    },
  ];

  const handleApplySample = (sample: string) => {
    setRawText(sample);
    setParseError(null);
    setParseNotice(null);
  };

  // 1-Tap Smart Clipboard Paste
  const handlePasteFromClipboard = async () => {
    try {
      if (!navigator.clipboard?.readText) {
        throw new Error('Pelayar anda memerlukan kebenaran papan keratan (clipboard).');
      }
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        setClipboardNotice('Papan keratan (clipboard) anda kosong.');
        setTimeout(() => setClipboardNotice(null), 3000);
        return;
      }

      setRawText(text);
      setParseError(null);
      setClipboardNotice('Mesej berjaya ditampal terus dari WhatsApp!');
      setTimeout(() => setClipboardNotice(null), 3500);

      // Auto-trigger parsing if it looks like a meaningful message
      if (text.length > 15) {
        handleParseWithAI(text);
      }
    } catch (err: any) {
      console.warn('Clipboard read error:', err);
      setClipboardNotice('Sila benarkan akses Clipboard atau tekan Paste secara manual.');
      setTimeout(() => setClipboardNotice(null), 4000);
    }
  };

  const handleParseWithAI = async (textToParse?: string) => {
    const targetText = typeof textToParse === 'string' ? textToParse : rawText;
    if (!targetText.trim()) {
      setParseError('Sila tampal teks pesanan dari WhatsApp terlebih dahulu.');
      return;
    }

    setIsParsing(true);
    setParseError(null);
    setParseNotice(null);

    try {
      const response = await fetch('/api/parse-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: targetText,
          menuCatalog: menuCatalog,
        }),
      });

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Gagal mengekstrak teks WhatsApp.');
      }

      const data: ParsedAIOrder = result.data;

      if (data.customerName) setCustomerName(data.customerName);
      if (data.customerPhone) setCustomerPhone(data.customerPhone);
      if (data.deliveryDate) setDeliveryDate(data.deliveryDate);
      if (data.deliveryTime) setDeliveryTime(data.deliveryTime);
      if (data.deliveryType) setDeliveryType(data.deliveryType);
      if (data.address) setAddress(data.address);
      if (data.wordingOnCake) setWordingOnCake(data.wordingOnCake);

      if (result.notice || result.warning) {
        setParseNotice(result.notice || result.warning);
      }

      if (Array.isArray(data.detectedItems) && data.detectedItems.length > 0) {
        const mappedItems: OrderItem[] = data.detectedItems.map((det, index) => {
          const matchedMenu = menuCatalog.find(
            (m) =>
              m.name.toLowerCase().includes(det.itemName.toLowerCase()) ||
              det.itemName.toLowerCase().includes(m.name.toLowerCase())
          );

          const finalPrice = matchedMenu ? matchedMenu.basePrice : (det.estimatedPrice || 50);
          const finalName = matchedMenu ? matchedMenu.name : det.itemName;

          return {
            id: `item-${Date.now()}-${index}`,
            name: finalName,
            qty: Number(det.quantity) || 1,
            price: Number(finalPrice) || 0,
            isCustom: !matchedMenu,
          };
        });

        setItems(mappedItems);
      }

      setSavedSuccessOrder(null);
    } catch (err: any) {
      console.error(err);
      setParseError(err.message || 'Ralat sambungan AI. Borang boleh dilengkapkan secara manual.');
    } finally {
      setIsParsing(false);
    }
  };

  const setQuickDate = (offsetDays: number) => {
    const target = new Date();
    target.setDate(target.getDate() + offsetDays);
    setDeliveryDate(target.toISOString().split('T')[0]);
  };

  const handleAddItemFromCatalog = (menuId: string) => {
    const found = menuCatalog.find((m) => m.id === menuId);
    if (!found) return;

    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        name: found.name,
        qty: 1,
        price: found.basePrice,
        isCustom: false,
      },
    ]);
  };

  const handleAddCustomItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        name: 'Caj Custom / Topper',
        qty: 1,
        price: 10,
        isCustom: true,
      },
    ]);
  };

  const handleUpdateItem = (id: string, updates: Partial<OrderItem>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...updates } : it)));
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      alert('Perlu sekurang-kurangnya 1 item pesanan.');
      return;
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Generate Spell-Check Confirmation Message for WhatsApp
  const generateSpellCheckMessage = () => {
    const dateFormatted = formatDateMalay(deliveryDate);
    return `Hai ${customerName || 'Pelanggan'}! 👋
Sebelum kami mula membakar & menghias kek anda di ${profile.shopName || 'dapur kami'} untuk ${dateFormatted}, mohon sahkan ejaan nama / ucapan pada kek ini tepat 100% ya:

👉 "${wordingOnCake}"

Balas "OK" jika ejaan sudah tepat. Terima kasih banyak! ❤️`;
  };

  const handleOpenSpellCheckWhatsApp = () => {
    const text = encodeURIComponent(generateSpellCheckMessage());
    let cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '6' + cleanPhone;
    else if (!cleanPhone.startsWith('60') && cleanPhone.length > 8) cleanPhone = '60' + cleanPhone;
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  const handleCopySpellCheck = () => {
    navigator.clipboard.writeText(generateSpellCheckMessage());
    setSpellCheckCopied(true);
    setTimeout(() => setSpellCheckCopied(false), 2000);
  };

  const subtotal = items.reduce((acc, curr) => acc + (curr.price || 0) * (curr.qty || 1), 0);
  const balanceDue = Math.max(0, subtotal - (depositPaid || 0));

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert('Sila masukkan nama pelanggan.');
      return;
    }

    if (!deliveryDate) {
      alert('Sila tentukan tarikh penghantaran/pickup.');
      return;
    }

    if (items.length === 0) {
      alert('Sila masukkan sekurang-kurangnya satu item pesanan.');
      return;
    }

    const checklist: Record<string, boolean> = {};
    items.forEach((it) => {
      checklist[it.id] = false;
    });

    const newOrder: Order = {
      id: generateOrderId(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryDate: deliveryDate,
      deliveryTime: deliveryTime || '14:00',
      deliveryType: deliveryType,
      address: deliveryType === 'Delivery' ? address.trim() : '',
      wordingOnCake: wordingOnCake.trim(),
      items: items,
      itemChecklist: checklist,
      totalPrice: subtotal,
      depositPaid: Number(depositPaid) || 0,
      paymentStatus: paymentStatus,
      status: 'Baru',
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    onOrderSaved(newOrder);
    setSavedSuccessOrder(newOrder);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-[#e9dfd6] pb-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div>
            <h1 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
              Ekstrak Tempahan WhatsApp
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Tukar teks sembang berterabur kepada rekod pesanan dapur terstruktur dalam beberapa saat.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Langkah 1 daripada 2</span>
        </div>
      </div>

      {/* INPUT PANEL: WhatsApp Message Extractor */}
      <section aria-labelledby="raw-text-heading" className="bg-white rounded-xl border border-[#e4d8cb] p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <label id="raw-text-heading" htmlFor="whatsapp-input" className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-[#881337] text-white text-[11px] font-mono flex items-center justify-center font-bold">
              1
            </span>
            Teks Mesej Pelanggan
          </label>

          {/* Smart 1-Tap Clipboard Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePasteFromClipboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-[#881337] border border-rose-200 text-xs font-bold transition-all shadow-2xs active:scale-95"
              title="Baca teks terus dari papan keratan (Clipboard)"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>Tampal Terus Dari Clipboard</span>
            </button>
          </div>
        </div>

        {/* Quick Sample chips */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          <span className="text-[11px] text-slate-400 mr-1">Atau cuba contoh:</span>
          {sampleMessages.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplySample(sample.text)}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#f7f2ec] hover:bg-[#ede3d8] text-slate-700 border border-[#e2d5c6] transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <textarea
            id="whatsapp-input"
            rows={4}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Salin dan tampal perbualan WhatsApp di sini... (cth: 'Salam kak, nak order kek coklat moist 7 inci sabtu ni pkl 3ptg. Tulis: Happy Birthday Rayyan. No tel 0193456789')"
            className="w-full text-xs sm:text-sm p-3.5 rounded-lg border border-[#d8c8b8] focus:outline-hidden focus:ring-2 focus:ring-[#881337] focus:border-[#881337] bg-[#faf7f2] font-mono leading-relaxed placeholder:text-slate-400"
          />
        </div>

        {clipboardNotice && (
          <div className="mt-2.5 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span className="font-medium">{clipboardNotice}</span>
          </div>
        )}

        {parseError && (
          <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{parseError}</span>
          </div>
        )}

        {parseNotice && (
          <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{parseNotice}</span>
          </div>
        )}

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#f2e9df]">
          <p className="text-[11px] text-slate-500">
            AI mengekstrak nama, masa, alamat, menu, serta menyerlahkan nota hiasan kek.
          </p>
          <button
            type="button"
            onClick={() => handleParseWithAI()}
            disabled={isParsing || !rawText.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#881337] hover:bg-[#72102e] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-xs transition-colors"
          >
            {isParsing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menganalisis Teks...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" />
                <span>Ekstrak Pesanan (AI)</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* SUCCESS NOTIFICATION */}
      {savedSuccessOrder && (
        <div className="bg-[#f0f7f4] border border-[#b8ddcb] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold text-emerald-950">
                Tempahan #{savedSuccessOrder.id} Disimpan
              </h2>
              <p className="text-xs text-emerald-800 mt-0.5">
                Pesanan untuk <strong>{savedSuccessOrder.customerName}</strong> telah ditambah ke Jadual Dapur.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenReceipt(savedSuccessOrder)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white text-slate-800 border border-[#c4d9ce] hover:bg-slate-50 transition-colors"
            >
              Lihat Resit & DuitNow
            </button>
            <button
              type="button"
              onClick={onNavigateToDashboard}
              className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>Jadual Dapur</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* REVIEW & EDIT FORM */}
      <form onSubmit={handleSaveOrder} className="bg-white rounded-xl border border-[#e4d8cb] shadow-2xs overflow-hidden">
        <div className="bg-[#f7f2ec] px-5 py-3.5 border-b border-[#e4d8cb] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-[#881337] text-white text-[11px] font-mono flex items-center justify-center font-bold">
              2
            </span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Semakan & Pengesahan Tempahan
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Boleh disunting terus</span>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Customer & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customer-name" className="text-xs font-bold text-slate-700 block mb-1">
                Nama Pelanggan <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  id="customer-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="cth: Puan Haliza / Siti"
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#d8c8b8] focus:outline-hidden focus:ring-2 focus:ring-[#881337]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="customer-phone" className="text-xs font-bold text-slate-700 block mb-1">
                No. Telefon WhatsApp
              </label>
              <div className="flex gap-2">
                <input
                  id="customer-phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="cth: 012-3456789"
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#d8c8b8] focus:outline-hidden focus:ring-2 focus:ring-[#881337] font-mono"
                />
                {customerPhone && (
                  <a
                    href={`https://wa.me/${customerPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-2 bg-[#f0f7f4] hover:bg-[#e2f1ea] text-emerald-800 rounded-lg border border-[#b8ddcb] text-xs font-semibold flex items-center gap-1 flex-shrink-0 transition-colors"
                    title="Buka WhatsApp Pelanggan"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Date & Time + Slot Capacity Alert */}
          <div className="bg-[#faf7f2] p-4 rounded-xl border border-[#ebdcd0] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="delivery-date" className="text-xs font-bold text-slate-700">
                    Tarikh Diperlukan <span className="text-rose-600">*</span>
                  </label>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setQuickDate(0)}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-[#d8c8b8] text-slate-700 hover:bg-slate-50"
                    >
                      Hari Ini
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDate(1)}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-[#d8c8b8] text-slate-700 hover:bg-slate-50"
                    >
                      Esok
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDate(2)}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-[#d8c8b8] text-slate-700 hover:bg-slate-50"
                    >
                      Lusa
                    </button>
                  </div>
                </div>
                <input
                  id="delivery-date"
                  type="date"
                  required
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#d8c8b8] focus:outline-hidden focus:ring-2 focus:ring-[#881337] bg-white font-mono"
                />
              </div>

              <div>
                <label htmlFor="delivery-time" className="text-xs font-bold text-slate-700 block mb-1">
                  Masa Siap / Ambil
                </label>
                <input
                  id="delivery-time"
                  type="text"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  placeholder="cth: 15:30 atau 3:30 petang"
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#d8c8b8] focus:outline-hidden focus:ring-2 focus:ring-[#881337] bg-white font-mono"
                />
              </div>
            </div>

            {/* SLOT CAPACITY WARNING (Slot Alert) */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#ebdcd0]">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="font-semibold">Kapasiti Dapur Tarikh Ini:</span>
                <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-[#d8c8b8]">
                  {slotUsage.count} / {slotUsage.maxSlots} slot digunakan
                </span>
              </div>
              {slotUsage.isFull ? (
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-600" />
                  Kapasiti Penuh ({slotUsage.count} tempahan)
                </span>
              ) : (
                <span className="text-[11px] text-emerald-800 font-medium">
                  Baki {slotUsage.remaining} slot kosong
                </span>
              )}
            </div>

            {slotUsage.isFull && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Peringatan Kapasiti Dapur:</strong> Anda telah mencapai had maksimum ({slotUsage.maxSlots} slot) untuk tarikh <strong>{formatDateMalay(deliveryDate)}</strong>. Anda masih boleh menyimpan tempahan ini jika bersedia menambah beban kerja.
                </p>
              </div>
            )}
          </div>

          {/* Mode (Pickup vs Delivery) */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1.5">Kaedah Serahan</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryType('Self-pickup')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-bold transition-all ${
                    deliveryType === 'Self-pickup'
                      ? 'border-[#881337] bg-rose-50/70 text-[#881337] ring-1 ring-[#881337]'
                      : 'border-[#d8c8b8] bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Ambil Sendiri (Self-pickup)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('Delivery')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-bold transition-all ${
                    deliveryType === 'Delivery'
                      ? 'border-[#881337] bg-rose-50/70 text-[#881337] ring-1 ring-[#881337]'
                      : 'border-[#d8c8b8] bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Penghantaran (Delivery)</span>
                </button>
              </div>
            </div>

            {deliveryType === 'Delivery' && (
              <div>
                <label htmlFor="delivery-address" className="text-xs font-bold text-slate-700 block mb-1">
                  Alamat Penghantaran Penuh
                </label>
                <textarea
                  id="delivery-address"
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="No rumah, jalan, taman perumahan, poskod & kawasan..."
                  className="w-full text-xs sm:text-sm p-3 rounded-lg border border-[#d8c8b8] focus:outline-hidden focus:ring-2 focus:ring-[#881337]"
                />
              </div>
            )}
          </div>

          {/* CRITICAL BAKER'S TICKET: WORDING ON CAKE (FR-002) + SPELL-CHECK CONFIRMATION BUTTON */}
          <div className="bg-[#fffbeb] border-2 border-[#d97706] rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label htmlFor="wording-on-cake" className="text-xs font-extrabold uppercase tracking-wider text-[#92400e] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#d97706]" />
                TULISAN ATAS KEK & NOTA HIASAN KHAS (WORDING ON CAKE)
              </label>

              {/* SAHKAN EJAAN NAMA PELANGGAN BUTTON */}
              {wordingOnCake.trim() && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopySpellCheck}
                    className="text-[11px] font-semibold px-2 py-1 rounded-md bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 transition-colors shadow-2xs"
                  >
                    {spellCheckCopied ? 'Teks Disalin!' : 'Salin Mesej Sah Ejaan'}
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenSpellCheckWhatsApp}
                    className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-2xs"
                    title="Hantar draf semakan ejaan ke WhatsApp pelanggan"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Sahkan Ejaan di WA</span>
                  </button>
                </div>
              )}
            </div>

            <p className="text-[11px] text-[#78350f] leading-relaxed">
              Teks ini akan dipaparkan secara menonjol pada senarai semak dapur dan resit rasmi pelanggan untuk mengelakkan ralat ejaan.
            </p>

            <input
              id="wording-on-cake"
              type="text"
              value={wordingOnCake}
              onChange={(e) => setWordingOnCake(e.target.value)}
              placeholder='Contoh: "Happy 5th Birthday Rayyan Mikhail" / "Selamat Hari Lahir Ibu"'
              className="w-full text-sm sm:text-base font-serif font-bold text-slate-900 px-3.5 py-2.5 rounded-lg border border-[#f59e0b] focus:outline-hidden focus:ring-2 focus:ring-[#b45309] bg-white placeholder:font-sans placeholder:font-normal placeholder:text-slate-400"
            />
          </div>

          {/* ITEMS & PRICE MATCHING (FR-003) */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Senarai Item & Caj Custom
                </h3>
                <p className="text-[11px] text-slate-500">
                  Pilih item dari katalog kedai atau tambah caj khas secara fleksibel
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  aria-label="Pilih item dari katalog"
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddItemFromCatalog(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  defaultValue=""
                  className="text-xs bg-white text-slate-800 border border-[#d8c8b8] font-semibold px-2.5 py-1.5 rounded-lg focus:outline-hidden cursor-pointer"
                >
                  <option value="" disabled>+ Tambah Dari Katalog</option>
                  {menuCatalog.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (RM{m.basePrice})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleAddCustomItem}
                  className="inline-flex items-center gap-1 text-xs bg-[#f5efe8] hover:bg-[#ede3d8] text-slate-800 font-semibold px-2.5 py-1.5 rounded-lg transition-colors border border-[#e2d5c6]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Item Custom</span>
                </button>
              </div>
            </div>

            {/* Items Table / Row List */}
            <div className="border border-[#ebdcd0] rounded-xl overflow-hidden bg-[#faf7f2]">
              <div className="divide-y divide-[#ebdcd0]">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white"
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateItem(item.id, { name: e.target.value })}
                        placeholder="Nama Kek / Item"
                        className="w-full text-xs sm:text-sm font-semibold text-slate-900 border-0 focus:ring-0 p-0 bg-transparent"
                      />
                    </div>

                    <div className="flex items-center gap-3 justify-between sm:justify-end">
                      <div className="flex items-center gap-1.5 bg-[#f5efe8] px-2 py-1 rounded-md text-xs font-mono">
                        <span className="text-slate-500 text-[11px]">Qty:</span>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => handleUpdateItem(item.id, { qty: Math.max(1, parseInt(e.target.value) || 1) })}
                          className="w-10 text-center font-bold border-0 bg-transparent p-0"
                        />
                      </div>

                      <div className="flex items-center gap-1 bg-[#f5efe8] px-2 py-1 rounded-md text-xs font-mono">
                        <span className="text-slate-500 text-[11px]">RM:</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={item.price}
                          onChange={(e) => handleUpdateItem(item.id, { price: parseFloat(e.target.value) || 0 })}
                          className="w-16 text-right font-bold border-0 bg-transparent p-0"
                        />
                      </div>

                      <div className="text-xs sm:text-sm font-bold font-mono text-slate-900 w-20 text-right">
                        {formatCurrency(item.price * item.qty)}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                        title="Padam Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TOTAL & DEPOSIT LEDGER */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#ebdcd0]">
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1">Jumlah Keseluruhan</span>
              <div className="p-2.5 rounded-lg bg-[#faf7f2] border border-[#ebdcd0] font-mono font-bold text-base text-slate-900">
                {formatCurrency(subtotal)}
              </div>
            </div>

            <div>
              <label htmlFor="deposit-paid" className="text-xs font-bold text-slate-700 block mb-1">
                Deposit Diterima (RM)
              </label>
              <input
                id="deposit-paid"
                type="number"
                step="1"
                min="0"
                value={depositPaid}
                onChange={(e) => setDepositPaid(parseFloat(e.target.value) || 0)}
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#d8c8b8] focus:outline-hidden focus:ring-2 focus:ring-[#881337] font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-1 font-mono">
                Baki Perlu: <span className="font-bold text-slate-800">{formatCurrency(balanceDue)}</span>
              </p>
            </div>

            <div>
              <label htmlFor="payment-status" className="text-xs font-bold text-slate-700 block mb-1">
                Status Pembayaran
              </label>
              <select
                id="payment-status"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#d8c8b8] focus:outline-hidden focus:ring-2 focus:ring-[#881337] bg-white font-medium cursor-pointer"
              >
                <option value="Belum Bayar">Belum Bayar</option>
                <option value="Deposit Dibayar">Deposit Dibayar</option>
                <option value="Selesai Bayar">Selesai Bayar</option>
              </select>
            </div>
          </div>

          {/* Kitchen Notes */}
          <div>
            <label htmlFor="kitchen-notes" className="text-xs font-bold text-slate-700 block mb-1">
              Nota Dapur Tambahan (Pilihan)
            </label>
            <input
              id="kitchen-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="cth: Simpan dalam chiller suhu rendah, lilin percuma x2"
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#d8c8b8] focus:outline-hidden focus:ring-2 focus:ring-[#881337]"
            />
          </div>
        </div>

        {/* Form Footer Action */}
        <div className="bg-[#f7f2ec] px-5 py-4 border-t border-[#e4d8cb] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500">
            Data disimpan terus ke simpanan tempatan peranti (Local Storage).
          </span>
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#881337] hover:bg-[#72102e] text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-xs transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-rose-200" />
            <span>Simpan Tempahan Ke Jadual</span>
          </button>
        </div>
      </form>
    </div>
  );
};
