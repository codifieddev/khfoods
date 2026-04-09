import { AdminRepository } from "@/lib/admin-repository";
import { toPlainJson } from "@/lib/toPlainJson";
import { PagesClient, type PageRow } from "./PagesClient";

const PagesPage = async () => {
  const pages = toPlainJson(
    await AdminRepository.find<PageRow>("pages", {}, { sort: { updatedAt: -1 } })
  );

  return (
    <PagesClient pages={pages} />
  );
};

export default PagesPage;
