// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Division, Meta } from '../../types';

export type RequestResponse = {
  data: Array<Division>,
  meta: Meta,
};

const searchOrganisationDivisionList = async (): Promise<RequestResponse> => {
  const { data } = await axios.get('/ui/squad_divisions');

  return data;
};

export default searchOrganisationDivisionList;
