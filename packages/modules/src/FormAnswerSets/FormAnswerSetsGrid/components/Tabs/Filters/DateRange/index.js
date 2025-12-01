// @flow
import { useDispatch, useSelector } from 'react-redux';

import { DateRangePicker } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { setDateRangeFilter } from '@kitman/modules/src/FormAnswerSets/redux/slices/formAnswerSetsSlice';
import { selectDateRangeFilter } from '@kitman/modules/src/FormAnswerSets/redux/selectors/formAnswerSetsSelectors';

type Props = {
  handleTrackEvent?: () => void,
};

const DateRange = ({ t, handleTrackEvent }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const dateRangeFilter = useSelector(selectDateRangeFilter);

  // Convert Redux state to DateRangePicker value format
  const value = dateRangeFilter
    ? [
        dateRangeFilter.start_date
          ? moment(dateRangeFilter.start_date, dateTransferFormat)
          : null,
        dateRangeFilter.end_date
          ? moment(dateRangeFilter.end_date, dateTransferFormat)
          : null,
      ]
    : [null, null];

  return (
    <DateRangePicker
      variant="filled"
      label={t('Completed Date')}
      value={value}
      sx={{
        width: '25rem',
      }}
      onChange={(newValue) => {
        if (newValue[0] && newValue[1]) {
          dispatch(
            setDateRangeFilter({
              start_date: moment(newValue[0]).format(dateTransferFormat),
              end_date: moment(newValue[1]).format(dateTransferFormat),
            })
          );
          handleTrackEvent?.();
        } else {
          // Clear the filter when dates are cleared
          dispatch(setDateRangeFilter(null));
        }
      }}
    />
  );
};

export const DateRangeTranslated: ComponentType<Props> =
  withNamespaces()(DateRange);

export default DateRange;
