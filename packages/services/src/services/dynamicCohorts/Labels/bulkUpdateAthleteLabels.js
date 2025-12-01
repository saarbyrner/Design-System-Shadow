// @flow
import { axios } from '@kitman/common/src/utils/services';

export const labelUpdateURL = '/settings/athletes/update_labels';

export type BulkUpdatePayload = {
  athleteIds: Array<number>,
  labelsToAdd: Array<number>,
  labelsToRemove: Array<number>,
};

export const bulkUpdateAthleteLabels = async ({
  athleteIds,
  labelsToAdd,
  labelsToRemove,
}: BulkUpdatePayload): Promise<void> => {
  await axios.post(labelUpdateURL, {
    athlete_ids: athleteIds,
    labels_to_add: labelsToAdd,
    labels_to_remove: labelsToRemove,
  });
};

export default bulkUpdateAthleteLabels;
