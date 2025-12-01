// @flow

export const distributionTypeOptions = [
  {
    label: 'Automatic',
    value: 'automatic',
  },
  {
    label: 'Manual',
    value: 'manual',
  },
];

export const errorOptions = [
  {
    label: 'Sent',
    value: 'not_errored',
  },
  {
    label: 'Failure',
    value: 'errored',
  },
];

export const emailTypeOptions = [
  {
    label: 'DMR',
    value: 'dmr',
  },
  {
    label: 'DMN',
    value: 'dmn',
  },
];

export const defaultFilters = {
  type: null, // dmr or dmn
  dateRange: [null, null],
  error: null,
  distributionType: null,
  messageStatus: null,
  version: null,
  notificationableType: null,
  notificationableId: null,
};

export const defaultSearch = {
  recipient: null,
  subject: null,
};
