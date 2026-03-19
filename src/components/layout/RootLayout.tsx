import type { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col items-center gap-3 bg-[rgb(246,_244,_240)]">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
