// @flow
import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import moment from 'moment-timezone';
import { withNamespaces } from 'react-i18next';
import {
  AppStatus,
  SlidingPanelResponsive,
  Select,
  SegmentedControl,
  InputNumeric,
  TextButton,
  DatePicker,
  TooltipMenu,
  TimePicker,
  FileUploadArea,
} from '@kitman/components';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import type {
  SelectOption as Option,
  ButtonItem,
} from '@kitman/components/src/types';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import {
  saveConcussionTestResults,
  saveAttachmentLegacy as saveAttachment,
} from '@kitman/services';
import { checkInvalidFileTitles } from '@kitman/common/src/utils/fileHelper';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useIssue } from '../../contexts/IssueContext';
import useConcussionTestForm from './hooks/useConcussionTestResultsForm';
import useEnrichedAthletesIssues from '../../hooks/useEnrichedAthletesIssues';
import {
  emptyHTMLeditorContent,
  getIssueIds,
  getFormattedIssueIds,
  filterEnrichedIssueConcussions,
} from '../../utils';
import type {
  RequestStatus,
  ConcussionTestProtocol,
  SquadAthletesSelectOption,
} from '../../types';
import AthleteConstraints from '../AthleteConstraints';
import style from './styles';

type Props = {
  isOpen: boolean,
  testProtocol: ConcussionTestProtocol,
  formTypes: ?Array<ButtonItem>,
  testUnit?: 'cm' | 'in',
  isAthleteSelectable: boolean,
  squadAthletes: Array<SquadAthletesSelectOption>,
  examiners: Array<Option>,
  athleteId?: ?number,
  onFileUploadStart: Function,
  onFileUploadSuccess: Function,
  onFileUploadFailure: Function,
  initialDataRequestStatus: RequestStatus,
  onAssessmentAdded: Function,
  onClose: Function,
};

