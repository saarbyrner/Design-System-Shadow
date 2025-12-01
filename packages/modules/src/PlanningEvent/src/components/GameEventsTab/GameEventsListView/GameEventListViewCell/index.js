// @flow
import { Fragment, useEffect, useMemo, useState } from 'react';
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import { TrackEvent } from '@kitman/common/src/utils';
import _omit from 'lodash/omit';
import _cloneDeep from 'lodash/cloneDeep';
import { colors } from '@kitman/common/src/variables';
import Tippy from '@tippyjs/react';
import {
  AppStatus,
  InputTextField,
  Select,
  TextButton,
} from '@kitman/components';
import type { Game, Athlete } from '@kitman/common/src/types/Event';
import type { PositionGroup } from '@kitman/services/src/services/getPositionGroups';
import i18n from '@kitman/common/src/utils/i18n';
import type {
  GameActivity,
  GamePeriod,
  GameActivityKind,
} from '@kitman/common/src/types/GameEvent';
import type { GamePeriodDuration } from '@kitman/modules/src/PlanningEvent/types';
import {
  gameActivitiesBulkSave,
  gameActivitiesPeriodBulkSave,
  getGameActivities,
} from '@kitman/modules/src/PlanningEvent/src/services/gameActivities';
import type {
  GameActivityForm,
  GameActivityDeletion,
} from '@kitman/modules/src/PlanningEvent/src/services/gameActivities';
import type { FormationCoordinates } from '@kitman/common/src/types/PitchView';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import {
  transformListViewActivitiesWithPitchViewCompatability,
  getYellowCards,
  getAthleteCurrentPosition,
  getAthletePositionData,
  canEditSubSwapGameActivity,
} from '@kitman/common/src/utils/planningEvent/gameActivityUtils';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  transformGameActivitiesDataFromServer,
  transformGameActivitiesDataFromForm,
} from '../../utils';
import getStyle from './style';

type Props = {
  athlete: Athlete,
  athletes: Array<Athlete>,
  event: Game,
  period: GamePeriod,
  positionGroups: Array<PositionGroup>,
  gameActivityKind: GameActivityKind,
  gameActivities: Array<GameActivity>,
  cellGameActivities: Array<GameActivity>,
  canEditEvent: boolean,
  onGameActivitiesUpdate: Function,
  periodDuration: GamePeriodDuration,
  hideGameActivityMinute?: boolean,
  isCellDisabled: boolean,
  formationCoordinates: FormationCoordinates,
  preventGameEvents: boolean,
  dispatchMandatoryFieldsToast: Function,
  updateAthleteStartingPosition: Function,
  hasPeriodStarted: boolean,
  athleteStartingPosition: Object,
};

type RequestStatusType = 'PENDING' | 'FAILURE' | null;

const getInitialFormData = ({
  allGameActivities,
  cellGameActivities,
  gameActivityKind,
  athleteId,
  canEdit,
  period,
  periodDuration,
  event,
}: {
  allGameActivities: Array<GameActivity>,
  cellGameActivities: Array<GameActivity>,
  gameActivityKind: GameActivityKind,
  athleteId: number,
  canEdit: boolean,
  period: GamePeriod,
  periodDuration: GamePeriodDuration,
  event: Game,
}): Array<GameActivityForm> => {
  /*
   * When the form is empty, the form should contain an empty form row.
   * If the game activity kind is 'position_change', the default game
   * activity minute is 0, but the position should remain unselected.
   */
  if (canEdit && cellGameActivities.length === 0) {
    const isOwnGoalActivity = gameActivityKind === eventTypes.own_goal;
    let defaultMinute = 0;
    if (period && periodDuration) {
      defaultMinute = periodDuration.min;
    }

    const formFields = {
      minute: 0,
      absolute_minute: defaultMinute,
      relation_id: null,
    };

    return [
      {
        ...formFields,
        athlete_id: athleteId,
        kind: isOwnGoalActivity ? eventTypes.goal : gameActivityKind,
        // If own goal, store as goal but add own_goal in nested activities
        ...(isOwnGoalActivity && {
          game_activities: [
            {
              athlete_id: athleteId,
              kind: eventTypes.own_goal,
              organisation_id: event?.squad?.owner_id,
              ...formFields,
            },
          ],
        }),
        validation: {
          minute: {
            valid:
              formFields.absolute_minute >= periodDuration?.min &&
              formFields.absolute_minute < periodDuration?.max,
            showError: false,
          },
          relation_id: {
            valid:
              gameActivityKind === eventTypes.position_change
                ? Boolean(formFields.relation_id)
                : true,
            showError: false,
          },
        },
      },
    ];
  }

  const linkedCellGameActivities: Array<GameActivity> = [];

  cellGameActivities.forEach((cellGameActivity) => {
    linkedCellGameActivities.push(
      ...allGameActivities.filter(
        (gameActivity) => gameActivity.game_activity_id === cellGameActivity.id
      )
    );
  });

  return [...cellGameActivities, ...linkedCellGameActivities.flat()].map(
    (gameActivity) => ({
      id: gameActivity.id,
      athlete_id: gameActivity.athlete_id,
      minute: gameActivity.minute,
      absolute_minute: gameActivity.absolute_minute,
      relation_id: gameActivity.relation?.id,
      game_activity_id: gameActivity?.game_activity_id,
      kind: gameActivity.kind,
      validation: {
        minute: {
          valid: true,
          showError: false,
        },
        relation_id: {
          valid: true,
          showError: false,
        },
      },
    })
  );
};

