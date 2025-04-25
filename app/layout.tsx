import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/ui/navigation";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal Finance",
  description: "Personal finance management application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen bg-background">
            <Navigation />
            <main className="flex-1 overflow-x-hidden">
              <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
} 