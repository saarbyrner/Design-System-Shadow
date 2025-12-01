import { rest } from 'msw';

const data = [
  {
    rcopia_id: '28474',
    name: 'Advil',
    groups: [
      {
        group_id: '538',
        name: 'Salicylates',
      },
      {
        group_id: '667',
        name: 'Nsaids (Non-Steroidal Anti-Inflammatory Drug)',
      },
    ],
  },
  {
    rcopia_id: '24281',
    name: 'Ibuprofen Cold-Sinus(with PSE)',
    groups: [
      {
        group_id: '538',
        name: 'Salicylates',
      },
      {
        group_id: '11726',
        name: 'Sympathomimetic Agents',
      },
      {
        group_id: '667',
        name: 'Nsaids (Non-Steroidal Anti-Inflammatory Drug)',
      },
      {
        group_id: '298',
        name: 'Ephedrine Analogues',
      },
    ],
  },
  {
    rcopia_id: '28547',
    name: 'Ibuprofen IB',
    groups: [
      {
        group_id: '538',
        name: 'Salicylates',
      },
      {
        group_id: '667',
        name: 'Nsaids (Non-Steroidal Anti-Inflammatory Drug)',
      },
    ],
  },
];

const handler = rest.get(
  '/ui/medical/drfirst/search_allergy_groups',
  (req, res, ctx) => {
    return res(
      ctx.json({
        data,
      })
    );
  }
);

export { handler, data };
