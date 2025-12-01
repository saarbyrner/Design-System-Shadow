// @flow
import type { Node } from 'react';
import { ExportSettingsProvider } from './components/Context';
import type { Props as PanelProps } from './components/Panel';
import { PanelTranslated as Panel } from './components/Panel';
import { MuiPanelTranslated as MuiPanel } from './components/MuiPanel';
import Field from './components/Field';
import Toasts from './components/Toasts';
import CommonFields from './components/CommonFields';

type Props = PanelProps & {
  onCancel: Function,
  onSave: Function,
  children: Node,
  settingsKey?: string,
  requiredKeys?: Array<string>,
  mui?: boolean,
};

function ExportSettings(props: Props) {
  return (
    <ExportSettingsProvider
      onSave={props.onSave}
      onCancel={props.onCancel}
      isOpen={props.isOpen}
      settingsKey={props.settingsKey}
      requiredKeys={props.requiredKeys}
    >
      {props.mui ? (
        <MuiPanel {...props}>{props.children}</MuiPanel>
      ) : (
        <Panel {...props}>{props.children}</Panel>
      )}
      <Toasts />
    </ExportSettingsProvider>
  );
}

ExportSettings.Field = Field;
ExportSettings.CommonFields = CommonFields;

export default ExportSettings;
