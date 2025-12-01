// @flow
import { Popover, IconButton } from '@kitman/playbook/components';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { ComponentType } from 'react';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import {
  CONSENTABLE_TYPE,
  CONSENTING_TO,
  CONSENT_STATUS,
} from '@kitman/common/src/types/Consent';
import DateSelection from '@kitman/modules/src/ConditionalFields/shared/components/DateSelection';
import {
  useSaveSingleAthleteConsentMutation,
  useUpdateSingleAthleteConsentMutation,
} from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { determineMedicalLevelAndTab } from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';

type Props = {
  athleteId: number,
  consentStatus: $Values<typeof CONSENT_STATUS>,
};

const ActionsCell = ({ athleteId, consentStatus, t }: I18nProps<Props>) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [date, setDate] = useState(null);

  const [saveSingleAthleteConsent] = useSaveSingleAthleteConsentMutation();
  const [updateSingleAthleteConsent] = useUpdateSingleAthleteConsentMutation();
  const dispatch = useDispatch();
  const { trackEvent } = useEventTracking();

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCancelDateRangeSelection = () => {
    setDateRange([null, null]);
    handleClosePopover();
  };

  const handleCancelDateSelection = () => {
    setDate(null);
    handleClosePopover();
  };

  const handleSaveAthleteConsent = () => {
    const [startDate, endDate] = dateRange;

    trackEvent(performanceMedicineEventNames.clickedAddConsentRange, {
      ...determineMedicalLevelAndTab(),
      isMulti: false,
    });

    saveSingleAthleteConsent({
      athlete_id: athleteId,
      consentable_type: CONSENTABLE_TYPE.Organisation,
      consenting_to: CONSENTING_TO.injury_surveillance_export,
      start_date: startDate,
      end_date: endDate,
    })
      .unwrap()
      .then(() => {
        dispatch(
          add({
            id: 'save-athlete-consent-success',
            title: t('Consent Updated'),
            status: 'SUCCESS',
          })
        );
        trackEvent(performanceMedicineEventNames.addedConsentRange, {
          ...determineMedicalLevelAndTab(),
          isMulti: false,
        });
      })
      .catch((error) => {
        dispatch(
          add({
            id: 'save-athlete-consent-error',
            title: error.error[0],
            status: 'ERROR',
          })
        );
      });
    setDateRange([null, null]);
    handleClosePopover();
  };

  const handleUpdateAthleteConsent = () => {
    updateSingleAthleteConsent({
      athlete_id: athleteId,
      consentable_type: CONSENTABLE_TYPE.Organisation,
      consenting_to: CONSENTING_TO.injury_surveillance_export,
      updated_from: date,
    })
      .unwrap()
      .then(() => {
        dispatch(
          add({
            id: 'update-athlete-consent-success',
            title: t('Consent Updated'),
            status: 'SUCCESS',
          })
        );
      })
      .catch((error) => {
        dispatch(
          add({
            id: 'update-athlete-consent-error',
            title: error.error[0],
            status: 'ERROR',
          })
        );
      });
    setDateRange([null, null]);
    handleClosePopover();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'grid-actions-popover' : undefined;

  return (
    <div>
      <IconButton onClick={handleOpenPopover}>
        <KitmanIcon name={KITMAN_ICON_NAMES.MoreVert} />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: '200px',
            padding: '6px',
            '.dateSelection__button': {
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
            },
          },
        }}
      >
        <DateSelection
          t={t}
          onDateSelection={setDateRange}
          date={dateRange}
          onCancel={handleCancelDateRangeSelection}
          onSave={handleSaveAthleteConsent}
          isDateRange
        >
          <span>{t('New consent range')}</span>
        </DateSelection>
        {consentStatus === CONSENT_STATUS.Consented && (
          <DateSelection
            t={t}
            onDateSelection={setDate}
            date={date}
            onCancel={handleCancelDateSelection}
            onSave={handleUpdateAthleteConsent}
          >
            <span>{t('Revoke')}</span>
          </DateSelection>
        )}
      </Popover>
    </div>
  );
};

export const ActionsCellTranslated: ComponentType<Props> =
  withNamespaces()(ActionsCell);
export default ActionsCell;
