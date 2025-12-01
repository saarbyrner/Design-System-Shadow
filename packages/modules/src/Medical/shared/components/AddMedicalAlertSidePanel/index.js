// @flow
import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import {
  AppStatus,
  DatePicker,
  InputTextField,
  Select,
  SlidingPanelResponsive,
  TextButton,
  TooltipMenu,
  SegmentedControl,
} from '@kitman/components';
import type { SelectOption as Option } from '@kitman/components/src/types';
import { saveMedicalAlert, updateMedicalAlert } from '@kitman/services';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { RequestStatus } from '@kitman/common/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { AthleteMedicalAlertDataResponse } from '../../types/medical';
import useAthleteIssues from '../../hooks/useEnrichedAthletesIssues';
import type { MedicalAlert } from '../../hooks/useMedicalAlerts';
import { getRestricVisibilityValue } from '../../utils';
import SeverityLabel from '../AddAllergySidePanel/components/SeverityLabel';
import style from './styles';
import useMedicalAlertForm from './hooks/useMedicalAlertForm';
import AthleteConstraints from '../AthleteConstraints';

type Props = {
  isOpen: boolean,
  isAthleteSelectable: boolean,
  initialDataRequestStatus: RequestStatus,
  squadAthletes: Array<Option>,
  medicalAlerts: Array<MedicalAlert>,
  selectedMedicalAlert: AthleteMedicalAlertDataResponse | null,
  athleteId?: ?number,
  enableReloadData?: (enabled: boolean) => void,
  onSaveMedicalAlert?: () => void,
  onSaveMedicalAlertStart: Function,
  onSaveMedicalAlertSuccess: Function,
  onClose: Function,
};

