// @flow

export type Filters = {
  type: 'dmr' | 'dmn' | null,
  dateRange: [Date | null, Date | null],
  error: string | null,
  distributionType: 'manual' | 'automatic' | null,
  messageStatus: 'errored' | 'not_errored' | null,
  version: number | null,
  notificationableType: 'event' | 'notification' | null,
  notificationableId: number | null,
};
export type FilterKeys = $Keys<Filters>;

export type Search = {
  recipient: string | null,
  subject: string | null,
};
export type SearchKeys = $Keys<Search>;
