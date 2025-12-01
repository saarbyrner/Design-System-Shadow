// @flow
import { axios } from '@kitman/common/src/utils/services';

export type Country = {
  alpha2: string,
  name: string,
};

export type CountriesResponse = {
  countries: Array<Country>,
};

export const getCountries = async (): Promise<CountriesResponse> => {
  const { data } = await axios.get('/ui/countries');

  return data;
};
