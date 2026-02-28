import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Sony WH-1000XM6",
  description: "Apple-level cinematic scrollytelling for Sony WH-1000XM6 headphones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} style={{ scrollBehavior: 'smooth' }}>
      <body className="bg-[#050505] text-white overflow-x-hidden selection:bg-[#00D6FF] selection:text-black">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
