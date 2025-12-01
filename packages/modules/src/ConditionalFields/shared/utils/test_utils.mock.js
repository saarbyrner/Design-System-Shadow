// @flow

import type { ActiveQuestion, NewQuestionTree } from '../types';

export const defaultOrganisationContext = {
  organisation: {
    id: 66,
    name: 'Liverpool FC',
    handle: 'liverpool',
    logo_path: 'kitman_logo_full_bleed.png',
    logo_full_path:
      'https://kitman-staging.imgix.net/kitman_logo_full_bleed.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
    shortname: 'Liverpool',
    association_admin: false,
  },
  organisationRequestStatus: 'SUCCESS',
};

export const MOCK_CONDITIONAL_FIELDS_URL =
  '/administration/conditional_surveillance/organisations/666/rulesets/10001/versions/2';

export const MOCK_ORGANISATION_ID = 115;

export const MOCK_BLANK_ACTIVE_CONDITION = {
  index: 0,
  location: null,
  name: '',
  order: 1,
  predicate: {
    operator: null,
    operands: [
      {
        operator: null,
        path: '',
        value: '',
      },
    ],
  },
  questions: [
    {
      answer_datatype: '',
      csv_header: null,
      default_required_for_complete_record: '',
      default_value: null,
      detail: null,
      name: '',
      order: 1,
      path: null,
      placement: 'form-end',
      question: 'Aspect',
      question_options: [
        {
          value: 'Anterior',
          order: 1,
        },
        {
          value: 'Posterior',
          order: 2,
        },
      ],
      question_type: 'multiple-choice',
      training_variable_perma_id: null,
      trigger_value: null,
      children: [],
    },
  ],
};

export const MOCK_ACTIVE_CONDITION = {
  index: 0,
  location: 'AdditionalQuestions',
  name: 'Aspect Condition',
  order: 1,
  predicate: {
    operator: 'and',
    operands: [
      {
        operator: 'eq',
        path: 'organisation_coding_system/id',
        value: '2',
      },
    ],
  },
  questions: [
    {
      answer_datatype: 'string',
      csv_header: null,
      default_required_for_complete_record: 'optional',
      default_value: null,
      detail: null,
      id: 26,
      name: 'Question 1',
      order: 1,
      path: null,
      placement: 'form-end',
      question: 'Aspect',
      question_options: [
        {
          value: 'Anterior',
          order: 1,
        },
        {
          value: 'Posterior',
          order: 2,
        },
      ],
      question_type: 'multiple-choice',
      training_variable_perma_id: null,
      trigger_value: null,
      questionNumbering: '1',
      children: [],
    },
  ],
};

export const MOCK_CONDITIONS = [
  {
    index: 0,
    archived_at: null,
    id: 25,
    location: 'AdditionalQuestions',
    name: 'Aspect',
    order: 1,
    predicate: {
      operator: 'and',
      operands: [
        {
          operator: 'eq',
          path: 'organisation_coding_system/id',
          value: '2',
        },
      ],
    },
    questions: [
      {
        question: {
          answer_datatype: 'string',
          csv_header: null,
          default_required_for_complete_record: 'optional',
          default_value: null,
          detail: null,
          id: 26,
          name: 'Question 1',
          order: 1,
          path: null,
          placement: 'form-end',
          question: 'Aspect',
          question_metadata: [
            {
              value: 'Anterior',
              order: 1,
            },
            {
              value: 'Posterior',
              order: 2,
            },
          ],
          question_type: 'multiple-choice',
          training_variable_perma_id: null,
          trigger_value: null,
          ui_component: null,
          questionNumbering: '1',
        },
        children: [],
      },
    ],
  },
];

export const MOCK_QUESTION = {
  answer_datatype: 'string',
  csv_header: null,
  default_required_for_complete_record: 'optional',
  default_value: null,
  detail: null,
  id: 26,
  name: 'Question 1',
  order: 1,
  path: null,
  placement: 'form-end',
  question: 'Aspect',
  question_options: [
    {
      value: 'Anterior',
      order: 1,
    },
    {
      value: 'Posterior',
      order: 2,
    },
  ],
  question_type: 'multiple-choice',
  training_variable_perma_id: null,
  trigger_value: null,
  questionNumbering: '1',
  children: [],
};

export const MOCK_QUESTION_FREE_TEXT = {
  answer_datatype: 'string',
  csv_header: null,
  default_required_for_complete_record: 'optional',
  default_value: null,
  detail: null,
  id: 26,
  name: 'Question 2',
  order: 1,
  path: null,
  placement: 'form-end',
  question: 'Concussion',
  question_type: 'free-text',
  training_variable_perma_id: null,
  trigger_value: null,
  questionNumbering: '2',
  children: [],
};

export const MOCK_QUESTION_DATE = {
  answer_datatype: 'string',
  csv_header: null,
  default_required_for_complete_record: 'optional',
  default_value: null,
  detail: null,
  id: 26,
  name: 'Return to play',
  order: 1,
  path: null,
  placement: 'form-end',
  question: 'What is expected return to play?',
  question_type: 'date',
  training_variable_perma_id: null,
  trigger_value: null,
  questionNumbering: '3',
  children: [],
};

