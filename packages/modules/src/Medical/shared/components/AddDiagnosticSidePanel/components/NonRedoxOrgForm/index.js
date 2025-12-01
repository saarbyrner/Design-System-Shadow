// @flow
import type { ComponentType } from 'react';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import {
  DatePicker,
  InputTextField,
  Select,
  RichTextEditorAlt as RichTextEditor,
  TextButton,
  TooltipMenu,
  Checkbox,
  ToggleSwitch,
} from '@kitman/components';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { RequestStatus, Dispatch } from '@kitman/common/src/types';
import { getIssueIds } from '@kitman/modules/src/Medical/shared/utils';
import { AskOnEntryComponentTranslated as AskOnEntryComponent } from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/components/AskOnEntryQuestions';
import { sortQuestionsById } from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/utils/mappers';
import { isValidUrlNoWhitespace } from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/utils/validators';
import style from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/styles';
import type { FormState } from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/hooks/useDiagnosticForm';
import type { EnrichedAthleteIssue } from '@kitman/modules/src/Medical/shared/hooks/useEnrichedAthletesIssues';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { Box } from '@kitman/playbook/components';
import { rootTheme } from '@kitman/playbook/themes';
import type {
  MedicalLocationOption,
  OptionWithOptional,
} from '@kitman/modules/src/Medical/shared/types/medical/Diagnostic';

type Props = {
  isPastAthlete?: boolean,
  athleteData?: AthleteData,
  formState: FormState,
  isValidationCheckAllowed: boolean,
  isEditing?: boolean,
  requestStatus: RequestStatus,
  requestIssuesStatus: RequestStatus,
  isAthleteSelectable: boolean,
  athleteId?: ?number,
  permissions: PermissionsType,
  squadAthletes: Array<Option>,
  staffUsers: Array<Option>,
  medicalLocations?: Array<MedicalLocationOption>,
  enrichedAthleteIssues: Array<EnrichedAthleteIssue>,
  injuryIllnessReasonId?: ?number,
  isLinkValidationCheckAllowed: boolean,
  covidResultTypes: Array<Option>,
  covidAntibodyResultTypes: Array<Option>,
  extraCovidFieldIds: Array<number>,
  extraCovidAntibodyFieldIds: Array<number>,
  extraMedicationFieldIds: Array<number>,
  initialDataRequestStatus: RequestStatus,
  dispatch: Dispatch<any>,
  onAthleteChange: (athleteId: number) => void,
  getDiagnosticReasonsOptions: () => Array<OptionWithOptional>,
  getAssociatedInjuryIllnessValues: () => Array<string>,
  isAssociatedRelatedInjuryIllnessValid: () => boolean,
  getDiagnosticTypeOptions: () => Array<OptionWithOptional>,
  renderFileUploadArea: (index?: number) => any,
  setIsLinkValidationCheckAllowed: (allowed: boolean) => void,
  onSaveLink: () => void,
};

