import { Editor } from "@/EditorComp/Editor";
import { getStorefrontPageById } from "@/data/storefront/pages";
import { type Locale } from "@/i18n/config";

export const dynamic = "force-dynamic";

const EditorPage = async ({ params }) => {
  const param = await params;
  const page = await getStorefrontPageById({
    id: param.id,
    locale: ((param.locale as Locale | undefined) ?? "en") as Locale,
  });

  return <Editor mode="edit" data={page} />;
};
export default EditorPage;
