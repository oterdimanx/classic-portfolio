import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Oliver\'s PortFolio - FAQ - Frequently Asked Questions',
  description: 'Trouvez toutes les réponses à vos questions concernant ma boutique portfolio, et bien plus d\'informations encore.',
  keywords: 'FAQ, help, support, shipping, returns, payments',
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}