const NonRedoxOrgForm = (props: I18nProps<Props>) => {
  const isBillingExtraFields = window.getFlag(
    'diagnostics-billing-extra-fields'
  );
  const isReferringPhysicianTreatmentsDiagnostics = window.getFlag(
    'referring-physician-treatments-diagnostics'
  );
  const showAnnotationDatePicker = window.getFlag(
    'pm-diagnostic-add-flow-annotation-date'
  );
  const isBillingCpt = window.getFlag(
    'medical-diagnostics-iteration-3-billing-cpt'
  );
  const isMultipleCpt = window.getFlag('diagnostics-multiple-cpt');
  const isCovid19MedicalDiagnostic = window.getFlag(
    'covid-19-medical-diagnostic'
  );
  const setSquadAthleteOptions = () => {
    if (props.isPastAthlete) {
      return [
        {
          label: props.athleteData?.fullname,
          value: props.formState.athleteId,
        },
      ];
    }
    return props.squadAthletes;
  };

  const renderDateOfDiagnosticDatePicker = () => {
    return (
      <div css={style.dateOfDiagnostic}>
        <DatePicker
          label={props.t('Date of diagnostic')}
          onDateChange={(date) => {
            props.dispatch({
              type: 'SET_DIAGNOSTIC_DATE',
              diagnosticDate: moment(date).format(
                DateFormatter.dateTransferFormat
              ),
            });
          }}
          value={
            props.formState.diagnosticDate
              ? moment(props.formState.diagnosticDate)
              : null
          }
          invalid={
            props.isValidationCheckAllowed && !props.formState.diagnosticDate
          }
          disabled={props.requestStatus === 'PENDING'}
          maxDate={null}
          minDate={null}
          kitmanDesignSystem
        />
      </div>
    );
  };

  const renderAnnotationDatePicker = () => {
    return (
      <Box
        sx={{
          mt: '1rem',
          color: rootTheme.palette.primary.main,
          fontWeight: '500',
          '& label': { display: 'block' },
        }}
      >
        <MovementAwareDatePicker
          athleteId={props.formState.athleteId ?? undefined}
          disableFuture
          inputLabel={props.t('Note date')}
          isInvalid={
            props.isValidationCheckAllowed && !props.formState.annotationDate
          }
          onChange={(date) => {
            props.dispatch({
              type: 'SET_ANNOTATION_DATE',
              annotationDate: moment(date).format(
                DateFormatter.dateTransferFormat
              ),
            });
          }}
          value={
            props.formState.annotationDate
              ? moment(props.formState.annotationDate)
              : null
          }
          name="AnnotationDate"
        />
      </Box>
    );
  };

  const getMenuItems = () => {
    if (props.isEditing) {
      return [];
    }
    const items = [
      {
        description: props.t('File'),
        onClick: () =>
          props.dispatch({
            type: 'UPDATE_ATTACHMENT_TYPE',
            queuedAttachmentType: 'FILE',
          }),
      },
      {
        description: props.t('Link'),
        onClick: () =>
          props.dispatch({
            type: 'UPDATE_ATTACHMENT_TYPE',
            queuedAttachmentType: 'LINK',
          }),
      },
    ];

    if (showAnnotationDatePicker) {
      items.push({
        description: props.t('Note'),
        onClick: () =>
          props.dispatch({
            type: 'UPDATE_ATTACHMENT_TYPE',
            queuedAttachmentType: 'NOTE',
          }),
      });
    }

    return items;
  };

  return (
    <>
      <div css={style.contentIteration2}>
        <div css={style.player}>
          <Select
            label={props.t('Athlete')}
            onChange={(id) => props.onAthleteChange(id)}
            value={props.formState.athleteId}
            options={setSquadAthleteOptions()}
            isDisabled={
              (!props.isAthleteSelectable && !!props.athleteId) ||
              props.requestStatus === 'PENDING'
            }
            invalid={
              props.isValidationCheckAllowed && !props.formState.athleteId
            }
          />
        </div>
        {renderDateOfDiagnosticDatePicker()}
        <div css={style.prescriber}>
          <Select
            label={props.t('Practitioner')}
            onChange={(userId) =>
              props.dispatch({
                type: 'SET_USER_ID',
                userId,
              })
            }
            value={props.formState.userId}
            options={props.staffUsers}
            isDisabled={props.requestStatus === 'PENDING'}
            invalid={props.isValidationCheckAllowed && !props.formState.userId}
          />
        </div>
        {isReferringPhysicianTreatmentsDiagnostics && (
          <div
            css={style.referringPhysician}
            data-testid="AddTreatmentForm|ReferringPhysician"
          >
            <InputTextField
              label={props.t('Referring physician')}
              value={props.formState.referringPhysician}
              onChange={(e) =>
                props.dispatch({
                  type: 'SET_REFERRING_PHYSICIAN',
                  referringPhysician: e.target.value,
                })
              }
              inputType="text"
              optional
              kitmanDesignSystem
            />
          </div>
        )}
        {props.medicalLocations && (
          <div css={style.location}>
            <Select
              label={props.t('Location')}
              onChange={(locationId) =>
                props.dispatch({
                  type: 'SET_LOCATION_ID',
                  locationId,
                })
              }
              value={props.formState.locationId}
              options={props.medicalLocations}
              isDisabled={props.requestStatus === 'PENDING'}
              optional
            />
          </div>
        )}
        <hr css={[style.hr, style.gridRow4]} />
        <div css={style.typeIteration2}>
          <Select
            label={props.t('Diagnostic type')}
            returnObject
            onChange={(diagnosticType) => {
              props.dispatch({
                type: 'SET_DIAGNOSTIC_TYPE',
                diagnosticType,
              });
              props.dispatch({
                type: 'SET_REASON_ID',
                reasonId: props.enrichedAthleteIssues
                  .slice(0, 3)
                  .some((issue) => issue.options.length > 0)
                  ? props.injuryIllnessReasonId
                  : null,
              });
            }}
            value={props.formState.diagnosticType?.value}
            options={props.getDiagnosticTypeOptions()}
            invalid={
              props.isValidationCheckAllowed &&
              !props.formState.diagnosticType?.value
            }
            isDisabled={props.requestStatus === 'PENDING'}
          />
        </div>
        {props.formState.diagnosticType && (
          <div css={style.reason}>
            <Select
              label={props.t('Reason')}
              onChange={(reasonId) =>
                props.dispatch({
                  type: 'SET_REASON_ID',
                  reasonId,
                })
              }
              value={props.formState.reasonId}
              options={props.getDiagnosticReasonsOptions()}
              isDisabled={props.requestStatus === 'PENDING'}
              invalid={
                props.isValidationCheckAllowed && !props.formState.reasonId
              }
            />
          </div>
        )}
        {props.formState.diagnosticType?.cardiacScreening && (
          <div css={[style.laterality, style.gridRow6]}>
            <AskOnEntryComponent
              isValidationCheckAllowed={props.isValidationCheckAllowed}
              formState={props.formState}
              questions={sortQuestionsById(
                props.formState.diagnosticType?.diagnostic_type_questions || []
              )}
              index={0}
              choiceOnChange={({ option }) => {
                props.dispatch({
                  type: 'SET_CARDIAC_SCREENING_ANSWER',
                  diagnosticIndex: 0,
                  answer: {
                    answerIndex: option.askOnEntryIndex,
                    questionTypeId: option.question.id,
                    questionType: option.questionType,
                    value: option.value,
                    optionalTextRequired: option.optionalTextRequired,
                    label: option.question.label,
                    required: option.question.required,
                  },
                });
              }}
              optionalTextInputOnChange={() => {}}
            />
          </div>
        )}
        {props.formState.diagnosticType &&
          (props.enrichedAthleteIssues[0]?.options.length > 0 ||
            props.enrichedAthleteIssues[1]?.options.length > 0 ||
            props.enrichedAthleteIssues[2]?.options.length > 0) && (
            <div css={[style.linkIteration2, style.gridRow7]}>
              <Select
                label={props.t('Associated injury/ illness')}
                onChange={(ids) => {
                  const illnessIds = getIssueIds('Illness', ids);
                  const injuryIds = getIssueIds('Injury', ids);
                  const chronicIssueIds = getIssueIds('ChronicInjury', ids);

                  props.dispatch({ type: 'SET_ILLNESS_IDS', illnessIds });
                  props.dispatch({ type: 'SET_INJURY_IDS', injuryIds });
                  props.dispatch({ type: 'SET_CHRONIC_IDS', chronicIssueIds });
                }}
                value={props.getAssociatedInjuryIllnessValues()}
                options={props.enrichedAthleteIssues}
                isMulti
                isDisabled={
                  !props.formState.athleteId ||
                  props.requestStatus === 'PENDING' ||
                  props.requestIssuesStatus === 'PENDING'
                }
                invalid={props.isAssociatedRelatedInjuryIllnessValid()}
                optional={
                  props.formState.reasonId !== props.injuryIllnessReasonId
                }
              />
              <hr css={style.hr} />
            </div>
          )}
        {props.formState.diagnosticType && !props.isEditing && (
          <div css={[style.attachmentsIteration2, style.gridRow14]}>
            <TooltipMenu
              tooltipTriggerElement={
                <TextButton
                  text={props.t('Add')}
                  type="secondary"
                  iconAfter="icon-chevron-down"
                  kitmanDesignSystem
                />
              }
              menuItems={getMenuItems()}
              placement="bottom-start"
              appendToParent
              kitmanDesignSystem
            />
          </div>
        )}
        {props.extraMedicationFieldIds.includes(
          props.formState.diagnosticType?.value
        ) && (
          <div css={[style.medicationContainer, style.gridRow8]}>
            <div
              css={[style.medicationType, style.gridRow2, style.gridColumn1]}
            >
              <InputTextField
                label={props.t('Type')}
                value={props.formState.medicationType || ''}
                onChange={(e) =>
                  props.dispatch({
                    type: 'SET_MEDICATION_TYPE',
                    medicationType: e.target.value,
                  })
                }
                invalid={
                  props.isValidationCheckAllowed &&
                  !props.formState.medicationType
                }
                disabled={props.requestStatus === 'PENDING'}
                kitmanDesignSystem
              />
            </div>
            <div
              css={[style.medicationDosage, style.gridRow2, style.gridColumn2]}
            >
              <InputTextField
                label={props.t('Dosage')}
                value={props.formState.medicationDosage || ''}
                onChange={(e) =>
                  props.dispatch({
                    type: 'SET_MEDICATION_DOSAGE',
                    medicationDosage: e.target.value,
                  })
                }
                invalid={
                  props.isValidationCheckAllowed &&
                  !props.formState.medicationDosage
                }
                disabled={props.requestStatus === 'PENDING'}
                kitmanDesignSystem
              />
            </div>
            <div
              css={[
                style.medicationFrequency,
                style.gridRow2,
                style.gridColumn3,
              ]}
            >
              <InputTextField
                label={props.t('Frequency')}
                value={props.formState.medicationFrequency || ''}
                onChange={(e) =>
                  props.dispatch({
                    type: 'SET_MEDICATION_FREQUENCY',
                    medicationFrequency: e.target.value,
                  })
                }
                invalid={
                  props.isValidationCheckAllowed &&
                  !props.formState.medicationFrequency
                }
                disabled={props.requestStatus === 'PENDING'}
                kitmanDesignSystem
              />
            </div>
            <div
              css={[style.gridRow4, style.medicationDateContainer, style.span3]}
            >
              <div css={[style.startDate]}>
                <DatePicker
                  label={props.t('Start date')}
                  onDateChange={(date) => {
                    props.dispatch({
                      type: 'SET_MEDICATION_START_DATE',
                      medicationCourseStartedAt: moment(date).format(
                        DateFormatter.dateTransferFormat
                      ),
                    });
                  }}
                  value={
                    props.formState.medicationCourseStartedAt
                      ? moment(props.formState.medicationCourseStartedAt)
                      : null
                  }
                  invalid={
                    props.isValidationCheckAllowed &&
                    !props.formState.medicationCourseStartedAt
                  }
                  disabled={props.requestStatus === 'PENDING'}
                  kitmanDesignSystem
                />
              </div>
              <div css={[style.medicationCourseCompleted]}>
                <Checkbox
                  id="course-completed"
                  name="course-completed"
                  isChecked={props.formState.medicationCourseCompleted}
                  toggle={() => {
                    props.dispatch({
                      type: 'SET_MEDICATION_COURSE_COMPLETED',
                      medicationCourseCompleted:
                        !props.formState.medicationCourseCompleted,
                    });
                  }}
                  label={props.t('Course completed')}
                  isLabelPositionedOnTheLeft
                  kitmanDesignSystem
                />
              </div>
              {props.formState.medicationCourseCompleted && (
                <div css={[style.endDate]}>
                  <DatePicker
                    label={props.t('End date')}
                    onDateChange={(date) => {
                      props.dispatch({
                        type: 'SET_MEDICATION_END_DATE',
                        medicationCourseCompletedAt: moment(date)
                          .endOf('day')
                          .format(DateFormatter.dateTransferFormat),
                      });
                    }}
                    value={
                      props.formState.medicationCourseCompletedAt
                        ? moment(props.formState.medicationCourseCompletedAt)
                        : null
                    }
                    minDate={
                      props.formState.medicationCourseStartedAt
                        ? moment(props.formState.medicationCourseStartedAt)
                        : null
                    }
                    maxDate={moment()}
                    invalid={
                      props.isValidationCheckAllowed &&
                      !props.formState.medicationCourseCompletedAt
                    }
                    disabled={props.requestStatus === 'PENDING'}
                    kitmanDesignSystem
                  />
                </div>
              )}
            </div>
            <hr css={[style.hr, style.gridRow7, style.span3]} />
          </div>
        )}
        {isCovid19MedicalDiagnostic &&
          props.extraCovidFieldIds.includes(
            props.formState.diagnosticType?.value
          ) && (
            <div css={[style.covidContainer, style.gridRow8, style.span2]}>
              <div
                css={[style.covidTestDate, style.gridRow1, style.gridColumn1]}
              >
                <DatePicker
                  label={props.t('Date of test')}
                  onDateChange={(date) => {
                    props.dispatch({
                      type: 'SET_COVID_TEST_DATE',
                      covidTestDate: moment(date).format(
                        DateFormatter.dateTransferFormat
                      ),
                    });
                  }}
                  value={
                    props.formState.covidTestDate
                      ? moment(props.formState.covidTestDate)
                      : null
                  }
                  invalid={
                    props.isValidationCheckAllowed &&
                    !props.formState.covidTestDate
                  }
                  disabled={props.requestStatus === 'PENDING'}
                  kitmanDesignSystem
                />
              </div>
              <div
                css={[style.covidTestType, style.gridRow1, style.gridColumn2]}
              >
                <InputTextField
                  label={props.t('Test type')}
                  value={props.formState.covidTestType || ''}
                  onChange={(e) =>
                    props.dispatch({
                      type: 'SET_COVID_TEST_TYPE',
                      covidTestType: e.target.value,
                    })
                  }
                  disabled={props.requestStatus === 'PENDING'}
                  optional
                  kitmanDesignSystem
                />
              </div>

              <div
                css={[style.covidTestResult, style.gridRow2, style.gridColumn1]}
              >
                <Select
                  label={props.t('Result')}
                  onChange={(covidTestResult) => {
                    props.dispatch({
                      type: 'SET_COVID_TEST_RESULT',
                      covidTestResult,
                    });
                  }}
                  value={props.formState.covidTestResult}
                  options={props.covidResultTypes}
                  isDisabled={props.requestStatus === 'PENDING'}
                  invalid={
                    props.isValidationCheckAllowed &&
                    !props.formState.covidTestResult
                  }
                />
              </div>
              <div
                css={[
                  style.covidTestReference,
                  style.gridRow2,
                  style.gridColumn2,
                ]}
              >
                <InputTextField
                  label={props.t('Reference')}
                  value={props.formState.covidTestReference || ''}
                  onChange={(e) =>
                    props.dispatch({
                      type: 'SET_COVID_TEST_REFERENCE',
                      covidTestReference: e.target.value,
                    })
                  }
                  disabled={props.requestStatus === 'PENDING'}
                  optional
                  kitmanDesignSystem
                />
              </div>

              <hr css={style.hr} />
            </div>
          )}
        {isCovid19MedicalDiagnostic &&
          props.extraCovidAntibodyFieldIds.includes(
            props.formState.diagnosticType?.value
          ) && (
            <div css={[style.covidContainer, style.gridRow8, style.span2]}>
              <div
                css={[style.covidTestDate, style.gridRow1, style.gridColumn1]}
              >
                <DatePicker
                  label={props.t('Date of test')}
                  onDateChange={(date) => {
                    props.dispatch({
                      type: 'SET_COVID_ANTIBODY_TEST_DATE',
                      covidAntibodyTestDate: moment(date).format(
                        DateFormatter.dateTransferFormat
                      ),
                    });
                  }}
                  value={
                    props.formState.covidAntibodyTestDate
                      ? moment(props.formState.covidAntibodyTestDate)
                      : null
                  }
                  invalid={
                    props.isValidationCheckAllowed &&
                    !props.formState.covidAntibodyTestDate
                  }
                  disabled={props.requestStatus === 'PENDING'}
                  kitmanDesignSystem
                />
              </div>
              <div
                css={[style.covidTestType, style.gridRow1, style.gridColumn2]}
              >
                <InputTextField
                  label={props.t('Test type')}
                  value={props.formState.covidAntibodyTestType || ''}
                  onChange={(e) =>
                    props.dispatch({
                      type: 'SET_COVID_ANTIBODY_TEST_TYPE',
                      covidAntibodyTestType: e.target.value,
                    })
                  }
                  disabled={props.requestStatus === 'PENDING'}
                  optional
                  kitmanDesignSystem
                />
              </div>
              <div
                css={[style.covidTestResult, style.gridRow2, style.gridColumn1]}
              >
                <Select
                  label={props.t('Result')}
                  onChange={(covidAntibodyTestResult) => {
                    props.dispatch({
                      type: 'SET_COVID_ANTIBODY_TEST_RESULT',
                      covidAntibodyTestResult,
                    });
                  }}
                  value={props.formState.covidAntibodyTestResult}
                  options={props.covidAntibodyResultTypes}
                  isDisabled={props.requestStatus === 'PENDING'}
                  invalid={
                    props.isValidationCheckAllowed &&
                    !props.formState.covidAntibodyTestResult
                  }
                />
              </div>
              <div
                css={[
                  style.covidTestReference,
                  style.gridRow2,
                  style.gridColumn2,
                ]}
              >
                <InputTextField
                  label={props.t('Reference')}
                  value={props.formState.covidAntibodyTestReference || ''}
                  onChange={(e) =>
                    props.dispatch({
                      type: 'SET_COVID_ANTIBODY_TEST_REFERENCE',
                      covidAntibodyTestReference: e.target.value,
                    })
                  }
                  disabled={props.requestStatus === 'PENDING'}
                  optional
                  kitmanDesignSystem
                />
              </div>

              <hr css={style.hr} />
            </div>
          )}
        {isBillingCpt && !isMultipleCpt && !isBillingExtraFields && (
          <div css={[style.billingContainer, style.gridRow10]}>
            <div css={style.cptCode}>
              <InputTextField
                label={props.t('CPT code')}
                value={props.formState.cptCode}
                onChange={(e) =>
                  props.dispatch({
                    type: 'SET_CPT_CODE',
                    cptCode: e.target.value,
                  })
                }
                inputType="text"
                optional
                invalid={
                  isBillingCpt &&
                  props.isValidationCheckAllowed &&
                  props.formState.cptCode.length > 0 &&
                  props.formState.cptCode.length !== 5
                }
                kitmanDesignSystem
              />
            </div>
            <div css={style.billableToggle}>
              <ToggleSwitch
                label={props.t('Bill diagnostic')}
                isSwitchedOn={props.formState.isBillable}
                toggle={() => {
                  props.dispatch({
                    type: 'SET_IS_BILLABLE',
                    isBillable: !props.formState.isBillable,
                  });
                }}
                kitmanDesignSystem
              />
            </div>
            {props.formState.isBillable && !isBillingExtraFields && (
              <div css={style.billingContainerNoExtraFields}>
                <div css={style.amountPaidInsuranceNoExtraFields}>
                  <InputTextField
                    label={props.t('Amount paid by insurance')}
                    value={props.formState.amountPaidInsurance}
                    onChange={(e) =>
                      props.dispatch({
                        type: 'SET_AMOUNT_PAID_INSURANCE',
                        amountPaidInsurance: e.target.value,
                      })
                    }
                    inputType="number"
                    optional
                    kitmanDesignSystem
                  />
                </div>

                <div css={style.amountPaidAthleteNoExtraFields}>
                  <InputTextField
                    label={props.t('Amount paid by athlete')}
                    value={props.formState.amountPaidAthlete}
                    onChange={(e) =>
                      props.dispatch({
                        type: 'SET_AMOUNT_PAID_ATHLETE',
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
            {props.formState.isBillable && isBillingExtraFields && (
              <>
                <div css={style.amountCharged}>
                  <InputTextField
                    label={props.t('Amount charged')}
                    value={props.formState.amountCharged}
                    onChange={(e) =>
                      props.dispatch({
                        type: 'SET_AMOUNT_CHARGED',
                        amountCharged: e.target.value,
                      })
                    }
                    inputType="number"
                    optional
                    kitmanDesignSystem
                  />
                </div>

                <div css={style.discountOrReduction}>
                  <InputTextField
                    label={props.t('Discount/ reduction')}
                    value={props.formState.discountOrReduction}
                    onChange={(e) =>
                      props.dispatch({
                        type: 'SET_DISCOUNT_OR_REDUCTION',
                        discountOrReduction: e.target.value,
                      })
                    }
                    inputType="number"
                    optional
                    kitmanDesignSystem
                  />
                </div>

                <div css={style.amountPaidInsurance}>
                  <InputTextField
                    label={props.t('Amount insurance paid')}
                    value={props.formState.amountPaidInsurance}
                    onChange={(e) =>
                      props.dispatch({
                        type: 'SET_AMOUNT_PAID_INSURANCE',
                        amountPaidInsurance: e.target.value,
                      })
                    }
                    inputType="number"
                    optional
                    kitmanDesignSystem
                  />
                </div>

                <div css={style.amountDue}>
                  <InputTextField
                    label={props.t('Amount due')}
                    value={props.formState.amountDue}
                    onChange={(e) =>
                      props.dispatch({
                        type: 'SET_AMOUNT_DUE',
                        amountDue: e.target.value,
                      })
                    }
                    inputType="number"
                    optional
                    kitmanDesignSystem
                  />
                </div>

                <div css={style.amountPaidAthlete}>
                  <InputTextField
                    label={props.t('Amount athlete paid')}
                    value={props.formState.amountPaidAthlete}
                    onChange={(e) =>
                      props.dispatch({
                        type: 'SET_AMOUNT_PAID_ATHLETE',
                        amountPaidAthlete: e.target.value,
                      })
                    }
                    inputType="number"
                    optional
                    kitmanDesignSystem
                  />
                </div>

                <div css={style.datePaidDate}>
                  <DatePicker
                    label={props.t('Date paid')}
                    onDateChange={(date) => {
                      props.dispatch({
                        type: 'SET_DATE_PAID_DATE',
                        datePaidDate: moment(date).format(
                          DateFormatter.dateTransferFormat
                        ),
                      });
                    }}
                    value={
                      props.formState.datePaidDate
                        ? moment(props.formState.datePaidDate)
                        : null
                    }
                    optional
                    disabled={props.requestStatus === 'PENDING'}
                    kitmanDesignSystem
                  />
                </div>
              </>
            )}
            <hr css={[style.hr, style.span3]} />
          </div>
        )}
        {isBillingCpt && (isMultipleCpt || isBillingExtraFields) && (
          <div css={[style.billingContainer, style.gridRow10]}>
            {props.formState.queuedBillableItems
              .filter((item) => !item.isDeleted)
              .map((billableItem, visibleIndex) => {
                const originalIndex =
                  props.formState.queuedBillableItems.indexOf(billableItem);
                const visibleCount = props.formState.queuedBillableItems.filter(
                  (i) => !i.isDeleted
                ).length;
                return (
                  <div
                    key={billableItem.key}
                    css={[style.multiBillingContainer, style.span3]}
                    data-testid="DiagnosticBilling|MultiBillingContainer"
                  >
                    <div css={style.multiBillingTopRow}>
                      <div css={style.cptCode}>
                        <InputTextField
                          label={props.t('CPT code')}
                          value={billableItem.cptCode}
                          onChange={(e) =>
                            props.dispatch({
                              index: originalIndex,
                              type: 'SET_MULTI_CPT_CODE',
                              cptCode: e.target.value,
                            })
                          }
                          inputType="text"
                          optional
                          invalid={
                            props.isValidationCheckAllowed &&
                            billableItem.cptCode.length > 0 &&
                            billableItem.cptCode.length !== 5
                          }
                          kitmanDesignSystem
                        />
                      </div>
                      <div css={style.billableToggle}>
                        <ToggleSwitch
                          label={props.t('Bill diagnostic')}
                          isSwitchedOn={billableItem.isBillable}
                          toggle={() => {
                            props.dispatch({
                              index: originalIndex,
                              type: 'SET_MULTI_IS_BILLABLE',
                              isBillable: !billableItem.isBillable,
                            });
                          }}
                          kitmanDesignSystem
                        />
                      </div>
                      {isMultipleCpt && visibleIndex === visibleCount - 1 && (
                        <div css={style.addAnother}>
                          <TextButton
                            data-testid="DiagnosticActions|AddAnother"
                            text={props.t('Add another')}
                            type="subtle"
                            onClick={() => {
                              props.dispatch({
                                type: 'ADD_ANOTHER_BILLABLE_ITEM',
                              });
                            }}
                            kitmanDesignSystem
                          />
                        </div>
                      )}
                      {isMultipleCpt && visibleCount > 1 && (
                        <div css={style.removeMultiCPT}>
                          <TextButton
                            onClick={() =>
                              props.dispatch({
                                type: 'REMOVE_MULTI_CPT',
                                index: originalIndex,
                              })
                            }
                            iconBefore="icon-bin"
                            type="subtle"
                            kitmanDesignSystem
                          />
                        </div>
                      )}
                    </div>
                    {billableItem.isBillable && !isBillingExtraFields && (
                      <div css={style.billingContainerNoExtraFields}>
                        <div css={style.amountPaidInsuranceNoExtraFields}>
                          <InputTextField
                            label={props.t('Amount paid by insurance')}
                            value={billableItem.amountPaidInsurance}
                            onChange={(e) =>
                              props.dispatch({
                                index: originalIndex,
                                type: 'SET_MULTI_AMOUNT_PAID_INSURANCE',
                                amountPaidInsurance: e.target.value,
                              })
                            }
                            inputType="number"
                            optional
                            kitmanDesignSystem
                          />
                        </div>

                        <div css={style.amountPaidAthleteNoExtraFields}>
                          <InputTextField
                            label={props.t('Amount paid by athlete')}
                            value={billableItem.amountPaidAthlete}
                            onChange={(e) =>
                              props.dispatch({
                                index: originalIndex,
                                type: 'SET_MULTI_AMOUNT_PAID_ATHLETE',
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
                    {billableItem.isBillable && isBillingExtraFields && (
                      <>
                        <div css={style.amountCharged}>
                          <InputTextField
                            label={props.t('Amount charged')}
                            value={billableItem.amountCharged}
                            onChange={(e) =>
                              props.dispatch({
                                index: originalIndex,
                                type: 'SET_MULTI_AMOUNT_CHARGED',
                                amountCharged: e.target.value,
                              })
                            }
                            inputType="number"
                            optional
                            kitmanDesignSystem
                          />
                        </div>

                        <div css={style.discountOrReduction}>
                          <InputTextField
                            label={props.t('Discount/ reduction')}
                            value={billableItem.discountOrReduction}
                            onChange={(e) =>
                              props.dispatch({
                                index: originalIndex,
                                type: 'SET_MULTI_DISCOUNT_OR_REDUCTION',
                                discountOrReduction: e.target.value,
                              })
                            }
                            inputType="number"
                            optional
                            kitmanDesignSystem
                          />
                        </div>

                        <div css={style.amountPaidInsurance}>
                          <InputTextField
                            label={props.t('Amount insurance paid')}
                            value={billableItem.amountPaidInsurance}
                            onChange={(e) =>
                              props.dispatch({
                                index: originalIndex,
                                type: 'SET_MULTI_AMOUNT_PAID_INSURANCE',
                                amountPaidInsurance: e.target.value,
                              })
                            }
                            inputType="number"
                            optional
                            kitmanDesignSystem
                          />
                        </div>

                        <div css={style.amountDue}>
                          <InputTextField
                            label={props.t('Amount due')}
                            value={billableItem.amountDue}
                            onChange={(e) =>
                              props.dispatch({
                                index: originalIndex,
                                type: 'SET_MULTI_AMOUNT_DUE',
                                amountDue: e.target.value,
                              })
                            }
                            inputType="number"
                            optional
                            kitmanDesignSystem
                          />
                        </div>

                        <div css={style.amountPaidAthlete}>
                          <InputTextField
                            label={props.t('Amount athlete paid')}
                            value={billableItem.amountPaidAthlete}
                            onChange={(e) =>
                              props.dispatch({
                                index: originalIndex,
                                type: 'SET_MULTI_AMOUNT_PAID_ATHLETE',
                                amountPaidAthlete: e.target.value,
                              })
                            }
                            inputType="number"
                            optional
                            kitmanDesignSystem
                          />
                        </div>

                        <div css={style.datePaidDate}>
                          <DatePicker
                            label={props.t('Date paid')}
                            onDateChange={(date) => {
                              props.dispatch({
                                index: originalIndex,
                                type: 'SET_MULTI_DATE_PAID_DATE',
                                datePaidDate: moment(date).format(
                                  DateFormatter.dateTransferFormat
                                ),
                              });
                            }}
                            value={
                              billableItem.datePaidDate
                                ? moment(billableItem.datePaidDate)
                                : null
                            }
                            optional
                            disabled={props.requestStatus === 'PENDING'}
                            kitmanDesignSystem
                          />
                        </div>
                      </>
                    )}
                    <hr css={[style.hr, style.span3]} />
                  </div>
                );
              })}
          </div>
        )}
        {props.formState.queuedAttachmentTypes?.includes('FILE') &&
          !props.isEditing && (
            <>
              <div css={[style.fileAttachmentContainer, style.gridRow12]}>
                {props.renderFileUploadArea()}

                <hr css={style.hr} />
              </div>
            </>
          )}
        {props.formState.diagnosticType &&
          props.permissions.medical.notes.canCreate &&
          !props.isEditing &&
          (showAnnotationDatePicker
            ? props.formState.queuedAttachmentTypes?.includes('NOTE')
            : true) && (
            <div css={[style.gridRow9, style.span2]}>
              {showAnnotationDatePicker && renderAnnotationDatePicker()}
              <div css={style.note}>
                <RichTextEditor
                  label={props.t('Note')}
                  value={props.formState.annotationContent || ''}
                  onChange={(annotationContent) =>
                    props.dispatch({
                      type: 'SET_NOTE_CONTENT',
                      annotationContent,
                    })
                  }
                  disabled={props.requestStatus === 'PENDING'}
                  optionalText="optional"
                  kitmanDesignSystem
                  t={props.t}
                />
              </div>
              {!showAnnotationDatePicker && (
                <>
                  <div css={style.noteVisibility}>
                    <Select
                      label={props.t('Visibility')}
                      onChange={(noteVisibilityId) => {
                        props.dispatch({
                          type: 'SET_NOTE_VISIBILITY',
                          noteVisibilityId,
                        });
                      }}
                      options={[
                        {
                          label: props.t('Default visibility'),
                          value: 'DEFAULT',
                        },
                        { label: props.t('Doctors'), value: 'DOCTORS' },
                        {
                          label: props.t('Psych team'),
                          value: 'PSYCH_TEAM',
                        },
                      ]}
                      value={props.formState.restrictAccessTo}
                      isDisabled={
                        props.requestStatus === 'PENDING' ||
                        props.initialDataRequestStatus === 'FAILURE'
                      }
                    />
                  </div>
                  <hr css={style.hr} />
                </>
              )}
            </div>
          )}
        {props.formState.queuedAttachmentTypes?.includes('LINK') &&
          !props.isEditing && (
            <div css={[style.linkContainer, style.gridRow11]}>
              <div css={[style.linksHeader, style.span3]}>
                <h3>{props.t('Links')}</h3>
                <TextButton
                  onClick={() => {
                    props.dispatch({ type: 'CLEAR_LINK_ATTACHMENT' });
                    props.setIsLinkValidationCheckAllowed(false);
                  }}
                  disabled={props.requestStatus === 'PENDING'}
                  iconBefore="icon-bin"
                  type="subtle"
                  kitmanDesignSystem
                />
              </div>
              <div css={style.linkTitle}>
                <InputTextField
                  label={props.t('Title')}
                  value={props.formState.linkTitle || ''}
                  onChange={(e) => {
                    props.dispatch({
                      type: 'SET_LINK_TITLE',
                      linkTitle: e.target.value,
                    });
                  }}
                  disabled={props.requestStatus === 'PENDING'}
                  invalid={
                    props.isLinkValidationCheckAllowed &&
                    props.formState.linkTitle.length === 0
                  }
                  kitmanDesignSystem
                />
              </div>
              <div css={style.linkUri}>
                <InputTextField
                  label={props.t('Link')}
                  value={props.formState.linkUri || ''}
                  onChange={(e) => {
                    props.dispatch({
                      type: 'SET_LINK_URI',
                      linkUri: e.target.value,
                    });
                  }}
                  disabled={props.requestStatus === 'PENDING'}
                  invalid={
                    props.isLinkValidationCheckAllowed &&
                    !isValidUrlNoWhitespace(props.formState.linkUri) &&
                    props.formState.linkUri.length >= 0
                  }
                  kitmanDesignSystem
                />
              </div>
              <div css={style.linkAddButton}>
                <TextButton
                  text={props.t('Add')}
                  type="secondary"
                  onClick={props.onSaveLink}
                  isLoading={props.requestStatus === 'PENDING'}
                  kitmanDesignSystem
                />
              </div>
              {props.formState.queuedLinks.length > 0 && (
                <div css={style.span3}>
                  {props.formState.queuedLinks.map((queuedLink) => {
                    const textForURI = queuedLink.uri.startsWith('//')
                      ? queuedLink.uri.substring(2)
                      : queuedLink.uri;
                    return (
                      <div css={style.linkRender} key={queuedLink.id}>
                        <TextButton
                          onClick={() =>
                            props.dispatch({
                              type: 'REMOVE_QUEUED_LINK',
                              id: queuedLink.id,
                            })
                          }
                          iconBefore="icon-bin"
                          type="subtle"
                          kitmanDesignSystem
                        />
                        <span>{queuedLink.title}</span>-
                        <a
                          href={queuedLink.uri}
                          css={style.attachmentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {' '}
                          {textForURI}
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
              <hr css={[style.hr, style.span3]} />
            </div>
          )}
      </div>
      {showAnnotationDatePicker && !props.isEditing && (
        <div id="diagnosticSidePanelNonRedoxOrg">
          {props.permissions.medical.notes.canCreate && (
            <div
              css={[
                style.gridRow9,
                style.span2,
                style.fixedVisibilityContainer,
              ]}
            >
              <div css={style.noteVisibility}>
                <Select
                  label={props.t('Visibility')}
                  onChange={(noteVisibilityId) => {
                    props.dispatch({
                      type: 'SET_NOTE_VISIBILITY',
                      noteVisibilityId,
                    });
                  }}
                  options={[
                    {
                      label: props.t('Default visibility'),
                      value: 'DEFAULT',
                    },
                    { label: props.t('Doctors'), value: 'DOCTORS' },
                    {
                      label: props.t('Psych team'),
                      value: 'PSYCH_TEAM',
                    },
                  ]}
                  value={props.formState.restrictAccessTo}
                  isDisabled={
                    props.requestStatus === 'PENDING' ||
                    props.initialDataRequestStatus === 'FAILURE'
                  }
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

const NonRedoxOrgFormTranslated: ComponentType<Props> =
  withNamespaces()(NonRedoxOrgForm);
export default NonRedoxOrgFormTranslated;
