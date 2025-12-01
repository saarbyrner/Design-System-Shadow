// @flow
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
// eslint-disable-next-line import/no-named-default
import { default as ManageAthletesLegacyApp } from '@kitman/modules/src/ManageAthletes';

import { ListAthletesAppTranslated as App } from './src/App';

export default () => {
  // Horrible negation I know, but it's temporary.
  // Essentially, if the feature flag is off, don't exectue what's not needed.
  // The legacy app will be removed in future. We needed to migrate it to KM-FE in order to do this work
  if (!window.featureFlags['league-ops-manage-athlete-league-level']) {
    return <ManageAthletesLegacyApp />;
  }

  const { isLoading, hasFailed, isSuccess } = useGlobal();

  const { isAssociationAdmin, isLeagueStaffUser } = useLeagueOperations();

  if (hasFailed) {
    return <AppStatus status="error" isEmbed />;
  }
  if (isLoading) {
    return <DelayedLoadingFeedback />;
  }
  if (isSuccess) {
    return (
      <App
        isAssociationAdmin={isAssociationAdmin}
        isLeagueStaffUser={isLeagueStaffUser}
      />
    );
  }

  return null;
};
