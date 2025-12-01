import { useSelector, useDispatch } from 'react-redux';
import { closeAddModificationSidePanel } from '../redux/actions';
import { AddModificationSidePanelTranslated as AddModificationSidePanel } from '../components/AddModificationSidePanel';
import { useGetSquadAthletesQuery } from '../redux/services/medical';
import useSquadAthletesSelectOptions from '../hooks/useSquadAthletesSelectOptions';

const AddModificationSidePanelContainer = (props) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.addModificationSidePanel.isOpen);
  const isAthleteSelectable = useSelector(
    (state) => state.addModificationSidePanel.initialInfo.isAthleteSelectable
  );

  const {
    data: squadAthletes = { squads: [] },
    error: squadAthletesError,
    isLoading: isSquadAthletesLoading,
  } = useGetSquadAthletesQuery(
    { athleteList: true }, // Can use minimal athlete data
    { skip: !isOpen }
  );

  const athletesSelectOptions = useSquadAthletesSelectOptions({
    isAthleteSelectable,
    squadAthletes,
  });

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
    <AddModificationSidePanel
      {...props}
      isOpen={isOpen}
      isAthleteSelectable={isAthleteSelectable}
      onSaveModification={() => {
        dispatch(closeAddModificationSidePanel());
        props.onSaveModification?.();
      }}
      squadAthletes={athletesSelectOptions}
      initialDataRequestStatus={getInitialDataRequestStatus()}
      onClose={() => dispatch(closeAddModificationSidePanel())}
    />
  );
};

export default AddModificationSidePanelContainer;
