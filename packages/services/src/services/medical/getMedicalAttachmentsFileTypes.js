// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Options } from '@kitman/components/src/Select';

const getMedicalAttachmentsFileTypes = async (): Promise<Array<Options>> => {
  const { data } = await axios.get('/ui/file_types');
  return data.file_types;
};

export default getMedicalAttachmentsFileTypes;
