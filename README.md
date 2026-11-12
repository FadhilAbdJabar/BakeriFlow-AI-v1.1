# BakeriFlow AI

> **Aplikasi pintar pengurusan pesanan dan dapur khusus untuk peniaga bakeri dan makanan dari rumah (*home bakers*).**  
> Menukar mesej WhatsApp berterabur menjadi pesanan teratur, menyerlahkan tulisan kek agar sifar kesilapan ejaan, dan menjana resit rasmi DuitNow QR dalam beberapa saat.

---

## 📌 Masalah yang Diselesaikan

Kebanyakan peniaga bakeri dari rumah menerima puluhan tempahan setiap minggu menerusi WhatsApp. Situasi lazim yang sering berlaku:

* **Mesej Pelanggan Berterabur:** Pelanggan menghantar teks panjang yang mencampurkan nama, jenis kek, tarikh, alamat, dan masa serahan secara rawak. Peniaga terpaksa membaca semula perbualan berulang kali untuk mencatat pesanan.
* **Risiko Tersilap Eja Tulisan Kek (*High-Risk Failure Point*):** Permintaan ucapan khas (contohnya *"Happy 5th Birthday Rayyan Mikhail"*) kerap terlepas pandang atau tersilap eja semasa waktu sibuk di dapur, menyebabkan kek rosak dan pelanggan kecewa.
* **Ketiadaan Senarai Semak Dapur (*Kitchen Checklist*):** Kekeliruan status antara kek yang baru ditempah, kek yang sedang dibakar di dalam ketuhar, kek yang sedang dihias, dan kek yang sedia untuk diambil.
* **Penyediaan Resit Manual yang Lambat:** Peniaga terpaksa menaip harga dan nombor akaun bank secara manual satu demi satu, melambatkan proses penerimaan wang deposit.

**BakeriFlow AI menyelesaikan masalah ini dengan menggabungkan kecerdasan buatan (Google Gemini AI) bersama alur kerja meja dapur yang tersusun.**

---

## 👥 Untuk Siapa Aplikasi Ini?

1. **Home Bakers & Home Cooks:** Peniaga kek, biskut, pencuci mulut, dan pastri buatan rumah yang menguruskan perniagaan secara solo atau bersama pasangan/pembantu kecil.
2. **Pengurus Tempahan Makanan Skala Kecil:** Sesiapa sahaja yang menerima pesanan makanan harian menerusi WhatsApp atau media sosial dan memerlukan sistem rekod yang kemas tanpa sistem POS (*Point of Sale*) yang rumit.

---

## ⚡ Apa yang Boleh Dibuat?

* **Ekstrak Pesanan Pintar (AI WhatsApp Parser):** Salin teks dari WhatsApp dan tampal — AI akan mengekstrak nama, nombor telefon, tarikh, masa, alamat, jenis serahan, dan senarai item secara automatik.
* **Tampal 1-Sentuhan (*Smart Clipboard Paste*):** Butang pantas untuk membaca mesej yang baru disalin daripada papan keratan peranti tanpa perlu menampal secara manual.
* **Tiket Tulisan Kek Terserlah (Wording on Cake Ticket):** Ruangan khas berlatar kuning ambar terang dengan teks tebal yang memastikan ucapan hari jadi atau nota alahan sentiasa jelas di mata peniaga.
* **Sahkan Ejaan Nama WhatsApp:** 1-klik untuk menghantar draf pengesahan ejaan nama kepada pelanggan sebelum kek mula dibakar.
* **Jadual Dapur & Senarai Semak (*Kitchen Checklist*):** Urus tempahan mengikut urutan masa, tanda kotak semak item yang siap dibakar/dihias, dan pantau status (`Baru`, `Sedang Disediakan`, `Siap Dibuat`, `Selesai`).
* **Had Kapasiti Harian (*Slot Alert*):** Amaran automatik apabila tempahan pada tarikh tertentu telah mencapai had kemampuan harian dapur (contoh: maksimum 5 kek sehari).
* **Mesej Fasa WhatsApp Automatik:** 1-klik untuk menghantar perkembangan kek kepada pelanggan (Fasa Pembakaran, Fasa Chiller, Sedia Ambil di Pagar, atau Pemandu Lalamove/Grab Dalam Perjalanan).
* **Resit Rasmi & Kod DuitNow QR:** Jana resit profesional yang sedia dicetak (PDF) atau dikongsi terus ke WhatsApp berserta kod DuitNow QR kedai.
* **Simpanan Tempatan & Sandaran Selamat (*Local-First & JSON Backup*):** Semua data disimpan secara kekal di dalam peranti pelayar anda tanpa memerlukan kata laluan (*zero-friction onboard*), berserta fungsi muat turun fail sandaran JSON bila-bila masa.

---

## 🧁 Contoh Cara Penggunaan

1. **Salin Teks WhatsApp:** Pelanggan menghantar mesej:  
   > *"Salam kak Siti, saya Mira. Nak order Kek Coklat Fudge Moist 7 inci sebiji untuk sabtu ni 15 Nov pkl 3 petang. Tulis atas kek: 'Happy 5th Birthday Rayyan Mikhail'. Pickup sendiri kat rumah ya. No phone 019-3456789."*
