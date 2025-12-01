// Used in the absence of a backend API
// @flow

import type { FormResult } from '@kitman/modules/src/HumanInput/types/forms';
import { FORM_STATUS } from '@kitman/modules/src/HumanInput/types/forms';

// Temporary data source until API created
export const data: Array<FormResult> = [
  {
    formId: 1,
    resultId: 1,
    athlete: {
      athleteId: 1,
      athleteName: 'Marcus Rashford',
      athletePosition: 'Left Wing',
      imageUrl: '',
    },
    completionDate: '2023-06-15 06:45:12',
    examiner: 'Erik ten Hag',
    status: FORM_STATUS.COMPLETE,
  },
  {
    formId: 1,
    resultId: 2,
    athlete: {
      athleteId: 2,
      athleteName: 'Bruno Fernandes',
      athletePosition: 'Attacking Midfield',
      imageUrl: '',
    },
    completionDate: '2023-06-16 06:45:12',
    examiner: 'Erik ten Hag',
    status: FORM_STATUS.DRAFT,
  },
  {
    formId: 1,
    resultId: 3,
    athlete: {
      athleteId: 3,
      athleteName: 'Lisandro Martinez',
      athletePosition: 'Center Back',
      imageUrl: '',
    },
    completionDate: '2023-06-20 06:45:12',
    examiner: 'Erik ten Hag',
    status: FORM_STATUS.COMPLETE,
  },
  {
    formId: 1,
    resultId: 4,
    athlete: {
      athleteId: 4,
      athleteName: 'Diogo Dalot',
      athletePosition: 'Right Back',
      imageUrl: '',
    },
    completionDate: '2023-06-15 06:45:12',
    examiner: 'Erik ten Hag',
    status: FORM_STATUS.COMPLETE,
  },
  {
    formId: 1,
    resultId: 5,
    athlete: {
      athleteId: 5,
      athleteName: 'Antony dos Santos',
      athletePosition: 'Right Wing',
      imageUrl: '',
    },
    completionDate: '2023-06-15 06:45:12',
    examiner: 'Erik ten Hag',
    status: FORM_STATUS.COMPLETE,
  },
  {
    formId: 1,
    resultId: 6,
    athlete: {
      athleteId: 6,
      athleteName: 'Casemiro',
      athletePosition: 'Defensive Midfield',
      imageUrl: '',
    },
    completionDate: '2023-06-12 06:45:12',
    examiner: 'Erik ten Hag',
    status: FORM_STATUS.DRAFT,
  },
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
