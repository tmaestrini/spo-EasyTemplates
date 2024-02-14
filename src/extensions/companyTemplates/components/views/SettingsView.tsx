import * as React from 'react';
import { useContext } from 'react';
import { SPFxContext } from '../../contexts/SPFxContext';
import { DefaultButton, MessageBar, MessageBarType, PrimaryButton, Stack, Text } from '@fluentui/react';
import { StandardView } from './StandardView';
import styles from '../CompanyTemplates.module.scss'
import { ISite, SitePicker } from "@pnp/spfx-controls-react/lib/SitePicker";
import { ListPicker } from "@pnp/spfx-controls-react/lib/ListPicker";
import { SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/appcatalog";
import "@pnp/sp/webs";
import { UserService } from '../../../../services/core/UserService';
import { SettingsTemplateDefinition } from '../SettingsTemplateDefinition';

export interface ISettingsViewProps {
  onNavigationExit: (destination: React.ReactNode) => void;
}

export const SettingsView: React.FunctionComponent<ISettingsViewProps> = (props: React.PropsWithChildren<ISettingsViewProps>) => {
  const context = useContext(SPFxContext).context;
  const [userToken, setUserToken] = React.useState<any>(undefined);
  const [userData, setUserData] = React.useState<any>(undefined);
  const [settings, setSettings] = React.useState<{ site?: string, list?: string, categoryField?: { Id: string; InternalName: string; } }>({ site: undefined, list: undefined, categoryField: undefined });
  const [processState, setProcess] = React.useState({ saveInProgress: false, error: null });

  React.useEffect(() => {
    async function fetchListSettings(): Promise<void> {
      const sp = spfi().using(SPFx(context));
      try {
        const settingsData = (await sp.web.getStorageEntity("easyTemplatesSettings"))?.Value;
        if (settingsData) {
          const settings = JSON.parse(settingsData);
          setSettings({ site: settings.site, list: settings.list, categoryField: settings.categoryField });
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchListSettings().catch(error => console.log(error));
  }, []);

  React.useEffect(() => {
    const userService = context.serviceScope.consume(UserService.serviceKey);
    userService.getUserTokenDecoded()
      .then((token) => { setUserToken(token) })
      .catch((error) => setProcess({ ...processState, error }));

    userService.getUserData()
      .then((data) => { setUserData(data) })
      .catch((error) => console.log(error));
  }, []);

  async function storeListSettings(): Promise<void> {
    const sp = spfi().using(SPFx(context));
    const w = await sp.getTenantAppCatalogWeb();

    // specify required key and value
    await w.setStorageEntity("easyTemplatesSettings", JSON.stringify({ categoryField: settings.categoryField, site: settings.site, list: settings.list }));
    console.log('Settings saved:');
    console.log(settings)
  }

  function trySaving(): void {
    setProcess({ ...processState, saveInProgress: true });
    storeListSettings()
      .then(() => props.onNavigationExit(<StandardView />))
      .catch(error => setProcess({ saveInProgress: false, error: error }));
  }

  function cancelSettings(): void {
    props.onNavigationExit(<StandardView />);
  }

  console.log(userToken);
  return (
    <>
      <h2 className={`od-ItemContent-title ${styles.dialogTitle}`} key={'title'}>Settings</h2>
      {/* {userToken && <span>TenantId: {userToken.tid}</span>} */}
      {userData && <span><br />Current User: {userData.displayName}</span>}

      <Stack horizontal tokens={{ childrenGap: 10 }} style={{ verticalAlign: 'top', justifyContent: 'space-between' }}>
        <Stack style={{ width: '49%' }} tokens={{
          childrenGap: 10,
          maxWidth: '49%'
        }}>
          <h3 key={'title-template-repository'} className={styles.dialogSubtitle}>Template Repository</h3>
          <Text>Select the SharePoint site and list that contains your templates. It makes perfect sense if you plan to <a href="https://learn.microsoft.com/en-us/sharepoint/organization-assets-library" target='_blank' rel="noreferrer noopener" data-interception="off">use an organization assets library (as <strong>OfficeTemplateLibrary</strong>)</a> to manage your template management.</Text>
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
            label={'Select site'}
            mode={'site'}
            allowSearch={true}
            multiSelect={false}
            selectedSites={[{ url: settings.site }] as ISite[]}
            onChange={(sites) => { setSettings({ site: sites[0].url, list: undefined, categoryField: undefined }) }}
            placeholder={'Select sites'}
            searchPlaceholder={'Filter sites'} />

          <ListPicker context={context as any}
            label="Select your list"
            placeholder="Select your list that stores your templates"
            filter="BaseTemplate eq 101 and EntityTypeName ne 'FormServerTemplates' and EntityTypeName ne 'SiteAssets' and EntityTypeName ne 'Style_x0020_Library'"
            includeHidden={false}
            multiSelect={false}
            disabled={settings.site === undefined}
            webAbsoluteUrl={settings.site && settings.site}
            selectedList={settings.list}
            onSelectionChanged={value => setSettings({ ...settings, list: value as string, categoryField: undefined })} />

        </Stack>
        <Stack style={{ width: '49%' }} tokens={{
          childrenGap: 10,
          maxWidth: '49%'
        }}>
          <h3 key={'title-template-definition'} className={styles.dialogSubtitle}>Template definition</h3>
          <SettingsTemplateDefinition settings={settings} changeSettingsCallback={setSettings} />
        </Stack>
      </Stack>
      <Stack style={{ marginTop: '2em', width: '25%' }} tokens={{ childrenGap: 10 }}>
        <PrimaryButton disabled={processState.saveInProgress} text="Save Settings" onClick={trySaving.bind(this)} allowDisabledFocus />
        <DefaultButton text="Cancel" onClick={cancelSettings.bind(this)} allowDisabledFocus />
      </Stack>
    </>
  );
};