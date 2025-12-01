// @flow
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';

type ReturnType = {
  isLoading: boolean,
  hasFailed: boolean,
  isSuccess: boolean,
};

const useListStaffProfilesStructure = (): ReturnType => {
  const { isLoading, hasFailed, isSuccess } = useGlobal();

  /**
   * TODO: Integrate Backend API hook to fetch list of staff users.
   */

  return {
    isLoading,
    hasFailed,
    isSuccess,
  };
};

export default useListStaffProfilesStructure;
