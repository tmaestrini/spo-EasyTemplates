import * as React from "react";
import { ITreeItem } from "@pnp/spfx-controls-react/lib/TreeView";
import { TemplateFile } from "../../../hooks/useTemplateFiles";

type TemplatesManagementContextState = {
  templateFiles?: TemplateFile[];
  templateFilesByCategory?: { [key: string]: TemplateFile[] }[];
  loading: boolean;

  templateFilter?: { value?: string, categories?: string[] };
  setTemplateValueFilter?: (value: string) => void;
  setTemplateCategoriesFilter?: (categories: string[]) => void;

  selectedFiles: any[];
  checkoutFiles: (files: ITreeItem[]) => void;
}

export const TemplatesManagementContext = React.createContext<TemplatesManagementContextState>({
  templateFiles: [], templateFilesByCategory: [], loading: true,
  selectedFiles: [], checkoutFiles: undefined, templateFilter: { value: undefined, categories: [] },
});