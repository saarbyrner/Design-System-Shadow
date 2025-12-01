// @flow

// Response on newly entered Drug stock saveDrugStock()
export type DrugStockResponse = {
  id: number,
  kind: string,
  quantity: number,
  user: {
    firstname: string,
    fullname: string,
    id: number,
    lastname: string,
  },
};

// Following 4 are related to getDrugLots() service

// Marking some props optionally present as NHS currently does not have parity with FDB drug data
export type Drug = {
  id: number,
  name: string,
  dispensable_drug_id?: string,
  vpid?: string,
  brand_name?: string,
  med_strength: string,
  med_strength_unit: string,
  dose_form?: string,
  dose_form_desc?: string,
  route_desc?: string,
  drug_name_desc?: string,
};

export type DrugLot = {
  id: number,
  drug: Drug,
  drug_type: string,
  lot_number: string,
  expiration_date: string,
  quantity: number,
  dispensed_quantity: number,
};

export type DrugLotFilters = {
  search_expression?: string,
  expiration_date?: { start: string, end: string },
  stock_drug_id?: string | null,
  available_only?: boolean,
};

export type DrugLotsResponse = {
  stock_lots: Array<DrugLot>,
  next_id: ?number,
};
