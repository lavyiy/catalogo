export const WHATSAPP_URL_PREFIX = 'https://wa.me/';

export const generateWhatsAppMessage = ({
  storeName,
  customerName,
  modality,
  address,
  paymentMethod,
  observations,
  items,
  subtotal,
  deliveryFee,
  total,
}: {
  storeName: string;
  customerName: string;
  modality: 'retiro' | 'envio';
  address?: string;
  paymentMethod?: string;
  observations?: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
}): string => {
  const lines: string[] = [];

  // Header
  lines.push(`*Nuevo pedido - ${storeName}*`);

  // Client
  lines.push(`*Cliente:* ${customerName}`);

  // Modalidad
  lines.push(`*Modalidad:* ${modality === 'retiro' ? 'Retiro en el local' : 'Envío a domicilio'}`);

  // Dirección (only for envio)
  if (modality === 'envio' && address) {
    lines.push(`*Dirección:* ${address}`);
  }

  // Payment method (only if selected)
  if (paymentMethod) {
    lines.push(`*Pago:* ${paymentMethod}`);
  }

  // Items
  lines.push(`*Pedido:*`);
  items.forEach((item) => {
    const itemTotal = item.quantity * item.price;
    lines.push(`• ${item.quantity} x ${item.name} - $ ${item.price} c/u = $ ${itemTotal}`);
  });

  // Subtotal
  lines.push(`*Subtotal:* $ ${subtotal}`);

  // Delivery fee (only if corresponds)
  if (modality === 'envio' && deliveryFee > 0) {
    lines.push(`*Envío:* $ ${deliveryFee}`);
  }

  // Total
  lines.push(`*TOTAL:* $ ${total}`);

  // Observations (only if there are any)
  if (observations) {
    lines.push(`*Observaciones:* ${observations}`);
  }

  // Closing
  lines.push(`Gracias, quedo atento a la confirmación.`);

  return lines.join('\n');
};

export const generateWhatsAppUrl = (whatsappNumber: string, text: string): string => {
  const encodedText = encodeURIComponent(text);
  return `${WHATSAPP_URL_PREFIX}${whatsappNumber}?text=${encodedText}`;
};

export const validateWhatsAppUrlLength = (url: string): { valid: boolean; error?: string } => {
  const maxLength = 2000;
  if (url.length > maxLength) {
    return {
      valid: false,
      error: `El mensaje supera los ${maxLength} caracteres. Por favor, reducí la cantidad de productos o el texto de observaciones.`,
    };
  }
  return { valid: true };
};