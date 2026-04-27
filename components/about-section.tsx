import Image from "next/image";
import { Shield, Repeat2, Star, MapPin } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Vehículos verificados",
    desc: "Cada auto pasa por una revisión técnica completa antes de estar en el catálogo. Sin sorpresas.",
  },
  {
    icon: Repeat2,
    title: "Tomamos tu usado",
    desc: "Aceptamos tu vehículo como parte de pago. Tasamos en el momento y sin vueltas.",
  },
  {
    icon: Star,
    title: "5 estrellas en Google",
    desc: "Más de 13 reseñas con calificación perfecta. La confianza de nuestros clientes nos respalda.",
  },
  {
    icon: MapPin,
    title: "En Quilmes desde 2014",
    desc: "10+ años atendiendo el sur del Gran Buenos Aires con la misma pasión y dedicación.",
  },
];

export default function AboutSection() {
  return (
    <section id="nosotros" className="py-20 sm:py-28 bg-white border-t border-gray-100 scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Texto */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-3">Quiénes somos</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6">
              Más de 10 años<br />
              vendiendo con confianza
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              MS Motors nació en Quilmes con una sola misión: hacer que comprar un auto usado sea una experiencia segura, transparente y sin complicaciones. Hoy somos referentes en el sur del Gran Buenos Aires.
            </p>
            <p className="text-gray-500 leading-relaxed mb-10">
              Trabajamos con vehículos seleccionados, documentación en orden y precios reales. Nada de sorpresas.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
              {[
                { value: "200+", label: "Autos vendidos" },
                { value: "5.0★", label: "En Google" },
                { value: "10+", label: "Años de trayectoria" },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cards de valores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="group flex flex-col gap-3 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 group-hover:bg-red-100 transition-colors">
                  <Icon className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}