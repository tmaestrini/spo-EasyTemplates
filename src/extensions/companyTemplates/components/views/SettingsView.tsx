import * as React from 'react';
import { useContext } from 'react';
import { SPFxContext } from '../../contexts/SPFxContext';
import { PrimaryButton } from '@fluentui/react';
import { StandardView } from './StandardView';

export interface ISettingsViewProps {
  onNavigationExit: (destination: React.ReactNode) => void;
}

export const SettingsView: React.FunctionComponent<ISettingsViewProps> = (props: React.PropsWithChildren<ISettingsViewProps>) => {
  const context = useContext(SPFxContext).context;
  console.log(context);

  function save(): void {
    props.onNavigationExit(<StandardView/>);
  }

  return (
    <>
      <h1 key={'title'}>Settings</h1>
      <PrimaryButton text="Save" onClick={save.bind(this)} allowDisabledFocus />
    </>
  );
};