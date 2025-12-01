// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {};

const style = {
  medicalHeader: css`
    background-color: ${colors.p06};
    margin-bottom: 0;
    ${!window.featureFlags['update-perf-med-headers'] && ` padding: 24px;`}
    ${window.featureFlags['update-perf-med-headers'] &&
    `padding: 1.58em 1.70em 1.14em`}
  `,
  head: css`
    align-items: center;
    display: flex;
    justify-content: space-between;
  `,
  title: css`
    color: ${colors.grey_300};
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  `,
};

const AppHeader = (props: I18nProps<Props>) => {
  return (
    <header css={style.medicalHeader}>
      <div css={style.head}>
        <h2 css={style.title}>{props.t('Medical')}</h2>
      </div>
    </header>
  );
};

export const AppHeaderTranslated = withNamespaces()(AppHeader);
export default AppHeader;
