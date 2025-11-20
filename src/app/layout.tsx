import './styles/globals.css'
import './styles/learn-more.css'
import './styles/footer.css'
import ClientProviders from '@/components/ClientProviders';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Classic Portfolio Images Upload Device',
  description: 'Firebase Images',
  authors: [{ name: "Terdiman Olivier", url: 'https://www.reference-web.com' }],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}