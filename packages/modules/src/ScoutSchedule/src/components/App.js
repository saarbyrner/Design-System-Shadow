// @flow
import { FixtureScheduleViewTranslated as FixtureScheduleView } from '@kitman/modules/src/shared/FixtureScheduleView';
import style from './style';

const ScoutScheduleApp = () => {
  return (
    <div data-testid="ScoutScheduleApp" css={style.layout}>
      <div css={style.content}>
        <FixtureScheduleView />
      </div>
    </div>
  );
};

export default ScoutScheduleApp;
