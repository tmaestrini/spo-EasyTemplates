import { CommandBar, Dropdown, ICommandBarItemProps, IDropdownOption, IDropdownProps, Icon, PrimaryButton, SearchBox } from "@fluentui/react";
import * as React from "react";
import { SettingsView } from "./views";
import { TemplatesManagementContext } from "../contexts/TemplatesManagementContext";
import { TemplateFile } from "../../../hooks/useTemplateFiles";

type ICommandBarMenuProps = {
  pageNavigationHandler: (page: React.ReactNode) => void;
}

function CategoryFilter(props: { templateFilesByCategory: { [key: string]: TemplateFile[] }[] }): JSX.Element {
  const { setTemplateCategoriesFilter } = React.useContext(TemplatesManagementContext);
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);
  const { templateFilesByCategory } = props;

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

  const onRenderCaretDown = (props: IDropdownProps): JSX.Element => {
    return <>
      {selectedKeys.length > 0 && <Icon iconName="Clear" styles={{ root: { cursor: 'pointer', } }} onClick={(event) => {
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
    placeholder="Kategorien filtern"
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
  const { templateFilesByCategory, selectedFiles, checkoutFiles, setTemplateValueFilter } = React.useContext(TemplatesManagementContext);
  const { pageNavigationHandler } = props;

  function clearCommandBarValues(): void {
    checkoutFiles([]);
    setTemplateValueFilter(undefined);
  }

  const commandBarItems: ICommandBarItemProps[] = [
    {
      key: 'filterLabel',
      onRenderIcon: () => <span>Filter:</span>,
    },
    {
      key: 'filterTemplateCategories',
      ariaLabel: 'Filter by categories',
      onRenderIcon: () => <CategoryFilter templateFilesByCategory={templateFilesByCategory} />,
    },
    {
      key: 'search',
      ariaLabel: 'Search',
      onRenderIcon: () => <SearchBox placeholder="Templates durchsuchen und <ENTER> drücken" onSearch={newValue => setTemplateValueFilter(newValue)} onClear={() => setTemplateValueFilter(undefined)} styles={{ root: { width: '350px' } }} />,
    },
    {
      key: 'copy',
      ariaLabel: 'Copy',
      onRenderIcon: () => <PrimaryButton disabled={selectedFiles.length === 0} text={`${selectedFiles.length > 0 ? `${selectedFiles.length} ` : ''}Templates kopieren`} onClick={() => console.log('kopieren')} allowDisabledFocus />,
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