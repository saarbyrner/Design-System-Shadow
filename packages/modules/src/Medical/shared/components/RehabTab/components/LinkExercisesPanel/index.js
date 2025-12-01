// @flow
import { useState } from 'react';
import type { ComponentType } from 'react';
import ReactDOM from 'react-dom';
import { linkMaintenanceExerciseToSession } from '@kitman/services';
import { withNamespaces } from 'react-i18next';
import { ExpandingPanel, Select, TextButton } from '@kitman/components';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { RequestStatus, IssueType } from '../../../../types';
import style from './style';
import useLinkExercisesForm from './hooks/useLinkExerciseForms';
import { useGetSquadAthletesQuery } from '../../../../redux/services/medical';
import useEnrichedAthletesIssues from '../../../../hooks/useEnrichedAthletesIssues';

export type Props = {
  onClose: Function,
  isOpen: boolean,
  athleteId: number, // The athlete we are linking from
  issueOccurrenceId: ?number,
  issueType: ?IssueType,
  selectedExercises: Array<number>,
  onLinkComplete: Function,
  addToastMessage: Function,
};

const LinkExercisesPanel = (props: I18nProps<Props>) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [isValidationCheckAllowed, setIsValidationCheckAllowed] =
    useState(false);

  const { formState, dispatch } = useLinkExercisesForm(props.athleteId);

  const { data: squadAthletes = { squads: [] } } = useGetSquadAthletesQuery(
    { athleteList: true }, // Can use minimal athlete data
    { skip: !props.isOpen }
  );

  const athleteOptions: Array<Option> = squadAthletes.squads.map((squad) => ({
    label: squad.name,
    options: squad.athletes.map((athlete) => {
      return {
        label: athlete.fullname,
        value: athlete.id,
      };
    }),
  }));

  const { enrichedAthleteIssues } = useEnrichedAthletesIssues({
    athleteId: props.athleteId,
    useOccurrenceId: true,
    detailedIssue: false,
    customIssueFilter: null,
    includeOccurrenceType: false,
    includeIssueHook: false,
    includeGroupedHook: false,
  });

  const performLink = () => {
    setIsValidationCheckAllowed(true);
    if (formState.issue_type == null) {
      return;
    }

    if (formState.issue_id == null) {
      return;
    }

    setRequestStatus('PENDING');

    const data = {
      athlete_id: formState.athlete_id || 1,
      issue_type: formState.issue_type || 'Injury',
      issue_id: formState.issue_id || 1,
      exercise_instances_ids: props.selectedExercises,
    };

    linkMaintenanceExerciseToSession(data).then(() => {
      setRequestStatus('SUCCESS');
      props.onClose();
      props.onLinkComplete();

      const injuryNameIndex = enrichedAthleteIssues.findIndex((injury) =>
        injury.options.find(
          (option) =>
            option.value ===
            `${formState.issue_type || ''}_${formState.issue_id || ''}`
        )
      );
      const injuryName = enrichedAthleteIssues[injuryNameIndex].options.find(
        (option) =>
          option.value ===
          `${formState.issue_type || ''}_${formState.issue_id || ''}`
      );

      if (formState.athlete_id != null) {
        let athleteName;
        if (athleteOptions.length > 0) {
          const athleteSquadIndex = athleteOptions.findIndex((squad) =>
            squad.options
              ? squad.options.find((ath) => ath.value === formState.athlete_id)
              : null
          );
          athleteName = athleteOptions[athleteSquadIndex].options
            ? athleteOptions[athleteSquadIndex].options?.find(
                (ath) => ath.value === formState.athlete_id
              )
            : '';
        }
        props.addToastMessage(
          athleteName ? athleteName.label : '',
          injuryName ? injuryName.label : '',
          data,
          'maintenanceLinkedToInjury'
        );
      }
    });
  };

  const getInnerContent = () => {
    return (
      <div css={style.scrollingContainer}>
        <div css={style.content}>
          <div data-testid="LinkExercisePanel|AthleteSelector">
            <Select
              label={props.t('Player')}
              options={athleteOptions}
              value={formState.athlete_id}
              isDisabled
            />
          </div>
          <div data-testid="LinkExercisePanel|AssociatedInjuries">
            <Select
              label={props.t('Injury / illness')}
              onChange={(id) => {
                if (typeof id === 'string' && id.includes('_')) {
                  const [selectedIssueType, selectedIssueId] = id.split('_');
                  dispatch({
                    type: 'SET_SELECTED_ISSUE_DETAILS',
                    selectedIssueType,
                    selectedIssueId: Number.parseInt(selectedIssueId, 10),
                  });
                } else {
                  // If id is not a valid string or doesn't contain '_', clear the selection
                  dispatch({
                    type: 'SET_SELECTED_ISSUE_DETAILS',
                    selectedIssueType: null,
                    selectedIssueId: null,
                  });
                }
              }}
              value={
                formState.issue_type != null && formState.issue_id != null
                  ? `${formState.issue_type}_${formState.issue_id}`
                  : null
              }
              options={enrichedAthleteIssues}
              isMulti={false}
              isDisabled={requestStatus === 'PENDING'}
              invalid={isValidationCheckAllowed && !formState.issue_type}
            />
          </div>
        </div>
      </div>
    );
  };

  return ReactDOM.createPortal(
    <div css={style.linkExercisePanel} data-testid="Rehab|LinkExercisePanel">
      <ExpandingPanel
        width={436}
        isOpen={props.isOpen}
        onClose={props.onClose}
        title={props.t('Link to Injury / Illness')}
      >
        {getInnerContent()}
        <div css={style.actions} data-testid="LinkExercisePanel|Actions">
          <TextButton
            onClick={performLink}
            text={props.t('Save')}
            type="primary"
            kitmanDesignSystem
            isDisabled={
              requestStatus === 'PENDING' || formState.issue_id == null
            }
          />
        </div>
      </ExpandingPanel>
    </div>,
    document.getElementById('issueMedicalProfile-Slideout')
  );
};

export const LinkExercisesPanelTranslated: ComponentType<Props> =
  withNamespaces()(LinkExercisesPanel);
export default LinkExercisesPanel;
