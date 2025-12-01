// @flow
import ajaxPromise from '@kitman/common/src/utils/ajaxPromise';

export type DrugStockRequestResponse = {
  total: number,
  count: number,
  page: number,
  next_page: number | null,
  options: Array<{
    id: string,
    name: string,
  }>,
};

/**
 * This returns an array of drug 'options' from FDB for a search_expression (searchString)
 * Minimum of 5 character entry in <AsyncSelect /> on front-end before search is triggered
 */
const getDrugStocks = (
  searchString: string
): Promise<DrugStockRequestResponse> => {
  return ajaxPromise({
    method: 'GET',
    url: '/medical/fdb/dispensable_drugs',
    data: {
      search_expression: searchString,
    },
  });
};

export default getDrugStocks;
