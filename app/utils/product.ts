export interface ProductImage {
  title: string;
  description: string;
  url: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  ean: string;
  upc: string;
  image: string;
  images: ProductImage[];
  net_price: number;
  taxes: number;
  price: number;
  categories: string[];
  tags: string[];
}

export function computeAverageProductPrice(products: Product[]) {
  if (products.length === 0) {
    return formatPrice(0);
  }
  return formatPrice(
    products.reduce((sum, p) => sum + p.price, 0) / products.length
  );
}

export function formatPrice(price: number) {
  const formattedPrice = price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  return formattedPrice;
}

export function getTopTags(products: Product[], take: number) {
  const tags = products.flatMap((p) => p.tags);
  const tagCount = tags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const sortedTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]);
  return sortedTags.slice(0, take);
}

export function getPriceRanges(products: Product[]) {
  const ranges = [
    { min: 0, max: 50, label: "$0-50" },
    { min: 50, max: 100, label: "$50-100" },
    { min: 100, max: 250, label: "$100-250" },
    { min: 250, max: 500, label: "$250-500" },
    { min: 500, max: 1000, label: "$500-1K" },
    { min: 1000, max: 2500, label: "$1K-2.5K" },
    { min: 2500, max: 5000, label: "$2.5K-5K" },
    { min: 5000, max: Infinity, label: "$5K+" },
  ];

  const distribution = ranges.reduce((acc, range) => {
    acc[range.label] = 0;
    return acc;
  }, {} as Record<string, number>);

  products.forEach((product) => {
    const range = ranges.find(
      (r) => product.price >= r.min && product.price < r.max
    );
    if (range) {
      distribution[range.label]++;
    }
  });

  return Object.entries(distribution).map(([range, count]) => ({
    range,
    count,
  }));
}
