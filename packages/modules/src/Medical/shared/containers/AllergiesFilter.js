import { useDispatch } from 'react-redux';
import { AllergiesFilterTranslated as AllergiesFilter } from '../components/AllergiesTab/components/AllergiesFilter';
import {
  openAddAllergySidePanel,
  openAddMedicalAlertSidePanel,
} from '../redux/actions/index';
import { useGetSquadsQuery } from '../redux/services/medical';

const AllergiesFiltersContainer = (props) => {
  const dispatch = useDispatch();
  const isAllergiesTab = window.location.hash === '#medical_flags';
  const {
    data: squads = [],
    error: getSquadsError,
    isLoading: areSquadsLoading,
  } = useGetSquadsQuery({
    skip: !isAllergiesTab,
  });

  const getInitialDataRequestStatus = () => {
    if (getSquadsError) {
      return 'FAILURE';
    }
    if (areSquadsLoading) {
      return 'PENDING';
    }
    return null;
  };

  return (
    <>
      <AllergiesFilter
        {...props}
        initialDataRequestStatus={getInitialDataRequestStatus()}
        squads={squads.map(({ id, name }) => ({
          value: id,
          label: name,
        }))}
        onClickAddAllergy={() =>
          dispatch(openAddAllergySidePanel({ isAthleteSelectable: false }))
        }
        onClickAddMedicalAlert={() =>
          dispatch(openAddMedicalAlertSidePanel({ isAthleteSelectable: false }))
        }
      />
    </>
  );
};

export default AllergiesFiltersContainer;
