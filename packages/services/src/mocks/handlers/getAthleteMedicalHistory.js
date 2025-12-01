import { rest } from 'msw';

const data = [
  {
    id: 1246260,
    date: '2022-07-04',
    note: "Yes. Yes. I'm George. George McFly. I'm your density. I mean, your destiny. -- Et soluta qui dignissimos excepturi voluptatem natus quibusdam. Modi omnis adipisci non sequi nam officiis vitae. Autem reprehenderit accusamus. Id eligendi facilis repudiandae quisquam rerum exercitationem. Incidunt necessitatibus natus deserunt nihil et et. Et maiores tempora labore.",
    created_by: {
      id: 95239,
      firstname: 'Vicki',
      lastname: 'Anderson',
      fullname: 'Vicki Anderson',
    },
    restricted: false,
    psych_only: false,
    medical_meta: {
      note_medical_type: 'Vaccination',
      medical_name: 'Hepatitis A',
      expiration_date: '2023-07-04',
      batch_number: 'OVUH89yhf9',
      renewal_date: '2023-07-04',
    },
    attachments: [],
  },
  {
    id: 1246220,
    date: '2022-07-11',
    note: "I'm from the future. I came here in a Time Machine that you invented. Now I need your help to get back to the year 1985. -- Perferendis ipsam exercitationem numquam perspiciatis aut voluptates.",
    created_by: {
      id: 95239,
      firstname: 'Vicki',
      lastname: 'Anderson',
      fullname: 'Vicki Anderson',
    },
    restricted: false,
    psych_only: false,
    medical_meta: {
      note_medical_type: 'TUE',
      medical_name: 'Dextroamphetamine and amphetamine',
      expiration_date: '2022-12-02',
      renewal_date: null,
    },
    attachments: [],
  },
  {
    id: 1246229,
    date: '2022-07-09',
    note: "Roads? Where we're going, we don't need roads. -- Omnis est et.",
    created_by: {
      id: 95239,
      firstname: 'Vicki',
      lastname: 'Anderson',
      fullname: 'Vicki Anderson',
    },
    restricted: false,
    psych_only: false,
    medical_meta: {
      note_medical_type: 'TUE',
      medical_name: 'Steroid for Chest Infection',
      expiration_date: '2022-07-15',
      renewal_date: null,
    },
    attachments: [
      {
        filetype: 'binary/octet-stream',
        filesize: 15874053,
        filename: 'Hodge.301.avi',
        url: 'http://s3:9000/injpro-staging/kitman-staff/kitman-staff.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=dummy1234%2F20221130%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20221130T144539Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=1437806f382f73da84dc00315583c93aa204d134e8987d6a923cdbb1a56219d8',
      },
    ],
  },
];

const handler = rest.get(
  '/ui/medical/athletes/:athleteId/medical_history',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
