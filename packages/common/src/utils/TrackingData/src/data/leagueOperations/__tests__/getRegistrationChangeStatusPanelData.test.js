import { getChangeStatusPanelTrackingData } from '../getRegistrationChangeStatusPanelData';

describe('getChangeStatusPanelTrackingData', () => {
  it('should return the correct tracking data with userType', () => {
    const trackingData = getChangeStatusPanelTrackingData({
      userType: 'athlete',
    });
    expect(trackingData).toMatchSnapshot();
  });

  it('should return the correct tracking data with userType and status', () => {
    const trackingData = getChangeStatusPanelTrackingData({
      userType: 'athlete',
      status: 'approved',
    });
    expect(trackingData).toMatchSnapshot();
  });

  it('should return the correct tracking data with userType and reason', () => {
    const trackingData = getChangeStatusPanelTrackingData({
      userType: 'athlete',
      reason: 'reason',
    });
    expect(trackingData).toMatchSnapshot();
  });
});
