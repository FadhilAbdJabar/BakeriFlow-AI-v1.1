import QRCode from 'qrcode';

export async function generateQrDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 280,
      margin: 2,
      color: {
        dark: '#881337', // brand accent
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}

/**
 * Creates standard DuitNow-style transfer link/payload text
 */
export function buildDuitNowPayload(bankName: string, accountNo: string, holderName: string, orderId?: string, amount?: number): string {
  // If bank and account exist, construct readable transfer reference
  let payload = `DUITNOW_TRANSFER|BANK:${bankName}|ACC:${accountNo}|NAME:${holderName}`;
  if (orderId) payload += `|REF:${orderId}`;
  if (amount) payload += `|AMT:${amount.toFixed(2)}`;
  return payload;
}
