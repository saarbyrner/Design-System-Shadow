import { axios } from '@kitman/common/src/utils/services';
import deleteEvent from '../deleteEvent';

describe('deleteEvent', () => {
  let deleteEventRequest;

  beforeEach(() => {
    deleteEventRequest = jest.spyOn(axios, 'delete');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const queryParams = { paramsOne: 1, paramTwo: 2 };
    await deleteEvent(5, queryParams);

    expect(deleteEventRequest).toHaveBeenCalledTimes(1);
    expect(deleteEventRequest).toHaveBeenCalledWith('/planning_hub/events/5', {
      params: queryParams,
    });
  });
});
