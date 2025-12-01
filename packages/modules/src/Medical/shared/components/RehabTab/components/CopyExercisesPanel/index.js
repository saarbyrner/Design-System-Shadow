// @flow
import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment-timezone';
import type Moment from 'moment';
import { withNamespaces } from 'react-i18next';
import {
  AppStatus,
  DatePicker,
  ExpandingPanel,
  Select,
  TextButton,
  ToggleSwitch,
  RadioList,
} from '@kitman/components';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import { copyRehabSessionExercises } from '@kitman/services';
import type { SessionExerciseCopyData } from '@kitman/services/src/services/rehab/copyRehabSessionExercises';
import type { SelectOption as Option } from '@kitman/components/src/types';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useCopyExercisesForm from './hooks/useCopyExercisesForm';
import useEnrichedAthletesIssues from '../../../../hooks/useEnrichedAthletesIssues';
import type { RequestStatus, IssueType } from '../../../../types';
import style from './style';
import { useGetSquadAthletesQuery } from '../../../../redux/services/medical';
import { useTransferRecord } from '../../../../contexts/TransferRecordContext';
import { useRehabDispatch } from '../../RehabContext';

export type Props = {
  onClose: Function,
  isOpen: boolean,
  inMaintenance: boolean,
  isAthleteSelectable: boolean,
  athleteId?: ?number, // The athlete we are copying from
  issueOccurrenceId: ?number,
  issueType: ?IssueType,
  selectedExercises: Array<number>,
  onCopyComplete?: Function,
  addToastMessage: Function,
  getLinkValueForRedirect: Function,
  isRehabCopyAutomaticallyRedirectEnabled: boolean, // Setting to enable the automatically redirect after the user copy rehab exercises to a certain date instead of just showing a toaster
};

