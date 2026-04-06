import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Activity, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProfileSheet } from '@/components/dashboard/profile-sheet'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: 'Aarogya- Mitra | AI-Powered Wellness',
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
                    Aarogya-<span className="text-primary"> Mitra</span>
                  </span>
                </div>
                
                <nav className="hidden md:flex items-center gap-6">
                  <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Overview</a>
                  <a href="#stats" className="text-sm font-medium hover:text-primary transition-colors">Statistics</a>
                  <a href="#insights" className="text-sm font-medium hover:text-primary transition-colors">Insights</a>
                </nav>

                <div className="flex items-center gap-4">
                  <ProfileSheet>
                    <Button variant="ghost" size="sm" className="rounded-full gap-2 px-4 hover:bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                      <span className="hidden sm:inline font-semibold">Profile</span>
                    </Button>
                  </ProfileSheet>
                </div>
              </div>
            </header>
            
            <main className="flex-1">{children}</main>
            
            <footer className="border-t py-6 md:py-0">
              <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  Built by Aarogya- Mitra © 2026. All rights reserved.
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
