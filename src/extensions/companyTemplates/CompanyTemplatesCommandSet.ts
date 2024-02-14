import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetExecuteEventParameters,
  ListViewStateChangedEventArgs
} from '@microsoft/sp-listview-extensibility';
import { getThemeColor } from './themeHelper';
import DialogWrapper from './components/DialogWrapper';
import * as React from 'react';
import { CompanyTemplates } from './components/CompanyTemplates';
import { SPFxContext } from './contexts/SPFxContext';

export interface ICompanyTemplatesCommandSetProperties { }

const LOG_SOURCE: string = 'CompanyTemplatesCommandSet';

export default class CompanyTemplatesCommandSet extends BaseListViewCommandSet<ICompanyTemplatesCommandSetProperties> {

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized CompanyTemplatesCommandSet');

    // initial state of the command's visibility
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    compareOneCommand.visible = true;

    const fillColor = getThemeColor("themeDarkAlt").replace('#', '%23');
    const exportSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2048 2048'%3E%3Cpath d='M608 128q45 0 77 9t58 24 46 31 40 31 44 23 55 10h992q27 0 50 10t40 27 28 41 10 50v451l-128-128V384H928q-31 0-54 9t-44 24-41 31-45 31-58 23-78 10H128v1152h640v128H0V256q0-27 10-50t27-40 41-28 50-10h480zm0 256q24 0 42-4t33-13 29-20 32-27q-17-15-31-26t-30-20-33-13-42-5H128v128h480zm1019 256l421 421v987H896V640h731zm37 384h165l-165-165v165zm256 128h-384V768h-512v1152h896v-768zm-768 512h512v128h-512v-128zm256-128h-256v-128h256v128zm0-256h-256v-128h256v128zm0-256h-256V896h256v128z' fill='${fillColor}'%3E%3C/path%3E%3C/svg%3E`;
    compareOneCommand.iconImageUrl = exportSvg;

    this.context.listView.listViewStateChangedEvent.add(this, this._onListViewStateChanged);

    return Promise.resolve();
  }

  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'COMMAND_1': {
        const templatesComponent = React.createElement(CompanyTemplates);
        const contextProvider = React.createElement(SPFxContext.Provider, { value: { context: this.context } }, templatesComponent);
        const wrapper = new DialogWrapper(contextProvider);
        wrapper.show().catch(er => alert(er));
        break;
      }
      default:
        throw new Error('Unknown command');
    }
  }

  private _onListViewStateChanged = (args: ListViewStateChangedEventArgs): void => {
    Log.info(LOG_SOURCE, 'List view state changed');

    // const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    // if (compareOneCommand) {
    //   // This command should be hidden unless exactly one row is selected.
    //   compareOneCommand.visible = this.context.listView.selectedRows?.length === 1;
    // }

    this.raiseOnChange();
  }
}