export const MOCK_QUESTION_WITH_FOLLOWUP_QUESTIONS = {
  id: 210,
  answer_datatype: 'string',
  csv_header: null,
  default_required_for_complete_record: 'optional',
  default_value: null,
  detail: '',
  name: 'What is the Surface type?',
  order: 1,
  path: '',
  placement: 'form-end',
  question: 'What is the Surface type?',
  question_options: [
    {
      value: 'Artificial turf',
      order: 1,
    },
    {
      value: 'Grass',
      order: 2,
    },
    {
      value: 'Wood',
      order: 3,
    },
    {
      value: 'Hybrid',
      order: 4,
    },
    {
      value: 'Other',
      order: 5,
    },
  ],
  question_type: 'multiple-choice',
  training_variable_perma_id: null,
  trigger_value: null,
  previous_version_of_question_id: null,
  questionNumbering: '1',
  children: [
    {
      answer_datatype: 'string',
      csv_header: null,
      default_required_for_complete_record: 'optional',
      default_value: null,
      detail: null,
      id: 211,
      name: 'other follow',
      order: 1,
      path: null,
      placement: 'form-end',
      question: 'please specify',
      question_metadata: {},
      question_type: 'multiple-choice',
      training_variable_perma_id: null,
      trigger_value: 'Other',
      ui_component: null,
      question_options: [],
      questionNumbering: '1.1',
      children: [
        {
          answer_datatype: 'string',
          csv_header: null,
          default_required_for_complete_record: 'optional',
          default_value: null,
          detail: null,
          id: 211,
          name: 'follow up second level',
          order: 1,
          path: null,
          placement: 'form-end',
          question: 'please specify',
          question_metadata: {},
          question_type: 'free-text',
          training_variable_perma_id: null,
          trigger_value: 'Other',
          ui_component: null,
          question_options: [],
          questionNumbering: '1.1.1',
          children: [],
        },
      ],
    },
    {
      answer_datatype: 'string',
      csv_header: null,
      default_required_for_complete_record: 'optional',
      default_value: null,
      detail: null,
      id: 212,
      name: 'AT',
      order: 2,
      path: null,
      placement: 'form-end',
      question: 'Which artificial turf type?',
      question_metadata: [
        {
          value: '3G',
          order: 1,
        },
        {
          value: '5G',
          order: 2,
        },
        {
          value: 'Clay',
          order: 3,
        },
        {
          value: 'Sand',
          order: 4,
        },
        {
          value: 'Concrete',
          order: 5,
        },
      ],
      question_type: 'multiple-choice',
      training_variable_perma_id: null,
      trigger_value: 'Artificial turf',
      ui_component: null,
      question_options: [
        {
          value: '3G',
          order: 1,
        },
        {
          value: '5G',
          order: 2,
        },
        {
          value: 'Clay',
          order: 3,
        },
        {
          value: 'Sand',
          order: 4,
        },
        {
          value: 'Concrete',
          order: 5,
        },
      ],
      questionNumbering: '1.2',
      children: [],
    },
  ],
};

export const MOCK_TRANSFORMED_CONDITIONS = [
  {
    id: 25,
    index: 0,
    location: 'AdditionalQuestions',
    name: 'Aspect Condition',
    order: 1,
    predicate: {
      operands: [
        { operator: 'eq', path: 'organisation_coding_system/id', value: '2' },
      ],
      operator: 'and',
    },
    questions: [
      {
        id: 26,
        answer_datatype: 'string',
        csv_header: null,
        default_required_for_complete_record: 'optional',
        default_value: null,
        detail: '',
        name: 'Question 1',
        order: 1,
        path: '',
        placement: 'form-end',
        previous_version_of_question_id: null,
        question: 'Aspect',
        question_options: [
          { order: 1, value: 'Anterior' },
          { order: 2, value: 'Posterior' },
        ],
        question_type: 'multiple-choice',
        training_variable_perma_id: null,
        trigger_value: null,
        children: [],
        questionNumbering: '1',
      },
    ],
  },
];

export const MOCKED_TRANSFORMED_PREDICATE_OPTIONS = [
  {
    value: 'activity/id',
    label: 'Activity',
    metaData: {
      operators: [{ label: 'Is', value: 'eq' }],
      options: [
        { label: ' Primary Mechanism of Injury - Accelerating', value: 37 },
        {
          label: ' Primary Mechanism of Injury - Aerial Challenge',
          value: 257,
        },
        {
          label: ' Primary Mechanism of Injury - Being Tackled',
          value: 991,
        },
        { label: ' Primary Mechanism of Injury - Blocked', value: 539 },
        { label: ' Primary Mechanism of Injury - Blocking', value: 925 },
        {
          label: ' Primary Mechanism of Injury - Change of Direction',
          value: 1806,
        },
        { label: ' Primary Mechanism of Injury - Collision', value: 231 },
        { label: ' Primary Mechanism of Injury - Collision', value: 124 },
        { label: 'Primary Mechanism of Injury - Accelerating', value: 45 },
        {
          label: 'Primary Mechanism of Injury - Aerial Challenge',
          value: 258,
        },
        { label: 'Primary Mechanism of Injury - Agility', value: 605 },
        {
          label: 'Primary Mechanism of Injury - Being Tackled',
          value: 992,
        },
        { label: 'Primary Mechanism of Injury - Blocked', value: 540 },
        { label: 'Primary Mechanism of Injury - Blocking', value: 937 },
        {
          label: 'Primary Mechanism of Injury - Change of Direction',
          value: 1807,
        },
      ],
      deprecated: false,
      path: 'activity/id',
    },
  },
  {
    value: 'activity_group/id',
    label: 'Activity Group',
    metaData: {
      operators: [{ label: 'Is', value: 'eq' }],
      options: [
        { label: ' Primary Mechanism of Injury', value: 5 },
        { label: 'Primary Mechanism of Injury', value: 6 },
      ],
      deprecated: false,
      path: 'activity_group/id',
    },
  },
  {
    value: 'event_type/id',
    label: 'Event Type',
    metaData: {
      operators: [{ label: 'Is', value: 'eq' }],
      options: [
        { label: 'Game', value: 2 },
        { label: 'Lesson', value: 5 },
        { label: 'Medical', value: 3 },
        { label: 'Meeting', value: 4 },
        { label: 'Other', value: 7 },
        { label: 'Session', value: 1 },
        { label: 'Travel', value: 6 },
      ],
      deprecated: false,
      path: 'event_type/id',
    },
  },
];

