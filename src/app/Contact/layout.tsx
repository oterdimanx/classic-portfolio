import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Oliver\'s PortFolio - Contactez-nous',
  description: 'Contactez-moi pour trouver toutes les réponses à vos questions concernant ma boutique portfolio, et bien plus d\'informations encore.',
  keywords: 'Contact, FAQ, help, support, shipping, returns, payments',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}