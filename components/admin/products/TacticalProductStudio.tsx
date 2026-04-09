"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Terminal,
  Zap,
  Save,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { RootState } from "@/lib/store/store";

import {
  setProductFormField,
  resetProductForm,
  setPricingField,
  setCurrentProduct,
} from "@/lib/store/products/productsSlices";
import { saveProduct } from "@/lib/store/products/productsThunk";
import { fetchForms } from "@/lib/store/forms/formsThunk";

import { GeneralInformation } from "./studio/GeneralInformation";
import { PublicationSidebar } from "./studio/PublicationSidebar";
import { PricingInventory } from "./studio/PricingInventory";
import { VisualMedia } from "./studio/VisualMedia";
import { AttributesSection } from "./studio/AttributesSection";
import { VariantMatrix } from "./studio/VariantMatrix";
import { sanitizeKey } from "@/lib/admin-products/utils";

export function TacticalProductStudio() {
  const router = useRouter();
  const params = useParams();
  const editId = (params.id as string) || null;
  const dispatch = useAppDispatch();
  const isEditing = Boolean(editId);

  const { allCategories } = useAppSelector(
    (state: RootState) => state.adminCategories,
  );
  const {
    allProducts,
    currentProduct: form,
    saving,
    loading: productLoading,
  } = useAppSelector((state: RootState) => state.adminProducts);
  const { allForms } = useAppSelector((state: RootState) => state.adminForms);

  const [loading, setLoading] = useState(true);
  const [productSlug, setProductSlug] = useState("");

  const relatedProductCandidates = useMemo(
    () => allProducts.filter((item: any) => item._id !== editId),
    [allProducts, editId],
  );

  // Initial Load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        if (!isEditing) {
          dispatch(resetProductForm());
          setProductSlug("");
        }
        dispatch(fetchForms());
      } catch (err) {
        console.error("Studio initialization failed", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [editId, isEditing, dispatch]);

  // Sync editId with form
  useEffect(() => {
    if (isEditing && editId && allProducts.length > 0) {
      const singleProduct = allProducts.find(
        (item: any) => item._id === editId,
      );
      if (singleProduct) {
        dispatch(setCurrentProduct(singleProduct));
        setProductSlug(singleProduct.slug || "");
      }
    }
  }, [allProducts, editId, isEditing, dispatch]);

  const toggleCategory = (id: string) => {
    if (!form) return;
    const exists = form.categoryIds.includes(id);
    const nextIds = exists
      ? form.categoryIds.filter((i: string) => i !== id)
      : [...form.categoryIds, id];

    dispatch(setProductFormField({ field: "categoryIds", value: nextIds }));

    if (exists && form.primaryCategoryId === id) {
      dispatch(setProductFormField({ field: "primaryCategoryId", value: "" }));
    } else if (!exists && nextIds.length === 1) {
      dispatch(setProductFormField({ field: "primaryCategoryId", value: id }));
    }
  };

  const handleSave = async () => {
    if (!form) return;
    if (!form.name.trim() || !form.sku.trim()) {
      return toast.error("SECURITY PROTOCOL: Designation and Serial SKU required.");
    }
    const payload = { 
        ...form, 
        slug: productSlug.trim(),
        price: Number(form.pricing.price || 0),
        primaryCategoryId: form.primaryCategoryId || null,
        categoryIds: (form.categoryIds || []).filter((id: string) => id && id.length > 0),
        variants: (form.variants || []).map((v: any) => ({
          ...v,
          price: Number(v.price || 0),
          stock: Number(v.stock || 0),
        })),
        pricing: {
          ...form.pricing,
          price: Number(form.pricing.price || 0),
          compareAtPrice: Number(form.pricing.compareAtPrice || 0),
          costPerItem: Number(form.pricing.costPerItem || 0),
        },
    };
    const tId = toast.loading("SYNCHRONIZING REPOSITORY...");
    try {
      const action: any = await dispatch(saveProduct({ id: editId || undefined, payload }));
      if (saveProduct.fulfilled.match(action)) {
        toast.success("DEPLOYMENT SUCCESSFUL", { id: tId });
        setTimeout(() => router.push("/admin/products"), 1500);
      } else {
        toast.error("DEPLOYMENT FAILED", { id: tId });
      }
    } catch (e) {
      toast.error("NETWORK ERROR", { id: tId });
    }
  };

  if (loading || productLoading || !form) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 border-2 border-gold/10 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Tactical Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <div className="flex items-start gap-8">
            <button
              onClick={() => router.push("/admin/products")}
              className="mt-2 text-white/20 hover:text-white transition-colors"
            >
              <ArrowLeft size={32} strokeWidth={1.5} />
            </button>
            <div className="space-y-3">
               <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
                 {isEditing ? "Modify" : "Deploy"}{" "}
                 <span className="text-gold">Intelligence</span>
               </h1>
               <div className="flex items-center gap-3 text-[11px] font-black text-white/20 uppercase tracking-[0.4em] italic">
                 <Terminal size={14} className="text-gold/40" />
                 {isEditing ? "CALIBRATING ASSET NODE" : "CREATING NEW ASSET NODE"}
               </div>
            </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            className="h-16 px-12 bg-white/5 border border-white/5 text-white/20 font-black text-[11px] uppercase tracking-[0.3em] hover:text-white hover:bg-white/10 transition-all active:scale-95"
            onClick={() => router.push("/admin/products")}
          >
            ABORT MISSION
          </button>
          <button
            className="h-16 px-12 bg-[#818a5e] text-white font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all active:scale-95 flex items-center gap-4 shadow-2xl shadow-emerald-500/10 rounded-sm"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? (
              <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} strokeWidth={2.5} />
            )}
            {isEditing ? "RE-DEPLOY UNIT" : "LAUNCH UNIT"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Interface */}
        <div className="lg:col-span-8 space-y-12">
          <GeneralInformation
            name={form.name}
            sku={form.sku}
            slug={productSlug}
            description={form.description}
            onFormChange={(field, value) =>
              dispatch(setProductFormField({ field: field as any, value }))
            }
            onSlugChange={setProductSlug}
          />

          <PricingInventory
            pricing={form.pricing}
            onPricingChange={(field, value) =>
              dispatch(setPricingField({ field: field as any, value }))
            }
          />

          <VisualMedia
            gallery={form.gallery}
            primaryImageId={form.primaryImageId}
            galleryUrlDraft={""}
            onGalleryChange={(gallery) =>
              dispatch(setProductFormField({ field: "gallery", value: gallery }))
            }
            onPrimaryImageChange={(id) =>
              dispatch(setProductFormField({ field: "primaryImageId", value: id }))
            }
            onGalleryUrlDraftChange={() => {}}
            onAddGalleryItem={(item) =>
              dispatch(setProductFormField({ field: "gallery", value: [...form.gallery, item] }))
            }
          />

          <AttributesSection
            attributes={form.attributes}
            onAttributesChange={(attributes) =>
              dispatch(setProductFormField({ field: "attributes", value: attributes }))
            }
          />

          <VariantMatrix
            variants={form.variants}
            onVariantsChange={(variants) =>
              dispatch(setProductFormField({ field: "variants", value: variants }))
            }
          />
        </div>

        {/* Tactical Control Sidebar */}
        <div className="lg:col-span-4">
          <PublicationSidebar
            status={form.status}
            templateKey={form.templateKey}
            allCategories={allCategories}
            categoryIds={form.categoryIds}
            primaryCategoryId={form.primaryCategoryId}
            relatedProductCandidates={relatedProductCandidates}
            relatedProductIds={form.relatedProductIds}
            onFormChange={(field, value) =>
              dispatch(setProductFormField({ field: field as any, value }))
            }
            onToggleCategory={toggleCategory}
            onToggleRelatedProduct={(id) =>
              dispatch(
                setProductFormField({
                  field: "relatedProductIds",
                  value: form.relatedProductIds.includes(id)
                    ? form.relatedProductIds.filter((rid: string) => rid !== id)
                    : [...form.relatedProductIds, id],
                }),
              )
            }
            allForms={allForms}
            formId={form.formId || ""}
          />
        </div>
      </div>
    </div>
  );
}
