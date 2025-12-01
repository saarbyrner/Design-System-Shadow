import {
  formatOsicsPathologyOptions,
  formatOsicsClassificationOptions,
  formatBodyAreaOptions,
  formatSideOptions,
  formatGameOptionFromArray,
  formatPeriodOptionFromArray,
  formatTrainingSessionOptionFromArray,
  formatGameOptionsFromObject,
  formatTrainingSessionOptionsFromObject,
  formatPriorIssueOptions,
  formatPositionGroupFromArray,
  formatIssueTypeOptions,
  formatIssueStatusOptions,
  transformIssueRequest,
  getBlankNote,
  buildIssueState,
  getDefaultIssueState,
} from '../utils';

describe('getBlankNote', () => {
  it('returns a blank note', () => {
    const blankNote = getBlankNote();

    expect(blankNote).toEqual({
      id: '',
      date: '',
      note: '',
      created_by: '',
      restricted: false,
      psych_only: false,
    });
  });
});

describe('formatIssueStatusOptions', () => {
  it('formats issue statuses to the <dropdown /> items format', () => {
    const issueStatuses = [
      {
        id: 1,
        description: 'Causing unavailability (time-loss)',
        cause_unavailability: true,
        restore_availability: false,
        order: 1,
      },
      {
        id: 2,
        description: 'Not affecting availability (medical attention)',
        cause_unavailability: false,
        restore_availability: false,
        order: 1,
      },
      {
        id: 3,
        description: 'Resolved',
        cause_unavailability: false,
        restore_availability: true,
        order: 1,
      },
    ];

    const formattedIssueStatuses = formatIssueStatusOptions(issueStatuses);
    expect(formattedIssueStatuses).toEqual([
      {
        id: 1,
        title: 'Causing unavailability (time-loss)',
        cause_unavailability: true,
        restore_availability: false,
        order: 1,
      },
      {
        id: 2,
        title: 'Not affecting availability (medical attention)',
        cause_unavailability: false,
        restore_availability: false,
        order: 1,
      },
      {
        id: 3,
        title: 'Resolved',
        cause_unavailability: false,
        restore_availability: true,
        order: 1,
      },
    ]);
  });
});

describe('formatIssueTypeOptions', () => {
  it('formats issue types to the <dropdown /> items format', () => {
    const issueTypeOptions = [
      { id: 1, name: 'Overuse' },
      { id: 2, name: 'Traumatic' },
    ];

    const formattedIssueTypes = formatIssueTypeOptions(issueTypeOptions);

    expect(formattedIssueTypes).toEqual([
      {
        title: 'Overuse',
        id: 1,
      },
      {
        title: 'Traumatic',
        id: 2,
      },
    ]);
  });
});

describe('formatOsicsPathologyOptions', () => {
  it('formats osics pathologies to the <dropdown /> items format', () => {
    const osicsPathologyOptions = [
      { id: 0, name: 'tendon injury' },
      { id: 1, name: 'valgus instability' },
    ];

    const formattedPathologies = formatOsicsPathologyOptions(
      osicsPathologyOptions
    );
    expect(formattedPathologies).toEqual([
      { id: 0, title: 'tendon injury' },
      { id: 1, title: 'valgus instability' },
    ]);
  });

  it('returns an empty array if there is no pathology', () => {
    const pathologies = [];
    const formattedPathologies = formatOsicsPathologyOptions(pathologies);
    expect(formattedPathologies).toEqual([]);
  });
});

describe('formatOsicsClassificationOptions', () => {
  it('formats osics classifications to the <dropdown /> items format', () => {
    const osicsClassificationOptions = [
      { id: 0, name: 'post surgery' },
      { id: 1, name: 'structural abnormality' },
    ];

    const formattedClassifications = formatOsicsClassificationOptions(
      osicsClassificationOptions
    );
    expect(formattedClassifications).toEqual([
      { id: 0, title: 'post surgery' },
      { id: 1, title: 'structural abnormality' },
    ]);
  });

  it('returns an empty array if there is no classification', () => {
    const classifications = [];
    const formattedClassifications =
      formatOsicsClassificationOptions(classifications);
    expect(formattedClassifications).toEqual([]);
  });
});

