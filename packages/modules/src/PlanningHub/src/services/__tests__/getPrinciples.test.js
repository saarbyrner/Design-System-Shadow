import $ from 'jquery';
import getPrinciples from '../getPrinciples';

const mockedData = [
  {
    id: 1,
    name: 'First principle',
    principle_categories: [
      {
        id: 1,
        name: 'Recovery and Regeneration',
      },
      {
        id: 3,
        name: 'Wide Play and Box Management',
      },
    ],
    principle_types: [
      {
        id: 1,
        sport_id: 2,
        sport: {
          id: 2,
          perma_id: 'rugby_union',
          name: 'Rugby Union',
          duration: 60,
        },
        name: 'Technical',
      },
    ],
    phases: [
      {
        id: 1,
        name: 'Attacking',
      },
    ],
    squads: [
      {
        id: 8,
        name: 'International Squad',
        owner_id: 6,
        created_at: '2013-10-17T15:10:14Z',
        updated_at: null,
      },
      {
        id: 73,
        name: 'Academy Squad',
        owner_id: 6,
        created_at: '2015-09-07T12:29:54Z',
        updated_at: '2015-09-07T12:29:54Z',
      },
    ],
  },
  {
    id: 2,
    name: 'Second principle',
    principle_categories: [
      {
        id: 2,
        name: 'Blocking + 1 v 1 Situations',
      },
      {
        id: 4,
        name: 'Shot Stopping + Footwork',
      },
      {
        id: 5,
        name: 'Game Preparation',
      },
    ],
    principle_types: [
      {
        id: 1,
        sport_id: 2,
        sport: {
          id: 2,
          perma_id: 'rugby_union',
          name: 'Rugby Union',
          duration: 60,
        },
        name: 'Technical',
      },
      {
        id: 2,
        sport_id: 3,
        sport: {
          id: 3,
          perma_id: 'cricket_union',
          name: 'Cricket Union',
          duration: 50,
        },
        name: 'Tactical',
      },
    ],
    phases: [
      {
        id: 1,
        name: 'Attacking',
      },
      {
        id: 2,
        name: 'Defending',
      },
    ],
    squads: [
      {
        id: 8,
        name: 'International Squad',
        owner_id: 6,
        created_at: '2013-10-17T15:10:14Z',
        updated_at: null,
      },
    ],
  },
  {
    id: 3,
    name: 'Third principle',
    principle_categories: [
      {
        id: 1,
        name: 'Recovery and Regeneration',
      },
      {
        id: 2,
        name: 'Blocking + 1 v 1 Situations',
      },
      {
        id: 3,
        name: 'Wide Play and Box Management',
      },
      {
        id: 4,
        name: 'Shot Stopping + Footwork',
      },
      {
        id: 5,
        name: 'Game Preparation',
      },
    ],
    principle_types: [
      {
        id: 1,
        sport_id: 2,
        sport: {
          id: 2,
          perma_id: 'rugby_union',
          name: 'Rugby Union',
          duration: 60,
        },
        name: 'Technical',
      },
      {
        id: 2,
        sport_id: 3,
        sport: {
          id: 3,
          perma_id: 'cricket_union',
          name: 'Cricket Union',
          duration: 50,
        },
        name: 'Tactical',
      },
      {
        id: 3,
        sport_id: 4,
        sport: {
          id: 4,
          perma_id: 'soccer_union',
          name: 'Soccer Union',
          duration: 70,
        },
        name: 'Physical',
      },
    ],
    phases: [
      {
        id: 1,
        name: 'Attacking',
      },
      {
        id: 2,
        name: 'Defending',
      },
      {
        id: 3,
        name: 'Transition',
      },
    ],
    squads: [
      {
        id: 8,
        name: 'International Squad',
        owner_id: 6,
        created_at: '2013-10-17T15:10:14Z',
        updated_at: null,
      },
      {
        id: 73,
        name: 'Academy Squad',
        owner_id: 6,
        created_at: '2015-09-07T12:29:54Z',
        updated_at: '2015-09-07T12:29:54Z',
      },
      {
        id: 1374,
        name: 'Player view',
        owner_id: 6,
        created_at: '2019-10-17T12:23:51Z',
        updated_at: '2019-10-17T12:23:51Z',
      },
    ],
  },
];

describe('getPrinciples', () => {
  let getPrinciplesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getPrinciplesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getPrinciples();

    expect(returnedData).toEqual(mockedData);

    expect(getPrinciplesRequest).toHaveBeenCalledTimes(1);
    expect(getPrinciplesRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/planning_hub/principles/search',
      contentType: 'application/json',
      data: JSON.stringify({ current_squad: false }),
    });
  });
});
