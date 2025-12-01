// @flow
import $ from 'jquery';

export type Drug = {
  id: number,
  name: string,
  dispensable_drug_id: string,
  med_strength: string,
  med_strength_unit: string,
  dose_form_desc: string,
  route_desc: string,
  drug_name_desc: string,
};
export type StockMedication = {
  id: number,
  drug: Drug,
  quantity: number,
};

export type StockMedications = {
  stock_drugs: Array<StockMedication>,
  next_id: null,
};

const getStockMedications = (): Promise<StockMedications> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: '/medical/stocks/search_stock_drugs',
      contentType: 'application/json',
    })
      .done((response) => {
        resolve(response);
      })
      .fail(reject);
  });
};

export default getStockMedications;
