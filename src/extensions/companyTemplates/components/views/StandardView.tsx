import * as React from 'react';
import { useContext } from 'react';
import { groupBy } from '@microsoft/sp-lodash-subset';
import { SPFxContext } from '../../contexts/SPFxContext';
import { TemplatesManagementContext } from '../../contexts/TemplatesManagementContext';
import { Icon, Spinner, SpinnerSize, Stack, StackItem, Text } from '@fluentui/react';
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
  const { templateFiles, setListParams } = useTemplateFiles({ context, listId: undefined, webUrl: undefined });
  const { checkoutFiles, templateFilter } = useContext(TemplatesManagementContext);
  const [loading, setLoading] = React.useState(true);
  const [filteredtemplateFiles, setFilteredtemplateFiles] = React.useState<TemplateFile[]>(templateFiles);

  React.useEffect(() => {
    initSourceList().catch(error => console.log(error));
  }, []);

  React.useEffect(() => {
    const filtered = templateFiles
      .filter(file => {
        return file.title.toLowerCase().includes(templateFilter.value?.toLowerCase() ?? '')
          || file.fileLeafRef.toLowerCase().includes(templateFilter.value?.toLowerCase() ?? '');
      });
    setFilteredtemplateFiles(filtered);
  }, [templateFilter.value]);

  async function initSourceList(): Promise<void> {
    setLoading(true);
    const sp = spfi().using(SPFx(context));
    // const listUrl = await sp.web.getStorageEntity("easyTemplatesListUrl");
    // const listId = await sp.web.getStorageEntity("easyTemplatesLibraryId");
    // const categoryFieldId = await sp.web.getStorageEntity("easyTemplatesCategoryFieldId");
    // console.log(listId.Value);
    // console.log(listUrl.Value);
    // console.log(categoryFieldId.Value);
    // setListParams({ context, webUrl: listUrl.Value, listId: listId.Value });
    // setLoading(false);

    try {
      const settingsData = (await sp.web.getStorageEntity("easyTemplatesSettings"))?.Value;
      if (settingsData) {
        const settings = JSON.parse(settingsData);
        console.log(settings);
        setListParams({ context, webUrl: settings.site, listId: settings.list, categoryField: settings.categoryField });
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
    // finally {
    //   setLoading(false);
    // }
  }

  const onRenderItem = (treeItem: ITreeItem): JSX.Element => {
    const { data } = treeItem;

    console.log(data.category);
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
          {data.category && <Text variant='xSmall' className={styles.category}>{data.category}</Text>}
        </StackItem>
      </Stack>
    </div >;
  }

  const makeFolderStructure = (items: any[], path = '', level = 1): any[] => {
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
          children: makeFolderStructure(grouped[directory], `${path}${directory}/`, level + 1)
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
      <h2 className={`od-ItemContent-title ${styles.dialogTitle}`} key={'title'}>Template View (Standard)</h2>
      {loading && <div><Spinner size={SpinnerSize.large} label='Loading Templates...' labelPosition='top' /></div>}
      {!loading && <>
        <TreeView
          items={makeFolderStructure(filteredtemplateFiles.length > 0 ? filteredtemplateFiles : templateFiles)}
          defaultExpandedChildren={false}
          showCheckboxes={true}
          defaultExpanded={false}
          selectionMode={TreeViewSelectionMode.Multiple}
          onSelect={(items) => checkoutFiles([...items])}
          onRenderItem={(i) => onRenderItem(i)}
        />
      </>}
    </div>
  );
};