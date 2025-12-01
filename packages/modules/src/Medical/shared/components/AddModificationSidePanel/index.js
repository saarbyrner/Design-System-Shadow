// @flow
import { useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import { saveModificationNote, getModificationType } from '@kitman/services';
import {
  dateTransferFormat,
  formatStandard,
} from '@kitman/common/src/utils/dateFormatter';
import {
  Accordion,
  AppStatus,
  DatePicker,
  InputTextField,
  RichTextDisplay,
  RichTextEditor,
  Select,
  SlidingPanelResponsive,
  TextButton,
} from '@kitman/components';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';

import type { SelectOption as Option } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useModificationNotes from '../../hooks/useModificationNotes';
import useAthletesIssues from '../../hooks/useAthletesIssues';
import useModificationForm from './hooks/useModificationForm';
import { useIssue } from '../../contexts/IssueContext';
import {
  getDefaultNotesFilters,
  getEditorStateFromValue,
  getIssueIds,
  getFormattedIssueIds,
  getRestricVisibilityValue,
  emptyHTMLeditorContent,
} from '../../utils';
import type { RequestStatus } from '../../types';
import AthleteConstraints from '../AthleteConstraints';
import style from './styles';

type Props = {
  isOpen: boolean,
  isAthleteSelectable: boolean,
  initialDataRequestStatus: RequestStatus,
  squadAthletes: Array<Option>,
  athleteId?: ?number,
  onSaveModification: Function,
  onClose: Function,
};

const AddModificationSidePanel = (props: I18nProps<Props>) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [isValidationCheckAllowed, setIsValidationCheckAllowed] =
    useState(false);

  const { issue, issueType, isChronicIssue } = useIssue();

  const editorRef = useRef(null);

  const showPlayerMovementDatePicker =
    window.featureFlags['player-movement-aware-datepicker'];

  const {
    modificationNotes: modifications,
    fetchModificationNotes: fetchModifications,
    resetModificationNotes: resetModifications,
  } = useModificationNotes({ withPagination: false });
  const { athleteIssues, fetchAthleteIssues } = useAthletesIssues(
    props.isOpen ? props.athleteId : null
  );
  const { formState, dispatch } = useModificationForm();

  const filters = getDefaultNotesFilters({
    athleteId: props.athleteId || null,
    isModification: true,
  });

  useEffect(() => {
    if (props.athleteId) {
      dispatch({ type: 'SET_ATHLETE_ID', athleteId: props.athleteId });
    }

    if (props.isOpen) {
      setRequestStatus('PENDING');

      const getModificationData = async () => {
        try {
          const fetchedModificationType = await getModificationType();
          dispatch({
            type: 'SET_MODIFICATION_TYPE_ID',
            modificationTypeId: fetchedModificationType.id,
          });

          if (props.athleteId) {
            await fetchModifications({ ...filters, unexpired: true }, true);
          }

          setRequestStatus('SUCCESS');
        } catch (e) {
          setRequestStatus('FAILURE');
        }
      };

      getModificationData();
      return;
    }

    editorRef.current?.update(getEditorStateFromValue(''));
    setIsValidationCheckAllowed(false);
    resetModifications();
    dispatch({ type: 'CLEAR_FORM' });
  }, [props.athleteId, props.isOpen]);

  /**
   * Preload the Associated injury/ illness drop-down with
   * issue that it has been toggled open from. Github issue: #18660
   */
  useEffect(() => {
    if (props.isOpen && issue.id && issueType) {
      const issueIds = [issue.id];
      if (isChronicIssue) {
        dispatch({ type: 'SET_CHRONIC_IDS', chronicIds: issueIds });
      } else if (issueType === 'Injury') {
        dispatch({ type: 'SET_INJURY_IDS', injuryIds: issueIds });
      } else if (issueType === 'Illness') {
        dispatch({ type: 'SET_ILLNESS_IDS', illnessIds: issueIds });
      }
    }
  }, [props.isOpen]);

  const onAthleteChange = (athleteId: number) => {
    dispatch({ type: 'SET_ATHLETE_ID', athleteId });

    setRequestStatus('PENDING');

    Promise.all([
      fetchAthleteIssues(athleteId),
      fetchModifications(
        { ...filters, athlete_id: athleteId, unexpired: true },
        true
      ),
    ])
      .then(() => setRequestStatus('SUCCESS'))
      .catch(() => {
        setRequestStatus('FAILURE');
      });
  };

  const onSave = () => {
    setIsValidationCheckAllowed(true);

    const requiredFields = [
      formState.annotationable_id,
      formState.title,
      formState.annotation_date,
      formState.content,
    ];

    const allRequiredFieldsAreValid = requiredFields.every(
      (item) => item && item !== emptyHTMLeditorContent
    );

    if (!allRequiredFieldsAreValid) {
      return;
    }
    setRequestStatus('PENDING');
    saveModificationNote(formState).then(
      () => {
        setRequestStatus('SUCCESS');
        props.onSaveModification();
      },
      () => setRequestStatus('FAILURE')
    );
  };

  const getAssociatedInjuryIllnessValues = () => {
    const chronicIssueIds = formState.chronic_issue_ids || [];
    return getFormattedIssueIds(
      formState.injury_occurrence_ids,
      formState.illness_occurrence_ids,
      chronicIssueIds
    );
  };

  const renderStartDatePicker = () => {
    return (
      <AthleteConstraints athleteId={formState.annotationable_id}>
        {({ lastActivePeriod, isLoading, organisationStatus }) => (
          <div
            css={style.startDate}
            data-testid="AddModificationSidePanel|StartDate"
          >
            <DatePicker
              label={props.t('Start date')}
              onDateChange={(date) => {
                dispatch({
                  type: 'SET_START_DATE',
                  startDate: moment(date).format(dateTransferFormat),
                });
              }}
              value={
                formState.annotation_date
                  ? moment(formState.annotation_date)
                  : null
              }
              invalid={isValidationCheckAllowed && !formState.annotation_date}
              disabled={isLoading || requestStatus === 'PENDING'}
              minDate={lastActivePeriod.start}
              maxDate={
                organisationStatus === 'PAST_ATHLETE'
                  ? lastActivePeriod.end
                  : null
              }
              kitmanDesignSystem
            />
          </div>
        )}
      </AthleteConstraints>
    );
  };

  const renderStartDatePickerNew = () => {
    return (
      <div
        css={style.startDate}
        data-testid="AddModificationSidePanel|StartDateNew"
      >
        <MovementAwareDatePicker
          athleteId={formState.athlete_id ?? undefined}
          value={
            formState.annotation_date ? moment(formState.annotation_date) : null
          }
          onChange={(date) => {
            dispatch({
              type: 'SET_START_DATE',
              startDate: moment(date).format(dateTransferFormat),
            });
          }}
          name="modificationStartDate"
          inputLabel={props.t('Start date')}
          disabled={requestStatus === 'PENDING'}
          kitmanDesignSystem
        />
      </div>
    );
  };

  // If PM FF on then use the athletes start date, else use the annotation date if there is one, otherwise fallback on null (unrestricted)
  const getMinDate = (lastActivePeriod) => {
    if (
      window.featureFlags['player-movement-entity-modifications'] &&
      lastActivePeriod.start
    ) {
      return lastActivePeriod.start;
    }

    if (formState.annotation_date) {
      return moment(formState.annotation_date);
    }

    return null;
  };

  const renderEndDatePicker = () => {
    return (
      <AthleteConstraints athleteId={formState.annotationable_id}>
        {({ lastActivePeriod, isLoading }) => (
          <div
            css={style.endDate}
            data-testid="AddModificationSidePanel|EndDate"
          >
            <DatePicker
              label={props.t('End date')}
              onDateChange={(date) => {
                dispatch({
                  type: 'SET_END_DATE',
                  endDate: moment(date).endOf('day').format(dateTransferFormat),
                });
              }}
              value={
                formState.expiration_date
                  ? moment(formState.expiration_date)
                  : null
              }
              minDate={getMinDate(lastActivePeriod)}
              // Used to lock Datepicker down for past players
              maxDate={
                window.featureFlags['player-movement-entity-modifications'] &&
                lastActivePeriod.end
              }
              disabled={isLoading || requestStatus === 'PENDING'}
              optional
              kitmanDesignSystem
            />
          </div>
        )}
      </AthleteConstraints>
    );
  };

  const renderEndDatePickerNew = () => {
    return (
      <div
        css={style.startDate}
        data-testid="AddModificationSidePanel|EndDateNew"
      >
        <MovementAwareDatePicker
          athleteId={formState.athlete_id ?? undefined}
          value={
            formState.expiration_date ? moment(formState.expiration_date) : null
          }
          onChange={(date) => {
            dispatch({
              type: 'SET_END_DATE',
              endDate: moment(date).endOf('day').format(dateTransferFormat),
            });
          }}
          name="modificationEndDate"
          inputLabel={props.t('End date')}
          disabled={requestStatus === 'PENDING'}
          kitmanDesignSystem
        />
      </div>
    );
  };
  const renderAthleteSelector = () => {
    return (
      <AthleteConstraints athleteId={formState.annotationable_id}>
        {({ organisationStatus, athleteSelector, isLoading }) => (
          <div css={style.player}>
            <Select
              label={props.t('Athlete')}
              onChange={onAthleteChange}
              value={formState.annotationable_id}
              options={
                organisationStatus === 'PAST_ATHLETE'
                  ? athleteSelector
                  : props.squadAthletes
              }
              isDisabled={
                (!props.isAthleteSelectable && !!props.athleteId) ||
                isLoading ||
                requestStatus === 'PENDING'
              }
              invalid={isValidationCheckAllowed && !formState.annotationable_id}
            />
          </div>
        )}
      </AthleteConstraints>
    );
  };

  return (
    <div css={style.sidePanel}>
      <SlidingPanelResponsive
        isOpen={props.isOpen}
        title={props.t('Add modification')}
        onClose={props.onClose}
        width={659}
      >
        <div css={style.content}>
          {renderAthleteSelector()}
          {(props.athleteId || formState.annotationable_id) &&
            modifications.length > 0 && (
              <div css={style.activeModifications}>
                <span css={style.activeModificationsLabel}>
                  {props.t('Active modifications')}
                </span>
                {modifications.map((modification) => (
                  <Accordion
                    key={modification.id}
                    title={
                      <div>
                        <span css={style.activeModificationTitle}>
                          {modification.title}
                        </span>
                        <span css={style.activeModificationDate}>
                          {formatStandard({
                            date: moment(modification.annotation_date),
                          })}
                        </span>
                      </div>
                    }
                    content={
                      <div css={style.activeModificationDescription}>
                        <RichTextDisplay
                          value={modification.content}
                          isAbbreviated={false}
                        />
                      </div>
                    }
                    iconAlign="left"
                  />
                ))}
              </div>
            )}
          <div css={style.modificationTitle}>
            <InputTextField
              label={props.t('Title')}
              value={formState.title}
              onChange={(e) =>
                dispatch({ type: 'SET_TITLE', title: e.target.value })
              }
              invalid={isValidationCheckAllowed && !formState.title}
              disabled={requestStatus === 'PENDING'}
              kitmanDesignSystem
            />
          </div>
          {showPlayerMovementDatePicker ? (
            <>
              {renderStartDatePickerNew()}
              {renderEndDatePickerNew()}
            </>
          ) : (
            <>
              {renderStartDatePicker()}
              {renderEndDatePicker()}
            </>
          )}

          <div css={style.details}>
            <RichTextEditor
              onChange={(content) =>
                dispatch({ type: 'SET_DETAILS', details: content })
              }
              value={formState.content}
              label={props.t('Modification details')}
              forwardedRef={editorRef}
              isInvalid={
                isValidationCheckAllowed &&
                (!formState.content ||
                  formState.content === emptyHTMLeditorContent)
              }
              isDisabled={requestStatus === 'PENDING'}
              kitmanDesignSystem
            />
          </div>
          <div css={style.athleteIssues}>
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
              options={athleteIssues}
              isMulti
              isDisabled={
                !formState.annotationable_id || requestStatus === 'PENDING'
              }
              optional
            />
          </div>
          <div css={style.visibility}>
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
        </div>
        <div css={style.actions}>
          <TextButton
            onClick={onSave}
            text={props.t('Save')}
            type="primary"
            kitmanDesignSystem
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

export const AddModificationSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(AddModificationSidePanel);
export default AddModificationSidePanel;
