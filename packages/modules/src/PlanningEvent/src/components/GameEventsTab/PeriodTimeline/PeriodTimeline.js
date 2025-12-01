// @flow
import { isEqual } from 'lodash';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getCurrentLocalPeriods } from '@kitman/common/src/utils/planningEvent/gamePeriodUtils';
import useWindowSize from '@kitman/common/src/hooks/useWindowSize';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  GameActivity,
  GameActivityStorage,
  GamePeriod,
  GamePeriodStorage,
} from '@kitman/common/src/types/GameEvent';
import {
  eventTypes,
  viewableEventTypes,
} from '@kitman/common/src/consts/gameEventConsts';
import { checkIfActivityExistsWithinPeriod } from '@kitman/common/src/utils/planningEvent/gameActivityUtils';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import periodStyles from './styles';
import { PeriodTranslated as Period } from './Period/Period';

type Props = {
  isImportedGame?: boolean,
  selectedPeriod: GamePeriod | null,
  setSelectedPeriod: (GamePeriod) => void,
  totalGameTime: number,
  onDeletePeriod: (GamePeriod, boolean) => void,
  setSelectedEvent: Function,
  isCustomPeriods: boolean,
};

const PeriodTimeline = (props: I18nProps<Props>) => {
  const { preferences } = usePreferences();

  const { localGameActivities: gameActivities } =
    useSelector<GameActivityStorage>(
      (state) => state.planningEvent.gameActivities
    );
  const { localEventPeriods } = useSelector<GamePeriodStorage>(
    (state) => state.planningEvent.eventPeriods
  );

  const eventPeriods = getCurrentLocalPeriods(localEventPeriods);

  const {
    selectedPeriod,
    setSelectedPeriod,
    setSelectedEvent,
    isImportedGame,
  } = props;

  const { styles, currentProgressChevron } = periodStyles;
  const { windowWidth, tabletSize } = useWindowSize();

  const lastPeriod = eventPeriods[eventPeriods.length - 1];
  const isLastPeriodNotSelected =
    selectedPeriod && selectedPeriod.localId
      ? selectedPeriod?.localId !== lastPeriod?.localId
      : selectedPeriod?.id !== lastPeriod?.id;

  const isMatchDayGame = isImportedGame && preferences?.league_game_team;

  const isPeriodDeletable = (index: number) => {
    if (isMatchDayGame && index === 0) return false;
    return eventPeriods.length > 1;
  };

  const getPeriodActivities = (period: ?GamePeriod) => {
    const checkIfActivityIsAMidGameFormationChange = (activity: GameActivity) =>
      activity.kind === eventTypes.formation_change &&
      +activity.absolute_minute !== +period?.absolute_duration_start;

    const isLastPeriodSelected = !!(
      eventPeriods.length > 0 &&
      period &&
      isEqual(period, eventPeriods[eventPeriods.length - 1])
    );

    // Gets the period activities, api saved and local unsaved, makes sure they're activities that are viewable via the
    // event list and then sorts them in timeline order
    return gameActivities
      .map((activity, index) => ({ ...activity, activityIndex: index }))
      .filter(
        (activity) =>
          (viewableEventTypes.includes(activity.kind) ||
            checkIfActivityIsAMidGameFormationChange(activity)) &&
          checkIfActivityExistsWithinPeriod({
            activity,
            currentPeriod: period,
            isLastPeriodSelected,
          })
      )
      .sort((a, b) => {
        // sorts on the absolute minute if they are not of equal values
        if (+a.absolute_minute !== +b.absolute_minute) {
          return +a.absolute_minute - +b.absolute_minute;
        }
        // if the absolute minute is the same sorts on the saved ID values if they both exist
        if (a.id && b.id) return a.id - b.id;
        // if at least one activity is unsaved refers to the local activityIndex instead
        return a.activityIndex - b.activityIndex;
      });
  };

  const renderFullTimeline = () => (
    <div css={styles.periodTimeline}>
      <div css={styles.periodBar}>
        {eventPeriods.map((eventPeriod, index) => (
          <Period
            {...props}
            eventPeriod={eventPeriod}
            periodIndex={index}
            numOfPeriods={eventPeriods.length}
            periodActivities={getPeriodActivities(eventPeriod)}
            setSelectedEvent={setSelectedEvent}
            isPeriodDeletable={isPeriodDeletable(index)}
          />
        ))}
      </div>
      <span css={styles.finishText}>{props.t('FT')}</span>
    </div>
  );

  const renderSingleTimeline = () => {
    const periodIndex: number = eventPeriods.findIndex((period) =>
      period?.localId
        ? period?.localId === selectedPeriod?.localId
        : period.id === selectedPeriod?.id
    );

    const previousPeriod = (): void =>
      setSelectedPeriod(eventPeriods[periodIndex - 1]);

    const nextPeriod = (): void =>
      setSelectedPeriod(eventPeriods[periodIndex + 1]);

    return (
      <div css={styles.periodTimeline}>
        <i
          data-testid="icon-back-chevron"
          className="icon-next-left"
          css={currentProgressChevron(
            selectedPeriod?.id !== eventPeriods[0]?.id,
            false
          )}
          onClick={previousPeriod}
        />
        <Period
          {...props}
          eventPeriod={selectedPeriod}
          periodIndex={periodIndex}
          numOfPeriods={eventPeriods.length}
          periodActivities={getPeriodActivities(selectedPeriod)}
          setSelectedEvent={setSelectedEvent}
          isPeriodDeletable={isPeriodDeletable(periodIndex)}
          isSinglePeriod
        />
        <i
          data-testid="icon-next-chevron"
          className="icon-next-right"
          css={currentProgressChevron(isLastPeriodNotSelected, true)}
          onClick={nextPeriod}
        />
      </div>
    );
  };

  return selectedPeriod ? (
    <div data-testid="PeriodTimeline">
      {windowWidth >= tabletSize
        ? renderFullTimeline()
        : renderSingleTimeline()}
    </div>
  ) : null;
};

export const PeriodTimelineTranslated = withNamespaces()(PeriodTimeline);
export default PeriodTimeline;
