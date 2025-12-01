// Used in the absence of a backend API
// @flow

import type { Form } from '@kitman/modules/src/HumanInput/types/forms';
import { FORM_STATUS } from '@kitman/modules/src/HumanInput/types/forms';
import { commonElement, sharedData } from './templateFormData';

// Temporary data source until API created
export const data: Array<Form> = [
  ...sharedData.map((element) => ({
    ...element,
    status: FORM_STATUS.COMPLETE,
  })),
  commonElement,
];

export const meta = {
  current_page: 1,
  next_page: null,
  prev_page: null,
  total_pages: 1,
  total_count: 2,
};

export const response = {
  data,
  meta,
};
