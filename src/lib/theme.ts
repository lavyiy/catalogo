export const computeTextColor = (backgroundColor: string): 'light' | 'dark' => {
  // Parse RGB from various formats
  const rgb = backgroundColor
    .replace(/^#/, '')
    .match(/../g)
    ?.map((h) => parseInt(h, 16))
    : [0, 0, 0];

  if (!rgb) return 'light';

  const [r, g, b] = rgb.map((v) => v / 255);

  // Luminance according to WCAG (simplified)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance > 0.5 ? 'dark' : 'light';
};

export const generateThemeVariables = (theme: {
  primary: string;
  secondary: string;
  accent: string;
  radius: string;
}): string => {
  const textPrimary = computeTextColor(theme.primary) === 'light' ? '#000000' : '#FFFFFF';
  const textSecondary = computeTextColor(theme.secondary) === 'light' ? '#000000' : '#FFFFFF';
  const textAccent = computeTextColor(theme.accent) === 'light' ? '#000000' : '#FFFFFF';

  return `
    :root {
      --color-primary: ${theme.primary};
      --color-secondary: ${theme.secondary};
      --color-accent: ${theme.accent};
      --color-bg: ${theme.primary};
      --color-surface: ${theme.secondary};
      --color-text-primary: ${textPrimary};
      --color-text-secondary: ${textSecondary};
      --color-accent-text: ${textAccent};
      --radius: ${theme.radius};
    }
  `;
};