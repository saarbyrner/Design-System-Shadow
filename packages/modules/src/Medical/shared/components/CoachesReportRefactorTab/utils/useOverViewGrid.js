// @flow
import moment from 'moment';
import type {
  BulkNoteAnnotationForm,
  BulkNote,
  AnnotationForm,
} from '@kitman/modules/src/Medical/shared/types';
import type { CoachesNote } from '../types';

const getBulkNotesPayload = (
  noteContent: string,
  rowSelectionModel: Array<number>,
  recentlyCreatedNotes: Array<CoachesNote>,
  coachesNoteAnnotationTypeId: number,
  dataGridCurrentDate: moment.Moment | string
): BulkNoteAnnotationForm => {
  const annotationables: Array<BulkNote> = rowSelectionModel?.map((row) => {
    return { annotationable_type: 'Athlete', annotationable_id: row };
  });

  const bulkPayload: BulkNoteAnnotationForm = {
    organisation_annotation_type_id: coachesNoteAnnotationTypeId,
    annotationables,
    title: 'Daily status note',
    annotation_date: dataGridCurrentDate,
    content: noteContent,
    scope_to_org: true,
    annotations: annotationables,
    newly_created_annotations: recentlyCreatedNotes,
  };

  return bulkPayload;
};

export const getCoachesNoteData = (
  coachesNoteAnnotationTypeId: number,
  editingCellId: number,
  dataGridCurrentDate: moment.Moment | string,
  noteContent: string
) => {
  const coachesNoteData: AnnotationForm = {
    annotationable_type: 'Athlete',
    organisation_annotation_type_id: coachesNoteAnnotationTypeId,
    annotationable_id: editingCellId,
    athlete_id: editingCellId,
    title: 'Daily status note',
    annotation_date: dataGridCurrentDate,
    content: noteContent,
    illness_occurrence_ids: [],
    injury_occurrence_ids: [],
    chronic_issue_ids: [],
    restricted_to_doc: false,
    restricted_to_psych: false,
    attachments_attributes: [],
    annotation_actions_attributes: [],
    scope_to_org: true,
  };
  return coachesNoteData;
};
export default getBulkNotesPayload;
