// @flow
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { colors } from '@kitman/common/src/variables';
import { IconButton, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  icon?: string,
  title?: string,
  infoMessage?: string,
  onActionButtonClick?: Function,
  actionButtonText?: string,
};

const styles = {
  root: css`
    height: 100%;
    min-height: 348px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-style: normal;
    .iconButton {
      border: unset !important;
      background: unset;
      min-width: unset;
      padding: unset;
      cursor: unset;
    }
    .iconButton::before {
      color: ${colors.grey_100};
      font-size: 35px;
    }
  `,
  title: css`
    color: ${colors.grey_300};
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    letter-spacing: 0.35px;
    margin: 5px 0;
  `,
  info: css`
    color: ${colors.grey_300};
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: -0.408px;
  `,
};

function EmptyState(props: I18nProps<Props>) {
  const hasActionButton = typeof props.onActionButtonClick === 'function';
  return (
    <div css={styles.root}>
      <div>
        <IconButton icon={props?.icon || ''} />
      </div>
      <p css={styles.title}>{props?.title || props.t('No data available')}</p>
      <p css={styles.info}>{props?.infoMessage || ''}</p>
      {hasActionButton && (
        <TextButton
          onClick={props.onActionButtonClick}
          type="primary"
          kitmanDesignSystem
          text={props.actionButtonText}
        />
      )}
    </div>
  );
}

export const EmptyStateTranslated: ComponentType<Props> =
  withNamespaces()(EmptyState);
export default EmptyState;
