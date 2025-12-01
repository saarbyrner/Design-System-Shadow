import {
  buildActivityAttributes,
  getPrincipleIds,
  areAllAthletesParticipating,
  updateActivityForAthletes,
} from '../utils';

describe('buildActivityAttributes', () => {
  let mockedNoSelectedActivityId;
  let mockedSelectedActivityId;
  let mockedEventActivities;

  beforeEach(() => {
    mockedNoSelectedActivityId = 3;
    mockedSelectedActivityId = 1;
    mockedEventActivities = [
      {
        athletes: [],
        duration: null,
        id: 1,
        principles: [],
        event_activity_drill: null,
        users: [],
        event_activity_type: null,
      },
      {
        athletes: [],
        duration: null,
        id: 2,
        principles: [],
        event_activity_drill: null,
        users: [],
        event_activity_type: null,
      },
    ];
  });

  it('should return null when there is no selectedActivity', () => {
    expect(
      buildActivityAttributes(mockedNoSelectedActivityId, mockedEventActivities)
    ).toBeNull();
  });

  it('should return an object with the activity attributes when there is selectedActivity', () => {
    expect(
      buildActivityAttributes(mockedSelectedActivityId, mockedEventActivities)
    ).toEqual({
      duration: null,
      event_activity_type_id: null,
      principle_ids: [],
      athlete_ids: [],
      user_ids: [],
    });
  });
});

describe('getPrincipleIds', () => {
  let mockedActivityAttributes;

  beforeEach(() => {
    mockedActivityAttributes = {
      duration: null,
      principle_ids: [1, 2],
      athlete_ids: [],
      user_ids: [],
    };
  });

  it('should return the correct ids when the action is ADD', () => {
    expect(
      getPrincipleIds({
        action: 'ADD',
        activityAttributes: mockedActivityAttributes,
        principleIds: [3],
      })
    ).toEqual([1, 2, 3]);
  });

  it('should return the correct ids when the action is DELETE', () => {
    expect(
      getPrincipleIds({
        action: 'DELETE',
        activityAttributes: mockedActivityAttributes,
        principleIds: [2],
      })
    ).toEqual([1]);
  });

  it('should return the correct ids when the action is UPDATE', () => {
    expect(
      getPrincipleIds({
        action: 'UPDATE',
        activityAttributes: mockedActivityAttributes,
        principleIds: [3],
      })
    ).toEqual([3]);
  });
});

describe('areAllAthletesParticipating', () => {
  let mockedActivityItem;
  let mockedParticipants;

  beforeEach(() => {
    mockedParticipants = [
      {
        avatar_url: 'url',
        id: 1,
        name: 'athlete_one',
        participation_level: 'full',
        availability: 'available',
        position: { id: 1, name: 'position_one' },
      },
      {
        avatar_url: 'url',
        id: 2,
        name: 'athlete_two',
        participation_level: 'full',
        availability: 'available',
        position: { id: 1, name: 'position_one' },
      },
      {
        avatar_url: 'url',
        id: 3,
        name: 'athlete_three',
        participation_level: 'full',
        availability: 'available',
        position: { id: 1, name: 'position_one' },
      },
    ];
    mockedActivityItem = {
      id: 1,
      name: 'activity_item_one',
      athletes: [mockedParticipants[0], mockedParticipants[1]],
      isSelectable: true,
    };
  });

  it('should return false if not all athletes are participating', () => {
    expect(
      areAllAthletesParticipating({
        activity: mockedActivityItem,
        participants: mockedParticipants,
      })
    ).toBe(false);
  });

  it('should return true if all athletes are participating', () => {
    expect(
      areAllAthletesParticipating({
        activity: mockedActivityItem,
        participants: [mockedParticipants[0], mockedParticipants[1]],
      })
    ).toBe(true);
  });
});

describe('updateActivityForAthletes', () => {
  let mockedCurrentActivityAthletes;
  let mockedParticipantAthletes;
  let isSelected;

  beforeEach(() => {
    mockedParticipantAthletes = [
      {
        avatar_url: 'url',
        id: 1,
        name: 'athlete_one',
        participation_level: 'full',
        availability: 'available',
        position: { id: 1, name: 'position_one' },
      },
      {
        avatar_url: 'url',
        id: 2,
        name: 'athlete_two',
        participation_level: 'full',
        availability: 'available',
        position: { id: 1, name: 'position_one' },
      },
      {
        avatar_url: 'url',
        id: 3,
        name: 'athlete_three',
        participation_level: 'full',
        availability: 'available',
        position: { id: 1, name: 'position_one' },
      },
    ];
    mockedCurrentActivityAthletes = [
      mockedParticipantAthletes[0],
      mockedParticipantAthletes[1],
    ];
  });

  it('should return all the athletes list if isSelected is true', () => {
    isSelected = true;
    expect(
      updateActivityForAthletes({
        isSelected,
        currentActivityAthletes: mockedCurrentActivityAthletes,
        participantAthletes: mockedParticipantAthletes,
      })
    ).toEqual([1, 2, 3]);
  });

  it('should return a reduced athletes list if isSelected is false', () => {
    isSelected = false;
    expect(
      updateActivityForAthletes({
        isSelected,
        currentActivityAthletes: mockedCurrentActivityAthletes,
        participantAthletes: [mockedParticipantAthletes[0]],
      })
    ).toEqual([2]);
  });
});
