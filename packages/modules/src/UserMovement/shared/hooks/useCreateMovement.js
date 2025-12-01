// @flow
import {
  useSearchMovementOrganisationsListQuery,
  usePostMovementRecordMutation,
} from '@kitman/modules/src/UserMovement/shared/redux/services';
import type { MovementOrganisation } from '../types';

type ReturnType = {
  isLoading: boolean,
  hasFailed: boolean,
  isFetching: boolean,
  organisationData: Array<MovementOrganisation>,
  onCreateMovementRecord: Function,
};

const useCreateMovement = ({ id = null }: { id: ?string }): ReturnType => {
  const {
    data: organisationData = [],
    isLoading: isorganisationDataLoading,
    isFetching: isorganisationDataFetching,
    isError: isorganisationDataListError,
  } = useSearchMovementOrganisationsListQuery(
    { user_id: id, exclude_trials: true, exclude_trials_v2: true },
    {
      skip: !id,
    }
  );

  const [
    onCreateMovementRecord,
    {
      isLoading: isCreateMovementRecordLoading,
      isError: isCreateMovementRecordError,
    },
  ] = usePostMovementRecordMutation();

  const isLoading = [
    isCreateMovementRecordLoading,
    isorganisationDataLoading,
  ].includes(true);
  const isFetching = [isorganisationDataFetching].includes(true);
  const hasFailed = [
    isorganisationDataListError,
    isCreateMovementRecordError,
  ].includes(true);

  return {
    isLoading,
    isFetching,
    hasFailed,
    organisationData: organisationData || [],
    onCreateMovementRecord,
  };
};

export default useCreateMovement;
