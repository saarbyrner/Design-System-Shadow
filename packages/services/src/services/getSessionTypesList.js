// @flow
import { axios } from '@kitman/common/src/utils/services';

export type SessionTypeNames = Array<string>;

const getSessionTypesList = async (): Promise<SessionTypeNames> => {
  const { data } = await axios.get('/session_types/session_type_names_list');

  return data;
};

export default getSessionTypesList;
