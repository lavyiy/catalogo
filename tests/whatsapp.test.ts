import { generateWhatsAppMessage, generateWhatsAppUrl, validateWhatsAppUrlLength, WHATSAPP_URL_PREFIX } from '../src/lib/whatsapp';
import { describe, test, expect } from 'vitest';

describe('WhatsApp message generation', () => {
  test('generateWhatsAppMessage creates correct structure', () => {
    const items = [
      { name: 'Martillo carpintero', quantity: 2, price: 8500 },
      { name: 'Cinta métrica 5m', quantity: 1, price: 3200 }
    ];

    const message = generateWhatsAppMessage({
      storeName: 'Ferretería del Sur',
      customerName: 'Juan Pérez',
      modality: 'retiro',
      items,
      subtotal: 20200,
      deliveryFee: 0,
      total: 20200,
      observations: 'Deja en la puerta'
    });

    expect(message).toContain('*Nuevo pedido - Ferretería del Sur*');
    expect(message).toContain('*Cliente:* Juan Pérez');
    expect(message).toContain('*Modalidad:* Retiro en el local');
    expect(message).toContain('*Pedido:*');
    expect(message).toContain('• 2 x Martillo carpintero');
    expect(message).toContain('• 1 x Cinta métrica 5m');
    expect(message).toContain('*Subtotal:*');
    expect(message).toContain('*TOTAL:*');
    expect(message).toContain('Gracias, quedo atento a la confirmación.');
  });

  test('generateWhatsAppUrl creates valid URL', () => {
    const url = generateWhatsAppUrl('5491112345678', 'test message');
    expect(url).toContain('https://wa.me/5491112345678');
    expect(url).toContain('text=');
  });

  test('validateWhatsAppUrlLength detects too long messages', () => {
    const longMessage = 'a'.repeat(2001);
    const url = 'https://wa.me/5491112345678?text=' + encodeURIComponent(longMessage);
    const result = validateWhatsAppUrlLength(url);
    expect(result.valid).toBe(false);
  });

  test('validateWhatsAppUrlLength accepts reasonable length', () => {
    const result = validateWhatsAppUrlLength('https://wa.me/5491112345678?text=test');
    expect(result.valid).toBe(true);
  });
});