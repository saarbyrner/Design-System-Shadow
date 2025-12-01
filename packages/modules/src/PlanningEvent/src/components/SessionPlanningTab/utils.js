// @flow
import type {
  EventActivity,
  EventActivityAthlete,
} from '@kitman/common/src/types/Event';
import type { EventActivityAttributes } from '../../../types';

export const buildActivityAttributes = (
  activityId: number,
  eventActivities: Array<EventActivity>
): EventActivityAttributes | null => {
  const selectedActivity = eventActivities.find(
    (activity) => activity.id === activityId
  );

  if (!selectedActivity) {
    return null;
  }

  return {
    duration: selectedActivity.duration,
    event_activity_type_id: selectedActivity.event_activity_type?.id || null,
    principle_ids: selectedActivity.principles.map((principle) => principle.id),
    athlete_ids: selectedActivity.athletes.map((athlete) => athlete.id),
    user_ids: selectedActivity.users.map((user) => user.id),
  };
};

export type PrinciplesAction = 'ADD' | 'DELETE' | 'UPDATE';
export type PrincipleIds = Array<number | string>;

export const getPrincipleIds = ({
  action,
  activityAttributes,
  principleIds,
}: {
  action: PrinciplesAction,
  activityAttributes: EventActivityAttributes,
  principleIds: PrincipleIds,
}): PrincipleIds => {
  switch (action) {
    case 'ADD':
      return [...activityAttributes.principle_ids, ...principleIds];
    case 'DELETE':
      return activityAttributes.principle_ids.filter(
        (activityPrincipleId) => activityPrincipleId !== principleIds[0]
      );
    case 'UPDATE':
    default:
      return [...principleIds];
  }
};

export type ActivityItem = {
  id: number | string,
  name: string,
  athletes: Array<EventActivityAthlete>,
  isSelectable: boolean,
};

export const areAllAthletesParticipating = ({
  activity,
  participants,
}: {
  activity: ActivityItem,
  participants: Array<EventActivityAthlete>,
}): boolean => {
  const athleteIds = activity.athletes.map((athlete) => athlete.id).sort();
  const participantIds = participants
    .map((participant) => participant.id)
    .sort();
  return participantIds.every((val) => athleteIds.includes(val));
};

export const updateActivityForAthletes = ({
  isSelected,
  currentActivityAthletes,
  participantAthletes,
}: {
  isSelected: boolean,
  currentActivityAthletes: Array<EventActivityAthlete>,
  participantAthletes: Array<EventActivityAthlete>,
}): Array<number> => {
  const participantAthletesIds = participantAthletes.map(
    (athlete) => athlete.id
  );
  const currentActivityIds = currentActivityAthletes.map(
    (athlete) => athlete.id
  );
  return isSelected
    ? [...new Set([...participantAthletesIds, ...currentActivityIds])]
    : currentActivityIds.filter((id) => !participantAthletesIds.includes(id));
};
