import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Nav from '@/components/nav'
import "./globals.css";
import SessionProviderWrapper from '@/utils/sessionProviderWrapper'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Serenade · Tutti più vicini",
  description: "Telemetria e smart caregiving",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProviderWrapper>
    <html lang="en">
      <body className={inter.className}>
        <Nav />
          {children}
      </body>
    </html>
    </SessionProviderWrapper>
  );
}
