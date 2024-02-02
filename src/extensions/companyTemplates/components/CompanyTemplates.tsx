import * as React from "react";
import { DialogContent, DialogType } from "@fluentui/react";
import { SecurityManager } from "./SecurityManager";
import usePageNavigator from "../../../hooks/usePageNavigator";
import { StandardView } from "./views";
import { CommandBarMenu } from "./CommandBarMenu";
import { TemplatesCartContextProvider } from "../contexts/TemplatesCartContextProvider";


type ICompanyTemplatesProps = {

}

export const CompanyTemplates: React.FunctionComponent<ICompanyTemplatesProps> = (props: React.PropsWithChildren<ICompanyTemplatesProps>) => {
  const initalView = <StandardView />
  const pageNavigator = usePageNavigator(initalView);

  function navigationHandler(destination: React.ReactNode): void {
    pageNavigator.navigateTo(destination);
  }


  return <>
    <DialogContent type={DialogType.largeHeader} styles={{ content: { maxHeight: "80vh", height: "80vh", width: "80vw", overflowY: "scroll" } }} title={'Company Templates'}>
      <TemplatesCartContextProvider>
        <CommandBarMenu pageNavigationHandler={navigationHandler} />
        <SecurityManager>
          {pageNavigator.selectedPage}
        </SecurityManager>
      </TemplatesCartContextProvider>
    </DialogContent>
  </>
}
