import serverResponse from '@kitman/services/src/mocks/handlers/exports/exportDemographicReport/exportDemographicReportData.mock';
import { axios } from '@kitman/common/src/utils/services';
import exportDemographicReport from '../exportDemographicReport';

describe('exportDemographicReport', () => {
  let exportDemographicReportRequest;
  beforeEach(() => {
    exportDemographicReportRequest = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          return resolve({ data: serverResponse });
        });
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const columns = [
    'fullname',
    'firstname',
    'lastname',
    'jersey_number',
    'nfl_id',
    'position',
    'dob_short',
    'height',
    'allergies',
    'athlete_medical_alerts',
  ];

  const population = [
    {
      applies_to_squad: false,
      all_squads: false,
      position_groups: [],
      positions: [],
      athletes: [2942, 40211, 1644],
      squads: [],
      context_squads: [8],
    },
  ];

  it('calls the correct endpoint for emergency_medical report', async () => {
    const returnedData = await exportDemographicReport(
      'emergency_medical',
      population,
      columns
    );

    expect(returnedData).toEqual(serverResponse);
    expect(exportDemographicReportRequest).toHaveBeenCalledTimes(1);
    expect(exportDemographicReportRequest).toHaveBeenCalledWith(
      '/medical/rosters/demographic_report/emergency_medical',
      {
        population,
        columns,
      }
    );
  });

  it('calls the correct endpoint for x_ray_game_day report', async () => {
    const returnedData = await exportDemographicReport(
      'x_ray_game_day',
      population,
      columns
    );

    expect(returnedData).toEqual(serverResponse);
    expect(exportDemographicReportRequest).toHaveBeenCalledTimes(1);
    expect(exportDemographicReportRequest).toHaveBeenCalledWith(
      '/medical/rosters/demographic_report/x_ray_game_day',
      {
        population,
        columns,
      }
    );
  });

  it('calls the correct endpoint for emergency_contacts report', async () => {
    const athleteColumns = [
      'fullname',
      'emergency_contacts',
      'jersey_number',
      'id',
      'firstname',
      'lastname',
    ];
    const contactColumns = [
      'firstname',
      'lastname',
      'contact_relation',
      'phone_numbers',
      'email',
      'address_1',
      'address_2',
      'address_3',
      'city',
      'state_county',
      'zip_postal_code',
      'country',
      'id',
    ];

    const returnedData = await exportDemographicReport(
      'emergency_contacts',
      population,
      athleteColumns,
      contactColumns
    );

    expect(returnedData).toEqual(serverResponse);
    expect(exportDemographicReportRequest).toHaveBeenCalledTimes(1);
    expect(exportDemographicReportRequest).toHaveBeenCalledWith(
      '/medical/rosters/demographic_report/emergency_contacts',
      {
        population,
        columns: athleteColumns,
        emergency_contacts_columns: contactColumns,
      }
    );
  });
});
