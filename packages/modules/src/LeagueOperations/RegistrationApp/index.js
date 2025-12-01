// @flow
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';

import { AppStatus } from '@kitman/components';
import PageLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/PageLayout';
import { ChangeStatusPanelTranslated as ChangeStatusPanel } from '@kitman/modules/src/LeagueOperations/shared/components/ChangeStatusPanel';
import { RegistrationHomeAppTranslated as RegistrationHomeApp } from '../RegistrationHomeApp';

export default () => {
  // TODO: Move the result of these into a leagueops slice to
  // prevent any suspected race conditions
  const { isLoading, hasFailed, isSuccess } = useGlobal();

  const renderContent = () => {
    if (hasFailed) {
      return <AppStatus status="error" isEmbed />;
    }
    if (isLoading) {
      return <PageLayout.Loading />;
    }
    if (isSuccess) {
      return <RegistrationHomeApp />;
    }
    return null;
  };

  return (
    <PageLayout>
      {renderContent()}
      <ChangeStatusPanel />
    </PageLayout>
  );
};
