// @flow
import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  AppStatus,
  SlidingPanelResponsive,
  Select,
  SegmentedControl,
  TextButton,
  ProgressTracker,
} from '@kitman/components';
import type { SelectOption as Option } from '@kitman/components/src/types';
import { saveIssue } from '@kitman/services';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useIssue } from '../../contexts/IssueContext';
import useAddConcussionAssessmentForm from './hooks/useAddConcussionAssessmentForm';
import useEnrichedAthleteIssues from '../../hooks/useEnrichedAthletesIssues';
import useAthleteAssessments from '../../hooks/useAthleteAssessments';
import {
  emptyHTMLeditorContent,
  getIssueIds,
  getFormattedIssueIds,
  filterEnrichedIssueConcussions,
} from '../../utils';
import type { RequestStatus } from '../../types';
import style from './styles';

type Props = {
  isOpen: boolean,
  isAthleteSelectable: boolean,
  squadAthletes: Array<Option>,
  athleteId?: ?number,
  showProgress?: boolean,
  initialDataRequestStatus: RequestStatus,
  onAssessmentAdded: Function,
  onClose: Function,
};

const AddConcussionAssessmentSidePanel = (props: I18nProps<Props>) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const { issue, issueType, updateIssue } = useIssue();
  const [requestIssuesStatus, setRequestIssuesStatus] =
    useState<RequestStatus>(null);
  const [isValidationCheckAllowed, setIsValidationCheckAllowed] =
    useState(false);

  const { formState, dispatch } = useAddConcussionAssessmentForm();
  const { enrichedAthleteIssues, fetchAthleteIssues } =
    useEnrichedAthleteIssues({
      athleteId: props.athleteId,
      useOccurrenceId: true,
      detailedIssue: true,
      customIssueFilter: filterEnrichedIssueConcussions,
    });
  const { athleteAssessmentOptions, fetchAthleteAssessments } =
    useAthleteAssessments(props.athleteId, 'scat5');

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
    if (!props.isOpen) {
      setIsValidationCheckAllowed(false);
      dispatch({ type: 'CLEAR_FORM' });
    }

    if (props.athleteId) {
      dispatch({
        type: 'SET_ATHLETE_ID',
        athleteId: props.athleteId,
        squadAthletes: props.squadAthletes,
      });
    }

    updateInjuryIllnessIdValues();
  }, [props.athleteId, props.isOpen]);

  useEffect(() => {
    dispatch({ type: 'CLEAR_FORM' });
    if (props.athleteId) {
      dispatch({
        type: 'SET_ATHLETE_ID',
        athleteId: props.athleteId,
        squadAthletes: props.squadAthletes,
      });
    }
  }, []);

  const onAthleteChange = (athleteId: number) => {
    dispatch({
      type: 'SET_ATHLETE_ID',
      athleteId,
      squadAthletes: props.squadAthletes,
    });

    setRequestIssuesStatus('PENDING');

    Promise.all([
      fetchAthleteIssues({
        selectedAthleteId: athleteId,
        useOccurrenceIdValue: true,
        includeDetailedIssue: true,
        issueFilter: filterEnrichedIssueConcussions,
        includeIssue: true,
        includeGrouped: true,
      }),
      fetchAthleteAssessments(athleteId),
    ]).then(
      () => {
        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  };

  const filterNonAttachedAssessments = (
    allAssessments: ?Array<Option>
  ): Array<Option> => {
    if (!allAssessments) {
      return [];
    }
    if (!issue || !issue.concussion_assessments) {
      return allAssessments;
    }

    return allAssessments.filter(
      (option: Option) => !issue.concussion_assessments?.includes(option.value)
    );
  };

  const onSave = async () => {
    setIsValidationCheckAllowed(true);

    const requiredFields = [formState.athlete_id, formState.assessment_ids];

    const allRequiredFieldsAreValid =
      requiredFields.every((item) => item && item !== emptyHTMLeditorContent) &&
      formState.assessment_ids.length > 0;

    if (!allRequiredFieldsAreValid) {
      return;
    }

    setRequestStatus('PENDING');
    if (issue) {
      const assessmentsArray = issue.concussion_assessments
        ? [...issue.concussion_assessments, ...formState.assessment_ids]
        : formState.assessment_ids;
      saveIssue(issueType, issue, {
        concussion_assessments: [...new Set(assessmentsArray)], // Unique Assessment ids
      })
        .then((updatedIssue) => {
          updateIssue(updatedIssue);
          setRequestStatus('SUCCESS');
          props.onAssessmentAdded();
          props.onClose();
        })
        .catch(() => setRequestStatus('FAILURE'));
    }
  };

  return (
    <SlidingPanelResponsive
      isOpen={props.isOpen}
      title={
        formState.athlete_name != null
          ? `${props.t('Add concussion assessment')} - ${
              formState.athlete_name || ''
            }`
          : props.t('Add concussion assessment')
      }
      onClose={props.onClose}
      width={659}
    >
      <div css={style.content}>
        {props.showProgress && (
          <div
            css={style['grid-full']}
            data-testid="AddConcussionAssessmentSidePanel|ProgressTracker"
          >
            <ProgressTracker
              currentHeadingId={1}
              headings={[
                { id: 1, name: props.t('Initial information') },
                { id: 2, name: props.t('Review results') },
              ]}
            />
          </div>
        )}
        <div
          css={style['grid-full']}
          data-testid="AddConcussionAssessmentSidePanel|TestTypeSelector"
        >
          <SegmentedControl
            label={props.t('Assessment')}
            width="inline"
            buttons={[
              {
                name: props.t('Link to existing'),
                value: 'existing',
              },
            ]}
            selectedButton="existing"
            onClickButton={() => {}}
            isDisabled={requestStatus === 'PENDING'}
          />
        </div>
        <div
          css={style['grid-1/3']}
          data-testid="AddConcussionAssessmentSidePanel|AthleteSelector"
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
          css={style['grid-1/4']}
          data-testid="AddConcussionAssessmentSidePanel|AttachReports"
        >
          <Select
            appendToBody
            value={formState.assessment_ids}
            invalid={
              isValidationCheckAllowed && formState.assessment_ids.length < 1
            }
            label={props.t('Attach report(s)')}
            options={filterNonAttachedAssessments(athleteAssessmentOptions)}
            onChange={(ids) => {
              dispatch({ type: 'SET_ASSESSMENT_IDS', assessmentIds: ids });
            }}
            isMulti
            isDisabled={!formState.athlete_id || requestStatus === 'PENDING'}
          />
        </div>
        <div
          css={style['grid-1/4']}
          data-testid="AddConcussionAssessmentSidePanel|AssociatedInjuries"
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
            isDisabled={
              !formState.athlete_id ||
              issue?.id != null ||
              requestStatus === 'PENDING' ||
              requestIssuesStatus === 'PENDING'
            }
            isMulti
            optional={!issue || issue.id == null}
          />
        </div>
      </div>
      <div
        css={style.actions}
        data-testid="AddConcussionAssessmentSidePanel|Actions"
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

export const AddConcussionAssessmentSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(AddConcussionAssessmentSidePanel);
export default AddConcussionAssessmentSidePanel;