describe('formatBodyAreaOptions', () => {
  it('formats body areas to the <dropdown /> items format', () => {
    const bodyAreaOptions = [
      { id: 0, name: 'chest' },
      { id: 1, name: 'foot' },
    ];

    const formattedBodyAreaOptions = formatBodyAreaOptions(bodyAreaOptions);
    expect(formattedBodyAreaOptions).toEqual([
      { id: 0, title: 'chest' },
      { id: 1, title: 'foot' },
    ]);
  });

  it('returns an empty array if there is no body area', () => {
    const bodyAreaOptions = [];
    const formattedbodyAreaOptions = formatBodyAreaOptions(bodyAreaOptions);
    expect(formattedbodyAreaOptions).toEqual([]);
  });
});

describe('formatSideOptions', () => {
  it('formats sideOptions to the <dropdown /> items format', () => {
    const sideOptions = [
      { id: 0, name: 'left' },
      { id: 1, name: 'right' },
    ];

    const formattedsideOptions = formatSideOptions(sideOptions);
    expect(formattedsideOptions).toEqual([
      { id: 0, title: 'left' },
      { id: 1, title: 'right' },
    ]);
  });

  it('returns an empty array if there is no side', () => {
    const sideOptions = [];
    const formattedsideOptions = formatSideOptions(sideOptions);
    expect(formattedsideOptions).toEqual([]);
  });
});

describe('formatGameOptionFromArray', () => {
  it('formats gameOptions to the <dropdown /> items format', () => {
    const gameOptions = [
      ['Ireland vs England', 0],
      ['Ireland vs Scotland', 1],
    ];

    const formattedGames = formatGameOptionFromArray(gameOptions);
    expect(formattedGames).toEqual([
      { id: 0, title: 'Ireland vs England' },
      { id: 1, title: 'Ireland vs Scotland' },
    ]);
  });

  it('returns an empty array if there is no game', () => {
    const gameOptions = [];
    const formattedGames = formatGameOptionFromArray(gameOptions);
    expect(formattedGames).toEqual([]);
  });
});

describe('formatPeriodOptionFromArray', () => {
  it('formats periodOptions to the <dropdown /> items format', () => {
    const periodOptions = [
      {
        id: 456,
        name: 'First Half',
        duration: 40,
        order: 1,
      },
      {
        id: 457,
        name: 'Second Half',
        duration: 40,
        order: 2,
      },
    ];

    const formattedPeriods = formatPeriodOptionFromArray(periodOptions);
    expect(formattedPeriods).toEqual([
      { id: 456, title: 'First Half' },
      { id: 457, title: 'Second Half' },
    ]);
  });

  it('returns an empty array if there are no options', () => {
    const periodOptions = [];
    const formattedPeriods = formatPeriodOptionFromArray(periodOptions);
    expect(formattedPeriods).toEqual([]);
  });
});

describe('formatPositionGroupFromArray', () => {
  it('formats position groups to the <dropdown /> items format', () => {
    const positionGroupOptions = [
      {
        id: 1,
        name: 'Forward',
        order: 1,
        positions: [
          {
            name: 'Hooker',
            id: 1,
          },
          {
            name: 'No. 8',
            id: 2,
          },
        ],
      },
      {
        id: 3,
        name: 'Back',
        order: 3,
        positions: [
          {
            name: 'Scrum Half',
            id: 3,
          },
          {
            name: 'Out Half',
            id: 4,
          },
        ],
      },
    ];

    const formattedGroups = formatPositionGroupFromArray(positionGroupOptions);
    expect(formattedGroups).toEqual([
      {
        isGroupOption: true,
        name: 'Forward',
      },
      {
        name: 'Hooker',
        key_name: 1,
      },
      {
        name: 'No. 8',
        key_name: 2,
      },
      {
        isGroupOption: true,
        name: 'Back',
      },
      {
        name: 'Scrum Half',
        key_name: 3,
      },
      {
        name: 'Out Half',
        key_name: 4,
      },
    ]);
  });

  it('returns an empty array if there is no game', () => {
    const positionGroupOptions = [];
    const formattedGroups = formatPositionGroupFromArray(positionGroupOptions);
    expect(formattedGroups).toEqual([]);
  });
});

