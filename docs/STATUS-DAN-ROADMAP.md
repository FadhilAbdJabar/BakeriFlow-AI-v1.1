# Status Pembangunan & Perancangan (Roadmap)

Dokumen ini merekodkan status sebenar fungsi yang telah dibina, fungsi yang telah disahkan melalui ujian, batasan semasa, dan perancangan penambahbaikan pada masa hadapan bagi **BakeriFlow AI**.

---

## 1. Status Fungsi Semasa

| Requirement / Ciri | Status Pembangunan | Status Ujian | Catatan Pelaksanaan |
| :--- | :--- | :--- | :--- |
| **FR-001: AI WhatsApp Parser** | Siap Dibina | Telah Diuji | Beroperasi melalui Google Gemini (`gemini-3.8-flash`) dan fallback heuristik. Berjaya diuji dengan cURL dan mesej sampel. |
| **FR-002: Kad Amaran Wording Kek** | Siap Dibina | Telah Diuji | Kad ambar khas berfungsi di borang draf, jadual dapur, dan paparan resit. Disahkan secara visual. |
| **FR-003: Katalog Menu & Caj Custom** | Siap Dibina | Telah Diuji | Tambah, edit, padam menu berfungsi. Tambah caj custom (topper, lilin, caj pos) diuji dan berfungsi. |
| **FR-004: Jadual Dapur & Checklist** | Siap Dibina | Telah Diuji | Pengisihan tarikh/masa, penapis status, carian, dan interaksi kotak semak item berfungsi serta-merta. |
| **FR-005: Penjanaan Resit & DuitNow** | Siap Dibina | Telah Diuji | Resit HTML rasmi dijana. Gaya cetakan `@media print` sedia ada. Penjanaan QR dinamik dan imej muat naik disahkan. |
| **FR-006: Local Storage & Backup JSON** | Siap Dibina | Telah Diuji | Muat semula pelayar (*refresh*) tidak memadam data. Fungsi *Export JSON* dan *Import JSON* berjaya diuji. |
| **Tampal Pintar Clipboard** | Siap Dibina | Telah Diuji | Butang membaca `navigator.clipboard.readText()` dan mengisi teks secara automatik. |
| **Sahkan Ejaan Nama WhatsApp** | Siap Dibina | Telah Diuji | Draf mesej semakan ejaan dijana dan disahkan membuka pautan WhatsApp dengan teks tepat. |
| **Had Kapasiti Harian (Slot Alert)** | Siap Dibina | Telah Diuji | Tetapan kapasiti berfungsi dan amaran slot muncul apabila tarikh mencapai had maksimum. |
| **Mesej 4 Fasa Alur Kerja WhatsApp** | Siap Dibina | Telah Diuji | Modal 4 fasa kerja membuka WhatsApp pelanggan mengikut konteks fasa penyediaan. |
| **Struktur Bersedia Cloud Sync** | Siap Dibina (Skema) | Belum Diuji dengan Pelayan Awan | Skema data dan jenis TypeScript telah bersedia; penyambungan langsung ke Firebase/Supabase adalah skop Fasa 2. |
| **Cetakan Fizikal Pelbagai Model Printer** | Siap Dibina | Belum Disahkan pada Peranti Fizikal | Dialog cetakan pelayar berfungsi lancar; susun atur pada model pencetak haba (*thermal printer*) tertentu belum diuji secara fizikal. |

---

## 2. Isu Diketahui & Batasan Teknikal (Known Issues & Limitations)

1. **Penyimpanan Terhad pada Pelayar Tunggal (*Local-first Storage*):**  
   * Oleh kerana data fasa MVP disimpan di dalam `localStorage` pelayar, tempahan yang dimasukkan melalui telefon bimbit tidak akan muncul secara automatik pada komputer riba melainkan peniaga menggunakan fungsi *Export JSON* dan *Import JSON*.
2. **Kebenaran Papan Keratan Pelayar (*Clipboard Permission*):**  
   * Sesetengah pelayar web menyekat pembacaan papan keratan automatik melainkan pengguna telah memberikan kebenaran secara eksplisit pada dialog pelayar. Sekiranya disekat, peniaga perlu menampal (*paste*) mesej secara manual.
3. **Ketergantungan Sambungan Internet untuk AI Parsing Sebenar:**  
   * Model AI Gemini memerlukan capaian internet untuk menghubungi pelayan. Sekiranya peranti berada di luar talian, sistem secara automatik menggunakan enjin heuristik sandaran terbina dalam (*fallback heuristic*).

---

## 3. Pelan Perancangan Masa Hadapan (Roadmap)

### Fasa 2: Kerjasama Pelbagai Peranti & Pangkalan Data Awan
* **Penyegerakan Awan Sebenar (Firebase Firestore / Supabase):** Membolehkan suami, pembantu dapur, dan pengurus kaunter menyemak dan mengemas kini senarai semak secara langsung (*real-time multi-device sync*).
* **Imbasan AI Resit Bayaran Pelanggan:** Peniaga boleh memuat naik gambar resit perbankan pelanggan, dan AI akan mengesahkan kesahihan jumlah bayaran deposit secara automatik.
* **Notifikasi WhatsApp Automatik Berjadual:** Peringatan automatik kepada peniaga untuk kek yang perlu diserahkan pada keesokan harinya.

### Fasa 3: Ekosistem Penghantaran & Bayaran Pintar
* **Kalkulator Jarak & Caj Kurier:** Anggaran caj penghantaran automatik berdasarkan poskod pelanggan.
* **Kad Resit Format Media Sosial (9:16 Story Card):** Penjanaan imej estetik format tegak untuk dikongsi ke status WhatsApp atau Instagram Story peniaga.
