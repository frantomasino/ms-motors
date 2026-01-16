import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-foreground text-background">
      <div className="absolute inset-0 bg-[url('/banner-2.jpg')] bg-cover bg-center opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />

<div className="container relative mx-auto px-6 sm:px-10 lg:px-16 py-24 md:py-32 lg:py-40">
        <div className="max-w-3xl">
          <p className="font-body mb-4 text-sm uppercase tracking-widest text-background/70">
            MS Motors Argentina
          </p>

          <h1 className="font-title mb-6 text-4xl leading-tight md:text-5xl lg:text-6xl">
            Encuentra tu vehículo ideal
          </h1>

          <p className="font-body mb-8 max-w-xl text-lg text-background/80 md:text-xl">
            Compra segura, personalizada y atención premium para todos nuestros clientes.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a href="#catalog">
              <Button
                size="lg"
                className="font-body gap-2 rounded-full bg-background text-foreground hover:bg-background/90"
              >
                Ver catálogo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>

            <a
              href="https://wa.me/5491159456142"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="font-body gap-2 rounded-full border-background/40 bg-transparent text-background hover:bg-background hover:text-foreground"
>
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
