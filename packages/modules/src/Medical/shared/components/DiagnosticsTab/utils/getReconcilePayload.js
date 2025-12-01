// @flow
import type { SelectOption as Option } from '@kitman/components/src/types';

type DiagnosticReasonOption = Option & {
  isInjuryIllness: boolean,
};

export const getPlayerPayload = (
  index: number,
  playerId: number,
  diagnosticId: number
) => {
  const payload = {
    index,
    queuedReconciledDiagnostic: {
      athleteId: playerId,
      diagnosticId,
    },
  };

  return payload;
};

export const getReasonPayload = (
  index: number,
  playerId: number,
  diagnosticId: number,
  reasonId: string,
  diagnosticReasons: Array<DiagnosticReasonOption>
) => {
  const issueReasonId = diagnosticReasons.find(
    ({ isInjuryIllness }) => isInjuryIllness
  );

  const isIssueReason = typeof reasonId === 'string';

  const splitString = [];
  if (isIssueReason) {
    splitString.push(...reasonId.split('_'));
  }

  const payload = {
    index,
    // $FlowFixMe as stated above, reasonId will never be undefined.
    queuedReconciledDiagnostic: {
      diagnosticId,
      value: reasonId,
      // $FlowFixMe if isIssueReason is undefined, id will be used, therefore value will never be undefined
      reasonId: isIssueReason ? issueReasonId.value : parseInt(reasonId, 10),

      athleteId: playerId,
      ...(isIssueReason && {
        issue: {
          id: splitString[1],
          type: splitString[0],
        },
      }),
    },
  };

  return payload;
};
