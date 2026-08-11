import { FloatingPathsBackground } from "@/components/ui/floating-paths";

/* Dois desvios em relação ao demo de origem, ambos necessários:

   1. `aspect-16/9` é sintaxe do Tailwind v4. Este projeto está no 3.4, onde a
      forma equivalente é `aspect-[16/9]`. Sem a troca a classe não gera regra
      alguma, o container fica sem altura e o fundo não aparece.

   2. `children` é obrigatório no tipo do componente, e o demo de origem vem
      vazio — não compila sob `strict`. O conteúdo abaixo também mostra o que
      o componente faz de fato: ele é um fundo, e o que importa é o que vem
      na frente dele. */
export default function FloatingPathsBackgroundExample() {
  return (
    <FloatingPathsBackground
      className="aspect-[16/9] flex items-center justify-center"
      position={-1}
    >
      <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
        <h2 className="text-4xl font-semibold tracking-tight">
          Floating Paths
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Trinta e seis curvas percorrendo o traçado em laço, atrás do conteúdo.
        </p>
      </div>
    </FloatingPathsBackground>
  );
}
