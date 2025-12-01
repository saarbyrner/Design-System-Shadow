import { useDispatch } from 'react-redux';
import {
  useGetSquadsQuery,
  useGetProceduresFormDataQuery,
} from '../redux/services/medical';
import { ProceduresFiltersTranslated as ProceduresFilters } from '../components/ProceduresTab/components/ProceduresFilters/ProceduresFilters';
import { openAddProcedureSidePanel } from '../redux/actions';

const ProceduresFiltersContainer = (props) => {
  const dispatch = useDispatch();

  const isProceduresTab = window.location.hash === '#procedures';

  const {
    data: squads = [],
    error: squadAthletesError,
    isLoading: isSquadAthletesLoading,
  } = useGetSquadsQuery({
    skip: !isProceduresTab,
  });
  const {
    data: proceduresFilterData,
    error: proceduresFormDataError,
    isLoading: isProceduresFormDataLoading,
  } = useGetProceduresFormDataQuery(true, { skip: !isProceduresTab });

  const getInitialDataRequestStatus = () => {
    if (squadAthletesError || proceduresFormDataError) {
      return 'FAILURE';
    }
    if (isSquadAthletesLoading || isProceduresFormDataLoading) {
      return 'PENDING';
    }
    return null;
  };

  return (
    <ProceduresFilters
      {...props}
      initialDataRequestStatus={getInitialDataRequestStatus()}
      proceduresFilterData={proceduresFilterData}
      squads={squads.map(({ id, name }) => ({
        value: id,
        label: name,
      }))}
      openAddProcedureSidePanel={() =>
        dispatch(openAddProcedureSidePanel({ isAthleteSelectable: false }))
      }
    />
  );
};
export default ProceduresFiltersContainer;
