// @flow
import { useEffect } from 'react';
import type { Dispatch } from '@kitman/common/src/types';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { CurrentUserData } from '@kitman/services/src/services/getCurrentUser';
import type { FormAction } from './useDiagnosticForm';

type Params = {
  isOpen: boolean,
  currentUser: CurrentUserData,
  staffUsers: Array<Option>,
  isRedoxOrg: boolean,
  hasUserId: boolean,
  dispatch: Dispatch<FormAction>,
};

const useDefaultPractitionerEffect = ({
  isOpen,
  currentUser,
  staffUsers,
  isRedoxOrg,
  hasUserId,
  dispatch,
}: Params) => {
  useEffect(() => {
    const userId = currentUser?.id;
    const userExists =
      staffUsers.filter((staffUser) => staffUser.value === userId).length > 0;

    if (isOpen && userId && userExists && !isRedoxOrg && !hasUserId) {
      dispatch({ type: 'SET_USER_ID', userId });
    }
  }, [isOpen, currentUser, staffUsers, isRedoxOrg, hasUserId]);
};

export default useDefaultPractitionerEffect;
