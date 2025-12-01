/* eslint-disable camelcase */
// @flow
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  onUpdateForm,
  onReset,
} from '@kitman/modules/src/AdditionalUsers/shared/redux/slices/additionalUsersSlice';
import { parseFromTypeFromLocation } from '@kitman/modules/src/AdditionalUsers/shared/utils';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import { useFetchAdditionalUserQuery } from '@kitman/modules/src/AdditionalUsers/shared/redux/services';

const useAdditionalUsersForm = () => {
  const dispatch = useDispatch();
  const { id, userType, mode } = parseFromTypeFromLocation(
    useLocationPathname()
  );

  const {
    data: additionalUser,
    isLoading,
    isError,
    isSuccess,
  } = useFetchAdditionalUserQuery(id, {
    skip: !id || mode === 'NEW',
  });

  useEffect(() => {
    if (additionalUser) {
      const {
        firstname,
        lastname,
        email,
        locale,
        date_of_birth,
        third_party_scout_organisation,
        is_active,
      } = additionalUser;
      dispatch(
        onUpdateForm({
          firstname,
          lastname,
          email,
          locale,
          date_of_birth,
          third_party_scout_organisation,
          is_active,
        })
      );
    } else {
      dispatch(onReset());
    }
  }, [additionalUser, dispatch]);

  return {
    isLoading,
    hasFailed: isError,
    isSuccess,
    id,
    userType,
    mode,
    additionalUser,
  };
};

export default useAdditionalUsersForm;