describe('formatTrainingSessionOptionFromArray', () => {
  it('formats training sessions to the <dropdown /> items format', () => {
    const trainingSessionOptions = [
      ['Conditionning 10/01/2018', 0],
      ['Sprint 10/01/2018', 1],
    ];

    const formattedTrainingSessions = formatTrainingSessionOptionFromArray(
      trainingSessionOptions
    );
    expect(formattedTrainingSessions).toEqual([
      { id: 0, title: 'Conditionning 10/01/2018' },
      { id: 1, title: 'Sprint 10/01/2018' },
    ]);
  });

  it('returns an empty array if there is no training session', () => {
    const trainingSessionOptions = [];
    const formattedTrainingSessions = formatTrainingSessionOptionFromArray(
      trainingSessionOptions
    );
    expect(formattedTrainingSessions).toEqual([]);
  });
});

describe('formatGameOptionsFromObject', () => {
  it('formats gameOptions to the <dropdown /> items format', () => {
    const gameOptions = [
      {
        name: 'Ireland vs England',
        value: 1,
        game_date: '10/11/2018',
      },
      {
        name: 'Ireland vs Scotland',
        value: 2,
        game_date: '01/09/2018',
      },
      {
        name: 'Unlisted game',
        value: '',
        game_date: null,
      },
    ];

    const formattedGames = formatGameOptionsFromObject(gameOptions);
    expect(formattedGames).toEqual([
      { id: 1, title: 'Ireland vs England', date: '10/11/2018' },
      { id: 2, title: 'Ireland vs Scotland', date: '01/09/2018' },
      { id: 'UNLISTED', title: 'Unlisted game', date: null },
    ]);
  });

  it('returns an empty array if there is no game', () => {
    const gameOptions = [];
    const formattedGames = formatGameOptionsFromObject(gameOptions);
    expect(formattedGames).toEqual([]);
  });
});

describe('formatTrainingSessionOptionsFromObject', () => {
  it('formats training sessions to the <dropdown /> items format', () => {
    const trainingSessionOptions = [
      {
        name: 'Conditionning 10/01/2018',
        value: 1,
      },
      {
        name: 'Sprint 10/01/2018',
        value: 2,
      },
      {
        name: 'Unlisted training session',
        value: '',
      },
    ];

    const formattedTrainingSessions = formatTrainingSessionOptionsFromObject(
      trainingSessionOptions
    );
    expect(formattedTrainingSessions).toEqual([
      { id: 1, title: 'Conditionning 10/01/2018' },
      { id: 2, title: 'Sprint 10/01/2018' },
      { id: 'UNLISTED', title: 'Unlisted training session' },
    ]);
  });

  it('returns an empty array if there is no training session', () => {
    const trainingSessionOptions = [];
    const formattedTrainingSessions = formatTrainingSessionOptionFromArray(
      trainingSessionOptions
    );
    expect(formattedTrainingSessions).toEqual([]);
  });
});

describe('formatPriorIssueOptions', () => {
  describe('when the standard-date-formatting flag is off', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('formats prior issues to the <dropdown /> items format', () => {
      const priorIssues = [
        {
          id: 123,
          name: 'A Illness - Right',
          occurrence_date: '2018-12-02T12:00:00+01:00',
          resolved_date: '2018-12-05T12:00:00+01:00',
        },
        {
          id: 234,
          name: 'B Illness - Left',
          occurrence_date: '2018-11-24T12:00:00+01:00',
          resolved_date: '2018-11-26T12:00:00+01:00',
        },
      ];

      const formattedPriorIssueOptions = formatPriorIssueOptions(priorIssues);
      expect(formattedPriorIssueOptions).toEqual([
        {
          id: 123,
          title: 'A Illness - Right',
          description: '(2 Dec 2018 - 5 Dec 2018)',
        },
        {
          id: 234,
          title: 'B Illness - Left',
          description: '(24 Nov 2018 - 26 Nov 2018)',
        },
      ]);
    });
  });

  describe('when the standard-date-formatting flag is on', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = true;
    });

    afterEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('formats prior issues to the <dropdown /> items format', () => {
      const priorIssues = [
        {
          id: 123,
          name: 'A Illness - Right',
          occurrence_date: '2018-12-02T12:00:00+01:00',
          resolved_date: '2018-12-05T12:00:00+01:00',
        },
        {
          id: 234,
          name: 'B Illness - Left',
          occurrence_date: '2018-11-24T12:00:00+01:00',
          resolved_date: '2018-11-26T12:00:00+01:00',
        },
      ];

      const formattedPriorIssueOptions = formatPriorIssueOptions(priorIssues);
      expect(formattedPriorIssueOptions).toEqual([
        {
          id: 123,
          title: 'A Illness - Right',
          description: '(Dec 2, 2018 - Dec 5, 2018)',
        },
        {
          id: 234,
          title: 'B Illness - Left',
          description: '(Nov 24, 2018 - Nov 26, 2018)',
        },
      ]);
    });
  });

  it('returns an empty array if there is no prior issue', () => {
    const priorIssue = [];
    const formattedPriorIssueOptions = formatPriorIssueOptions(priorIssue);
    expect(formattedPriorIssueOptions).toEqual([]);
  });
});

