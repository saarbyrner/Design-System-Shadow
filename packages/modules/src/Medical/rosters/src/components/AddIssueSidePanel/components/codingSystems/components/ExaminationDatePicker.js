// @flow
import moment from 'moment-timezone';
import { withNamespaces } from 'react-i18next';
import { Box } from '@kitman/playbook/components';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { useGetAncillaryEligibleRangesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { type I18nProps } from '@kitman/common/src/types/i18n';

type ExaminationDateProps = {
  selectedDiagnosisDate: string | moment.Moment,
  selectedExaminationDate: string | moment.Moment,
};
type Props = {
  athleteId: number | string,
  athleteData: AthleteData,
  examinationDateProps: ExaminationDateProps,
  isEditMode: boolean,
  getFieldLabel?: (field: string) => string,
  maxPermittedExaminationDate: ?string,
  onSelectExaminationDate: (date: string | null) => void,
  onChangedate: (date: string) => void,
};

const ExaminationDatePicker = (props: I18nProps<Props>) => {
  const dateOfInjury = moment(props.examinationDateProps.selectedDiagnosisDate); // Check with product if they still want this plus one day
  const activePeriods = props.athleteData.constraints?.active_periods ?? [];
  const { data: ancillaryRanges = { eligible_ranges: [] } } =
    useGetAncillaryEligibleRangesQuery(props.athleteId, {
      skip: !props.athleteId,
    });

  // Date value - MinDate
  // Min date will be set to the earliest date available from the following sources
  let minDate = moment();
  const selectedDate = props.examinationDateProps.selectedExaminationDate
    ? moment(props.examinationDateProps.selectedExaminationDate)
    : null;
  // Injury occurrence date
  if (dateOfInjury.isValid()) {
    minDate = moment.min(minDate, dateOfInjury);
  }
  // Player movement
  if (Array.isArray(activePeriods) && activePeriods.length > 0) {
    activePeriods.forEach((period) => {
      if (period.start && moment(period.start).isValid()) {
        minDate = moment.min(minDate, moment(period.start));
      }
    });
  }
  // Ancillary date range
  if (Array.isArray(ancillaryRanges) && ancillaryRanges.length > 0) {
    ancillaryRanges.forEach((range) => {
      if (range.start && moment(range.start).isValid()) {
        minDate = moment.min(minDate, moment(range.start));
      }
    });
  }

  // Date value - MaxDate
  // Max date will be set to the furthest date available from the following sources and will not exceed todays date
  let maxDate = moment();
  // Player Movement
  if (Array.isArray(activePeriods) && activePeriods.length > 0) {
    activePeriods.forEach((period) => {
      if (period.end && moment(period.end).isValid()) {
        maxDate = moment.max(maxDate, moment(period.end));
      }
    });
  }
  // Ancillary date range
  if (Array.isArray(ancillaryRanges) && ancillaryRanges.length > 0) {
    ancillaryRanges.forEach((range) => {
      if (range.end && moment(range.end).isValid()) {
        maxDate = moment.max(maxDate, moment(range.end));
      }
    });
  }

  return (
    <Box
      sx={{
        '& label': { display: 'block' },
      }}
    >
      <MovementAwareDatePicker
        athleteId={props.athleteId}
        value={selectedDate}
        onChange={(date) => {
          props.onChangedate(date);
        }}
        inputLabel={props.t('Date of examination')}
        name="examinationDate"
        kitmanDesignSystem
        disableFuture
        providedDateRanges={[{ start: minDate, end: maxDate }]}
      />
    </Box>
  );
};

export default withNamespaces()(ExaminationDatePicker);
