import { axios } from '@kitman/common/src/utils/services';
import updateMatchMonitorReport from '../api/updateMatchMonitorReport';

describe('updateMatchMonitorReport', () => {
  it('calls the correct update match monitor endpoint to unlock the report', async () => {
    jest.spyOn(axios, 'post');
    await updateMatchMonitorReport(1, {
      submitted: false,
    });

    expect(axios.post).toHaveBeenCalledWith(
      '/planning_hub/events/1/game_monitor_reports',
      { submitted: false }
    );
  });
});
