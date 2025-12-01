// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { MedicationListSources } from '@kitman/modules/src/Medical/shared/types/medical';

const getMedicationListSources = async (): Promise<MedicationListSources> => {
  const { data } = await axios.get(
    '/ui/medical/medications/organisation_medication_list_sources'
  );

  return data.medication_list_sources;
};

export default getMedicationListSources;
