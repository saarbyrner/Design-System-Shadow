// @flow

import { useEffect, useRef, useState } from 'react';
import {
  Box,
  GlobalStyles,
  IconButton,
  InputAdornment,
  TextField,
  useTheme,
} from '@mui/material';
import { CalendarToday, Clear, ArrowDropDown } from '@mui/icons-material';

import moment from 'moment';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { useClickOutside } from './hooks/useClickOutside';
import { useIsMobile } from './hooks/useIsMobile';
import { useDateInput } from './hooks/useDateInput';

import {
  applyRangeStyles,
  formatDateRange,
  getCurrentMonthYear,
} from './utils';
import { getTextFieldStyles, globalStyles } from './styles';

import type {
  CalendarView,
  CustomDateRangePickerProps,
  DateRange,
  MobileStep,
} from './types';
import LocalizationProvider from '../../../providers/wrappers/LocalizationProvider';
import type { MomentType } from '../DateRangePickerWrapper/types';
import MobileDateRangePicker from './components/MobileDateRangePicker';
import DesktopDateRangePicker from './components/DesktopDateRangePicker';
import { getDefaultFilters } from './constants';

function CustomDateRangePicker({
  disableFuture,
  disablePast,
  variant = 'default',
  onChange,
  minDate,
  maxDate,
  customFilters,
  value,
  label,
}: CustomDateRangePickerProps) {
  const isMobile = useIsMobile();
  const theme = useTheme();
  const defaultPrimary = theme.palette.primary.main;
  const defaultContrastText = theme.palette.primary.contrastText;

  // Main component state

  const { data } = useGetOrganisationQuery();
  const organisationLocale = data?.locale || 'en-US';
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>(value ?? [null, null]);

  const [mobileStep, setMobileStep] = useState<MobileStep>('start');
  const [currentView, setCurrentView] = useState<CalendarView>('day');
  const [hoveredDate, setHoveredDate] = useState<MomentType | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Merge default filters with custom ones if provided

  const filters = customFilters
    ? [...getDefaultFilters(), ...customFilters]
    : getDefaultFilters();

  // Format display value for the input field based on organization locale
  const getDisplayValue = () => {
    if (!dateRange[0] || !dateRange[1]) {
      return '';
    }

    const startDate: MomentType = dateRange[0];
    const endDate: MomentType = dateRange[1];

    if (variant === 'muiFilled') {
      const dateFormat = 'MMM DD, YYYY';
      return `${startDate.format(dateFormat)} - ${endDate.format(dateFormat)}`;
    }

    const dateFormat =
      organisationLocale === 'en-US' ? 'MM/DD/YYYY' : 'DD/MM/YYYY';

    return `${startDate.format(dateFormat)} — ${endDate.format(dateFormat)}`;
  };

  const hasSelectedDates = dateRange[0] || dateRange[1];

  const closeCalendar = () => {
    setIsCalendarOpen(false);
    setHoveredDate(null);
  };

  // Central function to update date range and notify parent component

  const updateDateRange = (newRange: DateRange) => {
    setDateRange(newRange);
    if (onChange) {
      if (newRange[0] && newRange[1]) {
        const formatted = formatDateRange(newRange[0], newRange[1]);
        onChange(formatted); // Both dates selected - format and send to parent
      } else if (!newRange[0] && !newRange[1]) {
        onChange(null); // Range cleared - send null to parent
      }
    }
  };

  // Custom hook for handling keyboard input in the text field

  const { inputValue, handleInputChange, handleInputKeyDown, clearInput } =
    useDateInput({
      dateRange,
      updateDateRange,
      organisationLocale,
    });

  const wrapperRef = useRef<?HTMLElement>(null);
  useClickOutside(wrapperRef, closeCalendar);

  // Handle quick filter selection

  const handleQuickSelect = (filterKey: string) => {
    const filter = filters.find((f) => f.key === filterKey);
    if (!filter) return;

    const newRange = filter.getDateRange();
    updateDateRange(newRange);
    setSelectedFilter(filterKey);
    // Optional: close the calendar after selection
    // closeCalendar()
  };

  // Apply visual styles to show selected range whenever state changes
  useEffect(() => {
    if (!isCalendarOpen) return;

    // Small delay to ensure DOM is updated before applying styles
    const timer = setTimeout(() => {
      applyRangeStyles(dateRange, hoveredDate, isMobile);
    }, 40);
    // eslint-disable-next-line consistent-return
    return () => clearTimeout(timer);
  }, [dateRange, hoveredDate, isCalendarOpen, isMobile]);

  const handleInputClick = () => {
    setIsCalendarOpen((prev) => {
      const opening = !prev;
      // Reset mobile step when opening calendar
      if (opening && isMobile) {
        setMobileStep('start');
      }
      return opening;
    });
  };

  const handleClearDates = (e: SyntheticMouseEvent<HTMLElement>) => {
    e.stopPropagation();
    updateDateRange([null, null]);
    setIsCalendarOpen(false);
  };

  // Desktop calendar handlers - separate for start and end dates
  const handleStartDateChange = (newValue: MomentType | null) => {
    updateDateRange([newValue, dateRange[1]]);
  };

  const handleEndDateChange = (newValue: MomentType | null) => {
    updateDateRange([dateRange[0], newValue]);
  };

  // Mobile calendar handler - handles both start and end based on current step
  const handleMobileDateChange = (newValue: MomentType | null) => {
    if (mobileStep === 'start') {
      updateDateRange([newValue, dateRange[1]]);
      if (currentView === 'day') {
        setMobileStep('end');
      }
    } else {
      updateDateRange([dateRange[0], newValue]);
      if (currentView === 'day') {
        closeCalendar();
      }
    }
  };

  // Handle mouse hover for range preview (desktop only)
  const handleDayMouseEnter = (event: MouseEvent) => {
    if (isMobile || !dateRange[0]) return;

    const dayElement = event.target;
    if (!(dayElement instanceof HTMLElement)) return;
    const dayText = dayElement.textContent;
    if (!dayText) return;

    const dayNumber = Number.parseInt(dayText, 10);

    if (Number.isNaN(dayNumber)) return;

    const calendarContainer = dayElement.closest('[data-calendar-type]');
    if (!(calendarContainer instanceof HTMLElement)) return;

    const currentMonthYear = getCurrentMonthYear(calendarContainer);
    if (!currentMonthYear) return;

    const hoveredDay = moment()
      .year(currentMonthYear.year)
      .month(currentMonthYear.month)
      .date(dayNumber);

    setHoveredDate(hoveredDay);
  };

  const handleDayMouseLeave = () => {
    if (!isMobile) {
      setHoveredDate(null);
    }
  };

  useEffect(() => {
    if (!isCalendarOpen) return;

    const addEventListeners = () => {
      document.querySelectorAll('.MuiPickersDay-root').forEach((day) => {
        day.addEventListener('mouseenter', handleDayMouseEnter);
        day.addEventListener('mouseleave', handleDayMouseLeave);
      });
    };

    const timer = setTimeout(addEventListeners, 100);

    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(timer);
      document.querySelectorAll('.MuiPickersDay-root').forEach((day) => {
        day.removeEventListener('mouseenter', handleDayMouseEnter);
        day.removeEventListener('mouseleave', handleDayMouseLeave);
      });
    };
  }, [isCalendarOpen, dateRange]);

  const handleClearButtonClick = (e: SyntheticMouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (hasSelectedDates) {
      handleClearDates(e);
      clearInput();
    } else {
      handleInputClick();
    }
  };

  const renderTextField = () => {
    if (variant === 'muiFilled') {
      return (
        <TextField
          id="outlined-basic"
          variant="filled"
          label={label}
          onClick={handleInputClick}
          value={inputValue || getDisplayValue()}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  size="small"
                  onClick={handleClearButtonClick}
                >
                  {hasSelectedDates ? <Clear /> : <ArrowDropDown />}
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              justifyContent: 'space-between',
              input: {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minWidth: 160,
                maxWidth: 300,
              },
            },
          }}
        />
      );
    }

    return (
      <TextField
        id="outlined-basic"
        placeholder={
          organisationLocale === 'en-US'
            ? 'MM/DD/YYYY — MM/DD/YYYY'
            : 'DD/MM/YYYY — DD/MM/YYYY'
        }
        variant="outlined"
        onClick={handleInputClick}
        value={inputValue || getDisplayValue()}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        label={label}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClearButtonClick}
                edge="end"
                size="small"
              >
                {hasSelectedDates ? <Clear /> : <CalendarToday />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={getTextFieldStyles(variant || 'default')}
      />
    );
  };

  return (
    <>
      <GlobalStyles styles={globalStyles} />
      <Box
        ref={wrapperRef}
        display="flex"
        flexDirection="column"
        sx={{ position: 'relative' }}
      >
        <LocalizationProvider>
          {renderTextField()}
          {/* Render desktop version when calendar is open and not mobile */}
          {isCalendarOpen && !isMobile && (
            <DesktopDateRangePicker
              variant={variant}
              selectedFilter={selectedFilter}
              handleQuickSelect={handleQuickSelect}
              defaultPrimary={defaultPrimary}
              defaultContrastText={defaultContrastText}
              filters={filters}
              disableFuture={disableFuture}
              disablePast={disablePast}
              minDate={minDate}
              maxDate={maxDate}
              dateRange={dateRange}
              handleStartDateChange={handleStartDateChange}
              handleEndDateChange={handleEndDateChange}
              handleClearDates={handleClearDates}
              closeCalendar={closeCalendar}
            />
          )}
          {/* Render mobile version when calendar is open and on mobile */}
          {isCalendarOpen && isMobile && (
            <MobileDateRangePicker
              mobileStep={mobileStep}
              setMobileStep={setMobileStep}
              currentView={currentView}
              setCurrentView={setCurrentView}
              dateRange={dateRange}
              handleMobileDateChange={handleMobileDateChange}
              disableFuture={disableFuture}
              disablePast={disablePast}
              minDate={minDate}
              maxDate={maxDate}
              selectedFilter={selectedFilter}
              handleQuickSelect={handleQuickSelect}
              defaultPrimary={defaultPrimary}
              defaultContrastText={defaultContrastText}
              filters={filters}
            />
          )}
        </LocalizationProvider>
      </Box>
    </>
  );
}

export default CustomDateRangePicker;
