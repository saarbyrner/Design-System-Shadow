// @flow
import type { ComponentType } from 'react';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { withNamespaces } from 'react-i18next';
import type { ArchiveReason as ArchiveReasonType } from '@kitman/modules/src/Medical/shared/types/medical/MedicalNote';
import type { I18nProps } from '@kitman/common/src/types/i18n';

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
};

export type Props = {
  reason: ArchiveReasonType,
};

const ArchiveReason = (props: I18nProps<Props>) => {
  return (
    <section css={styles.section}>
      <h4 css={styles.title} data-testid="ArchiveReason|Title">
        {props.t('Archive reason')}
      </h4>
      <div data-testid="ArchiveReason|Value">{props.reason.name}</div>
    </section>
  );
};
export const ArchiveReasonTranslated: ComponentType<Props> =
  withNamespaces()(ArchiveReason);
export default ArchiveReason;
