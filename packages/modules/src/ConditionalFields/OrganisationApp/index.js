// @flow
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';

import {
  AppStatus,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';

import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';

import Toasts from '@kitman/modules/src/Toasts';

import { parseOrganisationIdFromLocation } from '@kitman/modules/src/LeagueOperations/technicalDebt/utils';
import { OrganisationAppTranslated as App } from './src/App';

export default () => {
  const locationPathname = useLocationPathname();
  const { isLoading, hasFailed, isSuccess } = useGlobal();

  const { data: organisation } = useGetOrganisationQuery();

  const organisationId =
    parseOrganisationIdFromLocation(locationPathname) ?? organisation.id;

  if (hasFailed) {
    return <AppStatus status="error" isEmbed />;
  }
  if (isLoading) {
    return <DelayedLoadingFeedback />;
  }
  if (isSuccess) {
    return (
      <ErrorBoundary>
        <App organisationId={organisationId} />
        <Toasts />
      </ErrorBoundary>
    );
  }

  return null;
};
