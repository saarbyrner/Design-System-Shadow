// @flow
import { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { capitalize, sortBy } from 'lodash';

import { Select } from '@kitman/components';
import { Alert } from '@kitman/playbook/components';
import { ToastDialog } from '@kitman/components/src/Toast/KitmanDesignSystem';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { OrganisationFormat } from '@kitman/services/src/services/planning/getOrganisationFormats';
import type { Athlete } from '@kitman/common/src/types/Event';
import type {
  GameActivityStorage,
  GamePeriod,
  GamePeriodStorage,
} from '@kitman/common/src/types/GameEvent';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import {
  findActivityForThePosition,
  updatePlayerFormationViewChange,
  createPlayerFormationViewChange,
  getOldActivities,
  createGameEventsFromSavedLineUpTemplate,
  getCaptainForTeamActivity,
} from '@kitman/common/src/utils/planningEvent/gameActivityUtils';
import {
  getCurrentLocalPeriods,
  hasCaptainBeenAssignedInPeriod,
} from '@kitman/common/src/utils/planningEvent/gamePeriodUtils';
import { setUnsavedGameActivities } from '@kitman/modules/src/PlanningEvent/src/redux/slices/gameActivitiesSlice';
import {
  setFormationCoordinates,
  setSelectedFormation,
  setSelectedGameFormat,
  setTeam,
  setSelectedPitchPlayer,
} from '@kitman/modules/src/PlanningEvent/src/redux/slices/pitchViewSlice';
import type {
  Formation,
  PitchViewInitialState,
} from '@kitman/common/src/types/PitchView';
import type { Game } from '@kitman/modules/src/PlanningEvent/types';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import PlayerAvatar from '../PlayerAvatar';
import PlayerCategory from '../PlayerCategory';
import styles from './styles';
import { SaveLineUpTemplateModalTranslated as SaveLineUpTemplateModal } from '../SaveLineUpTemplateModal';
import {
  getLineUpOptions,
  orderPlayersByGroupAndPositionAndId,
  lineUpSelectorOptions,
  copyEventsToSelectPeriod,
  getPreviousPeriodLineUp,
  getHasLineUpPositionChangeEvents,
  getShouldPromptToClearPeriod,
  getPreviousPeriodGameConfig,
  getLineUpFormationCoordinates,
  getNewTeam,
  getAllPlayers,
  isGameFormatAndFormationSupported,
  showUnsavedDataModal,
} from '../GameEventsTab/utils';

import lineUpTemplate from '../../services/lineUpTemplate';
import { SavedLineUpsSidePanelTranslated as SavedLineUpsSidePanel } from '../SavedLineUpsSidePanel';
import useGameEventsModal from '../../hooks/useGameEventsModal';
import { getGamePeriodActivities } from '../../services/gameActivities';
import useFixtureToast from './useFixtureToast';

type Props = {
  eventId: number,
  isCaptainEnabled: boolean,
  periodStartTime: number,
  currentPeriod: GamePeriod,
  gameFormats: Array<OrganisationFormat>,
  formations: Array<Formation>,
  isDmrLocked?: boolean,
  isImportedGame?: boolean,
};

const AvailablePlayerList = (props: I18nProps<Props>) => {
  const { preferences } = usePreferences();
  const dispatch = useDispatch();

  const isMatchDayFlow = props.isImportedGame && preferences?.league_game_team;

  const { localGameActivities: gameActivities } =
    useSelector<GameActivityStorage>(
      (state) => state.planningEvent.gameActivities
    );

  const foundCaptainActivity = getCaptainForTeamActivity(gameActivities);

  const { localEventPeriods } = useSelector<GamePeriodStorage>(
    (state) => state.planningEvent.eventPeriods
  );
  const eventPeriods = getCurrentLocalPeriods(localEventPeriods);

  const {
    field,
    team,
    formationCoordinates,
    selectedFormation,
    selectedGameFormat,
    isLoading,
    selectedPitchPlayer,
  } = useSelector<PitchViewInitialState>(
    (state) => state.planningEvent.pitchView
  );

  const [showLineUptemplateModal, setShowLineUptemplateModal] = useState(false);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const modal = useGameEventsModal();
  const {
    toasts,
    onCloseToast,
    showLineUpTemplateSavedToast,
    showLineUpTemplateSavedErrorToast,
    showEmptyLineUpToast,
    showCopyLastLineUpSuccessToast,
    showGenericErrorToast,
    showLastFixtureNotFoundToast,
    showCopyLastGameLineUpSuccessToast,
    showLastGameNotFoundToast,
    showUnsupportedConfigErrorToast,
    showAppliedSavedLineUpSuccessToast,
  } = useFixtureToast();

  const isMatchDayManagementStartingLineupComplete =
    isMatchDayFlow &&
    Object.keys(team.inFieldPlayers).length ===
      +selectedFormation?.number_of_players;

  const isCaptainOnPitch = hasCaptainBeenAssignedInPeriod(
    gameActivities,
    props.currentPeriod
  );

  const isCaptainMissingBannerPresent =
    isMatchDayManagementStartingLineupComplete &&
    props.isCaptainEnabled &&
    !isCaptainOnPitch;

  const playersByGroups = useMemo(() => {
    const groups = {};
    const allPlayers = [];

    team.players.forEach((player) => {
      const group = player?.position?.position_group.name;
      if (group) {
        groups[group] = groups[group] || [];
        groups[group].push(player);
      }
      if (player && !allPlayers.includes(player)) allPlayers.push(player);
    });

    return { groups, allPlayers };
  }, [team.players]);

  const onSaveLineupTemplate = async (lineUpName: string) => {
    if (!selectedFormation || !selectedGameFormat) return;

    const lineUp = Object.keys(team.inFieldPlayers).map((key) => {
      return {
        athlete_id: team.inFieldPlayers[key].id,
        formation_position_view_id: formationCoordinates[key].id,
      };
    });

    try {
      await lineUpTemplate.create({
        name: lineUpName,
        organisation_format_id: selectedGameFormat.id,
        formation_id: selectedFormation.id,
        lineup_positions: lineUp,
      });
      showLineUpTemplateSavedToast();
    } catch {
      showLineUpTemplateSavedErrorToast();
    } finally {
      setShowLineUptemplateModal(false);
    }
  };

  const handleSelectedAssignedPlayer = (player: Athlete) => {
    if (selectedPitchPlayer) {
      const formationId = selectedPitchPlayer.positionData?.id;
      const foundFormationCoord = Object.keys(formationCoordinates).find(
        (key) => formationCoordinates[key].id === formationId
      );

      const foundActivity = findActivityForThePosition({
        gameActivities,
        positionId: formationId,
        currentPeriodMinute: props.periodStartTime,
        positionType: eventTypes.formation_position_view_change,
      });

      if (foundActivity && selectedPitchPlayer.player?.id) {
        dispatch(
          setUnsavedGameActivities(
            updatePlayerFormationViewChange({
              gameActivities,
              playerId: +player.id,
              prevPlayerId: +selectedPitchPlayer.player?.id,
              currentPeriodMinute: props.periodStartTime,
            })
          )
        );
      } else {
        const playerAssignedActivities = createPlayerFormationViewChange({
          playerId: +player.id,
          positionInfo: selectedPitchPlayer.positionData,
          periodMin: props.periodStartTime,
        });

        dispatch(
          setUnsavedGameActivities([
            ...gameActivities,
            ...playerAssignedActivities,
          ])
        );
      }

      dispatch(setSelectedPitchPlayer(null));
      if (foundFormationCoord)
        dispatch(
          setTeam({
            inFieldPlayers: {
              ...team.inFieldPlayers,
              [foundFormationCoord]: player,
            },
            players: orderPlayersByGroupAndPositionAndId(
              [...team.players.filter((p) => p.id !== player.id)].concat(
                selectedPitchPlayer.player || []
              )
            ),
          })
        );
    }
  };

  const hasConfirmedChanges = async () => {
    const shouldPromptToClearPeriod = getShouldPromptToClearPeriod({
      gameActivities,
      periodStart: props.currentPeriod.absolute_duration_start,
    });

    let proceed = false;

    if (shouldPromptToClearPeriod) {
      proceed = await showUnsavedDataModal(modal.showAsync);

      if (!proceed) {
        return proceed;
      }
    }

    return true;
  };

  const onCopyLastLineUp = async (): Promise<void> => {
    if (!props.currentPeriod || !props.eventId) {
      return;
    }

    let lastPeriodLineUpEvents = getPreviousPeriodLineUp({
      gameActivities,
      period: props.currentPeriod,
      gamePeriods: eventPeriods,
    });

    if (!getHasLineUpPositionChangeEvents(lastPeriodLineUpEvents)) {
      showEmptyLineUpToast();
      return;
    }

    const hasConfirmed = await hasConfirmedChanges();

    if (!hasConfirmed) return;

    const { previousPeriodGameFormat, previousPeriodFormation } =
      getPreviousPeriodGameConfig({
        previousPeriodEvents: lastPeriodLineUpEvents,
        gameFormats: props.gameFormats,
        formations: props.formations,
      });

    // if somehow previous period game format or formation was not found
    if (!previousPeriodGameFormat || !previousPeriodFormation) {
      showGenericErrorToast();
      return;
    }

    lastPeriodLineUpEvents = lastPeriodLineUpEvents.slice(1);

    const previousLineUpCoordinates = await getLineUpFormationCoordinates(
      field.id,
      previousPeriodFormation.id
    );

    const oldActivities = getOldActivities({
      gameActivities,
      currentPeriod: props.currentPeriod,
      formationId: previousPeriodFormation.id,
    });

    const selectedPeriodNewActivities = copyEventsToSelectPeriod(
      props.currentPeriod,
      lastPeriodLineUpEvents
    );

    const otherActivities = gameActivities.filter(
      (item) =>
        item.absolute_minute !== props.currentPeriod.absolute_duration_start ||
        item.kind === eventTypes.captain_assigned
    );
    const allPeriodsActivities = [
      otherActivities,
      oldActivities,
      selectedPeriodNewActivities,
    ].flat();

    const newInFieldPlayers = {};
    const newInFieldPlayerIds = [];
    const players = getAllPlayers(team);

    selectedPeriodNewActivities.forEach((event) => {
      const athlete = players.find((player) => player.id === event.athlete_id);
      const coordId = Object.keys(previousLineUpCoordinates).find((key) => {
        return previousLineUpCoordinates[key].id === event.relation?.id;
      });

      if (
        athlete &&
        coordId &&
        !newInFieldPlayers[coordId] &&
        event.kind === eventTypes.formation_position_view_change
      ) {
        newInFieldPlayers[coordId] = athlete;
        newInFieldPlayerIds.push(athlete.id.toString());
      }
    });

    const newTeam = {
      inFieldPlayers: newInFieldPlayers,
      players: players.filter(
        (player) => !newInFieldPlayerIds.includes(player.id.toString())
      ),
    };

    dispatch(setSelectedGameFormat(previousPeriodGameFormat));
    dispatch(setSelectedFormation(previousPeriodFormation));
    dispatch(setFormationCoordinates(previousLineUpCoordinates));
    dispatch(setUnsavedGameActivities(allPeriodsActivities));
    dispatch(setTeam(newTeam));

    showCopyLastLineUpSuccessToast();
  };

  const checkIfLastGameOverwriteContinues = async (lastGame: Game) => {
    if (!lastGame) {
      showLastGameNotFoundToast();
      return false;
    }

    if (!lastGame.game_periods[0]?.id) {
      throw new Error('game period id is missing');
    }

    return hasConfirmedChanges();
  };

  const handleCopyingLastGamesLineup = async () => {
    const { data: lastGame } = await lineUpTemplate.getLastGame(props.eventId);

    const isCopyLastGameContinuing = await checkIfLastGameOverwriteContinues(
      lastGame
    );

    if (!isCopyLastGameContinuing) return;

    const activities = await getGamePeriodActivities(
      lastGame.id,
      lastGame.game_periods[0].id
    );

    const formationChange = activities.find(
      (activity) =>
        activity.kind === eventTypes.formation_change &&
        activity.absolute_minute === 0
    );

    const positionChanges = sortBy(activities, 'id')
      .filter(
        (activity) =>
          [
            eventTypes.formation_position_view_change,
            eventTypes.position_change,
          ].includes(activity.kind) && !activity.game_activity_id
      )
      .reverse();

    const lastGameFormationId = +formationChange?.relation?.id;

    if (!lastGameFormationId) {
      throw new Error('formation id is missing');
    }

    const players = getAllPlayers(team);

    // filter out athlete's events that are not part of the pre game player selection
    const positionChangesForSelectedPlayers = positionChanges.filter(
      (positionChange) => {
        return players.some(
          (player) => +player.id === +positionChange.athlete_id
        );
      }
    );

    const newActivitiesMap = {};

    positionChangesForSelectedPlayers.forEach((item) => {
      const id = `${item.athlete_id}_${item.kind}`;

      if (!newActivitiesMap[id]) {
        newActivitiesMap[id] = item;
      }
    });

    const newActivities = copyEventsToSelectPeriod(props.currentPeriod, [
      ...Object.values(newActivitiesMap).reverse(),
    ]);

    const oldActivities = getOldActivities({
      gameActivities,
      currentPeriod: props.currentPeriod,
      formationId: lastGameFormationId,
    });

    const currentPeriodFormationChangeIndex = oldActivities.findIndex(
      (activity) =>
        activity.absolute_minute ===
          props.currentPeriod.absolute_duration_start &&
        activity.kind === eventTypes.formation_change
    );

    oldActivities[currentPeriodFormationChangeIndex] = {
      ...oldActivities[currentPeriodFormationChangeIndex],
      relation: formationChange?.relation,
    };

    const otherActivities = gameActivities.filter(
      (item) =>
        item.absolute_minute !== props.currentPeriod.absolute_duration_start ||
        item.kind === eventTypes.captain_assigned
    );

    const allPeriodsActivities = [
      otherActivities,
      oldActivities,
      newActivities,
    ].flat();

    const previousGameLineUpCoordinates = await getLineUpFormationCoordinates(
      field.id,
      lastGameFormationId
    );

    const newInFieldPlayers = {};
    const newInFieldPlayerIds = [];

    newActivities.forEach((event) => {
      const athlete = players.find((player) => player.id === event.athlete_id);
      const coordId = Object.keys(previousGameLineUpCoordinates).find((key) => {
        return previousGameLineUpCoordinates[key].id === event.relation?.id;
      });

      if (
        athlete &&
        coordId &&
        !newInFieldPlayers[coordId] &&
        event.kind === eventTypes.formation_position_view_change
      ) {
        newInFieldPlayers[coordId] = athlete;
        newInFieldPlayerIds.push(athlete.id);
      }
    });

    const newTeam = {
      inFieldPlayers: newInFieldPlayers,
      players: players.filter(
        (player) => !newInFieldPlayerIds.includes(player.id)
      ),
    };

    const lastGameFormation = props.formations.find(
      (formation) => formation.id === lastGameFormationId
    );

    const lastGameFormat = props.gameFormats.find(
      (gameFormat) =>
        gameFormat.number_of_players === lastGameFormation?.number_of_players
    );

    if (!lastGameFormation || !lastGameFormat) {
      throw new Error('Game format and/or formation not found');
    }

    dispatch(setSelectedGameFormat(lastGameFormat));
    dispatch(setSelectedFormation(lastGameFormation));
    dispatch(setFormationCoordinates(previousGameLineUpCoordinates));
    dispatch(setUnsavedGameActivities(allPeriodsActivities));
    dispatch(setTeam(newTeam));

    showCopyLastGameLineUpSuccessToast();
  };

  const onCopyLastGameLineUp = async () => {
    if (!props.eventId) return;

    try {
      await handleCopyingLastGamesLineup();
    } catch (e) {
      if (e?.response?.status === 404 || e?.message?.includes(404)) {
        showLastFixtureNotFoundToast();
      } else {
        showGenericErrorToast();
      }
    }
  };

  const renderActionButtons = () => {
    const isCopyLastPeriodLineUpDisabled =
      props.currentPeriod?.order === 0 ||
      props.currentPeriod?.absolute_duration_start === 0;
    const isUsedSavedLineUpDisabled =
      !props.gameFormats?.length || !props.formations?.length;

    return (
      <div css={styles.actions}>
        <Select
          placeholder={props.t('Line-ups')}
          options={getLineUpOptions({
            isSaveLineUpDisabled: false,
            isCopyLastPeriodLineUpDisabled,
            isCopyLastFixtureDisabled: false,
            isUsedSavedLineUpDisabled,
          }).filter((opt) => !opt.isDisabled)}
          onChange={async (opt) => {
            if (opt === lineUpSelectorOptions.SaveLineUpTemplate) {
              setShowLineUptemplateModal(true);
            }
            if (opt === lineUpSelectorOptions.UseSavedLineUpTemplate) {
              setSidePanelOpen(true);
            }
            if (opt === lineUpSelectorOptions.CopyLastPeriodLineUp) {
              onCopyLastLineUp();
            }
            if (opt === lineUpSelectorOptions.CopyLastGameLineUp) {
              onCopyLastGameLineUp();
            }
          }}
          appendToBody
          showAutoWidthDropdown
          inlineShownSelection
          isDisabled={props.isDmrLocked}
        />
      </div>
    );
  };

  const renderPlayerCategories = () => {
    const getPlayerName = (playerId: number, playerName: string) => {
      const isCaptain = foundCaptainActivity?.athlete_id === playerId;
      return isCaptain ? `${playerName} (C)` : playerName;
    };

    if (team.players.length > 0)
      return Object.keys(playersByGroups.groups)
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .map((groupName) => {
          return (
            <PlayerCategory key={groupName} name={capitalize(groupName)}>
              {playersByGroups.groups[groupName].map((player) => (
                <PlayerAvatar
                  key={player.id}
                  player={player}
                  onPlayerClick={() => handleSelectedAssignedPlayer(player)}
                  selectedPitchPlayer={selectedPitchPlayer}
                  playerName={getPlayerName(player.id, player.shortname)}
                  isDisabled={props.isDmrLocked}
                />
              ))}
            </PlayerCategory>
          );
        });

    return (
      <div css={styles.emptyPlayers}>
        <p>
          {isLoading ? props.t('...Loading') : props.t('No players selected')}
        </p>
      </div>
    );
  };

  const onApplyLineUpTemplate = async (template) => {
    if (!props.eventId) return;

    const isConfigSupported = isGameFormatAndFormationSupported({
      template,
      gameFormats: props.gameFormats,
      formations: props.formations,
      onError: showUnsupportedConfigErrorToast,
    });

    if (!isConfigSupported) {
      return;
    }

    setSidePanelOpen(false);

    const players = getAllPlayers(team);

    const result = createGameEventsFromSavedLineUpTemplate({
      currentPeriod: props.currentPeriod,
      lineUpTemplate: template,
      gameActivities,
      players,
    });

    const savedLineUpCoordinates = await getLineUpFormationCoordinates(
      field.id,
      template.formation_id
    );

    const newTeam = getNewTeam({
      inFieldPlayers: result.inFieldPlayers,
      players,
    });

    dispatch(setSelectedGameFormat(template.gameFormat));
    dispatch(setSelectedFormation(template.formation));
    dispatch(setFormationCoordinates(savedLineUpCoordinates));
    dispatch(setUnsavedGameActivities(result.events));
    dispatch(setTeam(newTeam));

    showAppliedSavedLineUpSuccessToast();
  };

  const renderCaptainMissingBanner = () => (
    <Alert severity="error">
      {`Add the captain to the starting ${selectedFormation?.number_of_players}.`}
    </Alert>
  );

  return (
    <>
      <div css={styles.wrapper}>
        <div css={styles.header}>
          <p css={styles.heading}>
            {isMatchDayManagementStartingLineupComplete
              ? props.t('Substitutes')
              : props.t('Available Players')}
          </p>

          {renderActionButtons()}
        </div>
        {isCaptainMissingBannerPresent && renderCaptainMissingBanner()}
        {renderPlayerCategories()}
      </div>
      <SaveLineUpTemplateModal
        show={showLineUptemplateModal}
        setShow={setShowLineUptemplateModal}
        onConfirm={onSaveLineupTemplate}
      />
      <ToastDialog toasts={toasts} onCloseToast={onCloseToast} />
      <SavedLineUpsSidePanel
        isOpen={sidePanelOpen}
        gameFormats={props.gameFormats}
        formations={props.formations}
        onClose={() => setSidePanelOpen(false)}
        onConfirm={onApplyLineUpTemplate}
      />
      {modal.renderModal()}
    </>
  );
};

export const AvailablePlayerListTranslated =
  withNamespaces()(AvailablePlayerList);
export default AvailablePlayerList;
