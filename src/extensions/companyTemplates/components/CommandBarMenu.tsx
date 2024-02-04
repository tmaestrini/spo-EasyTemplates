import { CommandBar, ICommandBarItemProps, PrimaryButton, SearchBox } from "@fluentui/react";
import * as React from "react";
import { SettingsView } from "./views";
import { TemplatesManagementContext } from "../contexts/TemplatesManagementContext";

type ICommandBarMenuProps = {
  pageNavigationHandler: (page: React.ReactNode) => void;
}

export const CommandBarMenu: React.FunctionComponent<ICommandBarMenuProps> = (props: React.PropsWithChildren<ICommandBarMenuProps>) => {
  const { selectedFiles, checkoutFiles, setTemplateValueFilter } = React.useContext(TemplatesManagementContext);
  const { pageNavigationHandler } = props;

  function clearCommandBarValues(): void {
    checkoutFiles([]);
    setTemplateValueFilter(undefined);
  }

  const commandBarItems: ICommandBarItemProps[] = [
    {
      key: 'filterTemplates',
      text: 'Alle Templates',
      cacheKey: 'allTemplatesFilterCacheKey', // changing this key will invalidate this item's cache
      iconProps: { iconName: 'Filter' },
      subMenuProps: {
        items: [
          {
            key: 'filterAllTemplates',
            text: 'Alle Templates',
            onClick: () => console.log('Filter all templates'),
          },
          {
            key: 'filterBasicTemplates',
            text: 'Basic Templates',
            onClick: () => console.log('Filter basic templates'),
          },
        ]
      }
    },
    {
      key: 'search',
      ariaLabel: 'Search',
      onRenderIcon: (props) => <SearchBox placeholder="Templates durchsuchen und <ENTER> drücken" onSearch={newValue => setTemplateValueFilter(newValue)} onClear={() => setTemplateValueFilter(undefined)} styles={{ root: { width: '350px' } }} />,
    },
    {
      key: 'copy',
      ariaLabel: 'Copy',
      onRenderIcon: (props) => <PrimaryButton disabled={selectedFiles.length === 0} text={`${selectedFiles.length > 0 ? `${selectedFiles.length} ` : ''}Templates kopieren`} onClick={() => console.log('kopieren')} allowDisabledFocus />,
    },
  ];

  const commandBarFarItems: ICommandBarItemProps[] = [
    {
      key: 'settings',
      text: 'Settings',
      ariaLabel: 'Settings',
      iconOnly: true,
      iconProps: { iconName: 'Settings' },
      onClick: () => { clearCommandBarValues(); pageNavigationHandler(<SettingsView onNavigationExit={pageNavigationHandler} />); },
    },
  ];

  return <CommandBar
    items={commandBarItems}
    farItems={commandBarFarItems}
    ariaLabel="Template actions"
    styles={{ root: { borderBottom: '1px solid #edebe9', borderTop: '1px solid #edebe9' } }}
  />

}