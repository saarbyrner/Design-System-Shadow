import { handler as fetchMatchMonitorReport } from './fetchMatchMonitorReport';
import { handler as saveMatchMonitorReport } from './saveMatchMonitorReport';
import { handler as updateMatchMonitorReport } from './updateMatchMonitorReport';
import deleteMatchMonitorReport from './deleteMatchMonitorReport';

export default [
  fetchMatchMonitorReport,
  saveMatchMonitorReport,
  updateMatchMonitorReport,
  deleteMatchMonitorReport,
];
