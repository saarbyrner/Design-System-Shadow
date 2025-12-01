// @flow

import GenericApp from '@kitman/modules/src/shared/GenericApp';
import { FormAssignmentsContentTranslated as FormAssignmentsContent } from '@kitman/modules/src/FormAssignments/FormAssignmentsContent';

const FormAssignmentsApp = () => {
  return (
    <GenericApp customHooks={[]}>
      <FormAssignmentsContent />
    </GenericApp>
  );
};

export default FormAssignmentsApp;
