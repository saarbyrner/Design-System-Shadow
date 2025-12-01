import { axios } from '@kitman/common/src/utils/services';
import resetMatchReport from '../resetMatchReport';

describe('resetMatchReport', () => {
  it('calls the api endpoint with the relative info passed in', async () => {
    jest.spyOn(axios, 'post').mockImplementation(jest.fn());
    await resetMatchReport(1);
    expect(axios.post).toHaveBeenCalledWith(
      '/planning_hub/events/1/reset_report'
    );
  });
});
