import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // AWAIT the params first
  const { slug } = await params;
  const searchParamsObj = await searchParams;
  
  try {
    // Use full URL for server-side fetching
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/common/product/get-product-by-slug?slug=${slug}`, {
      method: 'GET',
      cache: 'force-cache'
    });

    if (!res.ok) {
      throw new Error('Image Product not found');
    }

    const response = await res.json();
    const product = response?.data;

    if (!product) {
      return {
        title: 'Image Product Not Found',
        description: 'The image product you are looking for does not exist.',
      };
    }

    // Get parent metadata
    const previousImages = (await parent).openGraph?.images || [];

    return {
      title: `${product.productName} | Oliver's Classic Portfolio`,
      description: product.productDescription || `Achetez ${product.productName} dans notre boutique.`,
      openGraph: {
        title: product.name,
        description: product.metaDescription || product.description || `Achetez ${product.name} dans notre boutique.`,
        images: product.images && product.images.length > 0 
          ? [product.images[0], ...previousImages] 
          : previousImages,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.productName,
        description: product.productDescription || `Achetez ${product.productName} dans notre boutique.`,
        images: product.productImage ? [product.productImage] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product',
      description: 'Image Product details page',
    };
  }
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}