import * as React from "react";
import { PrimaryButton } from "@fluentui/react";
import { useId } from '@fluentui/react-hooks';
import { SPFxContext } from "../contexts/SPFxContext";
import { TemplateService } from "../../../services/core/TemplateService";
import { TemplatesManagementContext } from "../contexts/TemplatesManagementContext";

type CopyTemplatesButtonProps = {
  selectedFiles: any[];
}

export const CopyTemplatesButton: React.FunctionComponent<CopyTemplatesButtonProps> = (props: React.PropsWithChildren<CopyTemplatesButtonProps>) => {
  const { selectedFiles } = props;
  const { context } = React.useContext(SPFxContext);
  const { setCopiedFiles } = React.useContext(TemplatesManagementContext);
  const buttonId = useId('template-copy-button');
  const service = context.serviceScope.consume(TemplateService.serviceKey);

  async function copyTemplates(): Promise<void> {
    const queryParameters = new URLSearchParams(window.location.search);
    const currentFolderPath = queryParameters.get('id') || queryParameters.get('Id') || queryParameters.get('RootFolder') || '';
    const library = context.pageContext.list.serverRelativeUrl;
    const targetFolderUrl = `${library}${currentFolderPath.replace(library, '')}`;
    try {
      const newFiles = await service.copyTemplates(context.pageContext.site.absoluteUrl, targetFolderUrl, selectedFiles);
      setCopiedFiles(newFiles, `${newFiles.length} template${newFiles.length > 1 ? 's' : ''} copied successfully!`);
    } catch (error) {
      setCopiedFiles([], error);
      console.log(error);
    }
  }

  return <>
    <PrimaryButton id={buttonId} disabled={selectedFiles.length === 0} text={`${selectedFiles.length > 0 ? `${selectedFiles.length} ` : ''}Templates kopieren`}
      onClick={copyTemplates} iconProps={{ iconName: 'Installation' }} allowDisabledFocus />
  </>
}