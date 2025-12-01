// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import type { I18nProps } from '@kitman/common/src/types/i18n';

import styles from '../../../VersionBuildViewTab/styles';

type Props = {
  parentQuestion: string,
  parentQuestionNumbering: string,
};

const FollowupQuestionHeader = ({
  parentQuestion,
  parentQuestionNumbering,
  t,
}: I18nProps<Props>) => {
  return (
    <div>
      <div css={styles.followupQuestionHeader}>
        <h5
          css={styles.followupQuestionHeaderTitle}
          data-testid="FollowupQuestion|HeaderTitle"
        >
          {t('Follow-up to question {{parentQuestionNumbering}}', {
            parentQuestionNumbering,
          })}
        </h5>
        <h5
          css={styles.followupQuestionHeaderQuestion}
          data-testid="FollowupQuestion|HeaderQuestion"
        >
          {parentQuestion}
        </h5>
      </div>
    </div>
  );
};

export const FollowupQuestionHeaderTranslated: ComponentType<Props> =
  withNamespaces()(FollowupQuestionHeader);

export default FollowupQuestionHeader;
