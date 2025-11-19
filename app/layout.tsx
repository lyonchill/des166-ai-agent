import type { Metadata } from "next";
import { Manrope, DM_Sans, Averia_Serif_Libre } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
});

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

const averiaSerif = Averia_Serif_Libre({ 
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  variable: "--font-averia-serif",
});

export const metadata: Metadata = {
  title: "DES166 AI Assistant",
  description: "AI-powered FAQ assistant for UW DES166 course",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${dmSans.variable} ${averiaSerif.variable} ${manrope.className}`}>
        {children}
      </body>
    </html>
  );
}
