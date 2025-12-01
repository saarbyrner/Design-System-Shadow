import moment from 'moment';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import { sanitizeDate } from '@kitman/playbook/utils/DatePicker';

describe('sanitizeDate', () => {
  it('returns empty string when date is null', () => {
    const sanitizedDate = sanitizeDate(null);
    expect(sanitizedDate).toEqual('');
  });

  it('returns empty string when date is invalid', () => {
    const sanitizedDate = sanitizeDate(moment('1969-04-03T00:00:00+00:00'));
    expect(sanitizedDate).toEqual('');
  });

  it('returns correct string when date is valid', () => {
    const date = '2024-02-03T13:20:41+00:00';
    const sanitizedDate = sanitizeDate(moment(date));
    expect(sanitizedDate).toEqual(
      moment(date).startOf('day').format(dateTransferFormat)
    );
  });
});
