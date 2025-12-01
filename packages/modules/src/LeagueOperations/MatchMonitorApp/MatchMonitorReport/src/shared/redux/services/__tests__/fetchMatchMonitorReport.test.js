import report from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/services/mocks/data/match_monitor_report';

import fetchMatchMonitorReport from '../api/fetchMatchMonitorReport';

describe('fetchMatchMonitorReport', () => {
  it('calls the correct fetch match monitor report endpoint and returns the correct value', async () => {
    const returnedData = await fetchMatchMonitorReport(1);
    expect(returnedData).toEqual(report);
  });
});
