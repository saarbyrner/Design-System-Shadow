// @flow
import { useSelector } from 'react-redux';
import { getProfile } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationProfileSelectors';
import type {
  Registrations,
  RegistrationRows,
} from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';

import { useFetchRegistrationsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';
import withGridDataManagement from '@kitman/modules/src/LeagueOperations/shared/components/withGridDataManagement';
import type { TabProps } from '@kitman/modules/src/LeagueOperations/shared/types/tabs';
import transformRegistrationRows from './utils';

type UserFetchParam = {
  id: number | null,
};
const TabRegistration = (props: TabProps<UserFetchParam>) => {
  const profile = useSelector(getProfile);
  const initialFilters: UserFetchParam = {
    id: profile.id,
  };

  return withGridDataManagement<
    Registrations,
    RegistrationRows,
    UserFetchParam
  >({
    useSearchQuery: useFetchRegistrationsQuery,
    initialFilters,
    title: props.title ? props?.title : '',
    onTransformData: (data) => transformRegistrationRows(data, profile),
    isFullRowClickable: true,
  })({
    filterOverrides: props.filterOverrides ?? {},
    gridQueryParams: props.gridQueryParams,
  });
};

export default TabRegistration;
