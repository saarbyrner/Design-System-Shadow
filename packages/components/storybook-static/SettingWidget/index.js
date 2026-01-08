// @flow
import { withNamespaces } from 'react-i18next';
import type { Node } from 'react';

import { TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

export type Props = {
  title: string,
  children?: Node,
  actionButtonText?: string,
  onClickActionButton?: Function,
  onClickRestore?: Function,
  kitmanDesignSystem?: boolean,
};

const SettingWidget = (props: I18nProps<Props>) => {
  const baseClass = props.kitmanDesignSystem
    ? 'settingWidget--kitmanDesignSystem'
    : 'settingWidget';

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__headerContainer`}>
        <span className={`${baseClass}__headerText`}>{props.title}</span>
        <div className={`${baseClass}__headerControls`}>
          {props.onClickRestore && (
            <span
              className={`${baseClass}__restoreDefaults`}
              onClick={props.onClickRestore}
            >
              {props.t('Restore Defaults')}
            </span>
          )}
          {props.onClickActionButton && props.actionButtonText && (
            <TextButton
              type="primary"
              text={props.actionButtonText}
              onClick={props.onClickActionButton}
              kitmanDesignSystem={props.kitmanDesignSystem}
            />
          )}
        </div>
      </div>
      <div className={`${baseClass}__content`}>{props.children}</div>
    </div>
  );
};

export const SettingWidgetTranslated = withNamespaces()(SettingWidget);
export default SettingWidget;
