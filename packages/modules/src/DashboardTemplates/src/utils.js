// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { Validation } from '@kitman/common/src/types';

import type { Template } from './types';

export const isAUniqueTemplateName = (
  name: string,
  templates: Array<Template>,
  whiteListedName: ?string
): Validation => {
  let isValid;
  if (name === whiteListedName) {
    isValid = true;
  } else {
    const templatesWithTheSameName = templates.filter(
      (template) => template.name.toLowerCase() === name.toLowerCase()
    );
    isValid = templatesWithTheSameName.length === 0;
  }

  const validation = {
    isValid,
    errorType: 'unique',
    message: i18n.t('Name already in use'),
  };

  return validation;
};
