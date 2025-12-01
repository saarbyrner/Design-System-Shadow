// Used in the absence of a backend API
// @flow

import {
  type Form,
  FORM_STATUS,
} from '@kitman/modules/src/HumanInput/types/forms';

export const sharedData = [
  {
    formId: 1,
    formName: 'Wellbeing',
    type: 'Survey',
    category: 'Medical',
    assignedTo: 'Athlete',
    evaluating: 'First team',
    schedule: 'Recurring',
    status: FORM_STATUS.COMPLETE,
    createdBy: 'Premier League',
    updatedAt: '2023-06-15 06:45:12',
  },
  {
    formId: 2,
    formName: 'Growth and maturation - quarterly',
    type: 'Assessment',
    category: 'Development',
    assignedTo: 'Staff',
    evaluating: 'First team',
    schedule: 'Recurring',
    status: FORM_STATUS.COMPLETE,
    createdBy: 'Premier League',
    updatedAt: '2023-06-15 06:45:12',
  },
  {
    formId: 3,
    formName: 'Development review',
    type: 'Review',
    category: 'Development',
    assignedTo: 'Athlete, Staff',
    evaluating: 'U18`s, U17`s',
    schedule: 'Recurring',
    status: FORM_STATUS.COMPLETE,
    createdBy: 'Athletic Trainer',
    updatedAt: '2023-06-15 06:45:12',
  },
  {
    formId: 4,
    formName: 'Attendance',
    type: 'Policy',
    category: 'Operations',
    assignedTo: 'Athlete',
    evaluating: 'First team, Reserves',
    schedule: 'Recurring',
    status: FORM_STATUS.COMPLETE,
    createdBy: 'Team Physio',
    updatedAt: '2023-06-15 06:45:12',
  },
  {
    formId: 5,
    formName: 'Covid Screener',
    type: 'Survey',
    category: 'Medical',
    assignedTo: 'Athlete, Staff',
    evaluating: 'First team, Reserves',
    schedule: 'Recurring',
    status: FORM_STATUS.COMPLETE,
    createdBy: 'Premier League',
    updatedAt: '2023-06-15 06:45:12',
  },
  {
    formId: 6,
    formName: 'U16 league benchmarking',
    type: 'Assessment',
    category: 'Development',
    assignedTo: 'Staff',
    evaluating: 'U16s',
    schedule: 'Recurring',
    status: FORM_STATUS.DRAFT,
    createdBy: 'Premier League',
    updatedAt: '2023-06-15 06:45:12',
  },
  {
    formId: 7,
    formName: 'Conditioning testing',
    type: 'Assessment',
    category: 'Development',
    assignedTo: 'Staff',
    evaluating: 'U23s',
    schedule: 'With event',
    status: FORM_STATUS.COMPLETE,
    createdBy: 'Premier League',
    updatedAt: '2023-06-15 06:45:12',
  },
  {
    formId: 8,
    formName: 'Privacy policy',
    type: 'Policy',
    category: 'Administrative',
    assignedTo: 'Athlete',
    evaluating: 'First team, Reserves',
    schedule: 'One-time',
    status: FORM_STATUS.COMPLETE,
    createdBy: 'Athletic Trainer',
    updatedAt: '2023-06-15 06:45:12',
  },
];

export const commonElement = {
  formId: 9,
  formName: 'Concussion',
  type: 'Survey',
  category: 'Medical',
  assignedTo: 'Athlete, Staff',
  evaluating: 'First team, Reserves',
  schedule: 'Ongoing',
  status: FORM_STATUS.DRAFT,
  createdBy: 'Athletic Trainer',
  updatedAt: '2023-06-15 06:45:12',
};

// Temporary data source until API created
export const data: Array<Form> = [...sharedData, commonElement];

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
