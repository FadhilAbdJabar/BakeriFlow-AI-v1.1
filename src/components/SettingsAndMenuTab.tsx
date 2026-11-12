import React, { useState, useRef } from 'react';
import { MenuItem, ShopProfile, Order } from '../types';
import { formatCurrency } from '../utils/storage';
import {
  Store,
  QrCode,
  UtensilsCrossed,
  Plus,
  Edit2,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Save,
  Image as ImageIcon,
  Flame,
  Cloud,
  Laptop,
  Smartphone,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface SettingsAndMenuTabProps {
  profile: ShopProfile;
  menuCatalog: MenuItem[];
  orders: Order[];
  onSaveProfile: (updated: ShopProfile) => void;
  onSaveMenu: (updated: MenuItem[]) => void;
  onRestoreAllData: (data: { profile: ShopProfile; menu: MenuItem[]; orders: Order[] }) => void;
  onResetToDefault: () => void;
}

export const SettingsAndMenuTab: React.FC<SettingsAndMenuTabProps> = ({
  profile,
  menuCatalog,
  orders,
  onSaveProfile,
  onSaveMenu,
  onRestoreAllData,
  onResetToDefault,
}) => {
  const [shopName, setShopName] = useState(profile.shopName);
  const [phone, setPhone] = useState(profile.phone);
  const [bankName, setBankName] = useState(profile.bankName);
  const [bankAccount, setBankAccount] = useState(profile.bankAccount);
  const [accountHolder, setAccountHolder] = useState(profile.accountHolder);
  const [tagline, setTagline] = useState(profile.tagline);
  const [address, setAddress] = useState(profile.address || '');
  const [pickupInstructions, setPickupInstructions] = useState(profile.pickupInstructions || '');
  const [qrImageUrl, setQrImageUrl] = useState(profile.qrImageUrl || '');
  const [maxDailySlots, setMaxDailySlots] = useState(profile.maxDailySlots || 5);
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // Cloud Sync state
  const [cloudProvider, setCloudProvider] = useState<'local_only' | 'firebase' | 'supabase'>(
    profile.cloudSync?.provider || 'local_only'
  );
  const [cloudEnabled, setCloudEnabled] = useState(profile.cloudSync?.enabled || false);

  // Menu Modal
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [menuName, setMenuName] = useState('');
  const [menuPrice, setMenuPrice] = useState<number>(50);
  const [menuCategory, setMenuCategory] = useState('Kek Hari Jadi');
  const [menuDescription, setMenuDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const importFileRef = useRef<HTMLInputElement>(null);

  const handleSaveProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ShopProfile = {
      shopName: shopName.trim(),
      phone: phone.trim(),
      bankName: bankName.trim(),
      bankAccount: bankAccount.trim(),
      accountHolder: accountHolder.trim(),
      qrImageUrl,
      tagline: tagline.trim(),
      address: address.trim(),
      pickupInstructions: pickupInstructions.trim(),
      maxDailySlots: Number(maxDailySlots) || 5,
      lastBackupDate: new Date().toISOString(),
      cloudSync: {
        provider: cloudProvider,
        enabled: cloudEnabled,
        syncStatus: cloudEnabled ? 'synced' : 'local_only',
        deviceId: profile.cloudSync?.deviceId || `DEVICE-${Math.floor(1000 + Math.random() * 9000)}`,
        lastSyncedAt: new Date().toISOString(),
      },
    };
    onSaveProfile(updated);
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 2500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Sila muat naik fail imej sahaja (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setQrImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddMenu = () => {
    setEditingMenuItem(null);
    setMenuName('');
    setMenuPrice(50);
    setMenuCategory('Kek Hari Jadi');
    setMenuDescription('');
    setIsMenuModalOpen(true);
  };

  const handleOpenEditMenu = (item: MenuItem) => {
    setEditingMenuItem(item);
    setMenuName(item.name);
    setMenuPrice(item.basePrice);
    setMenuCategory(item.category);
    setMenuDescription(item.description || '');
    setIsMenuModalOpen(true);
  };

  const handleSaveMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuName.trim()) {
      alert('Sila masukkan nama menu.');
      return;
    }

    if (editingMenuItem) {
      const updated = menuCatalog.map((m) =>
        m.id === editingMenuItem.id
          ? { ...m, name: menuName.trim(), basePrice: menuPrice, category: menuCategory, description: menuDescription.trim() }
          : m
      );
      onSaveMenu(updated);
    } else {
      const newItem: MenuItem = {
        id: `menu-${Date.now()}`,
        name: menuName.trim(),
        basePrice: menuPrice,
        category: menuCategory,
        description: menuDescription.trim(),
      };
      onSaveMenu([...menuCatalog, newItem]);
    }
    setIsMenuModalOpen(false);
  };

  const handleDeleteMenuItem = (id: string) => {
    if (confirm('Adakah anda pasti mahu memadamkan item menu ini?')) {
      onSaveMenu(menuCatalog.filter((m) => m.id !== id));
    }
  };

  const categories = Array.from(new Set(menuCatalog.map((m) => m.category)));
  const filteredMenu = selectedCategory === 'all'
    ? menuCatalog
    : menuCatalog.filter((m) => m.category === selectedCategory);

  const handleExportJson = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile: {
        shopName,
        phone,
        bankName,
        bankAccount,
        accountHolder,
        qrImageUrl,
        tagline,
        address,
        pickupInstructions,
        maxDailySlots,
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
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (parsed.profile && Array.isArray(parsed.menu) && Array.isArray(parsed.orders)) {
          onRestoreAllData({
            profile: {
              ...parsed.profile,
              maxDailySlots: Number(parsed.profile.maxDailySlots) || 5,
            },
            menu: parsed.menu,
            orders: parsed.orders,
          });
          setShopName(parsed.profile.shopName || '');
          setPhone(parsed.profile.phone || '');
          setBankName(parsed.profile.bankName || '');
          setBankAccount(parsed.profile.bankAccount || '');
          setAccountHolder(parsed.profile.accountHolder || '');
          setQrImageUrl(parsed.profile.qrImageUrl || '');
          setTagline(parsed.profile.tagline || '');
          setAddress(parsed.profile.address || '');
          setPickupInstructions(parsed.profile.pickupInstructions || '');
          setMaxDailySlots(Number(parsed.profile.maxDailySlots) || 5);
          alert('Data berjaya dipulihkan daripada fail sandaran JSON.');
        } else {
          alert('Format fail JSON tidak sah untuk BakeriFlow AI.');
        }
      } catch (err) {
        alert('Ralat membaca fail JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#e9dfd6] pb-4">
        <h1 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
          Tetapan Profil, Menu & Data
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Konfigurasi butiran perniagaan bakeri, had kapasiti harian, senarai harga katalog tetap dan sandaran fail tempatan.
        </p>
      </div>

      {/* SECTION 1: PROFIL KEDAI & DUITNOW & KAPASITI HARIAN */}
      <form onSubmit={handleSaveProfileSubmit} className="bg-white rounded-xl border border-[#e4d8cb] shadow-2xs overflow-hidden">
        <div className="bg-[#f7f2ec] px-5 py-3.5 border-b border-[#e4d8cb] flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Profil Bakeri, DuitNow & Kapasiti Harian
            </h2>
            <p className="text-[11px] text-slate-500">Maklumat dipaparkan pada resit rasmi dan semakan slot harian</p>
          </div>
          {profileSavedMsg && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-[#f0f7f4] px-2.5 py-1 rounded-md border border-[#b8ddcb]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Disimpan
            </span>
          )}
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="shop-name-input" className="text-xs font-bold text-slate-700 block mb-1">Nama Bakeri / Jenama *</label>
              <input
                id="shop-name-input"
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="cth: Dapur Manis Che Siti"
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#d8c8b8] focus:outline-hidden focus:ring-2 focus:ring-[#881337]"
              />
            </div>

            <div>
              <label htmlFor="shop-phone-input" className="text-xs font-bold text-slate-700 block mb-1">No. Telefon WhatsApp *</label>
              <input
                id="shop-phone-input"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="cth: 013-8892110"
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#d8c8b8] focus:outline-hidden focus:ring-2 focus:ring-[#881337] font-mono"
              />
            </div>

            <div>
              <label htmlFor="bank-name-input" className="text-xs font-bold text-slate-700 block mb-1">Nama Bank</label>
              <input
                id="bank-name-input"
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="cth: Maybank / CIMB / Bank Islam"
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#d8c8b8] focus:outline-hidden focus:ring-2 focus:ring-[#881337]"
              />
            </div>

            <div>
              <label htmlFor="bank-account-input" className="text-xs font-bold text-slate-700 block mb-1">No. Akaun Bank</label>
              <input
                id="bank-account-input"
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="cth: 164285923810"
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#d8c8b8] focus:outline-hidden focus:ring-2 focus:ring-[#881337] font-mono"
              />
            </div>

            <div>
              <label htmlFor="account-holder-input" className="text-xs font-bold text-slate-700 block mb-1">Nama Pemegang Akaun</label>
              <input
                id="account-holder-input"
                type="text"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder="Nama seperti dalam pendaftaran bank"
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#d8c8b8] focus:outline-hidden focus:ring-2 focus:ring-[#881337]"
              />
            </div>

            {/* KAPASITI HARIAN SETTING (SLOT CAPACITY) */}
            <div>
              <label htmlFor="daily-slots-input" className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>Kapasiti Harian (Slot Maksimum Sehari)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="daily-slots-input"
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={maxDailySlots}
                  onChange={(e) => setMaxDailySlots(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 text-xs sm:text-sm px-3 py-2 rounded-lg border border-[#d8c8b8] focus:outline-hidden focus:ring-2 focus:ring-[#881337] font-mono font-bold"
                />
                <span className="text-xs text-slate-500">kek/tempahan sehari</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Sistem akan memaparkan Slot Alert apabila tempahan pada tarikh tertentu mencapai had ini.
              </p>
            </div>
          </div>

          {/* DuitNow QR Upload */}
          <div className="bg-[#faf7f2] p-4 rounded-xl border border-[#ebdcd0]">
            <span className="text-xs font-bold text-slate-800 block mb-1">
              Gambar Kod DuitNow QR
            </span>
            <p className="text-[11px] text-slate-600 mb-3">
              Muat naik tangkap layar kod DuitNow QR anda untuk dipaparkan secara rasmi pada resit PDF pelanggan.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {qrImageUrl ? (
                <div className="relative bg-white p-2 rounded-lg border border-[#d8c8b8]">
                  <img src={qrImageUrl} alt="DuitNow QR" className="w-24 h-24 object-contain" />
                  <button
                    type="button"
                    onClick={() => setQrImageUrl('')}
                    className="absolute -top-2 -right-2 bg-rose-700 text-white rounded-full p-1 shadow-xs hover:bg-rose-800 transition-colors"
                    title="Padam QR"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-lg border border-dashed border-[#d8c8b8] bg-white flex flex-col items-center justify-center text-slate-400 text-[10px] p-2 text-center">
                  <ImageIcon className="w-5 h-5 mb-1 text-slate-300" />
                  <span>Tiada QR</span>
                </div>
              )}

              <div className="space-y-1.5 text-center sm:text-left">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white text-slate-800 border border-[#d8c8b8] hover:bg-[#faf7f2] transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-[#881337]" />
                  <span>{qrImageUrl ? 'Tukar Gambar QR' : 'Muat Naik Gambar DuitNow QR'}</span>
                </button>
                <p className="text-[10px] text-slate-400">
                  Fail disimpan secara setempat pada pelayar anda (Local Storage).
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#f7f2ec] px-5 py-3 border-t border-[#e4d8cb] flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 bg-[#881337] hover:bg-[#72102e] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-2xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Profil & Kapasiti</span>
          </button>
        </div>
      </form>

      {/* SECTION 2: STRUKTUR BERSEDIA CLOUD SYNC (FIREBASE / SUPABASE READY) */}
      <div className="bg-white rounded-xl border border-[#e4d8cb] shadow-2xs overflow-hidden">
        <div className="bg-[#f7f2ec] px-5 py-3.5 border-b border-[#e4d8cb] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-[#881337]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Penyegerakan Awan & Akses Pelbagai Peranti (Cloud Sync Ready)
            </h2>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            Struktur Bersedia (Phase 2 Ready)
          </span>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Struktur data BakeriFlow AI telah disediakan dalam format skema modular yang bersedia disambungkan terus ke pangkalan data awan seperti <strong>Firebase Firestore</strong> atau <strong>Supabase</strong>. Ini membolehkan peniaga dan pembantu dapur/suami melihat dan mengemas kini senarai semak secara serentak di telefon dan komputer riba tanpa mengganggu mod luar talian (*local-first offline*).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="bg-[#faf7f2] p-3 rounded-lg border border-[#ebdcd0] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Smartphone className="w-4 h-4 text-[#881337]" />
                <span>Telefon Utama (Dapur)</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                Status: Aktif (Local Storage)
              </p>
              <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 pt-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Data Sentiasa Tersimpan</span>
              </div>
            </div>

            <div className="bg-[#faf7f2] p-3 rounded-lg border border-[#ebdcd0] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Laptop className="w-4 h-4 text-blue-700" />
                <span>Laptop Pembantu / Kaunter</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                Sedia untuk Real-time Sync
              </p>
              <div className="text-[10px] text-slate-400 font-medium pt-1">
                Melalui JSON Backup atau Cloud
              </div>
            </div>

            <div className="bg-[#faf7f2] p-3 rounded-lg border border-[#ebdcd0] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>ID Peranti Semasa</span>
              </div>
              <p className="text-[11px] text-slate-700 font-mono font-bold">
                {profile.cloudSync?.deviceId || 'BF-NODE-01'}
              </p>
              <div className="text-[10px] text-slate-500 pt-1">
                Format Skema JSON v1.0
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: KATALOG MENU TETAP (FR-003) */}
      <div className="bg-white rounded-xl border border-[#e4d8cb] shadow-2xs overflow-hidden">
        <div className="bg-[#f7f2ec] px-5 py-3.5 border-b border-[#e4d8cb] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Katalog Menu Tetap & Senarai Harga
            </h2>
            <p className="text-[11px] text-slate-500">Harga standard yang digunakan oleh AI untuk memadankan pesanan</p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddMenu}
            className="inline-flex items-center gap-1.5 bg-[#881337] hover:bg-[#72102e] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Item Menu</span>
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-[#faf7f2] text-slate-700 hover:bg-[#ede3d8]'
              }`}
            >
              Semua ({menuCatalog.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-[#faf7f2] text-slate-700 hover:bg-[#ede3d8]'
                }`}
              >
                {cat} ({menuCatalog.filter((m) => m.category === cat).length})
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                className="bg-[#faf7f2] p-3.5 rounded-lg border border-[#ebdcd0] flex items-start justify-between gap-3 hover:border-[#d8c8b8] transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <div className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                    {item.name}
                  </div>
                  <span className="inline-block text-[10px] font-mono bg-white text-slate-600 px-1.5 py-0.5 rounded border border-[#ebdcd0]">
                    {item.category}
                  </span>
                  {item.description && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  <div className="text-xs font-bold font-mono text-[#881337] pt-0.5">
                    {formatCurrency(item.basePrice)}
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEditMenu(item)}
                    className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-white transition-colors"
                    title="Edit Item"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteMenuItem(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-white transition-colors"
                    title="Padam Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: SANDARAN DATA (FR-006) */}
      <div className="bg-white rounded-xl border border-[#e4d8cb] p-4 sm:p-5 shadow-2xs space-y-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Sandaran & Pemulihan Data Tempatan
          </h2>
          <p className="text-[11px] text-slate-500">
            Muat turun salinan data ke komputer atau pulihkan dari fail sandaran JSON
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleExportJson}
            className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-[#d8c8b8] bg-[#faf7f2] hover:bg-[#ede3d8] text-slate-800 font-bold text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>Export JSON (Sandaran)</span>
          </button>

          <div>
            <input
              type="file"
              ref={importFileRef}
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => importFileRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg border border-[#d8c8b8] bg-[#faf7f2] hover:bg-[#ede3d8] text-slate-800 font-bold text-xs transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-blue-700" />
              <span>Import JSON (Pulihkan)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (confirm('Adakah anda mahu memuat semula data contoh lalai? Data semasa akan digantikan dengan set contoh asal.')) {
                onResetToDefault();
              }
            }}
            className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-[#881337] font-bold text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Set Semula Contoh</span>
          </button>
        </div>
      </div>

      {/* Menu Modal (Add / Edit) */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 space-y-4 border border-[#e4d8cb] animate-in fade-in zoom-in-95 duration-100">
            <h3 className="font-bold text-sm text-slate-900 border-b border-[#ebdcd0] pb-2">
              {editingMenuItem ? 'Kemaskini Item Menu' : 'Tambah Item Menu Baru'}
            </h3>

            <form onSubmit={handleSaveMenuItem} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Item *</label>
                <input
                  type="text"
                  required
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  placeholder="cth: Kek Pandan Gula Melaka 8 inci"
                  className="w-full px-3 py-2 rounded-lg border border-[#d8c8b8] focus:outline-hidden focus:ring-1 focus:ring-[#881337]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Harga Asas (RM) *</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    required
                    value={menuPrice}
                    onChange={(e) => setMenuPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-[#d8c8b8] focus:outline-hidden focus:ring-1 focus:ring-[#881337] font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori</label>
                  <input
                    type="text"
                    value={menuCategory}
                    onChange={(e) => setMenuCategory(e.target.value)}
                    placeholder="Kek / Cupcakes"
                    className="w-full px-3 py-2 rounded-lg border border-[#d8c8b8] focus:outline-hidden focus:ring-1 focus:ring-[#881337]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Keterangan Ringkas</label>
                <textarea
                  rows={2}
                  value={menuDescription}
                  onChange={(e) => setMenuDescription(e.target.value)}
                  placeholder="Perisa, saiz, atau hiasan..."
                  className="w-full p-2.5 rounded-lg border border-[#d8c8b8] focus:outline-hidden focus:ring-1 focus:ring-[#881337]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#ebdcd0]">
                <button
                  type="button"
                  onClick={() => setIsMenuModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-[#faf7f2] font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#881337] hover:bg-[#72102e] text-white font-bold shadow-2xs"
                >
                  Simpan Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
