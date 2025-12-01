// @flow
import { useSelector } from 'react-redux';
import { TextTag } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getInactiveUsersWithVisibilityIssues } from '../redux/selectors';

type Props = {};

function VisibilityIssuesIndicator(props: I18nProps<Props>) {
  const inactiveUsersWithVisibilityIssues = useSelector(
    getInactiveUsersWithVisibilityIssues
  );

  return (
    <>
      {inactiveUsersWithVisibilityIssues.length !== 0 && (
        <TextTag
          content={`${inactiveUsersWithVisibilityIssues.length} ${
            inactiveUsersWithVisibilityIssues.length === 1
              ? props.t('user')
              : props.t('users')
          } with visibility issues`}
          backgroundColor={colors.red_100_20}
          fontSize={12}
          textColor={colors.grey_300}
        />
      )}
    </>
  );
}

export const VisibilityIssuesIndicatorTranslated = withNamespaces()(
  VisibilityIssuesIndicator
);
export default VisibilityIssuesIndicator;
