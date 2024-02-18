import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PME System",
  description: "Sistema de gestão da Polícia PME - Habbo Hotel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
    <body className={inter.className}>
      <ToastContainer theme={"dark"}/>
      {children}
      <script src="https://unpkg.com/ionicons@4.5.10-0/dist/ionicons.js"></script>
    </body>
    </html>
  );
}
