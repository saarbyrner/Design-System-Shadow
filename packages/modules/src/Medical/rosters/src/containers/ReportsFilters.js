import { ReportsFiltersTranslated as ReportsFilters } from '../components/ReportsTab/ReportsFilters';
import { useGetSquadsQuery } from '../../../shared/redux/services/medical';

const ReportsFiltersContainer = (props) => {
  const isReportsTab = window.location.hash === '#reports';
  const {
    data: squads = [],
    error: getSquadsError,
    isLoading: areSquadsLoading,
  } = useGetSquadsQuery({
    skip: !isReportsTab,
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
    <ReportsFilters
      {...props}
      squads={squads.map(({ id, name }) => ({
        value: id,
        label: name,
      }))}
      initialDataRequestStatus={getInitialDataRequestStatus()}
    />
  );
};

export default ReportsFiltersContainer;
