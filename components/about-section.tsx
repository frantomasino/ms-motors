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
    title: "En Quilmes desde 2021",
    desc: "5+ años atendiendo el sur del Gran Buenos Aires con la misma pasión y dedicación.",
  },
];

export default function AboutSection() {
  return (
    <section id="nosotros" className="py-12 sm:py-20 lg:py-28 bg-white border-t border-gray-100 scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">

          {/* Texto */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-3">Quiénes somos</p>
            <h2 className="text-2xl sm:text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
              Más de 5 años<br />vendiendo con confianza
            </h2>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-3 sm:mb-6">
              MS Motors nació en Quilmes con una sola misión: hacer que comprar un auto usado sea una experiencia segura, transparente y sin complicaciones. Hoy somos referentes en el sur del Gran Buenos Aires.
            </p>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-8 sm:mb-10">
              Trabajamos con vehículos seleccionados, documentación en orden y precios reales. Nada de sorpresas.
            </p>

            {/* Stats — más espacio entre items en mobile */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 sm:pt-8 border-t border-gray-100">
              {[
                { value: "100+", label: "Autos vendidos" },
                { value: "5.0★", label: "En Google" },
                { value: "5+",   label: "Años" },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cards — 2 columnas desde mobile */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="group flex flex-col gap-2 sm:gap-3 p-4 sm:p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-red-50 group-hover:bg-red-100 transition-colors">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">{title}</h3>
                <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed hidden sm:block">{desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}