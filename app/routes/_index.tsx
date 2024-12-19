import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ProductDashboard from "~/src/components/ProductDashboard";
import type { Product } from "~/utils/product";

interface ApiResponse {
  status: string;
  code: number;
  total: number;
  data: Product[];
}

const NUMBER_OF_PRODUCTS = 25;
const CATEGORIES_TYPE = "string";

const fakerProductUrl = `https://fakerapi.it/api/v2/products?_quantity=${NUMBER_OF_PRODUCTS}&_categories_type=${CATEGORIES_TYPE}`;

export const loader: LoaderFunction = async () => {
  const response = await fetch(fakerProductUrl);
  return response.json();
};

export default function Index() {
  const { data: products } = useLoaderData<ApiResponse>();

  return <ProductDashboard products={products} />;
}
