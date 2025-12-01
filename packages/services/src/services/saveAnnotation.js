// @flow
import $ from 'jquery';
import type { AttachedTransformedFile } from '@kitman/common/src/utils/fileHelper';

export type AnnotationForm = {
  annotationable_type: 'Athlete',
  annotationable_id: ?number,
  organisation_annotation_type_id: ?number,
  title: string,
  annotation_date: ?string,
  content: string,
  illness_occurrence_ids: Array<number>,
  injury_occurrence_ids: Array<number>,
  restricted_to_doc: boolean,
  restricted_to_psych: boolean,
  attachments_attributes: Array<AttachedTransformedFile>,
  annotation_actions_attributes: Array<{
    content: string,
    completed: boolean,
    user_ids: number,
    due_date: string,
  }>,
};

const saveAnnotation = (annotation: AnnotationForm): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: '/annotations',
      contentType: 'application/json',
      data: JSON.stringify(annotation),
    })
      .done(resolve)
      .fail(reject);
  });
};

export default saveAnnotation;
