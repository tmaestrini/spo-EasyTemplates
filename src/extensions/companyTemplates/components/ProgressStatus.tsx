import * as React from "react";
import { DefaultButton, FocusTrapCallout, FocusZone, Icon, PrimaryButton, Stack, Text } from "@fluentui/react";
import { TemplatesManagementContext } from "../contexts/TemplatesManagementContext";
import { getThemeColor } from "../themeHelper";

type ProgressStatusProps = {
}

export const ProgressStatus: React.FunctionComponent<ProgressStatusProps> = (props: React.PropsWithChildren<ProgressStatusProps>) => {
  const { copiedFiles, setCopiedFiles } = React.useContext(TemplatesManagementContext);
  const fillColor = getThemeColor("themeDarkAlt");

  function resetCopyProcess(): void {
    setCopiedFiles(undefined, '');
  }

  return <>
    {(copiedFiles && copiedFiles.files) &&
      <>
        {copiedFiles.success && <Icon id="progress-status" iconName="CheckMark" styles={{ root: { color: fillColor } }} />}
        {!copiedFiles.success && <Icon id="progress-status" iconName="Cancel" />}
        {/* <IconButton id="progress-status" iconProps={{ iconName: "Completed" }} title="Progress" disabled={copiedFiles?.success} allowDisabledFocus /> */}
        <FocusTrapCallout
          styles={{
            root: {
              width: 320,
              padding: '20px 24px',
            }
          }}
          role="alertdialog"
          gapSpace={0}
          target={`#progress-status`}
          onDismiss={resetCopyProcess}
          setInitialFocus
        >
          <Text block variant="large" styles={{ root: { marginBottom: '1rem' } }}>Copy templates</Text>
          <Text block styles={{ root: { marginBottom: '0.5rem' } }}>{copiedFiles.success ? <Icon iconName="Completed" /> : <Icon iconName="ErrorBadge" />} {copiedFiles.message}</Text>
          <FocusZone isCircularNavigation>
            <Stack horizontal>
              {copiedFiles.success && <PrimaryButton onClick={resetCopyProcess}>OK</PrimaryButton>}
              {!copiedFiles.success && <DefaultButton onClick={resetCopyProcess}>Cancel</DefaultButton>}
            </Stack>
          </FocusZone>
        </FocusTrapCallout>
      </>
    }
  </>
}