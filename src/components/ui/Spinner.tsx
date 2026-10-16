export const Spinner = ({ size = 'medium }: { size?: 'small' | 'medium' | 'large' }) => {
  const sizeStyles = {
    small: 'height-20 width-20',
    medium: 'height-32 width-32',
    large: 'height-48 width-48',
  };

  return `
    <div class="spinner ${sizeStyles[size]} rounded-full border-4 border-primary border-t-transparent spinning animate-spin" aria-busy="true"></div>

    <script>
      // Animation already handled by CSS classes
    </script>
  `;
};