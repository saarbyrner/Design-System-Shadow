// @flow
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import { FormBuilderTranslated as FormBuilder } from './FormBuilder';

import { FormTemplatesTranslated as FormTemplates } from './FormTemplates';
import GenericApp from '../shared/GenericApp';

const FormTemplatesApp = () => {
  const locationPathname = useLocationPathname();
  const formTemplateId = locationPathname.split('/')[3];

  return (
    <GenericApp customHooks={[]}>
      {formTemplateId ? (
        <FormBuilder formTemplateId={formTemplateId} />
      ) : (
        <FormTemplates />
      )}
    </GenericApp>
  );
};

export default FormTemplatesApp;
