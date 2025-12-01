// @flow
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';

const annotationEmptyData = (
  orgAnnotationTypes: Array<Object> | null = null
) => {
  let firstGeneralType = null;
  let fallbackTypeId = null;

  // if there is a general type make that the default one,
  // else take the first available type
  if (orgAnnotationTypes && orgAnnotationTypes.length > 0) {
    firstGeneralType = orgAnnotationTypes.find(
      (type) => type.type === 'OrganisationAnnotationTypes::General'
    );
    fallbackTypeId = orgAnnotationTypes[0].id;
  }

  return {
    id: null,
    modalType: 'ADD_NEW',
    annotation_type_id: firstGeneralType ? firstGeneralType.id : fallbackTypeId,
    annotationable_type: 'Athlete',
    annotationable: {},
    title: '',
    content: '',
    annotation_date: moment
      .utc(Date.now())
      .format(DateFormatter.dateTransferFormat),
    annotation_actions: [],
    attachments: [],
    unUploadedFiles: [],
    created_by: null,
    created_at: null,
  };
};

export default annotationEmptyData;
