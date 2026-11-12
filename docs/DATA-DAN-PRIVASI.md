# Pengendalian Data & Privasi

Dokumen ini menerangkan secara telus jenis data yang diproses oleh BakeriFlow AI, lokasi penyimpanan data, dan bagaimana data dikendalikan semasa berinteraksi dengan model kecerdasan buatan (AI).

---

## 1. Jenis Data yang Dikumpulkan

Aplikasi ini memproses maklumat perniagaan dan pesanan harian berikut:

1. **Maklumat Peniaga (Profil Kedai):**
   * Nama bakeri atau jenama.
   * Nombor telefon / WhatsApp perniagaan.
   * Nama bank, nombor akaun bank, dan nama pemegang akaun.
   * Slogan kedai dan arahan pengambilan pesanan.
   * Gambar kod DuitNow QR (disimpan dalam format teks base64).
   * Had kapasiti tempahan harian (*slot capacity*).

2. **Maklumat Pesanan Pelanggan:**
   * Nama pelanggan dan nombor telefon WhatsApp.
   * Tarikh dan masa serahan/pengambilan.
   * Jenis serahan (*Delivery* atau *Self-pickup*) dan alamat penghantaran.
   * Teks ucapan atas kek (*wording on cake*) dan nota diet khas.
   * Senarai item yang ditempah, kuantiti, dan harga.
   * Jumlah bayaran, deposit yang dibayar, dan status pesanan.

---

## 2. Di Mana Data Disimpan?

* **Penyimpanan Setempat Sahaja (*Local-First Storage*):**  
  Pada fasa semasa (MVP Fasa 1), semua data pesanan, katalog menu, dan profil perniagaan disimpan secara langsung di dalam pelayar peranti anda menggunakan **Web Storage API (`localStorage`)**.
* **Tiada Pangkalan Data Berpusat:**  
  Pihak pembangun atau pelayan luaran tidak menyimpan salinan rekod pesanan atau pangkalan data pelanggan anda pada pelayan berpusat. Data kekal berada di bawah kawalan penuh peranti yang anda gunakan.

---

## 3. Penghantaran Data Kepada Model Kecerdasan Buatan (Google Gemini AI)

* **Bila Data Dihantar ke AI?**  
  Data teks perbualan WhatsApp hanya dihantar ke perkhidmatan Google Gemini API apabila pengguna menekan butang **"Ekstrak Pesanan (AI)"** atau menggunakan fungsi **"Tampal Terus Dari Clipboard"**.
* **Bagaimana Ia Diproses?**  
  Teks dihantar menerusi sambungan pelayan bahagian belakang (*server-side proxy*) di `/api/parse-order` ke model `gemini-3.8-flash`. Model AI memproses teks tersebut untuk mengenal pasti entiti (nama, tarikh, kuantiti) dan mengembalikan format JSON berstruktur kepada pelayar anda.
* **Keselamatan Kunci API:**  
  Kunci rahsia `GEMINI_API_KEY` disimpan secara selamat pada bahagian pelayan (*server-side environment variable*) dan tidak pernah didedahkan kepada pelayar pengguna atau kod sumber awam.

---

## 4. Kod DuitNow QR & Maklumat Perbankan

* Gambar kod DuitNow QR yang dimuat naik ditukarkan kepada format data URL setempat (*base64*) dan disimpan di dalam `localStorage` peranti anda.
* Sekiranya anda tidak memuat naik gambar, modul penjanaan kod QR (`qrcode`) menghasilkan kod pembayaran secara terus di dalam kod peranti anda tanpa menghubungi sebarang pelayan pihak ketiga.

---

## 5. Siapa yang Boleh Mengakses Data Anda?

* Hanya individu yang mempunyai akses fizikal kepada peranti dan pelayar web yang anda gunakan (contoh: telefon atau komputer riba anda) boleh melihat data tempahan tersebut.
* Aplikasi ini tidak menggunakan sebarang skrip penjejak iklan (*third-party advertising trackers*) atau alat analisis telemetri pihak ketiga.

---

## 6. Cara Memadam Data

Peniaga mempunyai kawalan mutlak untuk memadam data:
1. **Memadam Tempahan Individu:** Klik ikon tong sampah (*Trash*) pada mana-mana kad tempahan di Jadual Dapur.
2. **Memadam Item Menu:** Klik ikon tong sampah pada mana-mana item dalam Katalog Menu.
3. **Memadam Keseluruhan Data:** 
   * Tekan butang **"Set Semula Contoh"** di tab Menu & Kedai, ATAU
   * Padam data tapak (*Clear Site Data / Clear Local Storage*) pada tetapan pelayar anda.
