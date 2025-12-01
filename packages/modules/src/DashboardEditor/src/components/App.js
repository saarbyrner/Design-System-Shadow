// @flow
import type { Status } from '@kitman/common/src/types/Status';
import type { Alarm } from '@kitman/common/src/types/Alarm';
import type { StatusVariable, Dashboard } from '@kitman/common/src/types';
import { HeaderTranslated as Header } from './Header';
import { MetricsTranslated as Metrics } from './Metrics';

type Props = {
  dashboards: Array<Dashboard>,
  availableVariables: Array<StatusVariable>,
  currentDashboardId: string,
  statusIds: Array<$PropertyType<Status, 'status_id'>>,
  statusesById: { [$PropertyType<Status, 'status_id'>]: Status },
  dashboardsById: { [string]: Dashboard },
  currentStatusId: string,
  alarmDefinitions: { [$PropertyType<Status, 'status_id'>]: Alarm },
};

const App = (props: Props) => (
  <div className="edit-dashboard">
    <Header
      dashboards={props.dashboards}
      currentDashboard={props.dashboardsById[props.currentDashboardId]}
    />

    <Metrics
      availableVariables={props.availableVariables}
      currentDashboardId={props.currentDashboardId}
      statusIds={props.statusIds}
      statusesById={props.statusesById}
      currentStatusId={props.currentStatusId}
      alarmDefinitions={props.alarmDefinitions}
    />
  </div>
);

export default App;
