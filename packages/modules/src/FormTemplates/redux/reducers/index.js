// @flow

import {
  REDUCER_KEY as FORM_TEMPLATES_REDUCER_KEY,
  formTemplatesSlice,
} from '../slices/formTemplatesSlice';
import {
  REDUCER_KEY as FORM_BUILDER_REDUCER_KEY,
  formBuilderSlice,
} from '../slices/formBuilderSlice';
import {
  REDUCER_KEY as FORM_TEMPLATE_SETTINGS_REDUCER_KEY,
  formTemplateSettingsSlice,
} from '../slices/formTemplateSettingsSlice';

export default {
  [FORM_TEMPLATES_REDUCER_KEY]: formTemplatesSlice.reducer,
  [FORM_BUILDER_REDUCER_KEY]: formBuilderSlice.reducer,
  [FORM_TEMPLATE_SETTINGS_REDUCER_KEY]: formTemplateSettingsSlice.reducer,
};
