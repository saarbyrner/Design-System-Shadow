// @flow
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useWindowSize from '@kitman/common/src/hooks/useWindowSize';
import { Select, InfoTooltip, TextButton } from '@kitman/components';
import type { Option } from '@kitman/components/src/Select';
import type { EventUser, Athlete } from '@kitman/common/src/types/Event';
import type {
  GameActivity,
  GamePeriod,
  DisciplinaryReasonOptions,
} from '@kitman/common/src/types/GameEvent';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import { getLinkedActivitiesFromEvent } from '@kitman/common/src/utils/planningEvent/gameActivityUtils';

import styles from './styles';
import { EventListActivityTranslated as EventListActivity } from './EventListActivity/EventListActivity';
import { eventListFormatTypes } from './eventListConsts';
import useGameEventsModal from '../../hooks/useGameEventsModal';

type Props = {
  isReadOnly?: boolean,
  listType: string,
  hideFilters?: boolean,
  currentPeriod?: GamePeriod,
  formationOptions?: Array<Option>,
  players: Array<Athlete>,
  eventTypeFilter: Option,
  setEventTypeFilter: (?Option) => void,
  playerFilter: Option,
  eventTypeFilterOptions: Array<Option>,
  setPlayerFilter: (?Option) => void,
  gameActivities: Array<GameActivity>,
  filteredActivities: Array<GameActivity>,
  pitchActivities: Array<GameActivity>,
  selectedEvent?: ?GameActivity,
  setSelectedEvent?: (GameActivity) => void,
  setActiveEventSelection: (string) => void,
  playerFilterSelectOptions: Array<Option>,
  activeEventSelection: string,
  handleCheckInvalidMinute?: (number, ?GameActivity) => boolean,
  handleEventDeletion: (number) => void,
  handleEventValueChange: (number, string, string) => void,
  handleEventButtonSelection: (string) => void,
  getPlayerSelectOptions?: Function,
  reasonOptions?: DisciplinaryReasonOptions,
  resetEventList: () => void,
  createEventListFormationChange?: () => void,
  staff: Array<EventUser>,
  isMidGamePlayerPositionChangeDisabled: boolean,
  handleOwnGoal: (eventIndex: number, markAsOwnGoal: boolean) => void,
  handleClearAssist?: (eventIndex: number) => void,
};

