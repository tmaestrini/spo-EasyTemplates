import * as React from 'react';
import { useContext } from 'react';
import { SPFxContext } from '../../contexts/SPFxContext';
import { MessageBar, MessageBarType, PrimaryButton, Stack } from '@fluentui/react';
import { StandardView } from './StandardView';
import { ISite, SitePicker } from "@pnp/spfx-controls-react/lib/SitePicker";
import { ListPicker } from "@pnp/spfx-controls-react/lib/ListPicker";
import { SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/appcatalog";
import "@pnp/sp/webs";
import { UserService } from '../../../../services/core/UserService';

export interface ISettingsViewProps {
  onNavigationExit: (destination: React.ReactNode) => void;
}

export const SettingsView: React.FunctionComponent<ISettingsViewProps> = (props: React.PropsWithChildren<ISettingsViewProps>) => {
  const context = useContext(SPFxContext).context;
  const [userToken, setUserToken] = React.useState(undefined);
  const [settings, setSettings] = React.useState<{ site: string, list: string }>({ site: undefined, list: undefined });
  const [processState, setProcess] = React.useState({ saveInProgress: false, error: null });


  async function storeListSettings(): Promise<void> {
    const sp = spfi().using(SPFx(context));
    const w = await sp.getTenantAppCatalogWeb();

    // specify required key and value
    await w.setStorageEntity("easyTemplatesListUrl", settings.site);
    await w.setStorageEntity("easyTemplatesLibraryId", settings.list);

    console.log('List selection saved');
  }

  React.useEffect(() => {
    async function fetchListSettings() {
      const sp = spfi().using(SPFx(context));
      const web = await sp.getTenantAppCatalogWeb();
      const listUrl = await web.getStorageEntity("easyTemplatesListUrl");
      const listId = await web.getStorageEntity("easyTemplatesLibraryId");
      setSettings({ site: listUrl.Value, list: listId.Value });
    }

    fetchListSettings().catch(error => console.log(error));
  }, []);

  React.useEffect(() => {
    const userService = context.serviceScope.consume(UserService.serviceKey);
    userService.getUserTokenDecoded()
      .then((token) => { setUserToken(token) })
      .catch((error) => setProcess({ ...processState, error }));
  }, []);


  function trySaving(): void {
    setProcess({ ...processState, saveInProgress: true });
    storeListSettings()
      .then(() => props.onNavigationExit(<StandardView />))
      .catch(error => setProcess({ saveInProgress: false, error: error }));
  }

  return (
    <>
      <h1 key={'title'}>Settings</h1>
      <Stack tokens={{
        childrenGap: 10,
        padding: 10,
        maxWidth: '50%'
      }}>

        {userToken && <span>TenantId: {userToken.tid}</span>}
        {processState.error &&
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={false}>{processState.error}</MessageBar>}
        {(processState.saveInProgress && !processState.error) &&
          <MessageBar
            messageBarType={MessageBarType.info}
            isMultiline={false}>Saving in progress...</MessageBar>}
        <SitePicker
          context={context as any}
          label={'Select sites'}
          mode={'site'}
          allowSearch={true}
          multiSelect={false}
          selectedSites={[{ url: settings.site }] as ISite[]}
          onChange={(sites) => { setSettings({ ...settings, site: sites[0].url }) }}
          placeholder={'Select sites'}
          searchPlaceholder={'Filter sites'} />

        <ListPicker context={context as any}
          label="Select your list(s)"
          placeHolder="Select your list(s)"
          filter="BaseTemplate eq 101 and EntityTypeName ne 'FormServerTemplates' and EntityTypeName ne 'SiteAssets' and EntityTypeName ne 'Style_x0020_Library'"
          includeHidden={false}
          multiSelect={false}
          disabled={settings.site === undefined}
          webAbsoluteUrl={settings.site && settings.site}
          selectedList={settings.list}
          onSelectionChanged={value => setSettings({ ...settings, list: value as string })} />

        <PrimaryButton disabled={processState.saveInProgress} text="Save Settings" onClick={trySaving.bind(this)} allowDisabledFocus />
      </Stack>
    </>
  );
};