const AddMedicalAlertSidePanel = (props: I18nProps<Props>) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [requestIssuesStatus, setRequestIssuesStatus] =
    useState<RequestStatus>(null);
  const [isValidationCheckAllowed, setIsValidationCheckAllowed] =
    useState(false);
  const [showDate, setShowDate] = useState<boolean>(false);
  const { permissions } = usePermissions();

  const { fetchAthleteIssues } = useAthleteIssues({
    athleteId: props.isOpen ? props.athleteId : null,
  });

  const { formState, dispatch } = useMedicalAlertForm();

  const populateMedicalAlertToEdit = (selectedAlert) => {
    dispatch({
      type: 'AUTOPOPULATE_SELECTED_ALERT',
      athlete_id: selectedAlert.athlete_id,
      restricted_to_doc: selectedAlert.restricted_to_doc,
      restricted_to_psych: selectedAlert.restricted_to_psych,
      medical_alert_id: selectedAlert.medical_alert?.id,
      alert_title: selectedAlert.alert_title,
      severity: selectedAlert.severity,
    });
    if (selectedAlert.diagnosed_on) {
      setShowDate(true);
      dispatch({
        type: 'SET_ALERT_DATE',
        alert_date: moment(selectedAlert.diagnosed_on).format(),
      });
    }
  };

  useEffect(() => {
    if (props.athleteId) {
      dispatch({ type: 'SET_ATHLETE_ID', athleteId: props.athleteId });
    }
    // clear form on close
    if (!props.isOpen) {
      setIsValidationCheckAllowed(false);
      dispatch({ type: 'CLEAR_FORM' });
    }
    // if editing, populate form state
    if (props.isOpen && props.selectedMedicalAlert) {
      populateMedicalAlertToEdit(props.selectedMedicalAlert);
    }
  }, [props.athleteId, props.isOpen]);

  const onAthleteChange = (athleteId: number) => {
    dispatch({ type: 'SET_ATHLETE_ID', athleteId });
    setRequestIssuesStatus('PENDING');

    fetchAthleteIssues({
      selectedAthleteId: athleteId,
      useOccurrenceIdValue: false,
      includeDetailedIssue: false,
      issueFilter: null,
      includeIssue: true,
      includeGrouped: true,
    })
      .then(() => setRequestIssuesStatus('SUCCESS'))
      .catch(() => setRequestIssuesStatus('FAILURE'));
  };

  // Form Alert field title based on feature flag
  const getAlertTitle = () => {
    return window.featureFlags['medical-alerts-side-panel'] &&
      permissions.medical.alerts.canCreate
      ? props.t('Alert title')
      : props.t('Name of Alert');
  };

  const getAlertNameValue = () => {
    return permissions.medical.alerts.canCreate &&
      formState?.custom_alert_name !== null
      ? formState?.custom_alert_name
      : formState?.alert_title;
  };

  const onSaveMedicalAlert = () => {
    const medicalAlertData = {
      athlete_id: formState.athlete_id,
      medical_alert_id: formState.medical_alert_id,
      alert_title: formState?.custom_alert_name || formState.alert_title,
      severity: formState.severity,
      diagnosed_on: formState?.alert_date,
      restricted_to_doc: formState?.restricted_to_doc,
      restricted_to_psych: formState?.restricted_to_psych,
    };

    setIsValidationCheckAllowed(true);

    const requiredFields = [
      formState.athlete_id,
      formState.medical_alert_id,
      formState.alert_title,
      formState.severity,
    ];

    const allRequiredFieldsAreValid = requiredFields.every((item) => item);

    if (!allRequiredFieldsAreValid) {
      return;
    }

    props.onSaveMedicalAlertStart(formState.alert_title);

    const medicalAlertEndpoint = props.selectedMedicalAlert
      ? updateMedicalAlert(props.selectedMedicalAlert.id, medicalAlertData)
      : saveMedicalAlert(medicalAlertData);

    medicalAlertEndpoint
      .then(() => {
        setRequestStatus('SUCCESS');
        props.onSaveMedicalAlertSuccess(formState.alert_title);
        props.enableReloadData?.(true);
        props.onSaveMedicalAlert?.();
        props.onClose();
      })
      .catch(() => {
        setRequestStatus('FAILURE');
      });
  };

  const medicalAlertChange = (selectedValue: number) => {
    const alert = props.medicalAlerts.find(
      (medicalAlert) => medicalAlert.value === selectedValue
    );

    if (alert) {
      dispatch({
        type: 'SET_MEDICAL_ALERT_ID',
        medical_alert_id: alert.value,
      });
      dispatch({
        type: 'SET_ALERT_TITLE',
        alert_title: alert.label,
      });
      dispatch({
        type: 'SET_CUSTOM_ALERT_NAME',
        custom_alert_name: alert.label,
      });
    }
  };

  const didAnyRequestFail = [
    requestStatus,
    requestIssuesStatus,
    props.initialDataRequestStatus,
  ].some((status) => status === 'FAILURE');

  const renderPlayerSelector = () => {
    const fromAthlete = !props.isAthleteSelectable && !!props.athleteId;
    const fromEdit = !props.isAthleteSelectable && props.selectedMedicalAlert;

    return (
      <AthleteConstraints athleteId={formState.athlete_id}>
        {({ organisationStatus, athleteSelector, isLoading }) => (
          <div
            css={style.player}
            data-testid="AddMedicalAlertSidePanel|AthleteSelect"
          >
            <Select
              label={props.t('Athlete')}
              onChange={(id) => onAthleteChange(id)}
              value={formState.athlete_id}
              options={
                organisationStatus === 'PAST_ATHLETE'
                  ? athleteSelector
                  : props.squadAthletes
              }
              isDisabled={
                isLoading ||
                fromAthlete ||
                fromEdit ||
                requestStatus === 'PENDING'
              }
              invalid={isValidationCheckAllowed && !formState.athlete_id}
            />
          </div>
        )}
      </AthleteConstraints>
    );
  };

  return (
    <div css={style.sidePanel} data-testid="AddMedicalAlertSidePanel">
      <SlidingPanelResponsive
        isOpen={props.isOpen}
        title={
          props.selectedMedicalAlert
            ? props.t('Edit medical alert')
            : props.t('Add medical alert')
        }
        onClose={() => props.onClose()}
        width={659}
      >
        <div css={style.content}>
          {renderPlayerSelector()}

          {permissions.medical.alerts.canCreate && (
            <>
              <div css={style.alertSelect}>
                <h4 css={style.heading}>{props.t('Medical alert details')}</h4>
              </div>
              <div
                css={style.asyncSelect}
                data-testid="AddMedicalAlertSidePanel|AlertSelect"
              >
                <Select
                  label={props.t('Medical condition')}
                  onChange={(medicalAlert) => medicalAlertChange(medicalAlert)}
                  value={formState?.medical_alert_id}
                  options={props.medicalAlerts}
                  isDisabled={
                    props.selectedMedicalAlert || requestStatus === 'PENDING'
                  }
                  invalid={
                    isValidationCheckAllowed && !formState.medical_alert_id
                  }
                />
              </div>

              <div
                css={style.custom_alert_name}
                data-testid="AddMedicalAlertSidePanel|CustomAlertName"
              >
                <InputTextField
                  name="custom_alert_name"
                  label={getAlertTitle()}
                  kitmanDesignSystem
                  value={getAlertNameValue() || ''}
                  onChange={(e) => {
                    dispatch({
                      type: 'SET_CUSTOM_ALERT_NAME',
                      custom_alert_name: e.target.value,
                    });
                  }}
                />
              </div>
              <div
                css={style.severity_selector}
                data-testid="AddMedicalAlertSidePanel|Severity"
              >
                <SegmentedControl
                  buttons={[
                    { name: props.t('Severe'), value: 'severe' },
                    { name: props.t('Moderate'), value: 'moderate' },
                    { name: props.t('Mild'), value: 'mild' },
                    { name: props.t('Not Specified'), value: 'none' },
                  ]}
                  label={props.t('Severity')}
                  maxWidth={400}
                  width="inline"
                  onClickButton={(severity) => {
                    dispatch({
                      type: 'SET_SEVERITY',
                      severity,
                    });
                  }}
                  selectedButton={formState.severity}
                  invalid={isValidationCheckAllowed && !formState.severity}
                  color={colors.grey_200}
                  isSeparated
                />

                {formState?.severity && formState.alert_title && (
                  <div css={style.severity_label}>
                    <SeverityLabel
                      showPreviewLabel
                      label={
                        formState.custom_alert_name || formState.alert_title
                      }
                      severity={formState?.severity}
                      t={props.t}
                    />
                  </div>
                )}
              </div>
            </>
          )}

          <div
            css={style.visibility}
            data-testid="AddMedicalAlertSidePanel|Visibility"
          >
            <Select
              label={props.t('Visibility')}
              onChange={(visibilityId) =>
                dispatch({ type: 'SET_VISIBILITY', visibilityId })
              }
              options={[
                {
                  label: props.t('Default visibility'),
                  value: 'DEFAULT',
                },
                { label: props.t('Doctors'), value: 'DOCTORS' },
                { label: props.t('Psych team'), value: 'PSYCH_TEAM' },
              ]}
              value={getRestricVisibilityValue(
                formState.restricted_to_doc,
                formState.restricted_to_psych
              )}
              isDisabled={
                requestStatus === 'PENDING' ||
                props.initialDataRequestStatus === 'FAILURE'
              }
            />
          </div>

          {permissions.medical.alerts.canCreate && (
            <div
              css={style.extraDateOption}
              data-testid="AddMedicalAlertSidePanel|OptionalDate"
            >
              <>
                {!showDate && (
                  <TooltipMenu
                    tooltipTriggerElement={
                      <TextButton
                        text={props.t('Add more detail')}
                        type="secondary"
                        iconAfter="icon-chevron-down"
                        kitmanDesignSystem
                      />
                    }
                    menuItems={[
                      {
                        description: props.t('Diagnosed on'),
                        onClick: () => setShowDate(!showDate),
                      },
                    ]}
                    placement="bottom-start"
                    appendToParent
                    kitmanDesignSystem
                    disabled={requestStatus === 'PENDING'}
                  />
                )}
                {showDate && (
                  <>
                    <div css={style.dateHeading}>
                      <h4 css={[style.heading, style.noBorder]}>
                        {props.t('Diagnosed on')}
                      </h4>
                      <TextButton
                        onClick={() => {
                          setShowDate(!showDate);
                          dispatch({
                            type: 'SET_ALERT_DATE',
                            alert_date: '',
                          });
                        }}
                        iconBefore="icon-bin"
                        type="subtle"
                        kitmanDesignSystem
                      />
                    </div>
                    <div css={style.datePicker}>
                      <DatePicker
                        label={props.t('Date')}
                        onDateChange={(date) => {
                          dispatch({
                            type: 'SET_ALERT_DATE',
                            alert_date: moment(date).format(),
                          });
                        }}
                        value={
                          formState.alert_date
                            ? moment(formState.alert_date)
                            : null
                        }
                        maxDate={moment()}
                        disabled={requestStatus === 'PENDING'}
                        kitmanDesignSystem
                      />
                    </div>
                  </>
                )}
              </>
            </div>
          )}
        </div>
        <div css={style.actions}>
          <TextButton
            onClick={onSaveMedicalAlert}
            text={props.t('Save')}
            type="primary"
            kitmanDesignSystem
          />
        </div>
        {didAnyRequestFail && <AppStatus status="error" />}
      </SlidingPanelResponsive>
    </div>
  );
};

export const AddMedicalAlertSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(AddMedicalAlertSidePanel);
export default AddMedicalAlertSidePanel;
