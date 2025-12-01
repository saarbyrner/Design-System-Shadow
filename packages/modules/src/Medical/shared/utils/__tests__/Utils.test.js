import moment from 'moment-timezone';
import { data as mockInjuryStatuses } from '@kitman/services/src/mocks/handlers/getInjuryStatuses';
import { data as mockActivityGroups } from '@kitman/services/src/mocks/handlers/medical/getActivityGroups';
import { data as mockEvents } from '@kitman/services/src/mocks/handlers/getGameAndTrainingOptions';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import athleteIssues from '@kitman/services/src/mocks/handlers/medical/getAthleteIssues/data.mock';
import {
  checkOptionRequiresTextField,
  filterConcussions,
  filterInactiveSides,
  formatTreatmentSessionOptionsForSelectComponent,
  getActivityGroupOptions,
  getAdditionalEventOptions,
  getAmericanStateOptions,
  getAnnotationableRequiredField,
  getCIFieldOption,
  getCodingFieldOption,
  getCodingSystemFromCoding,
  getCodingSystemFromIssue,
  getDatalysFieldOption,
  getDefaultDateRange,
  getDefaultDiagnosticFilters,
  getDefaultTreatmentFilters,
  getEventValue,
  getFormattedIssueIds,
  getFreetextValue,
  getGameAndTrainingGroupedOptions,
  getGameAndTrainingOptions,
  getGroupedAthleteIssues,
  getICDFieldOption,
  getInjuryMechanismLabel,
  getIssueContactParentChildLabel,
  getIssueIds,
  getIssueIdsFromOptions,
  getIssueTitle,
  getIssueTypeFromPayload,
  getIssueTypePath,
  getIssueTypeValueFromSidePanel,
  getOtherEventFromIssue,
  getPathologyFieldOption,
  getPathologyName,
  getPathologyTitle,
  getPositionOptions,
  getRequestedIssueTitle,
  getSortedEventOptions,
  getStatusOptions,
  isAnnotationInvalid,
  isChronicIssue,
  isInfoEvent,
  isV2MultiCodingSystem,
  mapIssuesToOptions,
  mapIssuesToSelectOptions,
  mapParentAndChildrenToOptions,
  updateFreetextComponentResults,
} from '../index';

window.featureFlags = {};

describe('getIssueTypePath', () => {
  it('returns injuries when null issueType', () => {
    expect(getIssueTypePath(null)).toEqual('injuries');
  });

  it('returns illness when Illness issueType', () => {
    expect(getIssueTypePath('Illness')).toEqual('illnesses');
    expect(getIssueTypePath('ChronicIllness')).toEqual('illnesses');
  });

  it('returns injuries when Injury issueType', () => {
    expect(getIssueTypePath('INJURY')).toEqual('injuries'); // Will lowercase
    expect(getIssueTypePath('ChronicInjury')).toEqual('injuries');
  });

  it('returns chronic_issues when Chronic issueType', () => {
    expect(getIssueTypePath('Emr::Private::Models::ChronicIssue')).toEqual(
      'chronic_issues'
    );
    expect(getIssueTypePath('emr::private::models::chronicissue')).toEqual(
      'chronic_issues'
    );
  });

  it('returns injuries when any other value', () => {
    expect(getIssueTypePath('anything')).toEqual('injuries');
  });
});

describe('getStatusOptions', () => {
  const availableOptions = [
    {
      label: 'Causing unavailability (time-loss)',
      value: 1,
    },
    {
      label: 'Not affecting availability (medical attention)',
      value: 2,
    },
    {
      label: 'Affecting availability (medical attention)',
      value: 3,
    },
    {
      label: 'Resolved',
      value: 4,
    },
  ];

  describe('excludeResolvers is true', () => {
    it('returns the correct options for the first status', () => {
      expect(
        getStatusOptions({
          currentIndex: 0,
          statuses: mockInjuryStatuses,
          excludeResolvers: true,
        })
      ).toEqual([
        availableOptions[0],
        availableOptions[1],
        availableOptions[2],
      ]);
    });

    it('returns the correct options for the second status', () => {
      expect(
        getStatusOptions({
          currentIndex: 1,
          previousId: 1,
          statuses: mockInjuryStatuses,
          excludeResolvers: true,
        })
      ).toEqual([availableOptions[1], availableOptions[2]]);
    });

    it('returns the correct options for the third status', () => {
      expect(
        getStatusOptions({
          currentIndex: 1,
          previousId: 2,
          statuses: mockInjuryStatuses,
          excludeResolvers: true,
        })
      ).toEqual([availableOptions[0], availableOptions[2]]);
    });
  });

  describe('excludeResolvers is false', () => {
    it('returns the correct options for the first status', () => {
      expect(
        getStatusOptions({
          currentIndex: 0,
          statuses: mockInjuryStatuses,
          excludeResolvers: false,
        })
      ).toEqual(availableOptions);
    });

    it('returns the correct options for the second status', () => {
      expect(
        getStatusOptions({
          currentIndex: 1,
          previousId: 1,
          statuses: mockInjuryStatuses,
          excludeResolvers: false,
        })
      ).toEqual([
        availableOptions[1],
        availableOptions[2],
        availableOptions[3],
      ]);
    });

    it('returns the correct options for the third status', () => {
      expect(
        getStatusOptions({
          currentIndex: 1,
          previousId: 2,
          statuses: mockInjuryStatuses,
          excludeResolvers: false,
        })
      ).toEqual([
        availableOptions[0],
        availableOptions[2],
        availableOptions[3],
      ]);
    });
  });
});

describe('getIssueTypeValueFromSidePanel', () => {
  it('should return chronic injury type', () => {
    expect(getIssueTypeValueFromSidePanel('CHRONIC_INJURY')).toEqual(
      'chronic_issue'
    );
    expect(getIssueTypeValueFromSidePanel('CHRONIC_ILLNESS')).toEqual(
      'chronic_issue'
    );
  });
});

describe('getIssueTypeFromPayload', () => {
  it('should return truthy value for recurrence', () => {
    expect(getIssueTypeFromPayload({ has_recurrence: true })).toEqual(
      'recurrence'
    );
  });
});

describe('getSortedEventOptions', () => {
  it('should return the sorted options when no game sessions', () => {
    expect(
      getSortedEventOptions([
        { label: 'Agility (01/12/2021)', value: '641724_training' },
        { label: 'Unlisted Game', value: 'unlisted_game' },
        { label: 'Unlisted Practice', value: 'unlisted_training' },
      ])
    ).toEqual([
      { label: 'Agility (01/12/2021)', value: '641724_training' },
      { label: 'Unlisted Game', value: 'unlisted_game' },
      { label: 'Unlisted Practice', value: 'unlisted_training' },
    ]);
  });

  it('should return the sorted options when no training sessions', () => {
    expect(
      getSortedEventOptions([
        {
          label: 'International Squad vs New Zealand (20/10/2021) 3-0',
          value: '45677_game',
        },
        { label: 'Unlisted Game', value: 'unlisted_game' },
        { label: 'Unlisted Practice', value: 'unlisted_training' },
      ])
    ).toEqual([
      {
        label: 'International Squad vs New Zealand (20/10/2021) 3-0',
        value: '45677_game',
      },
      { label: 'Unlisted Game', value: 'unlisted_game' },
      { label: 'Unlisted Practice', value: 'unlisted_training' },
    ]);
  });

  it('should return the sorted options when no game and training sessions', () => {
    expect(
      getSortedEventOptions([
        { label: 'Unlisted Game', value: 'unlisted_game' },
        { label: 'Unlisted Practice', value: 'unlisted_training' },
      ])
    ).toEqual([
      { label: 'Unlisted Game', value: 'unlisted_game' },
      { label: 'Unlisted Practice', value: 'unlisted_training' },
    ]);
  });

  it('should return the sorted options when there are game and training sessions', () => {
    expect(
      getSortedEventOptions([
        {
          label: 'Academy Squad vs Cork (30/11/2021) 1-33',
          value: '46710_game',
        },
        {
          label: 'International Squad vs New Zealand (16/11/2021) 29-20',
          value: '46275_game',
        },
        {
          label: 'International Squad vs New Zealand (20/10/2021) 3-0',
          value: '45677_game',
        },
        {
          label: 'Academy Squad vs Australia (13/10/2021) 5-8',
          value: '45429_game',
        },
        { label: 'Unlisted Game', value: 'unlisted_game' },
        { label: 'Agility (01/12/2021)', value: '641724_training' },
        { label: 'Workout (01/12/2021)', value: '641761_training' },
        { label: 'Unlisted Practice', value: 'unlisted_training' },
      ])
    ).toEqual([
      {
        label: 'Academy Squad vs Cork (30/11/2021) 1-33',
        value: '46710_game',
      },
      {
        label: 'International Squad vs New Zealand (16/11/2021) 29-20',
        value: '46275_game',
      },
      {
        label: 'International Squad vs New Zealand (20/10/2021) 3-0',
        value: '45677_game',
      },
      {
        label: 'Academy Squad vs Australia (13/10/2021) 5-8',
        value: '45429_game',
      },
      { label: 'Agility (01/12/2021)', value: '641724_training' },
      { label: 'Workout (01/12/2021)', value: '641761_training' },
      { label: 'Unlisted Game', value: 'unlisted_game' },
      { label: 'Unlisted Practice', value: 'unlisted_training' },
    ]);
  });
});

