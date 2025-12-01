/* eslint-disable camelcase */
// @flow
import { AppStatus } from '@kitman/components';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@kitman/playbook/hooks';
import { onReset } from '@kitman/modules/src/UserMovement/shared/redux/slices/createMovementSlice';
import { Drawer } from '@kitman/playbook/components';
import { useFetchUserDataQuery } from '@kitman/modules/src/UserMovement/shared/redux/services';
import {
  getDrawerState,
  getFormState,
} from '@kitman/modules/src/UserMovement/shared/redux/selectors/createMovementSelectors';

import { getId } from '@kitman/modules/src/UserMovement/shared/redux/selectors/movementProfileSelectors';

import { getTitle } from '../../config';

import { drawerMixin } from '../../mixins';

import MovementPanelLayout from '../../layouts/CreateMovementDrawerLayout';
import { MovementProfileTranslated as MovementProfile } from '../MovementProfile';
import MovementDate from '../MovementDate';
import MovementInstructions from '../MovementInstructions';
import CreateMovementForm from '../CreateMovementForm';
import { CreateFormActionsTranslated as CreateFormActions } from '../CreateFormActions';

const CreateMovementDrawer = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const userId = useSelector(getId);

  const { transfer_type } = useSelector(getFormState);

  const { isOpen } = useSelector(getDrawerState);

  const { isLoading: isProfileDataLoading, isError: isProfileDataError } =
    useFetchUserDataQuery(
      {
        userId,
        include_athlete: true,
      },
      { skip: !userId || !isOpen }
    );

  const renderContent = () => {
    if (isProfileDataError) return <AppStatus status="error" isEmbed />;
    if (isProfileDataLoading) return <MovementPanelLayout.Loading />;
    return (
      <>
        <MovementPanelLayout.Profile>
          <MovementProfile />
          <MovementDate />
          <MovementInstructions />
        </MovementPanelLayout.Profile>
        <MovementPanelLayout.Content>
          <CreateMovementForm />
        </MovementPanelLayout.Content>
        <MovementPanelLayout.Actions>
          <CreateFormActions />
        </MovementPanelLayout.Actions>
      </>
    );
  };

  return (
    <Drawer open={isOpen} anchor="right" sx={drawerMixin({ theme, isOpen })}>
      <MovementPanelLayout>
        <MovementPanelLayout.Title
          title={getTitle({ type: transfer_type })}
          onClose={() => dispatch(onReset())}
        />
        {renderContent()}
      </MovementPanelLayout>
    </Drawer>
  );
};

export default CreateMovementDrawer;
