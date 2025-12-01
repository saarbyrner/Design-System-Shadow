import { rest } from 'msw';

const data = {
  issues: [
    {
      detailed_event: {
        id: 4401907,
        session_type: {
          id: 294,
          name: 'Captains Run',
          category: null,
          is_joint_practice: false,
        },
        name: 'Repeat session',
        start_date: '2025-07-11T11:45:00Z',
        type: 'session_event',
      },
      permission_granted: true,
      detailed_issues: [
        {
          athlete_fullname: 'cmgandroidtest241119-1 Android Test',
          occurrence_date: '2025-07-11T13:00:00+01:00',
          full_pathology: 'AC Joint contusion [Center]',
          issue_occurrence_title: null,
          athlete_id: 245926,
          id: 1,
          issue_type: 'Injury',
        },
      ],
    },
    {
      detailed_event: {
        id: 4401911,
        session_type: {
          id: 294,
          name: ' Captains Run',
          category: null,
          is_joint_practice: false,
        },
        name: 'Repeat session',
        start_date: '2025-07-18T07:39:56Z',
        type: 'session_event',
      },
      permission_granted: true,
      detailed_issues: [
        {
          athlete_fullname: 'Daniel Athlete',
          occurrence_date: '2025-07-16T00:00:00+01:00',
          full_pathology: 'Abcess Ankle (excl. Joint) [Center]',
          issue_occurrence_title: null,
          athlete_id: 110054,
          id: 64770,
          issue_type: 'Illness',
        },
      ],
    },
  ],
  imported_data: [
    {
      detailed_event: {
        id: 4401906,
        session_type: {
          id: 294,
          name: ' Captains Run',
          category: null,
          is_joint_practice: false,
        },
        name: 'Repeat session',
        start_date: '2025-07-18T07:39:00Z',
        type: 'session_event',
      },
      detailed_imports: [
        {
          id: 'attachment:1449988',
          type: 'CSV',
          name: 'KitmanCustomData-KRC_light.csv',
          created_at: '2025-07-16T16:04:08.000+01:00',
          updated_at: '2025-07-16T16:04:08.000+01:00',
          source: {
            id: 3,
            name: 'Kitman custom data',
            source_identifier: 'custom',
          },
        },
      ],
    },
  ],
  assessments: [
    {
      detailed_event: {
        id: 4401913,
        session_type: {
          id: 16,
          name: 'Academy Rugby',
          category: null,
          is_joint_practice: false,
        },
        name: 'Standard session',
        start_date: '2025-07-10T15:15:00Z',
        type: 'session_event',
      },
      permission_granted: true,
      detailed_assessments: [
        {
          name: 'Dans test assessment',
        },
      ],
    },
  ],
};

const handler = rest.get(
  '/ui/planning_hub/event_deletion_prompt',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
