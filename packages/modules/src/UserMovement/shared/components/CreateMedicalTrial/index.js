// @flow

import { MovementToSelectTranslated as MovementToSelect } from '../MovementToSelect';
import { ActiveMedicalTrialsTranslated as ActiveMedicalTrials } from '../ActiveMedicalTrials';

const CreateMedicalTrial = () => {
  return (
    <>
      <MovementToSelect />
      <ActiveMedicalTrials />
    </>
  );
};

export default CreateMedicalTrial;
