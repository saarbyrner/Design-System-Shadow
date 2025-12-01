import { axios } from '@kitman/common/src/utils/services';
import searchMedicalEntityAttachments from '../searchMedicalEntityAttachments';
import { entityAttachmentSearchResponse } from '../../../mocks/handlers/medical/entityAttachments/mocks/entityAttachments.mock';

describe('searchMedicalEntityAttachments', () => {
  describe('Handler response', () => {
    it('returns the correct data for an illness', async () => {
      const filters = {
        entity_athlete_id: null,
        archived: false,
        issue_occurrence: { id: 100, type: 'illness' },
      };
      const returnedData = await searchMedicalEntityAttachments(filters, null);

      expect(returnedData.entity_attachments).toEqual([
        entityAttachmentSearchResponse.entity_attachments[0],
      ]);
    });

    it('returns the correct data for an injury', async () => {
      const filters = {
        entity_athlete_id: null,
        archived: false,
        issue_occurrence: { id: 200, type: 'injury' },
      };
      const returnedData = await searchMedicalEntityAttachments(filters, null);

      expect(returnedData.entity_attachments).toEqual([
        entityAttachmentSearchResponse.entity_attachments[1],
      ]);
    });
  });

  describe('Axios mocked', () => {
    let request;
    const controller = new AbortController();

    beforeEach(() => {
      request = jest.spyOn(axios, 'post').mockImplementation(() => {
        return new Promise((resolve) => {
          return resolve({ data: entityAttachmentSearchResponse });
        });
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint', async () => {
      const filters = { entity_athlete_id: null, archived: false };
      const returnedData = await searchMedicalEntityAttachments(filters, null);

      expect(returnedData).toEqual(entityAttachmentSearchResponse);

      const expectedParams = {
        filters,
        pagination: { page_size: 50, next_token: null },
      };

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        `/medical/entity_attachments/search`,
        expectedParams,
        {}
      );
    });

    it('sends the controller signal to the request', async () => {
      const filters = { entity_athlete_id: null, archived: false };
      const returnedData = await searchMedicalEntityAttachments(
        filters,
        null,
        controller.signal
      );

      expect(returnedData).toEqual(entityAttachmentSearchResponse);

      const expectedParams = {
        filters,
        pagination: { page_size: 50, next_token: null },
      };

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        `/medical/entity_attachments/search`,
        expectedParams,
        { signal: controller.signal }
      );
    });
  });
});
