// @flow
type ErrorData = {
  key: string,
  message: string,
  type: string,
};

type MetaData = {
  request_id: string,
};

export type ErrorResponse = {
  status: string,
  data: Array<ErrorData>,
  meta_data: MetaData,
};

export type JqXhr = {
  responseJSON: ErrorResponse,
  status: number,
};
