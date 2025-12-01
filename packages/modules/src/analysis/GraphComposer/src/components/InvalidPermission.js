// @flow
import { withNamespaces } from 'react-i18next';

import { AppStatus } from '@kitman/components';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import type { I18nProps } from '@kitman/common/src/types/i18n';

const InvalidPermission = (props: I18nProps<{}>) => {
  const locationAssign = useLocationAssign();
  return (
    <AppStatus
      confirmAction={() => locationAssign('/')}
      confirmButtonText={props.t('Return to Dashboard')}
      header={props.t('Permission error')}
      message={props.t(
        'Please contact your account admin or support to assign the correct permissions'
      )}
      status="message"
      isEmbed
    />
  );
};

export const InvalidPermissionTranslated = withNamespaces()(InvalidPermission);
export default InvalidPermission;
