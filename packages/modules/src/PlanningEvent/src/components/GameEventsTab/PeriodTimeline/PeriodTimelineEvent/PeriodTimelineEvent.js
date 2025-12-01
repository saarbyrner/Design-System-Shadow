// @flow
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import type {
  GameActivity,
  GameActivityStorage,
} from '@kitman/common/src/types/GameEvent';
import { doesOwnGoalExistForEvent } from '@kitman/common/src/utils/planningEvent/gameActivityUtils';

import { renderEventSrc } from '../../utils';
import periodStyles from '../styles';

type Props = {
  timelineActivities: Array<GameActivity>,
  customClass: string,
  minute: number,
  timelinePoint: string,
  disableMinute?: boolean,
  setSelectedEvent: (GameActivity) => void,
};

const PeriodTimelineEvent = (props: Props) => {
  const {
    timelineActivities,
    customClass,
    minute,
    timelinePoint,
    disableMinute,
    setSelectedEvent,
  } = props;
  const { styles } = periodStyles;

  const { localGameActivities: gameActivities } =
    useSelector<GameActivityStorage>(
      (state) => state.planningEvent.gameActivities
    );

  const [showMultipleEvents, setShowMultipleEvents] = useState(false);

  const isOwnGoalFFEnabled = window.getFlag('league-ops-game-events-own-goal');

  const getTimelinePointClassForMinute = () => {
    if (timelinePoint === 'start') return 'startPeriod';
    if (timelinePoint === 'end') return 'endPeriod';
    return '';
  };

  const renderSingleEventIconArea = (currentActivity: GameActivity) => {
    const isOwnGoalEvent =
      isOwnGoalFFEnabled &&
      currentActivity.kind === eventTypes.goal &&
      doesOwnGoalExistForEvent(gameActivities, currentActivity);

    return (
      <div
        className="event_image"
        key={currentActivity?.id || currentActivity?.activityIndex}
      >
        <img
          src={renderEventSrc(
            isOwnGoalEvent ? eventTypes.own_goal : currentActivity.kind
          )}
          alt={isOwnGoalEvent ? eventTypes.own_goal : currentActivity.kind}
          onClick={() => setSelectedEvent(currentActivity)}
        />
      </div>
    );
  };

  const renderMultipleEventIconArea = () => (
    <>
      <div
        className="event_total_count"
        onFocus={() => setShowMultipleEvents(true)}
        onMouseOver={() => setShowMultipleEvents(true)}
      >
        +{timelineActivities.length}
      </div>
      {showMultipleEvents && (
        <div
          data-testid="multiple-events-container"
          css={styles.multipleEventRow}
          onMouseLeave={() => setShowMultipleEvents(false)}
          onBlur={() => setShowMultipleEvents(false)}
        >
          {timelineActivities.map((activity) =>
            renderSingleEventIconArea(activity)
          )}
        </div>
      )}
    </>
  );

  return (
    <div css={styles.timelineEventContainer}>
      {timelineActivities.length > 0 && (
        <div css={styles.eventInfo} className={customClass}>
          {timelineActivities.length === 1
            ? renderSingleEventIconArea(timelineActivities[0])
            : renderMultipleEventIconArea()}
        </div>
      )}
      {!disableMinute && (
        <span
          css={
            timelinePoint !== 'middle'
              ? styles.startEndPeriodTime
              : styles.middlePeriodTime
          }
          className={getTimelinePointClassForMinute()}
        >
          {minute}`
        </span>
      )}
    </div>
  );
};

export default PeriodTimelineEvent;
