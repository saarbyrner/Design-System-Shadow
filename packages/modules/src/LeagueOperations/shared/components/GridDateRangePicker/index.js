// @flow
import i18n from '@kitman/common/src/utils/i18n';
import moment from 'moment';
import {
  DateRangePicker,
  SingleInputDateRangeField,
} from '@kitman/playbook/components';

import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import type { RequestStatus } from '@kitman/modules/src/LeagueOperations/shared/hooks/useManageGridData';

// Value is null when the user clears the input.
// Value is an object with start_date and end_date properties when the user selects a date range.
// The value is an object with start_date and end_date properties, which are formatted as YYYY-MM-DD.
type Value = { start_date: string | null, end_date: string | null } | null;
type Props = {
  value: Value,
  onUpdate: (Value) => void,
  requestStatus: RequestStatus,
};

const getDateFormat = (locale) => {
  return locale?.toLowerCase() === 'en-us' ? 'MM-DD-YYYY' : 'DD-MM-YYYY';
};

const DATE_FORMAT = 'YYYY-MM-DD';
const DEBOUNCE_TIMEOUT = 500;
const MIN_DATE = moment('1900-01-01');
const MAX_DATE = moment();

const GridDateRangePicker = ({ value, onUpdate, requestStatus }: Props) => {
  const { permissions } = usePermissions();
  const { organisation } = useOrganisation();
  const isDisabled =
    requestStatus.isFetching ||
    requestStatus.isLoading ||
    requestStatus.isError;

  const dateRangeValue = [
    value?.start_date ? moment(value.start_date, DATE_FORMAT) : null,
    value?.end_date ? moment(value.end_date, DATE_FORMAT) : null,
  ];
  const handleChange = (newValue) => {
    const start = newValue[0] ? moment(newValue[0]).format(DATE_FORMAT) : null;
    const end = newValue[1] ? moment(newValue[1]).format(DATE_FORMAT) : null;

    // Validate the date range,To prevent a fetch call when a user enters anything below the min date
    const isInvalidDate = (date) =>
      date && (!moment(date).isValid() || moment(date).isBefore(MIN_DATE));

    if (isInvalidDate(newValue[0]) || isInvalidDate(newValue[1])) {
      return;
    }

    if (start && end) {
      clearTimeout(GridDateRangePicker.debounceTimer);
      GridDateRangePicker.debounceTimer = setTimeout(() => {
        onUpdate({
          start_date: start,
          end_date: end,
        });
      }, DEBOUNCE_TIMEOUT);
    }
  };

  const handleClear = () => {
    onUpdate(null);
  };

  return permissions.homegrown.canViewHomegrown ? (
    <DateRangePicker
      value={dateRangeValue}
      calendars={0}
      disabled={isDisabled}
      sx={{ m: 1, width: 280 }}
      onChange={handleChange}
      disableFuture
      minDate={MIN_DATE}
      maxDate={MAX_DATE}
      format={getDateFormat(organisation?.locale)}
      reduceAnimations
      slots={{
        field: SingleInputDateRangeField,
      }}
      slotProps={{
        textField: {
          size: 'small',
          label: i18n.t('DOB range'),
          disabled: isDisabled,
          variant: 'filled',
          clearable: true,
          clearButtonPosition: 'end',
          onClear: handleClear,
        },
      }}
    />
  ) : null;
};

export default GridDateRangePicker;
