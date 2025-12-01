// @flow
import type { ComponentType, Node } from 'react';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import {
  DatePicker,
  InputTextField,
  Select,
  SegmentedControl,
  RichTextEditorAlt as RichTextEditor,
  TextButton,
  TooltipMenu,
} from '@kitman/components';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { getOrderProviders } from '@kitman/services';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { RequestStatus, Dispatch } from '@kitman/common/src/types';
import { getIssueIds } from '@kitman/modules/src/Medical/shared/utils';
import AthleteConstraints from '@kitman/modules/src/Medical/shared/components/AthleteConstraints';
import DiagnosticTypeSelect from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/components/DiagnosticTypeSelect';
import { AskOnEntryComponentTranslated as AskOnEntryComponent } from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/components/AskOnEntryQuestions';
import { sortQuestionsById } from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/utils/mappers';
import { isValidUrlNoWhitespace } from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/utils/validators';
import type {
  MedicalLocationOption,
  OptionWithOptional,
} from '@kitman/modules/src/Medical/shared/types/medical/Diagnostic';
import style from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/styles';
import { type OrderProviderType } from '@kitman/services/src/services/medical/getOrderProviders';
import type { SelectOption } from '@kitman/components/src/FavoriteAsyncSelect';
import type { SetState } from '@kitman/common/src/types/react';
import type { FormState } from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/hooks/useDiagnosticForm';
import type { EnrichedAthleteIssue } from '@kitman/modules/src/Medical/shared/hooks/useEnrichedAthletesIssues';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import type { Organisation } from '@kitman/services/src/services/getOrganisation';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { BodyArea } from '@kitman/services/src/services/medical/clinicalImpressions';

type Props = {
  isPastAthlete?: boolean,
  athleteData?: AthleteData,
  formState: FormState,
  isValidationCheckAllowed: boolean,
  isEditing: boolean,
  requestStatus: RequestStatus,
  requestIssuesStatus: RequestStatus,
  organisation: Organisation,
  orderProviders: OrderProviderType,
  isAthleteSelectable: boolean,
  athleteId?: ?number,
  permissions: PermissionsType,
  editorRefs: { current: Array<any> },
  isMultiLinkValidationCheckAllowed: Array<boolean>,
  diagnosticGroupSets: Array<SelectOption>,
  bodyAreas: Array<BodyArea>,

  squadAthletes: Array<Option>,
  medicalLocations?: Array<MedicalLocationOption>,
  enrichedAthleteIssues: Array<EnrichedAthleteIssue>,
  injuryIllnessReasonId?: ?number,

  dispatch: Dispatch<any>,
  setOrderProviders: SetState<OrderProviderType>,
  setRequestStatus: SetState<RequestStatus>,
  setIsMultiLinkValidationCheckAllowed: SetState<Array<boolean>>,
  shouldDisableEditing: () => boolean,
  onAthleteChange: (athleteId: number) => void,
  getDiagnosticReasonsOptions: () => Array<OptionWithOptional>,
  getAssociatedInjuryIllnessValues: () => Array<string>,
  isAssociatedRelatedInjuryIllnessValid: () => boolean,
  renderFileUploadArea: (index?: number) => Node,
  onSaveMultiLink: (index: number) => void,
  getSelectOption: (idx: number) => Option | Array<Option> | null,
};