describe('getICDFieldOption', () => {
  it('returns the correct ICD field option structure', () => {
    expect(
      getICDFieldOption({
        icd_id: 123,
        code: 'S92',
        diagnosis: 'Fracture of foot and toe, except ankle',
        body_part: null,
        pathology_type: null,
        side: null,
      })
    ).toEqual({
      value: {
        icd_id: 123,
        code: 'S92',
        diagnosis: 'Fracture of foot and toe, except ankle',
        body_part: null,
        pathology_type: null,
        side: null,
      },
      label: 'S92 Fracture of foot and toe, except ankle',
    });
  });
});

describe('getDatalysFieldOption', () => {
  it('returns the correct Datalys field option structure', () => {
    expect(
      getDatalysFieldOption({
        id: 123,
        code: 'S92',
        pathology: 'Fracture of foot and toe, except ankle',
      })
    ).toEqual({
      value: {
        id: 123,
        code: 'S92',
        pathology: 'Fracture of foot and toe, except ankle',
      },
      label: 'S92 Fracture of foot and toe, except ankle',
    });
  });
});

describe('getCodingFieldOption', () => {
  const mockICD = {
    icd_id: 123,
    diagnosis: 'Test ICD Diagnosis',
  };

  const mockDatalys = {
    id: 456,
    pathology: 'Test Datalys Pathology',
  };

  const mockCI = {
    id: 789,
    pathology: 'Test CI Pathology',
  };

  const mockOSIICS15 = {
    id: 101,
    pathology: 'Test OSIICS15 Pathology',
  };

  it('returns ICD field option when ICD coding is present', () => {
    const coding = {
      [codingSystemKeys.ICD]: mockICD,
    };
    const result = getCodingFieldOption(coding);
    expect(result).toEqual(getICDFieldOption(mockICD));
  });

  it('returns null when ICD coding is present but icd_id is missing', () => {
    const coding = {
      [codingSystemKeys.ICD]: { diagnosis: 'Test' },
    };
    const result = getCodingFieldOption(coding);
    expect(result).toBeNull();
  });

  it('returns Datalys field option when Datalys coding is present', () => {
    const coding = {
      [codingSystemKeys.DATALYS]: mockDatalys,
    };
    const result = getCodingFieldOption(coding);
    expect(result).toEqual(getDatalysFieldOption(mockDatalys));
  });

  it('returns null when Datalys coding is present but id is missing', () => {
    const coding = {
      [codingSystemKeys.DATALYS]: { pathology: 'Test' },
    };
    const result = getCodingFieldOption(coding);
    expect(result).toBeNull();
  });

  it('returns CI field option when Clinical Impressions coding is present', () => {
    const coding = {
      [codingSystemKeys.CLINICAL_IMPRESSIONS]: mockCI,
    };
    const result = getCodingFieldOption(coding);
    expect(result).toEqual(getCIFieldOption(mockCI));
  });

  it('returns null when Clinical Impressions coding is present but id is missing', () => {
    const coding = {
      [codingSystemKeys.CLINICAL_IMPRESSIONS]: { pathology: 'Test' },
    };
    const result = getCodingFieldOption(coding);
    expect(result).toBeNull();
  });

  it('returns OSIICS15 field option when OSIICS15 coding is present', () => {
    const coding = {
      [codingSystemKeys.OSIICS_15]: mockOSIICS15,
    };
    const result = getCodingFieldOption(coding);
    expect(result).toEqual(getPathologyFieldOption(mockOSIICS15));
  });

  it('returns null when OSIICS15 coding is present but id is missing', () => {
    const coding = {
      [codingSystemKeys.OSIICS_15]: { pathology: 'Test' },
    };
    const result = getCodingFieldOption(coding);
    expect(result).toBeNull();
  });

  it('returns null when no valid coding system is present', () => {
    const coding = {
      [codingSystemKeys.OSICS_10]: { pathology: 'Test' },
    };
    const result = getCodingFieldOption(coding);
    expect(result).toBeNull();
  });

  it('returns null when coding object is empty', () => {
    const coding = {};
    const result = getCodingFieldOption(coding);
    expect(result).toBeNull();
  });

  it('prioritizes ICD over other coding systems', () => {
    const coding = {
      [codingSystemKeys.ICD]: mockICD,
      [codingSystemKeys.DATALYS]: mockDatalys,
      [codingSystemKeys.CLINICAL_IMPRESSIONS]: mockCI,
      [codingSystemKeys.OSIICS_15]: mockOSIICS15,
    };
    const result = getCodingFieldOption(coding);
    expect(result).toEqual(getICDFieldOption(mockICD));
  });
});

describe('getIssueIds', () => {
  it('should return the ids correctly when the issue is Injury', () => {
    expect(
      getIssueIds('Injury', ['Injury_12', 'Injury_452', 'Injury_3231'])
    ).toEqual([12, 452, 3231]);
  });

  it('should return the ids correctly when the issue is Illness', () => {
    expect(
      getIssueIds('Illness', ['Illness_24', 'Illness_58', 'Illness_102'])
    ).toEqual([24, 58, 102]);
  });
});

describe('getFormattedIssueIds', () => {
  it('should return the formatted ids correctly', () => {
    expect(
      getFormattedIssueIds([12, 452, 3231], [24, 58, 102], [44, 55, 77])
    ).toEqual([
      'Injury_12',
      'Injury_452',
      'Injury_3231',
      'Illness_24',
      'Illness_58',
      'Illness_102',
      'ChronicInjury_44',
      'ChronicInjury_55',
      'ChronicInjury_77',
    ]);
  });
});

describe('getDefaultDateRange', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
    Date.now = jest
      .fn(() => new Date(Date.UTC(2020, 1, 28, 0, 0, 0)))
      .valueOf();
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  it('returns the correct default event filters 12 months in the past to the current date)', () => {
    expect(getDefaultDateRange()).toEqual({
      start_date: '2019-02-28T00:00:00+00:00',
      end_date: '2020-02-28T23:59:59+00:00',
    });
  });
});

describe('getDefaultTreatmentFilters', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
    Date.now = jest
      .fn(() => new Date(Date.UTC(2020, 1, 28, 0, 0, 0)))
      .valueOf();
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  it('returns the correct default treatment search filters', () => {
    expect(
      getDefaultTreatmentFilters({
        athleteId: 1,
        issueId: 2,
        issueType: 'Injury',
      })
    ).toEqual({
      athlete_id: 1,
      search_expression: '',
      squads: [],
      date_range: null,
      issue_occurrence: {
        id: 2,
        type: 'injury_occurrence',
      },
    });
  });
});

describe('getDefaultDiagnosticFilters', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
    Date.now = jest
      .fn(() => new Date(Date.UTC(2020, 1, 28, 0, 0, 0)))
      .valueOf();
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  it('returns the correct default diagnostic search filters', () => {
    expect(
      getDefaultDiagnosticFilters({
        athleteId: 1,
        issueId: 2,
        issueType: 'InjuryOccurrence',
      })
    ).toEqual({
      athlete_id: 1,
      search_expression: '',
      date_range: null,
      squads: [],
      diagnostic_location_ids: [],
      diagnostic_reason_ids: [],
      reviewed: null,
      statuses: [],
      provider_sgids: [],
      diagnostic_type_ids: [],
      result_type: [],
      issue_occurrence: {
        id: 2,
        type: 'injuryoccurrence',
      },
    });
  });
});

