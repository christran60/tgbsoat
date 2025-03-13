import type { Metadata } from "next";
import { Geist, Geist_Mono, Domine } from "next/font/google";
import "./globals.css";

const domine = Domine({
  variable: "--font-domine",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "tgbsoat",
  description: "the greatest bill splitter of all time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${domine.variable} antialiased`}>{children}</body>
    </html>
  );
}
