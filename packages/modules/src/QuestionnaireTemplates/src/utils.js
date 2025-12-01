// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { Validation } from '@kitman/common/src/types';
import type { Template } from '../types/__common';

const templatesToMap = (templates: Array<Template>) =>
  templates.reduce((hash, template) => {
    Object.assign(hash, { [template.id.toString()]: template });
    return hash;
  }, {});

export const isAUniqueTemplateName = (
  name: string,
  templates: { [string | number]: Template },
  whiteListedName: ?string
): Validation => {
  let isValid;
  if (name === whiteListedName) {
    isValid = true;
  } else {
    const templatesWithTheSameName = Object.keys(templates).filter(
      (templateId) =>
        templates[templateId].name.toLowerCase() === name.toLowerCase()
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

export default templatesToMap;
