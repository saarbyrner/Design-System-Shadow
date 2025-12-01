import { axios } from '@kitman/common/src/utils/services';
import { data } from '@kitman/services/src/mocks/handlers/leaguefixtures/getUserEventRequestRejectReasonsHandler';
import getUserEventRequestRejectReasons from '../getUserEventRequestRejectReasons';

describe('getUserEventRequestRejectReasons', () => {
  const formattedData = data.map((rejectReason) => ({
    id: rejectReason.id,
    name: rejectReason.type_name,
    require_additional_input: rejectReason.require_additional_input,
  }));
  beforeEach(() => {
    jest.spyOn(axios, 'get');
  });
  it('returns the relevant reject reasons from getUserEventRequestRejectReasons', async () => {
    expect(await getUserEventRequestRejectReasons()).toEqual(formattedData);
    expect(axios.get).toHaveBeenCalledWith(
      '/planning_hub/user_event_requests/rejection_reasons'
    );
  });
});
