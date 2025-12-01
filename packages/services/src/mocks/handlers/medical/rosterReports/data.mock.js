// @flow
export const mockedCSVData = 'Testing,One,Two,Three';
export const mockedXLSXData = 'someXLSX';

export const mockedTimeLossBodyPartJSON = {
  Ankle: [
    {
      player_name: 'Tomas Albornoz',
      issue_name: 'Ankle Fracture [Left]',
      body_area: 'Ankle',
      body_side: 'Left',
      issue_date: '10/25/2022',
      days_missed: 367,
      practices_missed: 27,
      games_missed: 36,
      walkthroughs_missed: 0,
    },
    {
      player_name: 'Tomas Albornoz',
      issue_name: 'Ankle Cyst in Joint [Left]',
      body_area: 'Ankle',
      body_side: 'Left',
      issue_date: '08/29/2022',
      days_missed: 39,
      practices_missed: 1,
      games_missed: 4,
      walkthroughs_missed: 0,
    },
    {
      player_name: 'Tomas Albornoz',
      issue_name: 'Abcess Ankle (excl. Joint) [Left]',
      body_area: 'Ankle',
      body_side: 'Left',
      issue_date: '10/06/2022',
      days_missed: 386,
      practices_missed: 29,
      games_missed: 40,
      walkthroughs_missed: 0,
    },
  ],
  Chest: [
    {
      player_name: 'Tomas Albornoz',
      issue_name: 'Respiratory tract infection (bacterial or viral) [N/A]',
      body_area: 'Chest',
      body_side: 'N/A',
      issue_date: '07/05/2022',
      days_missed: 0,
      practices_missed: 0,
      games_missed: 9,
      walkthroughs_missed: 0,
    },
  ],
};

export const mockedTimeLossAllActivitiesJSON = [
  {
    player_name: 'Lydia Athlete',
    athlete_id: 96765,
    demographics: [
      {
        avatar: 'https://mallformedurl',
        player_name: 'Lydia Athlete',
        jersey_number: null,
        position: 'No. 8',
        height: '160 cm',
        weight: null,
        age: null,
      },
    ],
    occurrences: [
      {
        athlete_id: 96765,
        player_name: 'Lydia Athlete',
        issue_name: 'Abcess Ankle (excl. Joint) [Left]',
        issue_date: '06/12/2023',
        return_to_full: '08/12/2023',
        games_missed: 0,
        practices_missed: 0,
        otas_missed: 0,
        walkthroughs_missed: 0,
        mini_camps_missed: 1,
        player_activity: null,
      },
    ],
  },
  {
    player_name: 'Tomas Albornoz',
    athlete_id: 40211,
    demographics: [
      {
        avatar: 'https://mallformedurl',
        player_name: 'Tomas Albornoz',
        jersey_number: null,
        position: 'Second Row',
        height: '192 cm',
        weight: null,
        age: 32,
      },
    ],
    occurrences: [
      {
        athlete_id: 40211,
        player_name: 'Tomas Albornoz',
        issue_name: 'Concussed',
        issue_date: '09/20/2023',
        return_to_full: null,
        games_missed: 0,
        practices_missed: 0,
        otas_missed: 0,
        walkthroughs_missed: 2,
        mini_camps_missed: 0,
        player_activity: 'Other',
      },
      {
        athlete_id: 40211,
        player_name: 'Tomas Albornoz',
        issue_name: 'back injury',
        issue_date: '08/21/2023',
        return_to_full: null,
        games_missed: 6,
        practices_missed: 8,
        otas_missed: 0,
        walkthroughs_missed: 0,
        mini_camps_missed: 0,
        player_activity: 'Not club football-related',
      },
    ],
  },
];

export const mockedInjuryMedicationsJSON = {
  '5': [
    {
      issue_date: '06/06/2023',
      issue_name: null,
      medications: [],
      player_name: 'Herbert Austin',
      athlete_id: 5,
    },
    {
      issue_date: '05/04/2023',
      issue_name: 'Knee Anterior Cruciate Ligament Tear - Complete [Left]',
      medications: [],
      player_name: 'Herbert Austin',
      athlete_id: 5,
    },
    {
      issue_date: '05/01/2023',
      issue_name: 'Knee Anterior Cruciate Ligament Tear - Complete [Left]',
      medications: [
        {
          medication: 'Advil 200 mg tablet',
          prescription_date: '10/27/2023',
        },
        {
          medication: 'Advil 200 mg tablet',
          prescription_date: '10/16/2023',
        },
      ],
      player_name: 'Herbert Austin',
      athlete_id: 5,
    },
  ],
  '6': [
    {
      issue_date: '05/01/2023',
      issue_name: 'Test injury name',
      medications: [
        {
          medication: 'Test medication',
          prescription_date: '10/27/2023',
        },
      ],
      player_name: 'Another athlete',
      athlete_id: 6,
    },
  ],
};
