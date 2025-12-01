// @flow

import { AppStatus } from '@kitman/components';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import { MatchReportAppTranslated as MatchReportApp } from './src/components/App';
import PageLayout from '../../LeagueOperations/shared/layouts/PageLayout';

type Props = {
  eventId: number,
  toastDispatch?: Function,
};

const MatchReport = (props: Props) => {
  const { isLoading, hasFailed, isSuccess } = useGlobal();

  const renderContent = () => {
    if (hasFailed) {
      return <AppStatus status="error" isEmbed />;
    }
    if (isLoading) {
      return <PageLayout.Loading />;
    }
    if (isSuccess) {
      return (
        <MatchReportApp
          eventId={props.eventId}
          toastDispatch={props.toastDispatch}
        />
      );
    }
    return null;
  };

  return renderContent();
};

export default MatchReport;
