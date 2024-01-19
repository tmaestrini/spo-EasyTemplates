import * as React from "react";
import { CommandBar, DialogContent, DialogType, ICommandBarItemProps, SearchBox } from "@fluentui/react";
import { SecurityManager } from "./SecurityManager";
import usePageNavigator from "../../../hooks/usePageNavigator";
import { SettingsView, StandardView } from "./views";


type ICompanyTemplatesProps = {

}

export const CompanyTemplates: React.FunctionComponent<ICompanyTemplatesProps> = (props: React.PropsWithChildren<ICompanyTemplatesProps>) => {
  const pageNavigator = usePageNavigator(<StandardView/>);

  function navigationHandler(destination: React.ReactNode): void {
    pageNavigator.navigateTo(destination);
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
      onRenderIcon: (props) => <SearchBox placeholder="Templates durchsuchen" onSearch={newValue => console.log('value is ' + newValue)} styles={{ root: { width: '350px' } }} />,
    },
  ];

  const commandBarFarItems: ICommandBarItemProps[] = [
    {
      key: 'settings',
      text: 'Settings',
      ariaLabel: 'Settings',
      iconOnly: true,
      iconProps: { iconName: 'Settings' },
      onClick: () => { pageNavigator.navigateTo(<SettingsView onNavigationExit={navigationHandler} />); },
    },
  ];


  return <>
    <DialogContent type={DialogType.largeHeader} styles={{ content: { maxHeight: "80vh", height: "80vh", width: "80vw", overflowY: "scroll" } }} title={'Company Templates'}>
      <CommandBar
        items={commandBarItems}
        farItems={commandBarFarItems}
        ariaLabel="Inbox actions"
        styles={{ root: { borderBottom: '1px solid #edebe9', borderTop: '1px solid #edebe9' } }}
      />
      <SecurityManager>
        {pageNavigator.selectedPage}
      </SecurityManager>
    </DialogContent>
  </>
}
