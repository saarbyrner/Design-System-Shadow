// @flow
import { useState, useEffect, useRef } from 'react';
import { withNamespaces } from 'react-i18next';
import _isEqual from 'lodash/isEqual';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { InputNumeric, Select, TextButton } from '@kitman/components';
import type { Option } from '@kitman/components/src/Select';
import type {
  Athlete,
  EventAthlete,
  EventUser,
} from '@kitman/common/src/types/Event';
import type {
  GameActivity,
  GamePeriod,
  DisciplinaryReasonOptions,
} from '@kitman/common/src/types/GameEvent';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import {
  findMostRecentFormationsForPeriod,
  doesOwnGoalExistForEvent,
} from '@kitman/common/src/utils/planningEvent/gameActivityUtils';
import useGameEventsModal from '@kitman/modules/src/PlanningEvent/src/hooks/useGameEventsModal';
import { getPlayerNumber } from '@kitman/modules/src/PlanningEvent/src/helpers/utils';

import styles from '../styles';
import { renderEventSrc } from '../../GameEventsTab/utils';
import { checkIfYellowCardTimeIsValid } from '../eventListUtils';
import {
  eventListValueChangeTypes,
  eventListFormatTypes,
} from '../eventListConsts';
import { OwnGoalSwitchTranslated as OwnGoalSwitch } from '../OwnGoalSwitch/OwnGoalSwitch';

type Props = {
  isReadOnly?: boolean,
  currentPeriod?: GamePeriod,
  formationOptions: Array<Option>,
  player: $Shape<EventAthlete & EventUser & Athlete>,
  event: GameActivity,
  listType: string,
  allGameActivities: Array<GameActivity>,
  pitchActivities: Array<GameActivity>,
  onDelete: (?number) => void,
  onChangeEventValue: (?number, string, number) => void,
  checkIfInvalidMinute?: (number, GameActivity) => boolean,
  selectedEvent?: ?GameActivity,
  setSelectedEvent?: (GameActivity) => void,
  playerOptions?: Array<Option>,
  assistValue: ?number,
  setActiveEventSelection: (string) => void,
  reasonOptions?: DisciplinaryReasonOptions,
  handleOwnGoal: (eventIndex: number, markAsOwnGoal: boolean) => void,
  handleClearAssist?: (eventIndex: number) => void,
};

