// @flow
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _isEqual from 'lodash/isEqual';
import { useDroppable } from '@dnd-kit/core';
import { Box, Typography } from '@mui/material';
import {
  eventTypes,
  pitchViewFormats,
} from '@kitman/common/src/consts/gameEventConsts';
import type { Athlete } from '@kitman/common/src/types/Event';
import type {
  GameActivityStorage,
  PitchViewFormatType,
} from '@kitman/common/src/types/GameEvent';
import {
  getYellowCards,
  getRedCard,
  getGoals,
  getSwitches,
  getSubs,
  doesOwnGoalExistForEvent,
} from '@kitman/common/src/utils/planningEvent/gameActivityUtils';
import { setSelectedPitchPlayer } from '@kitman/modules/src/PlanningEvent/src/redux/slices/pitchViewSlice';
import type {
  PitchViewInitialState,
  PositionData,
  OnPlayerPitchClickProps,
} from '@kitman/common/src/types/PitchView';

import styles from './styles';
import { getPlayerNumber } from '../../helpers/utils';

type InFieldPositionProps = {
  pitchFormat: PitchViewFormatType,
  cellId: string,
  style?: any,
  positionData?: PositionData,
  player?: Athlete,
  onPlayerClick: (OnPlayerPitchClickProps) => void,
  hasPeriodStarted: boolean,
  isImportedGame: boolean,
  handleRemovePosition: Function,
  isDmrLocked?: boolean,
  isCaptain?: boolean,
};

