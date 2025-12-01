// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { EmailResponse, Meta } from '../shared/types';

export const SEARCH_EMAIL_LOGS_URL = '/notifications/search';

type SearchEmailLogsPayload = {
  kind: string,
  notificationable_id: number | null,
  notificationable_type: 'event' | 'notification',
  recipient: string,
  subject: string,
  version: number | null,
  message_status: 'errored' | 'not_errored' | null,
  trigger_kind: 'manual' | 'automatic' | null,
  date_range: {
    start_date: Date,
    end_date: Date,
  },
  page: number,
  per_page: number,
};

export type SearchEmailLogsResponse = Array<EmailResponse> & Meta;

const searchEmailLogs = async (
  payload: SearchEmailLogsPayload
): Promise<SearchEmailLogsResponse> => {
  const { data } = await axios.post(SEARCH_EMAIL_LOGS_URL, payload);
  return data;
};

export default searchEmailLogs;
