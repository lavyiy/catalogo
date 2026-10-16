export const Footer = () => {
  return `
    <footer class="bg-gray-100 text-gray-600 py-6 mt-auto">
      <div class="max-width-1200px mx-auto px-4">
        <div class="grid grid-cols-1 grid-cols-sm-2 grid-cols-md-3 gap-4">
          <div>
            <h4 class="font-semibold mb-3">Catálogo</h4>
            <ul class="space-y-2">
              <li><a href="#inicio" class="hover:text-primary">Inicio</a></li>
              <li><a href="#productos" class="hover:text-primary">Productos</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-3">Comercio</h4>
            <ul class="space-y-2">
              <li><a href="#quienessomos" class="hover:text-primary">Quiénes somos</a></li>
              <li><a href="#contacto" class="hover:text-primary">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-3">Síguenos</h4>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-primary">Instagram</a></li>
              <li><a href="#" class="hover:text-primary">WhatsApp</a></li>
            </ul>
          </div>
        </div>
        <div class="mt-4 text-center fs-11 border-t border-gray-300 pt-4">
          © ${new Date().getFullYear()} Todos los derechos reservados
        </div>
      </div>
    </footer>
  `;
};