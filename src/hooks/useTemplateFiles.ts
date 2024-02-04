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
  category: string;
}

export type TemplateParams = {
  context: BaseComponentContext;
  webUrl: string;
  listId: string;
  categoryField?: { Id: string; InternalName: string; };
}

export function useTemplateFiles(initialValues: TemplateParams): { templateFiles: TemplateFile[], setListParams: (newParams: TemplateParams) => void, templateStore: TemplateParams } {
  const [templateStoreParams, setParams] = useState<TemplateParams>({ ...initialValues });
  const [files, setFiles] = useState<TemplateFile[]>([]);

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
        const data:TemplateFile = {
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
          category: templateStoreParams.categoryField?.InternalName ? f[templateStoreParams.categoryField.InternalName] : '',
          pathSegments: f.FileRef
            .substring(ParentWebUrl.length + 1)
            .split('/').slice(1),
        };
        if(isEmpty(data.category)) delete data.category;
        return data;
      });
    return fileItems;
  }

  useEffect(() => {
    const { listId, webUrl, context } = templateStoreParams;
    if (!listId || !webUrl || !context) return;

    readFilesFromSettings()
      .then(res => { setFiles(res); })
      .catch(error => console.log(error));
  }, [templateStoreParams]);

  return { templateFiles: files, setListParams, templateStore: templateStoreParams };
}