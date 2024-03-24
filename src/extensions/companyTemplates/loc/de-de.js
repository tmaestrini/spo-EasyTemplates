define([], function () {
  return {
    // Common
    Common: {
      Template: 'Vorlage',
      Templates: 'Vorlagen',
      CancelButtonText: 'Abbrechen',
      OKButtonText: 'OK',
    },
    // CategoryFilter.tsx
    CategoryFilter: {
      DropdownPlaceholder: 'nach Kategorien',
      DropdownPlaceholderFallback: 'Kategorien filtern',
    },
    // CopyTemplatesButton.tsx
    CopyTemplatesButton: {
      CopyTemplatesButtonText: '{0} Vorlage(n) kopieren',
      CopiedSuccessfullyMessage: 'erfolgreich kopiert!',
    },
    // SettingsView.tsx
    SettingsView: {
      Title: 'Einstellungen',
      TemplateRepository: 'Vorlagen Repository',
      TemplateRepositoryDescription: `Wähle die SharePoint Site und Liste, welche die Vorlagen enthalten. Es ist eine sehr gute Idee <a href="https://learn.microsoft.com/en-us/sharepoint/organization-assets-library" target='_blank' rel="noreferrer noopener" data-interception="off">dafür eine 'organization assets library' (genauer: <strong>OfficeTemplateLibrary</strong>)</a> als Vorlagenverwaltungs-Bibliothek zu verwenden.`,
      SelectSite: 'Site wählen',
      SelectSites: 'Sites wählen',
      FilterSites: 'Sites filtern',
      SelectListLabel: 'Vorlagenbibliothek wählen',
      SelectListPlaceholder: 'Wähle die Bibliothek, welche die Vorlagen enthält',
      SaveSettingsButtonText: 'Einstellungen speichern',
      SavingInProgress: 'Einstellungen werden gespeichert...',
      TemplateDefinitionTitle: 'Vorlagen-Definition',
    },
    // SettingsTemplateDefinition.tsx
    SettingsTemplateDefinition: {
      TemplateFieldFieldPickerLabel: 'Feld, das die Kategorie enthält',
      TemplateFieldFieldPickerPlaceholder: 'Kategorie-Feld auswählen',
    },
    // StandardView.tsx
    StandardView: {
      Title: 'Vorlage(n) aus der Vorlagenbibliothek wählen',
      FilterTemplatesLabel: 'Vorlagen filtern',
      LoadingTemplatesLabel: 'Lade Vorlagen...',
      SearchBoxPlaceholder: 'Templates durchsuchen und <ENTER> drücken',
    },
  }
});