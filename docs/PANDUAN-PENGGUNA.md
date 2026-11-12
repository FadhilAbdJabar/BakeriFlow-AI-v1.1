# Panduan Pengguna BakeriFlow AI

Panduan ini menerangkan cara menggunakan aplikasi BakeriFlow AI langkah demi langkah untuk menguruskan pesanan harian bakeri dan makanan dari rumah anda.

---

## 📑 Kandungan

1. [Persediaan Awal: Profil Kedai & DuitNow QR](#1-persediaan-awal-profil-kedai--duitnow-qr)
2. [Menetapkan Katalog Menu & Senarai Harga](#2-menetapkan-katalog-menu--senarai-harga)
3. [Mengekstrak Mesej WhatsApp (AI Parser)](#3-mengekstrak-mesej-whatsapp-ai-parser)
4. [Semakan Borang & Tiket Tulisan Atas Kek](#4-semakan-borang--tiket-tulisan-atas-kek)
5. [Menghantar Pengesahan Semakan Ejaan Kek](#5-menghantar-pengesahan-semakan-ejaan-kek)
6. [Menggunakan Jadual Dapur & Senarai Semak (Checklist)](#6-menggunakan-jadual-dapur--senarai-semak-checklist)
7. [Menghantar Mesej Fasa WhatsApp Automatik](#7-menghantar-mesej-fasa-whatsapp-automatik)
8. [Menjana & Mencetak Resit Rasmi (PDF / DuitNow)](#8-menjana--mencetak-resit-rasmi-pdf--duitnow)
9. [Sandaran & Pemulihan Data (Export & Import JSON)](#9-sandaran--pemulihan-data-export--import-json)
10. [Penyelesaian Masalah Biasa (Troubleshooting)](#10-penyelesaian-masalah-biasa-troubleshooting)

---

## 1. Persediaan Awal: Profil Kedai & DuitNow QR

Sebelum mula menerima tempahan, masukkan maklumat perniagaan anda sekali sahaja:

1. Klik tab **"Menu & Profil"** (pada komputer) atau ikon **"Kedai"** (pada telefon).
2. Lengkapkan maklumat berikut:
   * **Nama Bakeri / Jenama:** Contohnya *Dapur Manis Che Siti*.
   * **No. Telefon WhatsApp:** Contohnya *013-8892110*.
   * **Nama Bank & No. Akaun:** Contohnya *Maybank* dan *164285923810*.
   * **Nama Pemegang Akaun:** Nama rasmi akaun bank anda.
   * **Had Kapasiti Harian (Slot):** Bilangan maksimum kek yang mampu disiapkan sehari (contoh: 5 kek).
   * **Gambar Kod DuitNow QR:** Tekan butang *Muat Naik Gambar DuitNow QR* untuk memilih gambar tangkap layar (*screenshot*) kod QR daripada aplikasi perbankan anda.
3. Tekan butang **"Simpan Profil & Kapasiti"**.

---

## 2. Menetapkan Katalog Menu & Senarai Harga

Katalog menu membolehkan AI memadankan nama kek yang disebut pelanggan dengan harga standard kedai anda secara automatik:

1. Di tab **"Menu & Profil"**, tatal ke bahagian **"Katalog Menu Tetap"**.
2. Untuk menambah menu baru: Tekan butang **"+ Tambah Item Menu"**, masukkan nama (contoh: *Kek Pandan Gula Melaka 8"*), harga asas (contoh: *RM75*), dan kategori (*Kek Hari Jadi*).
3. Untuk mengubah harga sedia ada: Tekan ikon pensel (*Edit*) pada mana-mana kad menu.

---

## 3. Mengekstrak Mesej WhatsApp (AI Parser)

Apabila pelanggan menghantar teks tempahan di WhatsApp:

1. Di aplikasi WhatsApp, salin (*copy*) mesej perbualan pelanggan.
2. Buka BakeriFlow AI pada tab **"Ekstrak Tempahan"**.
3. Pilih salah satu cara berikut:
   * **Cara 1 (Paling Pantas):** Tekan butang **"Tampal Terus Dari Clipboard"**. Sistem akan membaca teks daripada papan keratan telefon anda secara automatik.
   * **Cara 2:** Tekan lama di dalam kotak teks, pilih *Paste*, dan tekan butang **"Ekstrak Pesanan (AI)"**.
4. Dalam masa 1–3 saat, AI akan memecahkan teks berterabur tersebut ke dalam medan borang yang teratur.

---

## 4. Semakan Borang & Tiket Tulisan Atas Kek

Selepas AI selesai mengekstrak, semak medan borang di bawah:

* **Nama & Telefon Pelanggan:** Disahkan daripada teks mesej.
* **Tarikh & Masa:** Anda boleh menggunakan butang pantas *"Hari Ini"*, *"Esok"*, atau *"Lusa"*.
* **Kaedah Serahan:** Pilih sama ada *Ambil Sendiri (Self-pickup)* atau *Penghantaran (Delivery)*.
* **Tiket Tulisan Atas Kek (PENTING):** Periksa kotak ambar khas. Pastikan ucapan hari jadi atau nota alahan pelanggan ditulis dengan betul (contoh: *"Happy 5th Birthday Rayyan Mikhail"*).
* **Senarai Item:** Anda boleh menambah kuantiti, mengubah harga, atau menekan butang **"Item Custom"** untuk memasukkan caj tambahan seperti *Topper Akrilik RM12* atau *Caj Penghantaran RM15*.
* **Deposit:** Masukkan jumlah wang deposit yang telah diterima (contoh: *RM40*). Baki bayaran akan dikira secara automatik.
* Tekan butang **"Simpan Tempahan Ke Jadual"**.

---

## 5. Menghantar Pengesahan Semakan Ejaan Kek

Untuk mengelakkan kesilapan mengeja nama atas kek sebelum mula membakar:

1. Di bahagian kotak **Tulisan Atas Kek**, tekan butang **"Sahkan Ejaan di WA"**.
2. WhatsApp akan dibuka dengan mesej yang telah disiapkan secara automatik meminta pelanggan mengesahkan ejaan.
3. Pelanggan hanya perlu membalas "OK" sebagai pengesahan bertulis rasmi.

---

## 6. Menggunakan Jadual Dapur & Senarai Semak (Checklist)

Tab **"Jadual Dapur"** berfungsi sebagai papan arahan kerja harian di dapur:

1. **Penapis Tarikh:** Pilih *Hari Ini*, *Esok*, atau *7 Hari Akan Datang* untuk melihat senarai kerja mengikut keutamaan masa.
2. **Menanda Kotak Semak (Checklist):** Apabila sesuatu kek selesai dibakar atau dihias, klik kotak semak pada item tersebut. Teks akan digaris potong secara visual.
3. **Menukar Status:** Gunakan menu status pada kad untuk mengemas kini fasa tempahan:
   * **Baru:** Tempahan baru diterima.
   * **Sedang Disediakan:** Kek sedang dibancuh atau dibakar dalam ketuhar.
   * **Siap Dibuat:** Kek siap dihias dan disimpan di dalam chiller.
   * **Selesai:** Kek telah diambil oleh pelanggan atau kurier.

---

## 7. Menghantar Mesej Fasa WhatsApp Automatik

Untuk memastikan pelanggan sentiasa mendapat maklumat terkini tanpa anda perlu menaip panjang:

1. Pada kad tempahan di Jadual Dapur, tekan butang **"Mesej Fasa WA"**.
2. Pilih salah satu daripada 4 fasa kerja:
   * 🔘 *Bahan sedang disediakan / Kek sedang dibakar*
   * 🔘 *Kek sudah siap dihias & dimasukkan ke chiller*
   * 🔘 *Kek sedia untuk diambil di pagar rumah*
   * 🔘 *Pemandu Lalamove/Grab telah mengambil kek anda*
3. Tekan **"Hantar Mesej Ini"** untuk menghantar mesej terus kepada nombor telefon pelanggan.

---

## 8. Menjana & Mencetak Resit Rasmi (PDF / DuitNow)

1. Pada kad tempahan, tekan butang **"Resit / QR"**.
2. Paparan resit akan memaparkan:
   * Butiran kedai dan pelanggan.
   * Jadual item, deposit, dan baki yang perlu dibayar.
   * **Kotak khas tulisan ucapan kek.**
   * Kod DuitNow QR rasmi dan nombor akaun bank anda.
3. Tindakan:
   * **Cetak / Simpan PDF:** Tekan butang ini untuk mencetak fizikal atau menyimpan fail PDF menggunakan fungsi cetakan pelayar.
   * **Buka WhatsApp / Salin Mesej:** Kongsi ringkasan resit lengkap terus ke ruang perbualan WhatsApp pelanggan.

---

## 9. Sandaran & Pemulihan Data (Export & Import JSON)

Semua data BakeriFlow AI disimpan di dalam memori pelayar peranti anda (*Local Storage*). Untuk mengelakkan kehilangan data sekiranya telefon ditukar atau sejarah pelayar dipadam:

1. Di tab **"Menu & Profil"**, tatal ke bahagian bawah.
2. Tekan butang **"Export JSON (Sandaran)"**. Satu fail (contoh: `bakeriflow_backup_2026-11-12.json`) akan dimuat turun ke peranti anda. Simpan fail ini di Google Drive atau simpanan selamat.
3. Untuk memulihkan data pada komputer atau telefon lain: Tekan butang **"Import JSON (Pulihkan)"** dan pilih fail sandaran anda. Semua tempahan dan tetapan akan dipulihkan serta-merta.

---

## 10. Penyelesaian Masalah Biasa (Troubleshooting)

| Masalah | Punca Biasa | Penyelesaian |
| :--- | :--- | :--- |
| Butang *Tampal Terus* tidak berfungsi | Kebenaran clipboard disekat oleh pelayar | Tekan lama di dalam kotak teks dan pilih *Paste* secara manual, atau benarkan kebenaran papan keratan pada tetapan pelayar. |
| AI tidak mengisi tarikh penghantaran | Pelanggan tidak menyatakan tarikh dalam mesej | Masukkan tarikh secara manual menggunakan pemilih tarikh atau butang cip *"Esok"* / *"Lusa"*. |
| Kod DuitNow QR tidak dipaparkan pada resit | Gambar QR belum dimuat naik di tab Profil | Muat naik gambar QR di tab *Menu & Profil*. Jika tiada imej, sistem akan menjana kod QR sandaran berdasarkan nombor akaun anda. |
| Rekod tempahan hilang selepas membersihkan sejarah pelayar | Sejarah dan cache *Local Storage* telah dipadam | Buka tab *Menu & Profil* dan tekan butang *Import JSON* untuk memuat naik semula fail sandaran anda. |
