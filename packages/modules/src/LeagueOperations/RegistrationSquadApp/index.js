// @flow
import useSquadId from '@kitman/modules/src/LeagueOperations/shared/hooks/useSquadId';
import { AppStatus } from '@kitman/components';
import PageLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/PageLayout';
import HeaderLayout from '../shared/layouts/HeaderLayout';
import { RegistrationSquadAppTranslated as RegistrationSquadApp } from './src/App';

export default () => {
  const { isLoading, isError, isSuccess } = useSquadId();

  const renderContent = () => {
    if (isError) {
      return <AppStatus status="error" isEmbed />;
    }
    if (isLoading) {
      return <HeaderLayout.Loading withActions withAvatar withItems withTabs />;
    }
    if (isSuccess) {
      return <RegistrationSquadApp isLoading={isLoading} />;
    }
    return null;
  };

  return <PageLayout>{renderContent()}</PageLayout>;
};
