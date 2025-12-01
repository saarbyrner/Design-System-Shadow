// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import type { I18nProps } from '@kitman/common/src/types/i18n';

import styles from '../../../VersionBuildViewTab/styles';

type Props = {
  order: number,
};

const QuestionsListHeader = ({ order, t }: I18nProps<Props>) => {
  return (
    <div>
      <h3 css={styles.askTitle}>{t('Ask')}</h3>
      <div css={styles.questionHeader}>
        <h4 css={styles.conditionHeaderTitle}>
          {t('Question {{count}}', { count: order })}
        </h4>
      </div>
    </div>
  );
};

export const QuestionsListHeaderTranslated: ComponentType<Props> =
  withNamespaces()(QuestionsListHeader);

export default QuestionsListHeader;
