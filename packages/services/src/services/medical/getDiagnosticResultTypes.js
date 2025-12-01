// @flow
import { axios } from '@kitman/common/src/utils/services';

export type DiagnosticResultType = {
  value: string,
  label: string,
};
export type DiagnosticResultTypes = Array<DiagnosticResultType>;

const getDiagnosticResultTypes = async (): Promise<DiagnosticResultTypes> => {
  const { data } = await axios.get(`/medical/locations/result_types`);

  return data;
};

export default getDiagnosticResultTypes;
