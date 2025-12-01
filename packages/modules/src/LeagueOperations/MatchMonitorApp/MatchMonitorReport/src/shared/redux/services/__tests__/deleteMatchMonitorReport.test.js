import { axios } from '@kitman/common/src/utils/services';
import deleteMatchMonitorReport from '../api/deleteMatchMonitorReport';

describe('deleteMatchMonitorReport', () => {
  it('calls the correct delete match monitor endpoint calls the endpoint', async () => {
    jest.spyOn(axios, 'delete');
    await deleteMatchMonitorReport(1);
    expect(axios.delete).toHaveBeenCalledWith(
      '/planning_hub/events/1/game_monitor_reports'
    );
  });
});
