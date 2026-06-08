import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/app/components/LanguageContext";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReflectIQ — Advanced Self-Monitoring System",
  description: "Real-time personal development tracker with OAA scoring",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={`${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#050508]">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
