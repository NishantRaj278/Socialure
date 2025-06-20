import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import {Toaster} from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Socialure",
  description: "A social media app created by Nishant Raj generated using Next.js, Prisma, PostgreSQL and Clerk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ClerkProvider>
              <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange>
                <div className="min-h-screen">
                  <Navbar />
                  <main className="py-8">
                    <div className="max-w-7xl mx-auto px-4">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="hidden lg:block lg:col-span-3">
                            <SideBar />
                        </div>
                        <div className="lg:col-span-9">
                          {children}
                        </div>
                      </div>
                    </div>
                  </main>
                </div>
                <Toaster />
              </ThemeProvider>
            </ClerkProvider>
        </body>
      </html>
    
  );
}
