import { useDispatch } from 'react-redux';
import AddWidgetDropdown from '../components/AddWidgetDropdown';
import { useGetTerminologiesQuery } from '../redux/services/dashboard';
import { newChart } from '../redux/slices/chartBuilder';

const AddWidgetDropdownContainer = (props) => {
  const dispatch = useDispatch();
  const developmentGoalTerminology = useGetTerminologiesQuery().data?.find(
    (terminology) => terminology.key === 'development_goal'
  )?.customName;

  const onAddChart = () => {
    dispatch(newChart());
  };

  return (
    <AddWidgetDropdown
      developmentGoalTerminology={developmentGoalTerminology}
      onAddChart={onAddChart}
      {...props}
    />
  );
};

export default AddWidgetDropdownContainer;
