// @flow
import type { Node, ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import {
  SlidingPanelResponsive as SlidingPanel,
  TextButton,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useExportSettings } from './Context';

export type Props = {
  title: string,
  isOpen: boolean,
  children: Node,
  requiredKeys?: Array<string>,
  saveButtonTitle?: string,
};

const styles = {
  content: css`
    flex: 1;
    overflow: auto;
    border-bottom: solid 2px ${colors.neutral_300};
    display: flex;
    flex-direction: column;
  `,
  actions: css`
    display: flex;
    justify-content: space-between;
    padding: 24px;
  `,
};

function Panel(props: I18nProps<Props>) {
  const { onSave, onCancel, formState } = useExportSettings();

  const somethingStillRequired = props.requiredKeys?.some(
    (element) => !formState[element]
  );

  return (
    <SlidingPanel
      title={props.title}
      isOpen={props.isOpen}
      onClose={onCancel}
      animate
    >
      <div css={styles.content}>{props.children}</div>

      <div css={styles.actions}>
        <TextButton
          onClick={onCancel}
          text={props.t('Cancel')}
          kitmanDesignSystem
        />
        <TextButton
          onClick={onSave}
          type="primary"
          text={props.saveButtonTitle || props.t('Download')}
          kitmanDesignSystem
          isDisabled={somethingStillRequired}
        />
      </div>
    </SlidingPanel>
  );
}

export const PanelTranslated: ComponentType<Props> = withNamespaces()(Panel);
export default Panel;