describe('transformIssueRequest', () => {
  it('creates the correct request data from the react state', () => {
    const injuryData = {
      events_order: [12, 'new_status_1'],
      events: {
        12: {
          id: 12,
          date: '2017-03-02',
          injury_status_id: 2,
        },
        new_status_1: {
          id: 'new_status_1',
          date: '2017-12-04',
          injury_status_id: 1,
        },
      },
      notes: [],
    };

    const currentNote = {
      id: '',
      date: '10/11/2018',
      created_by: '',
      note: 'new note',
    };

    const formType = 'INJURY';

    const formattedForRequest = transformIssueRequest(
      injuryData,
      currentNote,
      formType
    );

    const expectedNote = [currentNote];

    const expectedEvents = [
      {
        id: 12,
        date: '2017-03-02',
        injury_status_id: 2,
      },
      {
        id: '',
        date: '2017-12-04',
        injury_status_id: 1,
      },
    ];

    expect(JSON.parse(formattedForRequest)).toEqual({
      events_order: injuryData.events_order,
      events: expectedEvents,
      notes: expectedNote,
    });
  });

  describe('when the current note is empty', () => {
    it("doesn't add the current note to the request data", () => {
      const injuryData = {
        events_order: [],
        notes: [],
      };

      const currentNote = {
        id: '',
        date: '',
        created_by: '',
        note: '',
      };

      const formType = 'INJURY';

      const formattedForRequest = transformIssueRequest(
        injuryData,
        currentNote,
        formType
      );

      expect(JSON.parse(formattedForRequest)).toEqual({
        events_order: [],
        events: [],
        notes: [],
      });
    });
  });

  describe('when the issue is an illness', () => {
    it('returns only the necessary data', () => {
      const illnessData = {
        athlete_id: 32,
        side_id: '2',
        type_id: '3',
        activity_id: '123',
        activity_type: '111',
        game_id: '321',
        training_session_id: null,
        occurrence_min: 21,
        session_completed: true,
        position_when_injured_id: '1',
        created_by: '',
        closed: false,
        id: 1234,
        occurrence_date: '2018-05-05 10:18:24',
        events_order: [12, 'new_status_1'],
        events: {
          12: {
            id: 12,
            date: '2017-03-02',
            injury_status_id: 2,
          },
          new_status_1: {
            id: 'new_status_1',
            date: '2017-04-12',
            injury_status_id: 1,
          },
        },
        notes: [],
        modification_info: '',
      };

      const currentNote = {
        id: '',
        date: '10/11/2018',
        created_by: '',
        note: 'new note',
      };

      const formType = 'ILLNESS';

      const formattedForRequest = transformIssueRequest(
        illnessData,
        currentNote,
        formType
      );

      expect(JSON.parse(formattedForRequest)).toEqual({
        athlete_id: illnessData.athlete_id,
        game_id: '321',
        training_session_id: null,
        side_id: illnessData.side_id,
        type_id: illnessData.type_id,
        onset_id: illnessData.type_id,
        created_by: illnessData.created_by,
        closed: illnessData.closed,
        id: illnessData.id,
        occurrence_date: illnessData.occurrence_date,
        events_order: illnessData.events_order,
        events: [
          {
            id: 12,
            date: '2017-03-02',
            injury_status_id: 2,
          },
          {
            id: '',
            date: '2017-04-12',
            injury_status_id: 1,
          },
        ],
        notes: [currentNote],
        modification_info: illnessData.modification_info,
      });
    });
  });

  describe('when the game_id is UNLISTED', () => {
    const injuryData = {
      events_order: [],
      notes: [],
      game_id: 'UNLISTED',
    };

    it('sends an empty string as game_id to the backend', () => {
      const currentNote = {
        note: '',
      };

      const formattedForRequest = transformIssueRequest(
        injuryData,
        currentNote,
        'INJURY'
      );

      expect(JSON.parse(formattedForRequest).game_id).toBe('');
    });
  });

  describe('when the game_id is a number', () => {
    const injuryData = {
      events_order: [],
      notes: [],
      game_id: 3,
    };

    it('sends the game_id to the backend', () => {
      const currentNote = {
        note: '',
      };

      const formattedForRequest = transformIssueRequest(
        injuryData,
        currentNote,
        'INJURY'
      );

      expect(JSON.parse(formattedForRequest).game_id).toBe(3);
    });
  });

  describe('when the training_session_id is UNLISTED', () => {
    const injuryData = {
      events_order: [],
      notes: [],
      training_session_id: 'UNLISTED',
    };

    it('sends an empty string as training_session_id to the backend', () => {
      const currentNote = {
        note: '',
      };

      const formattedForRequest = transformIssueRequest(
        injuryData,
        currentNote,
        'INJURY'
      );

      expect(JSON.parse(formattedForRequest).training_session_id).toBe('');
    });
  });

  describe('when the training_session_id is a number', () => {
    const injuryData = {
      events_order: [],
      notes: [],
      training_session_id: 3,
    };

    it('sends the training_session_id to the backend', () => {
      const currentNote = {
        note: '',
      };

      const formattedForRequest = transformIssueRequest(
        injuryData,
        currentNote,
        'INJURY'
      );

      expect(JSON.parse(formattedForRequest).training_session_id).toBe(3);
    });
  });

  describe('when the issue is an injury', () => {
    it('removes type_id', () => {
      const injuryData = {
        athlete_id: 32,
        side_id: '2',
        type_id: '3',
        activity_id: '123',
        activity_type: '111',
        game_id: '321',
        training_session_id: null,
        occurrence_min: 21,
        session_completed: true,
        position_when_injured_id: '1',
        created_by: '',
        closed: false,
        id: 1234,
        occurrence_date: '2018-05-05 10:18:24',
        events_order: [12, 'new_status_1'],
        events: {
          12: {
            id: 12,
            date: '2017-03-02',
            injury_status_id: 2,
          },
          new_status_1: {
            id: 'new_status_1',
            date: '2017-04-12',
            injury_status_id: 1,
          },
        },
        notes: [],
        modification_info: '',
      };

      const currentNote = {
        id: '',
        date: '10/11/2018',
        created_by: '',
        note: 'new note',
      };

      const formType = 'INJURY';

      const formattedForRequest = transformIssueRequest(
        injuryData,
        currentNote,
        formType
      );

      expect(JSON.parse(formattedForRequest)).toEqual({
        activity_id: '123',
        activity_type: '111',
        athlete_id: 32,
        closed: false,
        created_by: '',
        events: [
          { date: '2017-03-02', id: 12, injury_status_id: 2 },
          { date: '2017-04-12', id: '', injury_status_id: 1 },
        ],
        events_order: [12, 'new_status_1'],
        game_id: '321',
        id: 1234,
        modification_info: '',
        notes: [
          { created_by: '', date: '10/11/2018', id: '', note: 'new note' },
        ],
        occurrence_date: '2018-05-05 10:18:24',
        occurrence_min: 21,
        position_when_injured_id: '1',
        session_completed: true,
        side_id: '2',
        training_session_id: null,
      });
    });
  });
});

