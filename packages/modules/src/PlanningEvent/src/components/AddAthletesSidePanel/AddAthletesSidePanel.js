// @flow
import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { union } from 'lodash';

import {
  AppStatus,
  AthleteAndStaffSelector,
  SlidingPanel,
  TextButton,
  DelayedLoadingFeedback,
} from '@kitman/components';
import ConfirmationModal from '@kitman/playbook/components/ConfirmationModal';
import { getNotificationsConfirmationModalTranslatedText } from '@kitman/modules/src/CalendarPage/src/utils/eventUtils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { SquadData } from '@kitman/components/src/AthleteAndStaffSelector/types';
import { PlayerSelectionTranslated as PlayerSelection } from '@kitman/components/src/PlayerSelection';
import {
  getMovedPlayers,
  getIsAddMovedPlayersEnabled,
} from '@kitman/services/src/services/planning';
import type { MovedAthlete } from '@kitman/common/src/types/Athlete';
import type { Event } from '@kitman/common/src/types/Event';
import { useUpdateAthleteEventsMutation } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/athleteEventApi';
import { useLazyGetEventSquadsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/eventSquadsApi';
import { filterSquads } from '@kitman/modules/src/PlanningEventSidePanel/src/components/custom/utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { getHumanReadableEventType } from '@kitman/common/src/utils/events';

import styles from '../style';

type Props = {
  title?: string,
  event: Event,
  isOpen?: boolean,
  playerSelection?: boolean,
  onClose: Function,
  onSaveParticipantsSuccess: ({
    squads: Array<SquadData>,
    selectedAthletes: Array<string>,
  }) => void,
  maxSelectedAthletes: ?number,
  shouldIncludeGameStatus?: boolean,
  filterByHomeOrganisation?: boolean,
  filterByAwayOrganisation?: boolean,
  // Allows consumer of component to pass in selected athletes
  preselectedAthleteIds?: Array<string>,
  // Allows consumer of component to handle the "Done" functionality
  emitLocally?: boolean,
  includePrimarySquad?: boolean,
  disablePositionGrouping?: boolean,
  hideAvailabilityStatus?: boolean,
};

const AddAthletesSidePanel = (props: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();

  const leagueOpsDisciplineFlag =
    window.featureFlags['league-ops-discipline-area'];

  const isImportedGame =
    props.event.type === 'game_event' && !!props.event.league_setup;

  const [squads, setSquads] = useState<Array<SquadData>>([]);
  const [selectedAthletes, setSelectedAthletes] = useState<Array<string>>([]);
  const [movedAthletes, setMovedAthletes] = useState<Array<MovedAthlete>>([]);
  const [initialDataRequestStatus, setInitialDataRequestStatus] =
    useState('LOADING');
  const [savingStatus, setSavingStatus] = useState();
  const [showPlayerAddedError, setShowPlayerAddedError] =
    useState<boolean>(false);
  const [shouldShowNotificationModal, setShouldShowNotificationModal] =
    useState(false);
  const eventId = useMemo(() => {
    return +props.event.id;
  }, [props.event.id]);
  const [updateAthleteEvents] = useUpdateAthleteEventsMutation();

  const isGameEvent = props.event.type === 'game_event';

  const { localGameActivities: currentGameActivities } = useSelector(
    (state) => state.planningEvent.gameActivities
  );

  const [getEventSquads] = useLazyGetEventSquadsQuery();

  useEffect(() => {
    let ignore = false;
    let receivedMovedAthletes = null;

    const hasPreselectedAthletes = !!props.preselectedAthleteIds;

    const getInitialData = async () => {
      if (!props.isOpen) {
        return;
      }

      setInitialDataRequestStatus('LOADING');
      try {
        const { data } = await getEventSquads({
          eventId,
          params: {
            filterByDivision: isGameEvent,
            availability: true,
            positionAbbreviation: true,
            squadNumber: true,
            designation: true,
            gameStatus:
              leagueOpsDisciplineFlag && props.shouldIncludeGameStatus === true,
            filterByHomeOrganisation: props?.filterByHomeOrganisation || false,
            filterByAwayOrganisation: props?.filterByAwayOrganisation || false,
            includePrimarySquad: props?.includePrimarySquad || false,
          },
        });
        const getMovedPlayersPermission = await getIsAddMovedPlayersEnabled();
        if (getMovedPlayersPermission.value) {
          receivedMovedAthletes = await getMovedPlayers(eventId);
        }
        if (!ignore) {
          setMovedAthletes(receivedMovedAthletes?.moved_athletes ?? []);
          if (
            window.featureFlags['squad-scoped-custom-events'] &&
            props.event.type === 'custom_event' &&
            !props.event.custom_event_type.parent_association
          ) {
            const filteredSquads = filterSquads(
              props.event.custom_event_type.squads,
              data.squads,
              data.selected_athletes
            );
            setSquads(filteredSquads);
          } else {
            setSquads(data.squads);
          }
          if (hasPreselectedAthletes) {
            setSelectedAthletes(union(props.preselectedAthleteIds));
          } else {
            setSelectedAthletes(
              union(data.selected_athletes.map((id) => id.toString()))
            );
          }
          setInitialDataRequestStatus('SUCCESS');
        } else if (hasPreselectedAthletes) {
          setSelectedAthletes(union(props.preselectedAthleteIds));
        }
      } catch {
        if (!ignore) {
          setInitialDataRequestStatus('FAILURE');
        }
      }
    };

    getInitialData();
    return () => {
      ignore = true;
    };
  }, [props.isOpen, eventId]);

  const handleOnClose = () => {
    setShowPlayerAddedError(false);
    props.onClose();
  };

  const onClickDone = async (sendNotifications = false) => {
    if (props?.emitLocally) {
      props.onSaveParticipantsSuccess({
        squads,
        selectedAthletes,
      });
      return;
    }
    setSavingStatus('LOADING');

    try {
      await updateAthleteEvents({
        eventId,
        athleteIds: selectedAthletes,
        sendNotifications,
      }).unwrap();
    } catch {
      setSavingStatus('FAILURE');
      return;
    }

    props.onSaveParticipantsSuccess({
      squads,
      selectedAthletes,
    });

    setSavingStatus('SUCCESS');

    trackEvent(
      `Calendar — ${getHumanReadableEventType(
        props.event
      )} details — Athlete selection — Add/remove athletes — Done`
    );
  };

  const renderPlayerErrorTextArea = () => (
    <div css={styles.errorBannerContainer}>
      <span css={styles.removedPlayerErrorText}>
        <i className="icon-circle-cross" />
        {props.t(
          `A maximum of {{maximumAthleteCount}} athletes can be selected`,
          { maximumAthleteCount: +props.maxSelectedAthletes }
        )}
      </span>
    </div>
  );

  const isPlayerSelectionDisplayed =
    window.featureFlags['planning-game-events-field-view'] ||
    (!window.featureFlags['planning-game-events-field-view'] &&
      window.getFlag('planning-selection-tab'));

  const getPanelContent = () => {
    switch (initialDataRequestStatus) {
      case 'FAILURE':
        return <AppStatus status="error" isEmbed />;
      case 'LOADING':
        return <DelayedLoadingFeedback />;
      case 'SUCCESS':
        return (
          <div
            css={
              window.featureFlags['league-ops-edit-players-button-fix']
                ? styles.addAthletesSidePanel
                : {
                    height: '100%',
                  }
            }
          >
            <div
              css={
                window.featureFlags['league-ops-edit-players-button-fix']
                  ? styles.addAthletesSidePanelContent
                  : {
                      height: '100%',
                    }
              }
            >
              {showPlayerAddedError && renderPlayerErrorTextArea()}
              {isPlayerSelectionDisplayed && props.playerSelection ? (
                <PlayerSelection
                  squads={squads}
                  movedAthletes={movedAthletes}
                  selection={{ athletes: selectedAthletes }}
                  onSelectionChanged={({ athletes }) => {
                    setSelectedAthletes(union(athletes));
                  }}
                  gameActivities={currentGameActivities}
                  showPlayerAddedError={showPlayerAddedError}
                  setShowPlayerAddedError={setShowPlayerAddedError}
                  maxSelectedAthletes={props.maxSelectedAthletes}
                  isImportedGame={isImportedGame}
                  disablePositionGrouping={props.disablePositionGrouping}
                  hideAvailabilityStatus={props.hideAvailabilityStatus}
                />
              ) : (
                <AthleteAndStaffSelector
                  squads={squads}
                  movedAthletes={movedAthletes}
                  selection={{ athletes: selectedAthletes }}
                  onSelectionChanged={({ athletes }) => {
                    setSelectedAthletes(union(athletes));
                  }}
                />
              )}
            </div>
            <div
              css={
                window.featureFlags['league-ops-edit-players-button-fix'] &&
                styles.addAthletesSidePanelActions
              }
              className={
                !window.featureFlags['league-ops-edit-players-button-fix'] &&
                'slidingPanelActions'
              }
            >
              <TextButton
                onClick={handleOnClose}
                text={props.t('Cancel')}
                type="secondary"
                kitmanDesignSystem
              />
              <TextButton
                onClick={() => {
                  if (window.getFlag('event-notifications')) {
                    setShouldShowNotificationModal(true);
                  } else {
                    onClickDone();
                  }
                }}
                text={props.t('Done')}
                type="primary"
                kitmanDesignSystem
                isDisabled={showPlayerAddedError}
              />
            </div>
            {savingStatus === 'FAILURE' && <AppStatus status="error" />}
            {savingStatus === 'LOADING' && <AppStatus status="loading" />}
            {window.featureFlags['event-notifications'] && (
              <ConfirmationModal
                isModalOpen={shouldShowNotificationModal}
                isLoading={false}
                onConfirm={() => {
                  // passing sendNotifications: true
                  onClickDone(true);
                  setShouldShowNotificationModal(false);
                }}
                onCancel={() => {
                  // passing sendNotifications: false
                  onClickDone(false);
                  setShouldShowNotificationModal(false);
                }}
                onClose={() => setShouldShowNotificationModal(false)}
                translatedText={getNotificationsConfirmationModalTranslatedText()}
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <SlidingPanel
      isOpen={props.isOpen}
      kitmanDesignSystem
      title={props.title || props.t('Add/remove athletes')}
      togglePanel={handleOnClose}
    >
      {getPanelContent()}
    </SlidingPanel>
  );
};

export const AddAthletesSidePanelTranslated =
  withNamespaces()(AddAthletesSidePanel);
export default AddAthletesSidePanel;
