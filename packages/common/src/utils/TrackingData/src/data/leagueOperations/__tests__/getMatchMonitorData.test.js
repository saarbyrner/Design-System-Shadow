import { getMatchMonitorTrackingData } from '../getMatchMonitorData';

describe('getMatchMonitorTrackingData', () => {
  it('should return the correct tracking data with product and productArea', () => {
    const trackingData = getMatchMonitorTrackingData({
      product: 'league-ops',
      productArea: 'match-monitor-report',
      feature: 'match-monitor',
    });
    expect(trackingData).toMatchSnapshot();
  });

  it('should return the correct tracking data with all properties', () => {
    const trackingData = getMatchMonitorTrackingData({
      product: 'league-ops',
      productArea: 'match-monitor-report',
      feature: 'match-monitor',
    });
    expect(trackingData).toMatchSnapshot();
  });

  it('should return empty object when no properties provided', () => {
    const trackingData = getMatchMonitorTrackingData({});
    expect(trackingData).toMatchSnapshot();
  });
});
