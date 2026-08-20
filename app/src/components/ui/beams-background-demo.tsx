import { motion } from "motion/react";
import { BeamsBackground } from "@/components/ui/beams-background";

/** Upstream look: cyan → blue beams over near-black. */
export function BeamsBackgroundDemo() {
    return (
        <BeamsBackground>
            <div className="flex min-h-screen w-full items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-6 px-4 text-center">
                    <motion.h1
                        className="text-6xl md:text-7xl lg:text-8xl font-semibold text-white tracking-tighter"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Beams
                        <br />
                        Background
                    </motion.h1>
                    <motion.p
                        className="text-lg md:text-2xl lg:text-3xl text-white/70 tracking-tighter"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        For your pleasure
                    </motion.p>
                </div>
            </div>
        </BeamsBackground>
    );
}

/**
 * The same component tuned to the BREVES palette — slate-blue through violet
 * (#151b26 → #2c2739 → #3d3750) over #131313, at the saturation those colours
 * actually have. Sized as a page hero rather than a full viewport.
 */
export function BeamsBackgroundBreves() {
    return (
        <BeamsBackground
            className="min-h-[560px] bg-[#131313]"
            intensity="strong"
            hue={[214, 52]}
            saturation={38}
            lightness={72}
        >
            <div className="mx-auto flex min-h-[560px] max-w-container flex-col justify-center px-6 py-24 md:px-12">
                <p className="text-xs uppercase tracking-[0.2em] text-[#d9d9d9]">
                    Tecnologia · Dados · Automação
                </p>
                <h2 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-[#aeb6c1] md:text-5xl">
                    Tecnologia,{" "}
                    <span className="text-white">automação</span> e{" "}
                    <span className="text-white">inteligência artificial</span>{" "}
                    para a sua empresa crescer sem{" "}
                    <span className="text-white">processos manuais</span>
                </h2>
                <p className="mt-6 max-w-xl text-base text-white/70">
                    Mesmo componente, mesma animação — só a faixa de matiz, a
                    saturação e a luminosidade trocadas pelas da paleta.
                </p>
            </div>
        </BeamsBackground>
    );
}

export default BeamsBackgroundDemo;
