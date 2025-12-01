import { axios } from '@kitman/common/src/utils/services';
import {
  bulkUpdateAthleteLabels,
  labelUpdateURL,
} from '../bulkUpdateAthleteLabels';

describe('bulkUpdateAthleteLabels', () => {
  let bulkUpdateRequest;

  beforeEach(() => {
    bulkUpdateRequest = jest.spyOn(axios, 'post');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns nothing', async () => {
    const requestParams = {
      athleteIds: [1, 2, 3],
      labelsToAdd: [4, 5, 6],
      labelsToRemove: [7, 8, 9],
    };
    const response = await bulkUpdateAthleteLabels(requestParams);

    expect(bulkUpdateRequest).toHaveBeenCalledTimes(1);
    expect(bulkUpdateRequest).toHaveBeenCalledWith(labelUpdateURL, {
      athlete_ids: requestParams.athleteIds,
      labels_to_add: requestParams.labelsToAdd,
      labels_to_remove: requestParams.labelsToRemove,
    });
    expect(response).toEqual();
  });
});
