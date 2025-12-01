// @flow
import type { Attachment } from '@kitman/services/src/services/updateAnnotation';

export type Modification = {
  id: number,
  title: string,
  content: string,
  organisation_annotation_type: {
    id: number,
    name: string,
    type: string,
  },
  annotationable: {
    type: 'Athlete',
    fullname: string,
    id: number,
    avatar_url: string,
    availability: 'unavailable' | 'injured' | 'returning' | 'available',
    athlete_squads: Array<{
      id: number,
      name: string,
    }>,
  },
  author: {
    id: number,
    fullname: string,
  },
  annotation_date: string,
  expiration_date?: string,
  created_at: string,
  expired: boolean,
  restricted_to_doc: boolean,
  restricted_to_psych: boolean,
  attachments: Array<Attachment>,
  illness_occurrences: [
    {
      id: number,
      issue_type: 'illness',
      occurrence_date: string,
      full_pathology: string,
    }
  ],
  injury_occurrences: [
    {
      id: number,
      issue_type: 'injury',
      occurrence_date: string,
      full_pathology: string,
    }
  ],
  squad: {
    id: number,
    name: string,
  },
  versions?: Array<any>,
};