describe('getGameAndTrainingOptions', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  it('should return the game and training options correctly', () => {
    expect(
      getGameAndTrainingOptions({
        games: [
          {
            game_date: '2021-04-14T00:00:00+00:00',
            score: '15',
            opponent_score: '8',
            name: 'International Squad vs Samoa',
            value: 47576,
            event_id: 47576,
          },
        ],
        training_sessions: [
          {
            training_date: '2021-05-04T00:00:00+00:00',
            name: 'Conditioning',
            value: 505729,
            event_id: 505729,
          },
        ],
      })
    ).toEqual([
      {
        label: 'International Squad vs Samoa (Apr 14, 2021) 15-8',
        value: '47576_game',
      },
      {
        label: 'Conditioning (May 4, 2021)',
        value: '505729_training',
      },
    ]);
  });

  it('should return the chronic version of the games and training sessions correctly', () => {
    expect(
      getGameAndTrainingOptions(
        {
          games: [
            {
              game_date: '2021-04-14T00:00:00+00:00',
              score: '15',
              opponent_score: '8',
              name: 'International Squad vs Samoa',
              value: 47576,
              event_id: 14567,
            },
          ],
          training_sessions: [
            {
              training_date: '2021-05-04T00:00:00+00:00',
              name: 'Conditioning',
              value: 505729,
              event_id: 204987,
            },
          ],
        },
        true
      )
    ).toEqual([
      {
        label: 'International Squad vs Samoa (Apr 14, 2021) 15-8',
        value: '14567_game',
      },
      { label: 'Conditioning (May 4, 2021)', value: '204987_training' },
    ]);
  });

  it('should return the chronic version of the games and training sessions if no event id correctly', () => {
    expect(
      getGameAndTrainingOptions(
        {
          games: [
            {
              game_date: '2021-04-14T00:00:00+00:00',
              score: '15',
              opponent_score: '8',
              name: 'International Squad vs Samoa',
              value: 47576,
              event_id: null,
            },
          ],
          training_sessions: [
            {
              training_date: '2021-05-04T00:00:00+00:00',
              name: 'Conditioning',
              value: 505729,
              event_id: null,
            },
          ],
        },
        true
      )
    ).toEqual([
      {
        label: 'International Squad vs Samoa (Apr 14, 2021) 15-8',
        value: 'unlisted_game',
      },
      { label: 'Conditioning (May 4, 2021)', value: 'unlisted_training' },
    ]);
  });
});

describe('getGameAndTrainingGroupedOptions', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  it('should return the game and training options correctly', () => {
    expect(
      getGameAndTrainingGroupedOptions({
        gameAndTrainingOptions: {
          games: [
            {
              game_date: '2021-04-14T00:00:00+00:00',
              score: '15',
              opponent_score: '8',
              name: 'International Squad vs Samoa',
              value: 47576,
              event_id: 47576,
              squad: {
                id: 1,
                name: 'Squad 1',
              },
            },
          ],
          training_sessions: [
            {
              training_date: '2021-05-04T00:00:00+00:00',
              name: 'Conditioning',
              value: 505729,
              event_id: 505729,
              squad: {
                id: 2,
                name: 'Squad 2',
              },
            },
          ],
        },
      })
    ).toEqual([
      {
        label: 'Squad 1',
        options: [
          {
            label: 'International Squad vs Samoa (Apr 14, 2021) 15-8',
            value: '47576_game',
          },
        ],
      },
      {
        label: 'Squad 2',
        options: [
          { label: 'Conditioning (May 4, 2021)', value: '505729_training' },
        ],
      },
    ]);
  });

  it('should return the chronic version of the games and training sessions correctly', () => {
    expect(
      getGameAndTrainingGroupedOptions({
        gameAndTrainingOptions: {
          games: [
            {
              game_date: '2021-04-14T00:00:00+00:00',
              score: '15',
              opponent_score: '8',
              name: 'International Squad vs Samoa',
              value: 47576,
              event_id: 14567,
              squad: {
                id: 1,
                name: 'Squad 1',
              },
            },
          ],
          training_sessions: [
            {
              training_date: '2021-05-04T00:00:00+00:00',
              name: 'Conditioning',
              value: 505729,
              event_id: 204987,
              squad: {
                id: 2,
                name: 'Squad 2',
              },
            },
          ],
        },
        isChronic: true,
      })
    ).toEqual([
      {
        label: 'Squad 1',
        options: [
          {
            label: 'International Squad vs Samoa (Apr 14, 2021) 15-8',
            value: '14567_game',
          },
        ],
      },
      {
        label: 'Squad 2',
        options: [
          { label: 'Conditioning (May 4, 2021)', value: '204987_training' },
        ],
      },
    ]);
  });

  it('should return the chronic version of the games and training sessions if no event id correctly', () => {
    expect(
      getGameAndTrainingGroupedOptions({
        gameAndTrainingOptions: {
          games: [
            {
              game_date: '2021-04-14T00:00:00+00:00',
              score: '15',
              opponent_score: '8',
              name: 'International Squad vs Samoa',
              value: 47576,
              event_id: null,
              squad: {
                id: 1,
                name: 'Squad 1',
              },
            },
          ],
          training_sessions: [
            {
              training_date: '2021-05-04T00:00:00+00:00',
              name: 'Conditioning',
              value: 505729,
              event_id: null,
              squad: {
                id: 2,
                name: 'Squad 2',
              },
            },
          ],
        },
        isChronic: true,
      })
    ).toEqual([
      {
        label: 'Squad 1',
        options: [
          {
            label: 'International Squad vs Samoa (Apr 14, 2021) 15-8',
            value: 'unlisted_game',
          },
        ],
      },
      {
        label: 'Squad 2',
        options: [
          { label: 'Conditioning (May 4, 2021)', value: 'unlisted_training' },
        ],
      },
    ]);
  });
});

describe('getActivityGroupOptions', () => {
  it('should return the activity group options correctly when the even type is game', () => {
    const expected = [
      {
        label: 'Rugby Game',
        options: [
          {
            value: 3,
            label: 'Collision',
            description: '',
          },
          {
            value: 9,
            label: 'Lineout',
            description: '',
          },
          {
            value: 10,
            label: 'Other Contact',
            description: '',
          },
          {
            value: 8,
            label: 'Scrum',
            description: '',
          },
          {
            value: 1,
            label: 'Tackled',
            description: '',
          },
          {
            label: 'Tackling',
            value: 2,
            description: '',
          },
        ],
      },
      {
        label: 'Rugby Non Contact',
        options: [
          {
            value: 5,
            label: 'Catching',
            description: '',
          },
          {
            value: 4,
            label: 'Kicking',
            description: '',
          },
          {
            value: 11,
            label: 'Other Non Contact',
            description: '',
          },
          {
            value: 12,
            label: 'Running',
            description: '',
          },
          {
            value: 13,
            label: 'Unknown',
            description: '',
          },
        ],
      },
    ];
    expect(getActivityGroupOptions(mockActivityGroups, 'game')).toEqual(
      expected
    );
  });

  it('should return the activity group options correctly when the even type is training_session', () => {
    const expected = [
      {
        label: 'Gym Session',
        options: [{ label: 'Plyometrics', value: 67, description: '' }],
      },
      {
        label: 'Rugby Training',
        options: [
          { label: 'Collision', value: 16, description: '' },
          { label: 'Lineout', value: 22, description: '' },
          { label: 'Maul', value: 20, description: '' },
          { label: 'Other Contact', value: 23, description: '' },
          { label: 'Ruck', value: 19, description: '' },
          { label: 'Scrum', value: 21, description: '' },
          { label: 'Tackled', value: 14, description: '' },
          { label: 'Tackling', value: 15, description: '' },
        ],
      },
      {
        label: 'Rugby Training Non Contact',
        options: [
          { label: 'Catching', value: 18, description: '' },
          { label: 'Kicking', value: 17, description: '' },
          { label: 'Other Non Contact', value: 24, description: '' },
          { label: 'Running', value: 25, description: '' },
          { label: 'Unknown', value: 26, description: '' },
        ],
      },
      {
        label: 'S & C',
        options: [
          { label: 'Agility', value: 32, description: '' },
          { label: 'Conditioning', value: 30, description: '' },
          { label: 'LL Strength', value: 27, description: '' },
          { label: 'NWB Conditioning', value: 31, description: '' },
          { label: 'Plyometrics', value: 34, description: '' },
          { label: 'Speed', value: 33, description: '' },
          { label: 'TB Strength', value: 29, description: '' },
          { label: 'UL Strength', value: 28, description: '' },
        ],
      },
    ];
    expect(getActivityGroupOptions(mockActivityGroups, 'training')).toEqual(
      expected
    );
  });

  it('should return the activity group options correctly when the even type is other', () => {
    expect(getActivityGroupOptions(mockActivityGroups, 'other')).toEqual([
      {
        label: 'Other',
        options: [
          { label: 'Other', requiresText: true, value: 35, description: '' },
        ],
      },
    ]);
  });
});

