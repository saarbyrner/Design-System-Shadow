import $ from 'jquery';
import { data as mockData } from '@kitman/services/src/mocks/handlers/medical/saveTreatment';
import saveTreatment from '../saveTreatment';

describe('saveTreatment', () => {
  let request;

  beforeEach(() => {
    const deferred = $.Deferred();
    request = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await saveTreatment(mockData);

    expect(returnedData).toEqual(mockData);

    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith({
      method: 'POST',
      url: '/treatment_sessions',
      contentType: 'application/json',
      data: JSON.stringify(mockData),
    });
  });
});
