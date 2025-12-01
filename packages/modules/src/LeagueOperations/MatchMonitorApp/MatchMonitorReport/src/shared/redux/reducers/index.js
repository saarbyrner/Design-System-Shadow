// @flow
import matchMonitorSlice from '../slices/matchMonitorSlice';
import { matchMonitorReportAPI } from '../services';

export default {
  matchMonitorSlice: matchMonitorSlice.reducer,
  matchMonitorReportAPI: matchMonitorReportAPI.reducer,
};