const EventList = (props: I18nProps<Props>) => {
  const {
    isReadOnly,
    listType,
    hideFilters,
    players,
    currentPeriod,
    formationOptions,
    eventTypeFilter,
    playerFilter,
    setPlayerFilter,
    setActiveEventSelection,
    eventTypeFilterOptions,
    setEventTypeFilter,
    filteredActivities,
    pitchActivities,
    selectedEvent,
    setSelectedEvent,
    activeEventSelection,
    playerFilterSelectOptions,
    handleCheckInvalidMinute,
    handleEventDeletion,
    handleEventValueChange,
    handleEventButtonSelection,
    getPlayerSelectOptions,
    reasonOptions,
    resetEventList,
    createEventListFormationChange,
    staff,
    isMidGamePlayerPositionChangeDisabled,
    handleOwnGoal,
    handleClearAssist,
  } = props;
  const modal = useGameEventsModal();
  const { windowWidth, tabletSize } = useWindowSize();
  const isNotMobile = windowWidth >= tabletSize;

  const renderClearEventsModal = () => {
    modal.show({
      title: props.t('Clear events'),
      content: props.t(
        `Are you sure you want to clear all the events from the event list!`
      ),
      onConfirm: () => {
        resetEventList();
        modal.hide();
      },
    });
  };

  const getAssistPlayerValue = (
    gameActivities: GameActivity[],
    currentActivity: GameActivity
  ) => {
    if (currentActivity.kind === eventTypes.goal) {
      if (currentActivity.game_activities) {
        return currentActivity.game_activities[0]?.athlete_id;
      }

      const linkedActivities = getLinkedActivitiesFromEvent({
        gameActivities,
        event: currentActivity,
        type: eventTypes.assist,
      });
      if (linkedActivities.length === 1) {
        return linkedActivities[0]?.athlete_id;
      }
    }

    return undefined;
  };

  const renderEventButtonSelection = () => (
    <div className="eventButtonSelector">
      <InfoTooltip content="Goal">
        <button
          className={
            eventTypes.goal === activeEventSelection ? 'selectedButton' : ''
          }
          type="button"
          onClick={() => handleEventButtonSelection(eventTypes.goal)}
        >
          <img
            alt="goal"
            className="invertColor"
            src="/img/pitch-view/goal.png"
          />
          {isNotMobile && <span>{props.t('Goal')}</span>}
        </button>
      </InfoTooltip>
      <InfoTooltip content="Yellow Card">
        <button
          className={
            eventTypes.yellow === activeEventSelection ? 'selectedButton' : ''
          }
          type="button"
          onClick={() => handleEventButtonSelection(eventTypes.yellow)}
        >
          <img
            className="mediumImage"
            alt="yellowCard"
            src="/img/pitch-view/yellowCard.png"
          />
          {isNotMobile && <span>{props.t('Yellow')}</span>}
        </button>
      </InfoTooltip>
      <InfoTooltip content="Red Card">
        <button
          className={
            eventTypes.red === activeEventSelection ? 'selectedButton' : ''
          }
          type="button"
          onClick={() => handleEventButtonSelection(eventTypes.red)}
        >
          <img
            className="mediumImage"
            alt="redCard"
            src="/img/pitch-view/redCard.png"
          />
          {isNotMobile && <span>{props.t('Red')}</span>}
        </button>
      </InfoTooltip>
      <InfoTooltip content="Substitution">
        <button
          className={
            eventTypes.sub === activeEventSelection ? 'selectedButton' : ''
          }
          type="button"
          disabled={isMidGamePlayerPositionChangeDisabled}
          onClick={() =>
            !isMidGamePlayerPositionChangeDisabled &&
            handleEventButtonSelection(eventTypes.sub)
          }
        >
          <img
            className="mediumImage invertColor"
            alt="subs"
            src="/img/pitch-view/subArrow.png"
          />
          {isNotMobile && <span>{props.t('Substitution')}</span>}
        </button>
      </InfoTooltip>
      {listType === eventListFormatTypes.pitch && (
        <InfoTooltip content="Position swap">
          <button
            className={
              eventTypes.switch === activeEventSelection ? 'selectedButton' : ''
            }
            type="button"
            disabled={isMidGamePlayerPositionChangeDisabled}
            onClick={() =>
              !isMidGamePlayerPositionChangeDisabled &&
              handleEventButtonSelection(eventTypes.switch)
            }
          >
            <img
              alt="switch"
              className="invertColor"
              src="/img/pitch-view/switch.png"
            />
            {isNotMobile && <span>{props.t('Position swap')}</span>}
          </button>
        </InfoTooltip>
      )}
      {listType === eventListFormatTypes.pitch &&
        createEventListFormationChange && (
          <InfoTooltip content="Formation change">
            <button
              className={
                eventTypes.formation_change === activeEventSelection
                  ? 'selectedButton'
                  : ''
              }
              type="button"
              disabled={isMidGamePlayerPositionChangeDisabled}
              onClick={() =>
                !isMidGamePlayerPositionChangeDisabled &&
                createEventListFormationChange()
              }
            >
              <img alt="formationChange" src="/img/pitch-view/formation.png" />
              {isNotMobile && <span>{props.t('Formations')}</span>}
            </button>
          </InfoTooltip>
        )}
    </div>
  );

  const renderEventListFilters = () => (
    <div className="eventListFilters">
      <Select
        label={props.t('Events')}
        value={eventTypeFilter}
        options={eventTypeFilterOptions}
        onChange={setEventTypeFilter}
        isClearable
        onClear={() => setEventTypeFilter(null)}
      />
      <Select
        label={props.t('Players')}
        value={playerFilter}
        options={playerFilterSelectOptions}
        onChange={setPlayerFilter}
        isClearable
        onClear={() => setPlayerFilter(null)}
      />
    </div>
  );

  const renderClearEventButton = () => {
    return (
      !isReadOnly && (
        <TextButton
          onClick={renderClearEventsModal}
          text={props.t('Clear events')}
          type="secondary"
          isDisabled={pitchActivities.length === 0 || isReadOnly}
          kitmanDesignSystem
        />
      )
    );
  };

  const renderEventListHeader = () => {
    return (
      <div css={styles.eventListAreaHeader}>
        <span className="eventListTitle">{props.t('Event list')}</span>
        <div className="eventListFiltersArea">
          {!hideFilters && renderEventListFilters()}
          {renderClearEventButton()}
        </div>
      </div>
    );
  };

  const renderEventListMobileHeader = () => {
    return (
      <div css={styles.eventListAreaHeader}>
        <div className="eventListHeaderMobileTitle">
          <span className="eventListTitle">{props.t('Event List')}</span>
          {renderClearEventButton()}
        </div>
        <div className="eventListFiltersArea">
          {!hideFilters && renderEventListFilters()}
        </div>
      </div>
    );
  };
  const renderEventList = () => (
    <div className="event-list-activity-container">
      {filteredActivities.map((activity, index) => {
        let playerForActivity;

        if (activity.user_id) {
          playerForActivity = staff.find(
            ({ user }) => user.id === activity.user_id
          );
        } else {
          playerForActivity = players.find((player) => {
            return player?.id === activity.athlete_id;
          });
        }

        return (
          <EventListActivity
            isReadOnly={isReadOnly}
            listType={listType}
            key={activity.id || index}
            currentPeriod={currentPeriod}
            formationOptions={formationOptions}
            player={playerForActivity}
            event={activity}
            allGameActivities={props.gameActivities}
            pitchActivities={pitchActivities}
            onDelete={handleEventDeletion}
            onChangeEventValue={handleEventValueChange}
            checkIfInvalidMinute={handleCheckInvalidMinute}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            setActiveEventSelection={setActiveEventSelection}
            playerOptions={
              getPlayerSelectOptions &&
              getPlayerSelectOptions(activity, playerForActivity)
            }
            reasonOptions={reasonOptions}
            assistValue={getAssistPlayerValue(props.gameActivities, activity)}
            handleOwnGoal={handleOwnGoal}
            handleClearAssist={handleClearAssist}
          />
        );
      })}
    </div>
  );

  const renderEventListArea = () => (
    <div css={styles.eventListAreaContainer}>
      {isNotMobile ? renderEventListHeader() : renderEventListMobileHeader()}
      <hr className="eventListBorder" />
      {props.players.length > 0 && renderEventList()}
    </div>
  );

  return (
    <div className="event-list-area" css={styles.eventListWrapper}>
      {!isReadOnly && renderEventButtonSelection()}
      {renderEventListArea()}
      {modal.renderModal()}
    </div>
  );
};

export const EventListTranslated = withNamespaces()(EventList);
export default EventList;
