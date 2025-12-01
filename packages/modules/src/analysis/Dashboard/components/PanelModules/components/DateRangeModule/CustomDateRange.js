// @flow
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { DateRangePicker } from '@kitman/components';
import { getTurnaroundList } from '@kitman/modules/src/analysis/Dashboard/redux/selectors/turnaroundList';
import { getDateRangeForToday } from '@kitman/common/src/utils/dateRange';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel/index';

// Types
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { DateRange } from '@kitman/common/src/types';

type Props = {
  dateRange: ?DateRange,
  onSetDateRange: Function,
};

const CustomDateRange = ({
  dateRange,
  onSetDateRange,
  t,
}: I18nProps<Props>) => {
  const turnaroundList = useSelector(getTurnaroundList);

  const dateRangePickerRef = useRef(null);
  const setCustomDateRange = (range: DateRange) => {
    onSetDateRange({
      start_date: range.start_date,
      end_date: range.end_date,
    });
  };
  const [pickerPosition, setPickerPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (!dateRange) {
      onSetDateRange(getDateRangeForToday());
    }
  }, [dateRange, onSetDateRange]);

  useEffect(() => {
    if (dateRangePickerRef.current !== null) {
      const PADDING = 8;
      const PICKER_HEIGHT = 350;
      const BOTTOM_PADDING = 300;
      const documentWidth = document.documentElement?.clientWidth || 0;
      const documentHeight = document.documentElement?.clientHeight || 0;

      const { top, left, bottom } =
        dateRangePickerRef.current.getBoundingClientRect();

      let positionTop = top;

      if (top + PICKER_HEIGHT > documentHeight) {
        positionTop = documentHeight - PICKER_HEIGHT - PADDING;
      }

      if (bottom + PICKER_HEIGHT > documentHeight) {
        positionTop = documentHeight - PICKER_HEIGHT - BOTTOM_PADDING;
      }

      setPickerPosition({
        top: positionTop,
        right: documentWidth - left + PADDING,
      });
    }
  }, []);

  return (
    <>
      <Panel.FieldTitle data-testid="DateRangeModule|CustomDateRange|Title">
        {t('Select Date Range')}
      </Panel.FieldTitle>
      <div
        ref={dateRangePickerRef}
        css={{
          '.daterangepicker': {
            position: 'fixed',
            left: 'auto !important',
            right: `${pickerPosition.right}px !important`,
            top: `${pickerPosition.top}px !important`,
          },
        }}
      >
        <DateRangePicker
          data-testid="DateRangeModule|CustomDateRange|DateRangePicker"
          onChange={(newDateRange) => setCustomDateRange(newDateRange)}
          position="center"
          turnaroundList={turnaroundList}
          value={dateRange || getDateRangeForToday()}
          allowFutureDate
          kitmanDesignSystem
        />
      </div>
    </>
  );
};

export const CustomDateRangeTranslated = withNamespaces()(CustomDateRange);
export default CustomDateRange;
