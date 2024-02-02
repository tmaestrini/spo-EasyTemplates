import * as React from "react";
import { ITreeItem } from "@pnp/spfx-controls-react/lib/TreeView";

type TemplatesCartContextState = {
  selectedFiles: any[];
  checkoutFiles: (files: ITreeItem[]) => void;
}

export const TemplatesCartContext = React.createContext<TemplatesCartContextState>({selectedFiles: [], checkoutFiles: undefined});