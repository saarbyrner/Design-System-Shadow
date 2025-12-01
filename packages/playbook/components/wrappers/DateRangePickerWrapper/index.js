// @flow

/**
 * DateRangePickerWrapper Component
 *
 * A wrapper component that provides date range selection functionality using two DatePicker components.
 * Features:
 * - Sequential date selection (start date first, then end date)
 * - Automatic calendar opening after start date selection
 * - Date validation (end date cannot be before start date)
 * - Clear functionality to reset both dates
 * - Disabled state support
 *
 * @param props - Component props
 * @returns JSX element
 */

import { useEffect, useRef, useState } from 'react';
import { typography } from '@kitman/common/src/variables';
import moment from 'moment';
import IconButton from '@mui/material/IconButton';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ClearIcon from '@mui/icons-material/Clear';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import type {
  DateRangeOutput,
  DateRangePickerWrapperProps,
  MomentType,
} from './types';
import { dateRangePickerStyles } from './styles';

export function DateRangePickerWrapper(props: DateRangePickerWrapperProps) {
  const {
    value,
    onChange,
    minDate,
    maxDate,
    disableFuture,
    disablePast,
    disabled,
    helperText,
  } = props;

  // Calendar open state
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const [localStartDate, setLocalStartDate] = useState<MomentType | null>(
    value?.start_date ? moment(value.start_date) : null
  );
  const [localEndDate, setLocalEndDate] = useState<MomentType | null>(
    value?.end_date ? moment(value.end_date) : null
  );

  const startRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const currentStartDate = localStartDate;
  const currentEndDate = localEndDate;

  // Clear both dates
  const clearDates = () => {
    setLocalStartDate(null);
    setLocalEndDate(null);
    onChange(null);
  };

  const formatDateRange = (
    startDate: MomentType,
    endDate: MomentType
  ): DateRangeOutput => {
    return {
      start_date: startDate?.isValid() ? startDate.format('YYYY-MM-DD') : '',
      end_date: endDate?.isValid() ? endDate.format('YYYY-MM-DD') : '',
    };
  };

  // Accept start date and open end calendar
  const handleStartAccept = (newStart: MomentType | null) => {
    try {
      if (!newStart?.isValid()) return;
      setLocalStartDate(newStart);
      setOpenStart(false);
      if (currentEndDate) {
        const dateRange = formatDateRange(newStart, currentEndDate);
        onChange(dateRange);
      } else {
        // Auto-open end date picker
        setTimeout(() => {
          setOpenEnd(true);
        }, 100);
      }
    } catch (error) {
      console.error('Error handling start date:', error);
    }
  };

  // Accept end date and send range
  const handleEndAccept = (newEnd: MomentType | null) => {
    if (!(newEnd && newEnd.isValid())) return;
    setLocalEndDate(newEnd);
    if (currentStartDate) {
      const dateRange = formatDateRange(currentStartDate, newEnd);
      onChange(dateRange);
    }
    setOpenEnd(false);
  };

  const handleStartChange = (newStart: MomentType | null) => {
    setLocalStartDate(newStart);
  };

  const handleEndChange = (newEnd: MomentType | null) => {
    setLocalEndDate(newEnd);
  };

  const handleStartInputClick = () => {
    if (disabled) return;

    setOpenStart(true);
    setOpenEnd(false);
  };

  const handleEndInputClick = () => {
    if (disabled || !currentStartDate) return;

    setOpenEnd(true);
    setOpenStart(false);
  };

  const isRangeSelected = !!currentStartDate && !!currentEndDate;

  // Sync with external value
  useEffect(() => {
    setLocalStartDate(value?.start_date ? moment(value.start_date) : null);
    setLocalEndDate(value?.end_date ? moment(value.end_date) : null);
  }, [value]);

  return (
    <ClickAwayListener
      onClickAway={() => {
        setOpenStart(false);
        setOpenEnd(false);
      }}
    >
      <Box sx={dateRangePickerStyles.container}>
        {/* Start Date Picker */}
        <DatePicker
          open={openStart}
          onOpen={() => setOpenStart(true)}
          onClose={() => setOpenStart(false)}
          value={currentStartDate}
          onChange={handleStartChange}
          onAccept={handleStartAccept}
          minDate={minDate}
          maxDate={maxDate}
          disableFuture={disableFuture}
          disablePast={disablePast}
          disabled={disabled}
          views={['year', 'month', 'day']}
          openTo="day"
          slotProps={{
            textField: {
              inputRef: startRef,
              onClick: handleStartInputClick,
              label: 'Start date',
              fullWidth: true,
              disabled,
              helperText,
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarTodayIcon
                      sx={dateRangePickerStyles.calendarIcon}
                    />
                  </InputAdornment>
                ),
              },
              sx: dateRangePickerStyles.datePickerInput,
            },
          }}
        />

        {/* Separator dash */}
        <Typography variant="body2" sx={dateRangePickerStyles.separatorText}>
          {typography.enDash}
        </Typography>

        {/* End Date Picker */}
        <DatePicker
          open={openEnd}
          onOpen={() => setOpenEnd(true)}
          onClose={() => setOpenEnd(false)}
          value={currentEndDate}
          onChange={handleEndChange}
          onAccept={handleEndAccept}
          minDate={currentStartDate || minDate} // End date cannot be before start date
          maxDate={maxDate}
          disableFuture={disableFuture}
          disablePast={disablePast}
          disabled={disabled || !currentStartDate} // Disabled until start date is selected
          views={['year', 'month', 'day']}
          openTo="day"
          slotProps={{
            textField: {
              inputRef: endRef,
              onClick: (e) => {
                // Prevent calendar if no start date
                if (currentStartDate) {
                  handleEndInputClick();
                  return;
                }
                e.preventDefault();
              },
              label: 'End date',
              fullWidth: true,
              disabled: disabled || !currentStartDate,
              helperText,
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarTodayIcon
                      sx={dateRangePickerStyles.calendarIcon}
                    />
                  </InputAdornment>
                ),
              },
              sx: dateRangePickerStyles.datePickerInput,
            },
          }}
        />

        {/* Clear Button - positioned closer to end date picker */}
        {isRangeSelected && (
          <IconButton
            onClick={clearDates}
            disabled={disabled}
            sx={dateRangePickerStyles.clearButton}
          >
            <ClearIcon />
          </IconButton>
        )}
      </Box>
    </ClickAwayListener>
  );
}
