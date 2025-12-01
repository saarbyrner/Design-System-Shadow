import $ from 'jquery';
import exportAthleteOwnData from '../exportAthleteOwnData';

describe('exportAthleteOwnData', () => {
  let exportAthleteOwnDataRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    exportAthleteOwnDataRequest = jest.spyOn($, 'ajax').mockImplementation(() =>
      deferred.resolve({
        attachments: [],
        created_at: '2022-09-02T17:10:26+01:00',
        export_type: 'athlete_medical_export',
        id: 24,
        name: 'Albornaz Tomas Medical Export.zip',
        status: 'pending',
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await exportAthleteOwnData();
    expect(returnedData).toEqual({
      attachments: [],
      created_at: '2022-09-02T17:10:26+01:00',
      export_type: 'athlete_medical_export',
      id: 24,
      name: 'Albornaz Tomas Medical Export.zip',
      status: 'pending',
    });

    expect(exportAthleteOwnDataRequest).toHaveBeenCalledTimes(1);
    expect(exportAthleteOwnDataRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/athlete_export_jobs/athlete_medical_export',
      data: {},
    });
  });
});
