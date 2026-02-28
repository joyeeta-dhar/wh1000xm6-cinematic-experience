"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

const TOTAL_FRAMES = 240;

export default function StorytellingExperience() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Track scroll position of the container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    // Preload images
    useEffect(() => {
        let imagesLoaded = 0;
        const imgArray: HTMLImageElement[] = [];
        for (let i = 1; i <= TOTAL_FRAMES; i++) {
            const img = new Image();
            const num = String(i).padStart(3, '0');
            img.src = `/sequence/ezgif-frame-${num}.jpg`;
            img.onload = () => {
                imagesLoaded++;
                setLoadingProgress(imagesLoaded / TOTAL_FRAMES);
                if (imagesLoaded === TOTAL_FRAMES) {
                    setLoaded(true);
                }
            };
            imgArray.push(img);
        }
        setImages(imgArray);
    }, []);

    // Update canvas
    useEffect(() => {
        if (!loaded || !canvasRef.current || images.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        const renderFrame = (progress: number) => {
            // Scale progress to frame index
            const frameIndex = Math.min(
                Math.floor(progress * TOTAL_FRAMES),
                TOTAL_FRAMES - 1
            );

            const img = images[frameIndex];
            if (!img) return;

            // Handle high DPI displays
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();

            if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                ctx.scale(dpr, dpr);
            }

            // Draw background correctly so edges blend
            ctx.fillStyle = "#050505";
            ctx.fillRect(0, 0, rect.width, rect.height);

            // Object-fit: cover alternative logic to preserve aspect ratio
            const imgRatio = img.width / img.height;
            const canvasRatio = rect.width / rect.height;
            let drawWidth = rect.width;
            let drawHeight = rect.height;
            let offsetX = 0;
            let offsetY = 0;

            // For a headphone, we might want "contain" so it never gets cut off, or scale it
            // Let's use a scale-to-fit logic like 'contain' or 'cover' depending on preference.
            // Usually product showcases use contain or similar so product is fully visible.
            // We will do "contain":
            if (canvasRatio > imgRatio) {
                // canvas is wider than image
                drawWidth = rect.height * imgRatio;
                offsetX = (rect.width - drawWidth) / 2;
            } else {
                // canvas is taller than image
                drawHeight = rect.width / imgRatio;
                offsetY = (rect.height - drawHeight) / 2;
            }

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        // Listen to Framer Motion scroll changes
        const unsubscribe = scrollYProgress.on("change", (v) => {
            renderFrame(v);
        });

        // Initial render
        renderFrame(scrollYProgress.get());

        return () => unsubscribe();
    }, [loaded, images, scrollYProgress]);

    // Framer Motion mappings for sections
    // 1. HERO (0-15%)
    const heroOpacity = useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);

    // 2. ENGINEERING (15-40%)
    const engOpacity = useTransform(scrollYProgress, [0.15, 0.25, 0.35, 0.40], [0, 1, 1, 0]);
    const engX = useTransform(scrollYProgress, [0.15, 0.25, 0.35, 0.40], [-50, 0, 0, -50]);

    // 3. NOISE CANCELLING (40-65%)
    const ncOpacity = useTransform(scrollYProgress, [0.4, 0.5, 0.6, 0.65], [0, 1, 1, 0]);
    const ncX = useTransform(scrollYProgress, [0.4, 0.5, 0.6, 0.65], [50, 0, 0, 50]);

    // 4. SOUND (65-85%)
    const soundOpacity = useTransform(scrollYProgress, [0.65, 0.75, 0.8, 0.85], [0, 1, 1, 0]);
    const soundScale = useTransform(scrollYProgress, [0.65, 0.75, 0.8, 0.85], [0.9, 1, 1, 0.9]);

    // 5. REASSEMBLY & CTA (85-100%)
    const ctaOpacity = useTransform(scrollYProgress, [0.85, 0.95, 1], [0, 1, 1]);
    const ctaY = useTransform(scrollYProgress, [0.85, 0.95], [50, 0]);

    return (
        <div ref={containerRef} className="relative h-[800vh] bg-black">
            {/* Loading Overlay */}
            {!loaded && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-white">
                    <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden mb-4">
                        <div
                            className="h-full bg-gradient-to-r from-[#0050FF] to-[#00D6FF] transition-all duration-300"
                            style={{ width: `${loadingProgress * 100}%` }}
                        />
                    </div>
                    <p className="text-white/60 tracking-[0.3em] text-xs font-semibold uppercase">
                        Loading Cinematic Sequence {Math.round(loadingProgress * 100)}%
                    </p>
                </div>
            )}

            {/* Sticky Canvas and UI Container */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-cover"
                />

                {/* Ambient background glows */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] bg-[#0050FF]/10 rounded-full blur-[100px] z-[0]" />

                {/* --- SCROLL SECTIONS --- */}
                <div className="absolute inset-0 z-10 pointer-events-none p-10 flex text-center xl:text-left items-center justify-center">

                    {/* Section 1: HERO */}
                    <motion.div
                        style={{ opacity: heroOpacity, y: heroY }}
                        className="absolute flex flex-col items-center justify-center -translate-y-[20vh]"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4">
                            Sony WH‑1000XM6
                        </h1>
                        <p className="text-xl md:text-3xl text-gradient-cyan font-medium mb-3">
                            Silence, perfected.
                        </p>
                        <p className="text-white/60 text-sm md:text-base max-w-lg">
                            Flagship wireless noise cancelling, <br />
                            re‑engineered for a world that never stops.
                        </p>
                    </motion.div>

                    {/* Section 2: ENGINEERING REVEAL */}
                    <motion.div
                        style={{ opacity: engOpacity, x: engX }}
                        className="absolute left-[5%] md:left-[10%] w-full max-w-sm flex items-start justify-center flex-col xl:items-start"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Precision-engineered <br /><span className="text-gradient-cyan">for silence.</span>
                        </h2>
                        <div className="space-y-4 text-white/60 text-base leading-relaxed">
                            <p>Custom drivers, sealed acoustic chambers, and optimized airflow deliver studio-grade clarity.</p>
                            <p>Every component is tuned for balance, power, and comfort—hour after hour.</p>
                        </div>
                    </motion.div>

                    {/* Section 3: NOISE CANCELLING */}
                    <motion.div
                        style={{ opacity: ncOpacity, x: ncX }}
                        className="absolute right-[5%] md:right-[10%] w-full max-w-sm flex flex-col xl:items-end items-center text-center xl:text-right"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Adaptive noise <br />cancelling, <span className="text-[#0050FF]">redefined.</span>
                        </h2>
                        <ul className="space-y-4 text-white/60 text-base leading-relaxed list-none">
                            <li>Multi-microphone array listens in every direction.</li>
                            <li>Real-time noise analysis adapts to your environment.</li>
                            <li>Your music stays pure—planes, trains, and crowds fade away.</li>
                        </ul>
                    </motion.div>

                    {/* Section 4: SOUND & UPSCALING */}
                    <motion.div
                        style={{ opacity: soundOpacity, scale: soundScale }}
                        className="absolute bottom-[10%] flex flex-col items-center text-center max-w-2xl px-6"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-gradient-cyan mb-6">
                            Immersive, lifelike sound.
                        </h2>
                        <div className="space-y-4 text-white/60 text-base md:text-lg leading-relaxed">
                            <p>High-performance drivers unlock detail, depth, and texture in every track.</p>
                            <p>AI-enhanced upscaling restores clarity to compressed audio, so every note feels alive.</p>
                        </div>
                    </motion.div>

                    {/* Section 5: REASSEMBLY & CTA */}
                    <motion.div
                        style={{ opacity: ctaOpacity, y: ctaY }}
                        className="absolute bottom-[15%] md:bottom-[20%] flex flex-col items-center justify-center text-center max-w-2xl z-20 pointer-events-auto"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 drop-shadow-xl">
                            Hear everything. <br />Feel nothing else.
                        </h2>
                        <p className="text-xl md:text-2xl text-white/80 mb-8 font-light">
                            WH‑1000XM6. Designed for focus, crafted for comfort.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <button className="button-gradient-border px-8 py-4 rounded-full text-sm font-semibold text-white hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(0,80,255,0.4)]">
                                Experience WH‑1000XM6
                            </button>
                            <a href="#" className="text-white/60 hover:text-white transition-colors underline underline-offset-4 text-sm font-medium">
                                See full specs
                            </a>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
