// @flow
import { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import type { ComponentType } from 'react';
import {
  docFileTypes,
  imageFileTypes,
  videoFileTypes,
} from '@kitman/common/src/utils/mediaHelper';
import type { MedicalLocationType } from '@kitman/services/src/services/medical/getMedicalLocations';
import { withNamespaces } from 'react-i18next';
import {
  AppStatus,
  DatePicker,
  FileUploadArea,
  IconButton,
  InputNumeric,
  InputTextField,
  RichTextEditor,
  Select,
  SlidingPanelResponsive,
  Textarea,
  TextButton,
  TimePicker,
  ToggleSwitch,
  TooltipMenu,
} from '@kitman/components';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import type { SelectOption as Option } from '@kitman/components/src/types';
import {
  getTreatmentSessionOptions,
  saveTreatment,
  uploadFile,
} from '@kitman/services';
import type { TreatmentRequest } from '@kitman/services/src/services/medical/saveTreatment';
import AthleteConstraints from '@kitman/modules/src/Medical/shared/components/AthleteConstraints';
import {
  checkInvalidFileTitles,
  transformFilesForUpload,
} from '@kitman/common/src/utils/fileHelper';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { formatTreatmentSessionOptionsForSelectComponent } from '../../utils';
import { useIssue } from '../../contexts/IssueContext';

import style from './styles';
import type { RequestStatus } from '../../types';

import type { DuplicateTreatmentSession, TreatmentAttribute } from './types';

import useAddTreatmentForm from './hooks/useAddTreatmentForm';
import useCurrentUser from '../../hooks/useGetCurrentUser';

type Props = {
  athleteId?: ?number,
  initialDataRequestStatus: RequestStatus,
  isAthleteSelectable: boolean,
  isDuplicatingTreatment: boolean,
  duplicateTreatment: DuplicateTreatmentSession,
  isOpen: boolean,
  onClose: Function,
  onFileUploadStart: Function,
  onFileUploadSuccess: Function,
  onFileUploadFailure: Function,
  onSaveTreatment: Function,
  staffUsers: Array<Option>,
  squadAthletes: Array<Option>,
  medicalLocations: Array<MedicalLocationType>,
};

const CPT_CODE_MIN_LENGTH_REQUIRED = 5;

const AddTreatmentSidePanel = (props: I18nProps<Props>) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [treatmentModalityOptions, setTreatmentModalityOptions] = useState([]);
  const [treatableBodyAreaOptions, setTreatableBodyAreaOptions] = useState([]);
  const [treatmentReasonOptions, setTreatmentReasonOptions] = useState([]);
  const [isValidationCheckAllowed, setIsValidationCheckAllowed] =
    useState(false);
  const [fileUploadQueue, setFileUploadQueue] = useState<Array<AttachedFile>>(
    []
  );

  const { currentUser, fetchCurrentUser } = useCurrentUser();
  const { issue, issueType, isChronicIssue } = useIssue();

  const showPlayerMovementDatePicker =
    window.featureFlags['player-movement-aware-datepicker'];

  const initTreatmentFormValues = {
    athleteId: null,
    practitionerId: null,
    referringPhysician: '',
    treatmentDate: null,
    startDate: null,
    startTime: null,
    endTime: null,
    timezone: '',
    duration: '',
    treatmentsAttributes: [],
    queuedAttachments: [],
    queuedAttachmentTypes: [],
    annotationAttributes: {
      content: '',
      attachments_attributes: [],
    },
    modalities: [],
    bodyAreas: [],
    reason: null,
    issue: null,
    multiDuration: '',
    date: {
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      timezone: '',
      duration: '30',
    },
    medicalLocations: [],
  };

  const { formState, dispatch } = useAddTreatmentForm(initTreatmentFormValues);

  const onAthleteChange = (athleteId: number) => {
    dispatch({ type: 'SET_ATHLETE_ID', athleteId });
    setRequestStatus('PENDING');

    getTreatmentSessionOptions(athleteId)
      .then((data) => {
        const {
          modalityOptions,
          bodyAreaOptions,
          reasonOptions,
          // TODO: Double check this mapping:
        } = formatTreatmentSessionOptionsForSelectComponent(data);

        setTreatmentModalityOptions(modalityOptions);
        setTreatableBodyAreaOptions(bodyAreaOptions);
        setTreatmentReasonOptions(reasonOptions);
        setRequestStatus('SUCCESS');
      })
      .catch(() => {
        setRequestStatus('FAILURE');
      });
  };

  useEffect(() => {
    if (props.isOpen) {
      if (props.athleteId) {
        dispatch({
          type: 'SET_ATHLETE_ID',
          athleteId: props.athleteId,
        });
        // $FlowFixMe we have an id at this point
        onAthleteChange(props.athleteId);
      }
      if (!props.isDuplicatingTreatment) {
        fetchCurrentUser();
      }
      if (!window.featureFlags['treatments-multi-modality']) {
        dispatch({
          type: 'CREATE_TREATMENT_TEMPLATE',
        });
      }
      if (props.isDuplicatingTreatment) {
        dispatch({
          type: 'DUPLICATE_TREATMENT',
          treatment: props.duplicateTreatment,
        });
        onAthleteChange(props.duplicateTreatment.athlete.id);
      }
    }
    if (!props.isOpen) {
      setFileUploadQueue([]);
      setIsValidationCheckAllowed(false);
      dispatch({
        type: 'CLEAR_FORM',
        defaultFormValues: initTreatmentFormValues,
      });
    }
  }, [props.isOpen, props.isDuplicatingTreatment, props.athleteId]);

  // Pre-populate the Reason drop-down, Github issue: #18660
  useEffect(() => {
    if (props.isOpen && issue.id) {
      const prefilledTreatmentReason = JSON.stringify({
        reason: 'issue',
        issue_type:
          issueType === 'Injury' ? 'InjuryOccurrence' : 'IllnessOccurrence',
        issue_id: issue.id,
      });

      dispatch({
        type: 'SET_TREATMENT_REASON',
        index: 0,
        reason: JSON.parse(prefilledTreatmentReason),
      });
    }
  }, [props.isOpen, issue]);

  useEffect(() => {
    if (currentUser) {
      dispatch({
        type: 'SET_PRACTITIONER_ID',
        practitionerId: currentUser.id,
      });
    }
  }, [currentUser]);

  const handleSelectBodyArea = (bodyArea) => {
    const selectedBodyAreas = bodyArea;
    let selectedItemIndex = -1;
    const selectedItem = treatableBodyAreaOptions.find((bao, index) => {
      selectedItemIndex = index;
      return (
        JSON.stringify(bao.value) ===
        selectedBodyAreas[selectedBodyAreas.length - 1]
      );
    });

    if (selectedItem) {
      const reversedSlice = treatableBodyAreaOptions
        .slice(1, selectedItemIndex)
        .reverse();
      const bodyAreaParent = reversedSlice.find((item) => item.isGroupOption);
      const bodyAreaParentId = selectedItem?.isGroupOption
        ? null
        : bodyAreaParent?.value;

      if (bodyAreaParentId && !bodyArea.includes(bodyAreaParentId)) {
        selectedBodyAreas.push(JSON.stringify(bodyAreaParentId));
      }
    }

    return selectedBodyAreas;
  };

  const getFormTitle = props.isDuplicatingTreatment
    ? props.t('Duplicate treatment')
    : props.t('Add treatment');

  const renderTreatmentDateFields = () => {
    return (
      <>
        {showPlayerMovementDatePicker ? (
          <div
            css={style.date.startDate}
            data-testid="AddTreatmentForm|StartDateNew"
          >
            <MovementAwareDatePicker
              athleteId={formState?.athleteId || undefined}
              value={
                formState.date.startDate
                  ? moment(formState.date.startDate)
                  : null
              }
              onChange={(date) => {
                dispatch({
                  type: 'SET_TREATMENT_START_DATE',
                  date,
                });
              }}
              name="treatmentStartDate"
              inputLabel={props.t('Start date')}
              disabled={requestStatus === 'PENDING'}
              isInvalid={isValidationCheckAllowed && !formState.date.startDate}
              kitmanDesignSystem
            />
          </div>
        ) : (
          <AthleteConstraints athleteId={formState.athleteId}>
            {({ isLoading, lastActivePeriod }) => (
              <div
                css={style.date.startDate}
                data-testid="AddTreatmentForm|StartDate"
              >
                <DatePicker
                  label={props.t('Start date')}
                  onDateChange={(date) => {
                    dispatch({
                      type: 'SET_TREATMENT_START_DATE',
                      date,
                    });
                  }}
                  minDate={lastActivePeriod.start}
                  value={formState.date.startDate}
                  invalid={
                    isValidationCheckAllowed && !formState.date.startDate
                  }
                  disabled={requestStatus === 'PENDING' || isLoading}
                  kitmanDesignSystem
                />
              </div>
            )}
          </AthleteConstraints>
        )}

        <div
          css={style.date.startTime}
          data-testid="AddTreatmentForm|StartTime"
        >
          <TimePicker
            label={props.t('Start time')}
            onChange={(time) => {
              dispatch({
                type: 'SET_TREATMENT_START_TIME',
                time,
              });
            }}
            value={formState.date.startDate}
            kitmanDesignSystem
          />
        </div>
        <div css={style.date.startDate} data-testid="AddTreatmentForm|EndDate">
          {showPlayerMovementDatePicker ? (
            <MovementAwareDatePicker
              athleteId={formState.athleteId || undefined}
              value={
                formState.date.endDate ? moment(formState.date.endDate) : null
              }
              onChange={(date) => {
                dispatch({
                  type: 'SET_TREATMENT_END_DATE',
                  date,
                });
              }}
              name="treatmentEndDate"
              inputLabel={props.t('End date')}
              disabled={requestStatus === 'PENDING'}
              isInvalid={isValidationCheckAllowed && !formState.date.endDate}
              minDate={formState.date.startDate}
              kitmanDesignSystem
            />
          ) : (
            <DatePicker
              label={props.t('End date')}
              onDateChange={(date) => {
                dispatch({
                  type: 'SET_TREATMENT_END_DATE',
                  date,
                });
              }}
              minDate={formState.date.startDate}
              value={formState.date.endDate}
              invalid={isValidationCheckAllowed && !formState.date.endDate}
              disabled={requestStatus === 'PENDING'}
              kitmanDesignSystem
            />
          )}
        </div>
        <div css={style.date.startTime} data-testid="AddTreatmentForm|EndTime">
          <TimePicker
            label={props.t('End time')}
            onChange={(time) => {
              dispatch({
                type: 'SET_TREATMENT_END_TIME',
                time,
              });
            }}
            value={formState.date.endDate}
            kitmanDesignSystem
          />
        </div>
        {window.featureFlags['treatments-location'] && (
          <div css={style.treatment_location}>
            <Select
              label={props.t('Location')}
              onChange={(location) => {
                dispatch({
                  type: 'SET_MEDICAL_LOCATIONS',
                  medicalLocations: location,
                });
              }}
              value={formState.medicalLocations}
              options={props.medicalLocations ? props.medicalLocations : []}
              isDisabled={requestStatus === 'PENDING'}
              optional
            />
          </div>
        )}
        <div css={style.date.duration} data-testid="AddTreatmentForm|Timezone">
          <Select
            appendToBody
            label={props.t('Timezone')}
            options={moment.tz.names().map((tzName) => ({
              value: tzName,
              label: tzName,
            }))}
            onChange={(timezone) => {
              dispatch({
                type: 'SET_TREATMENT_TIMEZONE',
                timezone,
              });
            }}
            value={formState.date.timezone}
          />
        </div>
        <div css={style.duration} data-testid="AddTreatmentForm|TotalDuration">
          <label css={style.label}>{props.t('Duration')}</label>
          <span css={style.durationValue}>{formState.date.duration}</span>
        </div>
      </>
    );
  };

  const renderTopLevelFields = () => {
    return (
      <>
        <div css={style.player} data-testid="AddTreatmentForm|Athlete">
          <Select
            label={props.t('Athlete')}
            onChange={(athleteId) => onAthleteChange(athleteId)}
            value={formState.athleteId}
            options={props.squadAthletes}
            isDisabled={!props.isAthleteSelectable && !!props.athleteId}
            invalid={isValidationCheckAllowed && !formState.athleteId}
          />
        </div>

        {window.featureFlags['referring-physician-treatments-diagnostics'] ? (
          <>
            <div
              css={style.practitioner}
              data-testid="AddTreatmentForm|Practitioner"
            >
              <Select
                label={props.t('Practitioner')}
                onChange={(practitionerId) =>
                  dispatch({
                    type: 'SET_PRACTITIONER_ID',
                    practitionerId,
                  })
                }
                value={formState.practitionerId}
                options={props.staffUsers}
                isDisabled={requestStatus === 'PENDING'}
                invalid={isValidationCheckAllowed && !formState.practitionerId}
              />
            </div>

            <div
              css={style.referringPhysician}
              data-testid="AddTreatmentForm|ReferringPhysician"
            >
              <InputTextField
                label={props.t('Referring physician')}
                value={formState.referringPhysician}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_REFERRING_PHYSICIAN',
                    referringPhysician: e.target.value,
                  })
                }
                inputType="text"
                optional
                kitmanDesignSystem
              />
            </div>
          </>
        ) : (
          <div
            css={style.practitionerNoReferring}
            data-testid="AddTreatmentForm|Practitioner"
          >
            <Select
              label={props.t('Practitioner')}
              onChange={(practitionerId) =>
                dispatch({
                  type: 'SET_PRACTITIONER_ID',
                  practitionerId,
                })
              }
              value={formState.practitionerId}
              options={props.staffUsers}
              isDisabled={requestStatus === 'PENDING'}
              invalid={isValidationCheckAllowed && !formState.practitionerId}
            />
          </div>
        )}

        {renderTreatmentDateFields()}

        <div
          css={style.treatmentTitle}
          data-testid="AddTreatmentForm|TreatmentTitle"
        >
          <InputTextField
            label={props.t('Title')}
            value="Treatment note"
            onChange={() => {}} // title is hardcoded and disabled so wont change
            disabled
            kitmanDesignSystem
          />
        </div>
        <hr css={style.hr} />
      </>
    );
  };

  const renderModality = (treatmentModalityId: number, index: number) => {
    return (
      <div
        css={style.treatmentModality}
        data-testid="AddTreatmentForm|Modality"
      >
        <Select
          appendToBody
          isGrouped
          value={treatmentModalityId}
          label={props.t('Modality')}
          options={treatmentModalityOptions}
          onChange={(modality) =>
            dispatch({
              type: 'SET_TREATMENT_MODALITY',
              index,
              modality,
            })
          }
          isDisabled={!formState.athleteId || requestStatus === 'PENDING'}
          invalid={isValidationCheckAllowed && !treatmentModalityId}
        />
      </div>
    );
  };

  const renderBodyArea = (treatmentBodyAreas: Array<string>, index: number) => {
    const jsonBodyAreas = treatableBodyAreaOptions.map((option) => {
      return {
        ...option,
        value: JSON.stringify(option.value),
      };
    });

    return (
      <div
        css={style.treatmentBodyArea}
        data-testid="AddTreatmentForm|BodyArea"
      >
        <Select
          appendToBody
          isMulti
          value={treatmentBodyAreas}
          label={props.t('Body area')}
          options={jsonBodyAreas}
          onChange={(selectedBodyAreas) => {
            const bodyAreas = handleSelectBodyArea(selectedBodyAreas);
            dispatch({
              type: 'SET_TREATMENT_BODY_AREA',
              index,
              selectedBodyAreas: bodyAreas,
            });
          }}
          isDisabled={!formState.athleteId || requestStatus === 'PENDING'}
          optional
        />
      </div>
    );
  };

  const renderReason = (treatment: TreatmentAttribute, index: number) => {
    return (
      <div css={style.treatmentReason} data-testid="AddTreatmentForm|Reason">
        <Select
          appendToBody
          isGrouped
          value={{
            reason: treatment.reason,
            issue_type: treatment?.issue_type || null,
            issue_id: treatment?.issue_id || null,
          }}
          label={props.t('Reason')}
          options={treatmentReasonOptions}
          onChange={(reason) => {
            dispatch({
              type: 'SET_TREATMENT_REASON',
              index,
              reason,
            });
          }}
          isDisabled={!formState.athleteId || requestStatus === 'PENDING'}
          invalid={isValidationCheckAllowed && !treatment.reason}
        />
      </div>
    );
  };

  const renderDuration = (treatment: TreatmentAttribute, index: number) => {
    return (
      <div
        css={style.treatmentDuration}
        data-testid="AddTreatmentForm|Duration"
      >
        <InputNumeric
          label={props.t('Duration')}
          name="duration"
          value={treatment.duration}
          onChange={(duration) =>
            dispatch({
              type: 'SET_TREATMENT_DURATION',
              index,
              duration,
            })
          }
          descriptor={props.t('mins')}
          optional
          kitmanDesignSystem
        />
      </div>
    );
  };

  const renderAttachments = () => {
    return (
      <>
        {formState.queuedAttachmentTypes.includes('NOTE') && (
          <>
            <hr css={style.hr} />
            <div
              css={style.attachmentContainer}
              data-testid="AddTreatmentForm|Attachments|Note"
            >
              <div css={style.attachmentsHeader}>
                <h3>{props.t('Note')}</h3>
                <TextButton
                  onClick={() =>
                    dispatch({
                      type: 'REMOVE_ATTACHMENT_TYPE',
                      queuedAttachmentType: 'NOTE',
                    })
                  }
                  iconBefore="icon-bin"
                  type="subtle"
                  kitmanDesignSystem
                />
              </div>
              <RichTextEditor
                onChange={(note) =>
                  dispatch({
                    type: 'SET_ATTACHED_NOTE_CONTENT',
                    note,
                  })
                }
                value={formState.annotationAttributes.content}
                isDisabled={requestStatus === 'PENDING'}
                kitmanDesignSystem
              />
            </div>
            <hr css={style.hr} />
          </>
        )}
        {formState.queuedAttachmentTypes.includes('FILE') && (
          <>
            <hr css={style.hr} />
            <div css={style.attachmentContainer}>
              <FileUploadArea
                showActionButton
                testIdPrefix="AddTreatmentForm"
                attachedFiles={fileUploadQueue}
                updateFiles={setFileUploadQueue}
                removeFiles={props.isOpen}
                isFileError={false}
                areaTitle={props.t('Attach file(s)')}
                actionIcon="icon-bin"
                onClickActionButton={() =>
                  dispatch({
                    type: 'REMOVE_ATTACHMENT_TYPE',
                    queuedAttachmentType: 'FILE',
                  })
                }
                acceptedFileTypeCode="imageVideo"
                acceptedFileTypes={[
                  ...imageFileTypes,
                  ...videoFileTypes,
                  ...docFileTypes,
                ]}
              />
            </div>
            <hr css={style.hr} />
          </>
        )}
      </>
    );
  };

  const renderAddAttachments = () => {
    return (
      <>
        <hr css={style.hr} />
        <div
          css={style.attachments}
          data-testid="AddTreatmentForm|AddAttachments"
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
                description: props.t('Note'),
                onClick: () =>
                  dispatch({
                    type: 'UPDATE_ATTACHMENT_TYPE',
                    queuedAttachmentType: 'NOTE',
                  }),
              },
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
      </>
    );
  };

  const renderBillingFields = (
    treatment: TreatmentAttribute,
    index: number
  ) => {
    return (
      <div css={style.billingContainer}>
        <div css={style.cptCode} data-testid="AddTreatmentForm|CPTCode">
          <InputTextField
            label={props.t('CPT code')}
            value={treatment.cpt_code}
            onChange={(e) =>
              dispatch({
                type: 'SET_TREATMENT_CPT_CODE',
                index,
                cptCode: e.target.value,
              })
            }
            inputType="text"
            invalid={
              treatment.cpt_code.length > 0 && treatment.cpt_code.length < 5
            }
            kitmanDesignSystem
          />
        </div>
        <div css={style.icdCode} data-testid="AddTreatmentForm|ICDCode">
          <InputTextField
            label={props.t('ICD code')}
            value={treatment.icd_code}
            onChange={(e) =>
              dispatch({
                type: 'SET_TREATMENT_ICD_CODE',
                index,
                icdCode: e.target.value,
              })
            }
            inputType="text"
            kitmanDesignSystem
          />
        </div>
        <div
          css={style.billableToggle}
          data-testid="AddTreatmentForm|IsBilling"
        >
          <ToggleSwitch
            label={props.t('Bill treatment')}
            isSwitchedOn={treatment.is_billable}
            toggle={() => {
              dispatch({
                type: 'SET_TREATMENT_IS_BILLABLE',
                index,
                isBillable: !formState.treatmentsAttributes[index].is_billable,
              });
            }}
            kitmanDesignSystem
          />
        </div>
        {treatment.is_billable &&
          window.featureFlags['treatments-billing-extra-fields'] && (
            <>
              <div
                css={style.amountCharged}
                data-testid="AddTreatmentForm|AmountCharged"
              >
                <InputTextField
                  label={props.t('Amount charged')}
                  value={treatment.amount_charged}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_TREATMENT_AMOUNT_CHARGED',
                      index,
                      amountCharged: e.target.value,
                    })
                  }
                  inputType="number"
                  optional
                  kitmanDesignSystem
                />
              </div>
              <div
                css={style.discountOrReduction}
                data-testid="AddTreatmentForm|DiscountOrReduction"
              >
                <InputTextField
                  label={props.t('Discount/ reduction')}
                  value={treatment.discount}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_TREATMENT_DISCOUNT_OR_REDUCTION',
                      index,
                      discountOrReduction: e.target.value,
                    })
                  }
                  inputType="number"
                  optional
                  kitmanDesignSystem
                />
              </div>
              <div
                css={style.amountPaidInsurance}
                data-testid="AddTreatmentForm|InsurancePaid"
              >
                <InputTextField
                  label={props.t('Amount insurance paid')}
                  value={treatment.amount_paid_insurance}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_TREATMENT_AMOUNT_INSURANCE',
                      index,
                      amountPaidInsurance: e.target.value,
                    })
                  }
                  inputType="number"
                  optional
                  kitmanDesignSystem
                />
              </div>
              <div
                css={style.amountDue}
                data-testid="AddTreatmentForm|AmountDue"
              >
                <InputTextField
                  label={props.t('Amount due')}
                  value={treatment.amount_due}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_TREATMENT_AMOUNT_DUE',
                      index,
                      amountDue: e.target.value,
                    })
                  }
                  inputType="number"
                  optional
                  kitmanDesignSystem
                />
              </div>
              <div
                css={style.amountPaidAthlete}
                data-testid="AddTreatmentForm|AthletePaid"
              >
                <InputTextField
                  label={props.t('Amount athlete paid')}
                  value={treatment.amount_paid_athlete}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_TREATMENT_AMOUNT_ATHLETE',
                      index,
                      amountPaidAthlete: e.target.value,
                    })
                  }
                  inputType="number"
                  optional
                  kitmanDesignSystem
                />
              </div>
              <div
                css={style.datePaidDate}
                data-testid="AddTreatmentForm|DatePaidDate"
              >
                <DatePicker
                  label={props.t('Date paid')}
                  onDateChange={(date) => {
                    dispatch({
                      type: 'SET_TREATMENT_DATE_PAID_DATE',
                      index,
                      datePaidDate: moment(date).format(
                        DateFormatter.dateTransferFormat
                      ),
                    });
                  }}
                  value={
                    treatment.date_paid ? moment(treatment.date_paid) : null
                  }
                  optional
                  disabled={requestStatus === 'PENDING'}
                  kitmanDesignSystem
                />
              </div>
            </>
          )}
        {treatment.is_billable &&
          !window.featureFlags['treatments-billing-extra-fields'] && (
            <div css={style.amountsNoExtraFieldsContainer}>
              <div
                css={style.amountPaidInsuranceNoExtraFields}
                data-testid="AddTreatmentForm|InsurancePaid"
              >
                <InputTextField
                  label={props.t('Amount paid by insurance')}
                  value={treatment.amount_paid_insurance}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_TREATMENT_AMOUNT_INSURANCE',
                      index,
                      amountPaidInsurance: e.target.value,
                    })
                  }
                  inputType="number"
                  optional
                  kitmanDesignSystem
                />
              </div>
              <div
                css={style.amountPaidAthleteNoExtraFields}
                data-testid="AddTreatmentForm|AthletePaid"
              >
                <InputTextField
                  label={props.t('Amount paid by athlete')}
                  value={treatment.amount_paid_athlete}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_TREATMENT_AMOUNT_ATHLETE',
                      index,
                      amountPaidAthlete: e.target.value,
                    })
                  }
                  inputType="number"
                  optional
                  kitmanDesignSystem
                />
              </div>
            </div>
          )}
      </div>
    );
  };

  const createMultiModalities = () => {
    formState.modalities.forEach((modality) => {
      const existingTreatments = formState.treatmentsAttributes.length;

      const newTreatment: TreatmentAttribute = {
        treatment_modality: modality,
        treatment_body_areas: formState.bodyAreas,
        duration: formState.multiDuration,
        reason: formState.reason?.reason || '',
        issue: formState.issue,
        issue_type: formState?.reason?.issue_type || '',
        issue_id: formState?.reason?.issue_id,
        is_billable: false,
        cpt_code: '',
        icd_code: '',
        amount_charged: '',
        discount: '',
        amount_paid_insurance: '',
        amount_due: '',
        amount_paid_athlete: '',
        date_paid: '',
        note: '',
      };

      dispatch({
        type: 'ADD_TREATMENT',
        treatment: newTreatment,
      });
      dispatch({
        type: 'SET_TREATMENT_REASON',
        index: existingTreatments,
        reason: formState.reason,
      });
    });
  };

  const renderMultiModality = () => {
    const jsonBodyAreas = treatableBodyAreaOptions.map((option) => {
      return {
        ...option,
        value: JSON.stringify(option.value),
      };
    });
    return (
      <>
        <span
          css={style.addTreatmentsTitle}
          data-testid="AddTreatmentForm|Multi|Title"
        >
          {props.t('Add treatments')}
        </span>

        <div
          css={style.treatmentModality}
          data-testid="AddTreatmentForm|Multi|Modality"
        >
          <Select
            appendToBody
            isGrouped
            isMulti
            value={formState.modalities}
            label={props.t('Modality')}
            options={treatmentModalityOptions}
            onChange={(modalities) => {
              dispatch({
                type: 'SET_MULTI_MODALITIES',
                modalities,
              });
            }}
            isDisabled={!formState.athleteId || requestStatus === 'PENDING'}
            invalid={isValidationCheckAllowed && !formState.modalities.length}
          />
        </div>
        <div
          css={style.treatmentBodyArea}
          data-testid="AddTreatmentForm|Multi|BodyArea"
        >
          <Select
            appendToBody
            isMulti
            value={formState.bodyAreas}
            label={props.t('Body area')}
            options={jsonBodyAreas}
            onChange={(selectedBodyAreas) => {
              const bodyAreas = handleSelectBodyArea(selectedBodyAreas);
              dispatch({
                type: 'SET_MULTI_BODY_AREAS',
                bodyAreas,
              });
            }}
            isDisabled={!formState.athleteId || requestStatus === 'PENDING'}
            optional
          />
        </div>
        <div
          css={style.treatmentReason}
          data-testid="AddTreatmentForm|Multi|Reason"
        >
          <Select
            appendToBody
            isGrouped
            value={formState.reason}
            label={props.t('Reason')}
            options={treatmentReasonOptions}
            onChange={(reason) => {
              dispatch({
                type: 'SET_MULTI_REASON',
                reason,
              });
            }}
            isDisabled={!formState.athleteId || requestStatus === 'PENDING'}
            invalid={isValidationCheckAllowed && !formState.reason?.reason}
          />
        </div>
        <div
          css={style.treatmentDuration}
          data-testid="AddTreatmentForm|Multi|Duration"
        >
          <InputNumeric
            label={props.t('Duration')}
            name="duration"
            value={formState.multiDuration}
            onChange={(duration) =>
              dispatch({
                type: 'SET_MULTI_DURATION',
                duration,
              })
            }
            descriptor={props.t('mins')}
            optional
            kitmanDesignSystem
          />
        </div>
        <div
          css={style.addTreatment}
          data-testid="AddTreatmentForm|Multi|AddTreatment"
        >
          <TextButton
            onClick={() => {
              createMultiModalities();
              dispatch({
                type: 'CLEAR_MULTI_ADD',
              });
            }}
            text={props.t('Add')}
            isDisabled={
              formState.modalities.length === 0 || !formState.reason?.reason
            }
            kitmanDesignSystem
          />
        </div>
      </>
    );
  };

  const validateMultiModality = () => {
    return (
      !!formState.treatmentsAttributes.length ||
      (!!formState.modalities.length && !!formState.reason?.reason)
    );
  };

  const handleValidation = () => {
    const requiredFields = [
      formState.athleteId,
      formState.practitionerId,
      formState.date.startDate,
      formState.date.startTime,
      formState.date.endTime,
      formState.date.endDate,
      formState.date.timezone,
    ];

    const multiModalityValidation = window.featureFlags[
      'treatments-multi-modality'
    ]
      ? validateMultiModality()
      : true;

    const allRequiredFieldsAreValid = requiredFields.every((item) => item);
    const allTreatmentsValid =
      formState.treatmentsAttributes.length > 0 &&
      formState.treatmentsAttributes.every(
        (treatment) => treatment.treatment_modality && treatment.reason
      );
    const allTreatmentCptCodesValid = formState.treatmentsAttributes.every(
      (treatment) => {
        if (treatment.cpt_code && treatment.cpt_code.length > 0) {
          return treatment.cpt_code.length >= CPT_CODE_MIN_LENGTH_REQUIRED;
        }
        return true;
      }
    );
    const fileAreaVisible = formState.queuedAttachmentTypes.includes('FILE');
    const allFileTitlesValid =
      !fileAreaVisible ||
      (fileAreaVisible && !checkInvalidFileTitles(fileUploadQueue));

    return (
      allRequiredFieldsAreValid &&
      multiModalityValidation &&
      allTreatmentsValid &&
      allTreatmentCptCodesValid &&
      allFileTitlesValid
    );
  };

  const transformTreatmentRequest = (
    transformedAttachments
  ): TreatmentRequest => {
    return {
      // $FlowFixMe we have an athleteId at this point
      athlete_id: formState.athleteId,
      // $FlowFixMe we have a practitionerId at this point
      user_id: formState.practitionerId,
      start_time: formState.date.startTime.format(),
      end_time: formState.date.endTime.format(),
      timezone: formState.date.timezone,
      title: 'Treatment note',
      treatments_attributes: formState.treatmentsAttributes.map((treatment) => {
        return {
          treatment_modality_id: treatment.treatment_modality,
          duration: treatment?.duration || '',
          reason: treatment?.reason || '',
          issue_type: isChronicIssue
            ? 'Emr::Private::Models::ChronicIssue'
            : treatment?.issue_type || null,
          issue_id: isChronicIssue ? issue.id : treatment?.issue_id,
          treatment_body_areas_attributes:
            treatment.treatment_body_areas?.map((bodyArea) =>
              JSON.parse(bodyArea)
            ) || [],
          is_billable: treatment.is_billable || false,
          treatment_billable_item_attributes: {
            cpt_code: treatment.cpt_code || '',
            icd_code: treatment.icd_code || '',
            amount_charged: treatment.amount_charged || '',
            discount: treatment.discount || '',
            amount_paid_insurance: treatment.amount_paid_insurance || '',
            amount_due: treatment.amount_due || '',
            amount_paid_athlete: treatment.amount_paid_athlete || '',
            date_paid: treatment.date_paid || '',
          },
          note: treatment?.note || '',
        };
      }),
      annotation_attributes: {
        content: formState.annotationAttributes.content,
        attachments_attributes: transformedAttachments,
      },
      location_id: formState.medicalLocations,
      referring_physician: formState.referringPhysician,
    };
  };

  const uploadFiles = (unConfirmedFiles) => {
    unConfirmedFiles.forEach((unConfirmedFile, index) => {
      const unUploadedFile = fileUploadQueue[index].file;
      const fileName = unUploadedFile.name;
      const fileSize = fileSizeLabel(unUploadedFile.size, true);
      const fileId = unConfirmedFile.id;

      props.onFileUploadStart(fileName, fileSize, fileId);

      uploadFile(
        fileUploadQueue[index].file,
        unConfirmedFile.id,
        unConfirmedFile.presigned_post
      )
        .then(() => props.onFileUploadSuccess(fileId))
        .catch(() => props.onFileUploadFailure(fileId));
    });
  };

  const handleOnSaveTreatment = async () => {
    setIsValidationCheckAllowed(true);
    const isValid = handleValidation();

    if (!isValid) {
      return;
    }

    setIsValidationCheckAllowed(false);
    setRequestStatus('PENDING');

    const transformedAttachments = transformFilesForUpload(fileUploadQueue);

    const treatmentRequestBody = transformTreatmentRequest(
      transformedAttachments
    );

    saveTreatment(treatmentRequestBody)
      .then((response) => {
        const annotation = response.treatment_session.annotation;
        if (annotation) {
          const unconfirmedFiles = annotation.attachments.filter(
            (f) => !f.confirmed
          );
          if (unconfirmedFiles.length > 0) {
            uploadFiles(unconfirmedFiles);
          }
        }
        setRequestStatus(null);
        props.onSaveTreatment();
      })
      .catch(() => {
        setRequestStatus('FAILURE');
      });
  };

  return (
    <div css={style.sidePanel}>
      <SlidingPanelResponsive
        isOpen={props.isOpen}
        title={getFormTitle}
        onClose={props.onClose}
        width={659}
      >
        <div css={style.content}>
          {renderTopLevelFields()}

          {window.featureFlags['treatments-multi-modality'] &&
            renderMultiModality()}

          {formState.treatmentsAttributes &&
            formState.treatmentsAttributes.map((treatment, index) => {
              return (
                // no other option but to use index for the key here for now
                // eslint-disable-next-line react/no-array-index-key
                <div key={index} css={style.treatment}>
                  <hr css={style.hr} />

                  <span
                    css={style.treatmentInfoTitle}
                    data-testid="AddTreatmentForm|Title"
                  >
                    {props.t('Treatment {{number}}', { number: index + 1 })}
                  </span>

                  {formState.treatmentsAttributes &&
                    formState.treatmentsAttributes.length > 1 && (
                      <div
                        css={style.removeTreatment}
                        data-testid="AddTreatmentForm|RemoveTreatment"
                      >
                        <IconButton
                          icon="icon-close"
                          onClick={() =>
                            dispatch({
                              type: 'REMOVE_TREATMENT',
                              index,
                            })
                          }
                          isSmall
                          isTransparent
                        />
                      </div>
                    )}

                  <>
                    {renderModality(treatment.treatment_modality, index)}
                    {renderBodyArea(treatment.treatment_body_areas, index)}
                    {renderReason(treatment, index)}
                    {renderDuration(treatment, index)}
                    {window.featureFlags['treatments-billing'] &&
                      renderBillingFields(treatment, index)}
                  </>

                  <div
                    css={
                      window.featureFlags['treatments-multi-modality']
                        ? style.treatmentComment
                        : style.treatmentNote
                    }
                    data-testid="AddTreatmentForm|Note"
                  >
                    <Textarea
                      label={
                        window.featureFlags['treatments-multi-modality']
                          ? props.t('Comment')
                          : props.t('Note')
                      }
                      value={treatment.note}
                      onChange={(note) =>
                        dispatch({
                          type: 'SET_TREATMENT_NOTE',
                          index,
                          note,
                        })
                      }
                      maxLimit={65535}
                      kitmanDesignSystem
                      t={props.t}
                    />
                  </div>
                </div>
              );
            })}

          {!window.featureFlags['treatments-multi-modality'] && (
            <>
              <hr css={style.hr} />
              <div
                css={style.addTreatment}
                data-testid="AddTreatmentForm|InsertTreatment"
              >
                <TextButton
                  onClick={() =>
                    dispatch({
                      type: 'CREATE_TREATMENT_TEMPLATE',
                    })
                  }
                  text={props.t('Add treatment')}
                  kitmanDesignSystem
                />
              </div>
              <hr css={style.hr} />
            </>
          )}

          {renderAttachments()}
          {renderAddAttachments()}
        </div>
        <div css={style.actions} data-testid="AddTreatmentForm|Actions">
          <TextButton
            onClick={handleOnSaveTreatment}
            text={props.t('Save')}
            type="primary"
            kitmanDesignSystem
            isDisabled={
              (window.featureFlags['treatments-multi-modality'] &&
                !formState.treatmentsAttributes.length) ||
              requestStatus === 'PENDING'
            }
          />
        </div>
        {(requestStatus === 'FAILURE' ||
          props.initialDataRequestStatus === 'FAILURE') && (
          <AppStatus status="error" />
        )}
      </SlidingPanelResponsive>
    </div>
  );
};

export const AddTreatmentSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(AddTreatmentSidePanel);
export default AddTreatmentSidePanel;
