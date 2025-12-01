// @flow
import { useMemo, useState, useEffect, useCallback } from 'react';
import i18n from '@kitman/common/src/utils/i18n';
import moment from 'moment-timezone';
import { withNamespaces } from 'react-i18next';
import { SlidingPanelResponsive, TextButton } from '@kitman/components';
import { formatShort } from '@kitman/common/src/utils/dateFormatter';
import SelectWrapper from '@kitman/playbook/components/wrappers/SelectWrapper';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DateRangePicker,
  SingleInputDateRangeField,
  TextField,
} from '@kitman/playbook/components';
import { useGetAncillaryEligibleRangesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import {
  shouldDisableDateInAncillaryRangeAdd,
  doesListOfRangesContainAValidRange,
} from '@kitman/modules/src/Medical/shared/components/AncillaryRangeSidePanel/utils';
import { MOVEMENT_ENUM_LIKE } from '@kitman/modules/src/Medical/shared/components/AncillaryRangeSidePanel/types';
import style from '@kitman/modules/src/Medical/shared/components/AncillaryRangeSidePanel/styles';

// Types
import type { ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { RequestStatus } from '@kitman/common/src/types';
import type { MOVEMENT_TYPE, MOMENT_DATE_RANGE } from './types';

const movementTypeOptions = [
  { label: i18n.t('Try-Out'), value: 'tryout' },
  { label: i18n.t('Continuation of Care'), value: 'continuous_care' },
];

type AncillaryRangeValues = {
  movementType: string,
  start_date: Date | null,
  end_date: Date | null,
};

export type Props = {
  isOpen: boolean,
  onClose: () => void,
  athleteId: number,
  athleteData: AthleteData,
  ancillaryStatus: RequestStatus,
  onAncillaryRangeData: (ancillaryRangeValues: AncillaryRangeValues) => void,
};

const orgJoinDateNFL = '2023-03-01';
const daysAwayLimitTryout = 13; // 14 day range includes today
const daysAwayLimitContinuousCare = 179; // 180 day range includes today

const AncillaryRangeSidePanel = ({
  t,
  isOpen,
  onClose,
  athleteId,
  athleteData,
  ancillaryStatus,
  onAncillaryRangeData,
}: I18nProps<Props>) => {
  const [showDateRangeExceptionWarning, setShowDateRangeExceptionWarning] =
    useState<boolean>(false);
  const [movementTypeValue, setMovementTypeValue] = useState<MOVEMENT_TYPE>('');
  const [dateRange, setDateRange] = useState<MOMENT_DATE_RANGE>([null, null]);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationModalData, setConfirmationModalData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const { data: eligibleRanges = { eligible_ranges: [] } } =
    useGetAncillaryEligibleRangesQuery(athleteId, {
      skip: !athleteId || !window.featureFlags['nfl-ancillary-data'] || !isOpen,
    });

  const handleDateRangeChange = useCallback(
    ([startDate, endDate]: MOMENT_DATE_RANGE) => {
      if (startDate && endDate && endDate.isBefore(startDate)) {
        return;
      }
      if (
        startDate &&
        endDate &&
        !doesListOfRangesContainAValidRange({
          startDate,
          endDate,
          eligibleRanges,
        })
      ) {
        setShowDateRangeExceptionWarning(true);
        setDateRange([null, null]);
      } else {
        setShowDateRangeExceptionWarning(false);
        setDateRange([startDate, endDate]);
      }
    },
    [eligibleRanges]
  );

  const renderDateRangeExceptionWarning = () => (
    <Box>
      <Alert severity="error">
        {t('The selected range contains disabled dates. Please try again')}
      </Alert>
    </Box>
  );

  const resetState = () => {
    setSubmitted(false);
    setMovementTypeValue('');
    setDateRange([null, null]);
    setIsConfirmationModalOpen(false);
    setConfirmationModalData(null);
  };

  const addDays = (date, days) => moment(date).add(days, 'days');

  const minDate = useMemo(() => {
    if (movementTypeValue === MOVEMENT_ENUM_LIKE.tryout) {
      return moment(orgJoinDateNFL);
    }
    if (
      movementTypeValue === MOVEMENT_ENUM_LIKE.continuousCare &&
      athleteData?.organisation_transfer_records?.length
    ) {
      const lastTransferRecord =
        athleteData?.organisation_transfer_records[
          athleteData?.organisation_transfer_records.length - 1
        ];
      return lastTransferRecord?.joined_at
        ? moment(lastTransferRecord.joined_at)
        : null;
    }
    return null;
  }, [movementTypeValue, athleteData]);

  const maxDate = useMemo(() => {
    const today = moment();
    if (movementTypeValue === MOVEMENT_ENUM_LIKE.tryout) {
      return addDays(today, daysAwayLimitTryout);
    }
    if (movementTypeValue === MOVEMENT_ENUM_LIKE.continuousCare) {
      return addDays(today, daysAwayLimitContinuousCare);
    }
    return null;
  }, [movementTypeValue]);

  const shouldDisableDate = useCallback(
    (day, position) => {
      return shouldDisableDateInAncillaryRangeAdd({
        day,
        position,
        eligibleRanges,
        movementTypeValue,
        dateRange,
      });
    },
    [dateRange, eligibleRanges, movementTypeValue]
  );

  const renderDateRangePicker = () => {
    return (
      <DateRangePicker
        label={t('Date range')}
        slots={{ field: SingleInputDateRangeField }}
        value={dateRange}
        onChange={handleDateRangeChange}
        minDate={minDate}
        maxDate={maxDate}
        shouldDisableDate={shouldDisableDate}
        disabled={!athleteId || !movementTypeValue} // the available date values in this picker are dependent on movementTypeValue & athleteId
      />
    );
  };

  const renderMovementTypeSelect = () => {
    return (
      <div
        data-testid="AncillaryRangePanel|MovementTypeSelector"
        css={style.movementSelector}
      >
        <SelectWrapper
          label={t('Type')}
          onChange={(event) => {
            setMovementTypeValue(event.target.value);
            setDateRange([null, null]);
          }}
          value={movementTypeValue}
          options={movementTypeOptions}
          isMulti={false}
          invalid={movementTypeValue === 'PENDING'}
        />
      </div>
    );
  };

  const renderPlayerName = () => {
    return (
      <div
        data-testid="AncillaryRangePanel|PlayerName"
        css={style.movementSelector}
      >
        <TextField
          label={t('Player')}
          defaultValue={athleteData.fullname}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />
      </div>
    );
  };

  const openConfirmationModal = (ancillaryRangeValues) => {
    const dateRangeText = `${formatShort(moment(dateRange[0]))} - ${formatShort(
      moment(dateRange[1])
    )}`;
    const movementTypeLabel =
      movementTypeOptions.find((option) => option.value === movementTypeValue)
        ?.label ?? '';
    const confirmationMessage = `${athleteData.fullname} ${t(
      'to'
    )} ${movementTypeLabel} ${t('from')} ${dateRangeText}`;
    setConfirmationModalData({
      athleteName: athleteData.fullname,
      dateRangeText,
      confirmationMessage,
      ancillaryRangeValues,
    });
    setIsConfirmationModalOpen(true);
  };

  const addMovement = () => {
    const ancillaryRangeValues = {
      movementType: movementTypeValue,
      start_date: dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : null,
      end_date: dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : null,
    };
    openConfirmationModal(ancillaryRangeValues);
  };

  const handleConfirm = () => {
    const { ancillaryRangeValues } = confirmationModalData || {};
    if (ancillaryRangeValues) {
      setSubmitted(true);
      setIsConfirmationModalOpen(false);
      onAncillaryRangeData(ancillaryRangeValues);
    }
  };

  useEffect(() => {
    if (isOpen && submitted && ancillaryStatus === 'SUCCESS') {
      resetState();
      onClose();
    }
  }, [ancillaryStatus, isOpen, onClose, submitted]);

  const isAddButtonDisabled = useMemo(() => {
    const disabled =
      ancillaryStatus === 'PENDING' ||
      !movementTypeValue ||
      !dateRange[0] ||
      !moment(dateRange[0]).isValid() ||
      !dateRange[1] ||
      !moment(dateRange[1]).isValid();
    return disabled;
  }, [movementTypeValue, dateRange, ancillaryStatus]);

  return (
    <div css={style.sidePanel}>
      <SlidingPanelResponsive
        isOpen={isOpen}
        title={t('Ancillary Range')}
        onClose={() => {
          if (ancillaryStatus !== 'PENDING') {
            resetState();
            onClose();
          }
        }}
        width={460}
      >
        <div css={style.content}>
          {renderPlayerName()}
          {renderMovementTypeSelect()}
          {renderDateRangePicker()}
          {showDateRangeExceptionWarning && renderDateRangeExceptionWarning()}

          <Dialog
            open={isConfirmationModalOpen}
            onClose={() => setIsConfirmationModalOpen(false)}
            fullWidth
          >
            <DialogTitle>{t('Confirmation')}</DialogTitle>
            <DialogContent>
              {confirmationModalData && (
                <p>{confirmationModalData.confirmationMessage}</p>
              )}
            </DialogContent>

            <DialogActions>
              <Button
                color="secondary"
                onClick={() => setIsConfirmationModalOpen(false)}
              >
                {t('Cancel')}
              </Button>
              <Button onClick={handleConfirm}>{t('Confirm')}</Button>
            </DialogActions>
          </Dialog>
        </div>
        <div css={style.actions}>
          <TextButton
            onClick={addMovement}
            text={t('Add')}
            type="primary"
            isDisabled={isAddButtonDisabled}
            kitmanDesignSystem
          />
        </div>
      </SlidingPanelResponsive>
    </div>
  );
};

export const AncillaryRangeSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(AncillaryRangeSidePanel);
export default AncillaryRangeSidePanel;
