// @flow
import { axios } from '@kitman/common/src/utils/services';

export type Creator = {
  id: number,
  name: string,
};
type Response = Array<Creator>;

const fetchImportCreatorOptions = async (): Promise<Response> => {
  const { data } = await axios.get('/ui/imports/creators');
  return data;
};

export default fetchImportCreatorOptions;
