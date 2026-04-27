import type { Metadata } from "next";
import { Nunito, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Gingerbros · Real ginger, made by hand",
  description: "Small-batch Thai ginger beer, ale, and shots. Pressed, mixed, and bottled by hand in Bangkok.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://gingerbrosshop.com"),
  openGraph: {
    title: "Gingerbros — Thai craft ginger beverages",
    description: "Pressed, mixed, and bottled by hand in Bangkok.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${nunito.variable} ${playfair.variable}`}>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
