# Dokumen Keperluan Produk (PRD) — BakeriFlow AI

* **Versi Dokumen:** v1.0 (Confirmed)
* **Status:** Disahkan (MVP Ready)
* **Dokumen Rujukan Asal:** `BakeriFlow_AI_-_Product_Requirements_Document_1eeb7142.pdf` (tersimpan di dalam direktori projek `public/assets/aistudio/`)

---

## 1. Ringkasan Eksekutif & Objektif

BakeriFlow AI dibangunkan khusus untuk peniaga makanan dan bakeri dari rumah (*home bakers / home cooks*) bagi menyelesaikan cabaran pengurusan pesanan harian yang diterima menerusi WhatsApp.

### Objektif & Metrik Kejayaan
1. **Pemasukan Tempahan Pantas:** Memendekkan masa pemprosesan pesanan WhatsApp daripada ~5 minit kepada kurang daripada 30 saat.
2. **Kadar Ralat Tulisan Kek 0%:** Menyerlahkan teks ucapan dan nama pada kek secara visual bagi mengelakkan kesilapan pengeluaran di dapur.
3. **Kesediaan Penggunaan Terus (*Zero Friction Onboarding*):** Peniaga boleh terus menggunakan sistem tanpa halangan pendaftaran akaun atau pengesahan kata laluan yang merumitkan.

---

## 2. Skop Pembangunan (Scope Definition)

| Dalam Skop MVP (Fasa 1) | Fasa Seterusnya (Fasa 2) | Di Luar Skop |
| :--- | :--- | :--- |
| • Ekstraksi AI teks WhatsApp berterabur.<br>• Penyerlahan khas Nota / Wording Kek.<br>• Katalog menu tetap & caj *custom*.<br>• Jadual Dapur & *Kitchen Checklist*.<br>• Penjanaan Resit PDF & DuitNow QR.<br>• Simpanan peranti setempat (*Local Storage*).<br>• Sandaran data fail (*Export / Import JSON*). | • Penyegerakan Awan (*Cloud Sync* Firebase/Supabase).<br>• Notifikasi ingatan tarikh serahan.<br>• Imbasan AI resit bayaran pelanggan. | • Integrasi Gateway Pembayaran (FPX/Stripe).<br>• Sistem inventori stok bahan mentah tepung/gula.<br>• Integrasi terus API korporat WhatsApp rasmi. |

---

## 3. Keperluan Fungsian (Functional Requirements)

### FR-001: AI WhatsApp Order Parser
* **Keutamaan:** MUST HAVE
* **Tujuan:** Membaca teks perbualan WhatsApp dan mengekstrak maklumat terstruktur.
* **Tingkah Laku:** Menerima teks mentah dan mengembalikan objek JSON yang mengandungi: Nama Pelanggan, Telefon, Tarikh, Masa, Alamat/Mod Pickup, Senarai Item, dan Teks Ucapan Kek.
* **Kriteria Penerimaan:** Teks berterabur berjaya dipisahkan ke dalam medan borang yang betul dalam masa bawah 3 saat. Sekiranya maklumat tidak wujud (contohnya pelanggan tidak menyatakan alamat), medan dibiarkan kosong tanpa menimbulkan ralat sistem.

### FR-002: Wording Kek & Nota Khas Highlight
* **Keutamaan:** MUST HAVE (High-Risk Failure Point Prevention)
* **Tujuan:** Memastikan tulisan ucapan atas kek atau permintaan diet khas pelanggan tidak terlepas pandang.
* **Tingkah Laku:** Borang semakan dan kad jadual dapur memaparkan kotak amaran visual berlatar kuning ambar terang bertanda ikon perhatian.
* **Kriteria Penerimaan:** Teks ucapan kek dipaparkan dalam fon jelas, bersaiz besar, dan dikekalkan secara konsisten pada paparan borang, jadual semak dapur, dan resit rasmi.

