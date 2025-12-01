export const mockedSquadAthletes = [
  {
    label: 'Squad A Name',
    options: [
      {
        value: 1,
        label: 'Athlete 1 Name',
      },
      {
        value: 2,
        label: 'Athlete 2 Name',
      },
    ],
  },
  {
    label: 'Squad B Name',
    options: [
      {
        value: 3,
        label: 'Athlete 1 Name',
      },
      {
        value: 4,
        label: 'Athlete 3 Name',
      },
    ],
  },
];

export const mockSelectedMedicalAlert = {
  id: 10,
  athlete_id: 1,
  athlete: {
    id: 1,
    fullname: 'Athlete 1 Name',
  },
  display_name: 'Diabetes Type 1',
  medical_alert: {
    id: 8,
    name: 'Diabetes',
  },
  alert_title: 'Diabetes Type 1',
  severity: 'moderate',
  restricted_to_doc: false,
  restricted_to_psych: false,
  diagnosed_on: '2023-05-12',
  archived: false,
  created_at: '2023-05-30T16:45:23.000+01:00',
  updated_at: '2023-05-30T16:45:23.000+01:00',
  created_by: null,
  constraints: {
    read_only: false,
  },
};
