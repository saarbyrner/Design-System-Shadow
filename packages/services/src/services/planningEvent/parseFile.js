// @flow
import { axios } from '@kitman/common/src/utils/services';

const parseFile = async ({ file, source }: { file: File, source: string }) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('source', source);

  const { data } = await axios.post(
    '/workloads/import_workflow/parse_file',
    formData
  );
  return data;
};

export default parseFile;
