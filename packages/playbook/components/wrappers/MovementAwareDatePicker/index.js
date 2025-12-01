// @flow
import moment, { type Moment } from 'moment';
import { arraysAreNotEqual } from '@kitman/common/src/utils';
import { isDateInRange } from '@kitman/common/src/utils/dateRange';
import { Box, DatePicker } from '@kitman/playbook/components';
import { useEffect, useState, useCallback } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { rootTheme } from '@kitman/playbook/themes';
import { zIndices } from '@kitman/common/src/variables';
import { convertPixelsToREM } from '@kitman/common/src/utils/css';
import i18n from '@kitman/common/src/utils/i18n';
import { useGetAthleteDataQuery, useGetAncillaryEligibleRangesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import {
  CustomLayout,
  CustomTextField,
  MultiDayRenderer,
} from '@kitman/playbook/components/wrappers/MovementAwareDatePicker/multiDateHelpers';

// Types:
import type { Period } from '@kitman/modules/src/Medical/shared/types/medical/Constraints';

export const getDatePickerTheme = (width: ?string = '18em') =>
  createTheme({
    ...rootTheme,
    components: {
      MuiPickersPopper: {
        styleOverrides: {
          root: { zIndex: zIndices.popover },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            height: '2em',
            width: width || '18em',
            background: rootTheme.palette.secondary.main,
          },
        },
      },
      MuiDatePicker: {
        defaultProps: {
          showDaysOutsideCurrentMonth: true,
        },
      },
    },
  });

type Props = {
  value: ?Moment | Array<Moment>,
  onChange: (
    newDate: Moment,
    context: Object
  ) => void | ((Array<Moment>, context: Object) => void),
  onError?: (error: Object) => void,
  athleteId?: number | string,
  providedDateRanges?: Array<Period>,
  lastActivePeriodCallback?: Function,
  /*
   * shouldDisableDate prevents the selection of all dates for which it returns true
   * Warning: if minDate or maxDate are passed as props, this will also be taken into account
   * e.g. if 1st to 10th Sep is an enabled range. If minDate is passed as 4th September, then only 4th to 10th will be enabled
   * e.g. if 1st to 10th Sep is an enabled range. If maxDate is passed as 8th September, then only 1st to 8th will be enabled
   * e.g. if 1st to 10th Sep is an enabled range. If minDate is passed as 4th September and maxDate as 8th September, then only 4th to 8th will be enabled
   */
  label?: string,
  inputLabel?: string,
  clearable?: boolean,
  disabled?: boolean,
  isInvalid?: boolean,
  width?: string,
  minDate?: Moment,
  maxDate?: Moment,
  disableFuture?: boolean,
  multiDate?: boolean, // Will return a list of selected dates
  kitmanDesignSystem?: boolean,
  inclundeAncillaryRanges?: boolean,
};

