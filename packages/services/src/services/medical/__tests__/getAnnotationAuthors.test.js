import { axios } from '@kitman/common/src/utils/services';
import { data } from '@kitman/services/src/mocks/handlers/getAnnotationAuthors';
import getAnnotationAuthors from '../getAnnotationAuthors';

describe('getAnnotationAuthors', () => {
  it('returns the correct value', async () => {
    const returnedData = await getAnnotationAuthors({
      athleteId: null,
      injuryId: null,
      illnessId: null,
    });

    expect(returnedData).toEqual(data);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'get');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await getAnnotationAuthors({
        athleteId: null,
        injuryId: null,
        illnessId: null,
      });

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith('/medical/notes/authors', {
        params: { athlete_id: null, organisation_annotation_type: null },
      });
    });

    it('calls the correct endpoint with correct body data in the request with athleteId', async () => {
      await getAnnotationAuthors({
        athleteId: 1,
        injuryId: null,
        illnessId: null,
      });

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith('/medical/notes/authors', {
        params: { athlete_id: 1, organisation_annotation_type: null },
      });
    });

    it('calls the correct endpoint with correct body data in the request with injuryId', async () => {
      await getAnnotationAuthors({
        athleteId: 1,
        injuryId: 2,
        illnessId: null,
      });

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith('/medical/notes/authors', {
        params: {
          athlete_id: 1,
          issue_occurrence: {
            id: 2,
            type: 'injury',
          },
          organisation_annotation_type: null,
        },
      });
    });

    it('calls the correct endpoint with correct body data in the request with illnessId', async () => {
      await getAnnotationAuthors({
        athleteId: 1,
        injuryId: null,
        illnessId: 3,
      });

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith('/medical/notes/authors', {
        params: {
          athlete_id: 1,
          issue_occurrence: {
            id: 3,
            type: 'illness',
          },
          organisation_annotation_type: null,
        },
      });
    });

    it('calls the correct endpoint with correct body data in the request with isModification = true', async () => {
      await getAnnotationAuthors({
        athleteId: 1,
        injuryId: null,
        illnessId: null,
        isModification: true,
      });

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith('/medical/notes/authors', {
        params: {
          athlete_id: 1,
          organisation_annotation_type: [
            'OrganisationAnnotationTypes::Modification',
          ],
        },
      });
    });
  });
});
