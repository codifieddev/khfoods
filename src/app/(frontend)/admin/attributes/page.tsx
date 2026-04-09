import { AdminRepository } from "@/lib/admin-repository";
import { toPlainJson } from "@/lib/toPlainJson";
import { AttributesClient, type AttributeSetRow } from "./AttributesClient";

const AttributesPage = async () => {
  const attributeSets = toPlainJson(
    await AdminRepository.find<AttributeSetRow>("attributeSets", {}, { sort: { name: 1 } })
  );

  return (
    <AttributesClient attributeSets={attributeSets} />
  );
};

export default AttributesPage;
