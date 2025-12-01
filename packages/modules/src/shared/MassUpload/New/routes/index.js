// @flow
import { AppStatus } from '@kitman/components';
import i18n from '@kitman/common/src/utils/i18n';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { useBrowserTabTitle } from '@kitman/common/src/hooks';

import useImportConfig from '../utils/useImportConfig';
import { getTitleLabels } from '../utils';
import MassUploadNew from '..';

// This is technically not a router (no usage of react-router dom), but it
// behaves/functions just like one - we take the importType from the url,
// generate the config, and pass it into the component to simulate the route
const MassUploadRouter = () => {
  const importType = window.location.pathname.split('/')[2];
  const eventType = new URLSearchParams(window.location.search).get(
    'event_type'
  );
  const {
    data: permissions,
    isLoading: isPermissionsLoading,
    isSuccess: isPermissionsSuccess,
  } = useGetPermissionsQuery();

  useBrowserTabTitle(getTitleLabels(eventType)[importType]);

  const eventId = new URLSearchParams(window.location.search).get('event_id');

  const importConfig = useImportConfig({ importType, permissions, eventId });

  if (isPermissionsLoading) {
    return <AppStatus message={i18n.t('Loading...')} status="loading" />;
  }

  if (isPermissionsSuccess) {
    if (importConfig?.enabled) {
      return (
        <MassUploadNew
          importType={importType}
          // $FlowIgnore importConfig will never be null
          importConfig={importConfig}
          eventType={eventType}
        />
      );
    }

    window.location.assign('/');
    return null;
  }

  return <AppStatus status="error" />;
};

export default MassUploadRouter;
