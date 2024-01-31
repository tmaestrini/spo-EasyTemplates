import * as React from 'react';
import { useContext } from 'react';
import { groupBy } from '@microsoft/sp-lodash-subset';
import { SPFxContext } from '../../contexts/SPFxContext';
import { Icon, PrimaryButton, Spinner, SpinnerSize, Stack, StackItem, Text } from '@fluentui/react';
import { FileIconType, getFileTypeIconProps } from '@fluentui/react-file-type-icons';
import styles from '../CompanyTemplates.module.scss'
import { ITreeItem, TreeView, TreeViewSelectionMode } from '@pnp/spfx-controls-react/lib/TreeView';
import { SPFx, spfi } from '@pnp/sp';
import "@pnp/sp/items/get-all";
import "@pnp/sp/items";
import { TemplateFile, useTemplateFiles } from '../../../../hooks/useTemplateFiles';


export interface ITemplateViewProps { }

export const StandardView: React.FunctionComponent<ITemplateViewProps> = (props: React.PropsWithChildren<ITemplateViewProps>) => {
  const context = useContext(SPFxContext).context;
  // const [templateFiles, setFiles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedFiles, setSelectedFiles] = React.useState<ITreeItem[]>([]);
  const { templateFiles, setParams } = useTemplateFiles({ context, listId: undefined, webUrl: undefined });

  React.useEffect(() => {
    initSourceList().catch(error => console.log(error));
  }, []);

  async function initSourceList(): Promise<void> {
    setLoading(true);
    const sp = spfi().using(SPFx(context));
    const listUrl = await sp.web.getStorageEntity("easyTemplatesListUrl");
    const listId = await sp.web.getStorageEntity("easyTemplatesLibraryId");
    console.log(listId.Value);
    console.log(listUrl.Value);

    setParams({ context, listId: listId.Value, webUrl: listUrl.Value });
    setLoading(false);
  }

  const onRenderItem = (treeItem: ITreeItem): JSX.Element => {
    const { data } = treeItem;
    if (data.type === 'Folder') {
      return <div className={styles.treeNode}>
        <Icon {...getFileTypeIconProps({ type: FileIconType.folder, size: 16, imageFileType: 'png' })} />
        {treeItem.label}
      </div>;
    }

    return <div className={styles.treeLeaf}>
      <Stack horizontal horizontalAlign='space-between' style={{ width: '100%' }}>
        <StackItem verticalFill={true}>
          <Icon {...getFileTypeIconProps({ extension: data?.fileType, size: 16, imageFileType: 'png' })} style={{ verticalAlign: 'text-bottom' }} />
          {treeItem.label}
        </StackItem>
        {/* <StackItem styles={{ root: { width: '120px', textAlign: 'right' } }}>
          {new Date(data?.modified).toLocaleDateString()}
        </StackItem> */}
        <StackItem>
          <Text variant='xSmall' className={styles.category}>Kategorie</Text>
        </StackItem>
      </Stack>
    </div >;
  }

  const buildGroups = (items: any[], path = '', level = 1): any[] => {
    if (!items?.length) return [];

    const sorted = [...items].sort((a, b) => {
      const aValue = a.filePath.toLowerCase();
      const bValue = b.filePath.toLowerCase();
      if (aValue > bValue) return 1;
      if (bValue > aValue) return -1;
      return 0;
    });

    const grouped = groupBy(sorted, (i) => {
      if (i.pathSegments.length <= level) return '$this';
      return i.pathSegments[level - 1];
    });
    return [
      ...Object
        .keys(grouped)
        .filter((directory) => directory !== '$this')
        .map((directory): any => ({
          key: `${path}${directory}`,
          label: directory,
          subLabel: "Test",
          data: { title: directory, type: 'Folder' },
          selectable: false,
          children: buildGroups(grouped[directory], `${path}${directory}/`, level + 1)
        })),
      ...grouped.$this?.filter(i => !i.title.includes('.DS'))
        .map((i: TemplateFile) => ({
          key: i.id,
          label: i.fileLeafRef,
          subLabel: i.filePath,
          data: i,
        })) ?? [],
    ];
  }

  return (
    <div>
      <h1 key={'title'}>Template View (Standard)</h1>
      {loading && <div><Spinner size={SpinnerSize.large} label='Loading Templates...' labelPosition='top' /></div>}
      {!loading && <>
        <PrimaryButton disabled={selectedFiles.length === 0} text={`${selectedFiles.length > 0 ? `${selectedFiles.length} ` : ''}Templates kopieren`} onClick={() => console.log('kopieren')} allowDisabledFocus />
        <TreeView
          items={buildGroups(templateFiles)}
          defaultExpandedChildren={false}
          showCheckboxes={true}
          defaultExpanded={false}
          selectionMode={TreeViewSelectionMode.Multiple}
          onSelect={(items => { console.log(items); setSelectedFiles([...items]); })}
          onRenderItem={(i) => onRenderItem(i)}
        />
      </>}
    </div>
  );
};