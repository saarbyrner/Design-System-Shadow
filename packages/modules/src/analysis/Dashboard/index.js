/* eslint-disable flowtype/require-valid-file-annotation */
import { useParams } from 'react-router-dom';
import Dashboard from './Dashboard';

const DashboardRoute = () => {
  const { id } = useParams();

  if (id) {
    return <Dashboard isHomeDashboard={false} dashboardId={id} />;
  }

  return <Dashboard isHomeDashboard />;
};

export { Dashboard };

export default DashboardRoute;
