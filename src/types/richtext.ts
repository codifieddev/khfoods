export type RichTextFormat =
  | number
  | string
  | null
  | undefined;

export interface RichTextNode {
  blockType?: string;
  children?: RichTextNode[];
  fields?: Record<string, any>;
  format?: RichTextFormat;
  id?: string;
  indent?: number;
  listType?: "bullet" | "number" | "check" | string;
  tag?: string;
  text?: string;
  type: string;
  url?: string;
  version?: number;
  [key: string]: any;
}

export interface RichTextRootNode extends RichTextNode {
  children: RichTextNode[];
  type: "root";
}

export interface RichTextState {
  root: RichTextRootNode;
  [key: string]: any;
}
