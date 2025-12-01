// @flow
import { rest } from 'msw';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';

const getAttachment = (index) => ({
  filename: `myfile${index}.txt`,
  filesize: 123_456,
  filetype: 'text/plain',
  id: index,
  url: 'string',
});

export const data = [
  {
    id: 1,
    name: 'name 1',
    status: 'completed',
    import_type: 'athlete_import',
    attachments: [getAttachment(1), getAttachment(2)],
    import_errors: [
      {
        row: 1,
        attribute_name: 'Squad',
        error: 'this errored on line 1',
      },
      {
        row: 2,
        attribute_name: 'Squad',
        error: 'this errored on line 2',
      },
      {
        row: 3,
        attribute_name: 'Squad',
        error: 'this errored on line 3',
      },
    ],
    created_at: new Date('December 17, 1995 03:24:00').toDateString(),
    created_by: {
      firstname: 'test firstname',
      lastname: 'test lastname',
      fullname: 'user',
    },
  },
  {
    id: 2,
    name: 'name 2',
    status: 'pending',
    import_type: 'user_import',
    attachments: [getAttachment(1)],
    import_errors: [
      {
        row: 1,
        attribute_name: 'Squad',
        error: 'error_message',
      },
    ],
    created_at: new Date('December 17, 1995 03:24:00').toDateString(),
    created_by: 'user',
  },
  {
    id: 3,
    name: 'official 1',
    status: 'pending',
    import_type: 'official_import',
    attachments: [getAttachment(1)],
    import_errors: [
      {
        row: 1,
        attribute_name: 'Squad',
        error: 'this errored on line 1',
      },
      {
        row: 2,
        attribute_name: 'Squad',
        error: 'this errored on line 2',
      },
      {
        row: 3,
        attribute_name: 'Squad',
        error: 'this errored on line 3',
      },
    ],
    created_at: new Date('December 17, 1995 03:24:00').toDateString(),
    created_by: {
      firstname: 'test firstname',
      lastname: 'test lastname',
      fullname: 'user',
    },
  },
  {
    id: 1,
    name: 'name 2',
    status: 'pending',
    import_type: `${IMPORT_TYPES.GrowthAndMaturation}_import`,
    attachments: [getAttachment(1)],
    import_errors: [
      {
        row: 1,
        attribute_name: 'Squad',
        error: 'error_message',
      },
    ],
    created_at: new Date('September 15, 2023 15:14:00').toDateString(),
    created_by: {
      fullname: 'John Doe',
    },
  },
];

const trainingVariableAnswerImportData = [
  {
    id: 10,
    name: null,
    importType: 'training_variable_answer_import',
    createdAt: '2024-06-17T17:03:05+01:00',
    attachments: [getAttachment(1)],
    status: 'pending',
    importErrors: [],
    createdBy: {
      id: 158829,
      firstname: 'George',
      lastname: 'Looshch-admin-eu',
      fullname: 'George Looshch-admin-eu',
    },
  },
  {
    id: 9,
    name: null,
    importType: 'training_variable_answer_import',
    createdAt: '2024-06-16T14:11:32+01:00',
    attachments: [getAttachment(1)],
    status: 'running',
    importErrors: [],
    createdBy: {
      id: 158829,
      firstname: 'Greg',
      lastname: 'Looshch-admin-eu',
      fullname: 'Greg Looshch-admin-eu',
    },
  },
  {
    id: 7,
    name: null,
    importType: 'training_variable_answer_import',
    createdAt: '2024-06-06T15:13:44+01:00',
    attachments: [getAttachment(1)],
    status: 'completed',
    importErrors: [],
    createdBy: {
      id: 158829,
      firstname: 'Lina',
      lastname: 'Looshch-admin-eu',
      fullname: 'Lina Looshch-admin-eu',
    },
  },
  {
    id: 6,
    name: null,
    importType: 'training_variable_answer_import',
    createdAt: '2024-06-06T14:48:43+01:00',
    attachments: [getAttachment(1)],
    status: 'errored',
    importErrors: [],
    createdBy: {
      id: 158829,
      firstname: 'Paul',
      lastname: 'Looshch-admin-eu',
      fullname: 'Paul Looshch-admin-eu',
    },
  },
];

export const meta = {
  current_page: 1,
  next_page: null,
  prev_page: null,
  total_pages: 1,
  total_count: 2,
};

const response = {
  data,
  meta,
};

const handler = rest.post('/import_jobs/search', async (req, res, ctx) => {
  const body = await req.json();
  if (body?.import_types?.includes('training_variable_answer_import')) {
    return res(ctx.json({ data: trainingVariableAnswerImportData, meta }));
  }
  return res(ctx.json(response));
});

export { handler, response, trainingVariableAnswerImportData };
