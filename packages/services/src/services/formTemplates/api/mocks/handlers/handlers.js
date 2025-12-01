import { handler as createFormCategory } from '@kitman/services/src/services/formTemplates/api/mocks/handlers/formCategories/create';
import { handler as deleteFormCategory } from '@kitman/services/src/services/formTemplates/api/mocks/handlers/formCategories/delete';
import { handler as getFormCategory } from '@kitman/services/src/services/formTemplates/api/mocks/handlers/formCategories/get';
import { handler as listFormCategories } from '@kitman/services/src/services/formTemplates/api/mocks/handlers/formCategories/list';
import { handler as updateFormCategory } from '@kitman/services/src/services/formTemplates/api/mocks/handlers/formCategories/update';

import { handler as searchFormTemplates } from './formTemplates/search';
import { handler as createFormTemplate } from './formTemplates/create';
import { handler as getCategories } from './formTemplates/getCategories';
import { handler as getProductAreas } from './formTemplates/getProductAreas';
import { handler as fetchFormTemplate } from './formTemplates/fetchFormTemplate';
import { handler as fetchFormAssignments } from './formTemplates/fetchFormAssignments';
import { handler as updateFormAssignments } from './formTemplates/updateFormAssignments';
import { handler as updateFormTemplate } from './formTemplates/updateFormTemplate';
import { handler as updateFormTemplateMetadata } from './formTemplates/updateFormTemplateMetadata';

import { handler as getQuestionBanks } from './formBuilder/getQuestionBanks';
import { handler as getFormHeaderDefaults } from './formBuilder/getFormHeaderDefaults';

export default [
  searchFormTemplates,
  createFormTemplate,
  getCategories,
  getProductAreas,
  getQuestionBanks,
  getFormHeaderDefaults,
  fetchFormTemplate,
  fetchFormAssignments,
  updateFormAssignments,
  updateFormTemplate,
  updateFormTemplateMetadata,
  createFormCategory,
  deleteFormCategory,
  getFormCategory,
  listFormCategories,
  updateFormCategory,
];
