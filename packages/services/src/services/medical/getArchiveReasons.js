// @flow
import { axios } from '@kitman/common/src/utils/services';

export type ArchiveReason = {
  id: number,
  name: string,
};

// Restrict archive reasons returned by passing entity, eg: 'procedures'
const getArchiveReasons = async (
  medicalEntity?: string
): Promise<ArchiveReason[]> => {
  const { data } = await axios.get(`/ui/archive_reasons`, {
    params: {
      entity: medicalEntity,
    },
  });

  return data;
};

export default getArchiveReasons;
