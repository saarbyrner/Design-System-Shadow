// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { NoteType } from '@kitman/modules/src/Medical/shared/types';

const getLastCoachesReportNote = async (
  athleteId: number,
  organisationAnnotationTypes: Array<NoteType>,
  beforeDate: string
): Promise<string> => {
  const { data } = await axios.get('/medical/notes/last_annotation', {
    params: {
      athlete_id: athleteId,
      organisation_annotation_types: organisationAnnotationTypes,
      before_date: beforeDate,
      include_copied_from: false,
    },
  });

  return data.content;
};

export default getLastCoachesReportNote;
