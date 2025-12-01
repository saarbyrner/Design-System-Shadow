// @flow
import useLastPathSegment from '@kitman/common/src/hooks/useLastPathSegment';
import MatchReport from '@kitman/modules/src/shared/MatchReport';
import style from './style';

const ScoutMatchReportApp = () => {
  const eventId = useLastPathSegment();

  return (
    <div data-testid="ScoutMatchReportApp" css={style.layout}>
      <div css={style.content}>
        <div>
          <MatchReport eventId={eventId} />
        </div>
      </div>
    </div>
  );
};

export default ScoutMatchReportApp;