export const MOCK_ACTIVE_PREDICATE_OPERANDS = {
  path: 'activity/id',
  operator: 'eq',
  value: 37,
};

export const MOCK_TRANSFORMED_TRIGGER_OPTIONS = [
  {
    label: ' Primary Mechanism of Injury - Accelerating',
    value: '37',
  },
  {
    label: ' Primary Mechanism of Injury - Aerial Challenge',
    value: '257',
  },
  {
    label: ' Primary Mechanism of Injury - Being Tackled',
    value: '991',
  },
  { label: ' Primary Mechanism of Injury - Blocked', value: '539' },
  { label: ' Primary Mechanism of Injury - Blocking', value: '925' },
  {
    label: ' Primary Mechanism of Injury - Change of Direction',
    value: '1806',
  },
  { label: ' Primary Mechanism of Injury - Collision', value: '231' },
  { label: ' Primary Mechanism of Injury - Collision', value: '124' },
  {
    label: 'Primary Mechanism of Injury - Accelerating',
    value: '45',
  },
  {
    label: 'Primary Mechanism of Injury - Aerial Challenge',
    value: '258',
  },
  { label: 'Primary Mechanism of Injury - Agility', value: '605' },
  {
    label: 'Primary Mechanism of Injury - Being Tackled',
    value: '992',
  },
  { label: 'Primary Mechanism of Injury - Blocked', value: '540' },
  { label: 'Primary Mechanism of Injury - Blocking', value: '937' },
  {
    label: 'Primary Mechanism of Injury - Change of Direction',
    value: '1807',
  },
];

export const MOCK_TRANSFORMED_OPERATOR_OPTIONS = [{ label: 'Is', value: 'eq' }];

export const MOCK_RESPONSE_SELECT_QUESTION = {
  question: {
    answer_datatype: 'string',
    csv_header: null,
    default_required_for_complete_record: 'optional',
    default_value: null,
    detail: null,
    id: 26,
    name: 'Question 1',
    order: 1,
    path: null,
    placement: 'form-end',
    question: 'Aspect',
    question_metadata: [
      {
        value: 'Anterior',
        order: 1,
      },
      {
        value: 'Posterior',
        order: 2,
      },
    ],
    question_type: 'multiple-choice',
    training_variable_perma_id: null,
    trigger_value: null,
    children: [],
  },
  children: [],
};

export const MOCK_RESPONSE_TEXT_QUESTION = {
  question: {
    answer_datatype: 'string',
    csv_header: null,
    default_required_for_complete_record: 'optional',
    default_value: null,
    detail: null,
    id: 26,
    name: 'Question 2',
    order: 1,
    path: null,
    placement: 'form-end',
    question: 'How do you feel?',
    question_type: 'free-text',
    training_variable_perma_id: null,
    trigger_value: null,
    children: [],
  },
  children: [],
};

export const MOCK_RESPONSE_DATE_QUESTION = {
  question: {
    answer_datatype: 'string',
    csv_header: null,
    default_required_for_complete_record: 'optional',
    default_value: null,
    detail: null,
    id: 26,
    name: 'Return to play',
    order: 1,
    path: null,
    placement: 'form-end',
    question: 'What is expected return to play?',
    question_type: 'date',
    training_variable_perma_id: null,
    trigger_value: null,
    children: [],
  },
  children: [],
};

