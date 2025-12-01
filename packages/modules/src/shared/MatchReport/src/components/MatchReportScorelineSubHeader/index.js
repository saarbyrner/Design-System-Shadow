// @flow
import { Stack, Typography } from '@kitman/playbook/components';
import { Scoreline } from '@kitman/components';
import type { Game } from '@kitman/common/src/types/Event';
import type {
  GameScores,
  TeamsPenalties,
} from '@kitman/common/src/types/GameEvent';
import colors from '@kitman/common/src/variables/colors';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import {
  getPenaltyShootoutActivities,
  getTeamPenaltyShootoutScores,
} from '../../utils/matchReportUtils';
import PenaltyDot from './PenaltyDot';

type Props = {
  event: ?Game,
  isEditMode?: boolean,
  gameScores: GameScores,
  setGameScores: (GameScores) => void,
  penaltyActivities: TeamsPenalties,
};

const MatchReportScorelineSubHeader = (props: Props) => {
  const { preferences } = usePreferences();

  const homePenaltyScore = preferences?.league_match_report_penalty_shootout
    ? getTeamPenaltyShootoutScores(props.penaltyActivities.homePenalties)
    : 0;

  const awayPenaltyScore = preferences?.league_match_report_penalty_shootout
    ? getTeamPenaltyShootoutScores(props.penaltyActivities.awayPenalties)
    : 0;

  const renderPenaltyScoreDots = () => (
    <Stack
      sx={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '5px',
      }}
    >
      {getPenaltyShootoutActivities(props.penaltyActivities.homePenalties).map(
        (penalty) => (
          <PenaltyDot
            key={penalty?.absolute_minute}
            penaltyActivities={props.penaltyActivities}
            teamType="homePenalties"
            penalty={penalty}
          />
        )
      )}
      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: '600',
          color: colors.grey_200,
          margin: '0px 5px',
        }}
      >
        ({homePenaltyScore} - {awayPenaltyScore})
      </Typography>
      {getPenaltyShootoutActivities(props.penaltyActivities.awayPenalties).map(
        (penalty) => (
          <PenaltyDot
            key={penalty?.absolute_minute}
            penaltyActivities={props.penaltyActivities}
            teamType="awayPenalties"
            penalty={penalty}
          />
        )
      )}
    </Stack>
  );

  return (
    <Stack
      sx={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px 8px',
      }}
    >
      <Scoreline
        gameEvent={props.event}
        gameScores={props.gameScores}
        setGameScores={props.setGameScores}
        isEditScoreDisabled={!props.isEditMode}
      />
      {preferences?.league_match_report_penalty_shootout &&
        renderPenaltyScoreDots()}
    </Stack>
  );
};

export default MatchReportScorelineSubHeader;
