import archiveMedicalDocument from '@kitman/services/src/services/medical/archiveMedicalDocument';
import archiveAttachment from '@kitman/services/src/services/medical/archiveAttachment';
import { documentData } from '@kitman/services/src/mocks/handlers/medical/medicalDocument/mocks/documents.mocks';
import { entityAttachments } from '@kitman/services/src/mocks/handlers/medical/entityAttachments/mocks/entityAttachments.mock';
import archiveDocument from '../archiveDocument';

jest.mock('@kitman/services/src/services/medical/archiveMedicalDocument');
jest.mock('@kitman/services/src/services/medical/archiveAttachment');

describe('archiveDocument', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('when medical-files-tab-enhancement is false', () => {
    it('should call archiveMedicalDocument', () => {
      window.featureFlags['medical-files-tab-enhancement'] = false;
      archiveDocument(documentData, 1);

      expect(archiveMedicalDocument).toHaveBeenCalled();
    });
  });

  describe('when medical-files-tab-enhancement is true', () => {
    beforeEach(() => {
      window.featureFlags['medical-files-tab-enhancement'] = true;
    });

    afterEach(() => {
      window.featureFlags['medical-files-tab-enhancement'] = false;
    });

    it('should call archiveMedicalDocument if entity_type is document_v2', () => {
      archiveDocument(
        {
          ...entityAttachments[0],
          entity: {
            ...entityAttachments[0].entity,
            entity_type: 'document_v2',
          },
        },
        1
      );

      expect(archiveMedicalDocument).toHaveBeenCalled();
    });

    it('should call archiveAttachment if entity_type is annotation', () => {
      archiveDocument(
        {
          ...entityAttachments[0],
          entity: {
            ...entityAttachments[0].entity,
            entity_type: 'annotation',
          },
        },
        1
      );

      expect(archiveAttachment).toHaveBeenCalled();
    });

    it('should call archiveAttachment if entity_type is diagnostic', () => {
      archiveDocument(
        {
          ...entityAttachments[0],
          entity: {
            ...entityAttachments[0].entity,
            entity_type: 'diagnostic',
          },
        },
        1
      );

      expect(archiveAttachment).toHaveBeenCalled();
    });

    it('should call archiveAttachment if entity_type is procedure', () => {
      archiveDocument(
        {
          ...entityAttachments[0],
          entity: {
            ...entityAttachments[0].entity,
            entity_type: 'procedure',
          },
        },
        1
      );

      expect(archiveAttachment).toHaveBeenCalled();
    });

    it('should call archiveAttachment if entity_type is medication', () => {
      archiveDocument(
        {
          ...entityAttachments[0],
          entity: {
            ...entityAttachments[0].entity,
            entity_type: 'medication',
          },
        },
        1
      );

      expect(archiveAttachment).toHaveBeenCalled();
    });

    it('should throw error if entity_type is something other than allowed', async () => {
      await expect(async () => {
        await archiveDocument(
          {
            ...entityAttachments[0],
            entity: {
              ...entityAttachments[0].entity,
              entity_type: 'something_else',
            },
          },
          1
        );
      }).rejects.toThrow();
    });
  });
});
