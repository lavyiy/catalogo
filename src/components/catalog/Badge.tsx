export const Badge = ({ text, variant }: { text: string; variant: 'offer' | 'stock' | 'info' }) => {
  const variants = {
    offer: 'bg-accent text-primary-text',
    stock: 'bg-red-500 text-white',
    info: 'bg-primary text-primary-text',
  };

  return `
    <span class="inline-flex items-center rounded-full px-2 py-1 text-${variant}-fs-9 ${variants[variant]}">
      ${text}
    </span>
  `;
};