// @flow
import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import {
  AppStatus,
  SlidingPanelResponsive,
  Select,
  InputTextField,
  TextButton,
  DatePicker,
  TooltipMenu,
  FileUploadArea,
} from '@kitman/components';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import type { SelectOption as Option } from '@kitman/components/src/types';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import {
  saveNote,
  saveAttachmentLegacy as saveAttachment,
} from '@kitman/services';
import { NOTE_TYPE } from '@kitman/modules/src/Medical/shared/types/medical/MedicalNote';
import { checkInvalidFileTitles } from '@kitman/common/src/utils/fileHelper';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useVaccinationForm from './hooks/useVaccinationForm';
import useEnrichedAthletesIssues from '../../hooks/useEnrichedAthletesIssues';

import {
  getRestricVisibilityValue,
  getIssueIds,
  getFormattedIssueIds,
  emptyHTMLeditorContent,
} from '../../utils';

import type { RequestStatus } from '../../types';
import style from '../styles/forms';
import useMedicalHistory from '../../hooks/useMedicalHistory';
import AthleteConstraints from '../AthleteConstraints';

type Props = {
  isOpen: boolean,
  isAthleteSelectable: boolean,
  squadAthletes: Array<Option>,
  athleteId?: ?number,
  onFileUploadStart: Function,
  onFileUploadSuccess: Function,
  onFileUploadFailure: Function,
  initialDataRequestStatus: RequestStatus,
  onClose: Function,
};

