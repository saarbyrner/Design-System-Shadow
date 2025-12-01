import $ from 'jquery';
import getDiagnosticTypes from '../getDiagnosticTypes';

describe('getDiagnosticTypes', () => {
  let getDiagnosticTypesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    const data = [
      {
        id: 19,
        name: '3D Analysis ',
      },
      {
        id: 49,
        name: 'Answer from Radiologist ',
      },
      {
        id: 20,
        name: 'Arthroscope ',
      },
      {
        id: 14,
        name: 'Arthroscopic Surgery ',
      },
      {
        id: 65,
        name: 'AT18',
      },
    ];

    getDiagnosticTypesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getDiagnosticTypes();

    expect(returnedData).toEqual([
      {
        id: 19,
        name: '3D Analysis ',
      },
      {
        id: 49,
        name: 'Answer from Radiologist ',
      },
      {
        id: 20,
        name: 'Arthroscope ',
      },
      {
        id: 14,
        name: 'Arthroscopic Surgery ',
      },
      {
        id: 65,
        name: 'AT18',
      },
    ]);

    expect(getDiagnosticTypesRequest).toHaveBeenCalledTimes(1);
    expect(getDiagnosticTypesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/medical/diagnostics/types',
    });
  });
});