describe('getPositionOptions', () => {
  it('should return the position options correctly', () => {
    expect(
      getPositionOptions([
        {
          id: 1,
          name: 'Position group 1',
          positions: [
            {
              id: 1,
              name: 'Position 1',
            },
          ],
        },
        {
          id: 2,
          name: 'Position group 2',
          positions: [
            {
              id: 2,
              name: 'Position 2',
            },
          ],
        },
      ])
    ).toEqual([
      {
        label: 'Position 1',
        value: 1,
      },
      {
        label: 'Position 2',
        value: 2,
      },
    ]);
  });
});

describe('isChronicIssue', () => {
  beforeEach(() => {
    window.featureFlags['chronic-injury-illness'] = true;
  });
  afterEach(() => {
    window.featureFlags['chronic-injury-illness'] = false;
  });

  it('should return true if is chronic', () => {
    expect(isChronicIssue('CHRONIC_ILLNESS')).toEqual(true);
    expect(isChronicIssue('CHRONIC_INJURY')).toEqual(true);
  });

  it('should return false if is not chronic', () => {
    expect(isChronicIssue('ILLNESS')).toEqual(false);
    expect(isChronicIssue('INJURY')).toEqual(false);
  });
});

describe('formatTreatmentSessionOptionsForSelectComponent', () => {
  beforeEach(() => {
    i18nextTranslateStub();
  });
  it('should return properly formatted options', () => {
    const data = {
      issues_options: [
        {
          key_name: 'Open Illnesses',
          name: 'Open Illnesses',
          isGroupOption: true,
        },
        {
          key_name:
            '{"reason":"issue","issue_type":"IllnessOccurrence","issue_id":6189}',
          name: 'Unspecified/Crossing Exercise addiction [Left]',
          description: '(Ongoing since 8 Mar 2021)',
        },
      ],
      treatable_area_options: [
        {
          value: {
            treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
            treatable_area_id: 1,
            side_id: 1,
          },
          name: 'Ankle',
          description: 'Left',
          isGroupOption: true,
        },
        {
          value: {
            treatable_area_type: 'Emr::Private::Models::BodyPart',
            treatable_area_id: 262,
            side_id: 1,
          },
          name: 'Achilles Tendon',
          description: 'Left',
        },
      ],
      treatment_modality_options: [
        {
          name: 'AT Directed Rehab',
          isGroupOption: true,
        },
        {
          key_name: 209,
          name: 'Rehab Exercises',
        },
        {
          name: 'Cryotherapy/Compression',
          isGroupOption: true,
        },
        {
          key_name: 39,
          name: 'Cold Tub',
        },
      ],
    };

    expect(formatTreatmentSessionOptionsForSelectComponent(data)).toEqual({
      modalityOptions: [
        {
          label: 'AT Directed Rehab',
          options: [{ label: 'Rehab Exercises', value: 209 }],
        },
        {
          label: 'Cryotherapy/Compression',
          options: [{ label: 'Cold Tub', value: 39 }],
        },
      ],
      bodyAreaOptions: [
        {
          label: 'Ankle - Left',
          value: {
            treatable_area_type: 'Emr::Private::Models::OsicsBodyArea',
            treatable_area_id: 1,
            side_id: 1,
          },
          isGroupOption: true,
        },
        {
          label: 'Achilles Tendon - Left',
          value: {
            treatable_area_type: 'Emr::Private::Models::BodyPart',
            treatable_area_id: 262,
            side_id: 1,
          },
          isGroupOption: false,
        },
      ],
      reasonOptions: [
        {
          label: 'General Treatment - unrelated to issue',
          value: {
            reason: 'general',
            issue_type: null,
            issue_id: null,
          },
        },
        {
          label: 'Recovery - unrelated to issue',
          value: {
            reason: 'recovery',
            issue_type: null,
            issue_id: null,
          },
        },
        {
          label: 'Preparation - unrelated to issue',
          value: {
            reason: 'preparation',
            issue_type: null,
            issue_id: null,
          },
        },
        {
          label: 'Open Illnesses',
          options: [
            {
              value: {
                reason: 'issue',
                issue_type: 'IllnessOccurrence',
                issue_id: 6189,
              },
              label:
                'Fri Feb 28, 2020 - Unspecified/Crossing Exercise addiction [Left]',
            },
          ],
        },
      ],
    });
  });
});

describe('getRequestedIssueTitle', () => {
  const codingCI = {
    id: 4,
    code: 4,
    pathology: 'Concussion',
    clinical_impression_body_area: null,
    clinical_impression_body_area_id: null,
    clinical_impression_classification: null,
    clinical_impression_classification_id: null,
    side_id: null,
    side: null,
    groups: null,
  };

  beforeEach(() => {
    window.featureFlags = {
      'emr-multiple-coding-systems': true,
      'supplemental-recurrence-code': true,
    };
  });
  afterEach(() => {
    window.featureFlags = {
      'emr-multiple-coding-systems': true,
      'supplemental-recurrence-code': true,
    };
  });

  it('should return issue_occurrence_title if not null', () => {
    expect(
      getRequestedIssueTitle({
        supplementary_coding: 'Great Toe Avulsion',
        coding: { clinical_impressions: codingCI },
        issue_occurrence_title: 'Concussion in final',
      })
    ).toEqual('Concussion in final');
  });

  it('should return supplementary reccurence if issue_occurrence_title is null', () => {
    expect(
      getRequestedIssueTitle({
        supplementary_coding: 'Great Toe Avulsion',
        coding: { clinical_impressions: codingCI },
        issue_occurrence_title: null,
      })
    ).toEqual('Great Toe Avulsion');
  });

  it('should return pathology if issue_occurrence_title & supplementary_coding is null', () => {
    expect(
      getRequestedIssueTitle({
        supplementary_coding: '',
        coding: { clinical_impressions: codingCI },
        issue_occurrence_title: null,
      })
    ).toEqual('Concussion');
  });

  it('should return pathology from V2 multi coding system if issue_occurrence_title & supplementary_coding is null', () => {
    const issue = {
      supplementary_coding: '',
      coding: {
        [codingSystemKeys.OSIICS_15]: { id: 1 },
        pathologies: [
          {
            id: 1,
            pathology: 'V2 coding system pathology',
          },
        ],
      },
      issue_occurrence_title: null,
    };
    expect(getRequestedIssueTitle(issue)).toEqual('V2 coding system pathology');
  });
});

describe('getIssueTitle', () => {
  beforeEach(() => {
    jest.spyOn(i18n, 't').mockImplementation((key) => {
      if (key === 'Preliminary') {
        return 'Preliminary';
      }
      if (key === 'No title') {
        return 'No title';
      }
      return key;
    });

    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-01-01T00:00:00Z'));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('should return issue_occurrence_title if not null', () => {
    expect(
      getIssueTitle({
        full_pathology: 'Concussion',
        issue_occurrence_title: 'Concussion in final',
        occurrence_date: '2023-01-01T00:00:00Z',
      })
    ).toEqual('Concussion in final');
  });

  it('should return pathology if issue_occurrence_title is null', () => {
    expect(
      getIssueTitle({
        full_pathology: 'Concussion',
        issue_occurrence_title: null,
        occurrence_date: '2023-01-01T00:00:00Z',
      })
    ).toEqual('Concussion');
  });

  it('should return formatted date and "Preliminary" when prefixDateForPreliminary is true and occurrence_date is present', () => {
    const mockIssue = {
      full_pathology: null,
      issue_occurrence_title: null,
      occurrence_date: '2023-01-01T00:00:00Z',
    };
    expect(getIssueTitle(mockIssue, true)).toEqual('Jan 1, 2023 - Preliminary');
  });

  it('should return "Preliminary" when issue_occurrence_title and full_pathology are null/empty and prefixDateForPreliminary is false', () => {
    const mockIssue = {
      full_pathology: null,
      issue_occurrence_title: null,
      occurrence_date: '2023-01-01T00:00:00Z',
    };
    expect(getIssueTitle(mockIssue, false)).toEqual('Preliminary');
  });

  it('should return "Preliminary" when issue_occurrence_title and full_pathology are null/empty and occurrence_date is null/empty, even if prefixDateForPreliminary is true', () => {
    const mockIssue = {
      full_pathology: null,
      issue_occurrence_title: null,
      occurrence_date: null,
    };
    expect(getIssueTitle(mockIssue, true)).toEqual('Preliminary');
    expect(getIssueTitle(mockIssue, false)).toEqual('Preliminary');
  });

  it('should return "Preliminary" when issue_occurrence_title is empty string and full_pathology is null/empty', () => {
    const mockIssue = {
      full_pathology: null,
      issue_occurrence_title: '',
      occurrence_date: '2023-01-01T00:00:00Z',
    };
    expect(getIssueTitle(mockIssue)).toEqual('Preliminary');
  });
});

