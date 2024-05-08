import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "../providers";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FastPay",
  description: "Generate payment links and receive payments in minutes!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <main className="pancake">
            <Navbar />
            <div className="px py-8 lg:py-8 lg:px-4 w-full lg:max-w-6xl mx-auto">
              <Toaster />
              {children}
            </div>
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
