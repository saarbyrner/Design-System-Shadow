// @flow
import $ from 'jquery';

export type CovidAntibodyResultType = {
  id: number,
  name: string,
};
export type CovidAntibodyResultTypes = Array<CovidAntibodyResultType>;

const getCovidAntibodyResultTypes = (): Promise<CovidAntibodyResultTypes> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/medical/diagnostics/covid_antibody_result_types',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getCovidAntibodyResultTypes;
