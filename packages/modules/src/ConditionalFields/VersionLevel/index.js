// @flow

import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';

import {
  AppStatus,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';

import Toasts from '@kitman/modules/src/Toasts';

import {
  parseRulesetIdFromLocation,
  parseOrganisationIdFromLocation,
  parseVersionIdFromLocation,
} from '../shared/routes/utils';

import { VersionAppTranslated as App } from './src/App';

export default () => {
  const { isLoading, hasFailed, isSuccess } = useGlobal();

  const locationPathname = useLocationPathname();

  const { data: organisation } = useGetOrganisationQuery();

  const organisationId =
    parseOrganisationIdFromLocation(locationPathname) ?? organisation.id;

  const rulesetId = parseRulesetIdFromLocation(locationPathname);

  const versionId = parseVersionIdFromLocation(locationPathname);

  if (hasFailed) {
    return <AppStatus status="error" isEmbed />;
  }
  if (isLoading) {
    return <DelayedLoadingFeedback />;
  }
  if (isSuccess) {
    return (
      <ErrorBoundary>
        <App
          organisationId={organisationId}
          rulesetId={rulesetId}
          versionId={versionId}
        />
        <Toasts />
      </ErrorBoundary>
    );
  }
  return null;
};
