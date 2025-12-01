import { renderHook, act } from '@testing-library/react-hooks';
import {
  useGetCurrentUserQuery,
  useGetOrganisationQuery,
  useGetPermissionsQuery,
  useGetSportQuery,
  useGetActiveSquadQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import {
  mixpanelInit,
  mixpanelIdentify,
  mixpanelTrackPageView,
  mixpanelTrack,
  mixpanelSetProfileProperties,
} from '@kitman/common/src/utils/TrackingData/src/utils';
import useEventTracking from '../useEventTracking';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/common/src/utils/TrackingData/src/utils');

describe('useEventTracking', () => {
  const mockGroupProperties = {
    Association: 'Premier League',
    Organisation: 'Liverpool',
    Sport: 'Football',
    Squad: 'First team',
  };

  const mockUserProperties = {
    PermissionGroup: 'Admin',
    UserPermissions: [{ permission: ['can-view'] }],
  };

  beforeEach(() => {
    window.featureFlags['disable-mixpanel-tracking'] = false;
    window.featureFlags['single-page-application'] = true;

    useGetOrganisationQuery.mockReturnValue({
      data: {
        id: 1,
        name: 'Liverpool',
        association_name: 'Premier League',
      },
    });
    useGetSportQuery.mockReturnValue({
      data: {
        id: 1,
        name: 'Football',
      },
    });
    useGetActiveSquadQuery.mockReturnValue({
      data: {
        id: 1,
        name: 'First team',
      },
    });
    useGetCurrentUserQuery.mockReturnValue({
      data: { role: 'Admin', id: 123 },
    });
    useGetPermissionsQuery.mockReturnValue({
      data: {
        permission: ['can-view'],
      },
    });
  });

  afterEach(() => {
    window.featureFlags = {};
    jest.restoreAllMocks();
  });

  it('should call mixpanel track event on call of trackEvent, with correct data', async () => {
    const { result } = renderHook(() => useEventTracking());
    const mockEventName = 'Test event';
    const mockEventData = { test: 'data', something: 'else' };

    result.current.trackEvent(mockEventName, mockEventData);

    result.current.trackEvent(mockEventName, mockEventData);

    expect(mixpanelTrack).toHaveBeenCalledWith('Test event', {
      ...mockGroupProperties,
      ...mockEventData,
    });
  });

  it('should call mixpanel track page view on call of trackPageView', async () => {
    const { result } = renderHook(() => useEventTracking());

    result.current.trackPageView();

    result.current.trackPageView();

    expect(mixpanelTrackPageView).toHaveBeenCalled();
  });

  it('should call mixpanel init and mixpanel identify on call of initialiseTracking', async () => {
    const { result } = renderHook(() => useEventTracking());

    act(() => {
      result.current.initialiseTracking(123);
    });

    expect(mixpanelInit).toHaveBeenCalled();
    expect(mixpanelIdentify).toHaveBeenCalledWith('123');
  });

  it('should call mixpanel people set once hasInitialised and hasPropertiesBeenSet is true', async () => {
    const { result } = renderHook(() => useEventTracking());

    act(() => {
      result.current.initialiseTracking(123);
    });

    expect(mixpanelSetProfileProperties).toHaveBeenCalledWith(
      mockUserProperties
    );
  });

  it('should call mixpanel people set if hasInitialised is false and if NOT in SPA', async () => {
    window.featureFlags['single-page-application'] = false;
    const { result } = renderHook(() => useEventTracking());

    act(() => {
      result.current.trackPageView();
    });

    expect(mixpanelSetProfileProperties).toHaveBeenCalledWith(
      mockUserProperties
    );
  });
});
