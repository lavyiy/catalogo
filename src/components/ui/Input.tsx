export const Input = ({ type = 'text', name, value, onChange, placeholder, disabled }: {
  type?: 'text' | 'email' | 'password' | 'number';
  name: string;
  value: string;
  onChange: (e: any) => void;
  placeholder: string;
  disabled?: boolean;
}) => {
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return `<input
    type="${type}"
    name="${name}"
    value="${value}"
    onchange="${onChange.toString()}"
    placeholder="${placeholder}"
    class="w-full rounded-xl border border-gray-300 px-3 py-2 focus-visible:ring-primary focus-visible:ring-2 ${disabledClass}"
    ${disabled ? 'disabled' : ''}
  />`;
};