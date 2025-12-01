// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Diagnostic } from '@kitman/modules/src/Medical/shared/types';
import type { FormState } from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/hooks/useDiagnosticForm';
import {
  getGaPayload,
  getRedoxPayload,
} from '@kitman/services/src/services/medical/updateDiagnostic/utils';

type updateDiagnosticServiceResponse = {
  diagnostic: Diagnostic,
};

export const getUpdateDiagnosticUrl = (
  athleteId: string | number,
  diagnosticId: string | number
) => `/athletes/${athleteId}/diagnostics/${diagnosticId}`;

const updateDiagnostic = async (
  diagnosticId: number,
  formState: FormState
): Promise<updateDiagnosticServiceResponse> => {
  // $FlowFixMe athleteId cannot be null here as validation will have caught it
  const url = getUpdateDiagnosticUrl(formState.athleteId, diagnosticId);
  const useGaPayload = window.getFlag('pm-diagnostic-ga-enhancement');
  const payload = useGaPayload
    ? getGaPayload(formState)
    : getRedoxPayload(formState);
  const { data } = await axios.patch(url, payload);
  return data;
};

export default updateDiagnostic;
