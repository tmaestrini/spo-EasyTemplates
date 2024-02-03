import * as React from "react";
import { ITreeItem } from "@pnp/spfx-controls-react/lib/TreeView";

type TemplatesManagementContextState = {
  selectedFiles: any[];
  checkoutFiles: (files: ITreeItem[]) => void;
  templateFilter?: { value?: string, categories?: string[] };
  setTemplateValueFilter?: (value: string) => void;
  setTemplateCategoriesFilter?: (categories: string[]) => void;
}

export const TemplatesManagementContext = React.createContext<TemplatesManagementContextState>({
  selectedFiles: [], checkoutFiles: undefined, templateFilter: { value: undefined, categories: [] },
});