const AddConcussionTestResultsSidePanel = (props: I18nProps<Props>) => {
  const { issue, issueType } = useIssue();
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [requestIssuesStatus, setRequestIssuesStatus] =
    useState<RequestStatus>(null);
  const [isValidationCheckAllowed, setIsValidationCheckAllowed] =
    useState(false);

  const { formState, dispatch } = useConcussionTestForm(props.testProtocol);
  const { enrichedAthleteIssues, fetchAthleteIssues } =
    useEnrichedAthletesIssues({
      athleteId: props.athleteId,
      useOccurrenceId: true,
      detailedIssue: true,
      customIssueFilter: filterEnrichedIssueConcussions,
    });

  const updateInjuryIllnessIdValues = () => {
    if (!issue || issue.id == null) {
      dispatch({
        type: 'SET_INJURY_IDS',
        injuryIds: [],
      });

      dispatch({
        type: 'SET_ILLNESS_IDS',
        illnessIds: [],
      });
      return;
    }
    if (issueType === 'Injury') {
      dispatch({
        type: 'SET_INJURY_IDS',
        injuryIds: [issue.id],
      });
    }
    if (issueType === 'Illness') {
      dispatch({
        type: 'SET_ILLNESS_IDS',
        illnessIds: [issue.id],
      });
    }
  };

  useEffect(() => {
    updateInjuryIllnessIdValues();
  }, [issue, issue.id]);

  useEffect(() => {
    if (props.athleteId) {
      dispatch({
        type: 'SET_ATHLETE_ID',
        athleteId: props.athleteId,
      });
    }

    if (!props.isOpen) {
      setIsValidationCheckAllowed(false);
      dispatch({ type: 'CLEAR_FORM', testProtocol: props.testProtocol });
    }

    updateInjuryIllnessIdValues();
  }, [props.athleteId, props.isOpen]);

  useEffect(() => {
    dispatch({ type: 'CLEAR_FORM', testProtocol: props.testProtocol });
    if (props.athleteId) {
      dispatch({
        type: 'SET_ATHLETE_ID',
        athleteId: props.athleteId,
      });
    }
    updateInjuryIllnessIdValues();
  }, [props.testProtocol]);

  const onAthleteChange = (athleteId: number) => {
    dispatch({
      type: 'SET_ATHLETE_ID',
      athleteId,
    });

    setRequestIssuesStatus('PENDING');

    fetchAthleteIssues({
      selectedAthleteId: athleteId,
      useOccurrenceIdValue: true,
      includeDetailedIssue: true,
      issueFilter: filterEnrichedIssueConcussions,
      includeIssue: true,
      includeGrouped: true,
    })
      .then(() => setRequestIssuesStatus('SUCCESS'))
      .catch(() => {
        setRequestIssuesStatus('FAILURE');
      });
  };

  const saveConcussionTest = (attachmentIds) => {
    const commonResults = {
      attachment_ids: attachmentIds || [],
      type: formState.test_type,
      athlete_id: formState.athlete_id,
      examination: formState.examination_date,
      // Don't send injury / illness association if a baseline test
      injury_ids:
        formState.test_type === 'baseline'
          ? []
          : formState.injury_occurrence_ids,
      illness_ids:
        formState.test_type === 'baseline'
          ? []
          : formState.illness_occurrence_ids,
      examiner_id: formState.examiner_id,
    };

    const customResults =
      formState.type === 'KING-DEVICK'
        ? {
            score:
              formState.king_devick_score != null
                ? Number.parseFloat(formState.king_devick_score)
                : null,

            errors:
              formState.king_devick_errors != null
                ? Number.parseInt(formState.king_devick_errors, 10)
                : null,
          }
        : {
            distance1:
              formState.npc_distance_1 != null
                ? Number.parseFloat(formState.npc_distance_1)
                : null,

            distance2:
              formState.npc_distance_2 != null
                ? Number.parseFloat(formState.npc_distance_2)
                : null,

            distance3:
              formState.npc_distance_3 != null
                ? Number.parseFloat(formState.npc_distance_3)
                : null,

            average: formState.npc_average,
          };

    saveConcussionTestResults(props.testProtocol, {
      ...commonResults,
      ...customResults,
    })
      .then(
        () => {
          setRequestStatus('SUCCESS');
          props.onAssessmentAdded?.(props.testProtocol);
          props.onClose();
        },
        () => {
          setRequestStatus('FAILURE');
        }
      )
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
        const fileSize = fileSizeLabel(file.size, true);
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
    await Promise.all(queuedAttachments.map(performUpload)).then(
      (attachmentIds) => {
        saveConcussionTest(attachmentIds);
      }
    );
  };

  const onSave = async () => {
    setIsValidationCheckAllowed(true);

    const requiredFields = [formState.athlete_id, formState.examiner_id];

    // An injury or illness is required in the rtp modes
    if (
      (formState.test_type === 'start_of_rtp' ||
        formState.test_type === 'rtp_recurring') &&
      formState.injury_occurrence_ids.length === 0 &&
      formState.illness_occurrence_ids.length === 0
    ) {
      return;
    }

    if (formState.type === 'NPC') {
      if (
        formState.npc_distance_1 == null ||
        Number.isNaN(Number.parseFloat(formState.npc_distance_1)) ||
        formState.npc_distance_2 == null ||
        Number.isNaN(Number.parseFloat(formState.npc_distance_2)) ||
        formState.npc_distance_3 == null ||
        Number.isNaN(Number.parseFloat(formState.npc_distance_3))
      ) {
        return;
      }

      requiredFields.push(
        formState.npc_distance_1,
        formState.npc_distance_2,
        formState.npc_distance_3
      );
    } else {
      if (
        formState.king_devick_errors == null ||
        Number.isNaN(Number.parseInt(formState.king_devick_errors, 10)) ||
        formState.king_devick_score == null ||
        Number.isNaN(Number.parseFloat(formState.king_devick_score))
      ) {
        return;
      }

      requiredFields.push(
        formState.king_devick_errors,
        formState.king_devick_score
      );
    }

    const allRequiredFieldsAreValid = requiredFields.every(
      (item) => item != null && item !== '' && item !== emptyHTMLeditorContent
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

  return (
    <SlidingPanelResponsive
      width={659}
      title={
        props.testProtocol === 'NPC'
          ? props.t('Add near point of convergence (NPC) results')
          : props.t('Add King-Devick results')
      }
      onClose={props.onClose}
      animate
      isOpen={props.isOpen}
    >
      <div css={style.content}>
        <div
          css={style['grid-full']}
          data-testid="AddConcussionResultSidePanel|TestTypeSelector"
        >
          <SegmentedControl
            label={props.t('Type')}
            width="inline"
            buttons={props.formTypes || []}
            selectedButton={formState.test_type}
            onClickButton={(value) => {
              dispatch({
                type: 'SET_TEST_TYPE',
                testType: value,
              });
            }}
            isDisabled={requestStatus === 'PENDING'}
          />
        </div>
        <div
          css={style['grid-1/2']}
          data-testid="AddConcussionResultSidePanel|AthleteSelector"
        >
          <Select
            label={props.t('Athlete')}
            onChange={(id) => onAthleteChange(id)}
            value={formState.athlete_id}
            options={props.squadAthletes}
            isDisabled={
              (!props.isAthleteSelectable && !!props.athleteId) ||
              requestStatus === 'PENDING'
            }
            invalid={isValidationCheckAllowed && !formState.athlete_id}
          />
        </div>

        <div
          css={[style['grid-full'], style['grid-three-column']]}
          data-testid="AddConcussionResultSidePanel|ExaminationDate"
        >
          <AthleteConstraints athleteId={formState.athlete_id}>
            {({ lastActivePeriod }) => {
              return (
                <DatePicker
                  label={props.t('Date of examination')}
                  onDateChange={(date) => {
                    dispatch({
                      type: 'SET_EXAMINATION_DATE',
                      examinationDate: moment(date).format(dateTransferFormat),
                    });
                  }}
                  value={
                    formState.examination_date && formState.local_timezone
                      ? moment.tz(
                          formState.examination_date,
                          formState.local_timezone
                        )
                      : null
                  }
                  minDate={
                    window.featureFlags[
                      'player-movement-entity-concussion-test'
                    ] && lastActivePeriod.start
                  }
                  maxDate={
                    window.featureFlags[
                      'player-movement-entity-concussion-test'
                    ] && lastActivePeriod.end
                  }
                  invalid={
                    isValidationCheckAllowed && !formState.examination_date
                  }
                  disabled={requestStatus === 'PENDING'}
                  kitmanDesignSystem
                />
              );
            }}
          </AthleteConstraints>
          <TimePicker
            value={
              formState.examination_date && formState.local_timezone
                ? moment.tz(
                    formState.examination_date,
                    formState.local_timezone
                  )
                : null
            }
            label={props.t('Time of examination')}
            onChange={(time) => {
              dispatch({
                type: 'SET_EXAMINATION_TIME',
                examinationTime: time.format(dateTransferFormat),
              });
            }}
            disabled={requestStatus === 'PENDING'}
            kitmanDesignSystem
          />
          <Select
            appendToBody
            label={props.t('Timezone')}
            options={moment.tz.names().map((tzName) => ({
              value: tzName,
              label: tzName,
            }))}
            onChange={(timezone) => {
              dispatch({
                type: 'SET_LOCAL_TIMEZONE',
                localTimezone: timezone,
              });
            }}
            value={formState.local_timezone}
            data-testid="AddConcussionResultSidePanel|Timezone"
            invalid={isValidationCheckAllowed && !formState.local_timezone}
            isDisabled={requestStatus === 'PENDING'}
          />
        </div>

        <div
          css={style['grid-1/2']}
          data-testid="AddConcussionResultSidePanel|Examiner"
        >
          <Select
            label={props.t('Examiner')}
            onChange={(id) => {
              dispatch({
                type: 'SET_EXAMINER_ID',
                examinerId: id,
              });
            }}
            value={formState.examiner_id}
            options={props.examiners || []}
            isDisabled={requestStatus === 'PENDING'}
            invalid={isValidationCheckAllowed && !formState.examiner_id}
          />
        </div>
        {formState.test_type !== 'baseline' && (
          <div
            css={style['grid-2/2']}
            data-testid="AddConcussionResultSidePanel|AssociatedInjuries"
          >
            <Select
              label={props.t('Associated injury/ illness')}
              onChange={(ids) => {
                const illnessIds = getIssueIds('Illness', ids);
                const injuryIds = getIssueIds('Injury', ids);

                dispatch({ type: 'SET_ILLNESS_IDS', illnessIds });
                dispatch({ type: 'SET_INJURY_IDS', injuryIds });
              }}
              value={getFormattedIssueIds(
                formState.injury_occurrence_ids,
                formState.illness_occurrence_ids
              )}
              options={enrichedAthleteIssues}
              isMulti
              isDisabled={
                !formState.athlete_id ||
                issue?.id != null ||
                requestStatus === 'PENDING' ||
                requestIssuesStatus === 'PENDING'
              }
              optional={
                (!issue || issue.id == null) &&
                formState.test_type !== 'start_of_rtp' &&
                formState.test_type !== 'rtp_recurring'
              }
              invalid={
                isValidationCheckAllowed &&
                (formState.test_type === 'start_of_rtp' ||
                  formState.test_type === 'rtp_recurring') &&
                formState.injury_occurrence_ids.length === 0 &&
                formState.illness_occurrence_ids.length === 0
              }
            />
          </div>
        )}
        <hr css={style.hr} />
        {props.testProtocol === 'NPC' && formState.type === 'NPC' && (
          <div
            css={[style['grid-full'], style['grid-three-column']]}
            data-testid="AddConcussionResultSidePanel|NPCDistances"
          >
            <InputNumeric
              label={props.t('Distance 1')}
              onChange={(value) => {
                dispatch({
                  type: 'SET_NPC_DISTANCE_1',
                  distance: value,
                });
              }}
              value={formState.npc_distance_1}
              inputMode="decimal"
              descriptor={props.testUnit}
              kitmanDesignSystem
              disabled={requestStatus === 'PENDING'}
              isInvalid={
                isValidationCheckAllowed &&
                (formState.npc_distance_1 == null ||
                  Number.isNaN(Number.parseFloat(formState.npc_distance_1)))
              }
            />

            <InputNumeric
              label={props.t('Distance 2')}
              onChange={(value) => {
                dispatch({
                  type: 'SET_NPC_DISTANCE_2',
                  distance: value,
                });
              }}
              value={formState.npc_distance_2}
              inputMode="decimal"
              descriptor={props.testUnit}
              kitmanDesignSystem
              disabled={requestStatus === 'PENDING'}
              isInvalid={
                isValidationCheckAllowed &&
                (formState.npc_distance_2 == null ||
                  Number.isNaN(Number.parseFloat(formState.npc_distance_2)))
              }
            />

            <InputNumeric
              label={props.t('Distance 3')}
              onChange={(value) => {
                dispatch({
                  type: 'SET_NPC_DISTANCE_3',
                  distance: value,
                });
              }}
              value={formState.npc_distance_3}
              inputMode="decimal"
              descriptor={props.testUnit}
              kitmanDesignSystem
              disabled={requestStatus === 'PENDING'}
              isInvalid={
                isValidationCheckAllowed &&
                (formState.npc_distance_3 == null ||
                  Number.isNaN(Number.parseFloat(formState.npc_distance_3)))
              }
            />

            <InputNumeric
              label={props.t('Average')}
              onChange={() => {}}
              value={formState.npc_average}
              descriptor={props.testUnit}
              kitmanDesignSystem
              disabled
            />
          </div>
        )}
        {props.testProtocol === 'KING-DEVICK' &&
          formState.type === 'KING-DEVICK' && (
            <div
              css={[style['grid-full'], style['grid-two-column']]}
              data-testid="AddConcussionResultSidePanel|KingDevick"
            >
              <InputNumeric
                label={props.t('Score')}
                onChange={(value) => {
                  dispatch({
                    type: 'SET_KING_DEVICK_SCORE',
                    score: value,
                  });
                }}
                inputMode="decimal"
                value={formState.king_devick_score}
                kitmanDesignSystem
                disabled={requestStatus === 'PENDING'}
                isInvalid={
                  isValidationCheckAllowed &&
                  (formState.king_devick_score == null ||
                    Number.isNaN(
                      Number.parseFloat(formState.king_devick_score)
                    ))
                }
              />

              <InputNumeric
                label={props.t('Errors')}
                onChange={(value) => {
                  dispatch({
                    type: 'SET_KING_DEVICK_ERRORS',
                    errors: value,
                  });
                }}
                value={formState.king_devick_errors}
                inputMode="numeric"
                kitmanDesignSystem
                disabled={requestStatus === 'PENDING'}
                isInvalid={
                  isValidationCheckAllowed &&
                  (formState.king_devick_errors == null ||
                    Number.isNaN(
                      Number.parseInt(formState.king_devick_errors, 10)
                    ))
                }
              />
            </div>
          )}
        <hr css={style.hr} />
        {formState.queuedAttachmentTypes.includes('FILE') && (
          <>
            <div css={style['grid-full']}>
              <FileUploadArea
                areaTitle={props.t('Attach file(s)')}
                showActionButton
                testIdPrefix="AddConcussionTestResultsSidePanel"
                isFileError={false}
                actionIcon="icon-bin"
                onClickActionButton={() =>
                  dispatch({
                    type: 'REMOVE_ATTACHMENT_TYPE',
                    queuedAttachmentType: 'FILE',
                  })
                }
                updateFiles={(queuedAttachments) => {
                  dispatch({
                    type: 'UPDATE_QUEUED_ATTACHMENTS',
                    queuedAttachments,
                  });
                }}
                attachedFiles={formState.queuedAttachments}
                removeFiles={props.isOpen}
                acceptedFileTypeCode="imageVideo"
              />
            </div>
            <hr css={style.hr} />
          </>
        )}

        <div
          css={style['grid-1/2']}
          data-testid="AddConcussionResultSidePanel|AddAttachment"
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
            disabled={requestStatus === 'PENDING'}
          />
        </div>
      </div>

      <div
        css={style.actions}
        data-testid="AddConcussionResultSidePanel|Actions"
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
  );
};

AddConcussionTestResultsSidePanel.defaultProps = {
  testUnit: 'cm',
};

export const AddConcussionTestResultsSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(AddConcussionTestResultsSidePanel);
export default AddConcussionTestResultsSidePanel;
