import { axios } from '@kitman/common/src/utils/services';
import { mockedExportResponse } from '@kitman/services/src/mocks/handlers/medical/exportBulkAthleteMedicalData';
import exportBulkAthleteMedicalData from '../exportBulkAthleteMedicalData';

describe('exportBulkAthleteMedicalData', () => {
  let request;
  // TODO: this has to change
  const populations = [
    {
      applies_to_squad: false,
      all_squads: false,
      position_groups: [],
      positions: [],
      athletes: [40211],
      squads: [],
      context_squads: [8],
    },
    {
      applies_to_squad: false,
      all_squads: false,
      position_groups: [],
      positions: [],
      athletes: [],
      squads: [73],
      context_squads: [73],
      users: [],
    },
  ];

  const filters = {
    start_date: '2022-10-26T22:59:59Z',
    end_date: '2022-10-30T23:00:00Z',
    entities_to_include: ['diagnostics', 'files'],
    include_entities_not_related_to_any_issue: true,
    note_types: [
      'OrganisationAnnotationTypes::Medical',
      'OrganisationAnnotationTypes::Diagnostic',
    ],
  };

  it('returns the correct mocked response', async () => {
    const returnedData = await exportBulkAthleteMedicalData(
      populations,
      filters,
      false,
      false
    );
    expect(returnedData).toEqual(mockedExportResponse);
  });

  describe('Mock axios', () => {
    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request for csv', async () => {
      await exportBulkAthleteMedicalData(populations, filters, false, false);

      const bodyData = {
        populations,
        filters,
        single_zip_file: false,
        include_past_players: false,
      };
      expect(request).toHaveBeenCalledWith(
        '/export_jobs/bulk_athlete_medical_export',
        bodyData,
        { timeout: 0 }
      );
    });
  });
});
