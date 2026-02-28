"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Navbar() {
    const { scrollY } = useScroll();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Map scroll value to background opacity and blur (Apple style nav fade)
    const bgOpacity = useTransform(scrollY, [0, 50], [0, 0.75]);
    const blurValue = useTransform(scrollY, [0, 50], [0, 12]);
    const borderOpacity = useTransform(scrollY, [0, 50], [0, 0.05]);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-14"
            style={{
                backgroundColor: mounted ? `rgba(5, 5, 5, ${bgOpacity.get()})` : "transparent",
                backdropFilter: mounted ? `blur(${blurValue.get()}px)` : "none",
                borderBottom: mounted ? `1px solid rgba(255, 255, 255, ${borderOpacity.get()})` : "none",
            }}
        >
            <div className="flex-1 flex items-center justify-start">
                <Link href="/" className="text-white/90 text-sm font-semibold tracking-wide">
                    WH‑1000XM6
                </Link>
            </div>

            <nav className="hidden md:flex flex-1 items-center justify-center space-x-8">
                {["Overview", "Technology", "Noise Cancelling", "Specs"].map((item) => (
                    <Link
                        key={item}
                        href={`#${item.toLowerCase().replace(" ", "-")}`}
                        className="text-white/60 text-xs font-medium tracking-wide hover:text-white transition-colors duration-300"
                    >
                        {item}
                    </Link>
                ))}
            </nav>

            <div className="flex-1 flex items-center justify-end">
                <button className="button-gradient-border px-4 py-1.5 rounded-full text-xs font-semibold text-white hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(0,214,255,0.15)]">
                    Experience WH‑1000XM6
                </button>
            </div>
        </motion.header>
    );
}
