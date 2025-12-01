import { rest } from 'msw';

const dataInCamelCase = {
  meta: {
    currentPage: 1,
    nextPage: null,
    prevPage: null,
    totalCount: 1,
    totalPages: 1,
  },
  data: [
    {
      id: 1,
      name: 'name 1',
      status: 'pending',
      importType: 'generic_import',
      attachments: [
        {
          filename: 'myfile.txt',
          filesize: 123_456,
          filetype: 'text/plain',
          id: 1,
          url: 'string',
        },
      ],
      importErrors: [],
      createdAt: '2023-09-25T15:38:25+01:00',
      createdBy: {
        fullname: 'John Doe',
      },
      canDelete: true,
    },
    {
      id: 2,
      name: 'name 2',
      status: 'completed',
      importType: 'generic_import',
      attachments: [],
      importErrors: [],
      createdAt: '2023-09-15T15:38:25+01:00',
      createdBy: {
        fullname: 'Paul Smith',
      },
      canDelete: true,
    },
  ],
};

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
      status: 'pending',
      import_type: 'generic_import',
      attachments: [
        {
          filename: 'myfile.txt',
          filesize: 123_456,
          filetype: 'text/plain',
          id: 1,
          url: 'string',
        },
      ],
      import_errors: [],
      created_at: '2023-09-25T15:38:25+01:00',
      created_by: {
        fullname: 'John Doe',
      },
    },
    {
      id: 2,
      name: 'name 2',
      status: 'completed',
      import_type: 'generic_import',
      attachments: [],
      import_errors: [],
      created_at: '2023-09-15T15:38:25+01:00',
      created_by: {
        fullname: 'Paul Smith',
      },
    },
  ],
};

const handler = rest.get('/import_jobs', (req, res, ctx) => {
  return res(ctx.json(data));
});

export { handler, data, dataInCamelCase };
