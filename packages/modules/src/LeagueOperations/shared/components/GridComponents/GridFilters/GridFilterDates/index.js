// @flow
import React, { useState, useImperativeHandle } from 'react';
import moment from 'moment';
import type { Moment } from 'moment';
import { DatePicker } from '@kitman/playbook/components';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type {
  GridFilterRef,
  GridFilterComponent,
  CommonFilterProps,
} from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/consts';

type Props = {
  ...CommonFilterProps<string>,
  label: string,
};

const GridFilterDates: GridFilterComponent<Props, GridFilterRef> =
  React.forwardRef(
    ({ label, param, defaultValue, value, onChange }: Props, ref) => {
      const [localValue, setLocalValue] = useState<Moment | null>(
        value ? moment(value, DateFormatter.dateTransferFormat) : null
      );

      useImperativeHandle(ref, () => ({
        reset() {
          setLocalValue(defaultValue);
        },
        getResetValue() {
          return defaultValue;
        },
        getParam() {
          return param;
        },
      }));

      return (
        <DatePicker
          sx={{ width: '100%' }}
          label={label}
          value={localValue}
          onChange={(date) => {
            setLocalValue(date);
            if (date && onChange) {
              const formatted = date.format(DateFormatter.dateTransferFormat);
              onChange(formatted);
            }
          }}
        />
      );
    }
  );

export default GridFilterDates;
