// @flow
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { FALLBACK_DASH } from '@kitman/common/src/variables';

export const formatCellDate = (dateValue: string) => {
  const documentDate = moment(dateValue);

  return documentDate.isValid()
    ? DateFormatter.formatStandard({ date: documentDate })
    : FALLBACK_DASH;
};
