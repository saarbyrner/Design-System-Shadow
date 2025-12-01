import { axios } from '@kitman/common/src/utils/services';
import getLastCoachesReportNote from '@kitman/services/src/services/medical/getLastCoachesReportNote';
import { data as responseData } from '@kitman/services/src/mocks/handlers/medical/getLastCoachesReportNote';

describe('getLastCoachesReportNote', () => {
  const athleteId = 1;
  const organisationAnnotationTypes = [
    'OrganisationAnnotationTypes::DailyStatusNote',
  ];
  const currentGridDate = '2023-02-26T22:42:16.652Z';

  describe('Handler response', () => {
    it('returns an expected data', async () => {
      const returnedData = await getLastCoachesReportNote(
        athleteId,
        organisationAnnotationTypes,
        currentGridDate
      );
      expect(returnedData).toEqual(responseData.content);
    });
  });

  describe('Axios mocked', () => {
    let request;

    beforeEach(() => {
      request = jest
        .spyOn(axios, 'get')
        .mockResolvedValue({ data: responseData });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint', async () => {
      const returnedData = await getLastCoachesReportNote(
        athleteId,
        organisationAnnotationTypes,
        currentGridDate
      );

      expect(returnedData).toEqual(responseData.content);
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith('/medical/notes/last_annotation', {
        params: {
          athlete_id: athleteId,
          organisation_annotation_types: organisationAnnotationTypes,
          before_date: currentGridDate,
          include_copied_from: false,
        },
      });
    });
  });
});
