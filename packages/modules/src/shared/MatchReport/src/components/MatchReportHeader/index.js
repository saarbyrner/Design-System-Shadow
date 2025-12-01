// @flow
import { withNamespaces } from 'react-i18next';
import { useMemo } from 'react';
import type { ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Game } from '@kitman/common/src/types/Event';
import type {
  GameScores,
  TeamsPenalties,
} from '@kitman/common/src/types/GameEvent';
import { Scoreline, TextButton } from '@kitman/components';
import { matchReportEventListGameView } from '@kitman/common/src/consts/gameEventConsts';
import styles from '@kitman/modules/src/shared/MatchReport/styles';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import {
  getPenaltyShootoutActivities,
  getTeamPenaltyShootoutScores,
} from '../../utils/matchReportUtils';
import PenaltyDot from '../MatchReportScorelineSubHeader/PenaltyDot';

type Props = {
  isReadOnly: boolean,
  event: ?Game,
  currentView: string,
  setCurrentView: Function,
  gameScores: GameScores,
  setGameScores: Function,
  penaltyActivities: TeamsPenalties,
};

export type TranslatedProps = I18nProps<Props>;

const MatchReportHeader = (props: TranslatedProps) => {
  const { preferences } = usePreferences();

  const homePenaltyScore = useMemo(() => {
    if (preferences?.league_match_report_penalty_shootout)
      return getTeamPenaltyShootoutScores(
        props.penaltyActivities.homePenalties
      );
    return 0;
  }, [props.penaltyActivities.homePenalties]);

  const awayPenaltyScore = useMemo(() => {
    if (preferences?.league_match_report_penalty_shootout) {
      return getTeamPenaltyShootoutScores(
        props.penaltyActivities.awayPenalties
      );
    }
    return 0;
  }, [props.penaltyActivities.awayPenalties]);

  const renderMatchReportEventListViewToggle = () => (
    <div css={styles.buttonContainer} className="penalty-toggle-container">
      <TextButton
        onClick={() =>
          props.setCurrentView(matchReportEventListGameView.regular)
        }
        text={props.t('Regular / Extra Time')}
        type={
          props.currentView === matchReportEventListGameView.regular
            ? 'primary'
            : 'secondary'
        }
        kitmanDesignSystem
      />
      <TextButton
        onClick={() =>
          props.setCurrentView(matchReportEventListGameView.penalty)
        }
        text={props.t('Penalty Shoot-out')}
        type={
          props.currentView === matchReportEventListGameView.penalty
            ? 'primary'
            : 'secondary'
        }
        kitmanDesignSystem
      />
    </div>
  );

  const renderPenaltyScoreInfo = () => (
    <div css={styles.matchReportPenaltyInfoArea}>
      {getPenaltyShootoutActivities(props.penaltyActivities.homePenalties).map(
        (penalty) => (
          <PenaltyDot
            key={penalty.absolute_minute}
            penaltyActivities={props.penaltyActivities}
            teamType="homePenalties"
            penalty={penalty}
          />
        )
      )}
      <span>
        ({homePenaltyScore} - {awayPenaltyScore})
      </span>
      {getPenaltyShootoutActivities(props.penaltyActivities.awayPenalties).map(
        (penalty) => (
          <PenaltyDot
            key={penalty.absolute_minute}
            penaltyActivities={props.penaltyActivities}
            teamType="awayPenalties"
            penalty={penalty}
          />
        )
      )}
    </div>
  );

  return (
    <div css={styles.matchReportHeaderWrapper}>
      <div
        css={styles.matchReportScorelineArea}
        className={
          preferences?.league_match_report_penalty_shootout
            ? 'multiElement'
            : 'onlyScoreline'
        }
      >
        {preferences?.league_match_report_penalty_shootout &&
          renderMatchReportEventListViewToggle()}
        <Scoreline
          gameEvent={props.event}
          gameScores={props.gameScores}
          setGameScores={props.setGameScores}
          isEditScoreDisabled={props.isReadOnly}
        />
      </div>
      {preferences?.league_match_report_penalty_shootout &&
        renderPenaltyScoreInfo()}
    </div>
  );
};
export const MatchReportHeaderTranslated: ComponentType<Props> =
  withNamespaces()(MatchReportHeader);
export default MatchReportHeader;