const GameEventListViewCell = (props: I18nProps<Props>) => {
  const pitchViewEnabled =
    window.featureFlags['planning-game-events-field-view'];

  const [tooltipInstance, setTooltipInstance] = useState(null);
  const [requestStatus, setRequestStatus] = useState<RequestStatusType>(null);
  const [gameActivityUpdates, setGameActivityUpdates] = useState<
    Array<GameActivityForm>
  >(
    getInitialFormData({
      allGameActivities: props.gameActivities,
      cellGameActivities: props.cellGameActivities,
      gameActivityKind: props.gameActivityKind,
      athleteId: props.athlete.id,
      canEdit: props.canEditEvent,
      period: props.period,
      periodDuration: props.periodDuration,
      event: props.event,
    })
  );

  const [gameActivityDeletions, setGameActivityDeletions] = useState<
    Array<GameActivityDeletion>
  >([]);

  const resetForm = () => {
    setGameActivityUpdates(
      getInitialFormData({
        allGameActivities: props.gameActivities,
        cellGameActivities: props.cellGameActivities,
        gameActivityKind: props.gameActivityKind,
        athleteId: props.athlete.id,
        canEdit: props.canEditEvent,
        period: props.period,
        periodDuration: props.periodDuration,
        event: props.event,
      })
    );
    setGameActivityDeletions([]);
  };

  useEffect(resetForm, [props.cellGameActivities]);

  const positionAssignedLabel = (positionId) => {
    const gameActivityForPosition = props.gameActivities.findIndex(
      (gameActivity) => {
        return (
          gameActivity.athlete_id !== props.athlete.id &&
          gameActivity.kind === eventTypes.formation_position_view_change &&
          gameActivity.absolute_minute ===
            props.period?.absolute_duration_start &&
          gameActivity.relation?.id === positionId
        );
      }
    );
    if (gameActivityForPosition > -1) {
      return ' - Position Assigned';
    }
    return '';
  };
  const positionsDropdownOptions = useMemo(
    () =>
      pitchViewEnabled && props.formationCoordinates
        ? [
            ...Object.values(props.formationCoordinates).map(
              (formationCoordinate: Object) => ({
                value: formationCoordinate?.id,
                label: `${
                  formationCoordinate?.position.abbreviation
                }${positionAssignedLabel(formationCoordinate?.id)}`,
                isDisabled: formationCoordinate?.isDisabled,
              })
            ),
            {
              value: 'SUBSTITUTE',
              label: i18n.t('Sub', { context: 'Abbreviation of substitute' }),
            },
          ]
        : [
            ...props.positionGroups
              .map((positionsGroup) =>
                positionsGroup.positions.map(({ id, abbreviation }) => ({
                  value: id,
                  label: `${abbreviation}${positionAssignedLabel(id)}`,
                }))
              )
              .flat(),
            {
              value: 'SUBSTITUTE',
              label: i18n
                .t('Sub', { context: 'Abbreviation of substitute' })
                .toUpperCase(),
            },
          ],
    [pitchViewEnabled, props.positionGroups, props.formationCoordinates]
  );

  const substitutionSwapDropdownOptions = useMemo(() => {
    if (pitchViewEnabled && props.formationCoordinates && props.athletes) {
      const athleteOptions = [];

      props.athletes.forEach((athlete) => {
        const currentAthleteCurrentPosition: Object = getAthleteCurrentPosition(
          props.gameActivities,
          athlete.id,
          props.period
        );

        let athleteLabel;
        if (
          currentAthleteCurrentPosition &&
          currentAthleteCurrentPosition.relation
        ) {
          athleteLabel = `${currentAthleteCurrentPosition?.relation?.position?.abbreviation} - ${athlete.fullname}`;
        } else if (
          currentAthleteCurrentPosition &&
          !currentAthleteCurrentPosition.relation
        ) {
          athleteLabel = `SUB - ${athlete.fullname}`;
        } else {
          athleteLabel = `SUB - ${athlete.fullname}`;
        }

        if (athlete.id !== props.athlete.id) {
          athleteOptions.push({
            value: athlete.id,
            label: athleteLabel,
          });
        }
      });

      return athleteOptions;
    }
    return [];
  }, [
    props.gameActivities,
    props.formationCoordinates,
    pitchViewEnabled,
    props.athletes,
    props.period,
  ]);

  const getAssistDropdownOptions = (athleteId) => {
    const filteredAthleteOptions = props.athletes
      .filter((athlete) => athlete.id !== athleteId)
      .map((athlete) => ({
        label: athlete.fullname,
        value: athlete.id,
      }));

    return filteredAthleteOptions;
  };

  const getUpdatedGameActivities = async () => {
    return transformGameActivitiesDataFromServer(
      await getGameActivities({ eventId: props.event.id })
    );
  };

  const style = useMemo(
    () => getStyle(props.gameActivityKind, pitchViewEnabled),
    [props.positionGroups]
  );

  const gameActivityName = useMemo(() => {
    switch (props.gameActivityKind) {
      case eventTypes.position_change:
        return props.t('Positions');
      case eventTypes.sub:
        return props.t('Positions/subs');
      case eventTypes.yellow:
        return props.t('Yellow');
      case eventTypes.red:
        return props.t('Red');
      case eventTypes.goal:
        return props.t('Goal');
      case eventTypes.own_goal:
        return props.t('Own Goal');
      case eventTypes.assist:
        return props.t('Assist');
      default:
        return '';
    }
  }, [props.gameActivityKind]);

  const getCellText = () => {
    if (props.gameActivityKind === eventTypes.position_change) {
      if (props.cellGameActivities.length) {
        return props.cellGameActivities
          .sort((a, b) => +a.absolute_minute - +b.absolute_minute)
          .map((gameActivity) => {
            const positionName =
              positionsDropdownOptions.find(
                (position) => position.value === gameActivity.relation?.id
              )?.label || 'SUB';

            return gameActivity.minute === 0 || props.hideGameActivityMinute
              ? positionName
              : `${positionName} (${gameActivity.absolute_minute}’)`;
          })
          .join(', ');
      }
      return 'SUB';
    }

    if (props.gameActivityKind === eventTypes.sub && pitchViewEnabled) {
      const substitutionsRelatedGameActivities: Array<GameActivity> =
        props.gameActivities
          .filter(
            (gameActivity) =>
              gameActivity.athlete_id === props.athlete.id &&
              gameActivity.kind === eventTypes.formation_position_view_change &&
              +gameActivity.absolute_minute >
                +props.period.absolute_duration_start &&
              +gameActivity.absolute_minute <
                +props.period.absolute_duration_end &&
              !gameActivity.delete
          )
          .sort((a, b) => +a.absolute_minute - +b.absolute_minute);

      if (substitutionsRelatedGameActivities.length) {
        return substitutionsRelatedGameActivities
          .map((gameActivity) => {
            let positionLabel =
              positionsDropdownOptions.find(
                (position) => position.value === gameActivity.relation?.id
              )?.label || 'SUB';

            positionLabel = positionLabel.replace(' - Position Assigned', '');

            return `${positionLabel} (${gameActivity.absolute_minute}’)`;
          })
          .join(', ');
      }
    }

    if (
      pitchViewEnabled &&
      (props.gameActivityKind === eventTypes.goal ||
        props.gameActivityKind === eventTypes.own_goal ||
        props.gameActivityKind === eventTypes.assist)
    ) {
      let cellTextDisplay = '';
      if (props.cellGameActivities.length) {
        const cellTextMinutes = [];
        cellTextDisplay = `${props.cellGameActivities.length} (`;
        props.cellGameActivities.forEach((gameActivity) => {
          cellTextMinutes.push(`${gameActivity.absolute_minute}’`);
        });
        cellTextDisplay += `${cellTextMinutes.join(', ')})`;
      }
      return cellTextDisplay;
    }

    return props.cellGameActivities
      .map((gameActivity) => `${gameActivity.absolute_minute}’`)
      .join(', ');
  };

  const checkIfMaxRedCards =
    props.gameActivityKind === eventTypes.red &&
    gameActivityUpdates.length === 1;

  const checkIfMaxYellowCards =
    props.gameActivityKind === eventTypes.yellow &&
    gameActivityUpdates.length === 2;

  const checkIfMaxCards =
    pitchViewEnabled && (checkIfMaxYellowCards || checkIfMaxRedCards);

  const showFieldError = (index, fieldName) =>
    setGameActivityUpdates((prevActivityUpdates) => {
      const updatedForm = [...prevActivityUpdates];
      updatedForm[index].validation[fieldName].showError = true;
      return updatedForm;
    });

  const showAllErrors = () =>
    setGameActivityUpdates((prevActivityUpdates) =>
      prevActivityUpdates.map((activityUpdate) => ({
        ...activityUpdate,
        validation: {
          minute: { ...activityUpdate.validation.minute, showError: true },
          relation_id: {
            ...activityUpdate.validation.relation_id,
            showError: true,
          },
        },
      }))
    );
  // This will trigger the toast to prompt mandatory fields
  const handlePreventEventCreation = () => {
    if (props.preventGameEvents) {
      props.dispatchMandatoryFieldsToast();
    }
  };

  const getAssistAthleteId = (currentGameActivity: GameActivityForm) => {
    let linkedGoalAssist;

    if (currentGameActivity.id) {
      const goalGameActivity = props.gameActivities.find(
        (gameActivity) => gameActivity.id === currentGameActivity.id
      );

      if (goalGameActivity) {
        // Get the linked activity
        linkedGoalAssist = gameActivityUpdates.find(
          (activity) => goalGameActivity?.id === activity.game_activity_id
        );
      }
      if (linkedGoalAssist) {
        return linkedGoalAssist.athlete_id;
      }
    }

    if (
      currentGameActivity?.game_activities &&
      currentGameActivity.game_activities.length > 0
    ) {
      // Added in case to check for the activity if it is unsaved as it will be nested within the activity
      return currentGameActivity.game_activities[0].athlete_id;
    }

    return null;
  };

  const getAthleteStartingPosition = () => {
    if (props.athleteStartingPosition?.position_id === 'SUBSTITUTE') {
      return props.athleteStartingPosition.position_id;
    }
    return props.athleteStartingPosition?.position?.id || null;
  };

  const onClickSave = () => {
    const invalidFields = gameActivityUpdates.filter(
      (gameActivityUpdate) =>
        !gameActivityUpdate.validation.minute.valid ||
        !gameActivityUpdate.validation.relation_id.valid
    );
    if (invalidFields.length > 0) {
      showAllErrors();
      return;
    }

    setRequestStatus('PENDING');

    if (tooltipInstance) {
      tooltipInstance.hide();
    }

    const gameActivitiesToUpdate =
      pitchViewEnabled &&
      ![eventTypes.sub, eventTypes.switch].includes(props.gameActivityKind)
        ? transformListViewActivitiesWithPitchViewCompatability(
            props.gameActivities,
            gameActivityUpdates,
            props.formationCoordinates
          )
        : gameActivityUpdates;

    if (!props.period) {
      gameActivitiesBulkSave(
        props.event.id,
        [
          ...gameActivityDeletions,
          ...transformGameActivitiesDataFromForm(gameActivitiesToUpdate),
        ].map((gameActivity) => _omit(gameActivity, ['validation']))
      ).then(
        (updatedGameActivities) => {
          setRequestStatus(null);

          props.onGameActivitiesUpdate({
            updates: transformGameActivitiesDataFromServer(
              updatedGameActivities
            ),
            deletions: gameActivityDeletions,
          });
        },
        () => setRequestStatus('FAILURE')
      );
    } else {
      gameActivitiesPeriodBulkSave(
        props.event.id,
        props.period.id,
        [
          ...gameActivityDeletions,
          ...transformGameActivitiesDataFromForm(gameActivitiesToUpdate),
        ].map((gameActivity) => _omit(gameActivity, ['validation', 'minute']))
      ).then(
        (updatedGameActivities) => {
          setRequestStatus(null);

          props.onGameActivitiesUpdate({
            updates: transformGameActivitiesDataFromServer(
              updatedGameActivities
            ),
            deletions: gameActivityDeletions,
          });

          const reloadData = updatedGameActivities.some(
            (gameActivity) =>
              gameActivity.kind === eventTypes.goal ||
              gameActivity.kind === eventTypes.own_goal ||
              gameActivity.kind === eventTypes.assist ||
              gameActivity.kind === eventTypes.sub ||
              gameActivity.kind === eventTypes.switch
          );
          if (pitchViewEnabled && reloadData) {
            // Poll the backend to get the latest game activities and then update the Game Activities
            getUpdatedGameActivities().then((latestGameActivities) => {
              props.onGameActivitiesUpdate({
                updates:
                  transformGameActivitiesDataFromServer(latestGameActivities),
                deletions: gameActivityDeletions,
              });
            });
          }
        },
        () => setRequestStatus('FAILURE')
      );
    }
  };

  const setGameActivityMinute = (gameActivityIndex, minute) => {
    let isvalid = false;

    const isNumeric = !Number.isNaN(parseFloat(minute));

    if (props.period) {
      isvalid =
        minute >= +props.periodDuration.min &&
        minute < +props.periodDuration.max &&
        isNumeric;
    } else {
      isvalid = isNumeric;
    }

    const activityMinute = minute - +props.period.absolute_duration_start;

    setGameActivityUpdates((prevActivityUpdates) => {
      const updatedForm = [...prevActivityUpdates];
      updatedForm[gameActivityIndex].minute = activityMinute;
      updatedForm[gameActivityIndex].absolute_minute = minute;
      updatedForm[gameActivityIndex].validation.minute.valid = isvalid;
      updatedForm[gameActivityIndex].validation.minute.showError = false;

      if (updatedForm[gameActivityIndex].id) {
        const linkedIndexes = updatedForm.reduce((indexes, activity, index) => {
          if (updatedForm[gameActivityIndex].id === activity.game_activity_id) {
            indexes.push(index);
          }
          return indexes;
        }, []);
        linkedIndexes.forEach((linkedIndex) => {
          // Update each matching activity
          updatedForm[linkedIndex].absolute_minute = minute;
          updatedForm[linkedIndex].minute = activityMinute;
        });
      }

      if (updatedForm[gameActivityIndex].game_activities) {
        updatedForm[gameActivityIndex].game_activities = updatedForm[
          gameActivityIndex
        ].game_activities.map((activity) => ({
          ...activity,
          absolute_minute: minute,
          minute: activityMinute,
        }));
      }

      return updatedForm;
    });
  };

  const handleStartingPositionOptionChange = (positionId: number | string) => {
    props.updateAthleteStartingPosition(positionId, props.athlete.id);
  };

  const handleSubstitutionSwapDropdownChange = (
    gameActivityIndex: number,
    dropdownChangeGameActivity: GameActivityForm,
    swapWithAthleteId: number
  ) => {
    const currentGameActivity: GameActivityForm = _cloneDeep(
      dropdownChangeGameActivity
    );
    // Get the current positions of the current athlete and selected athlete
    const currentAthleteCurrentPosition = getAthleteCurrentPosition(
      props.gameActivities,
      props.athlete.id,
      props.period
    );

    const selectedAthleteCurrentPosition: Object = getAthleteCurrentPosition(
      props.gameActivities,
      swapWithAthleteId,
      props.period
    );

    // Event has already been saved and is being updated
    if (dropdownChangeGameActivity.id) {
      // Get the linked activities for the selected athlete
      const linkedGameActivitiesIndexes = [];
      gameActivityUpdates.forEach((gameActivity, index) => {
        if (gameActivity.game_activity_id === dropdownChangeGameActivity.id)
          linkedGameActivitiesIndexes.push(index);
      });

      if (linkedGameActivitiesIndexes.length > 0) {
        setGameActivityUpdates((prevActivityUpdates) => {
          const updatedForm = [...prevActivityUpdates];
          linkedGameActivitiesIndexes.forEach((linkedIndex) => {
            if (updatedForm[linkedIndex].athlete_id !== props.athlete.id) {
              // Update the athlete_id to that of the selected athlete
              updatedForm[linkedIndex].athlete_id = swapWithAthleteId;
            } else if (
              updatedForm[linkedIndex].athlete_id === props.athlete.id &&
              selectedAthleteCurrentPosition
            ) {
              // Update the game activity relation ids
              currentGameActivity.kind = eventTypes.switch;
              if (
                updatedForm[linkedIndex].kind ===
                eventTypes.formation_position_view_change
              ) {
                updatedForm[linkedIndex].relation = {
                  id: selectedAthleteCurrentPosition
                    ? +selectedAthleteCurrentPosition?.relation?.id
                    : null,
                };
              }
              if (
                updatedForm[linkedIndex].kind === eventTypes.position_change
              ) {
                updatedForm[linkedIndex].relation = {
                  id: selectedAthleteCurrentPosition
                    ? +selectedAthleteCurrentPosition?.relation?.position?.id
                    : null,
                };
              }
            } else if (
              updatedForm[linkedIndex].athlete_id === props.athlete.id &&
              !selectedAthleteCurrentPosition
            ) {
              currentGameActivity.kind = eventTypes.sub;
              updatedForm[linkedIndex].relation = {
                id: null,
              };
            }
          });

          updatedForm[gameActivityIndex].relation_id = swapWithAthleteId;
          updatedForm[gameActivityIndex].kind = currentGameActivity?.kind;

          return updatedForm;
        });
      }
      // If event has not been saved yet
    } else {
      // 1. Check if new position has a player already assigned at the current time
      let playerInPositionId: number;
      let playerToSwapId: number;
      let playerToSwapCurrentPositionData;
      let playerInPositionCurrentPositionData: Object;

      if (currentAthleteCurrentPosition && selectedAthleteCurrentPosition) {
        currentGameActivity.kind = eventTypes.switch;
        playerInPositionId = props.athlete.id;
        playerInPositionCurrentPositionData = getAthletePositionData(
          currentAthleteCurrentPosition
        );

        playerToSwapId = swapWithAthleteId;
        playerToSwapCurrentPositionData = getAthletePositionData(
          selectedAthleteCurrentPosition
        );
      } else if (
        currentAthleteCurrentPosition &&
        !selectedAthleteCurrentPosition
      ) {
        playerInPositionId = props.athlete.id;
        playerInPositionCurrentPositionData = getAthletePositionData(
          currentAthleteCurrentPosition
        );

        playerToSwapId = swapWithAthleteId;
        playerToSwapCurrentPositionData = null;
      } else if (
        selectedAthleteCurrentPosition &&
        !currentAthleteCurrentPosition
      ) {
        playerInPositionId = swapWithAthleteId;
        playerInPositionCurrentPositionData = getAthletePositionData(
          selectedAthleteCurrentPosition
        );

        playerToSwapId = props.athlete.id;
        playerToSwapCurrentPositionData = null;
      }

      // 2. Create the position_change game activity for the current athlete (props.athlete.id)
      const currentAthletePositionChangeGameActivity: Object = {
        athlete_id: playerInPositionId,
        absolute_minute: currentGameActivity.absolute_minute,
        relation: {
          id: playerToSwapCurrentPositionData
            ? +playerToSwapCurrentPositionData?.position.id
            : null,
        },
        kind: eventTypes.position_change,
      };

      // 3. Create the formation_position_view_change game activity for the current athlete (props.athlete.id)
      const currentAthleteFormationPositionViewChangeGameActivity: Object = {
        athlete_id: playerInPositionId,
        absolute_minute: currentGameActivity.absolute_minute,
        relation: {
          id: playerToSwapCurrentPositionData
            ? +playerToSwapCurrentPositionData.id
            : null,
        },
        kind: eventTypes.formation_position_view_change,
      };

      // 4. Create the position_change game activity for the selected athlete (swapWithAthleteId)
      const selectedAthletePositionChangeGameActivity: Object = {
        athlete_id: playerToSwapId,
        absolute_minute: currentGameActivity.absolute_minute,
        relation: {
          id: playerInPositionCurrentPositionData
            ? +playerInPositionCurrentPositionData?.position.id
            : null,
        },
        kind: eventTypes.position_change,
      };
      // 5. Create the formation_position_view_change game activity for the selected athlete (swapWithAthleteId)
      const selectedAthleteFormationPositionViewChangeGameActivity: Object = {
        athlete_id: playerToSwapId,
        absolute_minute: currentGameActivity.absolute_minute,
        relation: {
          id: playerInPositionCurrentPositionData
            ? +playerInPositionCurrentPositionData.id
            : null,
        },
        kind: eventTypes.formation_position_view_change,
      };

      const substitutionSwapGameActivities: Array<GameActivity> = [
        currentAthletePositionChangeGameActivity,
        currentAthleteFormationPositionViewChangeGameActivity,
        selectedAthletePositionChangeGameActivity,
        selectedAthleteFormationPositionViewChangeGameActivity,
      ];

      setGameActivityUpdates((prevActivityUpdates) => {
        const updatedForm = [...prevActivityUpdates];
        updatedForm[gameActivityIndex].game_activities = [
          ...substitutionSwapGameActivities,
        ];
        updatedForm[gameActivityIndex].relation_id = swapWithAthleteId;
        updatedForm[gameActivityIndex].kind = currentGameActivity?.kind;
        return updatedForm;
      });
    }
  };

  const handleGoalAssistDropdownChange = (
    gameActivityIndex: number,
    currentGameActivity: GameActivityForm,
    assistAthleteId: number
  ) => {
    const goalScorerId = +props.athlete.id;
    const assistPlayerAthleteId = +assistAthleteId;

    // Event has already been saved and is being edited
    if (currentGameActivity.id) {
      // Get the linked activity
      let linkedGoalAssistIndex;
      const goalGameActivity = props.gameActivities.filter(
        (gameActivity) => gameActivity.id === currentGameActivity.id
      )[0];
      if (goalGameActivity) {
        // Get the linked activity
        linkedGoalAssistIndex = gameActivityUpdates.findIndex(
          (activity) => activity.game_activity_id === goalGameActivity.id
        );
      }

      if (linkedGoalAssistIndex !== -1) {
        setGameActivityUpdates((prevActivityUpdates) => {
          const updatedForm = [...prevActivityUpdates];
          updatedForm[linkedGoalAssistIndex] = {
            ...updatedForm[linkedGoalAssistIndex],
            athlete_id: assistPlayerAthleteId,
            absolute_minute: currentGameActivity.absolute_minute,
            minute: currentGameActivity.minute,
          };
          return updatedForm;
        });
      } else {
        TrackEvent('Game Events', 'Add', 'Assist');
        setGameActivityUpdates((prevActivityUpdates) => {
          const updatedForm = [...prevActivityUpdates];
          updatedForm[gameActivityIndex].game_activities = [
            {
              athlete_id: assistPlayerAthleteId,
              kind: eventTypes.assist,
              absolute_minute: currentGameActivity.absolute_minute,
              relation_id: null,
              minute: currentGameActivity.minute,
            },
          ];
          return updatedForm;
        });
      }
      // If event has not been saved yet
    } else {
      TrackEvent('Game Events', 'Add', 'Assist');
      setGameActivityUpdates((prevActivityUpdates) => {
        const updatedForm = [...prevActivityUpdates];
        updatedForm[gameActivityIndex].athlete_id = goalScorerId;
        updatedForm[gameActivityIndex].game_activities = [
          {
            athlete_id: assistPlayerAthleteId,
            kind: eventTypes.assist,
            absolute_minute: currentGameActivity.absolute_minute,
            relation_id: null,
            minute: currentGameActivity.minute,
          },
        ];
        return updatedForm;
      });
    }
  };

  const setGameActivityRelationId = (gameActivityIndex, relationId) =>
    setGameActivityUpdates((prevActivityUpdates) => {
      const updatedForm = [...prevActivityUpdates];
      updatedForm[gameActivityIndex].relation_id = relationId;
      updatedForm[gameActivityIndex].validation.relation_id.valid =
        relationId !== null;
      updatedForm[gameActivityIndex].validation.relation_id.showError = true;

      return updatedForm;
    });

  const removeGameActivity = (gameActivityIndex) => {
    const deletedGameActivity = gameActivityUpdates[gameActivityIndex];
    const deletedGameActivityId = gameActivityUpdates[gameActivityIndex]?.id;
    let deletedPitchActivityIndex = null;
    let deletedRedCardIndex = null;
    let deletedYellowCardIndex = null;
    let deletedGoalAssistIndex = null;
    let deletedOwnGoalIndex = null;
    const deletedSubstitutionLinkedActivities = [];

    const getDeleteActivity = (deleteIndex: number): GameActivityDeletion => ({
      id: +props.gameActivities[deleteIndex]?.id,
      delete: true,
    });

    if (
      pitchViewEnabled &&
      deletedGameActivity.kind === eventTypes.position_change
    ) {
      deletedPitchActivityIndex = props.gameActivities.findIndex(
        (activity) =>
          activity.athlete_id === deletedGameActivity.athlete_id &&
          activity.kind === eventTypes.formation_position_view_change &&
          activity.absolute_minute === deletedGameActivity.absolute_minute
      );
    }

    if (
      pitchViewEnabled &&
      deletedGameActivity.kind === eventTypes.yellow &&
      getYellowCards(props.gameActivities, deletedGameActivity.athlete_id)
        .length === 2
    ) {
      deletedRedCardIndex = props.gameActivities.findIndex(
        (activity) =>
          activity.athlete_id === deletedGameActivity.athlete_id &&
          activity.kind === eventTypes.red
      );
    }

    if (
      pitchViewEnabled &&
      deletedGameActivity.kind === eventTypes.red &&
      getYellowCards(props.gameActivities, deletedGameActivity.athlete_id)
        .length === 2
    ) {
      deletedYellowCardIndex = props.gameActivities.findIndex(
        (activity) =>
          activity.athlete_id === deletedGameActivity.athlete_id &&
          activity.absolute_minute === deletedGameActivity.absolute_minute &&
          activity.kind === eventTypes.yellow
      );
    }

    if (pitchViewEnabled && deletedGameActivity.kind === eventTypes.goal) {
      const goalGameActivity = props.gameActivities.filter(
        (gameActivity) => gameActivity.id === deletedGameActivity.id
      )[0];
      const linkedActivityIndexFromEvent = props.gameActivities.findIndex(
        (activity) =>
          activity?.game_activity_id === goalGameActivity?.id &&
          activity.kind === eventTypes.assist
      );
      if (linkedActivityIndexFromEvent !== -1) {
        deletedGoalAssistIndex = linkedActivityIndexFromEvent;
      }

      const linkedOwnGoalIndexFromEvent = props.gameActivities.findIndex(
        (activity) =>
          activity?.game_activity_id === deletedGameActivity?.id &&
          activity.kind === eventTypes.own_goal
      );
      if (linkedOwnGoalIndexFromEvent !== -1) {
        deletedOwnGoalIndex = linkedOwnGoalIndexFromEvent;
      }
    }

    if (
      pitchViewEnabled &&
      (deletedGameActivity.kind === eventTypes.sub ||
        deletedGameActivity.kind === eventTypes.switch)
    ) {
      const substitutionGameActivity = props.gameActivities.find(
        (gameActivity) => gameActivity.id === deletedGameActivity.id
      );
      // Get all 'position_change' and 'position_formation_view_change' activities with the game_activity_id
      const linkedActivities = props.gameActivities.filter((gameActivity) => {
        return gameActivity?.game_activity_id === substitutionGameActivity?.id;
      });
      if (linkedActivities.length) {
        linkedActivities.forEach((linkedActivity) => {
          deletedSubstitutionLinkedActivities.push({
            id: linkedActivity.id,
            delete: true,
          });
        });
      }
    }

    if (deletedGameActivityId) {
      // Add the item to the list of deletion if it is a saved item
      // Add the corresponding formation_position_view_change as well if it exists
      // Add the corresponding assist if it exists
      setGameActivityDeletions((prevActivityDeletions) => [
        ...prevActivityDeletions,
        { id: deletedGameActivityId, delete: true },
        ...(deletedPitchActivityIndex !== null &&
        props.gameActivities[deletedPitchActivityIndex]?.id
          ? [getDeleteActivity(deletedPitchActivityIndex)]
          : []),
        ...(deletedRedCardIndex !== null &&
        props.gameActivities[deletedRedCardIndex]?.id
          ? [getDeleteActivity(deletedRedCardIndex)]
          : []),
        ...(deletedYellowCardIndex !== null &&
        props.gameActivities[deletedYellowCardIndex]?.id
          ? [getDeleteActivity(deletedYellowCardIndex)]
          : []),
        ...(deletedGoalAssistIndex !== null &&
        props.gameActivities[deletedGoalAssistIndex]?.id
          ? [getDeleteActivity(deletedGoalAssistIndex)]
          : []),
        ...(deletedOwnGoalIndex !== null &&
        props.gameActivities[deletedOwnGoalIndex]?.id
          ? [getDeleteActivity(deletedOwnGoalIndex)]
          : []),
        ...deletedSubstitutionLinkedActivities,
      ]);
    }

    // Remove both the item and any linked items from the list of updates
    setGameActivityUpdates((prevActivityUpdates) =>
      prevActivityUpdates.filter(
        (el, index) =>
          index !== gameActivityIndex &&
          el.game_activity_id !== prevActivityUpdates[gameActivityIndex]?.id
      )
    );
  };

  const addGameActivity = () => {
    switch (props.gameActivityKind) {
      case eventTypes.position_change:
        TrackEvent('Game Events', 'Add', 'Position');
        break;
      case eventTypes.yellow:
        TrackEvent('Game Events', 'Add', 'Yellow card');
        break;
      case eventTypes.red:
        TrackEvent('Game Events', 'Add', 'Red card');
        break;
      case eventTypes.goal:
        TrackEvent('Game Events', 'Add', 'Goal');
        break;
      case eventTypes.own_goal:
        TrackEvent('Game Events', 'Add', 'Own goal');
        break;
      case eventTypes.assist:
        TrackEvent('Game Events', 'Add', 'Assist');
        break;
      default:
        break;
    }

    setGameActivityUpdates((prevActivityUpdates) => {
      const isRelationIdRequired =
        props.gameActivityKind === eventTypes.position_change;
      const isOwnGoalActivity = props.gameActivityKind === eventTypes.own_goal;
      const formFields = {
        minute: 0,
        absolute_minute: +props.period.absolute_duration_start,
        athlete_id: props.athlete.id,
        relation_id: null,
      };

      return [
        ...prevActivityUpdates,
        {
          // If own goal, store as goal but add own_goal in nested activities
          kind: isOwnGoalActivity ? eventTypes.goal : props.gameActivityKind,
          ...(isOwnGoalActivity && {
            game_activities: [
              {
                kind: eventTypes.own_goal,
                organisation_id: props.event?.squad?.owner_id,
                ...formFields,
              },
            ],
          }),
          ...formFields,
          validation: {
            minute: {
              valid: false,
              showError: false,
            },
            relation_id: {
              valid: !isRelationIdRequired,
              showError: false,
            },
          },
        },
      ];
    });
  };

  const getGameActivitiesList = () => {
    if (
      gameActivityUpdates.filter(
        (activity) => activity.absolute_minute !== undefined
      ).length === 0
    ) {
      return <div>{props.t('No Event')}</div>;
    }

    const filterOutLinkedActivities = (
      gameActivities: Array<GameActivityForm>
    ) => {
      return gameActivities.reduce((acc, gameActivity, index) => {
        if (!gameActivity?.game_activity_id) {
          acc.push({
            gameActivity,
            index,
            filteredIndex: acc.length,
          });
        }
        return acc;
      }, []);
    };

    return (
      <div css={[style.gameActivityForm, style.grid.template]}>
        {/* Form header */}
        {props.gameActivityKind === eventTypes.position_change && (
          <div css={[style.gameActivityForm__label, style.grid.positionLabel]}>
            {props.t('Positions')}
          </div>
        )}
        <div css={[style.gameActivityForm__label, style.grid.minuteLabel]}>
          {props.gameActivityKind === eventTypes.sub && pitchViewEnabled
            ? props.t('Changed at')
            : props.t('Minute')}
        </div>
        {props.gameActivityKind === eventTypes.sub && pitchViewEnabled && (
          <div
            css={[style.gameActivityForm__label, style.grid.positionToLabel]}
          >
            {props.t('Position to')}
          </div>
        )}
        {props.gameActivityKind === eventTypes.goal && pitchViewEnabled && (
          <div css={[style.gameActivityForm__label, style.grid.assistLabel]}>
            {props.t('Assist')}
          </div>
        )}

        {/* Form content */}
        {filterOutLinkedActivities(gameActivityUpdates).map(
          ({ gameActivity, index, filteredIndex }) => (
            <Fragment key={index}>
              <div data-testid="GameEventListViewCell|GameActivityIndex">
                {filteredIndex + 1}.
              </div>
              {props.gameActivityKind === eventTypes.position_change &&
                !pitchViewEnabled && (
                  <div
                    data-testid={
                      gameActivity.validation.relation_id.showError &&
                      !gameActivity.validation.relation_id.valid &&
                      'invalid-position-selection'
                    }
                  >
                    <Select
                      options={positionsDropdownOptions}
                      onChange={(positionId) =>
                        setGameActivityRelationId(index, positionId)
                      }
                      invalid={
                        gameActivity.validation.relation_id.showError &&
                        !gameActivity.validation.relation_id.valid
                      }
                      value={gameActivity.relation_id}
                      placeholder={props.t('Position')}
                    />
                  </div>
                )}
              {props.gameActivityKind === eventTypes.position_change &&
                pitchViewEnabled && (
                  <div
                    data-testid={
                      gameActivity.validation.relation_id.showError &&
                      !gameActivity.validation.relation_id.valid &&
                      'invalid-position-selection'
                    }
                  >
                    <Select
                      options={positionsDropdownOptions}
                      onChange={(positionId) =>
                        setGameActivityRelationId(index, positionId)
                      }
                      invalid={
                        gameActivity.validation.relation_id.showError &&
                        !gameActivity.validation.relation_id.valid
                      }
                      value={gameActivity.relation_id}
                      placeholder={props.t('Position')}
                    />
                  </div>
                )}
              <div
                data-testid={
                  gameActivity.validation.minute.showError &&
                  !gameActivity.validation.minute.valid &&
                  'invalid-minute-input'
                }
              >
                <InputTextField
                  value={gameActivity.absolute_minute?.toString()}
                  onChange={(e) => setGameActivityMinute(index, e.target.value)}
                  invalid={
                    gameActivity.validation.minute.showError &&
                    !gameActivity.validation.minute.valid
                  }
                  onBlur={() => showFieldError(index, 'minute')}
                  inputType="number"
                  kitmanDesignSystem
                  disabled={
                    props.gameActivityKind === eventTypes.sub &&
                    pitchViewEnabled &&
                    !canEditSubSwapGameActivity(
                      props.gameActivities,
                      gameActivity
                    )
                  }
                />
              </div>

              {props.gameActivityKind === eventTypes.sub &&
                pitchViewEnabled && (
                  <div data-testid="GameEventListViewCell|SubstitutionPlayerSelector">
                    <Select
                      options={substitutionSwapDropdownOptions}
                      onChange={(athleteId) =>
                        handleSubstitutionSwapDropdownChange(
                          index,
                          gameActivity,
                          athleteId
                        )
                      }
                      invalid={
                        gameActivity.validation.relation_id.showError &&
                        !gameActivity.validation.relation_id.valid
                      }
                      value={gameActivity?.relation_id || null}
                      placeholder={props.t('Select')}
                      isDisabled={
                        !canEditSubSwapGameActivity(
                          props.gameActivities,
                          gameActivity
                        )
                      }
                    />
                  </div>
                )}

              {props.gameActivityKind === eventTypes.goal &&
                pitchViewEnabled && (
                  <div data-testid="GameEventListViewCell|GoalAssistPlayerSelector">
                    <Select
                      options={getAssistDropdownOptions(props.athlete.id)}
                      onChange={(athleteId) =>
                        handleGoalAssistDropdownChange(
                          index,
                          gameActivity,
                          athleteId
                        )
                      }
                      invalid={
                        gameActivity.validation.relation_id.showError &&
                        !gameActivity.validation.relation_id.valid
                      }
                      value={getAssistAthleteId(gameActivity)}
                      placeholder={props.t('Assist')}
                    />
                  </div>
                )}

              {props.gameActivityKind === eventTypes.sub &&
                pitchViewEnabled &&
                canEditSubSwapGameActivity(
                  props.gameActivities,
                  gameActivity
                ) && (
                  <div>
                    <button
                      onClick={() => removeGameActivity(index)}
                      type="button"
                      css={style.gameActivityForm__removeBtn}
                      className="icon-close"
                      data-testid="GameEventListViewCell|DeleteButton"
                    />
                  </div>
                )}

              {props.gameActivityKind === eventTypes.sub &&
                pitchViewEnabled &&
                !canEditSubSwapGameActivity(
                  props.gameActivities,
                  gameActivity
                ) && <div />}

              {props.gameActivityKind !== eventTypes.sub && (
                <div>
                  <button
                    onClick={() => removeGameActivity(index)}
                    type="button"
                    css={style.gameActivityForm__removeBtn}
                    className="icon-close"
                    data-testid="GameEventListViewCell|DeleteButton"
                  />
                </div>
              )}

              {props.period &&
                gameActivity.validation.minute.showError &&
                !gameActivity.validation.minute.valid && (
                  <div css={[style.grid.errorLabel]}>
                    {props.t(
                      'Minute must be between {{periodDurationMin}} and {{periodDurationMax}}',
                      {
                        periodDurationMin: props.periodDuration.min,
                        periodDurationMax: props.periodDuration.max,
                      }
                    )}
                  </div>
                )}
            </Fragment>
          )
        )}
      </div>
    );
  };

  const getGameActivitiesListNoneEdit = () => {
    if (
      gameActivityUpdates.filter(
        (activity) => activity.absolute_minute !== undefined
      ).length === 0
    ) {
      return <div>{props.t('No Event')}</div>;
    }

    return (
      <div css={[style.gameActivityForm, style.grid.template]}>
        {/* Form header */}
        {props.gameActivityKind === eventTypes.position_change && (
          <div css={[style.gameActivityForm__label, style.grid.positionLabel]}>
            {props.t('Positions')}
          </div>
        )}
        <div css={[style.gameActivityForm__label, style.grid.minuteLabel]}>
          {props.t('Minute')}
        </div>

        {/* Form content */}
        {gameActivityUpdates
          .filter((gameActivity) => !gameActivity.game_activity_id)
          .map((gameActivity, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Fragment key={index}>
              <div data-testid="GameEventListViewCell|GameActivityIndex">
                {index + 1}.
              </div>
              {props.gameActivityKind === eventTypes.position_change && (
                <div>
                  {positionsDropdownOptions.find(
                    (position) => position.value === gameActivity.relation_id
                  )?.label || 'SUB'}
                </div>
              )}
              <div>{gameActivity.absolute_minute}</div>
              <div>&nbsp;</div>
            </Fragment>
          ))}
      </div>
    );
  };

  if (requestStatus === 'FAILURE') {
    return <AppStatus status="error" />;
  }

  const renderListViewStartingPositionDropdownCell = () => (
    <Select
      options={positionsDropdownOptions}
      onChange={(positionId) => handleStartingPositionOptionChange(positionId)}
      value={getAthleteStartingPosition()}
      placeholder={props.t('Position')}
      menuPlacement="bottom"
      menuPosition="fixed"
      showAutoWidthDropdown
      closeMenuOnScroll
    />
  );

  const renderListViewNormalCell = () =>
    props.canEditEvent || props.gameActivityKind === eventTypes.sub ? (
      <Tippy
        placement="bottom-start"
        content={
          !props.preventGameEvents && (
            <div css={[style.gameActivityTooltip, style.tooltipWidth]}>
              <header
                css={style.tooltipHeader}
                data-testid="GameEventListViewCell|Header"
              >
                <h3 css={style.gameActivityTooltip__title}>
                  {gameActivityName}
                </h3>
                <button
                  onClick={() => {
                    if (tooltipInstance) {
                      tooltipInstance.hide();
                    }
                  }}
                  type="button"
                  css={style.gameActivityTooltip__closeBtn}
                  className="icon-close"
                />
              </header>
              <div css={style.gameActivityTooltip__content}>
                {getGameActivitiesList()}

                {!checkIfMaxCards && (
                  <div css={style.gameActivityTooltip__addGameActivityBtn}>
                    <TextButton
                      onClick={addGameActivity}
                      iconBefore="icon-add"
                      type="primary"
                      kitmanDesignSystem
                      data-testid="GameEventListViewCell|AddButton"
                    />
                  </div>
                )}
              </div>
              <footer css={style.tooltipFooter}>
                <TextButton
                  onClick={onClickSave}
                  text={props.t('Save')}
                  type="primary"
                  kitmanDesignSystem
                  data-testid="GameEventListViewCell|SaveButton"
                />
              </footer>
            </div>
          )
        }
        disabled={props.isCellDisabled}
        theme="neutral-tooltip--kitmanDesignSystem"
        trigger="click"
        onTrigger={handlePreventEventCreation}
        interactive
        appendTo={document.body}
        onCreate={setTooltipInstance}
      >
        <div
          css={
            requestStatus === 'PENDING' &&
            css`
              background-color: ${colors.neutral_200};
            `
          }
        >
          <TextButton
            text={getCellText()}
            type="subtle"
            kitmanDesignSystem
            shouldFitContainer
            onClick={resetForm}
            isDisabled={requestStatus === 'PENDING' || props.isCellDisabled}
          />
        </div>
      </Tippy>
    ) : (
      <Tippy
        placement="bottom-start"
        content={
          <div css={[style.gameActivityTooltip, style.tooltipWidth]}>
            <header
              css={style.tooltipHeader}
              data-testid="GameActivityCell|Header"
            >
              <h3 css={style.gameActivityTooltip__title}>{gameActivityName}</h3>
              <button
                onClick={() => {
                  if (tooltipInstance) {
                    tooltipInstance.hide();
                  }
                }}
                type="button"
                css={style.gameActivityTooltip__closeBtn}
                className="icon-close"
              />
            </header>
            <div css={style.gameActivityTooltip__content}>
              {getGameActivitiesListNoneEdit()}
            </div>
            <footer css={style.tooltipFooter} />
          </div>
        }
        theme="neutral-tooltip--kitmanDesignSystem"
        interactive
        appendTo={document.body}
        onCreate={setTooltipInstance}
      >
        <div
          css={
            requestStatus === 'PENDING' &&
            css`
              background-color: ${colors.neutral_200};
            `
          }
        >
          {getCellText()}
        </div>
      </Tippy>
    );

  const renderGameActivityCell = () => {
    if (pitchViewEnabled && props.canEditEvent && !props.hasPeriodStarted)
      return renderListViewStartingPositionDropdownCell();
    return renderListViewNormalCell();
  };

  return renderGameActivityCell();
};

export const GameEventListViewCellTranslated = withNamespaces()(
  GameEventListViewCell
);
export default GameEventListViewCell;
