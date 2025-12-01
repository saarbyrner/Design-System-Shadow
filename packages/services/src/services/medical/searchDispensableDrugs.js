// @flow
import ajaxPromise from '@kitman/common/src/utils/ajaxPromise';

export type FdbDispensableDrug = {|
  id: number,
  name: string,
  dispensable_drug_id: string,
  med_strength: string,
  med_strength_unit: string,
  dose_form_desc: string,
  route_desc: string,
  drug_name_desc: string,
|};

const searchDispensableDrugs = (
  searchExp: string
): Promise<Array<FdbDispensableDrug>> => {
  return ajaxPromise({
    method: 'GET',
    url: '/medical/fdb/search_dispensable_drugs',
    data: {
      search_expression: searchExp,
    },
  });
};

export default searchDispensableDrugs;
