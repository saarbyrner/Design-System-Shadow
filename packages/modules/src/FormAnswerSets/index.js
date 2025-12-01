// @flow

import GenericApp from '@kitman/modules/src/shared/GenericApp';
import { FormAnswerSetsTranslated as FormAnswerSetsGrid } from '@kitman/modules/src/FormAnswerSets/FormAnswerSetsGrid';

const FormAnswerSetsApp = () => {
  return (
    <GenericApp customHooks={[]}>
      <FormAnswerSetsGrid />
    </GenericApp>
  );
};

export default FormAnswerSetsApp;