describe('buildIssueState when formType is INJURY', () => {
  it('returns the correct injury data state', () => {
    const injuryData = {
      type_id: 3,
      events_order: [1],
      events: [
        {
          id: 1,
          injury_status_id: 2,
          date: '2018-06-20 14:06:03',
        },
      ],
    };

    const formattedInjuryData = buildIssueState(injuryData, 'INJURY');

    const expectedInjuryData = {
      type_id: 3,
      events_order: ['1'],
      events: {
        1: {
          id: 1,
          injury_status_id: 2,
          date: '2018-06-20 14:06:03',
        },
      },
      // When the game or training session is null,
      // we transform the id to 'UNLISTED'.
      game_id: 'UNLISTED',
      training_session_id: 'UNLISTED',
    };

    expect(formattedInjuryData).toEqual(expectedInjuryData);
  });
});

describe('buildIssueState when formType is ILLNESS', () => {
  it('returns the correct illness data state', () => {
    const illnessData = {
      onset_id: 3,
      events_order: [1],
      events: [
        {
          id: 1,
          injury_status_id: 2,
          date: '2018-06-20 14:06:03',
        },
      ],
    };

    const formattedInjuryData = buildIssueState(illnessData, 'ILLNESS');

    const expectedInjuryData = {
      type_id: 3,
      events_order: ['1'],
      events: {
        1: {
          id: 1,
          injury_status_id: 2,
          date: '2018-06-20 14:06:03',
        },
      },
      // When the game or training session is null,
      // we transform the id to 'UNLISTED'.
      game_id: 'UNLISTED',
      training_session_id: 'UNLISTED',
    };

    expect(formattedInjuryData).toEqual(expectedInjuryData);
  });
});

