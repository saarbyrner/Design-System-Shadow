// @flow

import { withNamespaces } from 'react-i18next';
import { TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useGameEventsModal from '@kitman/modules/src/PlanningEvent/src/hooks/useGameEventsModal';
import type {
  GameActivity,
  GamePeriod,
} from '@kitman/common/src/types/GameEvent';

import periodStyles from '../styles';
import PeriodTimelineEvent from '../PeriodTimelineEvent/PeriodTimelineEvent';

type Props = {
  selectedPeriod: GamePeriod | null,
  setSelectedPeriod: (GamePeriod) => void,
  eventPeriod: GamePeriod,
  periodIndex: number,
  numOfPeriods: number,
  totalGameTime: number,
  isSinglePeriod?: boolean,
  onDeletePeriod: (GamePeriod, boolean) => void,
  periodActivities: Array<GameActivity>,
  setSelectedEvent: (GameActivity) => void,
  isCustomPeriods: boolean,
  isPeriodDeletable?: boolean,
};

const Period = (props: I18nProps<Props>) => {
  const {
    selectedPeriod,
    setSelectedPeriod,
    eventPeriod,
    periodIndex,
    numOfPeriods,
    totalGameTime,
    isSinglePeriod,
    onDeletePeriod,
    periodActivities,
    setSelectedEvent,
    isCustomPeriods,
    isPeriodDeletable,
  } = props;
  const { styles } = periodStyles;
  const modal = useGameEventsModal();

  const isLastPeriod = periodIndex === numOfPeriods - 1;
  const isPeriodSelected = selectedPeriod?.localId
    ? selectedPeriod?.localId === eventPeriod?.localId
    : selectedPeriod?.id === eventPeriod?.id;

  const possibleEventTimes = [...Array(eventPeriod.duration).keys()];
  possibleEventTimes.shift();

  const getActivitiesPerPeriodMin = (minute: number) =>
    periodActivities.filter((activity) => +activity.absolute_minute === minute);

  const renderDeletePeriodModal = () => {
    modal.show({
      title: props.t('Delete Period {{periodNumber}}', {
        periodNumber: periodIndex + 1, // +1 for the offset as a period number visually isnt period 0
      }),
      content: props.t(
        'By deleting this period you will also be deleting any events/activities associated with the period!'
      ),
      onConfirm: () => {
        onDeletePeriod(eventPeriod, isCustomPeriods);
        modal.hide();
      },
    });
  };

  const getPeriodLengthSuffix = () => {
    if (isSinglePeriod) return ' _first_period _last_period';

    const isLastPeriodSuffix = isLastPeriod ? '_last_period' : '_default';
    return periodIndex === 0 ? ' _first_period' : isLastPeriodSuffix;
  };

  const renderEventTimeline = () => (
    <div css={styles.eventLine}>
      <PeriodTimelineEvent
        timelineActivities={getActivitiesPerPeriodMin(
          +eventPeriod?.absolute_duration_start
        )}
        customClass="start_period_events"
        minute={+eventPeriod?.absolute_duration_start}
        timelinePoint="start"
        disableMinute={isSinglePeriod ? false : periodIndex !== 0}
        setSelectedEvent={setSelectedEvent}
      />
      {possibleEventTimes.map((eventTime) => {
        const currentEventMinute =
          eventTime + +eventPeriod?.absolute_duration_start;
        const activitiesInTime = getActivitiesPerPeriodMin(currentEventMinute);

        return activitiesInTime.length > 0 ? (
          <PeriodTimelineEvent
            timelineActivities={activitiesInTime}
            customClass="middle_period_events"
            minute={currentEventMinute}
            timelinePoint="middle"
            setSelectedEvent={setSelectedEvent}
          />
        ) : null;
      })}
      <PeriodTimelineEvent
        timelineActivities={getActivitiesPerPeriodMin(
          isLastPeriod ? totalGameTime : +eventPeriod?.absolute_duration_end
        )}
        customClass="end_period_events"
        minute={
          isLastPeriod ? totalGameTime : +eventPeriod?.absolute_duration_end
        }
        timelinePoint="end"
        setSelectedEvent={setSelectedEvent}
      />
    </div>
  );

  return (
    <>
      <div key={periodIndex} css={styles.periodSection} data-testid="Period">
        <span css={styles.periodTitle}>
          {isSinglePeriod
            ? props.t('Period {{periodNumber}} of {{numOfPeriods}}', {
                periodNumber: periodIndex + 1,
                numOfPeriods,
              })
            : props.t('Period {{periodNumber}}', {
                periodNumber: periodIndex + 1,
              })}
          {isPeriodDeletable && (
            <div data-testid={`period-${periodIndex + 1}-bin-container`}>
              <TextButton
                onClick={() => renderDeletePeriodModal()}
                iconBefore="icon-bin"
                type="subtle"
                kitmanDesignSystem
              />
            </div>
          )}
        </span>
        <div
          css={isPeriodSelected && styles.currentSection}
          className={`period_length ${getPeriodLengthSuffix()}`}
          onClick={() => setSelectedPeriod(eventPeriod)}
        >
          {isPeriodSelected && (
            <span
              data-testid="current-dot-period"
              className="current_dot"
              css={styles.periodDot}
            />
          )}
          <hr
            css={styles.periodLine}
            data-testid={`period-${periodIndex + 1}-line`}
          />
          {renderEventTimeline()}
        </div>
      </div>
      {modal.renderModal()}
    </>
  );
};

export const PeriodTranslated = withNamespaces()(Period);
export default Period;
