// @flow

import type { ElementTypes } from '@kitman/modules/src/HumanInput/types/forms';

export const DRAWER_WIDTH: number = 350;
export const APP_BAR_HEIGHT: number = 50;
export const TITLE_BAR_HEIGHT: number = 88;
export const TITLE_BAR_XS_HEIGHT: number = 48;
export const FOOTER_HEIGHT: number = 62;
export const FOOTER_XS_HEIGHT: number = 48;
export const TABS_HEIGHT: number = 49;
export const BUILDER_HEADER_HEIGHT: number = 205;

export const INPUT_ELEMENTS: { [key: string]: ElementTypes } = {
  Attachment: 'Forms::Elements::Inputs::Attachment',
  Boolean: 'Forms::Elements::Inputs::Boolean',
  DateTime: 'Forms::Elements::Inputs::DateTime',
  MultipleChoice: 'Forms::Elements::Inputs::MultipleChoice',
  Number: 'Forms::Elements::Inputs::Number',
  Range: 'Forms::Elements::Inputs::Range',
  SingleChoice: 'Forms::Elements::Inputs::SingleChoice',
  Text: 'Forms::Elements::Inputs::Text',
};

export const PDF_EXPORT_PROCESSOR =
  '::Forms::Private::PostProcessors::PdfExportProcessor';

export const INPUT_ELEMENTS_ARRAY: Array<string> = [
  INPUT_ELEMENTS.Attachment,
  INPUT_ELEMENTS.Boolean,
  INPUT_ELEMENTS.DateTime,
  INPUT_ELEMENTS.MultipleChoice,
  INPUT_ELEMENTS.Number,
  INPUT_ELEMENTS.Range,
  INPUT_ELEMENTS.SingleChoice,
  INPUT_ELEMENTS.Text,
];

export const LAYOUT_ELEMENTS: { [key: string]: ElementTypes } = {
  Content: 'Forms::Elements::Layouts::Content',
  Group: 'Forms::Elements::Layouts::Group',
  Menu: 'Forms::Elements::Layouts::Menu',
  MenuGroup: 'Forms::Elements::Layouts::MenuGroup',
  MenuItem: 'Forms::Elements::Layouts::MenuItem',
  Section: 'Forms::Elements::Layouts::Section',
};

export const COMPOSITE_SECTIONS: Array<string> = [
  LAYOUT_ELEMENTS.Content,
  LAYOUT_ELEMENTS.Group,
  LAYOUT_ELEMENTS.Menu,
  LAYOUT_ELEMENTS.MenuGroup,
  LAYOUT_ELEMENTS.MenuItem,
  LAYOUT_ELEMENTS.Section,
];

export const DEFAULT_COLUMNS = 4;
export const DEFAULT_EMPTY_ANSWER_VALUE = '-';

export const MODES = {
  CREATE: 'CREATE',
  EDIT: 'EDIT',
  VIEW: 'VIEW',
};

export const MAX_FILES = 1;

export const FORMS_PRODUCT_AREAS = {
  ATHLETE_PROFILE: 'athlete_profile',
  GENERIC_FORMS_STAFF_FLOW: 'generic_forms_staff_flow',
  GENERIC_FORMS_ATHLETE_FLOW: 'generic_forms_athlete_flow',
};
