import { useSelector, useDispatch } from 'react-redux';
import {
  closeOshaFormSidePanel,
  initaliseOshaFormState,
} from '../redux/actions';
import { AddOshaFormSidePanelTranslated as AddOshaFormSidePanel } from '../components/AddOshaFormSidePanel';
import { useGetStaffUsersQuery } from '../redux/services/medical';

const AddOshaFormSidePanelContainer = (props) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.addOshaFormSidePanel.isOpen);

  const {
    data: staffUsers = [],
    error: staffUsersError,
    isLoading: isStaffUsersLoading,
  } = useGetStaffUsersQuery(null, { skip: !isOpen });

  const sortedStaffUsers = staffUsers
    .map(({ id, fullname }) => ({
      value: id,
      label: fullname,
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

  return (
    <AddOshaFormSidePanel
      {...props}
      isOpen={isOpen}
      onClose={() => {
        dispatch(closeOshaFormSidePanel());
        dispatch(initaliseOshaFormState());
      }}
      staffUsers={sortedStaffUsers}
      staffUsersRequestStatus={getStaffUsersRequestStatus()}
    />
  );
};

export default AddOshaFormSidePanelContainer;