export const MOCK_RESPONSE_QUESTION_WITH_FOLLOWUPS = {
  question: {
    id: 210,
    answer_datatype: 'string',
    csv_header: null,
    default_required_for_complete_record: 'optional',
    default_value: null,
    detail: '',
    name: 'What is the Surface type?',
    order: 1,
    path: '',
    placement: 'form-end',
    question: 'What is the Surface type?',
    question_metadata: [
      {
        value: 'Artificial turf',
        order: 1,
      },
      {
        value: 'Grass',
        order: 2,
      },
      {
        value: 'Wood',
        order: 3,
      },
      {
        value: 'Hybrid',
        order: 4,
      },
      {
        value: 'Other',
        order: 5,
      },
    ],
    question_type: 'multiple-choice',
    training_variable_perma_id: null,
    trigger_value: null,
    previous_version_of_question_id: null,
    children: [
      {
        answer_datatype: 'string',
        csv_header: null,
        default_required_for_complete_record: 'optional',
        default_value: null,
        detail: null,
        id: 211,
        name: 'other follow',
        order: 1,
        path: null,
        placement: 'form-end',
        question: 'please specify',
        question_metadata: {},
        question_type: 'free-text',
        training_variable_perma_id: null,
        trigger_value: 'Other',
        ui_component: null,
        question_options: {},
      },
      {
        answer_datatype: 'string',
        csv_header: null,
        default_required_for_complete_record: 'optional',
        default_value: null,
        detail: null,
        id: 212,
        name: 'AT',
        order: 2,
        path: null,
        placement: 'form-end',
        question: 'Which artificial turf type?',
        question_metadata: [
          {
            value: '3G',
            order: 1,
          },
          {
            value: '5G',
            order: 2,
          },
          {
            value: 'Clay',
            order: 3,
          },
          {
            value: 'Sand',
            order: 4,
          },
          {
            value: 'Concrete',
            order: 5,
          },
        ],
        question_type: 'multiple-choice',
        training_variable_perma_id: null,
        trigger_value: 'Artificial turf',
        ui_component: null,
        question_options: [
          {
            value: '3G',
            order: 1,
          },
          {
            value: '5G',
            order: 2,
          },
          {
            value: 'Clay',
            order: 3,
          },
          {
            value: 'Sand',
            order: 4,
          },
          {
            value: 'Concrete',
            order: 5,
          },
        ],
      },
    ],
  },
  children: [
    {
      answer_datatype: 'string',
      csv_header: null,
      default_required_for_complete_record: 'optional',
      default_value: null,
      detail: null,
      id: 211,
      name: 'other follow',
      order: 1,
      path: null,
      placement: 'form-end',
      question: 'please specify',
      question_metadata: {},
      question_type: 'free-text',
      training_variable_perma_id: null,
      trigger_value: 'Other',
      ui_component: null,
      question_options: {},
    },
    {
      answer_datatype: 'string',
      csv_header: null,
      default_required_for_complete_record: 'optional',
      default_value: null,
      detail: null,
      id: 212,
      name: 'AT',
      order: 2,
      path: null,
      placement: 'form-end',
      question: 'Which artificial turf type?',
      question_metadata: [
        {
          value: '3G',
          order: 1,
        },
        {
          value: '5G',
          order: 2,
        },
        {
          value: 'Clay',
          order: 3,
        },
        {
          value: 'Sand',
          order: 4,
        },
        {
          value: 'Concrete',
          order: 5,
        },
      ],
      question_type: 'multiple-choice',
      training_variable_perma_id: null,
      trigger_value: 'Artificial turf',
      ui_component: null,
      question_options: [
        {
          value: '3G',
          order: 1,
        },
        {
          value: '5G',
          order: 2,
        },
        {
          value: 'Clay',
          order: 3,
        },
        {
          value: 'Sand',
          order: 4,
        },
        {
          value: 'Concrete',
          order: 5,
        },
      ],
    },
  ],
};

export const MOCK_DATE = '2024-10-29T00:00:00+00:00';

export const MOCK_ACTIVE_QUESTION = {
  id: 371,
  answer_datatype: 'string',
  csv_header: null,
  default_required_for_complete_record: 'optional',
  default_value: null,
  detail: '',
  name: 'Root question 1 - 4th rule',
  order: 1,
  path: '',
  placement: 'form-end',
  question: 'whats a root question?',
  question_options: [
    {
      value: 'abcde',
      order: 1,
    },
    {
      value: 'asdfg',
      order: 2,
    },
  ],
  question_type: 'multiple-choice',
  training_variable_perma_id: null,
  trigger_value: null,
  previous_version_of_question_id: 213,
  children: [
    {
      answer_datatype: 'string',
      archived: false,
      csv_header: null,
      default_required_for_complete_record: 'optional',
      default_required_for_surveillance: false,
      default_value: null,
      detail: null,
      id: 372,
      name: 'abcde - FOLLOW UP',
      order: 1,
      path: null,
      placement: 'form-end',
      question: 'abcde, huh?',
      question_metadata: [
        {
          value: '1234',
          order: 1,
        },
        {
          value: '4321',
          order: 2,
        },
      ],
      question_type: 'multiple-choice',
      training_variable_perma_id: null,
      trigger_value: 'abcde',
      ui_component: null,
      question_options: [
        {
          value: '1234',
          order: 1,
        },
        {
          value: '4321',
          order: 2,
        },
      ],
    },
    {
      answer_datatype: 'string',
      archived: false,
      csv_header: null,
      default_required_for_complete_record: 'optional',
      default_required_for_surveillance: false,
      default_value: null,
      detail: null,
      id: 373,
      name: 'second followup ',
      order: 2,
      path: null,
      placement: 'form-end',
      question: 'what?',
      question_metadata: {},
      question_type: 'free-text',
      training_variable_perma_id: null,
      trigger_value: 'asdfg',
      ui_component: null,
      question_options: {},
    },
  ],
};

