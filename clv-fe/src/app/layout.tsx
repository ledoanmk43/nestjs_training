'use client'
import { UserProvider } from '@/utils/auth.provider'
import { Footer } from '@components/footer/Footer'
import { Navbar } from '@components/navbar/Navbar'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CLV',
  description: 'CLV Training bootcamp',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang='en'
      className={`${inter.className} scroll-smooth antialiased flex flex-col min-h-screen`}
    >
      
      <UserProvider>
        <body className='flex flex-col'>
          {/* <StyledComponentsRegistry> */}
          <Navbar />
          <main className='mx-20 '>{children}</main>
          <Footer />
          {/* </StyledComponentsRegistry> */}
        </body>
      </UserProvider>
    </html>
  )
}
