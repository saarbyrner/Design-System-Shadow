// @flow
import { AppStatus } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useTheme } from '@kitman/playbook/hooks';
import { Drawer } from '@kitman/playbook/components';
import {
  useFetchUserDataQuery,
  usePostMovementRecordHistoryQuery,
} from '@kitman/modules/src/UserMovement/shared/redux/services';
import { onReset } from '@kitman/modules/src/UserMovement/shared/redux/slices/movementHistorySlice';

import { getDrawerState } from '@kitman/modules/src/UserMovement/shared/redux/selectors/movementHistorySelectors';
import { getId } from '@kitman/modules/src/UserMovement/shared/redux/selectors/movementProfileSelectors';
import MovementPanelLayout from '@kitman/modules/src/UserMovement/shared/layouts/CreateMovementDrawerLayout';
import { drawerMixin } from '@kitman/modules/src/UserMovement/shared/mixins';

import { MovementProfileTranslated as MovementProfile } from '../MovementProfile';
import { HistoryMovementRecordsTranslated as HistoryMovementRecords } from '../HistoryMovementRecords';

const MovementActivityDrawer = (props: I18nProps<{}>) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const userId = useSelector(getId);
  const { isOpen } = useSelector(getDrawerState);

  const { isLoading: isProfileDataLoading, isError: isProfileDataError } =
    useFetchUserDataQuery(
      {
        userId,
        include_athlete: true,
      },
      { skip: !userId || !isOpen }
    );

  const {
    isLoading: isMovmentHistoryLoading,
    isFetching: isMovmentHistoryFetching,
    isError: isMovementHistoryError,
  } = usePostMovementRecordHistoryQuery(
    {
      userId,
    },
    { skip: !userId || !isOpen }
  );

  const isLoading = [
    isProfileDataLoading,
    isMovmentHistoryLoading,
    isMovmentHistoryFetching,
  ].some((i) => i === true);

  const isError = [isProfileDataError, isMovementHistoryError].some(
    (i) => i === true
  );

  const renderContent = () => {
    if (isError) return <AppStatus status="error" isEmbed />;
    if (isLoading) return <MovementPanelLayout.Loading />;
    return (
      <>
        <MovementPanelLayout.Profile>
          <MovementProfile />
        </MovementPanelLayout.Profile>
        <MovementPanelLayout.Content>
          <HistoryMovementRecords
            isLoading={isMovmentHistoryLoading || isMovmentHistoryFetching}
          />
        </MovementPanelLayout.Content>
      </>
    );
  };

  return (
    <Drawer open={isOpen} anchor="right" sx={drawerMixin({ theme, isOpen })}>
      <MovementPanelLayout>
        <MovementPanelLayout.Title
          title={props.t('Activity')}
          onClose={() => dispatch(onReset())}
        />
        {renderContent()}
      </MovementPanelLayout>
    </Drawer>
  );
};

export const MovementActivityDrawerTranslated = withNamespaces()(
  MovementActivityDrawer
);
export default MovementActivityDrawer;
