import $ from 'jquery';
import exerciseVariations from '@kitman/services/src/mocks/handlers/exerciseVariations/data.mock';
import getRehabExerciseType from '../rehab/getRehabExercise';

describe('getExercisesVariationsData', () => {
  let getExerciseRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getExerciseRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(exerciseVariations));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getRehabExerciseType(1);
    expect(returnedData).toEqual(exerciseVariations);

    expect(getExerciseRequest).toHaveBeenCalledTimes(1);
    expect(getExerciseRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: `/ui/medical/rehab/exercises/${1}`,
      contentType: 'application/json',
    });
  });
});
