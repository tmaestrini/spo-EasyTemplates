import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { PageContext } from '@microsoft/sp-page-context';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { IFile, IWeb, SPFx, Web, spfi } from '@pnp/sp/presets/all';
import "@pnp/sp/navigation";

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
  webUrl: string;
  listId: string;
  categoryField?: { Id: string; InternalName: string; };
}

export interface ITemplateService {
  getTemplates(templateStoreParams: TemplateParams): Promise<TemplateFile[]>;
  copyTemplates(targetSiteUrl: string, targetFolderRelativeUrl: string, selectedFiles: any[]): Promise<IFile[]>;
}

export class TemplateService implements ITemplateService {

  private pageContext: PageContext;

  public static readonly serviceKey: ServiceKey<ITemplateService> =
    ServiceKey.create<ITemplateService>('CompanyTemplates.TemplateService', TemplateService);

  constructor(serviceScope: ServiceScope) {
    serviceScope.whenFinished(() => {
      this.pageContext = serviceScope.consume(PageContext.serviceKey);
    })
  }

  private async getSourceWeb(webUrl: string): Promise<IWeb> {
    const sp = spfi().using(SPFx({ pageContext: this.pageContext }));
    const { WebFullUrl } = await sp.web.getContextInfo(webUrl);
    const sourceWeb = Web([sp.web, decodeURI(WebFullUrl)]);
    return sourceWeb;
  }

  public async getTemplates(templateStoreParams: TemplateParams): Promise<TemplateFile[]> {
    const { webUrl, listId, categoryField } = templateStoreParams;

    const sourceWeb = await this.getSourceWeb(webUrl);
    const sourceList = sourceWeb.lists.getById(listId);

    const { ParentWebUrl } = await sourceList();
    const selectFields = ['Title', 'FileRef', 'FSObjType',
      'BaseName', 'ServerUrl', 'DocIcon',
      'LinkFilename', 'UniqueId', 'FileDirRef',
      'File_x0020_Type', 'FileLeafRef', 'Modified', /*"FieldValuesAsText"*/];
    categoryField?.InternalName && selectFields.push(categoryField?.InternalName);

    const fileItems = (await sourceList.items
      .select(...selectFields)
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

  public async copyTemplates(targetSiteUrl: string, targetFolderRelativeUrl: string, selectedFiles: any[]): Promise<IFile[]> {
    try {
      const sourceWeb = await this.getSourceWeb(targetSiteUrl);
      const files = await Promise.all(selectedFiles.map(async (file) => {
        return await sourceWeb.getFileById(file.data.id)
          .copyByPath(`${targetFolderRelativeUrl}/${file.data.fileLeafRef}`, false, {
            KeepBoth: false,
            ResetAuthorAndCreatedOnCopy: true,
            ShouldBypassSharedLocks: false,
          });
      }));
      return files;
    } catch (error) {
      throw `Error while copying templates: ${error.message}` || error;
    }
  }

}
