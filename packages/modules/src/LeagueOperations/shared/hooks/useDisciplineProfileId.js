// @flow
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import _last from 'lodash/last';
import {
  onSetDisciplineProfile,
  onSetDisciplinaryIssueDetails,
  onSetUserToBeDisciplined,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/disciplinaryIssueSlice';
import { useFetchUserQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import {
  onSetId,
  onSetProfile,
} from '../redux/slices/registrationProfileSlice';

type ReturnType = {
  isLoading: boolean,
  isError: boolean,
  isSuccess: boolean,
};

/**
 * In order to support both SPA and Medinah, useLocationPathname is called
 * to use router params in the case of being within the SPA, or use
 * window.location.pathname in the case of Medinah.
 *
 * Within League Ops Registration, we have two cases where you can land on a user profile page.
 *
 * 1: You are an association or club admin and are viewing a staff member or an athlete
 * - We rely on the url param, a string, which is parsed via parseProfileIdRoute.
 * - If this returns null, we then default to case 2.
 *
 * 2: You are a staff member or an athlete and are viewing your own profile.
 * - You are viewing your own profile, there are no url params available, so use the
 *   id that is returned from the useGetCurrentUserQuery within globalAPI.
 *
 * Either way, we pivot off the user_id, regardless if an athlete or a staff member is being viewed.
 * @returns {ReturnType}
 */

const useDisciplineProfileId = (): ReturnType => {
  const {
    isLoading: isGlobalLoading,
    hasFailed: hasGlobalFailed,
    isSuccess: isGlobalSuccess,
  } = useGlobal();
  const dispatch = useDispatch();

  const pathname = useLocationPathname();
  const userId = parseInt(_last(pathname.split('/')), 10);

  const {
    data: user,
    isLoading: isProfileLoading,
    isError: hasProfileFailed,
    isSuccess: isProfileSuccess,
  } = useFetchUserQuery(userId);

  const setDisciplinaryIssueData = () => {
    // Set the user to be disciplined, required for the panel
    // to display the correct user information
    dispatch(
      onSetUserToBeDisciplined({
        userToBeDisciplined: {
          name: `${user.firstname} ${user.lastname}`,
          user_id: user.id,
          squads: user.squads,
          organisations: user.organisations,
        },
      })
    );

    // set user_id in the disciplinary issue details, required for all cases. For
    // example, when creating a new issue, editing and on row click
    dispatch(
      onSetDisciplinaryIssueDetails({
        user_id: user.id,
      })
    );

    dispatch(
      onSetDisciplineProfile({
        profile: {
          name: `${user.firstname} ${user.lastname}`,
          user_id: user.id,
          squads: user.squads,
          organisations: user.organisations,
        },
      })
    );
  };

  useEffect(() => {
    if (!user) return;
    // TODO: store this in the DisciplineProfile slice, for example: DisciplinaryIssueState
    dispatch(onSetProfile({ profile: user }));
    dispatch(onSetId({ id: user.id }));
    setDisciplinaryIssueData();
  }, [user]);

  const isLoading = [isProfileLoading, isGlobalLoading].includes(true);

  const isError = [hasProfileFailed, hasGlobalFailed].includes(true);

  const isSuccess = [isProfileSuccess, isGlobalSuccess].every(Boolean);

  return {
    isLoading,
    isError,
    isSuccess,
  };
};

export default useDisciplineProfileId;
