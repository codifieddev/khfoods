import { AdminRepository } from "@/lib/admin-repository";
import { toPlainJson } from "@/lib/toPlainJson";
import { ProductsClient, type ProductRow } from "./ProductsClient";

const ProductsPage = async () => {
  const products = toPlainJson(
    await AdminRepository.find<ProductRow>("products", {}, { sort: { updatedAt: -1 } })
  );

  return (
    <ProductsClient products={products} />
  );
};

export default ProductsPage;
