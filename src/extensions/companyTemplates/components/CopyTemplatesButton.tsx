import * as React from "react";
import { PrimaryButton } from "@fluentui/react";
import { SPFxContext } from "../contexts/SPFxContext";
import { TemplateService } from "../../../services/core/TemplateService";

type CopyTemplatesButtonProps = {
  selectedFiles: any[];
}

export const CopyTemplatesButton: React.FunctionComponent<CopyTemplatesButtonProps> = (props: React.PropsWithChildren<CopyTemplatesButtonProps>) => {
  const { selectedFiles } = props;
  const { context } = React.useContext(SPFxContext);
  const service = context.serviceScope.consume(TemplateService.serviceKey);

  React.useEffect(() => {
    console.log(selectedFiles);
  }, []);

  async function copyTemplates(): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPath = urlParams.get('id') ?? '';
    const library = context.pageContext.list.serverRelativeUrl;
    const targetFolderUrl = `${library}${currentPath.replace(library, '')}`;
    try {
      await service.copyTemplates( context.pageContext.site.absoluteUrl, targetFolderUrl, selectedFiles);
    } catch (error) {
      console.log(error);
    }
  }

  return <PrimaryButton disabled={selectedFiles.length === 0} text={`${selectedFiles.length > 0 ? `${selectedFiles.length} ` : ''}Templates kopieren`} onClick={copyTemplates} allowDisabledFocus />
}