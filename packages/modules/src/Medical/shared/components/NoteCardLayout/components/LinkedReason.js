// @flow
import type { ComponentType } from 'react';
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  reason: { id: number, name: string },
};

const styles = {
  section: css`
    margin-bottom: 16px;
  `,
  title: css`
    margin-bottom: 8px;
    text-transform: capitalize;
    color: ${colors.grey_100};
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
  `,
  list: css`
    color: ${colors.grey_200};
    padding: 0;
    margin: 0;
  `,
};

const LinkedReason = (props: I18nProps<Props>) => {
  return (
    <div css={styles.section} data-testid="LinkedReason|Root">
      <h4 data-testid="LinkedReason|Title" css={styles.title}>
        {props.t('Reason')}
      </h4>
      <div css={styles.list} data-testid="LinkedReason|LinkedReason">
        {props.t('{{reason}}', {
          reason: props.reason.name,
          interpolation: { escapeValue: false },
        })}
      </div>
    </div>
  );
};

export const LinkedReasonTranslated: ComponentType<Props> =
  withNamespaces()(LinkedReason);
export default LinkedReason;
