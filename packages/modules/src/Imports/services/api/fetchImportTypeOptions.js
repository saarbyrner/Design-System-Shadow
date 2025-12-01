// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { ImportType } from '@kitman/common/src/types/Imports';

type Response = Array<ImportType>;

const fetchImportTypeOptions = async (): Promise<Response> => {
  const { data } = await axios.get('/ui/imports/import_types');
  return data;
};

export default fetchImportTypeOptions;
