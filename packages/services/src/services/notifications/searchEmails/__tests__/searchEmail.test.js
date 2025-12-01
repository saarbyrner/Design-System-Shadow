import { axios } from '@kitman/common/src/utils/services';
import searchEmailLogs, { SEARCH_EMAIL_LOGS_URL } from '..';

describe('searchEmailLogs', () => {
  beforeEach(() => {
    jest.spyOn(axios, 'post');
  });
  it('should call the correct endpoint with the correct parameters', async () => {
    const payload = {
      kind: 'dmr',
      notificationable_id: 1,
      notificationable_type: 'event',
      recipient: 'john',
      subject: 'MLS 1',
      version: 0,
      message_status: 'errored',
      trigger_kind: 'manual',
      date_range: {
        start_date: '2021-01-01',
        end_date: '2021-01-01',
      },
      page: 1,
      per_page: 10,
    };
    await searchEmailLogs(payload);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(SEARCH_EMAIL_LOGS_URL, payload);
  });
});
