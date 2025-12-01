// @flow
import { useDispatch } from 'react-redux';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import { parseFromLocation } from '@kitman/modules/src/ElectronicFiles/shared/routes/utils';
import { updateSelectedMenuItem } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';

import {
  AppStatus,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';

import { ListContactsAppTranslated as ListContactsApp } from '@kitman/modules/src/ElectronicFiles/ListContacts/src/App';

export default () => {
  const dispatch = useDispatch();
  const { isLoading, hasFailed, isSuccess } = useGlobal();

  const { selectedMenuItem } = parseFromLocation(useLocationPathname());

  dispatch(updateSelectedMenuItem(selectedMenuItem));

  if (hasFailed) {
    return <AppStatus status="error" isEmbed />;
  }
  if (isLoading) {
    return <DelayedLoadingFeedback />;
  }
  if (isSuccess) {
    return (
      <ErrorBoundary>
        <ListContactsApp />
      </ErrorBoundary>
    );
  }

  return null;
};
