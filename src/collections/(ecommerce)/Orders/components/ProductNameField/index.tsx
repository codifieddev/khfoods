"use client";
import { useField, useFormFields, useLocale } from "@payloadcms/ui";
import axios from "axios";
import { type TextFieldClientComponent } from "payload";
import { stringify } from "qs-esm";
import { useCallback, useEffect } from "react";

import { type Product } from "@/types/cms";

export const ProductNameField: TextFieldClientComponent = ({ path }) => {
  const { setValue } = useField<string>({ path });
  const locale = useLocale();

  const productFieldPath = path.replace("productName", "product");
  const productID = useFormFields(([fields]) => {
    return fields[productFieldPath].value as string;
  });

  const fetchProduct = useCallback(async () => {
    const query = stringify(
      {
        select: {
          title: true
        }
      },
      { addQueryPrefix: true }
    );

    try {
      const { data } = await axios.get<Product>(
        `/api/products/${productID}${query}&locale=${locale.code}`,
        {
          withCredentials: true
        }
      );
      setValue(data.title);
    } catch (error) {
      // console.log(error);
    }
  }, [productID, locale.code, setValue]);

  useEffect(() => {
    void fetchProduct();
  }, [fetchProduct]);

  return null;
};


