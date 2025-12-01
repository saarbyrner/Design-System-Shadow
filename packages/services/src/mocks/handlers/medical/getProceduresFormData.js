import { rest } from 'msw';

const data = {
  procedure_reasons: [
    {
      id: 1,
      name: 'Reason 1',
      issue_required: false,
      intravenous: false,
    },
    {
      id: 2,
      name: 'Reason 2',
      issue_required: true,
      intravenous: false,
    },
  ],
  locations: [
    {
      id: 20,
      name: 'Test Procedure Location',
      type_of: {
        value: 3,
        name: 'procedure',
      },
      organisation_id: 6,
    },
    {
      id: 21,
      name: 'McHale Park',
      type_of: {
        value: 7,
        name: 'procedure',
      },
      organisation_id: 6,
    },
  ],
  procedure_complications: [
    {
      id: 1,
      name: 'Complication 1',
      intravenous: false,
    },
  ],
  procedure_timings: [
    {
      key: 'pre_game',
      name: 'Pre-game',
    },
    {
      key: 'during_game',
      name: 'During game',
    },
    {
      key: 'post_game',
      name: 'Post-game',
    },
    {
      key: 'pre_practice',
      name: 'Pre-practice',
    },
    {
      key: 'during_practice',
      name: 'During practice',
    },
    {
      key: 'post_practice',
      name: 'Post-practice',
    },
    {
      key: 'other',
      name: 'Other',
    },
  ],
};

const handler = rest.get('/ui/procedures/form_data', (req, res, ctx) => {
  return res(
    ctx.json({
      data,
    })
  );
});

export { handler, data };
