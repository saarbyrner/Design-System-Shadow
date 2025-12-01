// @flow
import { useSelector, useDispatch } from 'react-redux';
import { closeAddConcussionAssessmentSidePanel } from '../redux/actions';
import { AddConcussionAssessmentSidePanelTranslated as AddConcussionAssessmentSidePanel } from '../components/AddConcussionAssessmentSidePanel';
import { useGetSquadAthletesQuery } from '../redux/services/medical';

type Props = {
  athleteId: number,
  onAssessmentAdded: Function,
};

const AddConcussionAssessmentSidePanelContainer = (props: Props) => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state) => state.addConcussionAssessmentSidePanel.isOpen
  );
  const isAthleteSelectable = useSelector((state) => {
    return state.addConcussionAssessmentSidePanel.initialInfo
      .isAthleteSelectable;
  });

  const {
    data: squadAthletes = { squads: [] },
    error: squadAthletesError,
    isLoading: isSquadAthletesLoading,
  } = useGetSquadAthletesQuery(
    { athleteList: true }, // Can use minimal athlete data
    { skip: !isOpen }
  );

  const getInitialDataRequestStatus = () => {
    if (squadAthletesError) {
      return 'FAILURE';
    }
    if (isSquadAthletesLoading) {
      return 'PENDING';
    }
    return 'SUCCESS';
  };

  return (
    <AddConcussionAssessmentSidePanel
      isOpen={isOpen}
      athleteId={props.athleteId}
      isAthleteSelectable={isAthleteSelectable}
      squadAthletes={squadAthletes.squads.map((squad) => ({
        label: squad.name,
        options: squad.athletes.map((athlete) => ({
          label: athlete.fullname,
          value: athlete.id,
        })),
      }))}
      initialDataRequestStatus={getInitialDataRequestStatus()}
      onClose={() => dispatch(closeAddConcussionAssessmentSidePanel())}
      onAssessmentAdded={props.onAssessmentAdded}
    />
  );
};

export default AddConcussionAssessmentSidePanelContainer;
