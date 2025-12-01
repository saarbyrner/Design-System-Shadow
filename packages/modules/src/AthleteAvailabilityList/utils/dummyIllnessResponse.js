/* eslint-disable flowtype/require-valid-file-annotation */
const illnessResponse = () => [
  {
    athlete_id: 1644,
    closed: false,
    created_at: '2018-09-10T16:34:59+01:00',
    created_by: 'Mark Hill',
    diagnostics: [],
    events: [
      {
        date: '2018-09-10T01:00:00+01:00',
        event_date: '2018-09-10T01:00:00+01:00',
        id: 5660,
        injury_status_id: 1,
      },
    ],
    events_duration: { 5660: 204 },
    events_order: [5660],
    has_recurrence: false,
    id: 2855, // occurrence id
    issue_id: 123458, // illness id
    is_first_occurrence: true,
    is_last_occurrence: true,
    modification_info: '',
    notes: [],
    occurrence_date: '2018-09-10T01:00:00+01:00',
    onset_id: null,
    osics: {
      osics_body_area_id: 18,
      osics_classification_id: 3,
      osics_id: 'MSAX',
      osics_pathology_id: 1671,
    },
    side_id: 5,
    supplementary_pathology: null,
    total_duration: 204,
    unavailability_duration: 204,
  },
  {
    athlete_id: 1644,
    closed: false,
    created_at: '2018-08-07T19:28:38+01:00',
    created_by: 'Mark Hill',
    diagnostics: [],
    events: [
      {
        date: '2018-01-29T00:00:00+00:00',
        event_date: '2018-01-29T00:00:00+00:00',
        id: 2189,
        injury_status_id: 2,
      },
      {
        date: '2018-05-02T00:00:00+01:00',
        event_date: '2018-05-02T00:00:00+01:00',
        id: 2190,
        injury_status_id: 3,
      },
    ],
    events_duration: { 189: 93, 2190: 335 },
    events_order: [2189, 2190],
    has_recurrence: false,
    id: 4356, // occurrence id
    issue_id: 123459, // illness id
    is_first_occurrence: true,
    is_last_occurrence: true,
    modification_info: 'this is the second test',
    notes: [],
    occurrence_date: '2018-01-29T00:00:00+00:00',
    onset_id: null,
    osics: {
      osics_body_area_id: 18,
      osics_classification_id: 3,
      osics_id: 'MGXX',
      osics_pathology_id: 1625,
    },
    side_id: 5,
    supplementary_pathology: null,
    total_duration: 204,
    unavailability_duration: 204,
  },
];

export default illnessResponse;
