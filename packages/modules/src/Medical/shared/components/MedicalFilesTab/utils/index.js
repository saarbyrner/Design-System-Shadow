// @flow
import moment from 'moment';
import i18n from '@kitman/common/src/utils/i18n';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type {
  EntityAttachment,
  AttachmentEntityType,
} from '@kitman/modules/src/Medical/shared/types/medical';

export const supportedEntityTypes: Array<AttachmentEntityType> = [
  'document_v2',
  'annotation',
  'diagnostic',
  'procedure',
  'medication',
];

export const getDocumentSource = (document: EntityAttachment) => {
  const date = document.entity.entity_date;
  const entityType = document.entity.entity_type;

  let description = '';

  if (document.entity.entity_title) {
    description = document.entity.entity_title;
  } else if (document.entity.entity_type === 'document_v2') {
    description = i18n.t('Documents');
  } else {
    description = document.entity.entity_type;
  }

  const sortByDocDate = window.featureFlags['medical-files-sort-by-doc-date'];

  if (!sortByDocDate && date) {
    const formattedDate = DateFormatter.formatStandard({
      date: moment(date),
    });
    description = `${formattedDate} - ${description}`;
  }
  const athleteId = document.entity.athlete.id;
  const athletePath = `/medical/athletes/${athleteId}`;
  let href;

  switch (entityType) {
    case 'annotation':
    case 'medical_note':
      href = `${athletePath}#medical_notes`; // TODO: currently there is no direct path to a note
      break;
    case 'medication':
      href = `${athletePath}#medications`; // TODO: currently there is no direct path to a medication
      break;
    case 'treatment':
      href = `${athletePath}#treatments`; // TODO: currently there is no direct path to a treatment
      break;
    case 'diagnostic':
      href = `${athletePath}/diagnostics/${document.entity.id}`;
      break;
    case 'procedure':
      href = `/medical/procedures/${document.entity.id}`;
      break;
    case 'document_v2':
      href = `/medical/documents/${document.entity.id}?isV2Document=true`;
      break;
    case 'form_answers_set':
      href = `/forms/form_answers_sets/${document.entity.id}`;
      break;
    default:
      href = `${athletePath}`;
  }

  const isChangingTab =
    href.includes('#') && window.location.href.includes(athletePath);
  return { description, href, isChangingTab };
};
