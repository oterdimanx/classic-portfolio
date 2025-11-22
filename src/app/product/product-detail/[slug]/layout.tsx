import type { Metadata, ResolvingMetadata } from 'next';

// Remove the custom Props type and use inline types instead
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }, // Use inline type
  parent: ResolvingMetadata
): Promise<Metadata> {
  // AWAIT the params first
  const { slug } = await params;
  
  try {
    // Use full URL for server-side fetching
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/common/product/get-product-by-slug?slug=${slug}`, {
      method: 'GET',
      cache: 'force-cache'
    });

    if (!res.ok) {
      throw new Error('Product not found');
    }

    const response = await res.json();
    const product = response?.data;

    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The product you are looking for does not exist.',
      };
    }

    // Get parent metadata
    const previousImages = (await parent).openGraph?.images || [];

    return {
      title: `${product.productName} | Your Store Name`,
      description: product.productDescription || `Buy ${product.productName} at our store.`,
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
        description: product.productDescription || `Buy ${product.productName} at our store.`,
        images: product.productImage ? [product.productImage] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product',
      description: 'Product details page',
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