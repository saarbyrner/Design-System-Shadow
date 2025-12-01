// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Options } from '@kitman/components/src/Select';

const getMedicalAttachmentsEntityTypes = async (): Promise<Array<Options>> => {
  const { data } = await axios.get(
    '/ui/medical/entity_attachments/entity_types'
  );
  return data.entity_types;
};

export default getMedicalAttachmentsEntityTypes;
