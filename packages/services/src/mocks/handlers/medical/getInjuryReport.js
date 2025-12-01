import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { rest } from 'msw';

const baseData = {
  Out: [
    {
      athlete: { name: 'Test Athlete Out 1', id: 5 },
      squad_number: 12,
      position: 'Quarterback',
      body_area: 'Knee',
      injury: 'Knee Soreness',
      status: {
        description: 'Out',
        order: 1,
      },
      latest_note: '<p>Test with markup</p>',
      modifications: ['<p>Modification 1</p>', '<div>Modification 2</div>'],
      issue_contact_type: {
        id: 123,
        name: 'With player',
      },
      occurrence_date: '2022-11-04T05:00:00Z',
      squads: [
        {
          name: 'Test Squad',
          primary: true,
        },
      ],
    },
    {
      athlete: { name: 'Test Athlete Out 2', id: 7 },
      squad_number: 25,
      position: 'Defensive End',
      body_area: 'Hip',
      injury: 'Hip Flexor Tear',
      status: {
        description: 'Out',
        order: 1,
      },
      occurrence_date: '2022-11-04T05:00:00Z',
      latest_note: null,
      modifications: [],
      issue_contact_type: null,
      squads: [
        {
          name: 'Test Squad',
          primary: true,
        },
      ],
    },
  ],
  Limited: [
    {
      athlete: { name: 'Test Athlete Limited', id: 1 },
      squad_number: 2,
      position: 'Tight End',
      body_area: 'Pinky',
      injury: 'Pinky Sprain',
      latest_note: null,
      status: {
        description: 'Limited',
        order: 2,
      },
      occurrence_date: '2022-11-04T05:00:00Z',
      modifications: ['<p>Modification in limited</p>'],
      issue_contact_type: null,
      squads: [
        {
          name: 'Test Squad',
          primary: true,
        },
      ],
    },
  ],
  Full: [
    {
      athlete: { name: 'Test Athlete Full', id: 9 },
      squad_number: 11,
      position: 'Tight End',
      body_area: null,
      injury: 'Chronic Condition Example',
      status: {
        description: 'Full',
        order: 3,
      },
      occurrence_date: '2022-11-04T05:00:00Z',
      latest_note: null,
      squads: [
        {
          name: 'Test Squad',
          primary: true,
        },
      ],
    },
  ],
  Preliminary: [],
};

const getCodingSystemMock = (key, index) => {
  const map = {
    [codingSystemKeys.OSICS_10]: {
      osics_pathology: `OSICS pathology ${index}`,
    },
    [codingSystemKeys.ICD]: {
      diagnosis: `ICD pathology ${index}`,
    },
    [codingSystemKeys.DATALYS]: {
      pathology: `Datalys pathology ${index}`,
    },
    [codingSystemKeys.CLINICAL_IMPRESSIONS]: {
      pathology: `Clinical impressions pathology ${index}`,
    },
  };

  return map[key];
};

const decorateWithCodingSystem = (codingSystemKey) => {
  let index = 0;

  return Object.keys(baseData).reduce((newDataValue, currKey) => {
    return {
      ...newDataValue,
      [currKey]: baseData[currKey].map((injury) => {
        index += 1;
        return {
          ...injury,
          coding: {
            [codingSystemKey]: {
              ...getCodingSystemMock(codingSystemKey, index),
            },
          },
        };
      }),
    };
  }, {});
};

const data = {
  [codingSystemKeys.CLINICAL_IMPRESSIONS]: {
    ...decorateWithCodingSystem(codingSystemKeys.CLINICAL_IMPRESSIONS),
  },
  [codingSystemKeys.DATALYS]: {
    ...decorateWithCodingSystem(codingSystemKeys.DATALYS),
  },
  [codingSystemKeys.ICD]: {
    ...decorateWithCodingSystem(codingSystemKeys.ICD),
  },
  [codingSystemKeys.OSICS_10]: {
    ...decorateWithCodingSystem(codingSystemKeys.OSICS_10),
  },
};

const handler = rest.get('/medical/rosters/injury_report', (req, res, ctx) =>
  res(ctx.json(data[codingSystemKeys.OSICS_10]))
);

export { handler, data };
