// @flow
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import type {
  GameActivity,
  GamePeriod,
} from '@kitman/common/src/types/GameEvent';
import type { Athlete } from '@kitman/common/src/types/Event';
import type { FormationCoordinates } from '@kitman/common/src/types/PitchView';
import type { GameActivityForm } from '@kitman/modules/src/PlanningEvent/src/services/gameActivities';
import { updateFormationPlayerActivities } from '@kitman/common/src/utils/planningEvent/gameActivityUtils';
import type { Formation } from '@kitman/modules/src/PlanningEvent/src/services/formations';
import { getNextCoords } from '../../utils';

const getListViewFormationCoordinatesAndTeamChanges = async ({
  athletes,
  activitiesForPeriod,
  currentCoordinates,
  formationActivity,
}: {
  athletes: Array<Athlete>,
  activitiesForPeriod: Array<GameActivity>,
  currentCoordinates: FormationCoordinates,
  formationActivity: GameActivityForm,
}) => {
  const currentInFieldTeam = {};
  // Goes through each coordinate sorting by absolute_minute as a failsafe sort making sure things are in order and
  // creating the recreating how the current state of the pitch looks like coordinate wise to match the pitch view
  Object.keys(currentCoordinates).forEach((coordinate) => {
    const foundActivity = [...activitiesForPeriod]
      .sort((a, b) => +b.absolute_minute - +a.absolute_minute)
      .find(
        (activity) =>
          activity.relation?.id === currentCoordinates[coordinate].id &&
          activity.kind === eventTypes.formation_position_view_change
      );

    if (foundActivity)
      currentInFieldTeam[coordinate] = athletes.find(
        (athlete) => athlete.id === foundActivity?.athlete_id
      );
  });

  // Gets the next coordinates to be used based on the formation change that has been updated.
  const updatedCoordinates = await getNextCoords(
    1,
    +formationActivity?.relation_id
  );

  const currentTeamSize = Object.values(currentInFieldTeam).length;
  const newTeamCoords = Object.keys(updatedCoordinates).slice(
    0,
    currentTeamSize
  );

  const updatedInField = {};

  // Builds the updated team in the field based on the new coords.
  newTeamCoords.forEach((coord, index) => {
    updatedInField[coord] = Object.values(currentInFieldTeam)[index];
  });

  return { updatedCoordinates, updatedInField };
};

export const handleListChangingFormationPitchAssignments = async ({
  allGameActivities,
  selectedPeriod,
  athletes,
  formations,
  formationCoordinates,
  formationGameActivities,
}: {
  allGameActivities: Array<GameActivity>,
  selectedPeriod: GamePeriod,
  athletes: Array<Athlete>,
  formations: Array<Formation>,
  formationCoordinates: FormationCoordinates,
  formationGameActivities: Array<GameActivityForm>,
}) => {
  let currentCoordinates = {
    ...formationCoordinates,
  };

  const activitiesForPeriod = allGameActivities.filter(
    (gameActivity) => gameActivity.game_period_id === selectedPeriod?.id
  );

  return Promise.all(
    formationGameActivities.map(async (activityToUpdate, eventIndex) => {
      const currentActivityIndex = allGameActivities.findIndex(
        (activity) => activity.id === activityToUpdate.id
      );

      // Return the activity if no changes were made to the activity and the relation and the minute remains unchanged
      if (
        allGameActivities[currentActivityIndex]?.relation?.id ===
          activityToUpdate.relation_id &&
        allGameActivities[currentActivityIndex]?.absolute_minute ===
          activityToUpdate?.absolute_minute
      )
        return activityToUpdate;

      const foundNewFormation = formations.find(
        (formation) => formation.id === activityToUpdate.relation_id
      );

      // Get the current formation coordinates needed to update the position_changes/formation_position_view_changes
      // as well as the predicted updated inField team.
      const { updatedCoordinates, updatedInField } =
        await getListViewFormationCoordinatesAndTeamChanges({
          activitiesForPeriod,
          athletes,
          currentCoordinates,
          formationActivity: activityToUpdate,
        });

      currentCoordinates = updatedCoordinates;

      const formationActivityToUpdate = { ...activityToUpdate };
      formationActivityToUpdate.game_activities = [];

      // Handles creating the updated activities for the formation
      const updatedActivities = updateFormationPlayerActivities({
        gameActivities: formationGameActivities,
        currentActivity: formationActivityToUpdate,
        inFieldTeam: updatedInField,
        updatedCoordinates,
        eventIndex,
        foundNewFormation,
        currentPeriod: selectedPeriod,
      });

      return updatedActivities[eventIndex];
    })
  );
};