const AddVaccinationSidePanel = (props: I18nProps<Props>) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [requestIssuesStatus, setRequestIssuesStatus] =
    useState<RequestStatus>(null);

  const [isValidationCheckAllowed, setIsValidationCheckAllowed] =
    useState(false);

  const { formState, dispatch } = useVaccinationForm();
  const { enrichedAthleteIssues, fetchAthleteIssues } =
    useEnrichedAthletesIssues({
      athleteId: props.isOpen ? props.athleteId : null,
    });
  const { fetchMedicalHistory } = useMedicalHistory({
    athleteId: props.athleteId,
  });

  const showPlayerMovementDatePicker =
    window.featureFlags['player-movement-aware-datepicker'];

  useEffect(() => {
    if (props.athleteId) {
      dispatch({
        type: 'SET_ATHLETE_ID',
        athleteId: props.athleteId,
      });
    }

    if (!props.isOpen) {
      setIsValidationCheckAllowed(false);
      dispatch({ type: 'CLEAR_FORM' });
    }
    // Disabling this rule. Adding fetchAthleteData to the
    // dependency array causes an infinite call stack
  }, [dispatch, props.athleteId, props.isOpen]);

  const getAssociatedInjuryIllnessValues = () => {
    return getFormattedIssueIds(
      formState.injury_occurrence_ids,
      formState.illness_occurrence_ids,
      formState.chronic_issue_ids
    );
  };

  const onAthleteChange = (athleteId: number) => {
    dispatch({
      type: 'SET_ATHLETE_ID',
      athleteId,
    });
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
      .catch(() => {
        setRequestIssuesStatus('FAILURE');
      });
  };

  const saveVaccinationRecord = (attachmentIds) => {
    const newVaccinationRecord = {
      attachment_ids: attachmentIds,
      note_date: formState.issue_date,
      note_type: NOTE_TYPE.MEDICAL_NOTE_ID,
      medical_type: 'Vaccination',
      medical_name: formState.vaccination_name,
      injury_ids: formState.injury_occurrence_ids,
      illness_ids: formState.illness_occurrence_ids,
      chronic_issue_ids: formState.chronic_issue_ids,
      note: 'Vaccination',
      restricted: formState.restricted_to_doc,
      psych_only: formState.restricted_to_psych,
      expiration_date: formState.expiration_date,
      batch_number: formState.batch_number,
      renewal_date: formState.renewal_date,
    };
    saveNote(
      // $FlowFixMe athleteId will never be null at this stage
      formState.athlete_id,
      newVaccinationRecord
    )
      .then(() => {
        setRequestStatus('SUCCESS');
        props.onClose();
        fetchMedicalHistory();
      })
      .catch(() => {
        setRequestStatus('FAILURE');
      });
  };

  const uploadAttachmentsAndSave = async (queuedAttachments) => {
    setRequestStatus('PENDING');
    const performUpload = (attachment) => {
      return new Promise((resolve, reject) => {
        const file = attachment.file;
        const fileName = file.name;
        const fileSize = fileSizeLabel(attachment.fileSize, true);
        const fileId = attachment.id;
        props.onFileUploadStart(fileName, fileSize, fileId);
        saveAttachment(file, attachment.fileTitle)
          .then((response) => {
            resolve(response.attachment_id);
            props.onFileUploadSuccess(fileId);
          })
          .catch(() => {
            reject();
            props.onFileUploadFailure(fileId);
          });
      });
    };

    // Unfortunately, this is legacy flow only. We need to wait for the attachments
    // to upload, get the created resource IDs and add this to the mew record
    // There are plans to introduce a new API for vaccinations in the future
    await Promise.all(queuedAttachments.map(performUpload)).then(
      (attachmentIds) => {
        saveVaccinationRecord(attachmentIds);
      }
    );
  };

  const onSave = async () => {
    setIsValidationCheckAllowed(true);

    const requiredFields = [
      formState.athlete_id,
      formState.vaccination_name,
      formState.issue_date,
      formState.renewal_date,
      formState.batch_number,
      formState.expiration_date,
    ];

    const allRequiredFieldsAreValid = requiredFields.every(
      (item) => item && item !== emptyHTMLeditorContent
    );

    if (
      !allRequiredFieldsAreValid ||
      (formState.queuedAttachmentTypes.includes('FILE') &&
        checkInvalidFileTitles(formState.queuedAttachments))
    ) {
      return;
    }

    await uploadAttachmentsAndSave(formState.queuedAttachments);
  };

  const renderAthleteSelector = ({
    isLoading,
    organisationStatus,
    athleteSelector,
  }) => {
    return (
      <div
        css={[style.row, style.halfRow]}
        data-testid="AddVaccinationSidePanel|AthleteSelector"
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
            (!props.isAthleteSelectable && !!props.athleteId) ||
            requestStatus === 'PENDING'
          }
          invalid={isValidationCheckAllowed && !formState.athlete_id}
        />
      </div>
    );
  };

  const renderRenewalDate = ({ lastActivePeriod, isLoading }) => {
    return (
      <div data-testid="AddVaccinationSidePanel|RenewalDate">
        <DatePicker
          label={props.t('Renewal date')}
          onDateChange={(date) => {
            dispatch({
              type: 'SET_VACCINATION_RENEWAL_DATE',
              renewal_date: moment(date).format(dateTransferFormat),
            });
          }}
          value={formState.renewal_date ? moment(formState.renewal_date) : null}
          minDate={formState.issue_date || lastActivePeriod.start}
          maxDate={
            window.featureFlags['player-movement-entity-tue-vaccination'] &&
            lastActivePeriod.end
          }
          invalid={isValidationCheckAllowed && !formState.renewal_date}
          disabled={isLoading || requestStatus === 'PENDING'}
          kitmanDesignSystem
        />
      </div>
    );
  };

  const renderRenewalDateNew = ({ isLoading }) => {
    const minDate = formState.issue_date;
    return (
      <div data-testid="AddVaccinationSidePanel|RenewalDateNew">
        <MovementAwareDatePicker
          athleteId={formState.athlete_id ?? undefined}
          value={formState.renewal_date ? moment(formState.renewal_date) : null}
          onChange={(date) => {
            dispatch({
              type: 'SET_VACCINATION_RENEWAL_DATE',
              renewal_date: moment(date).format(dateTransferFormat),
            });
          }}
          name="renewalDate"
          inputLabel={props.t('Renewal date')}
          disabled={isLoading || requestStatus === 'PENDING'}
          isInvalid={isValidationCheckAllowed && !formState.renewal_date}
          minDate={minDate && moment(minDate)}
          kitmanDesignSystem
        />
      </div>
    );
  };

  const renderIssueDateSelector = ({ lastActivePeriod, isLoading }) => {
    return (
      <div data-testid="AddVaccinationSidePanel|IssueDate">
        <DatePicker
          label={props.t('Issue date')}
          onDateChange={(date) => {
            dispatch({
              type: 'SET_VACCINATION_ISSUE_DATE',
              issue_date: moment(date).format(dateTransferFormat),
            });
          }}
          value={formState.issue_date ? moment(formState.issue_date) : null}
          maxDate={lastActivePeriod.end}
          minDate={lastActivePeriod.start}
          invalid={isValidationCheckAllowed && !formState.issue_date}
          disabled={isLoading || requestStatus === 'PENDING'}
          kitmanDesignSystem
        />
      </div>
    );
  };

  const renderIssueDateSelectorNew = ({ isLoading }) => {
    return (
      <div data-testid="AddVaccinationSidePanel|IssueDateNew">
        <MovementAwareDatePicker
          athleteId={formState.athlete_id ?? undefined}
          value={formState.issue_date ? moment(formState.issue_date) : null}
          onChange={(date) => {
            dispatch({
              type: 'SET_VACCINATION_ISSUE_DATE',
              issue_date: moment(date).format(dateTransferFormat),
            });
          }}
          name="issueDateSelector"
          inputLabel={props.t('Issue date')}
          disabled={
            isLoading || requestStatus === 'PENDING' || !formState.athlete_id
          }
          isInvalid={isValidationCheckAllowed && !formState.issue_date}
          disableFuture
          kitmanDesignSystem
        />
      </div>
    );
  };

  const renderExpirationDate = ({ lastActivePeriod, isLoading }) => {
    return (
      <div data-testid="AddVaccinationSidePanel|ExpirationDate">
        <DatePicker
          label={props.t('Expiration date')}
          onDateChange={(date) => {
            dispatch({
              type: 'SET_VACCINATION_EXPIRATION_DATE',
              expiration_date: moment(date).format(dateTransferFormat),
            });
          }}
          value={
            formState.expiration_date ? moment(formState.expiration_date) : null
          }
          minDate={formState.issue_date || lastActivePeriod.start}
          maxDate={
            window.featureFlags['player-movement-entity-tue-vaccination'] &&
            lastActivePeriod.end
          }
          disabled={isLoading || requestStatus === 'PENDING'}
          invalid={isValidationCheckAllowed && !formState.expiration_date}
          kitmanDesignSystem
        />
      </div>
    );
  };

  const renderExpirationDateNew = ({ isLoading }) => {
    const minDate = formState.issue_date;
    return (
      <div data-testid="AddVaccinationSidePanel|IssueDateNew">
        <MovementAwareDatePicker
          athleteId={formState.athlete_id ?? undefined}
          value={
            formState.expiration_date ? moment(formState.expiration_date) : null
          }
          onChange={(date) => {
            dispatch({
              type: 'SET_VACCINATION_EXPIRATION_DATE',
              expiration_date: moment(date).format(dateTransferFormat),
            });
          }}
          name="expirationDateSelector"
          inputLabel={props.t('Expiration date')}
          disabled={isLoading || requestStatus === 'PENDING'}
          isInvalid={isValidationCheckAllowed && !formState.issue_date}
          minDate={minDate && moment(minDate)}
          kitmanDesignSystem
        />
      </div>
    );
  };

  return (
    <div>
      <AthleteConstraints athleteId={formState.athlete_id}>
        {({
          lastActivePeriod,
          isLoading,
          organisationStatus,
          athleteSelector,
        }) => (
          <div
            css={style.sidePanel}
            data-testid="AddVaccinationSidePanel|VaccinationContainer"
          >
            <SlidingPanelResponsive
              isOpen={props.isOpen}
              title={props.t('Add vaccination')}
              onClose={props.onClose}
              width={659}
            >
              <div css={style.section}>
                {renderAthleteSelector({
                  isLoading,
                  organisationStatus,
                  athleteSelector,
                })}

                <div
                  css={[style.row, style['row--dualFields']]}
                  data-testid="AddVaccinationSidePanel|VaccinationName"
                >
                  <InputTextField
                    label={props.t('Name of vaccination')}
                    value={formState.vaccination_name}
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_VACCINATION_NAME',
                        vaccination_name: e.target.value,
                      })
                    }
                    invalid={
                      isValidationCheckAllowed && !formState.vaccination_name
                    }
                    disabled={requestStatus === 'PENDING'}
                    kitmanDesignSystem
                  />
                </div>
                <div css={[style.row, style['row--dualFields']]}>
                  {showPlayerMovementDatePicker
                    ? renderIssueDateSelectorNew(isLoading)
                    : renderIssueDateSelector({ lastActivePeriod, isLoading })}
                  {showPlayerMovementDatePicker
                    ? renderRenewalDateNew(isLoading)
                    : renderRenewalDate({ lastActivePeriod, isLoading })}
                </div>

                <div css={[style.row, style['row--dualFields']]}>
                  <div data-testid="AddVaccinationSidePanel|BatchNumber">
                    <InputTextField
                      label={props.t('Batch number')}
                      value={formState.batch_number}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_VACCINATION_BATCH_NUMBER',
                          batch_number: e.target.value,
                        })
                      }
                      invalid={
                        isValidationCheckAllowed && !formState.batch_number
                      }
                      disabled={requestStatus === 'PENDING'}
                      kitmanDesignSystem
                    />
                  </div>
                  {showPlayerMovementDatePicker
                    ? renderExpirationDateNew(isLoading)
                    : renderExpirationDate({ lastActivePeriod, isLoading })}
                </div>

                <div
                  css={style.row}
                  data-testid="AddVaccinationSidePanel|AssociatedInjuries"
                >
                  <Select
                    label={props.t('Associated injury/ illness')}
                    onChange={(ids) => {
                      const illnessIds = getIssueIds('Illness', ids);
                      const injuryIds = getIssueIds('Injury', ids);
                      const chronicIds = getIssueIds('ChronicInjury', ids);

                      dispatch({ type: 'SET_ILLNESS_IDS', illnessIds });
                      dispatch({ type: 'SET_INJURY_IDS', injuryIds });
                      dispatch({ type: 'SET_CHRONIC_IDS', chronicIds });
                    }}
                    value={getAssociatedInjuryIllnessValues()}
                    options={enrichedAthleteIssues}
                    isMulti
                    isDisabled={
                      !formState.athlete_id ||
                      requestStatus === 'PENDING' ||
                      requestIssuesStatus === 'PENDING'
                    }
                    optional
                  />
                </div>

                <div
                  css={[style.row, style.halfRow]}
                  data-testid="AddVaccinationSidePanel|Visibility"
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
                      // disable Psych Team only injury option for now as it's not working
                      // { label: props.t('Psych team'), value: 'PSYCH_TEAM' },
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

                <hr css={style.hr} />
                {formState.queuedAttachmentTypes.includes('FILE') && (
                  <>
                    <FileUploadArea
                      showActionButton
                      actionIcon="icon-bin"
                      areaTitle={props.t('Attach file(s)')}
                      attachedFiles={formState.queuedAttachments}
                      updateFiles={(queuedAttachments) => {
                        dispatch({
                          type: 'UPDATE_QUEUED_ATTACHMENTS',
                          queuedAttachments,
                        });
                      }}
                      removeFiles={props.isOpen}
                      testIdPrefix="AddVaccinationSidePanel"
                      isFileError={false}
                      onClickActionButton={() =>
                        dispatch({
                          type: 'REMOVE_ATTACHMENT_TYPE',
                          queuedAttachmentType: 'FILE',
                        })
                      }
                      acceptedFileTypeCode="imageVideo"
                    />

                    <hr css={style.hr} />
                  </>
                )}

                <div
                  css={style.row}
                  data-testid="AddVaccinationSidePanel|AddAttachment"
                >
                  <TooltipMenu
                    tooltipTriggerElement={
                      <TextButton
                        text={props.t('Add attachment')}
                        type="secondary"
                        iconAfter="icon-chevron-down"
                        kitmanDesignSystem
                      />
                    }
                    menuItems={[
                      {
                        description: props.t('File'),
                        onClick: () =>
                          dispatch({
                            type: 'UPDATE_ATTACHMENT_TYPE',
                            queuedAttachmentType: 'FILE',
                          }),
                      },
                    ]}
                    placement="bottom-start"
                    appendToParent
                    kitmanDesignSystem
                  />
                </div>
              </div>

              <div
                css={style.actions}
                data-testid="AddVaccinationSidePanel|Actions"
              >
                <TextButton
                  onClick={onSave}
                  text={props.t('Save')}
                  type="primary"
                  kitmanDesignSystem
                />
              </div>
              {(requestStatus === 'FAILURE' ||
                requestIssuesStatus === 'FAILURE' ||
                props.initialDataRequestStatus === 'FAILURE') && (
                <AppStatus status="error" />
              )}
            </SlidingPanelResponsive>
          </div>
        )}
      </AthleteConstraints>
    </div>
  );
};

export const AddVaccinationSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(AddVaccinationSidePanel);
export default AddVaccinationSidePanel;
