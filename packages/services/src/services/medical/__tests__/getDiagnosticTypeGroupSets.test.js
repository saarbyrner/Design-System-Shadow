import $ from 'jquery';
import getDiagnosticTypeGroupSets from '../getDiagnosticTypeGroupSets';

describe('getDiagnosticTypeGroupSets', () => {
  let getDiagnosticTypeGroupSetsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();

    const data = [
      {
        id: 1,
        name: 'Mock group set',
        diagnostic_types: [
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
        ],
      },
      {
        id: 2,
        name: 'Another mock type set',
        diagnostic_types: [
          {
            id: 14,
            name: 'Arthroscopic Surgery ',
          },
          {
            id: 65,
            name: 'AT18',
          },
        ],
      },
    ];

    getDiagnosticTypeGroupSetsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getDiagnosticTypeGroupSets();

    expect(returnedData).toEqual([
      {
        id: 1,
        name: 'Mock group set',
        diagnostic_types: [
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
        ],
      },
      {
        id: 2,
        name: 'Another mock type set',
        diagnostic_types: [
          {
            id: 14,
            name: 'Arthroscopic Surgery ',
          },
          {
            id: 65,
            name: 'AT18',
          },
        ],
      },
    ]);

    expect(getDiagnosticTypeGroupSetsRequest).toHaveBeenCalledTimes(1);
    expect(getDiagnosticTypeGroupSetsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/medical/diagnostics/type_groups',
    });
  });
});
