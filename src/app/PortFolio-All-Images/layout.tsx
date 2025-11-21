import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop - Explorez les différentes rubriques d\'images | Oliver\'s Classic Portfolio',
  description: 'Explorez notre catalogue complet de produits avec de superbes offres et une livraison rapide. (surtout si ce sont des images de portfolio :) )',
  keywords: 'shop, products, buy online, ecommerce, deals, featured products',
  openGraph: {
    title: 'Shop - Oliver\'s Classic Portfolio',
    description: 'Parcourez notre catalogue complet de produits avec de superbes offres et une livraison rapide. (surtout si ce sont des images de portfolio :) )',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oliver\'s Classic Portfolio',
    description: 'Parcourez notre catalogue complet de produits avec de superbes offres et une livraison rapide. (surtout si ce sont des images de portfolio :) )',
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}