// @flow
import archiveMedicalDocument from '@kitman/services/src/services/medical/archiveMedicalDocument';
import archiveAttachment from '@kitman/services/src/services/medical/archiveAttachment';
import type { MedicalFile } from '@kitman/modules/src/Medical/shared/types/medical';

/*
 * This service is a switch between the two archive document flows while we're
 * still phasing across. Other entity types may be allowed in the future with the
 * below services, and should be maintained in:
 * @kitman/modules/src/Medical/shared/components/MedicalFilesTab/utils/index.js
 */
const archiveDocument = async (
  document: MedicalFile,
  archiveReason: number
) => {
  if (!window.featureFlags['medical-files-tab-enhancement']) {
    await archiveMedicalDocument(document.id, archiveReason);
  } else {
    // $FlowIgnore it's fine for entity to be undefined/null here. Ignoring as favouring readability
    switch (document.entity?.entity_type) {
      case 'document_v2':
        await archiveMedicalDocument(document.entity.id, archiveReason);
        break;
      case 'annotation':
      case 'diagnostic':
      case 'procedure':
      case 'medication':
        await archiveAttachment(document.attachment.id, archiveReason);
        break;
      default:
        throw new Error(
          'Document type is currently not supported for archive.'
        );
    }
  }
};

export default archiveDocument;
