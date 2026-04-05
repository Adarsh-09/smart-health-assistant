import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Activity, Heart, User, Settings } from 'lucide-react'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: 'Smart Health Assistant | AI-Powered Wellness',
  description: 'Real-time health monitoring dashboard with heart rate, steps, sleep tracking, and AI-powered insights',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${robotoMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full glass">
              <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary glow">
                    <Activity className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold tracking-tight">
                    Health<span className="text-primary">AI</span>
                  </span>
                </div>
                
                <nav className="hidden md:flex items-center gap-6">
                  <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Overview</a>
                  <a href="#stats" className="text-sm font-medium hover:text-primary transition-colors">Statistics</a>
                  <a href="#insights" className="text-sm font-medium hover:text-primary transition-colors">Insights</a>
                </nav>

                <div className="flex items-center gap-4">
                  <button className="rounded-full p-2 hover:bg-accent transition-colors">
                    <Settings className="h-5 w-5" />
                  </button>
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center border border-border overflow-hidden">
                    <User className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </header>
            
            <main className="flex-1">{children}</main>
            
            <footer className="border-t py-6 md:py-0">
              <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  Built by HealthAI © 2026. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
