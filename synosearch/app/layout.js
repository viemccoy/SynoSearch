import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'; // Adjust the path according to your project structure

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SynoSearch',
  description: 'Search smarter, not harder.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
