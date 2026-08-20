"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimatedGradientBackgroundProps {
    className?: string;
    children?: React.ReactNode;
    intensity?: "subtle" | "medium" | "strong";
    /**
     * Hue range the beams fan across, `[start, spread]` in degrees.
     * Default `[190, 70]` is the upstream cyan → blue sweep.
     */
    hue?: [number, number];
    /** HSL saturation of the beams, in percent. Default `85`. */
    saturation?: number;
    /** HSL lightness of the beams, in percent. Default `65`. */
    lightness?: number;
}

interface Beam {
    x: number;
    y: number;
    width: number;
    length: number;
    angle: number;
    speed: number;
    opacity: number;
    hue: number;
    pulse: number;
    pulseSpeed: number;
}

const OPACITY_MAP = {
    subtle: 0.7,
    medium: 0.85,
    strong: 1,
} as const;

const MINIMUM_BEAMS = 20;

/** Device pixel ratio is capped: past 2x the blur costs more than it shows. */
const MAX_DPR = 2;

function createBeam(
    width: number,
    height: number,
    hueStart: number,
    hueSpread: number
): Beam {
    const angle = -35 + Math.random() * 10;
    return {
        x: Math.random() * width * 1.5 - width * 0.25,
        y: Math.random() * height * 1.5 - height * 0.25,
        width: 30 + Math.random() * 60,
        length: height * 2.5,
        angle: angle,
        speed: 0.6 + Math.random() * 1.2,
        opacity: 0.12 + Math.random() * 0.16,
        hue: hueStart + Math.random() * hueSpread,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
    };
}

