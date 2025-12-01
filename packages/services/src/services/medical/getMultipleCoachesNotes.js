// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { NoteType } from '@kitman/modules/src/Medical/shared/types';

const getMultipleCoachesNotes = async (
  athleteIds: Array<number>,
  organisationAnnotationTypes: Array<NoteType>,
  annotationDate: string
): Promise<?string> => {
  try {
    const { data } = await axios.post(
      '/medical/notes/bulk_copy_last_daily_status',
      {
        athlete_ids: athleteIds,
        organisation_annotation_types: organisationAnnotationTypes,
        annotation_date: annotationDate,
        include_copied_from: false,
      }
    );
    return data?.content;
  } catch (error) {
    return error;
  }
};

export default getMultipleCoachesNotes;
