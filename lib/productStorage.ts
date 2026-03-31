const PRODUCT_DATA_KEY = 'shop_product_data';

interface MinimalProductData {
  productId: string;
  productName: string;
  productTitle: string;
  productPrice: string;
  productPhoto: string;
  landingId: string;
  landingSlug: string;
  landingName: string;
  timestamp: number;
}

export function storeProductData(data: { product: any; landing: any }): string {
  const id = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  if (typeof window !== 'undefined') {
    const minimalData: MinimalProductData = {
      productId: data.product.id,
      productName: data.product.name || data.product.title || '',
      productTitle: data.product.title || data.product.name || '',
      productPrice: data.product.price || '0',
      productPhoto: data.product.photos?.[data.product.mainPhoto] || data.product.photo || '',
      landingId: data.landing.id,
      landingSlug: data.landing.slug,
      landingName: data.landing.name,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(`${PRODUCT_DATA_KEY}_${id}`, JSON.stringify(minimalData));
    setTimeout(() => {
      localStorage.removeItem(`${PRODUCT_DATA_KEY}_${id}`);
    }, 30 * 60 * 1000);
  }
  return id;
}

export function getProductData(id: string): MinimalProductData | null {
  if (typeof window === 'undefined') return null;
  
  const data = localStorage.getItem(`${PRODUCT_DATA_KEY}_${id}`);
  if (data) {
    const parsed = JSON.parse(data);
    const age = Date.now() - parsed.timestamp;
    const maxAge = 30 * 60 * 1000;
    if (age > maxAge) {
      localStorage.removeItem(`${PRODUCT_DATA_KEY}_${id}`);
      return null;
    }
    return parsed;
  }
  return null;
}

export function clearProductData(id: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`${PRODUCT_DATA_KEY}_${id}`);
  }
}
