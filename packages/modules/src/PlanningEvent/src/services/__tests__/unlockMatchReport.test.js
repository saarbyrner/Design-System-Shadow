import { axios } from '@kitman/common/src/utils/services';
import unlockMatchReport from '../unlockMatchReport';

jest.mock('@kitman/common/src/utils/services');

describe('unlockMatchReport', () => {
  it('calls the correct endpoint', async () => {
    const req = jest.spyOn(axios, 'post');
    await unlockMatchReport(123);

    expect(req).toHaveBeenCalledTimes(1);
    expect(req).toHaveBeenCalledWith('/planning_hub/events/123/unlock_report');
  });
});
