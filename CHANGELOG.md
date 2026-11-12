# Rekod Perubahan (Changelog)

Semua perubahan dan penambahbaikan pada projek **BakeriFlow AI** didokumentasikan di sini mengikut piawaian [Keep a Changelog](https://keepachangelog.com/).

---

## [1.1.0] - 2026-11-12

### Ditambah (Added)
* **Tampal 1-Sentuhan (*Smart Clipboard Paste*):** Butang pantas membaca mesej WhatsApp terus dari papan keratan peranti menggunakan `navigator.clipboard.readText()`.
* **Pengesahan Ejaan Nama Pelanggan WhatsApp:** Butang menjana draf mesej semakan ejaan rasmi sebelum kek mula dibakar/dihias.
* **Had Kapasiti Tempahan Harian (*Daily Slot Capacity*):** Peniaga boleh menetapkan had maksimum tempahan sehari (lalai: 5 slot), lengkap dengan amaran visual (*Slot Alert*) apabila tarikh penuh.
* **Mesej 4 Fasa Alur Kerja WhatsApp:** Modal 1-klik untuk menghantar perkembangan status penyediaan kek kepada pelanggan (Fasa Pembakaran, Fasa Chiller, Sedia Ambil di Pagar, dan Pemandu Kurier Dalam Perjalanan).
* **Sistem Peringatan Sandaran (*Silent Auto-Backup*):** Sepanduk pintar yang mengingatkan peniaga memuat turun fail sandaran JSON sekiranya terdapat 3 atau lebih tempahan aktif.
* **Struktur Bersedia Penyegerakan Awan (*Cloud Sync Ready*):** Penambahan skema modular `CloudSyncConfig` bagi memudahkan sambungan ke Firebase Firestore atau Supabase pada masa hadapan.

### Dipertingkatkan (Improved)
* **Reka Bentuk Visual Meja Dapur (*Artisan Bakery Docket*):** Menyingkirkan hiasan kecerunan generik dan menggantikannya dengan tona kertas parcmes hangat (`#faf7f2`), pemisah berona gandum (`#ebdcd0`), dan aksen merah baldu (`#881337`).
* **Ergonomik Kad Semakan Dapur:** ID tempahan dan masa dipaparkan dalam fon monoruang tebal untuk memudahkan pembacaan dari jarak jauh di atas kaunter dapur.
* **Format Cetakan Resit:** Penambahbaikan aturan cetakan `@media print` untuk menghasilkan invois berformat kemas tanpa elemen pelayar yang mengganggu.

---

## [1.0.0] - 2026-11-12

### Pelancaran Awal (Initial Release - MVP Sedia Digunakan)
* **FR-001 (Pengekstrak Pesanan WhatsApp AI):** Ekstraksi entiti nama, telefon, tarikh, masa, alamat, dan senarai item berasaskan model Google Gemini `gemini-3.8-flash` dengan penganalisis heuristik sandaran.
* **FR-002 (Kad Amaran Tulisan Kek):** Penyerlahan visual khas berlatar kuning ambar terang bertanda ikon perhatian untuk teks ucapan atas kek bagi mengelakkan ralat ejaan.
* **FR-003 (Katalog Menu & Caj Custom):** Pengurusan harga standard produk kedai dan keupayaan menambah caj item tambahan secara fleksibel.
* **FR-004 (Jadual Dapur & Kitchen Checklist):** Pengurusan tugas harian mengikut tarikh/masa serahan, status pesanan (`Baru`, `Sedang Disediakan`, `Siap Dibuat`, `Selesai`), dan kotak semak siap bakar/hias.
* **FR-005 (Penjanaan Resit PDF & DuitNow QR):** Resit sedia cetak bersumberkan data pesanan dan profil kedai, lengkap dengan paparan imej DuitNow QR.
* **FR-006 (Simpanan Tempatan & Sandaran Data):** Penyimpanan automatik ke dalam `localStorage` pelayar dan fungsi sandaran *Export JSON* / *Import JSON*.
