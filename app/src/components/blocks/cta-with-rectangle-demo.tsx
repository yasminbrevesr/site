import { CTASection } from "@/components/blocks/cta-with-rectangle"

export function CTADemo() {
  return (
    <CTASection
      badge={{
        text: "Próximo passo",
      }}
      title="Tecnologia sob medida para crescer com clareza."
      description="Conte onde a tecnologia ainda trava o seu negócio. A primeira conversa serve para entender o cenário antes de propor qualquer caminho."
      action={{
        text: "Falar com a BREVES",
        href: "#contato",
        variant: "glow",
      }}
    />
  )
}
