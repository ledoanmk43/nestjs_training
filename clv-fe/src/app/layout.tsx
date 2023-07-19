'use client'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { UserProvider } from '../utils/authenticate'

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
    <UserProvider>
      <html lang='en'>
        <body className={inter.className}>{children}</body>
      </html>
    </UserProvider>
  )
}
