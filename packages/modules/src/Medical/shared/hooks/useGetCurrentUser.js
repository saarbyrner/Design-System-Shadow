// @flow
import { useState } from 'react';
import getCurrentUser from '@kitman/services/src/services/getCurrentUser';
import type { CurrentUserData } from '@kitman/services/src/services/getCurrentUser';

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUserData>({});

  const fetchCurrentUser = (): Promise<any> =>
    new Promise<void>((resolve: (value: any) => void, reject) =>
      getCurrentUser().then(
        (userData) => {
          setCurrentUser(userData);
          resolve();
        },
        () => reject()
      )
    );

  return {
    currentUser,
    fetchCurrentUser,
  };
};

export default useCurrentUser;
