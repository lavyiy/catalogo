export const normalizeSearchText = (text: string): string => {
  if (!text) return '';
  // Remover acentos usando normalize con NFD (Normalization Form Division)
  const acentos = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
    'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
    'ñ': 'n', 'Ñ': 'N',
  };
  let normalized = text.normalize('NFD');
  for (const [acento, replacement] of Object.entries(acentos)) {
    normalized = normalized.replace(new RegExp(acento, 'g'), replacement);
  }
  // Convertir a minúsculas y remover caracteres que no sean a-z o 0-9
  normalized = normalized
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  return normalized;
};

export const matchesSearch = (productName: string, searchTerm: string): boolean => {
  const normalizedName = normalizeSearchText(productName);
  const normalizedTerm = normalizeSearchText(searchTerm);
  return normalizedName.includes(normalizedTerm);
};