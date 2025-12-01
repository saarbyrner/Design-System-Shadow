// @flow
import { colors } from '@kitman/common/src/variables';
import type { DiagnosticStatus } from '@kitman/services/src/services/medical/getDiagnosticStatuses';

export const getStatusValue = (status: $Values<DiagnosticStatus>) => {
  switch (status) {
    case 'error':
      return {
        status: 'error',
        style: { backgroundColor: colors.red_100 },
      };
    case 'no_reason':
      return {
        status: 'No reason',
        style: { backgroundColor: colors.red_100 },
      };
    case 'unreconciled':
      return {
        status: 'Unreconciled',
        style: { backgroundColor: colors.red_100 },
      };
    case 'canceled':
      return {
        status: 'Canceled',
        style: { backgroundColor: colors.grey_100 },
      };
    case 'preliminary':
      return {
        status: 'Preliminary',
        style: { backgroundColor: colors.grey_300_50 },
      };
    case 'incomplete':
      return {
        status: 'Incomplete',
        style: { backgroundColor: colors.grey_300_50 },
      };
    case 'corrected':
      return {
        status: 'Corrected',
        style: { backgroundColor: colors.teal_100 },
      };
    case 'final':
      return {
        status: 'Final',
        style: { backgroundColor: colors.blue_100 },
      };
    case 'complete':
      return {
        status: 'Complete',
        style: { backgroundColor: colors.blue_400 },
      };
    case 'pending':
      return {
        status: 'Pending',
        style: { backgroundColor: colors.orange_100 },
      };
    case 'abnormal':
      return {
        status: 'Abnormal',
        style: { backgroundColor: colors.yellow_100 },
      };
    case 'logged':
      return {
        status: 'Logged',
        style: { backgroundColor: colors.purple_100 },
      };
    default:
      return {
        status: 'No status',
        style: { backgroundColor: colors.grey_100_50 },
      };
  }
};
