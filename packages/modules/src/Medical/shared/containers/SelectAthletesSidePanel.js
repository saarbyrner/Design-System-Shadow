import { useSelector, useDispatch } from 'react-redux';
import { closeSelectAthletesSidePanel } from '../redux/actions';
import { SelectAthletesSidePanelTranslated as SelectAthletesSidePanel } from '../components/SelectAthletesSidePanel';
import { useGetSquadAthletesQuery } from '../redux/services/medical';

const SelectAthletesSidePanelContainer = (props) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.selectAthletesSidePanel.isOpen);

  const {
    data: squadAthletes = { squads: [] },
    error: squadAthletesError,
    isLoading: isSquadAthletesLoading,
  } = useGetSquadAthletesQuery({ athleteList: false }, { skip: !isOpen });

  const getInitialDataRequestStatus = () => {
    if (squadAthletesError) {
      return 'FAILURE';
    }
    if (isSquadAthletesLoading) {
      return 'PENDING';
    }
    return null;
  };

  return (
    <SelectAthletesSidePanel
      {...props}
      initialDataRequestStatus={getInitialDataRequestStatus()}
      isOpen={isOpen}
      squadAthletes={squadAthletes.squads}
      onClose={() => dispatch(closeSelectAthletesSidePanel())}
    />
  );
};

export default SelectAthletesSidePanelContainer;
