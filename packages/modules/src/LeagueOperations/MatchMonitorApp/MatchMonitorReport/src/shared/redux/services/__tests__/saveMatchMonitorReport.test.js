import report from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/services/mocks/data/match_monitor_report';
import saveMatchMonitorReport from '../api/saveMatchMonitorReport';

describe('saveMatchMonitorReport', () => {
  it('calls the correct save match monitor endpoint and returns the correct value', async () => {
    const returnedData = await saveMatchMonitorReport(1, report);
    expect(returnedData).toEqual(report);
  });
});
