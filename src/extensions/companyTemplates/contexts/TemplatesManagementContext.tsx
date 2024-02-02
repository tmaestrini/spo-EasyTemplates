import * as React from "react";
import { ITreeItem } from "@pnp/spfx-controls-react/lib/TreeView";

type TemplatesManagementContextState = {
  selectedFiles: any[];
  checkoutFiles: (files: ITreeItem[]) => void;
}

export const TemplatesManagementContext = React.createContext<TemplatesManagementContextState>({selectedFiles: [], checkoutFiles: undefined});