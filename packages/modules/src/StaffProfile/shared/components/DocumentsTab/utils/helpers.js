// @flow

import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';

export const useGetEntity = () => {
  const locationPathname = useLocationPathname();
  const userId = locationPathname.split('/')[3];
  return { id: +userId, type: 'User' };
};