const InFieldPosition = ({
  pitchFormat,
  cellId,
  positionData,
  style = {},
  player,
  isDmrLocked,
  isCaptain,
  onPlayerClick,
  hasPeriodStarted,
  isImportedGame,
  handleRemovePosition,
}: InFieldPositionProps) => {
  const dispatch = useDispatch();

  const { field, activeEventSelection, pitchActivities, selectedPitchPlayer } =
    useSelector<PitchViewInitialState>(
      (state) => state.planningEvent.pitchView
    );

  const gameActivities = useSelector<GameActivityStorage>(
    (state) => state.planningEvent.gameActivities
  );

  const { setNodeRef } = useDroppable({
    id: cellId,
    data: player,
  });
  const [showRemovePlayerIcon, setShowRemovePlayerIcon] = useState(false);
  const [showPlayerStatsInfo, setShowPlayerStatsInfo] = useState(false);

  const cellSize = field.cellSize - 6;
  const isFieldPositionDisabled = !positionData;
  const playerId = +player?.id;

  const isPlayerPositionIsInSelected = _isEqual(selectedPitchPlayer, {
    player,
    positionData,
  });

  const yellowCardEvents = getYellowCards(pitchActivities, playerId);
  const redCardEvent = getRedCard(pitchActivities, playerId);
  const goalEvents = getGoals(pitchActivities, playerId);
  const ownGoalEvents = goalEvents.filter((goalEvent) =>
    doesOwnGoalExistForEvent(gameActivities.localGameActivities, goalEvent)
  );

  const switchEvents = getSwitches(pitchActivities, playerId);
  const subEvents = getSubs(pitchActivities, playerId);

  const checkIfPlayerIsCappedOnCards = () => {
    if (activeEventSelection === eventTypes.yellow)
      return getYellowCards(pitchActivities, playerId).length === 2;
    if (activeEventSelection === eventTypes.red)
      return !!getRedCard(pitchActivities, playerId);
    return false;
  };

  const getFieldPositionStyle = () => {
    let customStyle = {};
    if (
      (activeEventSelection && !checkIfPlayerIsCappedOnCards()) ||
      (!hasPeriodStarted && !isDmrLocked)
    ) {
      customStyle = styles.highlightPlayer;
    }

    if (isPlayerPositionIsInSelected) {
      customStyle = styles.selectedPosition;
    }
    return customStyle;
  };

  const allowEmptyPositionHighlight =
    !hasPeriodStarted || activeEventSelection === eventTypes.sub;

  const isOwnGoalFeatureEnabled =
    (window.getFlag('league-ops-game-events-own-goal') &&
      pitchFormat === pitchViewFormats.gameEvents) ||
    (window.getFlag('league-ops-match-report-v2') &&
      pitchFormat === pitchViewFormats.matchReport);

  const handleOnPlayerClick = () => {
    if (
      [eventTypes.goal, eventTypes.red, eventTypes.yellow].includes(
        activeEventSelection
      ) &&
      player?.id &&
      !checkIfPlayerIsCappedOnCards()
    ) {
      onPlayerClick({ player, eventType: activeEventSelection });
    }

    if (eventTypes.switch === activeEventSelection && player) {
      if (!selectedPitchPlayer) {
        dispatch(
          setSelectedPitchPlayer({
            player,
            positionData,
          })
        );
      } else if (selectedPitchPlayer?.player?.id !== player?.id) {
        onPlayerClick({
          player,
          eventType: activeEventSelection,
          positionData,
        });
      } else {
        dispatch(setSelectedPitchPlayer(null));
      }
    }

    if (eventTypes.sub === activeEventSelection || !hasPeriodStarted) {
      if (!isPlayerPositionIsInSelected) {
        dispatch(
          setSelectedPitchPlayer({
            player,
            positionData,
          })
        );
      } else {
        dispatch(setSelectedPitchPlayer(null));
      }
    }
  };

  const renderFieldPositionWithoutPlayer = () => {
    return (
      <Box sx={styles.fieldPositionWithoutPlayer} onClick={handleOnPlayerClick}>
        <Box
          data-testid="no-player-position"
          sx={[
            styles.noPlayerPosition(cellSize),
            allowEmptyPositionHighlight && getFieldPositionStyle(),
            style,
          ]}
        />
        <Box
          sx={[
            styles.positionLabel(cellSize),
            styles.positionAbbreviationContainer(cellSize),
          ]}
        >
          <Typography sx={styles.positionAbbreviation}>
            {positionData?.position?.abbreviation}
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderYellowCardForPlayer = (numberOfYellows: number) => (
    <>
      <Box
        component="img"
        data-testid="avatar-first-yellow-card"
        sx={[styles.playerAvatarEvent(cellSize), styles.avatarYellowCard]}
        alt="yellow_card"
        src="/img/pitch-view/yellowCard.png"
      />
      {numberOfYellows > 1 && (
        <Box
          component="img"
          data-testid="avatar-second-yellow-card"
          sx={[
            styles.playerAvatarEvent(cellSize),
            styles.avatarSecondYellowCard,
          ]}
          alt="yellow_card"
          src="/img/pitch-view/yellowCard.png"
        />
      )}
    </>
  );

  const renderPlayerEventInformation = () => {
    const renderEventIconArea = (
      type: string,
      image: string,
      eventLength: number
    ) => (
      <Box sx={styles.eventInfoDisplay(cellSize)}>
        <Box
          component="img"
          data-testid={`avatar-${type}s`}
          sx={[
            styles.playerAvatarEvent(cellSize),
            styles.playerAvatarEventInfo(cellSize),
            type === 'sub' ? styles.playerAvatarEventInfoSub(cellSize) : null,
          ]}
          alt={`${type}_icon`}
          src={image}
        />
        <Typography component="span">{eventLength}</Typography>
      </Box>
    );

    return (
      <Box sx={styles.playerInfoPopup(cellSize)}>
        <Typography
          component="span"
          variant="inherit"
          sx={styles.playerFullName}
        >
          {player?.firstname} {player?.lastname}
        </Typography>
        <Box sx={styles.playerIconInfoArea}>
          {renderEventIconArea(
            'sub',
            '/img/pitch-view/subArrow.png',
            subEvents.length
          )}
          {renderEventIconArea(
            'goal',
            '/img/pitch-view/goal.png',
            isOwnGoalFeatureEnabled
              ? goalEvents.length - ownGoalEvents.length
              : goalEvents.length
          )}
          {pitchFormat === pitchViewFormats.gameEvents &&
            renderEventIconArea(
              'swap',
              '/img/pitch-view/switch.png',
              switchEvents.length
            )}
          {renderEventIconArea(
            'yellow_card',
            '/img/pitch-view/yellowCard.png',
            yellowCardEvents.length
          )}
          {renderEventIconArea(
            'red_card',
            '/img/pitch-view/redCard.png',
            redCardEvent ? 1 : 0
          )}
          {isOwnGoalFeatureEnabled &&
            renderEventIconArea(
              'own_goal',
              '/img/pitch-view/ownGoal.png',
              ownGoalEvents.length
            )}
        </Box>
      </Box>
    );
  };

  const displayMouseOverInfo = () =>
    hasPeriodStarted
      ? setShowPlayerStatsInfo(true)
      : setShowRemovePlayerIcon(true);
  const hideMouseOverInfo = () =>
    hasPeriodStarted
      ? setShowPlayerStatsInfo(false)
      : setShowRemovePlayerIcon(false);

  const renderFieldPositionWithPlayer = () => (
    <Box
      data-testid="with-player-position"
      onMouseOver={displayMouseOverInfo}
      onFocus={displayMouseOverInfo}
      onMouseLeave={hideMouseOverInfo}
      onBlur={hideMouseOverInfo}
    >
      <Box sx={styles.playerAvatarWrapper}>
        {hasPeriodStarted && !!redCardEvent && (
          <Box
            component="img"
            data-testid="avatar-red-card"
            sx={[styles.playerAvatarEvent(cellSize), styles.avatarRedCard]}
            alt="red_card"
            src="/img/pitch-view/redCard.png"
          />
        )}
        <Box
          component="img"
          onClick={!isDmrLocked && handleOnPlayerClick}
          alt=""
          src={player?.avatar_url}
          sx={[styles.playerAvatar(cellSize), getFieldPositionStyle(), style]}
        />
        {hasPeriodStarted
          ? yellowCardEvents.length > 0 &&
            renderYellowCardForPlayer(yellowCardEvents.length)
          : showRemovePlayerIcon &&
            !isDmrLocked && (
              <Box
                component="button"
                data-testid="avatar-remove-button"
                sx={[
                  styles.playerAvatarEvent(cellSize),
                  styles.avatarRemoveButton(cellSize),
                ]}
                onClick={() => handleRemovePosition(player, positionData)}
              >
                <i className="icon-close" />
              </Box>
            )}
      </Box>
      <Typography sx={[styles.positionLabel(cellSize), styles.centeredLabel]}>
        {isImportedGame && getPlayerNumber(player?.squad_number)}{' '}
        {player?.shortname} {isCaptain && '(C)'}
      </Typography>
      {showPlayerStatsInfo &&
        !activeEventSelection &&
        renderPlayerEventInformation()}
    </Box>
  );

  const renderDisabledFieldPosition = () => {
    return (
      <Box
        data-testid="disabled-player-position"
        sx={[styles.disabledPosition(cellSize), style]}
      />
    );
  };

  if (isFieldPositionDisabled) {
    return renderDisabledFieldPosition();
  }

  return (
    <Box ref={setNodeRef} sx={styles.wrapper}>
      {player
        ? renderFieldPositionWithPlayer()
        : renderFieldPositionWithoutPlayer()}
    </Box>
  );
};

export default InFieldPosition;