describe('getCodingSystemFromCoding', () => {
  const codingICD = {
    id: 1,
    code: 'test',
    diagnosis: 'test',
    body_part: null,
    pathology_type: null,
    side: null,
    groups: null,
  };

  const codingOSICS = {
    osics_id: '2',
    osics_pathology_id: 'test',
    osics_pathology: 'test',
    osics_classification_id: 'test',
    osics_classification: 'test',
    osics_body_area_id: 'test',
    osics_body_area: 'test',
    side_id: 'test',
    icd: null,
    groups: null,
  };

  const codingDatalys = {
    id: 3,
    code: 3,
    pathology: 'test',
    datalys_body_area: null,
    datalys_body_area_id: null,
    datalys_classification: null,
    datalys_classification_id: null,
    datalys_tissue_type: null,
    datalys_tissue_type_id: null,
    side_id: null,
    side: null,
    groups: null,
  };

  const codingCI = {
    id: 4,
    code: 4,
    pathology: 'test',
    clinical_impression_body_area: null,
    clinical_impression_body_area_id: null,
    clinical_impression_classification: null,
    clinical_impression_classification_id: null,
    side_id: null,
    side: null,
    groups: null,
  };

  it('should return ICD coding system if present', () => {
    const coding = {
      icd_10_cm: codingICD,
    };

    expect(getCodingSystemFromCoding(coding)).toEqual(codingICD);
  });

  it('should return OSCIS coding system if present', () => {
    const coding = {
      osics_10: codingOSICS,
    };

    expect(getCodingSystemFromCoding(coding)).toEqual(codingOSICS);
  });

  it('should return Datalys coding system if present', () => {
    const coding = {
      datalys: codingDatalys,
    };

    expect(getCodingSystemFromCoding(coding)).toEqual(codingDatalys);
  });

  it('should return CI coding system if present', () => {
    const coding = {
      clinical_impressions: codingCI,
    };

    expect(getCodingSystemFromCoding(coding)).toEqual(codingCI);
  });

  it('should return ICD coding system if present as is defined first in coding keys', () => {
    const coding = {
      osics_10: codingOSICS,
      datalys: codingDatalys,
      icd_10_cm: codingICD,
    };

    expect(getCodingSystemFromCoding(coding)).toEqual(codingICD);
  });

  it('should return null if no coding values', () => {
    expect(getCodingSystemFromCoding({})).toEqual(null);
  });
});

describe('getCodingSystemFromIssue', () => {
  const codingICD = {
    id: 1,
    code: 'test',
    diagnosis: 'test',
    body_part: null,
    pathology_type: null,
    side: null,
    groups: null,
  };

  const osics = {
    osics_id: 'test',
    osics_pathology_id: 'test',
    osics_classification_id: 'test',
    osics_body_area_id: 'test',
    side_id: 'test',
    icd: null,
    osics_pathology: 'test',
    osics_classification: 'test',
    osics_body_area: 'test',
    bamic: false,
    groups: null,
  };

  describe('when emr-multiple-coding-systems is enabled', () => {
    beforeEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = true;
    });
    afterEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = false;
    });

    it('should return ICD coding system from issue', () => {
      const coding = {
        icd_10_cm: codingICD,
      };

      expect(getCodingSystemFromIssue({ coding, osics })).toEqual(codingICD);
    });
  });

  describe('when emr-multiple-coding-systems is disabled', () => {
    beforeEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = false;
    });

    it('should return ICD coding system from issue', () => {
      const coding = {
        icd_10_cm: codingICD,
      };

      expect(getCodingSystemFromIssue({ coding, osics })).toEqual(osics);
    });
  });
});

describe('getOtherEventFromIssue', () => {
  const otherEventIssue = {
    extended_attributes: [
      { id: 1, value: 'prior', attribute_name: 'other_event_selection' },
    ],
  };
  const infoEventIssue = {
    extended_attributes: [],
  };
  const nullExtendedAttributesIssue = {
    extended_attributes: null,
  };

  const noExtendedAttributesIssue = {};

  it('returns other event when extended_attributes contains other_event_selection', () => {
    expect(getOtherEventFromIssue(otherEventIssue)).toEqual('prior');
  });

  it('returns null when extended_attributes does not contain other_event_selection', () => {
    expect(getOtherEventFromIssue(infoEventIssue)).toEqual(null);
  });
  it('returns null when extended_attributes is null', () => {
    expect(getOtherEventFromIssue(nullExtendedAttributesIssue)).toEqual(null);
  });
  it('returns null when extended_attributes is missing', () => {
    expect(getOtherEventFromIssue(noExtendedAttributesIssue)).toEqual(null);
  });
});

describe('filterConcussions', () => {
  const nonConcussionIssue = {
    id: 1,
    osics: {},
    coding: null,
  };
  const osicsConcussionIssue = {
    id: 2,
    osics: {
      groups: ['concussion'],
    },
    coding: null,
  };
  const codingConcussionIssue = {
    id: 3,
    osics: {},
    coding: { osics_10: { groups: ['concussion'] } },
  };
  const codingNonConcussionIssue = {
    id: 4,
    osics: {},
    coding: {
      osics_10: {
        groups: ['test'],
      },
    },
  };
  const issues = [
    nonConcussionIssue,
    osicsConcussionIssue,
    codingConcussionIssue,
    codingNonConcussionIssue,
  ];

  describe('when emr-multiple-coding-systems is enabled', () => {
    beforeEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = true;
    });
    afterEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = false;
    });

    it('should filter concussions', () => {
      expect(issues.filter(filterConcussions)).toEqual([
        osicsConcussionIssue,
        codingConcussionIssue,
      ]);
    });
  });

  describe('when emr-multiple-coding-systems is disabled', () => {
    beforeEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = false;
    });

    it('should filter concussions', () => {
      expect(issues.filter(filterConcussions)).toEqual([osicsConcussionIssue]);
    });
  });
});

describe('getPathologyName', () => {
  const issue1 = {
    supplementary_pathology: 'supplementary pathology',
    coding: {
      clinical_impressions: {
        pathology: 'pathology 1',
      },
    },
    osics: {
      pathology: { name: 'pathology 1 OSICS' },
    },
  };

  const issue2 = {
    coding: {
      datalys: {
        pathology: 'pathology 2',
      },
    },
    osics: {
      pathology: { name: 'pathology 2 OSICS' },
    },
  };

  const issue3 = {
    coding: {
      icd_10_cm: {
        diagnosis: 'pathology 3',
      },
    },
  };

  const issue4 = {
    coding: {
      osics_10: {
        osics_pathology: 'pathology 4',
      },
    },
    osics: {
      pathology: { name: 'pathology 4 OSICS' },
    },
  };

  const issue5 = {
    coding: {
      [codingSystemKeys.OSIICS_15]: { id: 1 },
      pathologies: [
        {
          id: 1,
          pathology: 'pathology 5 from V2 coding system',
        },
      ],
    },
    osics: {
      pathology: { name: 'pathology 5 OSICS' },
    },
  };

  describe('when emr-multiple-coding-systems and custom-pathologies is enabled', () => {
    beforeEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = true;
      window.featureFlags['custom-pathologies'] = true;
    });
    afterEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = false;
      window.featureFlags['custom-pathologies'] = false;
    });

    it('should get the suitable pathology name', () => {
      expect(getPathologyName(issue1)).toEqual('supplementary pathology');
      expect(getPathologyName(issue2)).toEqual('pathology 2');
      expect(getPathologyName(issue3)).toEqual('pathology 3');
      expect(getPathologyName(issue4)).toEqual('pathology 4');
      expect(getPathologyName(issue5)).toEqual(
        'pathology 5 from V2 coding system'
      );
    });

    it('should handle when coding.pathologies is missing and fallback to osics', () => {
      const issue = {
        coding: {
          [codingSystemKeys.OSIICS_15]: { id: 1 },
        },
        osics: {
          pathology: { name: 'fallback osics' },
        },
      };
      expect(getPathologyName(issue)).toEqual('fallback osics');
    });

    it('should handle when coding.pathologies is an empty array and fallback to osics', () => {
      const issue = {
        coding: {
          [codingSystemKeys.OSIICS_15]: { id: 1 },
          pathologies: [],
        },
        osics: {
          pathology: { name: 'fallback osics' },
        },
      };
      expect(getPathologyName(issue)).toEqual('fallback osics');
    });

    it('should handle when the first pathology object is missing the pathology property and fallback to osics', () => {
      const issue = {
        coding: {
          [codingSystemKeys.OSIICS_15]: { id: 1 },
          pathologies: [{ id: 1 }],
        },
        osics: {
          pathology: { name: 'fallback osics' },
        },
      };
      expect(getPathologyName(issue)).toEqual('fallback osics');
    });

    it('should return empty string if no pathology is found anywhere', () => {
      const issue = {
        coding: {
          [codingSystemKeys.OSIICS_15]: { id: 1 },
          pathologies: [{ id: 1 }],
        },
        osics: null,
      };
      expect(getPathologyName(issue)).toEqual('');
    });
  });

  describe('when emr-multiple-coding-systems is disabled', () => {
    beforeEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = false;
      window.featureFlags['custom-pathologies'] = false;
    });

    it('should get the suitable pathology name', () => {
      expect(getPathologyName(issue1)).toEqual('pathology 1 OSICS');
      expect(getPathologyName(issue2)).toEqual('pathology 2 OSICS');
      expect(getPathologyName(issue3)).toEqual(''); // NO OSICS object
      expect(getPathologyName(issue4)).toEqual('pathology 4 OSICS');
    });
  });
});

