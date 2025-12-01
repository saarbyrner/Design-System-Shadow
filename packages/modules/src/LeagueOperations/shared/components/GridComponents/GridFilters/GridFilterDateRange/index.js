// @flow
import React, { useState, useImperativeHandle } from 'react';
import moment from 'moment';
import CustomDateRangePicker from '@kitman/playbook/components/wrappers/CustomDateRangePicker';
import type {
  GridFilterRef,
  GridFilterComponent,
} from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/consts';

type DateRangeValue = {
  start_date: string | null,
  end_date: string | null,
} | null;

type Props = {
  label: string,
  value: DateRangeValue,
  param: string,
  defaultValue: DateRangeValue,
  onChange: (value: DateRangeValue) => void,
};

const GridFilterDateRange: GridFilterComponent<Props, GridFilterRef> =
  React.forwardRef(
    ({ label, value, param, defaultValue, onChange }: Props, ref) => {
      const [localValue, setLocalValue] = useState([
        value?.start_date ? moment(value.start_date) : null,
        value?.end_date ? moment(value.end_date) : null,
      ]);
      const [componentKey, setComponentKey] = useState(0);

      useImperativeHandle(ref, () => ({
        reset() {
          setLocalValue([
            defaultValue?.start_date ? moment(defaultValue.start_date) : null,
            defaultValue?.end_date ? moment(defaultValue.end_date) : null,
          ]);
          // Forces the component to re-render when programmatically updated.
          setComponentKey((prev) => prev + 1);
        },
        getResetValue() {
          return defaultValue;
        },
        getParam() {
          return param;
        },
        getIsFilterApplied() {
          return localValue.filter(Boolean).length > 0;
        },
      }));

      return (
        <CustomDateRangePicker
          key={componentKey}
          variant="muiFilled"
          sx={{ width: '100%' }}
          label={label}
          value={localValue}
          onChange={(dates) => {
            const normalizedDates: DateRangeValue = {
              start_date: dates?.start_date ?? null,
              end_date: dates?.end_date ?? null,
            };

            setLocalValue([
              normalizedDates?.start_date
                ? moment(normalizedDates.start_date)
                : null,
              normalizedDates?.end_date
                ? moment(normalizedDates.end_date)
                : null,
            ]);

            onChange(normalizedDates);
          }}
        />
      );
    }
  );

export default GridFilterDateRange;
