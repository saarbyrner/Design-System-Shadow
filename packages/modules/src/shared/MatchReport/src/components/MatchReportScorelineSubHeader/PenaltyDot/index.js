// @flow
import type {
  GameActivity,
  TeamsPenalties,
} from '@kitman/common/src/types/GameEvent';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import colors from '@kitman/common/src/variables/colors';
import { Box } from '@kitman/playbook/components';

const PenaltyDot = ({
  teamType,
  penalty,
  penaltyActivities,
}: {
  teamType: string,
  penalty: GameActivity,
  penaltyActivities: TeamsPenalties,
}) => {
  let scoredValue = null;

  if (penalty.id) {
    const foundLinkedActivity = penaltyActivities[teamType].find(
      (activity) =>
        !activity.delete && activity?.game_activity_id === penalty.id
    );
    if (foundLinkedActivity) {
      scoredValue = foundLinkedActivity.kind === eventTypes.goal ? 1 : 0;
    }
  }

  if (penalty.game_activities && penalty.game_activities.length > 0) {
    scoredValue = penalty.game_activities[0].kind === eventTypes.goal ? 1 : 0;
  }

  let penaltyDotStyling = {
    height: '12px',
    width: '12px',
    borderRadius: '50%',
    margin: '6px 3px',
    backgroundColor: colors.neutral_500,
  };

  if (scoredValue)
    penaltyDotStyling = {
      ...penaltyDotStyling,
      backgroundColor: colors.green_100,
    };

  if (scoredValue === 0)
    penaltyDotStyling = {
      ...penaltyDotStyling,
      backgroundColor: colors.red_100,
    };

  return <Box sx={penaltyDotStyling} />;
};

export default PenaltyDot;