describe('getPathologyTitle', () => {
  beforeEach(() => {
    window.featureFlags = {
      'emr-multiple-coding-systems': true,
    };
  });
  afterEach(() => {
    window.featureFlags = {};
  });

  it('should return pathology from V2 multi coding system', () => {
    const issue = {
      coding: {
        [codingSystemKeys.OSIICS_15]: { id: 1 },
        pathologies: [
          {
            id: 1,
            pathology: 'V2 coding system pathology',
          },
        ],
      },
    };
    expect(getPathologyTitle(issue)).toEqual('V2 coding system pathology');
  });

  it('should return supplementary_pathology if it exists', () => {
    const issue = {
      supplementary_pathology: 'supplementary',
      coding: {
        [codingSystemKeys.OSIICS_15]: { id: 1 },
        pathologies: [
          {
            id: 1,
            pathology: 'V2 coding system pathology',
          },
        ],
      },
    };
    expect(getPathologyTitle(issue)).toEqual('supplementary');
  });

  it('should return osics_pathology if it exists and no V2 pathology', () => {
    const issue = {
      coding: {
        [codingSystemKeys.OSICS_10]: { osics_pathology: 'osics pathology' },
      },
    };
    expect(getPathologyTitle(issue)).toEqual('osics pathology');
  });

  it('should return diagnosis from ICD if it exists', () => {
    const issue = {
      coding: {
        [codingSystemKeys.ICD]: { diagnosis: 'ICD diagnosis' },
      },
    };
    expect(getPathologyTitle(issue)).toEqual('ICD diagnosis');
  });

  it('should return pathology from DATALYS if it exists', () => {
    const issue = {
      coding: {
        [codingSystemKeys.DATALYS]: { pathology: 'DATALYS pathology' },
      },
    };
    expect(getPathologyTitle(issue)).toEqual('DATALYS pathology');
  });

  it('should return pathology from CLINICAL_IMPRESSIONS if it exists', () => {
    const issue = {
      coding: {
        [codingSystemKeys.CLINICAL_IMPRESSIONS]: { pathology: 'CI pathology' },
      },
    };
    expect(getPathologyTitle(issue)).toEqual('CI pathology');
  });

  it('should return empty string if no pathology found', () => {
    const issue = {
      coding: {},
    };
    expect(getPathologyTitle(issue)).toEqual('');
  });

  it('should fallback to other coding systems if V2 pathology is missing', () => {
    const issue = {
      coding: {
        [codingSystemKeys.OSIICS_15]: { id: 1 },
        pathologies: [],
        [codingSystemKeys.ICD]: { diagnosis: 'ICD diagnosis' },
      },
    };
    expect(getPathologyTitle(issue)).toEqual('ICD diagnosis');
  });

  it('should fallback to osics_pathology if V2 pathology is missing', () => {
    const issue = {
      coding: {
        [codingSystemKeys.OSIICS_15]: { id: 1 },
        pathologies: [],
        [codingSystemKeys.OSICS_10]: { osics_pathology: 'osics pathology' },
      },
    };
    expect(getPathologyTitle(issue)).toEqual('osics pathology');
  });

  describe('when emr-multiple-coding-systems is disabled', () => {
    beforeEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = false;
    });

    it('should return osics_pathology', () => {
      const issue = {
        osics: { osics_pathology: 'legacy osics pathology' },
        coding: {
          [codingSystemKeys.OSIICS_15]: { id: 1 },
          pathologies: [{ id: 1, pathology: 'V2 coding system pathology' }],
        },
      };
      expect(getPathologyTitle(issue)).toEqual('legacy osics pathology');
    });
  });
});

const mechanisms = [
  {
    id: 1,
    name: 'Blocked',
    parent_id: null,
    require_additional_input: false,
  },
  {
    id: 2,
    name: 'Blocking',
    parent_id: null,
    require_additional_input: false,
  },
  {
    id: 12,
    name: 'Throwing',
    parent_id: null,
    require_additional_input: false,
  },
  {
    id: 13,
    name: 'Weightlifting',
    parent_id: null,
    require_additional_input: false,
  },
  {
    id: 14,
    name: 'Other ',
    parent_id: null,
    require_additional_input: true,
  },
  {
    id: 15,
    name: 'Unknown',
    parent_id: null,
    require_additional_input: false,
  },
  {
    id: 16,
    name: 'Above Waist',
    parent_id: 1,
    require_additional_input: false,
  },
  {
    id: 17,
    name: 'Below Waist',
    parent_id: 1,
    require_additional_input: false,
  },
  {
    id: 18,
    name: 'Pile-On',
    parent_id: 1,
    require_additional_input: false,
  },
  {
    id: 19,
    name: 'Above Waist',
    parent_id: 2,
    require_additional_input: false,
  },
  {
    id: 20,
    name: 'Below Waist',
    parent_id: 2,
    require_additional_input: false,
  },
  {
    id: 21,
    name: 'Pile-On',
    parent_id: 2,
    require_additional_input: false,
  },
];

describe('mapParentAndChildrenToOptions', () => {
  it('maps values correctly', () => {
    expect(mapParentAndChildrenToOptions(mechanisms)).toEqual([
      {
        label: 'Blocked',
        options: [
          {
            value: 16,
            label: 'Above Waist',
          },
          {
            value: 17,
            label: 'Below Waist',
          },
          {
            value: 18,
            label: 'Pile-On',
          },
        ],
      },
      {
        label: 'Blocking',
        options: [
          {
            value: 19,
            label: 'Above Waist',
          },
          {
            value: 20,
            label: 'Below Waist',
          },
          {
            value: 21,
            label: 'Pile-On',
          },
        ],
      },
      {
        value: 12,
        label: 'Throwing',
      },
      {
        value: 13,
        label: 'Weightlifting',
      },
      {
        value: 14,
        label: 'Other ',
        requiresText: true,
      },
      {
        value: 15,
        label: 'Unknown',
      },
    ]);
  });
});

describe('getInjuryMechanismLabel', () => {
  it('returns name if no parent', () => {
    expect(getInjuryMechanismLabel(13, mechanisms)).toEqual('Weightlifting');
  });

  it('returns parent name and name if parent exists', () => {
    expect(getInjuryMechanismLabel(19, mechanisms)).toEqual(
      'Blocking: Above Waist'
    );
  });
});

describe('filterInactiveSides()', () => {
  it('filters out inactive sides', () => {
    const sides = [
      { id: 1, name: 'Left', active: true },
      { id: 2, name: 'Midline', active: true },
      { id: 3, name: 'Right', active: true },
      { id: 4, name: 'Bilateral', active: false },
      { id: 5, name: 'N/A', active: true },
    ];
    expect(filterInactiveSides(sides)).toEqual([
      { id: 1, name: 'Left', active: true },
      { id: 2, name: 'Midline', active: true },
      { id: 3, name: 'Right', active: true },
      { id: 5, name: 'N/A', active: true },
    ]);
  });

  it('returns all sides if active is not defined', () => {
    const sides = [
      { id: 1, name: 'Left' },
      { id: 2, name: 'Midline' },
      { id: 3, name: 'Right' },
      { id: 4, name: 'Bilateral' },
      { id: 5, name: 'N/A' },
    ];
    expect(filterInactiveSides(sides)).toEqual(sides);
  });
});

