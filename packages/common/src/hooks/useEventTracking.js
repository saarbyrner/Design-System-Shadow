// @flow
import { useState, useEffect } from 'react';

import {
  useGetCurrentUserQuery,
  useGetOrganisationQuery,
  useGetPermissionsQuery,
  useGetSportQuery,
  useGetActiveSquadQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import {
  mixpanelTrack,
  mixpanelInit,
  mixpanelIdentify,
  mixpanelTrackPageView,
  mixpanelSetProfileProperties,
  mixpanelRegister,
} from '@kitman/common/src/utils/TrackingData/src/utils';
import type { Permissions } from '@kitman/services/src/services/getPermissions';
import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';

export type GroupProperties = {|
  Sport: ?string,
  Organisation: ?string,
  Association: ?string,
  Squad: ?string,
|};

export type UserProperties = {|
  PermissionGroup: ?string,
  UserPermissions: ?Array<Permissions>,
|};

const useEventTracking = () => {
  const checkIsMounted = useIsMountedCheck();
  const isSPAEnabled = window.featureFlags['single-page-application'];

  const [groupProperties, setGroupProperties] = useState<GroupProperties>({
    Sport: null,
    Organisation: null,
    Association: null,
    Squad: null,
  });
  const [userProperties, setUserProperties] = useState<UserProperties>({
    PermissionGroup: null,
    UserPermissions: null,
  });
  const [hasPropertiesBeenSet, setHasPropertiesBeenSet] = useState(false);
  const [hasInitialised, setHasInitialised] = useState(false);

  const { data: organisation, isSuccess: hasOrganisationDataLoaded } =
    useGetOrganisationQuery();
  const { data: currentUser, isSuccess: hasCurrentUserDataLoaded } =
    useGetCurrentUserQuery();
  const { data: permissions, isSuccess: hasPermissionsDataLoaded } =
    useGetPermissionsQuery(true);
  const { data: sport, isSuccess: hasSportDataLoaded } = useGetSportQuery();
  const { data: activeSquad, isSuccess: hasActiveSquadDataLoaded } =
    useGetActiveSquadQuery();

  const initialiseTracking = (userId: number) => {
    mixpanelInit();
    mixpanelIdentify(userId.toString());
    setHasInitialised(true);
  };

  const trackPageView = () => {
    mixpanelTrackPageView();
  };

  const trackEvent = (eventName: string, metaData: ?{}) => {
    // Flow doesn’t like spreading inexact type of metaData but metaData can be
    // any object value
    // $FlowIgnore[cannot-spread-inexact]
    mixpanelTrack(eventName, {
      ...groupProperties,
      ...metaData,
    });
  };

  useEffect(() => {
    if (!checkIsMounted()) return;

    if (organisation && !groupProperties?.Organisation) {
      setGroupProperties((prevGroupProperties) => ({
        ...prevGroupProperties,
        Organisation: organisation.name,
        Association: organisation.association_name,
      }));
    }

    if (sport && !groupProperties?.Sport) {
      setGroupProperties((prevGroupProperties) => ({
        ...prevGroupProperties,
        Sport: sport.name,
      }));
    }

    if (activeSquad && !groupProperties?.Squad) {
      setGroupProperties((prevGroupProperties) => ({
        ...prevGroupProperties,
        Squad: activeSquad.name,
      }));
    }

    if (currentUser && !userProperties?.PermissionGroup) {
      setUserProperties((prevUserProperties) => ({
        ...prevUserProperties,
        PermissionGroup: currentUser.role,
      }));
    }

    if (permissions && !userProperties.UserPermissions) {
      setUserProperties((prevUserProperties) => ({
        ...prevUserProperties,
        UserPermissions: [permissions],
      }));
    }
  }, [organisation, currentUser, permissions, sport, activeSquad]);

  // Needed to ensure that group & user properties are sent in the events
  // which they aren't always in the SPA due to async state updates
  useEffect(() => {
    if (!checkIsMounted()) return;

    if (
      !hasPropertiesBeenSet &&
      groupProperties.Organisation &&
      groupProperties.Sport &&
      groupProperties.Squad &&
      userProperties.PermissionGroup &&
      userProperties.UserPermissions
    ) {
      setHasPropertiesBeenSet(true);
      mixpanelRegister(groupProperties);
    }
  }, [hasPropertiesBeenSet, groupProperties, userProperties]);

  useEffect(() => {
    if (hasPropertiesBeenSet && (hasInitialised || !isSPAEnabled)) {
      mixpanelSetProfileProperties(userProperties);
    }
  }, [hasPropertiesBeenSet, userProperties, hasInitialised, isSPAEnabled]);

  const hasInitialDataLoaded = [
    hasCurrentUserDataLoaded,
    hasOrganisationDataLoaded,
    hasPermissionsDataLoaded,
    hasSportDataLoaded,
    hasActiveSquadDataLoaded,
  ].every((item) => item === true);

  return {
    trackEvent,
    trackPageView,
    initialiseTracking,
    hasLoaded: hasInitialDataLoaded && hasPropertiesBeenSet,
    hasInitialised,
  };
};

export default useEventTracking;