export function BeamsBackground({
    className,
    children,
    intensity = "strong",
    hue = [190, 70],
    saturation = 85,
    lightness = 65,
}: AnimatedGradientBackgroundProps) {
    const hostRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const beamsRef = useRef<Beam[]>([]);
    const animationFrameRef = useRef<number>(0);
    const reduced = useReducedMotion();

    const [hueStart, hueSpread] = hue;

    useEffect(() => {
        const host = hostRef.current;
        const canvas = canvasRef.current;
        if (!host || !canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        /* Canvas coordinates are CSS pixels: the backing store is scaled by the
           device pixel ratio, and every measurement below stays in CSS space so
           beams land where they are drawn on a retina screen too. */
        let cssWidth = 0;
        let cssHeight = 0;

        const updateCanvasSize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
            const rect = host.getBoundingClientRect();
            cssWidth = Math.max(1, Math.round(rect.width));
            cssHeight = Math.max(1, Math.round(rect.height));

            canvas.width = cssWidth * dpr;
            canvas.height = cssHeight * dpr;
            canvas.style.width = `${cssWidth}px`;
            canvas.style.height = `${cssHeight}px`;
            /* Assigning width/height resets the context, so re-apply the scale. */
            ctx.scale(dpr, dpr);

            /* Beams are only seeded once. Re-seeding here would reshuffle the
               whole field on every resize event of a drag; instead they keep
               their positions and pick up the new size as each one recycles. */
            if (beamsRef.current.length === 0) {
                const totalBeams = Math.round(MINIMUM_BEAMS * 1.5);
                beamsRef.current = Array.from({ length: totalBeams }, () =>
                    createBeam(cssWidth, cssHeight, hueStart, hueSpread)
                );
            }
        };

        updateCanvasSize();

        const ro = new ResizeObserver(() => {
            updateCanvasSize();
            /* Assigning canvas.width wipes the bitmap. The animation loop
               repaints on the next frame, but the static reduced-motion frame
               has nothing to redraw it — so redraw it here. The observer also
               fires once on observe(), after the first paint below. */
            if (reduced) paint();
        });
        ro.observe(host);

        function resetBeam(beam: Beam, index: number, totalBeams: number) {
            const column = index % 3;
            const spacing = cssWidth / 3;

            beam.y = cssHeight + 100;
            beam.x =
                column * spacing +
                spacing / 2 +
                (Math.random() - 0.5) * spacing * 0.5;
            beam.length = cssHeight * 2.5;
            beam.width = 100 + Math.random() * 100;
            beam.speed = 0.5 + Math.random() * 0.4;
            beam.hue = hueStart + (index * hueSpread) / totalBeams;
            beam.opacity = 0.2 + Math.random() * 0.1;
            return beam;
        }

        function drawBeam(ctx: CanvasRenderingContext2D, beam: Beam) {
            ctx.save();
            ctx.translate(beam.x, beam.y);
            ctx.rotate((beam.angle * Math.PI) / 180);

            // Calculate pulsing opacity
            const pulsingOpacity =
                beam.opacity *
                (0.8 + Math.sin(beam.pulse) * 0.2) *
                OPACITY_MAP[intensity];

            const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
            const stop = (alpha: number) =>
                `hsla(${beam.hue}, ${saturation}%, ${lightness}%, ${alpha})`;

            // Enhanced gradient with multiple color stops
            gradient.addColorStop(0, stop(0));
            gradient.addColorStop(0.1, stop(pulsingOpacity * 0.5));
            gradient.addColorStop(0.4, stop(pulsingOpacity));
            gradient.addColorStop(0.6, stop(pulsingOpacity));
            gradient.addColorStop(0.9, stop(pulsingOpacity * 0.5));
            gradient.addColorStop(1, stop(0));

            ctx.fillStyle = gradient;
            ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
            ctx.restore();
        }

        /** Paints the current state of the field, without advancing it. */
        function paint() {
            if (!ctx) return;
            ctx.clearRect(0, 0, cssWidth, cssHeight);
            ctx.filter = "blur(35px)";
            beamsRef.current.forEach((beam) => drawBeam(ctx, beam));
        }

        /* Reduced motion: one static frame, no animation loop at all. */
        if (reduced) {
            paint();
            return () => ro.disconnect();
        }

        /* Per-frame work is parked while the tab is hidden or the background is
           scrolled out of view — a blurred full-bleed canvas is not cheap. */
        let onScreen = true;
        let running = false;

        function animate() {
            if (!ctx) return;

            const totalBeams = beamsRef.current.length;
            beamsRef.current.forEach((beam, index) => {
                beam.y -= beam.speed;
                beam.pulse += beam.pulseSpeed;

                // Reset beam when it goes off screen
                if (beam.y + beam.length < -100) {
                    resetBeam(beam, index, totalBeams);
                }
            });

            paint();
            animationFrameRef.current = requestAnimationFrame(animate);
        }

        const sync = () => {
            const shouldRun = onScreen && !document.hidden;
            if (shouldRun === running) return;
            running = shouldRun;
            if (shouldRun) {
                animate();
            } else {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };

        const io = new IntersectionObserver(
            (entries) => {
                onScreen = entries.some((e) => e.isIntersecting);
                sync();
            },
            { threshold: 0 }
        );
        io.observe(host);

        document.addEventListener("visibilitychange", sync);
        sync();

        return () => {
            ro.disconnect();
            io.disconnect();
            document.removeEventListener("visibilitychange", sync);
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, [intensity, hueStart, hueSpread, saturation, lightness, reduced]);

    return (
        <div
            ref={hostRef}
            className={cn(
                "relative min-h-screen w-full overflow-hidden bg-neutral-950",
                className
            )}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0"
                style={{ filter: "blur(15px)" }}
            />

            <motion.div
                className="absolute inset-0 bg-neutral-950/5"
                animate={reduced ? { opacity: 0.1 } : { opacity: [0.05, 0.15, 0.05] }}
                transition={
                    reduced
                        ? { duration: 0 }
                        : {
                              duration: 10,
                              ease: "easeInOut",
                              repeat: Number.POSITIVE_INFINITY,
                          }
                }
                style={{
                    backdropFilter: "blur(50px)",
                }}
            />

            {children ? <div className="relative z-10">{children}</div> : null}
        </div>
    );
}