const CopyExercisesPanel = (props: I18nProps<Props>) => {
  const { dispatch: rehabDispatch } = useRehabDispatch();

  const transferRecord = useTransferRecord();

  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [requestIssuesStatus, setRequestIssuesStatus] =
    useState<RequestStatus>(null);
  const [isValidationCheckAllowed, setIsValidationCheckAllowed] =
    useState(false);
  const { formState, dispatch } = useCopyExercisesForm();

  const { enrichedAthleteIssues, fetchAthleteIssues } =
    useEnrichedAthletesIssues({
      athleteId: props.athleteId,
      useOccurrenceId: true,
      detailedIssue: false,
      customIssueFilter: null,
      includeOccurrenceType: false,
      includeIssueHook: false,
      includeGroupedHook: false,
    });
  const {
    data: squadAthletes = { squads: [] },
    error: squadAthletesError,
    isLoading: isSquadAthletesLoading,
  } = useGetSquadAthletesQuery(
    { athleteList: true }, // Can use minimal athlete data
    { skip: !props.isOpen }
  );
  const [copyTypeValue, setCopyTypeValue] = useState(
    props.inMaintenance ? 'maintenance' : 'rehab'
  );

  const isCopyMaintenance = copyTypeValue === 'maintenance';

  const showPlayerMovementDatePicker = () => {
    return window.featureFlags['player-movement-aware-datepicker'];
  };

  const minDate = transferRecord?.joined_at
    ? moment(transferRecord.joined_at).add(1, 'days').startOf('day')
    : undefined;

  const maxDate = transferRecord?.left_at
    ? moment(transferRecord.left_at).endOf('day')
    : undefined;

  const getInitialDataRequestStatus = () => {
    if (squadAthletesError) {
      return 'FAILURE';
    }
    if (isSquadAthletesLoading) {
      return 'PENDING';
    }
    return 'SUCCESS';
  };
  const athleteOptions: Array<Option> = squadAthletes.squads.map((squad) => ({
    label: squad.name,
    options: squad.athletes.map((athlete) => {
      return {
        label: athlete.fullname,
        value: athlete.id,
      };
    }),
  }));

  const initialDataRequestStatus = getInitialDataRequestStatus();

  useEffect(() => {
    if (props.isOpen && props.athleteId != null) {
      dispatch({
        type: 'SET_ATHLETE_AND_ISSUE_DETAILS',
        athleteId: props.athleteId,
        selectedIssueType: props.issueType,
        selectedIssueId: props.issueOccurrenceId,
      });
    }

    if (!props.isOpen) {
      setIsValidationCheckAllowed(false);
      dispatch({ type: 'CLEAR_FORM' });
    }
  }, [
    dispatch,
    props.athleteId,
    props.isOpen,
    props.issueOccurrenceId,
    props.issueType,
  ]);

  const getErrorMessage = (xhr) => {
    let message;
    if (xhr.status === 403 || xhr.statusText === 'Forbidden') {
      if (xhr.responseJSON?.errors) {
        if (typeof xhr.responseJSON?.errors === 'string') {
          message = xhr.responseJSON.errors;
        } else if (
          Array.isArray(xhr.responseJSON.errors) &&
          xhr.responseJSON.errors.length > 0
        )
          message = xhr.responseJSON.errors[0];
      }
      message =
        message ||
        xhr.responseJSON?.message ||
        props.t('Organisation does not have access to this record');
    }
    return message;
  };

  const onAthleteChange = (athleteId: number) => {
    dispatch({
      type: 'SET_ATHLETE_AND_ISSUE_DETAILS',
      athleteId,
      selectedIssueType: null,
      selectedIssueId: null,
    });
    setRequestIssuesStatus('PENDING');

    fetchAthleteIssues({
      selectedAthleteId: athleteId,
      useOccurrenceIdValue: true,
      includeDetailedIssue: false,
      issueFilter: null,
      includeIssue: false,
      includeGrouped: false,
    })
      .then(() => setRequestIssuesStatus('SUCCESS'))
      .catch(() => {
        setRequestIssuesStatus('FAILURE');
      });
  };

  const findInjuryName = () => {
    const injuryNameIndex = enrichedAthleteIssues.findIndex((injury) =>
      injury.options.find(
        (option) =>
          option.value ===
          `${formState.issue_type || ''}_${formState.issue_id || ''}`
      )
    );
    return enrichedAthleteIssues[injuryNameIndex].options.find(
      (option) =>
        option.value ===
        `${formState.issue_type || ''}_${formState.issue_id || ''}`
    );
  };

  const performCopy = async () => {
    const requiredFields = [formState.athlete_id, formState.session_dates];
    // we don't want to validate for injuries when the user copy from rehab to maintenance, only rehab to rehab should have required fields
    if (!isCopyMaintenance) {
      requiredFields.push(formState.issue_id, formState.issue_type);
      setIsValidationCheckAllowed(true);
    }
    const allRequiredFieldsAreValid =
      requiredFields.every((item) => item != null && item !== '') &&
      formState.session_dates.length > 0;

    if (!allRequiredFieldsAreValid) {
      return;
    }

    if (formState.athlete_id == null) {
      return;
    }

    let issueType;
    let issueId;

    if (window.featureFlags['rehab-to-maintenance']) {
      issueType =
        (props.inMaintenance && !formState.copy_maintenance) ||
        (!props.inMaintenance && !formState.copy_maintenance)
          ? formState.issue_type
          : undefined;

      issueId =
        (props.inMaintenance && !formState.copy_maintenance) ||
        (!props.inMaintenance && !formState.copy_maintenance)
          ? formState.issue_id
          : undefined;
    } else {
      issueType = !props.inMaintenance ? formState.issue_type : undefined;
      issueId = !props.inMaintenance ? formState.issue_id : undefined;
    }

    const data: SessionExerciseCopyData = {
      athlete_id: formState.athlete_id,
      exercise_instances_ids: props.selectedExercises,
      destination_session_dates: formState.session_dates,
      issue_type: issueType,
      issue_id: issueId,
      copy_comments: formState.copy_comments,
      compressed: !formState.copy_uncompressed,
      maintenance: formState.copy_maintenance,
    };

    setRequestStatus('PENDING');
    copyRehabSessionExercises(data).then(
      () => {
        setRequestStatus('SUCCESS');
        let injuryName;

        if (window.featureFlags['rehab-to-maintenance']) {
          if (
            (!props.inMaintenance && !isCopyMaintenance) ||
            (props.inMaintenance && !isCopyMaintenance)
          ) {
            injuryName = findInjuryName();
          }
        } else if (!props.inMaintenance) {
          injuryName = findInjuryName();
        }

        if (formState.athlete_id != null) {
          let athleteName;
          if (athleteOptions.length > 0) {
            const athleteSquadIndex = athleteOptions.findIndex((squad) =>
              squad.options
                ? squad.options.find(
                    (ath) => ath.value === formState.athlete_id
                  )
                : null
            );
            athleteName = athleteOptions[athleteSquadIndex].options
              ? athleteOptions[athleteSquadIndex].options?.find(
                  (ath) => ath.value === formState.athlete_id
                )
              : '';
          }

          // eslint-disable-next-line no-unused-vars
          const sharedArguments = (athlete, injury, inMaintenance) => {
            const athleteLabel = athleteName ? athleteName.label : '';
            const injuryLabel = injuryName ? injuryName.label : '';
            let copyType;
            if (window.featureFlags['rehab-to-maintenance']) {
              copyType = !isCopyMaintenance ? 'rehabCopy' : 'maintenanceCopy';
            } else {
              copyType = props.inMaintenance ? 'maintenanceCopy' : 'rehabCopy';
            }
            return [athleteLabel, injuryLabel, copyType];
          };

          const [athleteLabel, injuryLabel, copyType] = sharedArguments(
            athleteName,
            injuryName,
            props.inMaintenance
          );

          if (!props.isRehabCopyAutomaticallyRedirectEnabled) {
            props.addToastMessage(athleteLabel, injuryLabel, data, copyType);
          } else {
            const linkValue = props.getLinkValueForRedirect(
              athleteLabel,
              injuryLabel,
              data,
              copyType
            );
            window.location.href = linkValue;
          }
          props.onCopyComplete?.();
          props.onClose();
        }
      },
      (xhr) => {
        setErrorMessage(getErrorMessage(xhr));
        rehabDispatch({
          type: 'UPDATE_ACTION_STATUS',
          actionStatus: 'FAILURE',
          actionType: 'COPY_EXERCISE',
        });
      }
    );
  };

  const associatedInujuriesDropdown = (
    <div data-testid="CopyExercisePanel|AssociatedInjuries">
      <Select
        label={props.t('Injury / illness')}
        onChange={(id) => {
          const [selectedIssueType, selectedIssueId] = id.split('_');
          dispatch({
            type: 'SET_SELECTED_ISSUE_DETAILS',
            selectedIssueType,
            selectedIssueId: Number.parseInt(selectedIssueId, 10),
          });
        }}
        value={
          formState.issue_type != null && formState.issue_id != null
            ? `${formState.issue_type}_${formState.issue_id}`
            : null
        }
        options={enrichedAthleteIssues}
        isMulti={false}
        isDisabled={
          formState.athlete_id == null ||
          requestStatus === 'PENDING' ||
          requestIssuesStatus === 'PENDING'
        }
        invalid={
          isValidationCheckAllowed &&
          (formState.issue_id == null || formState.issue_type == null)
        }
      />
    </div>
  );

  const renderAssociatedInjuries = () => {
    if (
      (window.featureFlags['rehab-to-maintenance'] &&
        ((!props.inMaintenance && !isCopyMaintenance) ||
          (props.inMaintenance && !isCopyMaintenance))) ||
      (!window.featureFlags['rehab-to-maintenance'] && !props.inMaintenance)
    ) {
      return associatedInujuriesDropdown;
    }
    return null;
  };

  const renderDatePickerNew = () => {
    const datesArray =
      formState.session_dates?.map((date) =>
        moment(date, dateTransferFormat)
      ) || [];

    return (
      <MovementAwareDatePicker
        athleteId={props.athleteId || undefined}
        value={datesArray}
        onChange={(datesValue: Array<Moment>) => {
          let sessionDates = [];
          sessionDates = datesValue.map((date) =>
            moment(date).format(dateTransferFormat)
          );
          dispatch({
            type: 'SET_SESSION_DATES',
            sessionDates,
          });
        }}
        name="rehabCopyDates"
        inputLabel={props.t('Date(s)')}
        disabled={requestStatus === 'PENDING'}
        width="387px"
        multiDate
        kitmanDesignSystem
      />
    );
  };

  const getInnerContent = () => {
    return (
      <div css={style.scrollingContainer}>
        <div css={style.content}>
          <div data-testid="CopyExercisePanel|AthleteSelector">
            <Select
              label={props.t('Player')}
              onChange={(id) => onAthleteChange(id)}
              value={formState.athlete_id}
              options={athleteOptions}
              isDisabled={
                (!props.isAthleteSelectable && !!props.athleteId) ||
                requestStatus === 'PENDING'
              }
              invalid={isValidationCheckAllowed && !formState.athlete_id}
            />
          </div>
          <div data-testid="CopyExercisePanel|SessionDate">
            {showPlayerMovementDatePicker() ? (
              renderDatePickerNew()
            ) : (
              <DatePicker
                label={props.t('Date(s)')}
                onDateChange={(datesValue: ?Array<Date>) => {
                  const sessionDates = datesValue
                    ? datesValue.map((date) =>
                        moment(date).format(dateTransferFormat)
                      )
                    : [];

                  dispatch({
                    type: 'SET_SESSION_DATES',
                    sessionDates,
                  });
                }}
                value={formState.session_dates}
                invalid={isValidationCheckAllowed && !formState.session_dates}
                disabled={requestStatus === 'PENDING'}
                // Limit dates only if copying from the active athlete to self
                minDate={
                  formState.athlete_id === props.athleteId && minDate
                    ? minDate
                    : undefined
                }
                maxDate={
                  formState.athlete_id === props.athleteId && maxDate
                    ? maxDate
                    : undefined
                }
                kitmanDesignSystem
                todayHighlight
                multiDate
                clearBtn
                autoClose={false}
              />
            )}
          </div>

          {window.featureFlags['rehab-to-maintenance'] && (
            <div data-testid="CopyExercisePanel|CopyToWrapper">
              <RadioList
                radioName="copy_type"
                options={[
                  {
                    name: props.t('Rehab'),
                    value: 'rehab',
                  },
                  {
                    name: props.t('Maintenance'),
                    value: 'maintenance',
                  },
                ]}
                change={(value) => {
                  dispatch({
                    type: 'SET_COPY_MAINTENANCE',
                    maintenance: value === 'maintenance',
                  });
                  setCopyTypeValue(value);
                }}
                value={copyTypeValue}
                direction="horizontal"
                kitmanDesignSystem
              />
            </div>
          )}
          {renderAssociatedInjuries()}

          <div data-testid="CopyExercisePanel|ToggleCopy">
            <ToggleSwitch
              label={props.t('Copy comments')}
              isSwitchedOn={formState.copy_comments}
              toggle={() => {
                dispatch({
                  type: 'SET_COPY_COMMENTS',
                  copy: !formState.copy_comments,
                });
              }}
              kitmanDesignSystem
              isDisabled={requestIssuesStatus === 'PENDING'}
            />
          </div>

          <div data-testid="CopyExercisePanel|UncompressedCopy">
            <RadioList
              radioName="uncompressed_radio"
              label={props.t('Rehab structure')}
              options={[
                {
                  name: props.t('Merge to single day'),
                  value: 'compressed',
                },
                {
                  name: props.t('Retain structure'),
                  value: 'uncompressed',
                },
              ]}
              change={(value) => {
                dispatch({
                  type: 'SET_COPY_UNCOMPRESSED',
                  uncompressed: value === 'uncompressed',
                });
              }}
              value={
                formState.copy_uncompressed ? 'uncompressed' : 'compressed'
              }
              direction="vertical"
              kitmanDesignSystem
            />
          </div>
        </div>
      </div>
    );
  };

  return ReactDOM.createPortal(
    <div css={style.copyExercisePanel} data-testid="Rehab|CopyExercisePanel">
      <ExpandingPanel
        width={436}
        isOpen={props.isOpen}
        onClose={props.onClose}
        title={props.t('Copy to')}
      >
        {getInnerContent()}
        <div css={style.actions} data-testid="CopyExercisePanel|Actions">
          <TextButton
            onClick={performCopy}
            text={props.t('Save')}
            type="primary"
            kitmanDesignSystem
            isDisabled={
              requestStatus === 'PENDING' || formState.session_dates.length < 1
            }
          />
        </div>
        {(requestStatus === 'FAILURE' ||
          requestIssuesStatus === 'FAILURE' ||
          initialDataRequestStatus === 'FAILURE') && (
          <AppStatus status="error" message={errorMessage} />
        )}
      </ExpandingPanel>
    </div>,
    document.getElementById('issueMedicalProfile-Slideout')
  );
};

export const CopyExercisesPanelTranslated: ComponentType<Props> =
  withNamespaces()(CopyExercisesPanel);
export default CopyExercisesPanel;