### FR-003: Pengurusan Katalog Menu & Price Matching
* **Keutamaan:** MUST HAVE
* **Tujuan:** Memadankan pesanan pelanggan dengan harga standard kedai serta membenarkan caj tambahan.
* **Tingkah Laku:** Memadankan nama item hasil ekstrak AI dengan Katalog Menu Tetap kedai, serta membenarkan peniaga memasukkan harga manual atau caj *custom* (contoh: *Extra Topper RM10*, *Caj Penghantaran RM15*).
* **Kriteria Penerimaan:** Peniaga boleh memilih menu sedia ada atau menambah *custom line item* secara dinamik sebelum mengira jumlah keseluruhan.

### FR-004: Jadual Tempahan Harian & Kitchen Checklist
* **Keutamaan:** MUST HAVE
* **Tujuan:** Menguruskan senarai tugasan harian mengikut urutan tarikh dan masa serahan.
* **Tingkah Laku:** Menyusun tempahan mengikut urutan kronologi. Menyediakan status bertahap (`Baru`, `Sedang Disediakan`, `Siap Dibuat`, `Selesai`) dan kotak semak (*checkbox*) bagi setiap item yang telah selesai dibakar atau dihias.
* **Kriteria Penerimaan:** Menanda penanda siap mengemas kini status tempahan secara langsung dan menyimpan status ke `localStorage`.

### FR-005: Penjanaan Resit PDF & DuitNow QR
* **Keutamaan:** MUST HAVE
* **Tujuan:** Menjana resit pengesahan bayaran yang bersih dan profesional untuk pelanggan.
* **Tingkah Laku:** Menjana dokumen resit bersumberkan data tempahan dan Profil Kedai (Nama Kedai, WhatsApp, Bank, DuitNow QR). Menyediakan butang *Cetak / PDF* dan fungsi salin teks WhatsApp.
* **Kriteria Penerimaan:** Resit mengandungi susunan kemas, butiran item, jumlah harga, baki deposit, nota ucapan kek, dan paparan kod DuitNow QR.

### FR-006: Local Storage & Data Management
* **Keutamaan:** MUST HAVE
* **Tujuan:** Memastikan data perniagaan tidak hilang apabila aplikasi ditutup atau pelayar dimuat semula.
* **Tingkah Laku:** Menyimpan rekod menu, profil kedai, dan senarai tempahan ke dalam `localStorage` pelayar secara automatik. Menyediakan fungsi *Export JSON* dan *Import JSON* sebagai sandaran data.
* **Kriteria Penerimaan:** Tindakan muat semula pelayar (*refresh*) tidak memadamkan tempahan atau tetapan kedai yang telah disimpan.

---

## 4. Model Data (JSON Structure)

### Entiti Utama:
* **`Order`:** Menyimpan rekod lengkap tempahan: `id`, `customerName`, `customerPhone`, `deliveryDate`, `deliveryTime`, `deliveryType`, `address`, `wordingOnCake`, `items`, `itemChecklist`, `totalPrice`, `depositPaid`, `paymentStatus`, `status`, `notes`, `createdAt`.
* **`MenuItem`:** Katalog menu tetap: `id`, `name`, `basePrice`, `category`, `description`.
* **`ShopProfile`:** Profil perniagaan: `shopName`, `phone`, `bankName`, `bankAccount`, `accountHolder`, `qrImageUrl`, `tagline`, `address`, `pickupInstructions`, `maxDailySlots`.

---

## 5. Peraturan Perniagaan (Business Rules) & Edge Cases

1. **Maklumat Mesej Kurang Lengkap:** Sekiranya mesej WhatsApp pelanggan tidak mengandungi tarikh atau alamat, AI mengembalikan nilai string kosong `""` supaya peniaga boleh melengkapkannya secara manual tanpa kegagalan sistem.
2. **Kuasa Muktamad Peniaga:** Peniaga sentiasa diberi kuasa mutlak untuk menyunting sebarang harga atau butiran hasil ekstraksi AI sebelum tempahan disimpan ke jadual.
3. **Tiada Halangan Pendaftaran:** Tiada kata laluan atau borang *sign-up* dipaksa pada fasa MVP ini bagi memastikan peniaga boleh terus menggunakan aplikasi serta-merta di dapur.
