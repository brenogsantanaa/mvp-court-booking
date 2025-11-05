import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MVP - Court Booking",
  description: "Book sports courts in São Paulo and Rio de Janeiro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}

