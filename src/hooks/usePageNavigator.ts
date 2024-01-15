import * as React from "react";
import { useState, useEffect } from 'react';
import { SettingsView, TemplateView } from "../extensions/companyTemplates/components/views";

export default function usePageNavigator(startNode: 'default' | 'settings'): { selectedPage: JSX.Element } {
  const [selectedNavigation, setSelectedNavigation] = useState<'default' | 'settings'>(startNode);
  const [page, setPage] = useState<JSX.Element>(React.createElement(TemplateView));

  async function navigateTo(navigationNode: 'default' | 'settings'): Promise<void> {
    setSelectedNavigation(navigationNode);
  }

  async function navigator(): Promise<void> {
    switch (selectedNavigation) {
      case 'settings':
        setPage(React.createElement(SettingsView, { onNavigationExit: navigateTo }));
        break;
      default:
        setPage(React.createElement(TemplateView));
    }
  }

  useEffect(() => {
    console.log(selectedNavigation);
    navigator().catch(er => console.log(er));
  }, [selectedNavigation]);

  useEffect(() => {
    setSelectedNavigation(startNode);
    navigator().catch(er => console.log(er));
  }, [startNode]);

  return { selectedPage: page };
}