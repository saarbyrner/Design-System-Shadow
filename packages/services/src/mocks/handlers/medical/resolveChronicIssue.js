import { rest } from 'msw';

const dataWhenActivating = {
  id: 3,
  athlete_id: 40211,
  title: null,
  event_id: null,
  pathology: '1st MCP joint instability',
  reported_date: null,
  examination_date: '2023-11-03T00:00:00+00:00',
  created_by: {
    id: 109127,
    firstname: 'Pia',
    lastname: 'Kwatra',
    fullname: 'Pia Kwatra',
  },
  created_at: '2023-02-24T14:01:31+00:00',
  coding: {
    osics_code: 'WUPM',
    pathology: {
      id: 1394,
      name: '1st MCP joint instability',
    },
    classification: {
      id: 9,
      name: 'Instability',
    },
    body_area: {
      id: 20,
      name: 'Wrist/Hand',
    },
    icd: 'NC54',
    bamic: null,
  },
  coding_system: {
    id: 2,
    name: 'OSICS-10',
    key: 'osics_10',
  },
  coding_system_side: null,
  occurrences: {
    linked_issues: [],
    chronic_occurrences: [],
  },
  onset_type: {
    id: 5,
    name: 'Gradual',
    require_additional_input: false,
  },
  status: null,
  created_by_organisation: {
    id: 6,
    name: 'Kitman Rugby Club',
    handle: 'kitman',
    timezone: 'Europe/Dublin',
  },
  occurrence_date: '2023-02-24',
  full_pathology: '1st MCP joint instability []',
  constraints: {
    read_only: false,
  },
};

const dataWhenResolving = {
  ...dataWhenActivating,
  resolved_date: '2023-11-23T00:00:00+00:00',
  resolved_at: '2023-11-13T22:48:04+00:00',
  resolved_by: {
    id: 176973,
    firstname: 'Sergiu',
    lastname: 'Tripon-admin-eu',
    fullname: 'Sergiu Tripon-admin-eu',
  },
};

const handler = rest.patch(
  '/athletes/:athleteId/chronic_issues/:issueId/toggle_resolve',
  async (req, res, ctx) => {
    const requestData = await req.json();

    if (requestData.resolving) {
      return res(ctx.text(dataWhenResolving));
    }
    return res(ctx.json(dataWhenActivating));
  }
);

export { handler, dataWhenActivating, dataWhenResolving };
