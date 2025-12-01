import { axios } from '@kitman/common/src/utils/services';
import {
  ankleKeywordResultsData,
  data,
} from '@kitman/services/src/mocks/handlers/rehab/getExercises';
import getExercises, {
  url,
} from '@kitman/services/src/services/rehab/getExercises';

describe('getExerciseData', () => {
  let getExercisesRequest;

  // MSW handler test
  it('returns the correct value', async () => {
    const returnedData1 = await getExercises({
      rehabExerciseName: 'ankle',
      rehabExerciseCategory: null,
      organisationId: null,
      page: 1,
      resultsPerPage: 10,
      searchMode: 'contains',
    });
    expect(returnedData1).toEqual(ankleKeywordResultsData);

    const returnedData2 = await getExercises({
      rehabExerciseName: null,
      rehabExerciseCategory: null,
      organisationId: null,
      page: 1,
      resultsPerPage: 10,
      searchMode: 'contains',
    });
    expect(returnedData2).toEqual(data);
  });

  describe('Mock axios', () => {
    beforeEach(() => {
      getExercisesRequest = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getExercises({
        rehabExerciseName: null,
        rehabExerciseCategory: null,
        organisationId: null,
        page: 1,
        resultsPerPage: null, // Will default to 60
        searchMode: 'contains',
      });
      expect(returnedData).toEqual(data);

      expect(getExercisesRequest).toHaveBeenCalledTimes(1);
      expect(getExercisesRequest).toHaveBeenCalledWith(
        url,
        {
          page: 1,
          per_page: 60,
        },
        {}
      );
    });

    it('calls the endpoint with data for starts_with param', async () => {
      await getExercises({
        rehabExerciseName: 'exercise',
        rehabExerciseCategory: null,
        organisationId: null,
        page: 1,
        resultsPerPage: 50,
        searchMode: 'starts_with',
      });

      expect(getExercisesRequest).toHaveBeenCalledWith(
        url,
        {
          rehab_exercise_name: 'exercise',
          starts_with: true,
          page: 1,
          per_page: 50,
        },
        {}
      );
    });
  });
});
