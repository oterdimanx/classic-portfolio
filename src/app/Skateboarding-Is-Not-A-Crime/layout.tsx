import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DomeLovers ! Vidéos et photos persos de skate, images / vidéos retrogaming | Oliver\'s Classic Portfolio',
  description: 'Découvrez ma section skate et retrogaming, et surtout beaucoup de vidéos du Dôme.',
  keywords: 'shop, products, skate, retrogaming, skateboarding, videos, domelovers, dome, paris',
  openGraph: {
    title: 'DomeLovers - Oliver\'s Classic Portfolio',
    description: 'Découvrez ma section skate et retrogaming, et surtout beaucoup de vidéos du Dôme.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oliver\'s Classic Portfolio',
    description: 'Découvrez ma section skate et retrogaming, et surtout beaucoup de vidéos du Dôme.',
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}