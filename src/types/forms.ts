import type { RichTextState } from "@/types/richtext";

export type FormOption = {
  id?: string | null;
  label: string;
  value: string;
};

export type BaseFormField = {
  blockName?: string | null;
  id?: string | null;
  label?: string | null;
  name: string;
  required?: boolean | null;
  width?: number | string | null;
};

export type CheckboxField = BaseFormField & {
  blockType: "checkbox";
  defaultValue?: boolean | null;
};

export type CountryField = BaseFormField & {
  blockType: "country";
};

export type EmailField = BaseFormField & {
  blockType: "email";
  defaultValue?: string | null;
};

export type MessageField = {
  blockType: "message";
  id?: string | null;
  message: RichTextState | null;
  width?: number | string | null;
};

export type NumberField = BaseFormField & {
  blockType: "number";
  defaultValue?: number | string | null;
};

export type SelectField = BaseFormField & {
  blockType: "select";
  options: FormOption[];
};

export type StateField = BaseFormField & {
  blockType: "state";
};

export type TextField = BaseFormField & {
  blockType: "text" | "textarea";
  defaultValue?: string | null;
  rows?: number | null;
};

export type FormFieldBlock =
  | CheckboxField
  | CountryField
  | EmailField
  | MessageField
  | NumberField
  | SelectField
  | StateField
  | TextField;

export type FormDefinition = {
  confirmationMessage?: RichTextState | null;
  confirmationType?: "message" | "redirect" | string | null;
  fields?: FormFieldBlock[] | null;
  id?: string | null;
  redirect?: {
    url?: string | null;
  } | null;
  submitButtonLabel?: string | null;
};
