// @flow

export const data = {
  id: 58,
  name: 'Aspect',
  version: 1,
  creator: {
    id: 46603,
    fullname: 'Service User',
  },
  published_at: '2023-08-24T14:13:41Z',
  publisher: {
    id: 46603,
    fullname: 'Service User',
  },
  conditions: [
    {
      archived_at: null,
      id: 25,
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
          },
          children: [],
        },
      ],
    },
  ],
};
export const response = {
  data,
};
