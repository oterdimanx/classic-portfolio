import './styles/globals.css'
import './styles/learn-more.css'
import './styles/footer.css'
import ClientProviders from '@/components/ClientProviders';
import type { ReactNode } from 'react';
import { x } from 'joi';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Classic Portfolio - Images Upload Device - Welcome to my humble PortFolio :)',
  description: 'Firebase Is My Images Back-End. Classic Portfolio Is Your Front-End. Discover Our FAQ Section evolution of the app, Troubleshooting, and all the services we can offer.',
  authors: [{ name: "Terdiman Olivier", url: 'https://olivers-portfolio.terdiman.fr' }],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ overflowX: "hidden" }}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}