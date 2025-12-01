import $ from 'jquery';
import getCategories from '../getCategories';

const mockedData = [
  [
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
];

describe('getCategories', () => {
  let getCategoriesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getCategoriesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getCategories();

    expect(returnedData).toEqual(mockedData);

    expect(getCategoriesRequest).toHaveBeenCalledTimes(1);
    expect(getCategoriesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/planning_hub/principle_categories',
    });
  });
});
