import * as React from "react";
import { TemplatesCartContext } from "./TemplatesCartContext";

type TemplatesContextProviderProps = {}

export const TemplatesCartContextProvider: React.FC<TemplatesContextProviderProps> = (props: React.PropsWithChildren<TemplatesContextProviderProps>) => {
  const [selectedTemplateFiles, setSelectedTemplateFiles] = React.useState([]);

  function addTemplateFiles(files: any[]): void {
    setSelectedTemplateFiles([]);
    setSelectedTemplateFiles(files);
  }

  return <TemplatesCartContext.Provider value={{ selectedFiles: selectedTemplateFiles, checkoutFiles: addTemplateFiles }}>
    {props.children}
  </TemplatesCartContext.Provider>
}