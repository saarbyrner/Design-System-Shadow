// @flow
import { UserMovementDrawerTranslated as UserMovementDrawer } from '@kitman/modules/src/UserMovement/shared/components/UserMovementDrawer';
import { MovementActivityDrawerTranslated as MovementActivityDrawer } from '@kitman/modules/src/UserMovement/shared/components/MovementActivityDrawer';
import CreateMovementDrawer from '@kitman/modules/src/UserMovement/shared/components/CreateMovementDrawer';
import MovementConfirmationModal from '@kitman/modules/src/UserMovement/shared/components/MovementConfirmationModal';

const UserMovement = () => {
  return (
    <>
      <UserMovementDrawer />
      <CreateMovementDrawer />
      <MovementConfirmationModal />
      <MovementActivityDrawer />
    </>
  );
};

export default UserMovement;
