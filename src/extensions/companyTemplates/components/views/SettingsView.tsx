import * as React from 'react';
import { useContext } from 'react';
import { SPFxContext } from '../../contexts/SPFxContext';
import { PrimaryButton } from '@fluentui/react';

export interface ISettingsViewProps {
  onNavigationExit?: (pageNavigation: string) => void;
}

export const SettingsView: React.FunctionComponent<ISettingsViewProps> = (props: React.PropsWithChildren<ISettingsViewProps>) => {
  const context = useContext(SPFxContext).context;
  console.log(context);

  function back(): void {
    alert('Go Back');
    props.onNavigationExit('default');
  }

  return (
    <>
      <h1 key={'title'}>Settings</h1>
      <PrimaryButton text="Primary" onClick={back.bind(this)} allowDisabledFocus />
    </>
  );
};