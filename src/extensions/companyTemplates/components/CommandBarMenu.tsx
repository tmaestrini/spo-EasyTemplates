import { CommandBar, Dropdown, ICommandBarItemProps, IDropdownOption, IDropdownProps, Icon, SearchBox } from "@fluentui/react";
import * as React from "react";
import { SettingsView } from "./views";
import { TemplatesManagementContext } from "../contexts/TemplatesManagementContext";
import { CopyTemplatesButton } from "./CopyTemplatesButton";
import { ProgressStatus } from "./ProgressStatus";

type ICommandBarMenuProps = {
  pageNavigationHandler: (page: React.ReactNode) => void;
}

function CategoryFilter(): JSX.Element {
  const { templateFilesByCategory, setTemplateCategoriesFilter } = React.useContext(TemplatesManagementContext);
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);

  React.useEffect(() => {
    setTemplateCategoriesFilter(selectedKeys);
  }, [selectedKeys])

  const onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    if (item) {
      setSelectedKeys(
        item.selected ? [...selectedKeys, item.key as string] : selectedKeys.filter(key => key !== item.key),
      );
    }
  };

  const onRenderCaretDown = (): JSX.Element => {
    return <>
      {selectedKeys.length > 0 && <Icon iconName="Clear" styles={{ root: { cursor: 'pointer', } }} onClick={() => {
        setSelectedKeys([]);
      }} />}
    </>
  }

  const onRenderPlaceholder = (props: IDropdownProps): JSX.Element => {
    return <>
      <Icon iconName="Filter" styles={{ root: { paddingRight: '0.5rem' } }} />
      <span>{props.placeholder ?? 'Kategorien filtern'}</span>
    </>
  }

  return <Dropdown
    placeholder="nach Kategorien"
    selectedKeys={selectedKeys}
    onChange={onChange}
    styles={{ root: { width: 200, border: 'none', textAlign: 'left' } }}
    multiSelect
    onRenderPlaceholder={onRenderPlaceholder}
    onRenderCaretDown={onRenderCaretDown}
    options={templateFilesByCategory ? Object.keys(templateFilesByCategory).sort().map((category) => ({
      key: category,
      text: category,
    })) : []}
  // styles={dropdownStyles}
  />
}

export const CommandBarMenu: React.FunctionComponent<ICommandBarMenuProps> = (props: React.PropsWithChildren<ICommandBarMenuProps>) => {
  const { selectedFiles, checkoutFiles, setTemplateValueFilter, copiedFiles } = React.useContext(TemplatesManagementContext);
  const { pageNavigationHandler } = props;

  function clearCommandBarValues(): void {
    checkoutFiles([]);
    setTemplateValueFilter(undefined);
  }

  const commandBarItems: ICommandBarItemProps[] = [
    {
      key: 'filterLabel',
      onRenderIcon: () => <span>Templates filtern:</span>,
    },
    {
      key: 'filterTemplateCategories',
      ariaLabel: 'Filter by categories',
      onRenderIcon: () => <CategoryFilter />,
    },
    {
      key: 'search',
      ariaLabel: 'Search',
      onRenderIcon: () => <SearchBox placeholder="Templates durchsuchen und <ENTER> drücken" onSearch={newValue => setTemplateValueFilter(newValue)} onClear={() => setTemplateValueFilter(undefined)} styles={{ root: { width: '350px' } }} />,
    },
    {
      key: 'copy',
      ariaLabel: 'Copy',
      onRenderIcon: () => <CopyTemplatesButton selectedFiles={selectedFiles} />,
    },
  ];

  const commandBarFarItems: ICommandBarItemProps[] = [
    {
      key: 'progress',
      disabled: copiedFiles?.files?.length > 0 ? false : true,
      onRenderIcon: () => <ProgressStatus/>,
    },
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