export const MOCK_TRANSFORMED_QUESTION = {
  answer_datatype: 'string',
  default_required_for_complete_record: 'optional',
  question_options: [
    {
      value: 'abcde',
      order: 1,
    },
    {
      value: 'asdfg',
      order: 2,
    },
  ],
  question_type: 'multiple-choice',
  question: 'whats a root question?',
  placement: 'form-end',
  csv_header: null,
  default_value: null,
  name: 'Root question 1 - 4th rule',
  previous_version_of_question_id: 213,
  training_variable_perma_id: null,
  trigger_value: null,
};

export const MOCK_ACTIVE_QUESTIONS_ARRAY = [
  {
    id: 387,
    answer_datatype: 'string',
    csv_header: null,
    default_required_for_complete_record: 'optional',
    default_value: null,
    detail: '',
    name: 'Root question second rule',
    order: 1,
    path: '',
    placement: 'form-end',
    question: 'Root question',
    question_options: [
      {
        value: 'a',
        order: 1,
      },
      {
        value: 'b',
        order: 2,
      },
      {
        value: 'c',
        order: 3,
      },
    ],
    question_type: 'multiple-choice',
    training_variable_perma_id: null,
    trigger_value: null,
    previous_version_of_question_id: 213,
    questionNumbering: '1',
    children: [
      {
        answer_datatype: 'string',
        archived: false,
        csv_header: null,
        default_required_for_complete_record: 'optional',
        default_required_for_surveillance: false,
        default_value: null,
        detail: null,
        id: 388,
        name: 'follow up a',
        order: 1,
        path: null,
        placement: 'form-end',
        question: 'follow up question -- a?',
        question_metadata: {},
        question_type: 'free-text',
        training_variable_perma_id: null,
        trigger_value: 'a',
        ui_component: null,
        question_options: {},
        previous_version_of_question_id: 213,
        children: [],
        questionNumbering: '1.1',
      },
      {
        answer_datatype: 'string',
        archived: false,
        csv_header: null,
        default_required_for_complete_record: 'optional',
        default_required_for_surveillance: false,
        default_value: null,
        detail: null,
        id: 389,
        name: 'follow B',
        order: 2,
        path: null,
        placement: 'form-end',
        question: 'follow up question -- b?',
        question_metadata: [
          {
            value: '1',
            order: 1,
          },
          {
            value: '2',
            order: 2,
          },
          {
            value: '3',
            order: 3,
          },
        ],
        question_type: 'multiple-choice',
        training_variable_perma_id: null,
        trigger_value: 'b',
        ui_component: null,
        question_options: [
          {
            value: '1',
            order: 1,
          },
          {
            value: '2',
            order: 2,
          },
          {
            value: '3',
            order: 3,
          },
        ],
        previous_version_of_question_id: 213,
        questionNumbering: '1.2',
        children: [],
      },
    ],
  },
  {
    id: 117,
    answer_datatype: 'string',
    csv_header: null,
    default_required_for_complete_record: 'optional',
    default_value: null,
    detail: '',
    name: 'Root question 2',
    order: 1,
    path: '',
    placement: 'form-end',
    question: 'Root question 2',
    question_options: [
      {
        value: 'a',
        order: 1,
      },
      {
        value: 'b',
        order: 2,
      },
      {
        value: 'c',
        order: 3,
      },
    ],
    question_type: 'multiple-choice',
    training_variable_perma_id: null,
    trigger_value: null,
    previous_version_of_question_id: 213,
    questionNumbering: '2',
    children: [],
  },
];

export const MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP = [
  {
    id: 387,
    answer_datatype: 'string',
    csv_header: null,
    default_required_for_complete_record: 'optional',
    default_value: null,
    detail: '',
    name: 'Root question second rule',
    order: 1,
    path: '',
    placement: 'form-end',
    question: 'Root question',
    question_options: [
      {
        value: 'a',
        order: 1,
      },
      {
        value: 'b',
        order: 2,
      },
      {
        value: 'c',
        order: 3,
      },
    ],
    question_type: 'multiple-choice',
    training_variable_perma_id: null,
    trigger_value: null,
    previous_version_of_question_id: 213,
    questionNumbering: '1',
    children: [
      {
        answer_datatype: 'string',
        archived: false,
        csv_header: null,
        default_required_for_complete_record: 'optional',
        default_required_for_surveillance: false,
        default_value: null,
        detail: null,
        id: 388,
        name: 'follow up a',
        order: 1,
        path: null,
        placement: 'form-end',
        question: 'follow up question -- a?',
        question_metadata: {},
        question_type: 'free-text',
        training_variable_perma_id: null,
        trigger_value: 'a',
        ui_component: null,
        question_options: {},
        previous_version_of_question_id: 213,
        questionNumbering: '1.1',
        children: [
          {
            answer_datatype: 'string',
            csv_header: null,
            default_required_for_complete_record: 'optional',
            default_value: null,
            detail: null,
            name: '',
            order: 1,
            path: null,
            placement: 'form-end',
            question: '',
            question_options: [],
            question_type: '',
            training_variable_perma_id: null,
            trigger_value: null,
            previous_version_of_question_id: null,
            children: [],
            questionNumbering: '1.1.1',
          },
        ],
      },
      {
        answer_datatype: 'string',
        archived: false,
        csv_header: null,
        default_required_for_complete_record: 'optional',
        default_required_for_surveillance: false,
        default_value: null,
        detail: null,
        id: 389,
        name: 'follow B',
        order: 2,
        path: null,
        placement: 'form-end',
        question: 'follow up question -- b?',
        question_metadata: [
          {
            value: '1',
            order: 1,
          },
          {
            value: '2',
            order: 2,
          },
          {
            value: '3',
            order: 3,
          },
        ],
        question_type: 'multiple-choice',
        training_variable_perma_id: null,
        trigger_value: 'b',
        ui_component: null,
        question_options: [
          {
            value: '1',
            order: 1,
          },
          {
            value: '2',
            order: 2,
          },
          {
            value: '3',
            order: 3,
          },
        ],
        previous_version_of_question_id: 213,
        questionNumbering: '1.2',
        children: [],
      },
    ],
  },
  {
    id: 117,
    answer_datatype: 'string',
    csv_header: null,
    default_required_for_complete_record: 'optional',
    default_value: null,
    detail: '',
    name: 'Root question 2',
    order: 1,
    path: '',
    placement: 'form-end',
    question: 'Root question 2',
    question_options: [
      {
        value: 'a',
        order: 1,
      },
      {
        value: 'b',
        order: 2,
      },
      {
        value: 'c',
        order: 3,
      },
    ],
    question_type: 'multiple-choice',
    training_variable_perma_id: null,
    trigger_value: null,
    previous_version_of_question_id: 213,
    questionNumbering: '2',
    children: [],
  },
];

