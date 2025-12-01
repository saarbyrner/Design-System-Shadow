// @flow

import { MovementFromSelectTranslated as MovementFromSelect } from '../MovementFromSelect';
import { MovementToSelectTranslated as MovementToSelect } from '../MovementToSelect';
import { MovementSquadSelectTranslated as MovementSquadSelect } from '../MovementSquadSelect';

const CreateTradeMovement = () => {
  return (
    <>
      <MovementFromSelect />
      <MovementToSelect />
      <MovementSquadSelect />
    </>
  );
};

export default CreateTradeMovement;
