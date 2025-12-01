import { useSelector, useDispatch } from 'react-redux';
import {
  closeWorkersCompSidePanel,
  initaliseWorkersCompFormState,
} from '../redux/actions';
import { useGetStaffUsersQuery } from '../redux/services/medical';
import { AddWorkersCompSidePanelTranslated as AddWorkersCompSidePanel } from '../components/AddWorkersCompSidePanel';
import { AddFROISidePanelTranslated as AddFROISidePanel } from '../components/AddWorkersCompSidePanel/AddFROISidePanel';

const AddWorkersCompSidePanelContainer = (props) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.addWorkersCompSidePanel.isOpen);

  const displayFROI = window.getFlag('pm-mls-emr-demo-froi');

  const {
    data: staffUsers = [],
    error: staffUsersError,
    isLoading: isStaffUsersLoading,
  } = useGetStaffUsersQuery(null, { skip: !isOpen });

  const sortedStaffUsers = staffUsers
    .map(({ id, fullname, firstname, lastname }) => ({
      value: id,
      label: fullname,
      firstName: firstname,
      lastName: lastname,
    }))
    .sort((a, b) => {
      const lowercaseA = a.label.toLowerCase();
      const lowercaseB = b.label.toLowerCase();
      return lowercaseA.localeCompare(lowercaseB);
    });

  const getStaffUsersRequestStatus = () => {
    if (staffUsersError) {
      return 'FAILURE';
    }
    if (isStaffUsersLoading) {
      return 'PENDING';
    }
    return null;
  };

  return displayFROI ? (
    <AddFROISidePanel
      {...props}
      isOpen={isOpen}
      onClose={() => {
        dispatch(closeWorkersCompSidePanel());
        dispatch(initaliseWorkersCompFormState());
      }}
      staffUsers={sortedStaffUsers}
      staffUsersRequestStatus={getStaffUsersRequestStatus()}
    />
  ) : (
    <AddWorkersCompSidePanel
      {...props}
      isOpen={isOpen}
      onClose={() => {
        dispatch(closeWorkersCompSidePanel());
        dispatch(initaliseWorkersCompFormState());
      }}
      staffUsers={sortedStaffUsers}
      staffUsersRequestStatus={getStaffUsersRequestStatus()}
    />
  );
};

export default AddWorkersCompSidePanelContainer;