describe('buildIssueState when supplementary_pathology is not null', () => {
  it('returns the correct illness data state', () => {
    const illnessData = {
      onset_id: 3,
      events_order: [1],
      events: [
        {
          id: 1,
          injury_status_id: 2,
          date: '2018-06-20 14:06:03',
        },
      ],
      supplementary_pathology: 'Something',
    };

    const formattedInjuryData = buildIssueState(illnessData, 'ILLNESS');

    const expectedInjuryData = {
      type_id: 3,
      events_order: ['1'],
      supplementary_pathology: 'Something',
      events: {
        1: {
          id: 1,
          injury_status_id: 2,
          date: '2018-06-20 14:06:03',
        },
      },
      // When the game or training session is null,
      // we transform the id to 'UNLISTED'.
      game_id: 'UNLISTED',
      has_supplementary_pathology: true,
      training_session_id: 'UNLISTED',
    };

    expect(formattedInjuryData).toEqual(expectedInjuryData);
  });
});

describe('getDefaultIssueState', () => {
  it('returns the correct default injury state', () => {
    const athlete = {
      id: 3,
      modification_info: 'mod/info',
    };
    const defaultInjurystate = getDefaultIssueState(
      athlete.id,
      athlete.modification_info
    );

    const expectedDefaultInjuryState = {
      athlete_id: 3,
      osics: {
        osics_id: null,
        osics_pathology_id: null,
        osics_classification_id: null,
        osics_body_area_id: null,
        icd: null,
      },
      side_id: null,
      type_id: null,
      activity_id: null,
      activity_type: null,
      game_id: null,
      has_supplementary_pathology: false,
      training_session_id: null,
      occurrence_min: null,
      supplementary_pathology: null,
      association_period_id: null,
      session_completed: null,
      position_when_injured_id: null,
      created_by: '',
      closed: false,
      id: null,
      recurrence_id: null,
      has_recurrence: false,
      occurrence_date: null,
      events_order: ['new_status'],
      events: {
        new_status: {
          injury_status_id: null,
          date: null,
        },
      },
      notes: [],
      modification_info: 'mod/info',
      total_duration: null,
      unavailability_duration: null,
      events_duration: {},
      prior_resolved_date: null,
      staticData: {
        injuryOsicsPathologies: [],
        illnessOsicsPathologies: [],
        injuryOsicsClassifications: [],
        illnessOsicsClassifications: [],
        injuryOsicsBodyAreas: [],
        illnessOsicsBodyAreas: [],
        injuryOnsets: [],
        illnessOnsets: [],
      },
    };

    expect(defaultInjurystate).toEqual(expectedDefaultInjuryState);
  });
});
