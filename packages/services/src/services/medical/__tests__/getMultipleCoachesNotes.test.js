import { axios } from '@kitman/common/src/utils/services';
import getMultipleCoachesNotes from '@kitman/services/src/services/medical/getMultipleCoachesNotes';
import { data as responseData } from '@kitman/services/src/mocks/handlers/medical/getLastCoachesReportNote';

describe('getLastCoachesReportNote', () => {
  const athleteIds = [1, 2];
  const organisationAnnotationTypes = [
    'OrganisationAnnotationTypes::DailyStatusNote',
  ];
  const annotationDate = '2017-07-20T00:00:00.000+01:00';

  describe('Handler response', () => {
    it('returns an expected data', async () => {
      const returnedData = await getMultipleCoachesNotes(
        athleteIds,
        organisationAnnotationTypes,
        annotationDate
      );
      expect(returnedData).toEqual(responseData.content);
    });
  });

  describe('Axios mocked', () => {
    let request;

    beforeEach(() => {
      request = jest
        .spyOn(axios, 'post')
        .mockResolvedValue({ data: responseData });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint', async () => {
      const returnedData = await getMultipleCoachesNotes(
        athleteIds,
        organisationAnnotationTypes,
        annotationDate
      );

      expect(returnedData).toEqual(responseData.content);
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        '/medical/notes/bulk_copy_last_daily_status',
        {
          athlete_ids: athleteIds,
          organisation_annotation_types: organisationAnnotationTypes,
          annotation_date: annotationDate,
          include_copied_from: false,
        }
      );
    });
  });
});
