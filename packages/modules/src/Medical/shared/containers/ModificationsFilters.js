import { useDispatch } from 'react-redux';
import { ModificationsFiltersTranslated as ModificationsFilters } from '../components/ModificationsTab/ModificationsFilters';
import { openAddModificationSidePanel } from '../redux/actions';
import {
  useGetSquadsQuery,
  useGetModificationAuthorsQuery,
  useGetSquadAthletesQuery,
} from '../redux/services/medical';

const ModificationsFiltersContainer = (props) => {
  const dispatch = useDispatch();
  const isModificationsTab = window.location.hash === '#modifications';
  const {
    data: squads = [],
    error: getSquadsError,
    isLoading: areSquadsLoading,
  } = useGetSquadsQuery({
    skip: !isModificationsTab,
  });
  const {
    data: authors = [],
    error: getAuthorsError,
    isLoading: areAuthorsLoading,
  } = useGetModificationAuthorsQuery(
    {
      athleteId: props.athleteId,
      injuryId: props.injuryId,
      illnessId: props.illnessId,
    },
    {
      skip: !isModificationsTab,
    }
  );
  const {
    data: squadAthletes = { squads: [] },
    error: squadAthletesError,
    isLoading: isSquadAthletesLoading,
  } = useGetSquadAthletesQuery(
    { athleteList: true }, // Can use minimal athlete data
    {
      skip: !isModificationsTab,
    }
  );

  const getInitialDataRequestStatus = () => {
    if (getSquadsError || getAuthorsError || squadAthletesError) {
      return 'FAILURE';
    }
    if (areSquadsLoading || areAuthorsLoading || isSquadAthletesLoading) {
      return 'PENDING';
    }
    return null;
  };

  return (
    <ModificationsFilters
      {...props}
      squads={squads.map(({ id, name }) => ({
        value: id,
        label: name,
      }))}
      squadAthletes={squadAthletes.squads.map((squad) => ({
        label: squad.name,
        options: squad.athletes.map((athlete) => ({
          label: athlete.fullname,
          value: athlete.id,
        })),
      }))}
      authors={authors.map(({ id, fullname }) => ({
        value: id,
        label: fullname,
      }))}
      initialDataRequestStatus={getInitialDataRequestStatus()}
      onClickAddModification={() =>
        dispatch(openAddModificationSidePanel({ isAthleteSelectable: false }))
      }
    />
  );
};

export default ModificationsFiltersContainer;
