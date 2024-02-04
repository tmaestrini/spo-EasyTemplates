import * as React from "react";
import { TemplatesManagementContext } from "./TemplatesManagementContext";

type TemplatesManagementContextProviderProps = {}

export const TemplatesManagementContextProvider: React.FC<TemplatesManagementContextProviderProps> = (props: React.PropsWithChildren<TemplatesManagementContextProviderProps>) => {
  const [selectedTemplateFiles, setSelectedTemplateFiles] = React.useState([]);
  const [filterTemplateValue, setTemplateValueFilter] = React.useState('');

  function addTemplateFiles(files: any[]): void {
    setSelectedTemplateFiles([]);
    setSelectedTemplateFiles(files);
  }

  function filterTemplateByValue(value: string): void {
    setTemplateValueFilter(undefined);
    setTemplateValueFilter(value);
  }

  return <TemplatesManagementContext.Provider value={{
    selectedFiles: selectedTemplateFiles, checkoutFiles: addTemplateFiles,
    templateFilter: {value: filterTemplateValue}, setTemplateValueFilter: filterTemplateByValue,
  }}>
    {props.children}
  </TemplatesManagementContext.Provider>
}