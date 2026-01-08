// @flow
import type { Game } from '@kitman/common/src/types/Event';
import type { GameScores } from '@kitman/common/src/types/GameEvent';
import styles from './styles';

type Props = {
  gameEvent: ?Game,
  gameScores: GameScores,
  setGameScores: Function,
  isEditScoreDisabled?: boolean,
};

export const ORG_SCORE_TEST_ID = 'org_score';
export const OPPONENT_SCORE_TEST_ID = 'opponent_score';

const Scoreline = (props: Props) => {
  const { gameEvent, gameScores, setGameScores } = props;

  const orgInfo = gameEvent
    ? gameEvent.organisation_team || gameEvent.squad
    : { logo_full_path: '', name: '' };

  const opponentInfo = gameEvent
    ? gameEvent.opponent_squad || gameEvent.opponent_team
    : { logo_full_path: '', name: '' };

  const handleFocus = (event) => {
    event.target.select();
  };

  const handleScoreInputChange = (score: number | string, type: string) => {
    if (score.toString().length > 2) return;
    const finalResult = score !== '' ? score : 0;
    if (type === 'ORG')
      setGameScores({ ...gameScores, orgScore: +finalResult });
    else setGameScores({ ...gameScores, opponentScore: +finalResult });
  };

  return (
    <div css={styles.scoreContainer}>
      <img
        data-testid="org-crest"
        src={orgInfo?.logo_full_path ?? '/img/kitman_default_crest.svg'}
        alt={gameEvent?.organisation_team?.name}
      />
      <input
        className="score score__org"
        data-testid={ORG_SCORE_TEST_ID}
        type="number"
        onFocus={handleFocus}
        onWheel={(e) => e.target.blur()}
        onChange={(e) => handleScoreInputChange(e.target.value, 'ORG')}
        min="0"
        value={gameScores?.orgScore?.toString()}
        disabled={props.isEditScoreDisabled}
      />
      <span>-</span>
      <input
        className="score score__opponent"
        data-testid={OPPONENT_SCORE_TEST_ID}
        type="number"
        onFocus={handleFocus}
        min="0"
        onWheel={(e) => e.target.blur()}
        onChange={(e) => handleScoreInputChange(e.target.value, 'OPPONENT')}
        value={gameScores?.opponentScore?.toString()}
        disabled={props.isEditScoreDisabled}
      />
      <img
        data-testid="opponent-crest"
        src={opponentInfo?.logo_full_path ?? '/img/kitman_default_crest.svg'}
        alt={opponentInfo?.name}
      />
    </div>
  );
};

export default Scoreline;
