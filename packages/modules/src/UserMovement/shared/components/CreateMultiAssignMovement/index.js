// @flow

import { MovementToSelectTranslated as MovementToSelect } from '../MovementToSelect';
import { MovementSquadSelectTranslated as MovementSquadSelect } from '../MovementSquadSelect';

const CreateMultiAssignMovement = () => {
  return (
    <>
      <MovementToSelect />
      <MovementSquadSelect />
    </>
  );
};

export default CreateMultiAssignMovement;
