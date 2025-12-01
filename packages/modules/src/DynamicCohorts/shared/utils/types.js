// @flow

export type CreatedOn = {
  start_date: string,
  end_date: string,
} | null;
export type SharedFilters = {
  searchValue: string,
  createdBy: Array<number>,
  createdOn: CreatedOn,
  labels?: Array<number>,
};

export type FiltersState = {
  filters: SharedFilters,
};

export type FilterKey = $Keys<SharedFilters>;
export type FiltersValue = $Values<SharedFilters>;

export type SetFilterActionPayload = {
  key: FilterKey,
  value: FiltersValue,
};

export type SetFilterFunctionType = (payload: SetFilterActionPayload) => void;
