import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialise Gemini client server-side
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback regex-based parser in case API key is not present or offline
function fallbackParseOrder(message: string) {
  const text = message.trim();
  
  // Extract phone number
  const phoneMatch = text.match(/(?:01[0-9]-?[0-9]{7,8}|\+?601[0-9]-?[0-9]{7,8})/);
  const customerPhone = phoneMatch ? phoneMatch[0].replace(/[\s-]/g, '') : '';

  // Extract wording on cake (look for "tulis:", "ucapan:", "wording:", quotes, etc.)
  let wordingOnCake = '';
  const wordingMatch = text.match(/(?:tulis|tulisan|ucapan|wording|ayat)\s*(?:atas kek|pada kek)?\s*[:=\-]?\s*["“']?([^"\n\r.,]+)["”']?/i)
    || text.match(/["“'](Happy Birthday[^"”\n\r]+|Selamat Hari Jadi[^"”\n\r]+|Sanah Helwah[^"”\n\r]+)["”']/i);
  if (wordingMatch) {
    wordingOnCake = wordingMatch[1]?.trim() || '';
  }

  // Delivery type
  let deliveryType = 'Self-pickup';
  if (/deliver|hantar|pos|cod|lalamove|grab/i.test(text)) {
    deliveryType = 'Delivery';
  }

  // Address
  let address = '';
  const addressMatch = text.match(/(?:alamat|address|hantar ke|delivery ke)\s*[:=\-]?\s*([^\n\r]+)/i);
  if (addressMatch) {
    address = addressMatch[1]?.trim() || '';
  }

  // Name - improved pattern
  let customerName = '';
  const nameMatch = text.match(/(?:nama|name)\s*[:=\-]?\s*([A-Za-z\s]{2,20})/i)
    || text.match(/(?:saya)\s+([A-Za-z]{3,15})/i);
  if (nameMatch) {
    customerName = nameMatch[1]?.trim() || '';
  }

  // Time
  let deliveryTime = '';
  const timeMatch = text.match(/(?:pukul|pkl|jam|time)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm|pagi|petang|malam)?)/i)
    || text.match(/(\d{1,2}:\d{2})/);
  if (timeMatch) {
    deliveryTime = timeMatch[1]?.trim() || '';
  }

  return {
    customerName: customerName || 'Pelanggan WhatsApp',
    customerPhone: customerPhone || '',
    deliveryDate: '',
    deliveryTime: deliveryTime || '14:00',
    deliveryType: deliveryType,
    address: address || '',
    wordingOnCake: wordingOnCake || '',
    detectedItems: [
      {
        itemName: 'Kek Tempahan Khas',
        quantity: 1,
        estimatedPrice: 65,
      },
    ],
  };
}

// API endpoint to parse WhatsApp message with Gemini AI
app.post('/api/parse-order', async (req: Request, res: Response) => {
  try {
    const { message, menuCatalog } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Mesej WhatsApp diperlukan.' });
      return;
    }

    if (!ai) {
      console.warn('GEMINI_API_KEY is not configured on server. Using fallback heuristic parser.');
      const parsed = fallbackParseOrder(message);
      res.json({
        success: true,
        source: 'fallback_heuristic',
        data: parsed,
        notice: 'API Key belum disetkan; analisis asas digunakan.',
      });
      return;
    }

    const catalogSummary = Array.isArray(menuCatalog) && menuCatalog.length > 0
      ? menuCatalog.map((m: any) => `- ${m.name} (Harga Standard: RM${m.basePrice || 0}, Kategori: ${m.category || 'Bakeri'})`).join('\n')
      : 'Tiada katalog tetap disediakan.';

    const prompt = `Anda adalah pembantu AI pintar untuk peniaga bakeri dan makanan dari rumah (home bakers di Malaysia).
Tugas anda ialah mengekstrak maklumat pesanan daripada mesej WhatsApp pelanggan (Bahasa Melayu / English / Manglish) ke dalam format JSON yang bersih dan tepat.

PERATURAN PENTING:
1. 'wordingOnCake': Ini adalah BAHAGIAN PALING KRITIKAL! Cari teks ucapan atau tulisan atas kek (contoh: "Happy 5th Birthday Rayyan", "Selamat Pengantin Baru Along & Angah", "Sanah Helwah Ibu", dll.) atau permintaan khas seperti "no nuts", "kurang manis", "nak topper unicorn". Jika tiada, letak "".
2. 'customerName': Nama pelanggan jika ada (cth: "Kak Siti", "Puan Aishah", "Faiz"). Jika tiada, letak "".
3. 'customerPhone': Nombor telefon Malaysia (cth: "0123456789" atau "+6019..."). Jika tiada, letak "".
4. 'deliveryDate': Tarikh dalam format "YYYY-MM-DD". Rujuk tarikh konteks semasa (November 2026). Jika pelanggan sebut "sabtu ni", "esok", "15/11", tukarkan kepada YYYY-MM-DD. Jika tidak disebut, letak "".
5. 'deliveryTime': Masa dalam format 24 jam "HH:mm" (cth: "15:00" untuk 3 petang). Jika tidak disebut, letak "".
6. 'deliveryType': Pilih sama ada "Delivery" atau "Self-pickup". Jika ada alamat atau kata kunci "hantar/lalamove/grab/cod", ia adalah "Delivery". Jika kata kunci "ambil/pickup/self pick", ia adalah "Self-pickup".
7. 'address': Alamat penuh jika Delivery. Jika Self-pickup atau tiada alamat, letak "".
8. 'detectedItems': Senarai item makanan/kek yang ditempah dengan kuantiti dan anggaran harga (nombor sahaja). Jika nama item sepadan atau hampir sepadan dengan Katalog Menu Kedai berikut, gunakan nama katalog tersebut:
Katalog Menu Kedai:
${catalogSummary}

Mesej WhatsApp Pelanggan:
"""
${message}
"""
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            customerName: { type: Type.STRING },
            customerPhone: { type: Type.STRING },
            deliveryDate: { type: Type.STRING, description: 'YYYY-MM-DD format or empty string' },
            deliveryTime: { type: Type.STRING, description: 'HH:mm format or empty string' },
            deliveryType: { type: Type.STRING, description: 'Delivery or Self-pickup' },
            address: { type: Type.STRING },
            wordingOnCake: { type: Type.STRING, description: 'Exact wording to write on cake or special custom dietary notes' },
            detectedItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  itemName: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  estimatedPrice: { type: Type.NUMBER },
                },
                required: ['itemName', 'quantity', 'estimatedPrice'],
              },
            },
          },
          required: [
            'customerName',
            'customerPhone',
            'deliveryDate',
            'deliveryTime',
            'deliveryType',
            'address',
            'wordingOnCake',
            'detectedItems',
          ],
        },
      },
    });

    const rawText = response.text || '{}';
    const parsedData = JSON.parse(rawText);

    res.json({
      success: true,
      source: 'gemini-3.8-flash',
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error parsing order with Gemini:', error);
    // Graceful fallback to heuristic extraction so user journey is never blocked
    try {
      const fallback = fallbackParseOrder(req.body?.message || '');
      res.json({
        success: true,
        source: 'fallback_after_error',
        data: fallback,
        warning: 'AI parsing mengalami kelewatan; analisis automatik sandaran disediakan.',
      });
    } catch (e) {
      res.status(500).json({ error: 'Gagal mengekstrak teks WhatsApp. Sila cuba lagi atau isi borang secara manual.' });
    }
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: Number(PORT),
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`> BakeriFlow AI server running at http://0.0.0.0:${PORT} [${isProduction ? 'PROD' : 'DEV'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
