import React, { useState, useEffect } from 'react';
import { Order, ShopProfile } from '../types';
import { formatCurrency, formatDateMalay } from '../utils/storage';
import { generateQrDataUrl, buildDuitNowPayload } from '../utils/qrHelper';
import { Printer, X, Copy, Check, MessageSquare, AlertCircle, QrCode } from 'lucide-react';

interface ReceiptModalProps {
  order: Order | null;
  profile: ShopProfile;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, profile, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [generatedQr, setGeneratedQr] = useState<string>('');

  useEffect(() => {
    if (!order) return;
    if (profile.qrImageUrl) {
      setGeneratedQr(profile.qrImageUrl);
    } else if (profile.bankAccount) {
      const payload = buildDuitNowPayload(
        profile.bankName,
        profile.bankAccount,
        profile.accountHolder,
        order.id,
        order.totalPrice - (order.depositPaid || 0)
      );
      generateQrDataUrl(payload).then(setGeneratedQr);
    }
  }, [order, profile]);

  if (!order) return null;

  const balanceDue = Math.max(0, order.totalPrice - (order.depositPaid || 0));

  const handlePrint = () => {
    window.print();
  };

  const generateWhatsAppMessage = () => {
    const itemsList = order.items
      .map((item, idx) => `  ${idx + 1}. ${item.qty}x ${item.name} - ${formatCurrency(item.price * item.qty)}`)
      .join('\n');

    const wordingText = order.wordingOnCake
      ? `\n⚠️ *TULISAN ATAS KEK / NOTA KHAS:*\n👉 "${order.wordingOnCake}"\n(Sila pastikan ejaan betul ya!)\n`
      : '';

    return `🧾 *PENGESAHAN TEMPAHAN - ${profile.shopName.toUpperCase()}*
No. Tempahan: *${order.id}*
Tarikh Pesanan: ${new Date(order.createdAt).toLocaleDateString('ms-MY')}

Pelanggan: *${order.customerName}*
Tarikh Sedia: *${formatDateMalay(order.deliveryDate)}* (${order.deliveryTime})
Mod: *${order.deliveryType}* ${order.address ? `\nAlamat: ${order.address}` : ''}
${wordingText}
📋 *SENARAI PESANAN:*
${itemsList}

💰 *RINGKASAN PEMBAYARAN:*
• Jumlah: *${formatCurrency(order.totalPrice)}*
• Deposit Dibayar: *${formatCurrency(order.depositPaid || 0)}*
• Baki Perlu Dibayar: *${formatCurrency(balanceDue)}*
• Status: *${order.paymentStatus}*

🏦 *MAKLUMAT PEMBAYARAN / DUITNOW:*
Bank: ${profile.bankName}
No. Akaun: *${profile.bankAccount}*
Penama: *${profile.accountHolder}*

Sila hantar resit pemindahan setelah bayaran dibuat. Terima kasih atas tempahan anda! ❤️`;
  };

