// @flow
import $ from 'jquery';

export type CovidResultType = {
  id: number,
  name: string,
};
export type CovidResultTypes = Array<CovidResultType>;

const getCovidResultTypes = (): Promise<CovidResultTypes> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/medical/diagnostics/covid_result_types',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getCovidResultTypes;