describe('getFreetextValue', () => {
  const issueMock = {
    freetext_components: [
      { name: 'issue_occurrence_onsets', value: 'test reason' },
    ],
  };

  it('returns the appropriate value based on the type passed in', () => {
    expect(getFreetextValue(issueMock, 'issue_occurrence_onsets')).toEqual(
      'test reason'
    );
  });
});

describe('updateFreetextComponentResults', () => {
  let injuryTypeText;

  beforeEach(() => {
    injuryTypeText = [
      { name: 'issue_occurrence_onsets', value: 'test reason' },
    ];
  });

  it('returns the relevant updated value based on text passed in', () => {
    expect(
      updateFreetextComponentResults(
        injuryTypeText,
        'issue_occurrence_onsets',
        'test reason 2'
      )
    ).toEqual([{ name: 'issue_occurrence_onsets', value: 'test reason 2' }]);
  });

  it('creates the relevant updated value if it does not have an existing component already', () => {
    expect(
      updateFreetextComponentResults(
        [],
        'issue_occurrence_onsets',
        'test reason 2'
      )
    ).toEqual([{ name: 'issue_occurrence_onsets', value: 'test reason 2' }]);
  });

  it('creates the reopen status into the array when updating', () => {
    expect(
      updateFreetextComponentResults(
        injuryTypeText,
        'issue_reopening_reasons',
        'test status reason'
      )
    ).toEqual([
      { name: 'issue_occurrence_onsets', value: 'test reason' },
      { name: 'issue_reopening_reasons', value: 'test status reason' },
    ]);
  });

  it('updates the freetext to be empty if it is empty or undefined what is passed in', () => {
    expect(
      updateFreetextComponentResults(injuryTypeText, 'issue_occurrence_onsets')
    ).toEqual([{ name: 'issue_occurrence_onsets', value: '' }]);
    injuryTypeText = [
      { name: 'issue_occurrence_onsets', value: 'test reason' },
    ];
    expect(
      updateFreetextComponentResults(
        injuryTypeText,
        'issue_occurrence_onsets',
        ''
      )
    ).toEqual([{ name: 'issue_occurrence_onsets', value: '' }]);
  });
});

describe('checkOptionRequiresTextField', () => {
  it('returns true for a found option with requiresText for a general case of options passed in', () => {
    const generalOptions = [
      { label: 'Other', value: 4, requiresText: true },
      { label: 'Test', value: 5 },
    ];
    expect(checkOptionRequiresTextField(generalOptions, 4)).toBeTruthy();
  });
  it('returns true for a found option with requiresText for a case of options with sub-options passed in', () => {
    const subOptions = [
      {
        label: 'Other',
        options: [{ label: 'Other Activity', value: 4, requiresText: true }],
      },
      { label: 'Test', value: 5 },
    ];
    expect(checkOptionRequiresTextField(subOptions, 4)).toBeTruthy();
  });
  it('returns false for no found option with requiresText for a case of options with sub-options passed in', () => {
    const subOptions = [
      {
        label: 'Other',
        options: [{ label: 'Other Activity', value: 4, requiresText: false }],
      },
      { label: 'Test', value: 5 },
    ];
    expect(checkOptionRequiresTextField(subOptions, 4)).toBeFalsy();
  });
  it('returns false for no found option with requiresText for a general case of options passed in', () => {
    const generalOptions = [
      { label: 'Other', value: 4, requiresText: false },
      { label: 'Test', value: 5 },
    ];
    expect(checkOptionRequiresTextField(generalOptions, 4)).toBeFalsy();
  });
});

describe('getAdditionalEventOptions', () => {
  it('should return array of options with value and label', () => {
    const result = getAdditionalEventOptions(mockEvents.other_events);
    expect(result).toMatchSnapshot();
  });

  it('should have additional events when feature flag is on', () => {
    window.featureFlags['medical-additional-event-info-events'] = true;
    const result = getAdditionalEventOptions(mockEvents.other_events);
    expect(result).toMatchSnapshot();
    window.featureFlags['medical-additional-event-info-events'] = false;
  });
});

describe('getAmericanStateOptions', () => {
  it('should renders array of options with value and label', () => {
    const result = getAmericanStateOptions();
    expect(result).toMatchSnapshot();
  });
});

describe('isAnnotationInvalid', () => {
  it('is truthy when there are files in the queue but the note content is empty', () => {
    expect(
      isAnnotationInvalid({
        attachmentContent: { filesQueue: ['abcd'], content: '' },
      })
    ).toBeTruthy();
  });

  it('is truthy when there are files in the queue but the note content is an empty HTML', () => {
    expect(
      isAnnotationInvalid({
        attachmentContent: { filesQueue: ['abcd'], content: '<p><br></p>' },
      })
    ).toBeTruthy();
  });

  it('is falsy when there are files in the queue and the note exists', () => {
    expect(
      isAnnotationInvalid({
        attachmentContent: {
          filesQueue: ['abcd'],
          content: '<p>This is a note</p>',
        },
      })
    ).toBeFalsy();
  });

  it('is falsy when there are no files in the queue, regardless of the note content', () => {
    expect(
      isAnnotationInvalid({
        attachmentContent: {
          filesQueue: [],
          content: '',
        },
      })
    ).toBeFalsy();
  });
});

describe('getIssueContactParentChildLabel', () => {
  const testContactTypes = [
    {
      name: 'Test type 1',
      id: 1,
      parent_id: null,
    },
    {
      name: 'Test type 2',
      id: 2,
      parent_id: 1,
    },
  ];

  it('returns the regular parent name by itself', () => {
    expect(
      getIssueContactParentChildLabel(testContactTypes, testContactTypes[0])
    ).toEqual(testContactTypes[0].name);
  });

  it('returns the parent and child name', () => {
    expect(
      getIssueContactParentChildLabel(testContactTypes, testContactTypes[1])
    ).toEqual(`${testContactTypes[0].name} : ${testContactTypes[1].name}`);
  });

  it('returns an empty string when current type is undefined', () => {
    expect(
      getIssueContactParentChildLabel(testContactTypes, undefined)
    ).toEqual('');
  });
});

describe('isInfoEvent', () => {
  it('returns true when the event type is a game, training or other', () => {
    expect(isInfoEvent('game')).toBeTruthy();
    expect(isInfoEvent('training')).toBeTruthy();
    expect(isInfoEvent('other')).toBeTruthy();
  });
  it('returns false when the event type is a prior or nonfootball', () => {
    expect(isInfoEvent('prior')).toBeFalsy();
    expect(isInfoEvent('nonfootball')).toBeFalsy();
  });
});

describe('getAnnotationableRequiredField', () => {
  const mockNoteSidePanelFormState = {
    annotationable_type: 'Athlete',
    athlete_id: 1,
    diagnostic_id: null,
    procedure_id: null,
  };

  describe('Diagnostic type', () => {
    it('returns true when diagnostic_id exists', () => {
      expect(
        getAnnotationableRequiredField({
          ...mockNoteSidePanelFormState,
          annotationable_type: 'Diagnostic',
          diagnostic_id: 666,
        })
      ).toBeTruthy();
    });
    it('returns false when diagnostic_id is missing', () => {
      expect(
        getAnnotationableRequiredField({
          ...mockNoteSidePanelFormState,
          annotationable_type: 'Diagnostic',
          diagnostic_id_id: null,
        })
      ).toBeFalsy();
    });
  });
  describe('Procedure type', () => {
    it('returns true when procedure_id exists', () => {
      expect(
        getAnnotationableRequiredField({
          ...mockNoteSidePanelFormState,
          annotationable_type: 'Emr::Private::Models::Procedure',
          procedure_id: 666,
        })
      ).toBeTruthy();
    });
    it('returns false when procedure_id is missing', () => {
      expect(
        getAnnotationableRequiredField({
          ...mockNoteSidePanelFormState,
          annotationable_type: 'Emr::Private::Models::Procedure',
          procedure_id: null,
        })
      ).toBeFalsy();
    });
  });
  describe('All other types', () => {
    it('returns true when athlete_id exists', () => {
      expect(
        getAnnotationableRequiredField(mockNoteSidePanelFormState)
      ).toBeTruthy();
    });
    it('returns false when athlete_id is missing', () => {
      expect(
        getAnnotationableRequiredField({
          ...mockNoteSidePanelFormState,
          athlete_id: null,
        })
      ).toBeFalsy();
    });
  });

  describe('getEventValue', () => {
    it('returns the correct event value', () => {
      const eventValue = getEventValue('123', 'game');
      expect(eventValue).toEqual('123_game');
    });
  });
});

