// @flow
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { BenchmarkDashboardTranslated as BenchmarkDashboard } from './components';

const BenchmarkReport = () => {
  const locationAssign = useLocationAssign();

  if (window.getFlag('rep-show-benchmark-reporting')) {
    return <BenchmarkDashboard />;
  }

  // reroute to home_dashboards if user does not have access to report
  locationAssign('/home_dashboards');
  return null;
};

export default BenchmarkReport;
