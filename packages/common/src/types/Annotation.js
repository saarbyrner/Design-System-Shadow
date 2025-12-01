// @flow
import type { AttachedFile } from '../utils/fileHelper';

export type AnnotionableAthlete = {
  id: number,
  fullname: string,
};

export type AnnotationAction = {
  id?: number,
  content: string,
  user_ids: Array<?string>,
  completed: boolean,
  due_date: ?string,
};

export type Attachment = {
  id: number,
  original_filename: string,
  filename: string,
  created: string,
  filesize: number,
  confirmed: boolean,
};

export type ResponseAttachment = {
  id: number,
  url: string,
  download_url: string,
  filename: string,
  filetype: string,
  filesize: number,
  audio_file: boolean,
  confirmed: boolean,
  presigned_post: ?Object,
};

export type Annotation = {
  id: ?number,
  modalType: 'ADD_NEW' | 'EDIT' | 'DUPLICATE',
  annotation_type_id: number,
  annotationable_type: 'Athlete',
  annotationable: AnnotionableAthlete,
  title: string,
  content: string,
  annotation_date: string,
  annotation_actions: Array<AnnotationAction>,
  archived: boolean,
  created_by: {
    id: number,
    fullname: string,
  },
  created_at: string,
  organisation_annotation_type: {
    id: number,
    name: string,
    type: string,
  },
  // NOTE: updated_by may not be present where data was migrated without this info
  updated_by?: {
    id: number,
    fullname: string,
  },
  attachments: Array<?Attachment>,
  unUploadedFiles: Array<AttachedFile>,
  updated_at: string,
};

// response when populating annotation list
export type AnnotationResponse = {
  id: number,
  organisation_annotation_type: {
    id: number,
    name: string,
    type: string,
  },
  annotationable_type: 'Athlete',
  annotationable: AnnotionableAthlete,
  title: string,
  content: string,
  annotation_date: string,
  annotation_actions: Array<AnnotationAction>,
  archived: boolean,
  created_by: {
    id: number,
    fullname: string,
  },
  created_at: string,
  updated_by: {
    id: number,
    fullname: string,
  },
  attachments: Array<?ResponseAttachment>,
  updated_at: string,
};
