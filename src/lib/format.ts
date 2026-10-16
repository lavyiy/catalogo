export const formatARS = (value: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(value).replace(/^£?/, '');
};

export const formatPrice = (price: number | null | undefined, withSymbol: boolean = true): string => {
  if (price === null || price === undefined) return '$ 0';
  const formatted = new Intl.NumberFormat('es-AR', {
    style: 'decimal',
    currency: 'ARS',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(price);
  return withSymbol ? ` $ ${formatted}` : formatted;
};

export const formatOfferPrice = (price: number, offerPrice: number | null): string => {
  if (offerPrice !== null && offerPrice < price) {
    return formatPrice(offerPrice, false) + ' (oferta)';
  }
  return formatPrice(price);
};

export const formatStock = (stock: number | null): string => {
  if (stock === null) return 'Sin control';
  if (stock === 0) return 'Agotado';
  return stock > 1 ? `${stock} unidades` : 'Única unidad';
};