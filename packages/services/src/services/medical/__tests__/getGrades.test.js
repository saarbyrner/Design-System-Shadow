import $ from 'jquery';
import { data } from '../../../mocks/handlers/medical/getGrades';
import getGrades from '../getGrades';

describe('getGrades', () => {
  let getGradesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getGradesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getGrades();

    expect(returnedData).toEqual(data);

    expect(getGradesRequest).toHaveBeenCalledTimes(1);
    expect(getGradesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/medical/bamic_grades',
    });
  });
});
