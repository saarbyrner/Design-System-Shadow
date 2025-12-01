import { rest } from 'msw';

const procedureReasons = [
  {
    id: 1,
    name: 'Duplicate',
  },
  {
    id: 2,
    name: 'Incorrect athlete',
  },
];

const allArchiveReasons = [
  ...procedureReasons,
  {
    id: 3,
    name: 'Note not relevant',
  },
  {
    id: 4,
    name: 'Player movement',
  },
];

// Can be extended on to account for area-specific archive reasons
const handler = rest.get(`/ui/archive_reasons`, (req, res, ctx) => {
  const medicalEntity = req.url.searchParams.get('entity');

  switch (medicalEntity) {
    case 'procedures':
      return res(ctx.json(procedureReasons));
    default:
      return res(ctx.json(allArchiveReasons));
  }
});

export { handler };
