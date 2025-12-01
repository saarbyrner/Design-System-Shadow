// @flow
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import { getCurrentUser } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import { useFetchRegistrationProfileQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationProfileApi';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import {
  onSetRequirementParams,
  onSetProfile,
} from '../redux/slices/registrationRequirementsSlice';

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
 * Within League Ops Registration, when landing on the registration route, we will need to
 * fetch the current user id and the form id from the route params.
 * @returns {ReturnType}
 */

const useRequirementsParams = (): ReturnType => {
  const {
    isLoading: isGlobalLoading,
    hasFailed: hasGlobalFailed,
    isSuccess: isGlobalSuccess,
  } = useGlobal();

  const dispatch = useDispatch();

  const currentUser = useSelector(getCurrentUser());

  const urlParams = useLocationSearch();
  const userId: ?string = urlParams?.get('user_id') ?? currentUser?.id;
  const requirementId: ?string = urlParams?.get('requirement_id');

  const {
    data: profile,
    isLoading: isUserProfileLoading,
    isError: isUserProfileError,
    isSuccess: isUserProfileSuccess,
  } = useFetchRegistrationProfileQuery({ id: userId }, { skip: !userId });

  useEffect(() => {
    if (userId || requirementId) {
      dispatch(onSetRequirementParams({ userId, requirementId }));
    }
  }, [userId, requirementId, dispatch]);

  useEffect(() => {
    if (profile) {
      dispatch(onSetProfile({ profile }));
    }
  }, [profile, dispatch]);

  const isLoading = [isGlobalLoading, isUserProfileLoading].includes(true);

  const isError = [hasGlobalFailed, isUserProfileError].includes(true);

  const isSuccess = [isGlobalSuccess, isUserProfileSuccess].every(
    (v) => v === true
  );

  return {
    isLoading,
    isError,
    isSuccess,
  };
};

export default useRequirementsParams;
