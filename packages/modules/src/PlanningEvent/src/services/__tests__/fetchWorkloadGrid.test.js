import $ from 'jquery';
import { data as mockedWorkloadGrid } from '@kitman/services/src/mocks/handlers/planningEvent/fetchWorkloadGrid';
import fetchWorkloadGrid from '../fetchWorkloadGrid';

describe('fetchWorkloadGrid', () => {
  let fetchWorkloadGridRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    fetchWorkloadGridRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedWorkloadGrid));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await fetchWorkloadGrid({
      eventId: 1,
      nextId: null,
      filters: {},
    });

    expect(returnedData).toEqual(mockedWorkloadGrid);

    expect(fetchWorkloadGridRequest).toHaveBeenCalledTimes(1);
    expect(fetchWorkloadGridRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/planning_hub/events/1/collections_tab',
      contentType: 'application/json',
      data: JSON.stringify({
        next_id: null,
        filters: {},
      }),
    });
  });
});
