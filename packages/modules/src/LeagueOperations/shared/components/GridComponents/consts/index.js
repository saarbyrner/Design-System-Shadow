// @flow
export type GridFilterRef = {
  reset: () => void,
  getResetValue: () => any,
  getParam: () => string,
};

export type GridFilterProps<T> = T & { param: string };

export type GridFilterComponent<
  PropsType,
  RefType = GridFilterRef
> = React$AbstractComponent<GridFilterProps<PropsType>, RefType>;

export type FilterValue =
  | string
  | number
  | Array<string | number>
  | { [key: string]: any }
  | { start_date: string, end_date: string };

export type ParamType = {
  [paramName: string]: FilterValue,
};

export type CommonFilterProps<TValue> = {
  param: string,
  defaultValue: TValue,
  value: number | '' | TValue,
  onChange: (params: ParamType) => void,
};
