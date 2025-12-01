// @flow

export type ReduxMutation<RequestBody, ReturnType> = (
  requestBody: RequestBody
) => {
  unwrap: () => Promise<ReturnType>,
};
