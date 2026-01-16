import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Repeat, HeadphonesIcon } from "lucide-react"

const features = [
  {
    icon: ShieldCheck,
    title: "Vehículos seleccionados",
    description: "Autos verificados, en excelente estado y listos para transferir.",
  },
  {
    icon: Repeat,
    title: "Tomamos tu usado",
    description: "Aceptamos permutas como parte de pago.",
  },
  {
    icon: HeadphonesIcon,
    title: "Atención Premium",
    description: "Servicio personalizado antes, durante y después de la compra.",
  },
]

export function Features() {
  return (
    <section id="nosotros" className="border-b border-border bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="font-body mb-2 text-sm uppercase tracking-widest text-muted-foreground">¿Por qué elegirnos?</p>
          <h2 className="font-title text-3xl md:text-4xl">Nuestros beneficios</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group border-border bg-card transition-all hover:border-foreground/20 hover:shadow-lg"
            >
              <CardContent className="p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-foreground">
                  <feature.icon className="h-6 w-6 text-foreground transition-colors group-hover:text-background" />
                </div>
                <h3 className="font-title mb-3 text-xl">{feature.title}</h3>
                <p className="font-body text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
