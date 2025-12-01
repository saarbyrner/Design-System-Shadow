import { rest } from 'msw';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';

const data = {
  meta: {
    current_page: 1,
    next_page: null,
    prev_page: null,
    total_count: 1,
    total_pages: 1,
  },
  data: [
    {
      id: 1,
      name: 'name 1',
      status: 'completed',
      import_type: 'athlete_import',
      attachments: [
        {
          filename: 'myfile.txt',
          filesize: 123_456,
          filetype: 'text/plain',
          id: 1,
          url: 'string',
        },
      ],
      import_errors: [
        {
          row: 1,
          attribute_name: 'Squad',
          error: 'this errored on line 1',
        },
        {
          row: 1,
          attribute_name: 'Squad',
          error: 'this errored on line 2',
        },
        {
          row: 1,
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
      import_type: 'user_import',
      attachments: [
        {
          filename: 'myfile.txt',
          filesize: 123_456,
          filetype: 'text/plain',
          id: 1,
          url: 'string',
        },
      ],
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
      id: 1,
      name: 'official 1',
      status: 'pending',
      import_type: 'official_import',
      attachments: [
        {
          filename: 'myfile.txt',
          filesize: 123_456,
          filetype: 'text/plain',
          id: 1,
          url: 'string',
        },
      ],
      import_errors: [
        {
          row: 1,
          attribute_name: 'Squad',
          error: 'this errored on line 1',
        },
        {
          row: 1,
          attribute_name: 'Squad',
          error: 'this errored on line 2',
        },
        {
          row: 1,
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
      attachments: [
        {
          filename: 'myfile.txt',
          filesize: 123_456,
          filetype: 'text/plain',
          id: 1,
          url: 'string',
        },
      ],
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
  ],
};

const handler = rest.get('/import_jobs', (req, res, ctx) => {
  return res(ctx.json(data));
});

export { handler, data };