  const handleCopyText = () => {
    const text = generateWhatsAppMessage();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(generateWhatsAppMessage());
    let cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '6' + cleanPhone;
    } else if (!cleanPhone.startsWith('60') && cleanPhone.length > 8) {
      cleanPhone = '60' + cleanPhone;
    }
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-[#e4d8cb] animate-in fade-in zoom-in-95 duration-100">
        {/* Modal Toolbar (hidden during print) */}
        <div className="no-print bg-[#1e293b] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-amber-300" />
            <div>
              <h3 className="font-bold text-xs sm:text-sm tracking-wide">Resit Tempahan & DuitNow QR</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#881337] hover:bg-[#72102e] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* WhatsApp Actions (hidden during print) */}
        <div className="no-print bg-[#f7f2ec] border-b border-[#e4d8cb] px-5 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] text-slate-600">
            Hantar pengesahan ke WhatsApp pelanggan bersama butiran akaun
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-white text-slate-700 border border-[#d8c8b8] hover:bg-slate-50 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3 text-slate-400" />}
              <span>{copied ? 'Disalin' : 'Salin Mesej'}</span>
            </button>
            <button
              onClick={handleOpenWhatsApp}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Buka WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-6 sm:p-8 overflow-y-auto print-receipt-container bg-white text-slate-900 font-sans">
          {/* Header */}
          <div className="text-center border-b border-[#e4d8cb] pb-4 mb-4">
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-0.5">
              {profile.shopName}
            </h1>
            {profile.tagline && (
              <p className="text-xs italic text-slate-500 mb-1">{profile.tagline}</p>
            )}
            <p className="text-[11px] text-slate-600">
              Tel: <span className="font-mono font-semibold">{profile.phone}</span>
              {profile.address && ` • ${profile.address}`}
            </p>
          </div>

          {/* Docket Metadata */}
          <div className="grid grid-cols-2 gap-3 text-xs mb-4 bg-[#faf7f2] p-3 rounded-lg border border-[#ebdcd0]">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">No. Tempahan</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{order.id}</span>
              <span className="text-[10px] text-slate-500 block mt-2">Pelanggan:</span>
              <span className="font-bold text-slate-900 block">{order.customerName}</span>
              <span className="font-mono text-slate-600 text-[11px]">{order.customerPhone || 'Tiada No Tel'}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Tarikh & Masa</span>
              <span className="font-bold text-slate-900">{formatDateMalay(order.deliveryDate)}</span>
              <span className="text-[#881337] font-mono font-bold block">{order.deliveryTime || 'Masa belum set'}</span>
              <div className="mt-1.5 inline-block">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-[#d8c8b8] text-slate-800">
                  {order.deliveryType === 'Delivery' ? 'Penghantaran (Delivery)' : 'Ambil Sendiri (Pickup)'}
                </span>
              </div>
              {order.address && (
                <p className="text-slate-600 text-[10px] mt-1 text-right max-w-xs ml-auto line-clamp-2">
                  {order.address}
                </p>
              )}
            </div>
          </div>

          {/* CRITICAL BAKER'S TICKET: WORDING ON CAKE (FR-002) */}
          {order.wordingOnCake ? (
            <div className="mb-4 p-3.5 rounded-lg bg-[#fffbeb] border border-[#f59e0b] text-[#92400e]">
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#b45309] mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                TULISAN ATAS KEK / NOTA KHAS (WORDING ON CAKE)
              </div>
              <div className="text-base sm:text-lg font-serif font-bold text-slate-900 text-center py-1">
                "{order.wordingOnCake}"
              </div>
              <p className="text-[10px] text-center text-[#78350f] mt-0.5">
                *Sila pastikan ejaan nama dan ucapan tepat sebelum tarikh penyediaan.
              </p>
            </div>
          ) : null}

          {/* Items Table */}
          <div className="mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Butiran Pesanan
            </span>
            <table className="w-full text-left text-xs border border-[#ebdcd0] rounded-lg overflow-hidden">
              <thead className="bg-[#f7f2ec] text-slate-700 text-[10px] uppercase font-bold border-b border-[#ebdcd0]">
                <tr>
                  <th className="py-2 px-3">Item</th>
                  <th className="py-2 px-2 text-center w-12">Qty</th>
                  <th className="py-2 px-3 text-right w-20">Harga</th>
                  <th className="py-2 px-3 text-right w-24">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebdcd0]">
                {order.items.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="py-2 px-3">
                      <span className="font-medium text-slate-900">{item.name}</span>
                      {item.isCustom && (
                        <span className="ml-1 text-[9px] bg-[#faf7f2] border border-[#d8c8b8] text-slate-600 px-1 rounded">
                          Custom
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-center font-mono font-medium">{item.qty}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-600">{formatCurrency(item.price)}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(item.price * item.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* DuitNow & Totals Ledger */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            {/* DuitNow QR Box */}
            <div className="sm:w-1/2 p-3 bg-[#faf7f2] rounded-lg border border-[#ebdcd0]">
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Pembayaran DuitNow
              </span>
              <div className="flex gap-3 items-center">
                {generatedQr ? (
                  <div className="bg-white p-1 rounded border border-[#d8c8b8] flex-shrink-0">
                    <img
                      src={generatedQr}
                      alt="DuitNow QR Code"
                      className="w-20 h-20 sm:w-22 sm:h-22 object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-white rounded border border-dashed border-[#d8c8b8] flex items-center justify-center text-slate-400 text-[9px] text-center p-1">
                    Tiada QR
                  </div>
                )}
                <div className="text-[11px] space-y-0.5">
                  <p className="text-slate-500 text-[10px]">Bank: <strong className="text-slate-800">{profile.bankName}</strong></p>
                  <p className="font-mono font-bold text-[#881337] text-xs select-all">
                    {profile.bankAccount || '-'}
                  </p>
                  <p className="text-slate-600 text-[10px]">{profile.accountHolder}</p>
                </div>
              </div>
            </div>

            {/* Calculations Box */}
            <div className="sm:w-5/12 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Jumlah Kasar:</span>
                <span className="font-bold text-slate-900">{formatCurrency(order.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Deposit Diterima:</span>
                <span className="font-bold text-emerald-800">-{formatCurrency(order.depositPaid || 0)}</span>
              </div>
              <div className="border-t border-[#ebdcd0] pt-1.5 flex justify-between font-bold text-sm text-slate-900">
                <span>Baki Perlu:</span>
                <span className="text-[#881337]">{formatCurrency(balanceDue)}</span>
              </div>
              <div className="pt-1 text-right font-sans">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#faf7f2] border border-[#d8c8b8] text-slate-800">
                  Status: {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-[10px] text-slate-500 border-t border-[#e4d8cb] pt-3">
            <p className="font-medium text-slate-700">Terima kasih kerana menyokong perniagaan bakeri kami.</p>
            <p>Sila kemukakan resit pemindahan setelah pembayaran dibuat.</p>
          </div>
        </div>

        {/* Modal Bottom Close */}
        <div className="no-print bg-[#f7f2ec] border-t border-[#e4d8cb] px-5 py-2.5 flex justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#d8c8b8] hover:bg-slate-50 text-slate-800 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
