import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Benevia",
  description: "Join and organize social service events in your community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}