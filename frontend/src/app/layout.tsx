import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Nav from '@/components/nav'
import "./globals.css";
import AuthStatus from "../components/authStatus"
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
        <div className="flex flex-row">
          <div className="w-4/5 h-screen">{children}</div>
          <div className="w-1/5 p-3 h-screen">
            <h2 className="text-3xl">frontend</h2>
              <AuthStatus />
            <hr />
              <Nav />
            </div>
        </div>
      </body>
    </html>
    </SessionProviderWrapper>
  );
}