2. **Tampal & Ekstrak:** Buka BakeriFlow AI dan tekan butang **"Tampal Terus Dari Clipboard"** atau **"Ekstrak Pesanan (AI)"**.
3. **Semak Borang:** Sistem mengisi nama Mira, nombor telefon, tarikh, masa 15:00, mod *Self-pickup*, dan meletakkan ucapan *"Happy 5th Birthday Rayyan Mikhail"* di dalam kotak amaran khas.
4. **Simpan Tempahan:** Tekan **"Simpan Tempahan Ke Jadual"**. Tempahan serta-merta masuk ke Jadual Dapur harian.
5. **Di Dapur:** Semasa membakar dan menghias, peniaga menanda kotak semak `[✓]` item dan menghantar mesej WhatsApp fasa *"Kek siap dihias & dimasukkan ke chiller"* dengan 1 klik.
6. **Keluarkan Resit:** Tekan **"Resit / QR"** untuk mencetak resit PDF atau berkongsi kod DuitNow QR kepada Mira untuk bayaran baki.

---

## 🌐 Cara Mencuba

Aplikasi ini boleh diakses secara langsung melalui pelayar web:

* **Pautan Aplikasi (Preview):** [BakeriFlow AI di Google AI Studio](https://ais-dev-li54pntin6lwbhmgk3oe4t-858966591711.asia-northeast1.run.app)
* *Nota:* Tiada pendaftaran akaun atau kata laluan diperlukan. Aplikasi sedia digunakan serta-merta.

---

## 📊 Status Projek Semasa

* **Tahap Pembangunan:** Versi 1.1 (MVP Disahkan & Sedia Digunakan).
* **Fungsi yang Beroperasi:**
  * ✅ Ekstraksi pesanan WhatsApp berasaskan AI Gemini dan analisis heuristik sandaran.
  * ✅ Penyerlahan tulisan kek dan fungsi semakan ejaan WhatsApp.
  * ✅ Pengurusan katalog menu tetap dan penambahan caj *custom* (topper, lilin, caj penghantaran).
  * ✅ Jadual dapur, senarai semak item siap, dan penjejak kapasiti harian (*Slot Alert*).
  * ✅ Penjanaan resit berserta kod DuitNow QR dan format cetakan sedia PDF.
  * ✅ Sandaran data tempatan (*Export JSON* dan *Import JSON*).
* **Batasan Penting:**
  * Penyegerakan automatik pelbagai peranti (*Cloud Sync Firebase/Supabase*) dirancang untuk Fasa 2. Buat masa ini, data disimpan secara setempat (*Local Storage*) pada peranti pelayar yang digunakan.
  * Integrasi gerbang pembayaran automatik (FPX/Stripe) dan tempahan kurier automatik (Lalamove API) berada di luar skop Fasa 1.

---

## 📚 Panduan Lanjut (Dokumentasi Penuh)

Untuk maklumat terperinci, sila rujuk dokumentasi berkaitan:

* 📖 [Panduan Pengguna Langkah Demi Langkah](docs/PANDUAN-PENGGUNA.md)
* 📋 [Dokumen Keperluan Produk & PRD](docs/KEPERLUAN-PRODUK.md)
* 🗺️ [Status Terperinci & Perancangan Masa Depan (Roadmap)](docs/STATUS-DAN-ROADMAP.md)
* 🔒 [Pengendalian Data & Privasi](docs/DATA-DAN-PRIVASI.md)
* ⚙️ [Panduan Pemasangan & Penyelenggaraan Teknikal](docs/SETUP-DAN-PENYELENGGARAAN.md)
* 📝 [Rekod Perubahan (Changelog)](CHANGELOG.md)

---

## 🛠️ Ringkasan Teknologi

* **React 19:** Digunakan untuk membina antaramuka pengguna yang pantas, responsif dan interaktif.
* **TypeScript:** Memastikan kestabilan kod dan mengurangkan ralat data (*type-safety*).
* **Tailwind CSS v4:** Digunakan untuk penggayaan visual bertema bakeri artisanal (*warm parchment & berry accent*).
* **Node.js & Express:** Pelayan bahagian belakang (*backend server*) yang mengendalikan laluan API secara selamat.
* **Google Gemini API (`gemini-3.8-flash`):** Model kecerdasan buatan yang memproses dan mengekstrak teks percakapan WhatsApp kepada format data tersusun.
* **QRCode Library:** Menjana imej kod DuitNow QR secara dinamik untuk pembayaran tanpa tunai.
* **Web Storage API (`localStorage`):** Menyimpan data tempahan dan tetapan kedai terus pada peranti pengguna tanpa memerlukan pelayan pangkalan data luar.

---

## 💬 Maklum Balas & Bantuan

Sekiranya anda menemui sebarang ralat (*bug*) atau mempunyai cadangan penambahbaikan, sila kemukakan maklum balas melalui ruangan **GitHub Issues** pada repositori ini.
