// @flow
import type { Option } from '@kitman/components/src/Select';

export const userEventRequestStatuses = {
  approved: 'approved',
  denied: 'denied',
  rejected: 'rejected',
  pending: 'pending',
  expired: 'expired',
  withdrawn: 'withdrawn',
};

export const userEventRequestStatusFilterOptions: Array<Option> = [
  userEventRequestStatuses.pending,
  userEventRequestStatuses.approved,
  userEventRequestStatuses.rejected,
  userEventRequestStatuses.expired,
].map((status: string) => ({
  label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
  value:
    status === userEventRequestStatuses.rejected
      ? userEventRequestStatuses.denied
      : status,
}));

export const userEventRequestStatusFilterOptionsMUI: Array<{
  id: string | number,
  name: string,
}> = [
  userEventRequestStatuses.pending,
  userEventRequestStatuses.approved,
  userEventRequestStatuses.rejected,
  userEventRequestStatuses.expired,
].map((status: string) => ({
  id:
    status === userEventRequestStatuses.rejected
      ? userEventRequestStatuses.denied
      : status,
  name: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
}));
