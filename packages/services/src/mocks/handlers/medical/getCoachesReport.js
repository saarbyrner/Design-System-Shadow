import { rest } from 'msw';

export const ungroupedData = [
  {
    athlete: {
      name: 'Test Athlete Out 1',
      id: 5,
      extended_attributes: { nfl_player_id: 100 },
    },
    squad_number: 12,
    position: {
      name: 'Quarterback',
    },
    position_group: {
      name: 'Offense',
    },
    body_area: 'Knee',
    side: 'left',
    injury: 'Knee Soreness',
    status: {
      description: 'Out',
      order: 1,
    },
    latest_note: '<p>Test with markup</p>',
    occurrence_date: '2022-11-04T05:00:00Z',
    pathology: 'Ouchy',
    comment: 'test1',
  },
  {
    athlete: {
      name: 'Test Athlete Out X',
      id: 5,
      extended_attributes: { nfl_player_id: 100 },
    },
    squad_number: 12,
    position: {
      name: 'Quarterback',
    },
    position_group: {
      name: 'Offense',
    },
    body_area: 'Hip',
    side: 'N/A',
    injury: 'Hip Flexor Tear',
    status: {
      description: 'Out',
      order: 1,
    },
    occurrence_date: '2022-11-04T05:00:00Z',
    latest_note: null,
    pathology: 'BooBoo',
    comment: 'test1',
  },
  {
    athlete: { name: 'Test Athlete Limited', id: 1 },
    squad_number: 2,
    position: { name: 'Tight End' },
    position_group: {
      name: 'Defense',
    },
    body_area: 'Pinky',
    side: 'Right',
    injury: 'Pinky Sprain',
    status: {
      description: 'Limited',
      order: 2,
    },
    occurrence_date: '2022-11-04T05:00:00Z',
    latest_note: null,
    pathology: 'BooBoo',
    comment: 'test2',
  },
];

export const groupedData = {
  Out: [ungroupedData[0], ungroupedData[1]],
  Limited: [ungroupedData[2]],
};

export const doubleGroupedData = {
  Out: {
    Quarterback: [ungroupedData[0], ungroupedData[1]],
  },
  Limited: {
    'Tight End': [ungroupedData[2]],
  },
};

export const csvData =
  'Athlete,Issue name,Onset date,Jersey number,Position,Pathology,Injury status,Latest note,Body part,Side\n' +
  'Tomas Albornoz,ACL rupture [Right],2023-07-12T00:00:00+01:00,,Second Row,ACL rupture [Right],Causing unavailability (time-loss),,Knee,Right\n' +
  'Tomas Albornoz,AC Joint contusion [Left],2023-07-11T00:00:00+01:00,,Second Row,AC Joint contusion [Left],Not affecting availability (medical attention),,Shoulder,Left\n' +
  'Tomas Albornoz,Acetabular fracture [Left],2023-07-11T00:00:00+01:00,,Second Row,Acetabular fracture [Left],Causing unavailability (time-loss),,Hip/Groin,Left\n' +
  'Tomas Albornoz,AC Joint contusion [Left],2023-07-03T00:00:00+01:00,,Second Row,AC Joint contusion [Left],Not affecting availability (medical attention),,Shoulder,Left\n' +
  'Tomas Albornoz,Abcess Ankle (excl. Joint) [Left],2022-10-06T00:00:00+01:00,,Second Row,Abcess Ankle (excl. Joint) [Left],Causing unavailability (time-loss),Cleared 8th,Ankle,Left\n' +
  'hugo beuzeboc,Anemia [N/A],2022-07-01T00:00:00+01:00,,Loose-head Prop,Anemia [N/A],Causing unavailability (time-loss),,Unspecified/Crossing,N/A';

const handler = rest.post('/medical/coaches/report', async (req, res, ctx) => {
  const requestData = await req.json();

  if (requestData.format === 'CSV') {
    return res(ctx.text(csvData));
  }

  if (requestData.grouping.type === 'no_grouping') {
    return res(ctx.json(ungroupedData));
  }
  if (requestData.grouping.type === 'position_group_position') {
    return res(ctx.json(doubleGroupedData));
  }
  return res(ctx.json(groupedData));
});

export { handler };
