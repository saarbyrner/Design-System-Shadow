import $ from 'jquery';
import {
  getGameActivities,
  createGameActivity,
  updateGameActivity,
  gameActivitiesBulkSave,
} from '..';

describe('getGameActivities', () => {
  const mockedGameActivities = [
    { id: 1, kind: 'yellow_card', minute: 40, athlete_id: 1 },
    { id: 4, kind: 'yellow_card', minute: 62, athlete_id: 1 },
  ];

  let getGameActivitiesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getGameActivitiesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedGameActivities));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getGameActivities({ eventId: 1 });

    expect(returnedData).toEqual(mockedGameActivities);

    expect(getGameActivitiesRequest).toHaveBeenCalledTimes(1);
    expect(getGameActivitiesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/planning_hub/events/1/game_activities',
    });
  });

  it('calls the correct endpoint and returns the correct value as supervisor view', async () => {
    const returnedData = await getGameActivities({
      eventId: 1,
      supervisorView: true,
    });

    expect(returnedData).toEqual(mockedGameActivities);

    expect(getGameActivitiesRequest).toHaveBeenCalledTimes(1);
    expect(getGameActivitiesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/planning_hub/events/1/game_activities?supervisor_view=true',
    });
  });
});

describe('createGameActivity', () => {
  const mockedNewGameActivity = {
    id: null,
    kind: 'yellow_card',
    minute: 40,
    athlete_id: 1,
  };

  let createGameActivityRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    createGameActivityRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedNewGameActivity));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await createGameActivity(5, mockedNewGameActivity);

    expect(returnedData).toEqual(mockedNewGameActivity);

    expect(createGameActivityRequest).toHaveBeenCalledTimes(1);
    expect(createGameActivityRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/planning_hub/events/5/game_activities',
      contentType: 'application/json',
      data: JSON.stringify(mockedNewGameActivity),
    });
  });
});

describe('updateGameActivity', () => {
  const mockedUpdatedGameActivity = {
    id: 1,
    kind: 'yellow_card',
    minute: 40,
    athlete_id: 1,
  };

  let updateGameActivityRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    updateGameActivityRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedUpdatedGameActivity));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const returnedData = await updateGameActivity(5, mockedUpdatedGameActivity);

    expect(returnedData).toEqual(mockedUpdatedGameActivity);

    expect(updateGameActivityRequest).toHaveBeenCalledTimes(1);
    expect(updateGameActivityRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: '/ui/planning_hub/events/5/game_activities/1',
      contentType: 'application/json',
      data: JSON.stringify(mockedUpdatedGameActivity),
    });
  });
});

describe('gameActivitiesBulkSave', () => {
  const mockedGameActivities = [
    { id: 1, minute: 40 },
    { kind: 'yellow_card', minute: 62, athlete_id: 1 },
    { id: 2, delete: true },
  ];

  const mockedReturnedGameActivities = [
    { id: 1, kind: 'yellow_card', athlete_id: 1, minute: 40 },
    { id: 3, kind: 'yellow_card', minute: 62, athlete_id: 1 },
  ];

  let gameActivitiesBulkSaveRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    gameActivitiesBulkSaveRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedReturnedGameActivities));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const returnedData = await gameActivitiesBulkSave(5, mockedGameActivities);

    expect(returnedData).toEqual(mockedReturnedGameActivities);

    expect(gameActivitiesBulkSaveRequest).toHaveBeenCalledTimes(1);
    expect(gameActivitiesBulkSaveRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/planning_hub/events/5/game_activities/bulk_save',
      contentType: 'application/json',
      data: JSON.stringify({ game_activities: mockedGameActivities }),
    });
  });
});
