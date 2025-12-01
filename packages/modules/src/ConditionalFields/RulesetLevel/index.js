// @flow

import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';

import {
  AppStatus,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';

import Toasts from '@kitman/modules/src/Toasts';

import {
  parseRulesetIdFromLocation,
  parseOrganisationIdFromLocation,
} from '../shared/routes/utils';

import { RulesetAppTranslated as App } from './src/App';

export default () => {
  const { isLoading, hasFailed, isSuccess } = useGlobal();

  const locationPathname = useLocationPathname();
  const locationSearch = useLocationSearch();

  const { data: organisation } = useGetOrganisationQuery();

  const organisationId =
    parseOrganisationIdFromLocation(locationPathname) ?? organisation.id;

  const rulesetId = parseRulesetIdFromLocation(locationPathname);

  const rulesetTitle = locationSearch.get('title');

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
          title={rulesetTitle}
        />
        <Toasts />
      </ErrorBoundary>
    );
  }

  return null;
};
