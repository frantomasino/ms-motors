import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section className="relative">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 mix-blend-multiply" />

      <div
        className="relative h-[70vh] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: "url('/banner-imagen.jpg')",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Encuentra tu vehículo ideal
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Compra segura, personalizada y atención premium para
              todos nuestros clientes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#catalog" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                >
                  Ver catálogo
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <a
                href="https://wa.me/5491159456142"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="text-black border-white hover:bg-white/10 w-full sm:w-auto"
                >
                  <FaWhatsapp className="h-4 w-4 mr-2" />
                  Contacto
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-cover bg-center py-12">
        {/* Capa blanca semitransparente para contraste */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

        {/* Contenido encima del fondo */}
        <div className="relative container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Compra Segura</h3>
              <p className="text-gray-800">
                Todos nuestros vehículos están verificados y con garantía.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                 Tomamos tu usado
              </h3>
              <p className="text-gray-800">
                Aceptamos permutas como parte de pago.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Atención Premium</h3>
              <p className="text-gray-800">
                Servicio personalizado antes, durante y después de la compra.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