export const MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP_UPDATE = [
  {
    ...MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP[0],
    children: [
      {
        ...MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP[0].children[0],
        children: [
          {
            ...MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP[0].children[0]
              .children[0],
            name: 'new name',
          },
        ],
      },
      ...MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP[0].children.slice(1),
    ],
  },
  ...MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP.slice(1),
];

export const MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP_METADATA = [
  {
    ...MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP[0],
    children: [
      {
        ...MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP[0].children[0],
        children: [
          {
            ...MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP[0].children[0]
              .children[0],
            question_options: [
              {
                value: '',
                order: 1,
              },
            ],
          },
        ],
      },
      ...MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP[0].children.slice(1),
    ],
  },
  ...MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP.slice(1),
];

export const MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP_METADATA_UPDATE = [
  {
    ...MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP_METADATA[0],
    children: [
      {
        ...MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP_METADATA[0].children[0],
        children: [
          {
            ...MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP_METADATA[0].children[0]
              .children[0],
            question_options: [
              {
                value: 'new option',
                order: 1,
              },
            ],
          },
        ],
      },
      ...MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP_METADATA[0].children.slice(
        1
      ),
    ],
  },
  ...MOCK_ACTIVE_QUESTIONS_ARRAY_WITH_FOLLOWUP_METADATA.slice(1),
];

export const MOCK_4_LEVELS_ACTIVE_QUESTIONS_ARRAY: Array<ActiveQuestion> = [
  {
    id: 1,
    answer_datatype: 'string',
    csv_header: null,
    default_required_for_complete_record: 'optional',
    default_value: null,
    detail: '',
    name: 'Question 1',
    order: 1,
    path: '',
    placement: 'form-end',
    question: 'Question 1',
    question_options: [],
    question_type: 'text',
    training_variable_perma_id: null,
    trigger_value: null,
    previous_version_of_question_id: null,
    questionNumbering: '1',
    children: [
      {
        id: 2,
        answer_datatype: 'string',
        csv_header: null,
        default_required_for_complete_record: 'optional',
        default_value: null,
        detail: '',
        name: 'Question 2',
        order: 1,
        path: '',
        placement: 'form-end',
        question: 'Question 2',
        question_options: [],
        question_type: 'text',
        training_variable_perma_id: null,
        trigger_value: null,
        previous_version_of_question_id: null,
        questionNumbering: '1.1',
        children: [
          {
            id: 3,
            answer_datatype: 'string',
            csv_header: null,
            default_required_for_complete_record: 'optional',
            default_value: null,
            detail: '',
            name: 'Question 3',
            order: 1,
            path: '',
            placement: 'form-end',
            question: 'Question 3',
            question_options: [],
            question_type: 'text',
            training_variable_perma_id: null,
            trigger_value: null,
            previous_version_of_question_id: null,
            questionNumbering: '1.1.1',
            children: [
              {
                id: 4,
                answer_datatype: 'string',
                csv_header: null,
                default_required_for_complete_record: 'optional',
                default_value: null,
                detail: '',
                name: 'Question 4',
                order: 1,
                path: '',
                placement: 'form-end',
                question: 'Question 4',
                question_options: [],
                question_type: 'text',
                training_variable_perma_id: null,
                trigger_value: null,
                previous_version_of_question_id: null,
                children: [],
                questionNumbering: '1.1.1.1',
              },
            ],
          },
        ],
      },
    ],
  },
];

