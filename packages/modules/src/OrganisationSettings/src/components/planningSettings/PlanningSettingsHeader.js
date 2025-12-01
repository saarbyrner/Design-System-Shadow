// @flow
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {};

const styles = {
  header: css`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin: 5px 0 30px;
  `,
  title: css`
    color: ${colors.grey_300};
    font-size: 24px;
    margin: 0;
  `,
};

const PlanningSettingsHeader = (props: I18nProps<Props>) => {
  return (
    <header css={styles.header}>
      <h5 css={styles.title} className="organisationPlanningSettings__title">
        {props.t('Planning')}
      </h5>
    </header>
  );
};

export const PlanningSettingsHeaderTranslated = withNamespaces()(
  PlanningSettingsHeader
);
export default PlanningSettingsHeader;
