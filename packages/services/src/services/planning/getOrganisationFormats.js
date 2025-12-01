// @flow
import { axios } from '@kitman/common/src/utils/services';

export type OrganisationFormat = {
  id: number,
  name: string,
  number_of_players: number,
};

const getOrganisationFormats = async (): Promise<Array<OrganisationFormat>> => {
  const { data } = await axios.get('/ui/organisation_formats');

  return data;
};

export default getOrganisationFormats;
