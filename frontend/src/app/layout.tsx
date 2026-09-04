import type { Metadata } from "next";
import { Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/lib/LanguageContext";
import { ThemeProvider } from "@/lib/ThemeContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoUrdu = Noto_Nastaliq_Urdu({
  variable: "--font-urdu",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SafePay AI — AI-Powered Fraud Protection for Digital Payments in Pakistan",
  description:
    "SafePay AI is an AI-powered fraud awareness tool for digital payments in Pakistan. Analyze suspicious receipts, messages, and voice recordings for fraud indicators. Bilingual English/Urdu support.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${notoUrdu.variable} h-full`} suppressHydrationWarning>
      <head>
        {/* FOUC prevention: apply saved theme before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("safepai-theme");if(t==="dark"){document.documentElement.setAttribute("data-theme","dark");document.documentElement.classList.add("dark")}}catch(e){}})()`,
          }}
        />
        {/* Persist selected language across sessions (dir is handled per-container, not globally) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=localStorage.getItem("safepai-language");if(l==="ur"){document.documentElement.setAttribute("lang","ur")}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
