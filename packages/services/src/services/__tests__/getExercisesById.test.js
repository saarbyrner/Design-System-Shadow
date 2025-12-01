import { axios } from '@kitman/common/src/utils/services';
import { data } from '@kitman/services/src/mocks/handlers/rehab/getExercisesById';
import getExercisesById, {
  url,
} from '@kitman/services/src/services/rehab/getExercisesById';

describe('getExerciseData', () => {
  let getExercisesRequest;

  // MSW handler test
  it('returns the correct value', async () => {
    const returnedData1 = await getExercisesById([1, 2]);
    expect(returnedData1).toEqual(data);
  });

  describe('Mock axios', () => {
    beforeEach(() => {
      getExercisesRequest = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getExercisesById([1, 2]);
      expect(returnedData).toEqual(data);

      expect(getExercisesRequest).toHaveBeenCalledTimes(1);
      expect(getExercisesRequest).toHaveBeenCalledWith(
        url,
        {
          ids: [1, 2],
        },
        {}
      );
    });
  });
});
