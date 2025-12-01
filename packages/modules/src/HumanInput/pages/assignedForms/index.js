// @flow

import GenericApp from '@kitman/modules/src/shared/GenericApp';
import { AssignedFormsTranslated as AssignedForms } from './AssignedForms';

const HumanInputAssignedFormsApp = () => {
  return (
    <GenericApp customHooks={[]}>
      <AssignedForms />
    </GenericApp>
  );
};

export default HumanInputAssignedFormsApp;