export const MOCK_TRANSFORMED_4_LEVELS_QUESTIONS_ARRAY: Array<NewQuestionTree> =
  [
    {
      question: {
        answer_datatype: 'string',
        default_required_for_complete_record: 'optional',
        question_options: [],
        question_type: 'text',
        question: 'Question 1',
        placement: 'form-end',
        csv_header: null,
        default_value: null,
        name: 'Question 1',
        previous_version_of_question_id: null,
        training_variable_perma_id: null,
        trigger_value: null,
      },
      children: [
        {
          question: {
            answer_datatype: 'string',
            default_required_for_complete_record: 'optional',
            question_options: [],
            question_type: 'text',
            question: 'Question 2',
            placement: 'form-end',
            csv_header: null,
            default_value: null,
            name: 'Question 2',
            previous_version_of_question_id: null,
            training_variable_perma_id: null,
            trigger_value: null,
          },
          children: [
            {
              question: {
                answer_datatype: 'string',
                default_required_for_complete_record: 'optional',
                question_options: [],
                question_type: 'text',
                question: 'Question 3',
                placement: 'form-end',
                csv_header: null,
                default_value: null,
                name: 'Question 3',
                previous_version_of_question_id: null,
                training_variable_perma_id: null,
                trigger_value: null,
              },
              children: [
                {
                  question: {
                    answer_datatype: 'string',
                    default_required_for_complete_record: 'optional',
                    question_options: [],
                    question_type: 'text',
                    question: 'Question 4',
                    placement: 'form-end',
                    csv_header: null,
                    default_value: null,
                    name: 'Question 4',
                    previous_version_of_question_id: null,
                    training_variable_perma_id: null,
                    trigger_value: null,
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

export const MOCK_TRANSFORMED_QUESTIONS_ARRAY = [
  {
    question: {
      answer_datatype: 'string',
      default_required_for_complete_record: 'optional',
      question_options: [
        {
          value: 'a',
          order: 1,
        },
        {
          value: 'b',
          order: 2,
        },
        {
          value: 'c',
          order: 3,
        },
      ],
      question_type: 'multiple-choice',
      question: 'Root question',
      placement: 'form-end',
      csv_header: null,
      default_value: null,
      name: 'Root question second rule',
      previous_version_of_question_id: 213,
      training_variable_perma_id: null,
      trigger_value: null,
    },
    children: [
      {
        question: {
          answer_datatype: 'string',
          default_required_for_complete_record: 'optional',
          question_options: {},
          question_type: 'free-text',
          question: 'follow up question -- a?',
          placement: 'form-end',
          csv_header: null,
          default_value: null,
          name: 'follow up a',
          training_variable_perma_id: null,
          trigger_value: 'a',
          previous_version_of_question_id: 213,
        },
        children: [],
      },
      {
        question: {
          answer_datatype: 'string',
          default_required_for_complete_record: 'optional',
          question_options: [
            {
              value: '1',
              order: 1,
            },
            {
              value: '2',
              order: 2,
            },
            {
              value: '3',
              order: 3,
            },
          ],
          question_type: 'multiple-choice',
          question: 'follow up question -- b?',
          placement: 'form-end',
          csv_header: null,
          default_value: null,
          name: 'follow B',
          training_variable_perma_id: null,
          trigger_value: 'b',
          previous_version_of_question_id: 213,
        },
        children: [],
      },
    ],
  },
  {
    question: {
      answer_datatype: 'string',
      default_required_for_complete_record: 'optional',
      question_options: [
        {
          value: 'a',
          order: 1,
        },
        {
          value: 'b',
          order: 2,
        },
        {
          value: 'c',
          order: 3,
        },
      ],
      question_type: 'multiple-choice',
      question: 'Root question 2',
      placement: 'form-end',
      csv_header: null,
      default_value: null,
      name: 'Root question 2',
      previous_version_of_question_id: 213,
      training_variable_perma_id: null,
      trigger_value: null,
    },
    children: [],
  },
];

export const MOCK_ACTIVE_CONDITION_TO_TRANSFORM = {
  id: 284,
  index: 0,
  predicate: {
    operator: 'and',
    operands: [
      {
        operator: 'eq',
        path: 'illness_onset/id',
        value: '1',
      },
    ],
  },
  location: 'AdditionalQuestions',
  name: 'Second rule, "The Big Save" - TESTING EDIT',
  order: 1,
  questions: [
    {
      id: 387,
      answer_datatype: 'string',
      csv_header: null,
      default_required_for_complete_record: 'optional',
      default_value: null,
      detail: '',
      name: 'Root question second rule',
      order: 1,
      path: '',
      placement: 'form-end',
      question: 'Root question',
      question_options: [
        {
          value: 'a',
          order: 1,
        },
        {
          value: 'b',
          order: 2,
        },
        {
          value: 'c',
          order: 3,
        },
      ],
      question_type: 'multiple-choice',
      training_variable_perma_id: null,
      trigger_value: null,
      previous_version_of_question_id: 213,
      children: [
        {
          answer_datatype: 'string',
          archived: false,
          csv_header: null,
          default_required_for_complete_record: 'optional',
          default_required_for_surveillance: false,
          default_value: null,
          detail: null,
          id: 388,
          name: 'follow up a',
          order: 1,
          path: null,
          placement: 'form-end',
          question: 'follow up question -- a?',
          question_metadata: {},
          question_type: 'free-text',
          training_variable_perma_id: null,
          trigger_value: 'a',
          ui_component: null,
          question_options: {},
          previous_version_of_question_id: 213,
          children: [],
        },
        {
          answer_datatype: 'string',
          archived: false,
          csv_header: null,
          default_required_for_complete_record: 'optional',
          default_required_for_surveillance: false,
          default_value: null,
          detail: null,
          id: 389,
          name: 'follow B',
          order: 2,
          path: null,
          placement: 'form-end',
          question: 'follow up question -- b?',
          question_metadata: [
            {
              value: '1',
              order: 1,
            },
            {
              value: '2',
              order: 2,
            },
            {
              value: '3',
              order: 3,
            },
          ],
          question_type: 'multiple-choice',
          training_variable_perma_id: null,
          trigger_value: 'b',
          ui_component: null,
          question_options: [
            {
              value: '1',
              order: 1,
            },
            {
              value: '2',
              order: 2,
            },
            {
              value: '3',
              order: 3,
            },
          ],
          previous_version_of_question_id: 213,
          children: [],
        },
      ],
    },
  ],
};

export const MOCK_TRANSFORMED_CONDITION_FOR_PAYLOAD = {
  location: 'AdditionalQuestions',
  name: 'Second rule, "The Big Save" - TESTING EDIT',
  questions: [
    {
      question: {
        answer_datatype: 'string',
        default_required_for_complete_record: 'optional',
        question_options: [
          {
            value: 'a',
            order: 1,
          },
          {
            value: 'b',
            order: 2,
          },
          {
            value: 'c',
            order: 3,
          },
        ],
        question_type: 'multiple-choice',
        question: 'Root question',
        placement: 'form-end',
        csv_header: null,
        default_value: null,
        name: 'Root question second rule',
        previous_version_of_question_id: 213,
        training_variable_perma_id: null,
        trigger_value: null,
      },
      children: [
        {
          question: {
            answer_datatype: 'string',
            default_required_for_complete_record: 'optional',
            question_options: {},
            question_type: 'free-text',
            question: 'follow up question -- a?',
            placement: 'form-end',
            csv_header: null,
            default_value: null,
            name: 'follow up a',
            training_variable_perma_id: null,
            trigger_value: 'a',
            previous_version_of_question_id: 213,
          },
          children: [],
        },
        {
          question: {
            answer_datatype: 'string',
            default_required_for_complete_record: 'optional',
            question_options: [
              {
                value: '1',
                order: 1,
              },
              {
                value: '2',
                order: 2,
              },
              {
                value: '3',
                order: 3,
              },
            ],
            question_type: 'multiple-choice',
            question: 'follow up question -- b?',
            placement: 'form-end',
            csv_header: null,
            default_value: null,
            name: 'follow B',
            training_variable_perma_id: null,
            trigger_value: 'b',
            previous_version_of_question_id: 213,
          },
          children: [],
        },
      ],
    },
  ],
  predicate: {
    operator: 'and',
    operands: [
      {
        operator: 'eq',
        path: 'illness_onset/id',
        value: '1',
      },
    ],
  },
};

export const VALID_QUESTIONS = [
  {
    question: { name: 'q1', question_type: 'text', question: 'Question 1' },
    children: [],
  },
  {
    question: { name: 'q2', question_type: 'text', question: 'Question 2' },
    children: [],
  },
];
export const INVALID_QUESTIONS = [
  {
    question: { name: 'q1', question_type: '', question: 'Question 1' },
    children: [],
  },
  {
    question: { name: 'q2', question_type: 'text', question: 'Question 2' },
    children: [
      {
        question: { name: 'q3', question_type: 'text', question: 'Question 3' },
        children: [],
      },
      {
        question: { name: 'q4', question_type: 'text', question: 'Question 4' },
        children: [],
      },
    ],
  },
];

export const DEEP_VALID_QUESTIONS = [
  {
    question: { name: 'q1', question_type: 'text', question: 'Question 1' },
    children: [],
  },
  {
    question: { name: 'q2', question_type: 'text', question: 'Question 2' },
    children: [
      {
        question: {
          name: 'q3',
          question_type: 'text',
          question: 'Question 3',
        },
        children: [],
      },
      {
        question: {
          name: 'q4',
          question_type: 'text',
          question: 'Question 4',
        },
        children: [
          {
            question: {
              name: 'q5',
              question_type: 'text',
              question: 'Question 5',
            },
            children: [],
          },
        ],
      },
    ],
  },
];
export const DEEP_INVALID_QUESTIONS = [
  {
    question: { name: 'q1', question_type: 'text', question: 'Question 1' },
    children: [],
  },
  {
    question: { name: 'q2', question_type: 'text', question: 'Question 2' },
    children: [
      {
        question: { name: 'q3', question_type: 'text', question: 'Question 3' },
        children: [],
      },
      {
        question: { name: 'q4', question_type: 'text', question: 'Question 4' },
        children: [
          {
            question: {
              name: 'q5',
              question_type: '',
              question: 'Question 5',
            },
            children: [],
          },
        ],
      },
    ],
  },
];

export const MOCK_DATA_FOR_STRING_APPEARS_TWICE = {
  ARRAY_WITH_THREE_OCCURRENCES: ['apple', 'banana', 'apple', 'orange', 'apple'],
  ARRAY_WITH_TWO_OCCURRENCES: ['apple', 'banana', 'orange', 'apple', 'blorg'],
  ARRAY_WITH_ONE_OCCURRENCE: ['apple', 'banana', 'orange', 'grape'],
  ARRAY_WITHOUT_OCCURRENCE: ['banana', 'orange', 'grape'],
  EMPTY_ARRAY: [],
  NON_STRING_INPUT: 123,
  TARGET_STRING: 'apple',
};
