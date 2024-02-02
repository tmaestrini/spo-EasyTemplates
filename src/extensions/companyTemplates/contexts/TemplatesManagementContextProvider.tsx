import * as React from "react";
import { TemplatesManagementContext } from "./TemplatesManagementContext";

type TemplatesManagementContextProviderProps = {}

export const TemplatesManagementContextProvider: React.FC<TemplatesManagementContextProviderProps> = (props: React.PropsWithChildren<TemplatesManagementContextProviderProps>) => {
  const [selectedTemplateFiles, setSelectedTemplateFiles] = React.useState([]);

  function addTemplateFiles(files: any[]): void {
    setSelectedTemplateFiles([]);
    setSelectedTemplateFiles(files);
  }

  return <TemplatesManagementContext.Provider value={{ selectedFiles: selectedTemplateFiles, checkoutFiles: addTemplateFiles }}>
    {props.children}
  </TemplatesManagementContext.Provider>
}