const RedoxOrgForm = (props: I18nProps<Props>) => {
  const isPlayerMovementAwareDatePicker = window.getFlag(
    'player-movement-aware-datepicker'
  );
  const isMultiFaveSelect = window.getFlag('multi-fave-select');

  const setSquadAthleteOptions = () => {
    if (props.isPastAthlete) {
      return [
        {
          label: props.athleteData?.fullname,
          value: props.formState?.athleteId,
        },
      ];
    }
    return props.squadAthletes;
  };

  const renderDiagnosticOrderDate = (index: number) => {
    return (
      <AthleteConstraints athleteId={props.formState?.athleteId}>
        {({ lastActivePeriod, isLoading }) => (
          <div css={[style.multiDateOfDiagnostic]}>
            <DatePicker
              label={props.t('Diagnostic order date')}
              onDateChange={(date) => {
                props.dispatch({
                  type: 'SET_MULTI_ORDER_DATE',
                  index,
                  orderDate: moment(date).format(
                    DateFormatter.dateTransferFormat
                  ),
                });
                if (
                  props.formState?.queuedDiagnostics?.[index]?.diagnosticDate <
                  moment(date).format(DateFormatter.dateTransferFormat)
                ) {
                  props.dispatch({
                    type: 'SET_MULTI_ORDER_APPOINTMENT_DATE',
                    index,
                    diagnosticDate: '',
                  });
                }
              }}
              value={
                props.formState?.queuedDiagnostics?.[index]?.orderDate
                  ? moment(
                      props.formState?.queuedDiagnostics?.[index]?.orderDate
                    )
                  : null
              }
              invalid={
                props.isValidationCheckAllowed &&
                !props.formState?.queuedDiagnostics?.[index]?.orderDate
              }
              disabled={
                isLoading ||
                props.requestStatus === 'PENDING' ||
                props.shouldDisableEditing?.() ||
                !props.formState?.athleteId
              }
              maxDate={lastActivePeriod.end}
              minDate={lastActivePeriod.start}
              kitmanDesignSystem
            />
          </div>
        )}
      </AthleteConstraints>
    );
  };

  const renderDiagnosticOrderDateNew = (index: number) => {
    return (
      <MovementAwareDatePicker
        athleteId={props.formState?.athleteId ?? undefined}
        value={
          props.formState?.queuedDiagnostics?.[index]?.orderDate
            ? moment(props.formState?.queuedDiagnostics?.[index]?.orderDate)
            : null
        }
        onChange={(date) => {
          props.dispatch({
            type: 'SET_MULTI_ORDER_DATE',
            index,
            orderDate: moment(date).format(DateFormatter.dateTransferFormat),
          });
          if (
            props.formState?.queuedDiagnostics?.[index]?.diagnosticDate <
            moment(date).format(DateFormatter.dateTransferFormat)
          ) {
            props.dispatch({
              type: 'SET_MULTI_ORDER_APPOINTMENT_DATE',
              index,
              diagnosticDate: '',
            });
          }
        }}
        name="DiagnosticOrderDate"
        inputLabel={props.t('Diagnostic order date')}
        isInvalid={
          props.isValidationCheckAllowed &&
          !props.formState?.queuedDiagnostics?.[index]?.orderDate
        }
        disableFuture
        width="auto"
        kitmanDesignSystem
      />
    );
  };

  const renderDiagnosticAppointmentDate = (index: number) => {
    return (
      <AthleteConstraints athleteId={props.formState?.athleteId} disableMaxDate>
        {({ lastActivePeriod, isLoading, organisationStatus }) => (
          <div
            css={[style.multiDateOfAppointment]}
            data-testid="AddDiagnosticSidePanel|AppointmentDate"
          >
            <DatePicker
              label={props.t('Diagnostic appt. date')}
              onDateChange={(date) => {
                props.dispatch({
                  type: 'SET_MULTI_ORDER_APPOINTMENT_DATE',
                  index,
                  diagnosticDate: moment(date).format(
                    DateFormatter.dateTransferFormat
                  ),
                });
              }}
              value={
                props.formState?.queuedDiagnostics?.[index]?.diagnosticDate
                  ? moment(
                      props.formState?.queuedDiagnostics?.[index]
                        ?.diagnosticDate
                    )
                  : null
              }
              invalid={
                props.isValidationCheckAllowed &&
                !props.formState?.queuedDiagnostics?.[index]?.diagnosticDate
              }
              minDate={props.formState?.queuedDiagnostics?.[index]?.orderDate}
              maxDate={
                organisationStatus === 'PAST_ATHLETE'
                  ? lastActivePeriod.end
                  : null
              }
              disabled={
                isLoading ||
                props.requestStatus === 'PENDING' ||
                !props.formState?.queuedDiagnostics?.[index]?.orderDate ||
                props.shouldDisableEditing?.() ||
                !props.formState?.athleteId
              }
              kitmanDesignSystem
            />
          </div>
        )}
      </AthleteConstraints>
    );
  };

  const renderDiagnosticAppointmentDateNew = (index: number) => {
    const orderDate = props.formState?.queuedDiagnostics?.[index]?.orderDate
      ? moment(props.formState?.queuedDiagnostics?.[index]?.orderDate)
      : null;

    return (
      <MovementAwareDatePicker
        athleteId={props.formState?.athleteId ?? undefined}
        value={
          props.formState?.queuedDiagnostics?.[index]?.diagnosticDate
            ? moment(
                props.formState?.queuedDiagnostics?.[index]?.diagnosticDate
              )
            : null
        }
        onChange={(date) => {
          props.dispatch({
            type: 'SET_MULTI_ORDER_APPOINTMENT_DATE',
            index,
            diagnosticDate: moment(date).format(
              DateFormatter.dateTransferFormat
            ),
          });
        }}
        inputLabel={props.t('Diagnostic appt. date')}
        name="DiagnosticApptDate"
        disabled={
          !props.formState?.queuedDiagnostics?.[index]?.orderDate ||
          props.shouldDisableEditing?.() ||
          !props.formState?.athleteId
        }
        isInvalid={
          props.isValidationCheckAllowed &&
          !props.formState?.queuedDiagnostics?.[index]?.diagnosticDate
        }
        minDate={orderDate}
        width="auto"
        kitmanDesignSystem
      />
    );
  };

  const medicalLocationOptions = () => {
    const orderSelected = props.formState?.redoxOrderStatus === 1;
    const locations =
      Array.isArray(props.medicalLocations) && props.medicalLocations.length > 0
        ? props.medicalLocations
        : [];

    if (orderSelected) {
      return locations.filter((org) => org.redoxOrderable);
    }
    return locations;
  };

  const updateDiagnosticProviders = (orderProviderData: OrderProviderType) => {
    if (isMultiFaveSelect && !props.isEditing) {
      const isInternalProvider = orderProviderData?.staff_providers?.find(
        (user) =>
          user.sgid === props.formState.queuedDiagnostics[0].orderProviderSGID
      );
      if (!isInternalProvider) {
        props.dispatch({
          type: 'SET_MULTI_ORDER_PROVIDER_SGID',
          index: 0,
          orderProviderSGID: null,
        });
      }
    } else {
      props.formState.queuedDiagnostics.forEach((diagnostic, index) => {
        const isInternalProvider = orderProviderData?.staff_providers?.find(
          (user) => user.sgid === diagnostic.orderProviderSGID
        );

        if (!isInternalProvider) {
          props.dispatch({
            type: 'SET_MULTI_ORDER_PROVIDER_SGID',
            index,
            orderProviderSGID: null,
          });
        }
      });
    }
  };

  return (
    <div css={style.contentIteration2}>
      {!props.isEditing && props.organisation?.redox_orderable && (
        <div css={[style.logOrderButton, style.gridRow1]}>
          <SegmentedControl
            buttons={[
              { name: props.t('Log'), value: 0 },
              { name: props.t('Order'), value: 1 },
            ]}
            maxWidth={130}
            onClickButton={(id) => {
              props.dispatch({
                type: 'SET_REDOX_ORDER_STATUS',
                redoxOrderStatus: id,
              });

              if (id === 1 && props.formState?.locationId) {
                const locationOrdeable = props.medicalLocations
                  ?.filter((org) => org.redoxOrderable)
                  ?.find(
                    (location) => location.value === props.formState?.locationId
                  );
                if (!locationOrdeable) {
                  updateDiagnosticProviders(props.orderProviders);
                  props.dispatch({
                    type: 'SET_MULTI_LOCATION_ID',
                    locationId: null,
                    isMultiSelect: isMultiFaveSelect && !props.isEditing,
                  });
                }
              }
            }}
            isSeparated
            color={colors.grey_200}
            selectedButton={props.formState.redoxOrderStatus}
          />
          <hr css={style.hr} />
        </div>
      )}
      <div
        css={[
          style.gridRow2,
          style.multiPlayerOrLocationContainer,
          style.span2,
        ]}
      >
        <div css={[style.multiPlayer]}>
          <Select
            label={props.t('Player')}
            onChange={(id) => props.onAthleteChange?.(id)}
            value={props.formState?.athleteId}
            options={setSquadAthleteOptions()}
            isDisabled={
              (!props.isAthleteSelectable && !!props.athleteId) ||
              props.requestStatus === 'PENDING'
            }
            invalid={
              props.isValidationCheckAllowed && !props.formState?.athleteId
            }
          />
        </div>
      </div>
      <div
        css={[
          style.gridRow3,
          style.multiPlayerOrLocationContainer,
          style.span2,
        ]}
      >
        <div css={[style.multiLocation]}>
          <Select
            label={props.t('Company')}
            onChange={(locationId) => {
              getOrderProviders({
                locationId,
                activeUsersOnly: true,
                npi: true,
              })
                .then((orderProviderData) => {
                  props.setOrderProviders?.(orderProviderData);

                  updateDiagnosticProviders(orderProviderData);
                })
                .catch(() => {
                  props.setRequestStatus?.('FAILURE');
                });
              props.dispatch({
                type: 'SET_MULTI_LOCATION_ID',
                locationId,
                isMultiSelect: isMultiFaveSelect && !props.isEditing,
              });
            }}
            value={props.formState?.locationId}
            options={medicalLocationOptions()}
            invalid={
              props.isValidationCheckAllowed && !props.formState?.locationId
            }
            isDisabled={
              props.requestStatus === 'PENDING' ||
              props.shouldDisableEditing?.()
            }
          />
        </div>
      </div>

      <hr css={[style.hr, style.gridRow4]} />
      <div css={[style.redoxReasonIssueContainer, style.gridRow5]}>
        <div css={[style.redoxReason, style.gridRow6]}>
          <Select
            label={props.t('Reason')}
            onChange={(reasonId) =>
              props.dispatch({
                type: 'SET_REASON_ID',
                reasonId,
              })
            }
            value={props.formState?.reasonId}
            options={props.getDiagnosticReasonsOptions?.() || []}
            isDisabled={
              props.requestStatus === 'PENDING' || !props.formState.locationId
            }
            invalid={
              props.isValidationCheckAllowed && !props.formState?.reasonId
            }
            appendToBody
          />
        </div>

        {(!props.formState?.athleteId ||
          props.enrichedAthleteIssues
            .slice(0, 3)
            .some((issue) => issue.options.length > 0) ||
          props.requestIssuesStatus === 'PENDING') && (
          <div css={[style.redoxLinkedIssue, style.gridRow6]}>
            <Select
              label={props.t('Related injury / illness')}
              onChange={(ids) => {
                const illnessIds = getIssueIds('Illness', ids);
                const injuryIds = getIssueIds('Injury', ids);
                const chronicIssueIds = getIssueIds('ChronicInjury', ids);
                props.dispatch({ type: 'SET_ILLNESS_IDS', illnessIds });
                props.dispatch({ type: 'SET_INJURY_IDS', injuryIds });
                props.dispatch({
                  type: 'SET_CHRONIC_IDS',
                  chronicIssueIds,
                });
              }}
              value={props.getAssociatedInjuryIllnessValues?.()}
              options={props.enrichedAthleteIssues || []}
              isMulti
              isDisabled={
                !props.formState?.athleteId ||
                props.requestStatus === 'PENDING' ||
                props.requestIssuesStatus === 'PENDING'
              }
              invalid={props.isAssociatedRelatedInjuryIllnessValid?.()}
              optional={
                props.formState?.reasonId !== props.injuryIllnessReasonId &&
                props.formState?.athleteId
              }
              appendToBody
            />
          </div>
        )}
      </div>
      <hr css={[style.hr, style.gridRow6]} />
      <div css={[style.gridRow7, style.span2]}>
        {(props.formState?.queuedDiagnostics || []).map((diagnostic, index) => {
          return (
            <div key={diagnostic.key}>
              {props.formState.queuedDiagnostics.length > 1 && (
                <div css={[style.linksHeader, style.span3]}>
                  <h3>
                    {props.t('Diagnostic {{orderNumber}}', {
                      orderNumber: index + 1,
                    })}
                  </h3>
                  <div css={style.buttons}>
                    {props.formState.queuedDiagnostics.length > 1 &&
                      !props.isEditing &&
                      isMultiFaveSelect &&
                      index === 0 && (
                        <div css={[style.setForAllButton]}>
                          <TextButton
                            text={props.t('Set for all')}
                            onClick={() => {
                              props.dispatch({
                                type: 'SET_FOR_ALL',
                              });
                            }}
                            disabled={props.requestStatus === 'PENDING'}
                            type="secondary"
                            kitmanDesignSystem
                          />
                        </div>
                      )}
                    <TextButton
                      onClick={() => {
                        props.dispatch({
                          type: 'REMOVE_MULTI_ORDER',
                          index,
                        });
                      }}
                      disabled={props.requestStatus === 'PENDING'}
                      iconBefore="icon-bin"
                      type="subtle"
                      kitmanDesignSystem
                    />
                  </div>
                </div>
              )}
              <div css={[style.gridRow1, style.PrescriberDateContainer]}>
                <div css={[style.multiPrescriber]}>
                  <Select
                    label={props.t('Provider')}
                    onChange={(orderProviderSGID) =>
                      props.dispatch({
                        type: 'SET_MULTI_ORDER_PROVIDER_SGID',
                        index,
                        orderProviderSGID,
                      })
                    }
                    value={
                      props.formState.queuedDiagnostics[index].orderProviderSGID
                    }
                    options={[
                      {
                        value: 1,
                        label: 'Internal providers',
                        options:
                          props.orderProviders?.staff_providers?.map(
                            ({ sgid, fullname }) => ({
                              value: sgid,
                              label: fullname,
                            })
                          ) || [],
                      },
                      {
                        value: 2,
                        label: 'External providers',
                        options:
                          props.orderProviders?.location_providers?.map(
                            ({ sgid, fullname }) => ({
                              value: sgid,
                              label: fullname,
                            })
                          ) || [],
                      },
                    ]}
                    isGrouped
                    isDisabled={
                      props.requestStatus === 'PENDING' ||
                      !props.formState.locationId ||
                      props.shouldDisableEditing?.()
                    }
                    invalid={
                      props.isValidationCheckAllowed &&
                      !props.formState.queuedDiagnostics[index]
                        .orderProviderSGID
                    }
                  />
                </div>
                {isPlayerMovementAwareDatePicker ? (
                  <>
                    {renderDiagnosticOrderDateNew(index)}
                    {renderDiagnosticAppointmentDateNew(index)}
                  </>
                ) : (
                  <>
                    {renderDiagnosticOrderDate(index)}
                    {renderDiagnosticAppointmentDate(index)}
                  </>
                )}
              </div>
              <div
                css={[style.redoxTypeAppointmentDateContainer, style.gridRow2]}
              >
                <div css={[style.multiRedoxType]}>
                  <DiagnosticTypeSelect
                    label={props.t('Diagnostic type')}
                    diagnosticIndex={index}
                    formState={props.formState}
                    isMulti={!props.isEditing && isMultiFaveSelect}
                    value={props.getSelectOption?.(index)}
                    additionalGroupPayload={{
                      groupLabel: props.t('Order sets'),
                      options: props.diagnosticGroupSets,
                    }}
                    onTypeChange={(diagnosticType) => {
                      if (
                        diagnosticType?.type === 'order set' &&
                        diagnosticType?.options
                      ) {
                        props.dispatch({
                          type: 'SET_DIAGNOSTIC_TYPE_GROUP_SET',
                          diagnosticTypeGroupSet: diagnosticType.options,
                        });
                      }

                      if (
                        (diagnosticType?.type !== 'order set' &&
                          !isMultiFaveSelect) ||
                        props.isEditing
                      ) {
                        props.dispatch({
                          type: 'SET_MULTI_ORDER_TYPE',
                          index,
                          diagnosticType,
                        });
                      }
                      if (
                        diagnosticType?.type !== 'order set' &&
                        isMultiFaveSelect &&
                        !props.isEditing
                      ) {
                        props.dispatch({
                          type: 'SET_MULTI_DIAGNOSTICS_TYPE',
                          index,
                          diagnosticTypes: diagnosticType,
                        });
                      }
                    }}
                    invalid={
                      (props.isValidationCheckAllowed &&
                        !props.formState.queuedDiagnostics[index]
                          ?.diagnosticType &&
                        props.isEditing) ||
                      (props.isValidationCheckAllowed &&
                        !props.formState.queuedDiagnostics[index]
                          ?.diagnosticType &&
                        !isMultiFaveSelect) ||
                      (props.isValidationCheckAllowed &&
                        !props.formState.queuedDiagnostics[index]
                          ?.diagnosticTypes.length &&
                        !props.isEditing &&
                        isMultiFaveSelect)
                    }
                    shouldDisableEditing={props.shouldDisableEditing}
                  />
                </div>
              </div>
              {props.formState.queuedDiagnostics[index]?.diagnosticType
                ?.diagnostic_type_questions && (
                <AskOnEntryComponent
                  isValidationCheckAllowed={props.isValidationCheckAllowed}
                  formState={props.formState}
                  questions={sortQuestionsById(
                    props.formState.queuedDiagnostics[index]?.diagnosticType
                      ?.diagnostic_type_questions || []
                  )}
                  index={index}
                  choiceOnChange={({ option }) => {
                    props.dispatch({
                      type: 'SET_DIAGNOSTIC_TYPE_ANSWER',
                      diagnosticIndex: index,
                      answer: {
                        answerIndex: option.askOnEntryIndex,
                        questionTypeId: option.question.id,
                        questionType: option.questionType,
                        value: option.value,
                        optionalTextRequired: option.optional_text,
                        label: option.label,
                        required: option.question.required,
                      },
                    });
                  }}
                  optionalTextInputOnChange={({
                    e,
                    askOnEntryIndex,
                    question,
                  }) => {
                    props.dispatch({
                      type: 'SET_OPTIONAL_TEXT_ANSWER',
                      diagnosticIndex: index,
                      answer: {
                        answerIndex: askOnEntryIndex,
                        questionTypeId: question.id,
                        optionalText: e.target.value,
                        optionalTextRequired: true,
                      },
                    });
                  }}
                />
              )}
              <div
                css={[
                  style.multiOrderBodyAreaLateralityContainer,
                  style.gridRow4,
                ]}
              >
                <div css={[style.multiRedoxBodyArea]}>
                  <Select
                    label={props.t('Body area')}
                    value={props.formState.queuedDiagnostics[index].bodyAreaId}
                    onChange={(bodyAreaId) =>
                      props.dispatch({
                        type: 'SET_MULTI_BODY_AREA_ID',
                        index,
                        bodyAreaId,
                      })
                    }
                    options={
                      props.bodyAreas?.map(({ id, name }) => ({
                        value: id,
                        label: name,
                      })) || []
                    }
                    isDisabled={
                      props.requestStatus === 'PENDING' ||
                      props.shouldDisableEditing?.()
                    }
                    appendToBody
                    optional
                  />
                </div>
                {props.formState.queuedDiagnostics[index]?.diagnosticType
                  ?.laterality_required && (
                  <div>
                    <SegmentedControl
                      styles={{ label: { marginBottom: '6px' } }}
                      label={props.t('Laterality')}
                      buttons={[
                        { name: 'Left', value: 0 },
                        { name: 'Right', value: 1 },
                        { name: 'Both', value: 2 },
                      ]}
                      onClickButton={(id) => {
                        props.dispatch({
                          type: 'SET_MULTI_LATERALITY',
                          lateralityId: id,
                          index,
                        });
                      }}
                      selectedButton={
                        props.formState.queuedDiagnostics[index].lateralityId
                      }
                      invalid={
                        props.isValidationCheckAllowed &&
                        props.formState.queuedDiagnostics[index]
                          .lateralityId !== 0 &&
                        props.formState.queuedDiagnostics[index]
                          .lateralityId !== 2 &&
                        props.formState.queuedDiagnostics[index]
                          .lateralityId !== 1
                      }
                      isDisabled={props.shouldDisableEditing?.()}
                      color={colors.grey_200}
                    />
                  </div>
                )}
              </div>
              {!props.isEditing && <hr css={[style.hr, style.gridRow5]} />}
              {!props.isEditing &&
                props.permissions.medical.notes.canCreate && (
                  <div css={[style.gridRow6, style.span2]}>
                    <div css={style.note}>
                      <RichTextEditor
                        label={props.t('Note')}
                        value={
                          props.formState.queuedDiagnostics[index]
                            .annotationContent
                        }
                        forwardedRef={(el) => {
                          if (props.editorRefs && props.editorRefs.current) {
                            // eslint-disable-next-line no-param-reassign
                            props.editorRefs.current[index] = el;
                          }
                        }}
                        onChange={(annotationContent) =>
                          props.dispatch({
                            type: 'SET_MULTI_NOTE_CONTENT',
                            index,
                            annotationContent,
                          })
                        }
                        disabled={props.requestStatus === 'PENDING'}
                        optionalText="Optional"
                        kitmanDesignSystem
                        t={props.t}
                      />
                    </div>
                  </div>
                )}
              <hr css={[style.hr, style.gridRow7]} />
              {props.formState.queuedDiagnostics[
                index
              ]?.queuedAttachmentTypes?.includes('LINK') && (
                <div css={[style.linkContainer, style.gridRow8]}>
                  <div css={[style.linksHeader, style.span3]}>
                    <h3>{props.t('Links')}</h3>
                    <TextButton
                      onClick={() => {
                        props.dispatch({
                          type: 'REMOVE_MULTI_ATTACHMENT_TYPE',
                          index,
                          queuedAttachmentType: 'LINK',
                        });
                        props.dispatch({
                          type: 'CLEAR_MULTI_QUEUED_LINKS',
                          index,
                        });
                        props.dispatch({
                          type: 'SET_MULTI_LINK_URI',
                          index,
                          linkUri: '',
                        });
                        props.dispatch({
                          type: 'SET_MULTI_LINK_TITLE',
                          index,
                          linkTitle: '',
                        });
                        props.setIsMultiLinkValidationCheckAllowed?.((prev) => {
                          const copyPrevState = prev.slice();
                          copyPrevState[index] = false;
                          return copyPrevState;
                        });
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
                      value={
                        props.formState.queuedDiagnostics[index].linkTitle || ''
                      }
                      onChange={(e) => {
                        props.dispatch({
                          type: 'SET_MULTI_LINK_TITLE',
                          index,
                          linkTitle: e.target.value,
                        });
                      }}
                      disabled={props.requestStatus === 'PENDING'}
                      invalid={
                        props.isMultiLinkValidationCheckAllowed?.[index] ===
                          true &&
                        props.formState.queuedDiagnostics[index].linkTitle
                          .length === 0
                      }
                      kitmanDesignSystem
                    />
                  </div>
                  <div css={style.linkUri}>
                    <InputTextField
                      label={props.t('Link')}
                      value={
                        props.formState.queuedDiagnostics[index].linkUri || ''
                      }
                      onChange={(e) => {
                        props.dispatch({
                          type: 'SET_MULTI_LINK_URI',
                          index,
                          linkUri: e.target.value,
                        });
                      }}
                      disabled={props.requestStatus === 'PENDING'}
                      invalid={
                        props.isMultiLinkValidationCheckAllowed?.[index] ===
                          true &&
                        !isValidUrlNoWhitespace(
                          props.formState.queuedDiagnostics[index].linkUri
                        )
                      }
                      kitmanDesignSystem
                    />
                  </div>
                  <div css={style.linkAddButton}>
                    <TextButton
                      text={props.t('Add')}
                      type="secondary"
                      onClick={() => props.onSaveMultiLink?.(index)}
                      isLoading={props.requestStatus === 'PENDING'}
                      kitmanDesignSystem
                    />
                  </div>
                  {props.formState.queuedDiagnostics[index].queuedLinks.length >
                    0 && (
                    <div css={style.span3}>
                      {props.formState.queuedDiagnostics[index].queuedLinks.map(
                        (queuedLink) => {
                          const textForURI = queuedLink.uri.startsWith('//')
                            ? queuedLink.uri.substring(2)
                            : queuedLink.uri;
                          return (
                            <div css={style.linkRender} key={queuedLink.id}>
                              <TextButton
                                onClick={() =>
                                  props.dispatch({
                                    type: 'REMOVE_MULTI_QUEUED_LINK',
                                    index,
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
                        }
                      )}
                    </div>
                  )}
                  <hr css={[style.hr, style.span3]} />
                </div>
              )}
              {props.formState.queuedDiagnostics[
                index
              ]?.queuedAttachmentTypes?.includes('FILE') &&
                !props.isEditing && (
                  <>
                    <div css={[style.fileAttachmentContainer, style.gridRow9]}>
                      {props.renderFileUploadArea?.(index)}
                      <hr css={style.hr} />
                    </div>
                  </>
                )}
              {!props.isEditing && (
                <div css={[style.attachmentsIteration2, style.gridRow10]}>
                  <TooltipMenu
                    tooltipTriggerElement={
                      <TextButton
                        text={props.t('Attach')}
                        type="secondary"
                        iconAfter="icon-chevron-down"
                        kitmanDesignSystem
                      />
                    }
                    menuItems={[
                      {
                        description: props.t('File'),
                        onClick: () =>
                          props.dispatch({
                            type: 'UPDATE_MULTI_ATTACHMENT_TYPE',
                            index,
                            queuedAttachmentType: 'FILE',
                          }),
                      },
                      {
                        description: props.t('Link'),
                        onClick: () =>
                          props.dispatch({
                            type: 'UPDATE_MULTI_ATTACHMENT_TYPE',
                            index,
                            queuedAttachmentType: 'LINK',
                          }),
                      },
                    ]}
                    placement="bottom-start"
                    appendToParent
                    kitmanDesignSystem
                  />
                </div>
              )}
              <hr css={[style.hr, style.gridRow11]} />
            </div>
          );
        })}
      </div>
      {!props.isEditing && (
        <div css={[style.gridRow8]}>
          <TextButton
            data-testid="DiagnosticActions|AddAnotherDiagnostic"
            text={props.t('Add diagnostic type')}
            type="secondary"
            onClick={() => {
              props.dispatch({
                type: 'ADD_ANOTHER_MULTI_ORDER',
              });
            }}
            kitmanDesignSystem
          />
        </div>
      )}
    </div>
  );
};

const RedoxOrgFormTranslated: ComponentType<Props> =
  withNamespaces()(RedoxOrgForm);
export default RedoxOrgFormTranslated;
