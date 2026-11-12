# Panduan Pemasangan & Penyelenggaraan Teknikal

Panduan ini disediakan untuk pembangun atau jurutera perisian yang ingin menjalankan, menyelenggara atau menguji kod sumber **BakeriFlow AI** pada komputer tempatan (*local machine*).

---

## 1. Keperluan Sistem

Sebelum memulakan, pastikan persekitaran pembangunan anda mempunyai perisian berikut:

* **Node.js:** Versi 18.x, 20.x atau lebih terkini.
* **Pengurus Pakej (*Package Manager*):** `npm` (v9 atau ke atas), `pnpm`, atau `bun`.
* **Kunci API Google Gemini (Pilihan):** Untuk mengaktifkan enjin ekstraksi AI sebenar (`gemini-3.8-flash`). Sekiranya tiada, sistem secara automatik menggunakan enjin heuristik sandaran terbina dalam.

---

## 2. Struktur Direktori Projek

```text
/
├── index.html                     # Titik masuk HTML utama & fon
├── metadata.json                  # Konfigurasi nama & keupayaan pelayan AI Studio
├── package.json                   # Senarai pakej dependensi & skrip binaan
├── tsconfig.json                  # Konfigurasi TypeScript
├── vite.config.ts                 # Konfigurasi binaan Vite & Tailwind
├── server.ts                      # Pelayan Express bahagian belakang & laluan Gemini API
│
├── public/                        # Aset statik awam (termasuk dokumen PRD PDF)
│   └── assets/aistudio/
│       └── BakeriFlow_AI_-_Product_Requirements_Document_1eeb7142.pdf
│
├── docs/                          # Dokumentasi lengkap projek
│   ├── PANDUAN-PENGGUNA.md
│   ├── KEPERLUAN-PRODUK.md
│   ├── STATUS-DAN-ROADMAP.md
│   ├── DATA-DAN-PRIVASI.md
│   └── SETUP-DAN-PENYELENGGARAAN.md
│
└── src/                           # Kod sumber antaramuka (Frontend)
    ├── main.tsx                   # Titik permulaan React DOM
    ├── App.tsx                    # Komponen induk yang menyelaraskan tab & storan
    ├── index.css                  # Penggayaan global Tailwind & aturan cetakan resit
    ├── types/
    │   └── index.ts               # Definisi jenis TypeScript (Order, MenuItem, Profile)
    ├── utils/
    │   ├── storage.ts             # Pengurus LocalStorage & data sampel lalai
    │   └── qrHelper.ts            # Penjana kod DuitNow QR berasaskan modul qrcode
    └── components/
        ├── Header.tsx             # Bar navigasi atas (desktop) & bawah (mobile)
        ├── OrderParserTab.tsx     # Tab 1: Pengekstrak WhatsApp & borang pesanan
        ├── KitchenDashboardTab.tsx # Tab 2: Jadual dapur, checklist & status fasa WA
        ├── SettingsAndMenuTab.tsx # Tab 3: Profil kedai, DuitNow & katalog menu
        └── ReceiptModal.tsx       # Dialog cetakan resit rasmi & DuitNow QR
```

---

## 3. Langkah Pemasangan & Menjalankan Projek

### Langkah 1: Klon atau Buka Repositori
```bash
git clone <URL_REPOSITORI_ANDA>
cd bakeriflow-ai
```

### Langkah 2: Pasang Pakej Dependensi
```bash
npm install
```

### Langkah 3: Konfigurasi Fail Persekitaran (`.env`)
Salin templat fail `.env.example` kepada `.env`:
```bash
cp .env.example .env
```
Buka fail `.env` dan masukkan kunci API Google Gemini anda (jika ada):
```env
GEMINI_API_KEY="AIzaSy..."
PORT=3000
```
*Nota: Sekiranya `GEMINI_API_KEY` tidak diisi, pelayan Express akan menggunakan penganalisis teks sandaran (*fallback heuristic parser*) secara automatik tanpa ralat.*

### Langkah 4: Jalankan Mod Pembangunan (*Development*)
```bash
npm run dev
```
Pelayan Express akan bermula dan menyambungkan perisian Vite. Buka pelayar anda di `http://localhost:3000`.

---

## 4. Arahan Binaan (*Build*) & Pengeluaran (*Production*)

### Menguji Ralat TypeScript (Linting)
```bash
npm run lint
```
*Menjalankan `tsc --noEmit` untuk mengesahkan integriti jenis data.*

### Membina Kod Pengeluaran (*Production Build*)
```bash
npm run build
```
*Menghasilkan fail statik yang dioptimumkan di dalam direktori `dist/`.*

### Menjalankan Pelayan Pengeluaran
```bash
npm start
```
*Menjalankan `server.ts` dalam mod `NODE_ENV=production` yang menghidangkan fail `dist/` secara statik.*

---

## 5. Penyelesaian Ralat Teknikal (Technical Troubleshooting)

1. **Ralat Port 3000 Sedang Digunakan (*EADDRINUSE*):**  
   Pastikan tiada proses lain yang menggunakan port 3000 atau tetapkan port berbeza melalui pembolehubah persekitaran: `PORT=3001 npm run dev`.
2. **Kelewatan Respons Pengekstrakan AI:**  
   Pelayan mengandungi blok `try...catch` yang akan bertukar kepada penganalisis sandaran (*regex heuristic*) sekiranya sambungan API Gemini tamat masa (*timeout*).