const EventListActivity = (props: I18nProps<Props>) => {
  const {
    isReadOnly,
    allGameActivities,
    listType,
    player,
    // $FlowIgnore[incompatible-use] this is typed. Don't understand why there is an issue.
    event,
    pitchActivities,
    selectedEvent,
    onDelete,
    checkIfInvalidMinute,
    onChangeEventValue,
    setSelectedEvent,
    playerOptions,
    assistValue,
    setActiveEventSelection,
    reasonOptions,
    handleOwnGoal,
    // $FlowIgnore[incompatible-use] the type is correct.
    handleClearAssist,
  } = props;

  const myRef = useRef(null);
  const modal = useGameEventsModal();

  const [eventMinute, setEventMinute] = useState<?number>(0);
  const [additionalTimeMinute, setAdditionalTimeMinute] = useState<?number>(0);
  const [invalidMinuteFlag, setInvalidMinuteFlag] = useState(false);
  const [invalidAdditionalMinuteFlag, setInvalidAdditionalMinuteFlag] =
    useState(false);

  const isSelected = selectedEvent?.activityIndex === event.activityIndex;

  const selectedPlayerValue =
    event.kind === eventTypes.goal ? assistValue : event.relation?.id;

  const playerInfo = event.athlete_id ? player : player?.user;
  const eventPlayerId = event.athlete_id ? event.athlete_id : event.user_id;

  const isEventAPositionChangeEvent = [
    eventTypes.switch,
    eventTypes.sub,
    eventTypes.formation_change,
  ].includes(event.kind);

  // comparison between the current event and the sorted descended most recent position_change mutating event
  const isEventMostRecentPositionChangeEvent = !_isEqual(
    [...pitchActivities]
      // find the first activity that matches these event types in the descending list
      .find((activity) =>
        [
          eventTypes.switch,
          eventTypes.sub,
          eventTypes.formation_change,
        ].includes(activity.kind)
      ),
    event
  );

  const isRedCardEventWithTwoYellowCards =
    pitchActivities.filter((activity) => {
      const activityPlayerId = activity.athlete_id || activity.user_id;
      return (
        activity.kind === eventTypes.yellow &&
        eventPlayerId === activityPlayerId
      );
    }).length === 2;

  const isRedCardEventDisabled =
    event.kind === eventTypes.red && isRedCardEventWithTwoYellowCards;

  const isEventPositionChangeEventDisabled =
    eventListFormatTypes.pitch === listType &&
    isEventAPositionChangeEvent &&
    isEventMostRecentPositionChangeEvent;

  const isEditDisabled =
    isRedCardEventDisabled || isEventPositionChangeEventDisabled;

  const isOwnGoalSwitchChecked = doesOwnGoalExistForEvent(
    allGameActivities,
    event
  );

  const isAssistDropdownDisabled =
    event.kind === eventTypes.goal && isOwnGoalSwitchChecked;

  useEffect(() => {
    setEventMinute(event.absolute_minute);
    setAdditionalTimeMinute(event.additional_minute || 0);
  }, [event]);

  useEffect(() => {
    if (isSelected)
      window.scrollTo({ behavior: 'smooth', top: myRef.current?.offsetTop });
  }, [isSelected]);

  const handleEventMinuteChange = () => {
    const setInvalidStates = () => {
      setEventMinute(event.absolute_minute);
      setInvalidMinuteFlag(true);
    };

    if (eventMinute === null) {
      setInvalidStates();
    } else {
      // this check is so we don't allow the first yellow cards minutes to be greater than the 2nd and vice versa
      const isYellowCardTimeValid = checkIfYellowCardTimeIsValid({
        pitchActivities,
        eventPlayerId: +eventPlayerId,
        event,
        eventMinute: +eventMinute,
      });

      // check to prevent creating the making the 2nd yellow less than the first issued card
      if (
        (checkIfInvalidMinute && checkIfInvalidMinute(+eventMinute, event)) ||
        isYellowCardTimeValid
      ) {
        setInvalidStates();
      } else {
        setInvalidMinuteFlag(false);
        onChangeEventValue(
          event.activityIndex,
          eventListValueChangeTypes.absoluteMinuteChange,
          +eventMinute
        );
      }
    }
  };

  const handleAdditionalTimeMinuteChange = () => {
    if (additionalTimeMinute === null || +additionalTimeMinute < 0) {
      setAdditionalTimeMinute(event?.additional_minute || 0);
      setInvalidAdditionalMinuteFlag(true);
    } else {
      setInvalidAdditionalMinuteFlag(false);
      onChangeEventValue(
        event.activityIndex,
        eventListValueChangeTypes.additionalMinuteChange,
        +additionalTimeMinute
      );
    }
  };

  const handleDropdownChange = async (value: number) => {
    if (value !== selectedPlayerValue) {
      let changeType = eventListValueChangeTypes.playerChange;
      if (event.kind === eventTypes.red || event.kind === eventTypes.yellow)
        changeType = eventListValueChangeTypes.reasonChange;
      if (event.kind === eventTypes.formation_change)
        changeType = eventListValueChangeTypes.formationChange;

      await onChangeEventValue(event.activityIndex, changeType, value);
    }
  };

  const renderPreviousFormationInfo = () => {
    let prevFormationName = '';
    if (props.currentPeriod) {
      const recentFormationsForPeriod = findMostRecentFormationsForPeriod(
        allGameActivities,
        props.currentPeriod
      );

      const formationsBeforeCurrentFormation = recentFormationsForPeriod.filter(
        (activity) => activity.absolute_minute < event.absolute_minute
      );

      const previousFormation = formationsBeforeCurrentFormation[0];

      prevFormationName = previousFormation?.relation?.name;
    }

    return prevFormationName;
  };

  const renderSmallPlayerAvatar = () => (
    <div css={styles.avatarInfo}>
      {playerInfo?.avatar_url && (
        <img alt="playerImage" src={playerInfo.avatar_url} />
      )}
      <div className="avatarDetails">
        <p className="playerName">
          {playerInfo?.fullname || player?.user?.fullname}{' '}
          {event.kind === eventTypes.sub && `(${props.t('Sub-out')})`}
        </p>
        <p className="playerPosition">
          {event.athlete_id
            ? player?.position?.abbreviation
            : player?.user?.role}
        </p>
      </div>
    </div>
  );

  const renderSelectLabelText = () => {
    if (event.kind === eventTypes.switch) return props.t('Player in Field');
    if (event.kind === eventTypes.sub) return props.t('Sub-in');
    if (event.kind === eventTypes.yellow || event.kind === eventTypes.red)
      return props.t('Reason');
    if (event.kind === eventTypes.formation_change) return 'Formation';
    return props.t('Assist');
  };

  const renderDeleteModalTitle = () => {
    if (event.kind === eventTypes.switch)
      return props.t(`Delete Event: Position Swap`);
    if (event.kind === eventTypes.sub)
      return props.t(`Delete Event: Substitution`);
    if (event.kind === eventTypes.yellow)
      return props.t(`Delete Event: Yellow Card`);
    if (event.kind === eventTypes.red) return props.t(`Delete Event: Red Card`);
    if (event.kind === eventTypes.formation_change)
      return props.t(`Delete Event: Formation Change`);

    return props.t(`Delete Event: Goal`);
  };

  const renderDeleteEventModal = () => {
    modal.show({
      title: renderDeleteModalTitle(),
      content: props.t(
        `By deleting this event you will remove the the event on the {{reportView}}`,
        {
          reportView:
            listType === eventListFormatTypes.pitch
              ? props.t('pitch/list view!')
              : props.t('Match Report!'),
          interpolation: { escapeValue: false },
        }
      ),
      onConfirm: () => {
        onDelete(event.activityIndex);
        modal.hide();
      },
    });
  };

  const isPlayersSelectShown =
    (listType === eventListFormatTypes.match &&
      event.kind === eventTypes.sub) ||
    (listType === eventListFormatTypes.pitch &&
      playerOptions &&
      [eventTypes.sub, eventTypes.switch, eventTypes.goal].includes(
        event.kind
      ));

  const isReasonsSelectShown = [eventTypes.red, eventTypes.yellow].includes(
    event.kind
  );

  const isFormationSelectShown =
    listType === eventListFormatTypes.pitch &&
    event.kind === eventTypes.formation_change;

  const isOwnGoalSwitchShown =
    (window.getFlag('league-ops-game-events-own-goal') &&
      listType === eventListFormatTypes.pitch &&
      event.kind === eventTypes.goal) ||
    (window.getFlag('league-ops-match-report-v2') &&
      listType === eventListFormatTypes.match &&
      event.kind === eventTypes.goal);

  const renderMinuteInputs = () => (
    <div className="minute-info">
      <InputNumeric
        label={
          invalidMinuteFlag
            ? props.t('Invalid Time In Period')
            : props.t('Time of Event')
        }
        name="duration"
        value={eventMinute}
        onChange={(value) => setEventMinute(value === '' ? null : +value)}
        onBlur={handleEventMinuteChange}
        descriptor={props.t('Min')}
        size="small"
        inputMode="numeric"
        isInvalid={invalidMinuteFlag}
        disabled={isEditDisabled || isReadOnly}
        kitmanDesignSystem
      />
      {listType === eventListFormatTypes.match && (
        <InputNumeric
          label={
            invalidAdditionalMinuteFlag
              ? props.t('Invalid Input')
              : props.t('Additional Time')
          }
          name="duration"
          value={additionalTimeMinute ?? undefined}
          onChange={(value) =>
            setAdditionalTimeMinute(value === '' ? null : +value)
          }
          onBlur={handleAdditionalTimeMinuteChange}
          descriptor={props.t('Min')}
          size="small"
          inputMode="numeric"
          isInvalid={invalidAdditionalMinuteFlag}
          disabled={isEditDisabled || isReadOnly}
          kitmanDesignSystem
        />
      )}
    </div>
  );

  const renderSelectInputs = () => (
    <div className="player-select-info">
      {isPlayersSelectShown && (
        <Select
          label={renderSelectLabelText()}
          value={selectedPlayerValue}
          options={playerOptions}
          onChange={handleDropdownChange}
          isDisabled={isEditDisabled || isReadOnly || isAssistDropdownDisabled}
          className="playerSelect"
          isClearable={event.kind === eventTypes.goal}
          onClear={() =>
            event.kind === eventTypes.goal &&
            handleClearAssist?.(event.activityIndex)
          }
        />
      )}
      {isReasonsSelectShown && (
        <Select
          label={renderSelectLabelText()}
          value={event.relation?.id}
          options={
            event.kind === eventTypes.yellow
              ? reasonOptions?.yellow_options
              : reasonOptions?.red_options
          }
          onChange={handleDropdownChange}
          isDisabled={isEditDisabled || isReadOnly}
          className="reasonSelect"
        />
      )}
      {isFormationSelectShown &&
        props.formationOptions &&
        props.currentPeriod && (
          <Select
            label={renderSelectLabelText()}
            value={
              event?.relation?.id ||
              findMostRecentFormationsForPeriod(
                allGameActivities,
                props.currentPeriod
              )[1]?.relation?.id
            }
            options={props.formationOptions}
            onChange={handleDropdownChange}
            isDisabled={isEditDisabled || isReadOnly}
            className="formationSelect"
          />
        )}
    </div>
  );

  const renderOwnGoalSwitch = () => {
    if (!isOwnGoalSwitchShown) {
      return null;
    }

    return (
      <OwnGoalSwitch
        gameActivityEvent={event}
        handleOwnGoal={handleOwnGoal}
        disabled={isEditDisabled || isReadOnly}
        isOwnGoalCheckedForEvent={isOwnGoalSwitchChecked}
      />
    );
  };

  const handleEventFocus = () => {
    if (setSelectedEvent) setSelectedEvent(event);
    setActiveEventSelection('');
  };

  return (
    <>
      <div
        ref={myRef}
        className={isSelected && 'selected_event'}
        css={styles.gameEventContainer}
        onClick={handleEventFocus}
        onKeyDown={handleEventFocus}
      >
        <div className="gameEventHeaderRow">
          <div className="gameEventHeaderInfo">
            <img
              alt="eventImage"
              className={`eventImage ${event.kind}`}
              src={
                isOwnGoalSwitchShown && isOwnGoalSwitchChecked
                  ? renderEventSrc(eventTypes.own_goal)
                  : renderEventSrc(event.kind)
              }
            />
            {event.kind === eventTypes.formation_change ? (
              <span className="mid-text">{renderPreviousFormationInfo()}</span>
            ) : (
              <>
                {event.athlete_id && (
                  <span className="light-text">
                    {getPlayerNumber(player?.squad_number)}
                  </span>
                )}
                {renderSmallPlayerAvatar()}
              </>
            )}
          </div>
          <div className="gameEventHeaderDeleteButton">
            {!isEditDisabled && !isReadOnly && (
              <TextButton
                onClick={() => renderDeleteEventModal()}
                iconBefore="icon-bin"
                type="subtle"
                kitmanDesignSystem
              />
            )}
          </div>
        </div>
        <div className="gameEventInfoRow">
          {renderMinuteInputs()}
          {renderSelectInputs()}
          {renderOwnGoalSwitch()}
        </div>
      </div>
      <hr className="eventListBorder" />
      {modal.renderModal()}
    </>
  );
};

export const EventListActivityTranslated = withNamespaces()(EventListActivity);
export default EventListActivity;
