import { axios } from '@kitman/common/src/utils/services';
import { data as mockData } from '@kitman/services/src/mocks/handlers/analysis/getPastAthletes';
import getPastAthletes, {
  PAST_ATHLETES_ENDPOINT_URL,
} from '../getPastAthletes';

const requestBody = {
  time_scope: { time_period: 'all_time' },
};

describe('getPastAthletes', () => {
  let request;

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => ({ data: mockData }));
  });

  it('makes the call to the correct endpoint', async () => {
    await getPastAthletes(requestBody);

    expect(request).toHaveBeenCalledWith(
      PAST_ATHLETES_ENDPOINT_URL,
      requestBody
    );
  });

  it('calls the correct endpoint and returns the correct data', async () => {
    const data = await getPastAthletes(requestBody);

    expect(data).toEqual(mockData);
  });
});
