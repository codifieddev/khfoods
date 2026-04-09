import { AdminRepository } from "@/lib/admin-repository";
import { toPlainJson } from "@/lib/toPlainJson";
import { CategoriesClient, type CategoryRow } from "./CategoriesClient";

const CategoriesPage = async () => {
  const categories = toPlainJson(
    await AdminRepository.find<CategoryRow>("categories", {}, { sort: { name: 1 } })
  );

  return (
    <CategoriesClient categories={categories} />
  );
};

export default CategoriesPage;
