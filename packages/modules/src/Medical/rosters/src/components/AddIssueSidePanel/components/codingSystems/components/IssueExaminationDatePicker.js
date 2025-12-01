// @flow
import { useState, useMemo } from 'react';
import moment from 'moment-timezone';
import { withNamespaces } from 'react-i18next';
import { Box, Typography } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { rootTheme } from '@kitman/playbook/themes';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { type I18nProps } from '@kitman/common/src/types/i18n';

type ExaminationDateProps = {
  selectedDiagnosisDate: string | moment.Moment,
  selectedExaminationDate: string | moment.Moment,
  diagnosisDateIsInvalid: boolean,
  examinationDateIsInvalid: boolean,
};
type Props = {
  athleteId: number | string,
  athleteData: AthleteData,
  examinationDateProps: ExaminationDateProps,
  isEditMode: boolean,
  getFieldLabel?: (field: string) => string,
  maxPermittedExaminationDate: ?string,
  onSelectExaminationDate: (date: string | null) => void,
  onChangeExaminationDate: (date: string) => void,
  onChangeOccurrenceDate: (date: string) => void,
  type: 'examination' | 'issue',
  onSelectDetail: (
    detailType: string,
    detailValue: string | number | Object
  ) => void,
  details: Object,
};

const IssueExaminationDatePicker = (props: I18nProps<Props>) => {
  const [lastDatePickerUsed, setLastDatePickerUsed] = useState(null);
  const activePeriods = props.athleteData?.constraints?.active_periods ?? [];

  const selectedExaminationDateMemo = useMemo(() => {
    return props.examinationDateProps.selectedExaminationDate
      ? moment(props.examinationDateProps.selectedExaminationDate)
      : null;
  }, [props.examinationDateProps.selectedExaminationDate]);

  const selectedOccurrenceDateMemo = useMemo(() => {
    return props.details.occurrenceDate
      ? moment(props.details.occurrenceDate)
      : null;
  }, [props.details.occurrenceDate]);

  // Min date will be set to the earliest date available from the following sources
  // Max date will be set to the furthes date available from the following sources (limited to todays date)
  const { minDate, maxDate } = useMemo(() => {
    let calculatedMinDate = null;
    let calculatedMaxDate = null;
    let hasNullStart = false;
    let hasNullEnd = false;

    activePeriods.forEach((period) => {
      if (period.start && moment(period.start).isValid()) {
        const currentStartDate = moment(period.start);
        calculatedMinDate = calculatedMinDate
          ? moment.min(calculatedMinDate, currentStartDate)
          : currentStartDate;
      } else if (period.start === null) {
        hasNullStart = true;
      }

      if (period.end && moment(period.end).isValid()) {
        const currentEndDate = moment(period.end);
        calculatedMaxDate = calculatedMaxDate
          ? moment.max(calculatedMaxDate, currentEndDate)
          : currentEndDate;
      } else if (period.end === null) {
        hasNullEnd = true;
      }
    });

    const today = moment().endOf('day');
    let finalMaxDate = calculatedMaxDate
      ? moment.min(calculatedMaxDate, today)
      : today;

    if (hasNullEnd) {
      finalMaxDate = today;
    }

    return {
      minDate: hasNullStart ? null : calculatedMinDate,
      maxDate: finalMaxDate,
    };
  }, [activePeriods]);

  // Memoize the date comparison calculation
  const examinationDateIsBeforeOccurrence = useMemo(() => {
    // Check if dates are valid before comparing
    const examDate = moment(props.details.examinationDate);
    const occurDate = moment(props.details.occurrenceDate);
    if (examDate.isValid() && occurDate.isValid()) {
      return examDate.isBefore(occurDate);
    }
    return false;
  }, [props.details.examinationDate, props.details.occurrenceDate]);

  // Used to highlight the datepicker that changes the dates (accross the 2 pickers) to a state where examinationDateIsBeforeOccurrence
  const isDatePickerInvalid = (
    datePickerName: 'examinationDate' | 'occurrenceDate'
  ) => {
    if (
      datePickerName === lastDatePickerUsed &&
      examinationDateIsBeforeOccurrence
    ) {
      return true;
    }
    return false;
  };

  return (
    <Box
      sx={{
        p: props.isEditMode ? '1rem 0 1rem 0' : '0.1rem 0 0.1rem 0',
        display: 'flex',
        '& label': { display: 'block' },
      }}
      data-testid="IssueExaminationDatePicker"
    >
      <Box
        sx={{
          display: 'inline-block',
          mt: examinationDateIsBeforeOccurrence ? '2.5em' : 'unset',
        }}
      >
        <MovementAwareDatePicker
          athleteId={props.athleteId}
          value={selectedOccurrenceDateMemo}
          onChange={(date) => {
            setLastDatePickerUsed('occurrenceDate');
            props.onChangeOccurrenceDate(date);
          }}
          inputLabel={props.t('Date of injury')}
          name="occurrenceDate"
          kitmanDesignSystem
          minDate={minDate}
          maxDate={maxDate}
          providedDateRanges={activePeriods}
          isInvalid={
            isDatePickerInvalid('occurrenceDate') ||
            props.examinationDateProps.diagnosisDateIsInvalid
          }
          disableFuture
        />
      </Box>
      <Box
        sx={{
          display: 'inline-block',
          ml: 2,
        }}
      >
        {examinationDateIsBeforeOccurrence && (
          <Box
            sx={{
              display: 'inline-block',
              width: '100%',
            }}
          >
            <Typography
              sx={{ display: 'block', color: rootTheme.palette.error.light }}
              variant="caption"
              display="block"
              gutterBottom
            >
              <KitmanIcon name={KITMAN_ICON_NAMES.Warning} sx={{ mb: 1 }} />
              {props.t('Examination date is before the Injury date')}
            </Typography>
          </Box>
        )}
        <MovementAwareDatePicker
          athleteId={props.athleteId}
          value={selectedExaminationDateMemo}
          onChange={(date) => {
            setLastDatePickerUsed('examinationDate');
            props.onChangeExaminationDate(date);
          }}
          inputLabel={props.t('Date of examination')}
          name="examinationDate"
          kitmanDesignSystem
          minDate={minDate}
          maxDate={maxDate}
          providedDateRanges={activePeriods}
          isInvalid={
            isDatePickerInvalid('examinationDate') ||
            props.examinationDateProps.examinationDateIsInvalid
          }
          disableFuture
        />
      </Box>
    </Box>
  );
};

export default withNamespaces()(IssueExaminationDatePicker);
