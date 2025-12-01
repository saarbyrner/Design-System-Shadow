import { useDispatch } from 'react-redux';
import { TreatmentsTabTranslated as TreatmentsTab } from '../components/TreatmentsTab';
import { openAddDiagnosticAttachmentSidePanel } from '../redux/actions/index';
import { useGetStaffUsersQuery } from '../redux/services/medical';

const TreatmentsTabContainer = (props) => {
  const dispatch = useDispatch();
  const isTreatmentsTab = window.location.hash === '#treatments';

  const {
    data: staffUsers = [],
    error: staffUsersError,
    isLoading: isStaffUsersLoading,
  } = useGetStaffUsersQuery({ skip: !isTreatmentsTab });

  const sortedStaffUsers = staffUsers
    .map(({ id, fullname }) => ({
      value: id,
      label: fullname,
    }))
    .sort((a, b) => {
      const lowercaseA = a.label.toLowerCase();
      const lowercaseB = b.label.toLowerCase();
      if (lowercaseA > lowercaseB) {
        return 1;
      }
      if (lowercaseA < lowercaseB) {
        return -1;
      }
      return 0;
    });

  const getInitialDataRequestStatus = () => {
    if (staffUsersError) {
      return 'FAILURE';
    }
    if (isStaffUsersLoading) {
      return 'PENDING';
    }
    return null;
  };

  return (
    <TreatmentsTab
      {...props}
      initialDataRequestStatus={getInitialDataRequestStatus()}
      openAddDiagnosticAttachmentSidePanel={(diagnosticId, athleteId) => {
        dispatch(openAddDiagnosticAttachmentSidePanel(diagnosticId, athleteId));
      }}
      staffUsers={sortedStaffUsers}
    />
  );
};

export default TreatmentsTabContainer;
