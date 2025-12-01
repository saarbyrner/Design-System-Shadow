import { getScoutAccessTrackingData } from '../getScoutAccessManagementData';

describe('getScoutAccessTrackingData', () => {
  it('should return the correct tracking data with product and productArea', () => {
    const trackingData = getScoutAccessTrackingData({
      product: 'league-ops',
      productArea: 'schedule',
      feature: 'scout-access-management',
    });
    expect(trackingData).toMatchSnapshot();
  });

  it('should return the correct tracking data with all properties', () => {
    const trackingData = getScoutAccessTrackingData({
      isBulkAction: true,
      product: 'league-ops',
      productArea: 'scout-access-management',
      feature: 'scout-access-management',
    });
    expect(trackingData).toMatchSnapshot();
  });

  it('should return empty object when no properties provided', () => {
    const trackingData = getScoutAccessTrackingData({});
    expect(trackingData).toMatchSnapshot();
  });

  it('should return the correct tracking data with isRequestedOnBehalfOf', () => {
    const trackingData = getScoutAccessTrackingData({
      isRequestedOnBehalfOf: true,
    });
    expect(trackingData).toMatchSnapshot();
  });
});
