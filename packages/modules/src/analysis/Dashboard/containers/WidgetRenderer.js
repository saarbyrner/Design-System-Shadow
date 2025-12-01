import { useSelector } from 'react-redux';
import WidgetRenderer from '../components/WidgetRenderer';

export default (props) => {
  const activeDashboard = useSelector(
    (state) => state.dashboard.activeDashboard
  );
  const appliedSquadAthletes = useSelector(
    (state) => state.dashboard.appliedSquadAthletes
  );
  const containerType = useSelector((state) => state.staticData.containerType);

  return (
    <WidgetRenderer
      containerType={containerType}
      dashboard={activeDashboard}
      appliedSquadAthletes={appliedSquadAthletes}
      {...props}
    />
  );
};
