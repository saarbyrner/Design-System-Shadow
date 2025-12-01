// @flow
import { withNamespaces } from 'react-i18next';
import type {
  GameActivity,
  GamePeriod,
} from '@kitman/common/src/types/GameEvent';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';

type Props = {
  gameActivities: Array<GameActivity>,
  period: GamePeriod,
};

const PeriodStartingPositionCell = (props: Props) => {
  const getPeriodStartingPosition = () => {
    const periodStartingPosition = props.gameActivities.filter(
      (gameActivity) => {
        return (
          gameActivity.game_period_id === props.period?.id &&
          gameActivity.absolute_minute ===
            props.period.absolute_duration_start &&
          gameActivity.kind === eventTypes.formation_position_view_change
        );
      }
    );
    if (periodStartingPosition.length) {
      const athleteStartingPosition: Object = periodStartingPosition[0];
      return athleteStartingPosition.relation?.position?.abbreviation;
    }
    return 'SUB';
  };

  return (
    <div data-testid="PeriodStartingPosition|StartingPosition">
      {getPeriodStartingPosition()}
    </div>
  );
};

export const PeriodStartingPositionCellTranslated = withNamespaces()(
  PeriodStartingPositionCell
);
export default PeriodStartingPositionCell;
