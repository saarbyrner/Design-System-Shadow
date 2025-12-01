import { axios } from '@kitman/common/src/utils/services';
import { data as mockAvailabilities } from '@kitman/services/src/mocks/handlers/medical/getAthletesAvailabilities';
import getAthletesAvailabilities, {
  endpoint,
} from '../getAthletesAvailabilities';

describe('getAthletesAvailabilities', () => {
  let spyAxiosPost;

  beforeEach(() => {
    spyAxiosPost = jest.spyOn(axios, 'post');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const athleteIds = [275, 506, 594];

    const result = await getAthletesAvailabilities(athleteIds);

    expect(spyAxiosPost).toHaveBeenCalledTimes(1);
    expect(spyAxiosPost).toHaveBeenCalledWith(endpoint, {
      athlete_ids: athleteIds,
    });
    expect(result).toEqual(mockAvailabilities);
  });
});