describe('getGroupedAthleteIssues', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');

    // We could use jest.setSystemTime(fakeDate) but this is what is alredy used in this file;
    Date.now = jest
      .fn(() => new Date(Date.UTC(2020, 1, 28, 0, 0, 0)))
      .valueOf();
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  it('should group issues correctly', () => {
    const options = getGroupedAthleteIssues({
      issues: athleteIssues.groupedIssues,
    });

    expect(options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          label: 'Nov 11, 2020 - Ankle Fracture (Left)',
          type: 'Injury',
          group: 'Open injury/illness',
        }),
        expect.objectContaining({
          id: 2,
          label: 'Aug 6, 2020 - Asthma and/or allergy',
          type: 'Illness',
          group: 'Open injury/illness',
        }),
        expect.objectContaining({
          id: 3,
          label:
            'May 23, 2020 - Fracture tibia and fibula at ankle joint - [Right]',
          type: 'Injury',
          group: 'Open injury/illness',
        }),
        expect.objectContaining({
          id: 11,
          label: 'May 23, 2020 - Preliminary',
          type: 'Injury',
          group: 'Open injury/illness',
        }),
        expect.objectContaining({
          id: 400,
          label: 'May 23, 2020 - Acute Concussion [N/A]',
          type: 'Injury',
          group: 'Open injury/illness',
        }),
        expect.objectContaining({
          id: 1,
          label:
            'Oct 27, 2020 - Fracture tibia and fibula at ankle joint - [Left]',
          type: 'Injury',
          group: 'Prior injury/illness',
        }),
        expect.objectContaining({
          id: 2,
          label: 'Sep 13, 2020 - Ankle Fracture (Left)',
          type: 'Injury',
          group: 'Prior injury/illness',
        }),
        expect.objectContaining({
          id: 3,
          label: 'Feb 4, 2020 - Emotional stress',
          type: 'Illness',
          group: 'Prior injury/illness',
        }),
        expect.objectContaining({
          id: 1,
          label: 'Jan 17, 2021 - Unique Open Chronic Title',
          type: 'ChronicCondition',
          group: 'Chronic conditions',
        }),
        expect.objectContaining({
          id: 2,
          label: 'Aug 7, 2024 - Test Chronic',
          type: 'ChronicCondition',
          group: 'Chronic conditions',
        }),
        expect.objectContaining({
          id: 3,
          label: 'Jan 7, 2020 - Clavicle A-C Arthritis',
          type: 'ChronicCondition',
          group: 'Chronic conditions',
        }),
        expect.objectContaining({
          id: 4,
          label: 'Aug 7, 2021 - Test title',
          type: 'ChronicCondition',
          group: 'Chronic conditions',
        }),
        expect.objectContaining({
          id: 5,
          label: 'Aug 7, 2022 - Test title II',
          type: 'ChronicCondition',
          group: 'Chronic conditions',
        }),
        expect.objectContaining({
          id: 6,
          label: 'Aug 4, 2024 - Clavicle A-C Arthritis',
          type: 'ChronicCondition',
          group: 'Chronic conditions',
        }),
        expect.objectContaining({
          id: 7,
          label: 'Aug 17, 2024 - Chronic Injury II',
          type: 'ChronicCondition',
          group: 'Chronic conditions',
        }),
      ])
    );
  });
});

describe('mapIssuesToOptions', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
    i18nextTranslateStub();
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  it('should map issues to options correctly', () => {
    const issues = [
      {
        id: 1,
        full_pathology: 'Ankle Fracture',
        issue_occurrence_title: null,
        issue_type: 'Injury',
        occurrence_date: '2020-11-11T00:00:00Z',
      },
      {
        id: 2,
        full_pathology: 'Common Cold',
        issue_occurrence_title: 'Severe Cold',
        issue_type: 'Illness',
        occurrence_date: '2021-01-15T00:00:00Z',
      },
    ];
    const group = 'Open injury/illness';
    const expected = [
      {
        id: 1,
        label: 'Nov 11, 2020 - Ankle Fracture',
        type: 'Injury',
        group: 'Open injury/illness',
      },
      {
        id: 2,
        label: 'Jan 15, 2021 - Severe Cold',
        type: 'Illness',
        group: 'Open injury/illness',
      },
    ];
    expect(mapIssuesToOptions(issues, group)).toEqual(expected);
  });

  it('should handle empty full_pathology and issue_occurrence_title', () => {
    const issues = [
      {
        id: 3,
        full_pathology: null,
        issue_occurrence_title: null,
        issue_type: 'Injury',
        occurrence_date: '2022-03-20T00:00:00Z',
      },
    ];
    const group = 'Open injury/illness';
    const expected = [
      {
        id: 3,
        label: 'Mar 20, 2022 - Preliminary',
        type: 'Injury',
        group: 'Open injury/illness',
      },
    ];
    expect(mapIssuesToOptions(issues, group)).toEqual(expected);
  });
});

describe('mapIssuesToSelectOptions', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
    i18nextTranslateStub();
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  it('should map issues to select options correctly', () => {
    const issues = [
      {
        id: 1,
        full_pathology: 'Ankle Fracture',
        issue_occurrence_title: null,
        issue_type: 'Injury',
        occurrence_date: '2020-11-11T00:00:00Z',
      },
      {
        id: 2,
        full_pathology: 'Common Cold',
        issue_occurrence_title: 'Severe Cold',
        issue_type: 'Illness',
        occurrence_date: '2021-01-15T00:00:00Z',
      },
    ];
    const expected = [
      {
        value: 'Injury_1',
        label: 'Nov 11, 2020 - Ankle Fracture',
      },
      {
        value: 'Illness_2',
        label: 'Jan 15, 2021 - Severe Cold',
      },
    ];
    expect(mapIssuesToSelectOptions(issues)).toEqual(expected);
  });

  it('should handle empty full_pathology and issue_occurrence_title for select options', () => {
    const issues = [
      {
        id: 3,
        full_pathology: null,
        issue_occurrence_title: null,
        issue_type: 'Injury',
        occurrence_date: '2022-03-20T00:00:00Z',
      },
    ];
    const expected = [
      {
        value: 'Injury_3',
        label: 'Mar 20, 2022 - Preliminary',
      },
    ];
    expect(mapIssuesToSelectOptions(issues)).toEqual(expected);
  });
});

describe('isV2MultiCodingSystem', () => {
  it('should return true for OSIICS_15', () => {
    expect(isV2MultiCodingSystem(codingSystemKeys.OSIICS_15)).toBe(true);
  });

  it('should return false for other coding system keys', () => {
    expect(isV2MultiCodingSystem(codingSystemKeys.ICD)).toBe(false);
    expect(isV2MultiCodingSystem(codingSystemKeys.DATALYS)).toBe(false);
    expect(isV2MultiCodingSystem(codingSystemKeys.CLINICAL_IMPRESSIONS)).toBe(
      false
    );
  });
});

describe('getIssueIdsFromOptions', () => {
  it('should return the numerical issue IDs for the specified issue type', () => {
    const options = [
      { id: 123, type: 'Injury', label: 'Injury 123' },
      { id: '456', type: 'Illness', label: 'Illness 456' },
      { id: '789', type: 'ChronicInjury', label: 'Chronic Injury 789' },
      { id: '101', type: 'Injury', label: 'Another Injury 101' },
      { id: '202', type: 'Other', label: 'Other Type 202' },
    ];

    expect(getIssueIdsFromOptions('Injury', options)).toEqual([123, 101]);
    expect(getIssueIdsFromOptions('Illness', options)).toEqual([456]);
    expect(getIssueIdsFromOptions('ChronicInjury', options)).toEqual([789]);
  });

  it('should return an empty array if no options match the issue type', () => {
    const options = [{ id: '123', type: 'Illness', label: 'Illness 123' }];
    expect(getIssueIdsFromOptions('Injury', options)).toEqual([]);
  });

  it('should return an empty array if no options are provided', () => {
    expect(getIssueIdsFromOptions('Injury', [])).toEqual([]);
  });
});
