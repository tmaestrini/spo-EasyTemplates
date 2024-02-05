import { useEffect, useState } from 'react';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { BaseComponentContext } from "@microsoft/sp-component-base";
import { SPFx, Web, spfi } from '@pnp/sp/presets/all';


export type TemplateFile = {
  id: string;
  title: string;
  type: 'Folder' | 'File';
  fileType: string;
  fileRef: string;
  fileLeafRef: string;
  filePath: string[];
  pathSegments: string[];
  modified: Date;
  categories?: string[];
}

export type TemplateParams = {
  context: BaseComponentContext;
  webUrl: string;
  listId: string;
  categoryField?: { Id: string; InternalName: string; };
}

export function useTemplateFiles(initialValues: TemplateParams): {
  templateFiles: TemplateFile[],
  templateFilesByCategory: { [key: string]: TemplateFile[] }[],
  templateStore: TemplateParams,
  initWithListParams: (newParams: TemplateParams) => void,
} {
  const [templateStoreParams, setParams] = useState<TemplateParams>({ ...initialValues });
  const [files, setFiles] = useState<TemplateFile[]>([]);
  const [filesGroupedByCategory, setGroupedFiles] = useState<{ [key: string]: TemplateFile[] }[]>([]);

  function setListParams(newParams: TemplateParams): void {
    setParams(newParams);
  }

  async function readFilesFromSettings(): Promise<TemplateFile[]> {
    const { context, webUrl, listId } = templateStoreParams;
    const sp = spfi().using(SPFx(context));
    const { WebFullUrl } = await sp.web.getContextInfo(webUrl);
    const sourceWeb = Web([sp.web, decodeURI(WebFullUrl)]);
    const sourceList = sourceWeb.lists.getById(listId);

    const { ParentWebUrl } = await sourceList();
    const fileItems = (await sourceList.items
      .select('Title', 'FileRef', 'FSObjType',
        'BaseName', 'ServerUrl', 'DocIcon',
        'LinkFilename', 'UniqueId', 'FileDirRef',
        templateStoreParams.categoryField?.InternalName ? `${templateStoreParams.categoryField.InternalName}` : '',
        'File_x0020_Type', 'FileLeafRef', 'Modified', /*"FieldValuesAsText"*/)
      .filter("FSObjType eq 0")
      // .expand("FieldValuesAsText")
      .getAll())
      .map((f) => {
        const data: TemplateFile = {
          id: f.UniqueId,
          title: !isEmpty(f.Title) ? f.Title : f.FileLeafRef,
          type: f.FSObjType === 1 ? 'Folder' : 'File',
          fileType: f.File_x0020_Type,
          fileRef: f.FileRef,
          fileLeafRef: f.FileLeafRef,
          filePath: f.FileRef
            .substring(ParentWebUrl.length + 1)
            .split('/').slice(1).join('/'),
          modified: f.Modified,
          pathSegments: f.FileRef
            .substring(ParentWebUrl.length + 1)
            .split('/').slice(1),
        };
        // category handling
        const categories = templateStoreParams.categoryField?.InternalName && f[templateStoreParams.categoryField.InternalName];
        if (categories && Array.isArray(f[templateStoreParams.categoryField.InternalName])) data.categories = categories;
        else if (categories && typeof (f[templateStoreParams.categoryField.InternalName]) === 'string') data.categories = [categories];

        return data;
      });
    return fileItems;
  }

  function groupByCategory(files: TemplateFile[]): void {
    const grouped = files.reduce((acc: any, cur: TemplateFile) => {
      cur.categories?.forEach((c: string) => {
        if (!acc[c]) acc[c] = [];
        acc[c].push(cur);
      })
      return acc;
    }, {});
    setGroupedFiles(grouped);
  }

  useEffect(() => {
    const { listId, webUrl, context } = templateStoreParams;
    if (!listId || !webUrl || !context) return;

    readFilesFromSettings()
      .then(res => { setFiles(res); return res; })
      .then(res => { groupByCategory(res) })
      .catch(error => console.log(error));
  }, [templateStoreParams]);

  return { templateFiles: files, templateFilesByCategory: filesGroupedByCategory, initWithListParams: setListParams, templateStore: templateStoreParams };
}