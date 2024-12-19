import { describe, it, expect } from "vitest";
import {
  computeAverageProductPrice,
  formatPrice,
  getTopTags,
  getPriceRanges,
  type Product,
} from "./product";

describe("Product Utils", () => {
  const sampleProducts: Product[] = [
    {
      id: 1,
      name: "Product 1",
      description: "Description 1",
      ean: "1234567890123",
      upc: "123456789012",
      image: "image1.jpg",
      images: [{ title: "Image 1", description: "Desc 1", url: "url1.jpg" }],
      net_price: 80,
      taxes: 20,
      price: 100,
      categories: ["category1"],
      tags: ["tag1", "tag2"],
    },
    {
      id: 2,
      name: "Product 2",
      description: "Description 2",
      ean: "2234567890123",
      upc: "223456789012",
      image: "image2.jpg",
      images: [{ title: "Image 2", description: "Desc 2", url: "url2.jpg" }],
      net_price: 180,
      taxes: 20,
      price: 200,
      categories: ["category2"],
      tags: ["tag2", "tag3"],
    },
    {
      id: 2,
      name: "Product 3",
      description: "Description 3",
      ean: "1212121212121",
      upc: "987654321098",
      image: "image3.jpg",
      images: [{ title: "Image 3", description: "Desc 3", url: "url3.jpg" }],
      net_price: 15000000,
      taxes: 200000,
      price: 200000000,
      categories: ["category1", "category3"],
      tags: ["tag2", "tag3"],
    },
  ];

  describe("computeAverageProductPrice", () => {
    it("should compute the average price correctly", () => {
      const result = computeAverageProductPrice(sampleProducts);
      expect(result).toBe("$66,666,766.67");
    });

    it("should handle empty array", () => {
      expect(computeAverageProductPrice([])).toBe("$0.00");
    });

    it("should handle single product", () => {
      const result = computeAverageProductPrice([sampleProducts[0]]);
      expect(result).toBe("$100.00");
    });
  });

  describe("formatPrice", () => {
    it("should format price with USD currency symbol", () => {
      expect(formatPrice(1234.56)).toBe("$1,234.56");
    });

    it("should handle zero", () => {
      expect(formatPrice(0)).toBe("$0.00");
    });

    it("should handle negative numbers", () => {
      expect(formatPrice(-1234.56)).toBe("-$1,234.56");
    });

    it("should round to 2 decimal places", () => {
      expect(formatPrice(1234.567)).toBe("$1,234.57");
    });
  });

  describe("getTopTags", () => {
    it("should return correct tag counts in descending order", () => {
      const result = getTopTags(sampleProducts, 3);
      console.log("result", result);
      expect(result).toEqual([
        ["tag2", 3],
        ["tag3", 2],
        ["tag1", 1],
      ]);
    });

    it("should limit results to specified number", () => {
      const result = getTopTags(sampleProducts, 1);
      expect(result).toEqual([["tag2", 3]]);
    });

    it("should handle empty product array", () => {
      const result = getTopTags([], 3);
      expect(result).toEqual([]);
    });

    it("should handle products with no tags", () => {
      const productsNoTags = [
        { ...sampleProducts[0], tags: [] },
        { ...sampleProducts[1], tags: [] },
      ];
      const result = getTopTags(productsNoTags, 3);
      expect(result).toEqual([]);
    });
  });

  describe("getPriceRanges", () => {
    it("should distribute products into correct price ranges", () => {
      const result = getPriceRanges(sampleProducts);
      expect(result).toEqual([
        { range: "$0-50", count: 0 },
        { range: "$50-100", count: 0 },
        { range: "$100-250", count: 2 },
        { range: "$250-500", count: 0 },
        { range: "$500-1K", count: 0 },
        { range: "$1K-2.5K", count: 0 },
        { range: "$2.5K-5K", count: 0 },
        { range: "$5K+", count: 1 },
      ]);
    });

    it("should handle empty product array", () => {
      const result = getPriceRanges([]);
      expect(result.every((range) => range.count === 0)).toBe(true);
    });

    it("should handle extreme prices", () => {
      const extremePriceProducts = [
        { ...sampleProducts[0], price: 0 },
        { ...sampleProducts[0], price: 10000 },
      ];
      const result = getPriceRanges(extremePriceProducts);
      const zeroRange = result.find((r) => r.range === "$0-50");
      const topRange = result.find((r) => r.range === "$5K+");
      expect(zeroRange?.count).toBe(1);
      expect(topRange?.count).toBe(1);
    });

    it("should handle boundary prices", () => {
      const boundaryPriceProducts = [
        { ...sampleProducts[0], price: 50 }, // Should go in $50-100
        { ...sampleProducts[0], price: 100 }, // Should go in $100-250
        { ...sampleProducts[0], price: 1000 }, // Should go in $1K-2.5K
      ];
      const result = getPriceRanges(boundaryPriceProducts);
      expect(result.find((r) => r.range === "$50-100")?.count).toBe(1);
      expect(result.find((r) => r.range === "$100-250")?.count).toBe(1);
      expect(result.find((r) => r.range === "$1K-2.5K")?.count).toBe(1);
    });
  });
});
