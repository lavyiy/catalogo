import { useToastContext } from '../../context';
import { generateWhatsAppMessage, generateWhatsAppUrl, validateWhatsAppUrlLength } from '../../lib/whatsapp';

export const CheckoutForm = ({ store, onSubmit }: { store: any; onSubmit: (values: any) => void }) => {
  const { setToast } = useToastContext();
  const [formValues, setFormValues] = useState({
    customer_name: '',
    modality: 'retiro',
    address: '',
    payment_method: '',
    observations: '',
  });

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formValues.customer_name) {
      setToast('Ingresá tu nombre', 'error');
      return;
    }

    // Preparar items para el mensaje
    const cartItems = // obtener del contexto
    const items = cartItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const deliveryFee = store.accepts_delivery && formValues.modality === 'envio' ? store.delivery_fee : 0;
    const total = subtotal + deliveryFee;

    const message = generateWhatsAppMessage({
      storeName: store.name,
      customerName: formValues.customer_name,
      modality: formValues.modality,
      address: formValues.modality === 'envio' ? formValues.address : undefined,
      paymentMethod: formValues.payment_method || undefined,
      observations: formValues.observations || undefined,
      items,
      subtotal,
      deliveryFee,
      total,
    });

    const whatsappNumber = store.whatsapp_number;
    const url = generateWhatsAppUrl(whatsappNumber, message);

    const validation = validateWhatsAppUrlLength(url);

    if (!validation.valid) {
      setToast(validation.error || 'Mensaje demasiado largo', 'error');
      return;
    }

    // Ejecutar callback de submit
    onSubmit({
      ...formValues,
      items,
      subtotal,
      deliveryFee,
      total,
      whatsappUrl: url,
    });
  };

  return `
    <div class="checkout-modal max-w-full max-h-80 rounded-xl bg-white shadow-2 overflow-auto">
      <div class="p-4 border-b border-primary">
        <h2 class="font-bold text-primary mb-2">Checkout</h2>
        <button class="absolute top-2 right-2 rounded-xl bg-gray-200 text-gray-600 p-1" onclick="closeCheckout()"
                aria-label="Cerrar checkout">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="18" x2="18" y2="6"></line>
          </svg>
        </button>

        <form class="space-y-4">
          <div>
            <label class="block fs-13 text-secondary mb-1">Nombre del cliente</label>
            <input
              type="text"
              name="customer_name"
              value="${formValues.customer_name}"
              oninput="handleInput(event)"
              required
              class="w-full rounded-xl border border-gray-300 px-3 py-2 focus-visible:ring-primary focus-visible:ring-2"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label class="block fs-13 text-secondary mb-1">Modalidad</label>
            <div class="flex gap-4">
              <label class="flex-1 fs-11">
                <input
                  type="radio"
                  name="modality"
                  value="retiro"
                  checked="${formValues.modality === 'retiro'}"
                  oninput="handleInput(event)"
                  class="rounded-inner bg-primary"
                />
                Retiro en local
              </label>
              ${store.accepts_delivery ? `
                <label class="flex-1 fs-11">
                  <input
                    type="radio"
                    name="modality"
                    value="envio"
                    checked="${formValues.modality === 'envio'}"
                    oninput="handleInput(event)"
                    class="rounded-inner bg-primary"
                  />
                  Envío a domicilio
                </label>
              ` : ''}
            </div>
          </div>

          ${store.accepts_delivery ? `
          <div id="address-field">
            <label class="block fs-13 text-secondary mb-1">Dirección (solo para envío)</label>
            <input
              type="text"
              name="address"
              value="${formValues.address}"
              oninput="handleInput(event)"
              class="w-full rounded-xl border border-gray-300 px-3 py-2 focus-visible:ring-primary focus-visible:ring-2"
              placeholder="Dirección de entrega"
              ${formValues.modality !== 'envio' ? 'disabled' : ''}
            />
          </div>
          ` : ''}

          <div>
            <label class="block fs-13 text-secondary mb-1">Observaciones (opcional)</label>
            <textarea
              name="observations"
              value="${formValues.observations || ''}"
              oninput="handleInput(event)"
              class="w-full rounded-xl border border-gray-300 px-3 py-2 focus-visible:ring-primary focus-visible:ring-2 py-3 min-h-24"
              placeholder="Ej: Dejá la mercadería en la puerta"
            ></textarea>
          </div>

          ${store.payment_methods && store.payment_methods.length > 0 ? `
          <div>
            <label class="block fs-13 text-secondary mb-1">Medio de pago</label>
            <select
              name="payment_method"
              oninput="handleInput(event)"
              class="w-full rounded-xl border border-gray-300 px-3 py-2 focus-visible:ring-primary focus-visible:ring-2 py-3"
            >
              <option value="">Seleccioná...</option>
              ${store.payment_methods.map((m: string) => `<option value="${m}">${m}</option>`).join('')}
            </select>
          </div>
          ` : ''}

          <div class="mt-4">
            <span class="font-semibold">Subtotal: $ ${subtotal}</span>
            ${store.accepts_delivery && formValues.modality === 'envio' ? `
            <span class="text-secondary ml-2">Envío: $ ${store.delivery_fee}</span>
            ` : ''}
            <span class="font-semibold text-primary ml-2">Total: $ ${subtotal + (store.accepts_delivery && formValues.modality === 'envio' ? store.delivery_fee : 0)}</span>
          </div>
        </div>

        <div class="p-4 border-t border-primary mt-4">
          <button
            type="submit"
            onclick="handleSubmit()"
            class="w-full px-4 py-2 bg-primary text-primary-text fs-13 rounded-r-8"
          >
            Generar pedido de WhatsApp
          </button>
        </div>
      </div>
    </div>

    <script>
      function closeCheckout() {
        const modal = document.querySelector('.checkout-modal');
        if (modal) {
          modal.style.display = 'none';
        }
      }

      // Validar monto mínimo
      const minOrder = ${store.min_order || 0};
      const total = ${subtotal + (store.accepts_delivery && formValues.modality === 'envio' ? store.delivery_fee : 0)};
      if (minOrder > 0 && total < minOrder) {
        alert(`El monto mínimo del pedido es $ ${min_order}`);
      }

      // Cerrar modal al hacer Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeCheckout();
        }
      });
    </script>
  `;
};