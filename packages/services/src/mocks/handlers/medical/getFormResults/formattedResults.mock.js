export default [
  {
    title: 'Initial details',
    elementId: 'section_initial_details',
    elements: [
      {
        questionsAndAnswers: [
          {
            question: 'Reason:',
            answer: 'Injury',
            id: 'reason',
            type: 'questionAndAnswer',
          },
        ],
        id: 462,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Injury:',
            answer: '84545',
            id: 'injury_id',
            type: 'questionAndAnswer',
          },
        ],
        id: 463,
        isConditional: true,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Date of injury:',
            answer: 'Aug 11, 2022',
            id: 'date_of_injury',
            type: 'questionAndAnswer',
          },
          {
            question: 'Time of injury:',
            answer: '9:48 PM',
            id: 'time_of_injury',
            type: 'questionAndAnswer',
          },
          {
            question: 'Time zone:',
            answer: 'Europe/Dublin',
            id: 'timezone_of_injury',
            type: 'questionAndAnswer',
          },
          {
            question: 'Date of injury is estimated:',
            answer: null,
            id: 'date_of_injury_estimated',
            type: 'questionAndAnswer',
          },
          {
            question: 'Time of injury is estimated:',
            answer: null,
            id: 'time_of_injury_estimated',
            type: 'questionAndAnswer',
          },
        ],
        id: 465,
        isConditional: false,
        isGroupInData: true,
        type: 'group',
        columns: 3,
      },
      {
        questionsAndAnswers: [
          {
            question: 'Was the injury immediately reported?',
            answer: 'Yes',
            id: 'injury_immediately_reported',
            type: 'questionAndAnswer',
          },
        ],
        id: 471,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Date when injury reported:',
            answer: 'Jun 11, 2022',
            id: 'date_of_reported_injury',
            type: 'questionAndAnswer',
          },
          {
            question: 'Time when injury reported:',
            answer: '9:48 PM',
            id: 'time_of_reported_injury',
            type: 'questionAndAnswer',
          },
          {
            question: 'Time zone:',
            answer: 'Europe/Dublin',
            id: 'timezone_of_reported_injury',
            type: 'questionAndAnswer',
          },
          {
            question: 'Reported date is estimate:',
            answer: null,
            id: 'date_of_reported_injury_estimated',
            type: 'questionAndAnswer',
          },
          {
            question: 'Reported time is estimate:',
            answer: null,
            id: 'time_of_reported_injury_estimated',
            type: 'questionAndAnswer',
          },
        ],
        id: 472,
        isConditional: false,
        isGroupInData: true,
        type: 'group',
        columns: 3,
      },
    ],
    id: 461,
    sidePanelSection: false,
    columns: 1,
  },
  {
    title: 'Event details',
    elementId: 'section_event_details',
    elements: [
      {
        questionsAndAnswers: [
          {
            question: 'Was the player immediately removed from play?',
            answer: 'No',
            id: 'immediately_removed',
            type: 'questionAndAnswer',
          },
        ],
        id: 479,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question:
              'If not immediately removed, how many (min) did athlete continue to play?',
            answer: '43 mins',
            id: 'continued_to_play_mins',
            type: 'questionAndAnswer',
          },
          {
            question:
              'Did athlete sustain additional impacts following injury?',
            answer: 'No',
            id: 'sustained_additional_impacts',
            type: 'questionAndAnswer',
          },
        ],
        id: 480,
        isConditional: true,
        isGroupInData: true,
        type: 'group',
        columns: 2,
      },
      {
        questionsAndAnswers: [
          {
            question: 'Was a concussion diagnosed?',
            answer: 'Yes',
            id: 'concussion_diagnosed',
            type: 'questionAndAnswer',
          },
        ],
        id: 483,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Who diagnosed the injury?',
            answer: 'Neurosurgeon, Orthopedic Surgeon',
            id: 'who_diagnosed',
            type: 'questionAndAnswer',
          },
        ],
        id: 484,
        isConditional: true,
        isGroupInData: true,
        type: 'group',
        columns: 2,
      },
      {
        questionsAndAnswers: [
          {
            question: 'Is the injury sport related?',
            answer: 'Yes',
            id: 'sport_related_injury',
            type: 'questionAndAnswer',
          },
        ],
        id: 486,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Sport played:',
            answer: 'Basketball',
            id: 'sport_played',
            type: 'questionAndAnswer',
          },
          {
            question: 'At what venue did it occur?',
            answer: 'Home',
            id: 'venue_occurrence',
            type: 'questionAndAnswer',
          },
          {
            question: 'Was concussion captured on film?',
            answer: 'Yes',
            id: 'captured_on_film',
            type: 'questionAndAnswer',
          },
          {
            question: 'Was Hudl software used?',
            answer: 'Yes',
            id: 'hudl_software_used',
            type: 'questionAndAnswer',
          },
        ],
        id: 487,
        isConditional: true,
        isGroupInData: true,
        type: 'group',
        columns: 2,
      },
      {
        questionsAndAnswers: [
          {
            question: 'Was the athlete injured during competitive season?',
            answer: 'Yes',
            id: 'during_competitive_season',
            type: 'questionAndAnswer',
          },
        ],
        id: 492,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'What type of event?',
            answer: 'Outside Organized Sport',
            id: 'event_type',
            type: 'questionAndAnswer',
          },
          {
            question: 'Minutes into competition before injury occurred?',
            answer: '34 mins',
            id: 'minutes_before_occurrence',
            type: 'questionAndAnswer',
          },
          {
            question: 'Surface type:',
            answer: 'Astro-turf',
            id: 'surface_type',
            type: 'questionAndAnswer',
          },
        ],
        id: 493,
        isConditional: true,
        isGroupInData: true,
        type: 'group',
        columns: 2,
      },
      {
        questionsAndAnswers: [
          {
            question: 'Injury mechanism:',
            answer: 'Checking',
            id: 'injury_mechanism',
            type: 'questionAndAnswer',
          },
          {
            question: 'Injured athlete collided with:',
            answer: 'Sideline equipment (eg. Bench)',
            id: 'athlete_collided_with',
            type: 'questionAndAnswer',
          },
          {
            question: 'Impact location resulting in injury:',
            answer: 'Other',
            id: 'impact_location',
            type: 'questionAndAnswer',
          },
        ],
        id: 497,
        isConditional: false,
        isGroupInData: true,
        type: 'group',
        columns: 3,
      },
    ],
    id: 478,
    sidePanelSection: false,
    columns: 1,
  },
  {
    title: 'Symptom details',
    elementId: 'symptom_details',
    elements: [
      {
        questionsAndAnswers: [
          {
            question: 'Delayed symptoms onset present?',
            answer: 'No',
            id: 'delayed_symptoms',
            type: 'questionAndAnswer',
          },
        ],
        id: 502,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Loss of consciousness:',
            answer: 'No',
            id: 'loss_of_consciousness',
            type: 'questionAndAnswer',
          },
        ],
        id: 508,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Post-traumatic amnesia:',
            answer: 'No',
            id: 'post_traumatic_amnesia',
            type: 'questionAndAnswer',
          },
        ],
        id: 512,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Retro-grade amnesia:',
            answer: 'No',
            id: 'retro_grade_amnesia',
            type: 'questionAndAnswer',
          },
        ],
        id: 515,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question:
              'Alteration in mental status present? (i.e Dazed, stunned, confused?):',
            answer: 'Yes',
            id: 'mental_alteration',
            type: 'questionAndAnswer',
          },
        ],
        id: 518,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Motor impairment present at time of concussion?',
            answer: 'Yes',
            id: 'motor_impairment',
            type: 'questionAndAnswer',
          },
        ],
        id: 519,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
    ],
    id: 501,
    sidePanelSection: false,
    columns: 1,
  },
  {
    title: 'Additional details',
    elementId: 'additional_details',
    elements: [
      {
        questionsAndAnswers: [
          {
            question: 'Taken to hospital?',
            answer: 'No',
            id: 'taken_to_hospital',
            type: 'questionAndAnswer',
          },
        ],
        id: 521,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Did the athlete travel by plane after injury?',
            answer: 'No',
            id: 'travelled_by_plane',
            type: 'questionAndAnswer',
          },
        ],
        id: 526,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
      {
        questionsAndAnswers: [
          {
            question: 'Additional injury comments:',
            answer: null,
            id: 'additional_comments',
            type: 'questionAndAnswer',
          },
        ],
        id: 532,
        isConditional: false,
        isGroupInData: false,
        type: 'group',
      },
    ],
    id: 520,
    sidePanelSection: false,
    columns: 3,
  },
];
