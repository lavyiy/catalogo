export const Button = ({ children, variant = 'primary', size = 'default', onClick, disabled }: {
  children: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'small' | 'large';
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const variantStyles = {
    primary: 'bg-primary text-primary-text',
    secondary: 'bg-secondary text-primary-text',
    ghost: 'bg-transparent text-primary underline',
  };

  const sizeStyles = {
    default: 'px-4 py-2',
    small: 'px-3 py-1 text-sm',
    large: 'px-5 py-3',
  };

  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return `<button class="rounded-r-8 ${variantStyles[variant]} ${sizeStyles[size]} ${disabledClass}" ${onClick ? 'onclick="${onClick}"' : ''} ${disabled ? 'disabled' : ''}>${children}</button>`;
};