// @flow
import $ from 'jquery';
import type { AttachedTransformedFile } from '@kitman/common/src/utils/fileHelper';
import type { SelectOption as Option } from '@kitman/components/src/types';

export type Attachment = {
  name: string,
  original_filename?: ?string,
  filetype: string,
  filesize: number,
  filename: string,
  url?: ?string,
  id?: ?number,
  created?: Date,
};

export type UpdateAnnotationForm = {
  annotation_date: ?string,
  attachments_attributes: Array<AttachedTransformedFile | Attachment>,
  content: string,
  organisation_annotation_type_id: ?number,
  document_note_category_ids?: Array<number>,
  title: string,
  squad_id?: ?number,
  restricted_to_doc: boolean,
  restricted_to_psych: boolean,
  illness_occurrence_ids: Array<number>,
  injury_occurrence_ids: Array<number>,
  chronic_issue_ids: Array<number>,
  rehab_session_ids?: ?Array<number>,
  author_id?: ?number,
  note_visibility_ids?: ?Array<Option>,
  allow_list?: ?Array<?number>,
};

export type UpdateRehabAnnotationContent = {
  title?: string,
  content?: string,
  rehab_session_ids: Array<number>,
};

const updateAnnotation = (
  annotation: UpdateAnnotationForm | UpdateRehabAnnotationContent,
  annotationableId: number
): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'PUT',
      url: `/medical/notes/${annotationableId}`,
      contentType: 'application/json',
      data: JSON.stringify(annotation),
    })
      .done(resolve)
      .fail(reject);
  });
};

export default updateAnnotation;
