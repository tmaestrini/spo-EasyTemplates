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
}

export type TemplateParams = {
  context: BaseComponentContext;
  webUrl: string;
  listId: string;
}

export function useTemplateFiles(initialValues: TemplateParams): { templateFiles: TemplateFile[], setListParams: (newParams: TemplateParams) => void } {
  const [templateLocationParams, setParams] = useState<TemplateParams>({ ...initialValues });
  const [files, setFiles] = useState<TemplateFile[]>([]);

  function setListParams(newParams: TemplateParams): void {
    setParams(newParams);
  }

  async function readFilesFromSettings(): Promise<TemplateFile[]> {
    const { context, webUrl, listId } = templateLocationParams;
    const sp = spfi().using(SPFx(context));
    const { WebFullUrl } = await sp.web.getContextInfo(webUrl);
    const sourceWeb = Web([sp.web, decodeURI(WebFullUrl)]);
    const sourceList = sourceWeb.lists.getById(listId);

    const { ParentWebUrl } = await sourceList();
    const fileItems = (await sourceList.items
      .select('Title', 'FileRef', 'FSObjType',
        'BaseName', 'ServerUrl', 'DocIcon',
        'LinkFilename', 'UniqueId', 'FileDirRef',
        'File_x0020_Type', 'FileLeafRef', 'Modified', /*"FieldValuesAsText"*/)
      .filter("FSObjType eq 0")
      // .expand("FieldValuesAsText")
      .getAll())
      .map((f) => ({
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
      } as TemplateFile));
    return fileItems;
  }

  useEffect(() => {
    const { listId, webUrl, context } = templateLocationParams;
    if (!listId || !webUrl || !context) return;

    readFilesFromSettings()
      .then(res => { setFiles(res); })
      .catch(error => console.log(error));
  }, [templateLocationParams]);

  return { templateFiles: files, setListParams };
}