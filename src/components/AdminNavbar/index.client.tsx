"use client";

import { getTranslation } from "@payloadcms/translations";
import { NavGroup, useConfig, useTranslation } from "@payloadcms/ui";
import {
  EntityType,
  formatAdminURL,
  type NavGroupType,
} from "@payloadcms/ui/shared";
import LinkWithDefault from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { type NavPreferences } from "payload";

import { baseClass } from "./index";
import { getNavIcon } from "./navIconMap";
import { useEffect, useMemo } from "react";

type Props = {
  groups: NavGroupType[];
  navPreferences: NavPreferences | null;
};

const collectionOrder: string[] = [
  "Website Management",
  "Customer Management",
  "Products",
  "Orders",
  "Page Settings",
  "Shop settings",
  "Courier integrations",
  "Payments settings",
  "Administration",
  "Collections",
  "Paywalls",
];
export const NavClient = ({ groups, navPreferences }: Props) => {
  const pathname = usePathname();

  const updatedGroups = useMemo(() => {
    // Check if we need to modify groups first
    const tenantsGroup = groups.find(
      (group) => group.label === "Website Management"
    );

    const needsModification =
      tenantsGroup &&
      !tenantsGroup.entities.some((e) => e.slug === "websites/create");

    let resultGroups;
    if (!needsModification) {
      resultGroups = groups;
    } else {
      const clonedGroups = structuredClone(groups);
      const clonedTenantsGroup = clonedGroups.find(
        (group) => group.label === "Website Management"
      );

      if (clonedTenantsGroup) {
        clonedTenantsGroup.entities.push({
          slug: "websites/create",
          type: EntityType.collection,
          label: "Create Websites",
        });
      }
      resultGroups = clonedGroups;
    }

    // Sort groups according to collectionOrder
    const sortedGroups = [...resultGroups].sort((a: any, b: any) => {
      const aLabel: string = typeof a?.label === "string" ? a.label : "";
      const bLabel: string = typeof b?.label === "string" ? b.label : "";
      const aIndex = collectionOrder.indexOf(aLabel);
      const bIndex = collectionOrder.indexOf(bLabel);
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    });

    return sortedGroups;
  }, [groups]);

  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig();

  const { i18n, switchLanguage } = useTranslation();
  const params = useSearchParams()
  const lang = params.get("locale");
  const changeLanguage = async (lang:string) => {
    if(!switchLanguage) return 
    await switchLanguage(lang as any)
  }
  useEffect(()=>{
    changeLanguage(lang ? lang : "en")
  }, [lang])


  return (
    <>
      {updatedGroups.map(({ entities, label }, key) => {
        // Debug: log label and language for Customer Management
        if (label === "Customer Management") {
          console.log("Customer Management entities:", entities);
          console.log("Current language:", i18n?.language);
          console.log("Entity label:", label);
          console.log("Translated label:", getTranslation(label, i18n));
        }
        return (
          <NavGroup
            isOpen={navPreferences?.groups?.[label]?.open}
            key={key}
            label={label}
          >
            {entities.map(({ slug, type, label }, i) => {
              let href: string;
              let id: string;

              if (type === EntityType.collection) {
                href = formatAdminURL({
                  adminRoute,
                  path: `/collections/${slug}`,
                });
                id = `nav-${slug}`;
              } else {
                href = formatAdminURL({ adminRoute, path: `/globals/${slug}` });
                id = `nav-global-${slug}`;
              }

              const activeCollection = pathname === href;

              const Icon = getNavIcon(slug as string);

              return (
                <LinkWithDefault
                  className={[
                    `${baseClass}__link twp flex items-center py-2 hover:bg-black hover:rounded-[4px] hover:text-white`,
                    activeCollection && `active`,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  href={href}
                  id={id}
                  key={i}
                  style={{
                    textDecoration: "none",
                    backgroundColor: activeCollection ? "black" : undefined,
                    borderRadius: activeCollection ? "4px" : undefined,
                    marginTop: "2px",
                    paddingLeft: "8px",
                    color: activeCollection ? "white" : undefined,
                  }}
                  prefetch={false}
                >
                  {activeCollection && (
                    <div className={`${baseClass}__link-indicator`} />
                  )}
                  {Icon && (
                    <Icon
                      width={20}
                      height={20}
                      className={`${baseClass}__icon mr-2`}
                    />
                  )}
                  <span
                    className={`${baseClass}__link-label text-lg leading-0`}
                  >
                    {getTranslation(label, i18n)}
                  </span>
                </LinkWithDefault>
              );
            })}
          </NavGroup>
        );
      })}
    </>
  );
};
