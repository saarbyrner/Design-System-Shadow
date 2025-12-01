// @flow
import { withNamespaces } from 'react-i18next';
import type { GameActivity } from '@kitman/common/src/types/GameEvent';

type Props = {
  gameActivities: Array<GameActivity>,
  periodId: number,
};

const PeriodGoalAssistsCell = (props: Props) => {
  const getPeriodGoalAssists = () => {
    const periodAssists = props.gameActivities.map((gameActivity) => {
      if (
        gameActivity.game_period_id === props.periodId &&
        gameActivity.kind === 'assist'
      ) {
        return gameActivity.absolute_minute;
      }

      return '';
    });

    return periodAssists;
  };

  const getPeriodGoalAssistsCellText = () => {
    let cellTextDisplay = '';
    const periodGoalAssists = getPeriodGoalAssists();
    if (periodGoalAssists.length) {
      const cellTextMinutes = [];
      cellTextDisplay = `${periodGoalAssists.length} (`;
      periodGoalAssists.forEach((goalAssist) => {
        cellTextMinutes.push(`${goalAssist}’`);
      });
      cellTextDisplay += `${cellTextMinutes.join(', ')})`;
    }

    return cellTextDisplay;
  };

  return (
    <div data-testid="PeriodGoalAssists|AssistsList">
      {getPeriodGoalAssistsCellText()}
    </div>
  );
};

export const PeriodGoalAssistsCellTranslated = withNamespaces()(
  PeriodGoalAssistsCell
);
export default PeriodGoalAssistsCell;
