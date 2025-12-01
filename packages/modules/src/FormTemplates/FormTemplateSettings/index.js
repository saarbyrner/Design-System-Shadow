// @flow

import { SettingsTranslated as Settings } from '@kitman/modules/src/FormTemplates/FormTemplateSettings/Settings';
import GenericApp from '@kitman/modules/src/shared/GenericApp';

const FormTemplateSettings = () => {
  return (
    <GenericApp customHooks={[]}>
      <Settings />
    </GenericApp>
  );
};

export default FormTemplateSettings;