const MovementAwareDatePicker = ({
  value,
  onChange,
  onError,
  athleteId,
  providedDateRanges = [],
  lastActivePeriodCallback,
  label,
  inputLabel,
  clearable,
  disabled,
  isInvalid,
  width,
  minDate,
  maxDate,
  disableFuture,
  multiDate,
  kitmanDesignSystem,
  inclundeAncillaryRanges = false,
}: Props) => {

  const shouldIncludeAncillaryRanges = inclundeAncillaryRanges && window.getFlag('player-movement-aware-datepicker-include-ancillary');
  const [lastActivePeriodsList, setLastActivePeriodsList] = useState<
    Array<Period>
  >([]);

    const { data: ancillaryRanges } = useGetAncillaryEligibleRangesQuery(
    athleteId,
    {
      skip: !athleteId || !shouldIncludeAncillaryRanges,
    }
  );

  const listOfDateRanges =
    (providedDateRanges?.length && providedDateRanges) || lastActivePeriodsList;

  const combinedRanges =
    shouldIncludeAncillaryRanges && ancillaryRanges?.eligible_ranges
      ? [...listOfDateRanges, ...ancillaryRanges.eligible_ranges]
      : listOfDateRanges;

  // Controls the calendar view
  const [open, setOpen] = useState(false);

  // Use passed dates via props and fallback on athlete data if none provided
  const { data: athleteData } = useGetAthleteDataQuery(athleteId, {
    skip: !athleteId || providedDateRanges?.length > 0,
  });

  const setDateRangesWithAthleteData = useCallback(() => {
    if (!athleteData?.constraints?.active_periods.length) {
      return false;
    }

    const newActivePeriodsList = athleteData?.constraints?.active_periods;
    return setLastActivePeriodsList((prevActivePeriodsList) => {
      // Check if the new list is different from the current one before updating
      if (arraysAreNotEqual(newActivePeriodsList, prevActivePeriodsList)) {
        // Pass value up to callback function if called
        if (lastActivePeriodCallback) {
          lastActivePeriodCallback(
            newActivePeriodsList[newActivePeriodsList.length - 1]
          );
        }
        return newActivePeriodsList;
      }
      return prevActivePeriodsList;
    });
  }, [athleteData, athleteId]);

  useEffect(() => {
    // Use passed dates via props and fallback on athlete data if none provided
    if (providedDateRanges && providedDateRanges?.length < 1 && athleteId) {
      setDateRangesWithAthleteData();
    } else {
      // Enable all dates when no athleteId or dateRanges available
      setLastActivePeriodsList([
        { start: null, end: disableFuture ? moment().endOf('day') : null },
      ]);
    }
  }, [
    setDateRangesWithAthleteData,
    providedDateRanges?.length,
    athleteId,
    disableFuture,
  ]);

  const addMultiDate = (date, context = { validationError: null }) => {
    onChange([...(value || []), date], context);
  };

  const removeMultiDate = (date, context = { validationError: null }) => {
    const filtered = value?.filter(
      (selectedDate) => !selectedDate.isSame(date, 'date')
    );
    onChange(filtered, context);
  };

  const allowNullConstraints =
    window.featureFlags['date-picker-allow-null-constraints'];
    

  return (
    <Box data-testid="MovementAwareDatePicker">
      <ThemeProvider
        theme={kitmanDesignSystem ? getDatePickerTheme(width) : {}}
      >
        <Box
          sx={
            // Kitman styles
            kitmanDesignSystem && {
              label: {
                color: rootTheme.palette.primary.light,
                marginBottom: '0.2em',
                fontWeight: 600,
                fontSize: convertPixelsToREM(12),
              },
              fieldset: {
                border: isInvalid
                  ? `2px solid ${rootTheme.palette.error.light}`
                  : 'none',
              },
            }
          }
        >
          {inputLabel && <label htmlFor={inputLabel}>{inputLabel}</label>}
          <DatePicker
            label={label}
            value={multiDate ? null : value} // When multiDate cannot use value here as DatePicker will not accept an array
            onChange={(changedValue, context) => {
              if (!multiDate) {
                onChange(changedValue, context);
              }
            }}
            onError={onError}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            shouldDisableDate={(date) => {
              // Some orgs have player movement enabled but their constraints have not been created
              // This FF guarded check will enable dates for them. disableFuture Will still be respected
              if (
                allowNullConstraints &&
                (!combinedRanges || combinedRanges.length === 0)
              ) {
                return false;
              }
              return !isDateInRange(date, combinedRanges);
            }}
            disabled={disabled}
            minDate={minDate}
            maxDate={maxDate}
            disableFuture={disableFuture}
            slotProps={
              multiDate
                ? {
                    day: {
                      selections: value || [],
                      onClick: (date: Moment, selected: boolean) => {
                        if (selected) {
                          removeMultiDate(date);
                        } else {
                          addMultiDate(date);
                        }
                      },
                    },
                    textField: {
                      onClick: () => setOpen(true),
                      error: isInvalid,
                      clearable,
                      readOnly: !!multiDate,
                      selections: value || [],
                    },
                    layout: {
                      selections: value || [],
                      handleDateDelete: removeMultiDate,
                      selectionAreaTitle: `${i18n.t('Selected')}:`,
                    },
                  }
                : {
                    textField: {
                      onClick: () => setOpen(true),
                      error: isInvalid,
                      clearable,
                    },
                  }
            }
            slots={
              multiDate
                ? {
                    day: MultiDayRenderer,
                    textField: CustomTextField,
                    layout: CustomLayout,
                  }
                : {}
            }
            closeOnSelect={!multiDate}
          />
        </Box>
      </ThemeProvider>
    </Box>
  );
};

export default MovementAwareDatePicker;
