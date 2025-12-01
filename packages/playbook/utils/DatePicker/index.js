// @flow
import { type Moment } from 'moment';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';

/*
 * prevents processing the date when it's typed
 *  and the year is initially 0020 for example
 */
export const sanitizeDate = (date: ?Moment) => {
  if (date) {
    if (!date.isValid() || date.year() < 1970) {
      return '';
    }
    return date.startOf('day').format(dateTransferFormat);
  }
  return '';
};
