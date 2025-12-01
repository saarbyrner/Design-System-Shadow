import { axios } from '@kitman/common/src/utils/services';
import { data } from '@kitman/services/src/mocks/handlers/leaguefixtures/getUserEventRequestsHandler';
import getUserEventRequests from '../getUserEventRequests';

describe('getUserEventRequests', () => {
  beforeEach(() => {
    jest.spyOn(axios, 'get');
  });
  it('returns the relevant user event requests from getUserEventRequests', async () => {
    expect(await getUserEventRequests()).toEqual(data);
    expect(axios.get).toHaveBeenCalledWith('/planning_hub/user_event_requests');
  });

  it('calls the correct endpoint with the url param when the event id is present', async () => {
    expect(await getUserEventRequests({ eventId: 10 })).toEqual(data);
    expect(axios.get).toHaveBeenCalledWith(
      '/planning_hub/user_event_requests?event_id=10'
    );
  });
});
