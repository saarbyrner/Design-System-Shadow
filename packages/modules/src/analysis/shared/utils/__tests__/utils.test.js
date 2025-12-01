import moment from 'moment-timezone';
import structuredClone from 'core-js/stable/structured-clone';
import { data as formulaColumnServerResponse } from '@kitman/services/src/mocks/handlers/analysis/addTableFormulaColumn';
// eslint-disable-next-line jest/no-mocks-import
import { CONVERTED_FORMULA_DATASOURCE } from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/tableWidget';
import { EVENT_TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';
import {
  buildEventTypeTimePeriodSelectOptions,
  convertDataSourceToInputs,
  formatFilterNames,
  formatGraphTitlesToString,
  formatScore,
  getCategoryDivisionOptions,
  getEventsDetails,
  getFullMedicalCategoryName,
  getGraphTitles,
  getMatchingFormulaId,
  getMedicalCategories,
  getMedicalCategoryName,
  getMetricName,
  getPeriodName,
  getPopulationKeys,
  getVenueShorthand,
  isDrillGraph,
  processDataToAddMissingValues,
} from '..';

describe('getMedicalCategories', () => {
  it('returns the medical category list', () => {
    expect(getMedicalCategories()).toEqual([
      { key_name: 'injury_group', name: 'Injuries', isGroupOption: true },
      {
        key_name: 'injury_group__all_injuries',
        name: 'No. of Injury Occurrences',
      },
      { key_name: 'injury_group__pathology', name: 'Pathology' },
      { key_name: 'injury_group__body_area', name: 'Body Area' },
      { key_name: 'injury_group__classification', name: 'Classification' },
      { key_name: 'injury_group__activity', name: 'Activity' },
      { key_name: 'injury_group__session_type', name: 'Session Type' },
      { key_name: 'injury_group__contact_type', name: 'Contact Type' },
      { key_name: 'injury_group__competition', name: 'Competition' },

      { key_name: 'illness_group', name: 'Illnesses', isGroupOption: true },
      {
        key_name: 'illness_group__all_illnesses',
        name: 'No. of Illness Occurrences',
      },
      { key_name: 'illness_group__pathology', name: 'Pathology' },
      { key_name: 'illness_group__body_area', name: 'Body Area' },
      { key_name: 'illness_group__classification', name: 'Classification' },

      {
        key_name: 'general_medical_group',
        name: 'General Medical',
        isGroupOption: true,
      },
      {
        key_name: 'general_medical_group__diagnostic',
        name: 'Diagnostics / Interventions',
      },
    ]);
  });

  it('returns the medical category list without the global categories if excludeGlobalCategories is true', () => {
    expect(getMedicalCategories({ excludeGlobalCategories: true })).toEqual([
      { key_name: 'injury_group', name: 'Injuries', isGroupOption: true },
      { key_name: 'injury_group__pathology', name: 'Pathology' },
      { key_name: 'injury_group__body_area', name: 'Body Area' },
      { key_name: 'injury_group__classification', name: 'Classification' },
      { key_name: 'injury_group__activity', name: 'Activity' },
      { key_name: 'injury_group__session_type', name: 'Session Type' },
      { key_name: 'injury_group__contact_type', name: 'Contact Type' },
      { key_name: 'injury_group__competition', name: 'Competition' },

      { key_name: 'illness_group', name: 'Illnesses', isGroupOption: true },
      { key_name: 'illness_group__pathology', name: 'Pathology' },
      { key_name: 'illness_group__body_area', name: 'Body Area' },
      { key_name: 'illness_group__classification', name: 'Classification' },

      {
        key_name: 'general_medical_group',
        name: 'General Medical',
        isGroupOption: true,
      },
      {
        key_name: 'general_medical_group__diagnostic',
        name: 'Diagnostics / Interventions',
      },
    ]);
  });

  it('returns the medical and injury list without the illnesses category if `excludeIllnesses` is true', () => {
    expect(getMedicalCategories({ excludeIllnesses: true })).toEqual([
      { key_name: 'injury_group', name: 'Injuries', isGroupOption: true },
      {
        key_name: 'injury_group__all_injuries',
        name: 'No. of Injury Occurrences',
      },
      { key_name: 'injury_group__pathology', name: 'Pathology' },
      { key_name: 'injury_group__body_area', name: 'Body Area' },
      { key_name: 'injury_group__classification', name: 'Classification' },
      { key_name: 'injury_group__activity', name: 'Activity' },
      { key_name: 'injury_group__session_type', name: 'Session Type' },
      { key_name: 'injury_group__contact_type', name: 'Contact Type' },
      { key_name: 'injury_group__competition', name: 'Competition' },
      {
        key_name: 'general_medical_group',
        name: 'General Medical',
        isGroupOption: true,
      },
      {
        key_name: 'general_medical_group__diagnostic',
        name: 'Diagnostics / Interventions',
      },
    ]);
  });

  it('returns the medical and injury list without the illnesses category if `excludeClassifications` is true', () => {
    expect(getMedicalCategories({ excludeClassifications: true })).toEqual([
      { key_name: 'injury_group', name: 'Injuries', isGroupOption: true },
      {
        key_name: 'injury_group__all_injuries',
        name: 'No. of Injury Occurrences',
      },
      { key_name: 'injury_group__pathology', name: 'Pathology' },
      { key_name: 'injury_group__body_area', name: 'Body Area' },
      { key_name: 'injury_group__activity', name: 'Activity' },
      { key_name: 'injury_group__session_type', name: 'Session Type' },
      { key_name: 'injury_group__contact_type', name: 'Contact Type' },
      { key_name: 'injury_group__competition', name: 'Competition' },

      { key_name: 'illness_group', name: 'Illnesses', isGroupOption: true },
      {
        key_name: 'illness_group__all_illnesses',
        name: 'No. of Illness Occurrences',
      },
      { key_name: 'illness_group__pathology', name: 'Pathology' },
      { key_name: 'illness_group__body_area', name: 'Body Area' },

      {
        key_name: 'general_medical_group',
        name: 'General Medical',
        isGroupOption: true,
      },
      {
        key_name: 'general_medical_group__diagnostic',
        name: 'Diagnostics / Interventions',
      },
    ]);
  });

  it('returns only the medical global categories if onlyGlobalCategories is true', () => {
    expect(getMedicalCategories({ onlyGlobalCategories: true })).toEqual([
      {
        key_name: 'injury_group__all_injuries',
        name: 'No. of Injury Occurrences',
      },
      {
        key_name: 'illness_group__all_illnesses',
        name: 'No. of Illness Occurrences',
      },
    ]);
  });

  it('returns the medical category list without the general medical categories if excludeGeneralMedical is true', () => {
    expect(getMedicalCategories({ excludeGeneralMedical: true })).toEqual([
      { key_name: 'injury_group', name: 'Injuries', isGroupOption: true },
      {
        key_name: 'injury_group__all_injuries',
        name: 'No. of Injury Occurrences',
      },
      { key_name: 'injury_group__pathology', name: 'Pathology' },
      { key_name: 'injury_group__body_area', name: 'Body Area' },
      { key_name: 'injury_group__classification', name: 'Classification' },
      { key_name: 'injury_group__activity', name: 'Activity' },
      { key_name: 'injury_group__session_type', name: 'Session Type' },
      { key_name: 'injury_group__contact_type', name: 'Contact Type' },
      { key_name: 'injury_group__competition', name: 'Competition' },
      { key_name: 'illness_group', name: 'Illnesses', isGroupOption: true },
      {
        key_name: 'illness_group__all_illnesses',
        name: 'No. of Illness Occurrences',
      },
      { key_name: 'illness_group__pathology', name: 'Pathology' },
      { key_name: 'illness_group__body_area', name: 'Body Area' },
      { key_name: 'illness_group__classification', name: 'Classification' },
    ]);
  });
});

describe('getCategoryDivisionOptions', () => {
  const options = {
    pathology: { id: 'pathology', title: 'Pathology' },
    bodyArea: { id: 'body_area', title: 'Body Area' },
    classification: { id: 'classification', title: 'Classification' },
    activity: { id: 'activity', title: 'Activity' },
    sessionType: { id: 'session_type', title: 'Session Type' },
    contactType: { id: 'contact_type', title: 'Contact Type' },
    competition: { id: 'competition', title: 'Competition' },
  };

  it('returns the correct category division', () => {
    expect(
      getCategoryDivisionOptions({ mainCategory: null, subCategory: null })
    ).toEqual([]);

    expect(
      getCategoryDivisionOptions({
        mainCategory: 'injury',
        subCategory: 'pathology',
      })
    ).toEqual([options.activity, options.sessionType, options.contactType]);

    expect(
      getCategoryDivisionOptions({
        mainCategory: 'injury',
        subCategory: 'body_area',
      })
    ).toEqual([
      options.pathology,
      options.classification,
      options.activity,
      options.sessionType,
      options.contactType,
      options.competition,
    ]);

    expect(
      getCategoryDivisionOptions({
        mainCategory: 'injury',
        subCategory: 'classification',
      })
    ).toEqual([
      options.pathology,
      options.bodyArea,
      options.activity,
      options.sessionType,
      options.contactType,
      options.competition,
    ]);

    expect(
      getCategoryDivisionOptions({
        mainCategory: 'injury',
        subCategory: 'activity',
      })
    ).toEqual([
      options.pathology,
      options.bodyArea,
      options.classification,
      options.contactType,
      options.competition,
    ]);

    expect(
      getCategoryDivisionOptions({
        mainCategory: 'injury',
        subCategory: 'session_type',
      })
    ).toEqual([
      options.pathology,
      options.bodyArea,
      options.classification,
      options.contactType,
      options.competition,
    ]);

    expect(
      getCategoryDivisionOptions({
        mainCategory: 'injury',
        subCategory: 'contact_type',
      })
    ).toEqual([
      options.pathology,
      options.bodyArea,
      options.classification,
      options.activity,
      options.sessionType,
      options.competition,
    ]);

    expect(
      getCategoryDivisionOptions({
        mainCategory: 'illness',
        subCategory: 'pathology',
      })
    ).toEqual([]);

    expect(
      getCategoryDivisionOptions({
        mainCategory: 'illness',
        subCategory: 'body_area',
      })
    ).toEqual([options.pathology, options.classification]);

    expect(
      getCategoryDivisionOptions({
        mainCategory: 'illness',
        subCategory: 'classification',
      })
    ).toEqual([options.pathology, options.bodyArea]);
  });

  it('returns the correct category division for competition', () => {
    expect(
      getCategoryDivisionOptions({
        mainCategory: 'injury',
        subCategory: 'competition',
      })
    ).toEqual([
      options.pathology,
      options.bodyArea,
      options.classification,
      options.activity,
      options.sessionType,
      options.contactType,
    ]);
  });

  it('exclude classifications', () => {
    expect(
      getCategoryDivisionOptions({
        mainCategory: 'injury',
        subCategory: 'competition',
        excludeClassifications: true,
      })
    ).toEqual([
      options.pathology,
      options.bodyArea,
      options.activity,
      options.sessionType,
      options.contactType,
    ]);

    expect(
      getCategoryDivisionOptions({
        mainCategory: 'illness',
        subCategory: 'body_area',
        excludeClassifications: true,
      })
    ).toEqual([options.pathology]);

    expect(
      getCategoryDivisionOptions({
        mainCategory: 'injury',
        subCategory: 'contact_type',
        excludeClassifications: true,
      })
    ).toEqual([
      options.pathology,
      options.bodyArea,
      options.activity,
      options.sessionType,
      options.competition,
    ]);

    expect(
      getCategoryDivisionOptions({
        mainCategory: 'injury',
        subCategory: 'session_type',
        excludeClassifications: true,
      })
    ).toEqual([
      options.pathology,
      options.bodyArea,
      options.contactType,
      options.competition,
    ]);

    expect(
      getCategoryDivisionOptions({
        mainCategory: 'injury',
        subCategory: 'contact_type',
        excludeClassifications: true,
      })
    ).toEqual([
      options.pathology,
      options.bodyArea,
      options.activity,
      options.sessionType,
      options.competition,
    ]);

    expect(
      getCategoryDivisionOptions({
        mainCategory: 'injury',
        subCategory: 'body_area',
        excludeClassifications: true,
      })
    ).toEqual([
      options.pathology,
      options.activity,
      options.sessionType,
      options.contactType,
      options.competition,
    ]);
  });
});

describe('formatFilterNames', () => {
  it('returns the list of filters names', () => {
    expect(formatFilterNames(null)).toEqual(null);

    expect(
      formatFilterNames({ time_loss: [], session_type: [], competitions: [] })
    ).toEqual(null);

    expect(
      formatFilterNames({
        time_loss: ['Time-loss'],
        session_type: [],
        competitions: [],
      })
    ).toEqual('Time-loss');

    expect(
      formatFilterNames({
        time_loss: ['Time-loss', 'Non Time-loss'],
        session_type: [],
        competitions: [],
      })
    ).toEqual('Time-loss, Non Time-loss');

    expect(
      formatFilterNames({
        time_loss: ['Time-loss'],
        session_type: [],
        competitions: [],
      })
    ).toEqual('Time-loss');

    expect(
      formatFilterNames({
        time_loss: [],
        session_type: ['Gym Session'],
        competitions: [],
      })
    ).toEqual('Gym Session');

    expect(
      formatFilterNames({
        time_loss: ['Time-loss', 'Non Time-loss'],
        session_type: ['Gym Session', 'Training'],
        competitions: ['Champtions League'],
      })
    ).toEqual(
      'Time-loss, Non Time-loss | Gym Session, Training | Champtions League'
    );
  });
});

describe('getFullMedicalCategoryName', () => {
  it('returns the full medical category name', () => {
    expect(getFullMedicalCategoryName('body_area', 'illness')).toEqual(
      'Illness - Body Area'
    );
    expect(getFullMedicalCategoryName('body_area', 'injury')).toEqual(
      'Injury - Body Area'
    );
    expect(getFullMedicalCategoryName('all_injuries', 'injury')).toEqual(
      'Injury - No. of Injury Occurrences'
    );
    expect(getFullMedicalCategoryName('all_illnesses', 'illness')).toEqual(
      'Illness - No. of Illness Occurrences'
    );
    expect(
      getFullMedicalCategoryName('body_area', 'illness', 'pathology')
    ).toEqual('Illness - Body Area & Pathology');

    expect(
      getFullMedicalCategoryName('body_area', 'illness', 'pathology', {
        time_loss: ['Non Time-loss'],
        session_type: ['Game'],
        competitions: ['Champtions League'],
      })
    ).toEqual(
      'Illness - Body Area & Pathology (Non Time-loss | Game | Champtions League)'
    );
  });
});

describe('getMedicalCategoryName', () => {
  it('returns the medical category name', () => {
    expect(getMedicalCategoryName('body_area')).toEqual('Body Area');
  });
});

describe('getGraphTitles', () => {
  let graphData;

  beforeEach(() => {
    graphData = {
      graphGroup: 'summary_bar',
      metrics: [
        {
          status: {
            name: 'Sleep Duration',
            localised_unit: 'hr',
            summary: 'min',
          },
          series: [
            {
              fullname: 'Left Wingers',
              color: 'red',
              seriesData: [
                [1512640002000, 7],
                [1519897602000, 13],
              ],
            },
          ],
        },
        {
          status: {
            name: 'Hip Mobility',
            localised_unit: 'cm',
            summary: 'mean',
          },
          series: [
            {
              fullname: 'Frank Jones',
              color: 'blue',
              seriesData: [
                [1512640002000, 7],
                [1519897602000, 13],
              ],
            },
          ],
        },
      ],
      date_range: {
        start_date: '2017-10-15 00:00:00',
        end_date: '2017-12-08 00:00:00',
      },
      time_period: 'this_in_season',
      name: null,
    };
  });

  describe('when graphGroup is summary_bar', () => {
    it('returns the correct titles', () => {
      const expectedTitle = [
        { title: 'Sleep Duration', unit: 'hr' },
        { title: 'Hip Mobility', unit: 'cm' },
      ];
      expect(getGraphTitles(graphData)).toEqual(expectedTitle);
    });
  });

  describe('when graphGroup is summary_stack_bar', () => {
    beforeEach(() => {
      graphData.graphGroup = 'summary_stack_bar';
    });

    it('returns the correct titles', () => {
      const expectedTitle = [
        { title: 'Sleep Duration', unit: 'hr' },
        { title: 'Hip Mobility', unit: 'cm' },
      ];
      expect(getGraphTitles(graphData)).toEqual(expectedTitle);
    });
  });

  describe('when graphGroup is summary', () => {
    beforeEach(() => {
      graphData.graphGroup = 'summary';
      graphData.metrics = [
        {
          name: 'Fatigue',
        },
        {
          name: 'Groin Squeeze',
        },
        { name: 'Hip Mobility - Left' },
      ];
    });

    it('returns the correct titles', () => {
      expect(getGraphTitles(graphData)).toEqual([
        { title: 'Fatigue', unit: null },
        { title: 'Groin Squeeze', unit: null },
        { title: 'Hip Mobility - Left', unit: null },
      ]);
    });
  });

  describe('when graphGroup is summary_donut', () => {
    beforeEach(() => {
      graphData.graphGroup = 'summary_donut';
      graphData.metrics = [
        {
          type: 'medical',
          main_category: 'illness',
          category: 'all_illnesses',
          measurement_type: 'percentage',
          squad_selection: {
            athletes: [],
            positions: [71],
            position_groups: [],
            applies_to_squad: false,
          },
          series: [
            {
              name: 'Entire Squad',
              datapoints: [
                {
                  name: 'Ankle',
                  y: 10,
                },
                {
                  name: 'Foot',
                  y: 3,
                },
              ],
            },
          ],
        },
      ];
    });

    it('returns the correct titles', () => {
      const expectedTitle = [
        {
          title: getFullMedicalCategoryName(
            graphData.metrics[0].category,
            graphData.metrics[0].main_category
          ),
          unit: null,
        },
      ];
      expect(getGraphTitles(graphData)).toEqual(expectedTitle);
    });
  });
});

describe('formatGraphTitlesToString', () => {
  let graphData;
  let graphTitlesResult;

  beforeEach(() => {
    graphData = {
      graphGroup: 'summary_bar',
      metrics: [
        {
          status: {
            name: 'Sleep Duration',
            localised_unit: 'hr',
            summary: 'min',
          },
          series: [
            {
              fullname: 'Left Wingers',
              color: 'red',
              seriesData: [
                [1512640002000, 7],
                [1519897602000, 13],
              ],
            },
          ],
        },
        {
          status: {
            name: 'Hip Mobility',
            localised_unit: 'cm',
            summary: 'mean',
          },
          series: [
            {
              fullname: 'Frank Jones',
              color: 'blue',
              seriesData: [
                [1512640002000, 7],
                [1519897602000, 13],
              ],
            },
          ],
        },
      ],
      date_range: {
        start_date: '2017-10-15 00:00:00',
        end_date: '2017-12-08 00:00:00',
      },
      time_period: 'this_in_season',
      name: null,
    };
  });

  describe('when the graph has titles', () => {
    it('returns the correct titles', () => {
      graphTitlesResult = getGraphTitles(graphData);
      expect(formatGraphTitlesToString(graphTitlesResult)).toEqual(
        'Sleep Duration (hr) - Hip Mobility (cm)'
      );
    });

    it('returns the correct title if metric.unit and metric.title exist', () => {
      graphData = {
        graphGroup: 'summary_bar',
        metrics: [
          {
            status: {
              name: 'Sleep Duration',
              localised_unit: 'hr',
            },
          },
          {
            status: {
              name: 'Body Weight',
              localised_unit: 'Kg',
            },
          },
        ],
      };
      graphTitlesResult = getGraphTitles(graphData);
      expect(formatGraphTitlesToString(graphTitlesResult)).toEqual(
        'Sleep Duration (hr) - Body Weight (Kg)'
      );
    });

    it('returns the correct title if metric.unit does not exit but metric.title does exit', () => {
      graphData = {
        graphGroup: 'summary_bar',
        metrics: [
          {
            status: {
              name: 'Sleep Duration',
              localised_unit: null,
            },
          },
          {
            status: {
              name: 'Body Weight',
              localised_unit: null,
            },
          },
        ],
      };
      graphTitlesResult = getGraphTitles(graphData);
      expect(formatGraphTitlesToString(graphTitlesResult)).toEqual(
        'Sleep Duration - Body Weight'
      );
    });

    it('returns an empty string if neither metric.unit or metric.title exit', () => {
      graphData = {
        graphGroup: 'summary_bar',
        metrics: [],
      };
      graphTitlesResult = getGraphTitles(graphData);
      expect(formatGraphTitlesToString(graphTitlesResult)).toEqual('');
    });
  });

  describe('when the graph does not have titles', () => {
    beforeEach(() => {
      graphTitlesResult = [];
    });

    it('returns the correct titles', () => {
      expect(formatGraphTitlesToString(graphTitlesResult)).toEqual('');
    });
  });

  describe('getVenueShorthand', () => {
    it('returns H if venueType is Home', () => {
      expect(getVenueShorthand('Home')).toEqual('H');
    });
    it('returns A if venueType is Away', () => {
      expect(getVenueShorthand('Away')).toEqual('A');
    });
    it('returns N if venueType is neither Home or Away', () => {
      expect(getVenueShorthand('Neutral')).toEqual('N');
      expect(getVenueShorthand('Belgium')).toEqual('N');
    });
  });

  describe('formatScore', () => {
    it('returns opponent score first if venueType is Away', () => {
      const game = {
        date: '2019-04-24T23:00:00Z',
        id: 1234,
        opponent_score: '2',
        opponent_team_name: 'Opponent Team',
        score: '0',
        team_name: 'Kitman',
        venue_type_name: 'Away',
      };
      expect(formatScore(game, 'Away')).toEqual('2 - 0');
    });
    it('returns own score first if venueType is Home', () => {
      const game = {
        date: '2019-04-24T23:00:00Z',
        id: 1234,
        opponent_score: '2',
        opponent_team_name: 'Opponent Team',
        score: '0',
        team_name: 'Kitman',
        venue_type_name: 'Home',
      };
      expect(formatScore(game, 'Home')).toEqual('0 - 2');
    });
    it('returns own score first if venueType is not Away or Home', () => {
      const game = {
        date: '2019-04-24T23:00:00Z',
        id: 1234,
        opponent_score: '2',
        opponent_team_name: 'Opponent Team',
        score: '0',
        team_name: 'Kitman',
        venue_type_name: 'Home',
      };
      expect(formatScore(game, 'Home')).toEqual('0 - 2');
    });
  });

  describe('getEventsDetails when the standard-date-formatting flag is off', () => {
    beforeEach(() => {
      moment.tz.setDefault('UTC');
      window.featureFlags['standard-date-formatting'] = false;
    });

    afterEach(() => {
      moment.tz.setDefault();
    });

    it('returns the correct details if the eventType is game', () => {
      const selectedGames = [
        {
          date: '2019-04-24T23:00:00Z',
          id: 1234,
          opponent_score: '2',
          opponent_team_name: 'Opponent Team',
          score: '0',
          team_name: 'Kitman',
          venue_type_name: 'Home',
        },
        {
          date: '2019-04-25T23:00:00Z',
          id: 5678,
          opponent_score: '10',
          opponent_team_name: 'Opponent Team',
          score: '3',
          team_name: 'Kitman',
          venue_type_name: 'Away',
        },
      ];
      expect(getEventsDetails('game', selectedGames, [])).toEqual(
        '24 Apr 2019 - Opponent Team (H) 0 - 2 | 25 Apr 2019 - Opponent Team (A) 10 - 3'
      );
    });

    it('returns the correct details if the eventType is training_session', () => {
      const selectedTrainingSessions = [
        {
          date: '2019-04-24T23:00:00Z',
          duration: 100,
          id: 1234,
          session_type_name: 'Training',
        },
        {
          date: '2019-04-25T23:00:00Z',
          duration: 40,
          id: 5678,
          session_type_name: 'Training',
        },
      ];
      expect(
        getEventsDetails('training_session', [], selectedTrainingSessions)
      ).toEqual(
        'Wed, 24 Apr 2019 (11:00 pm) - Training (100 mins) | Thu, 25 Apr 2019 (11:00 pm) - Training (40 mins)'
      );
    });
  });

  describe('getEventsDetails when the standard-date-formatting flag is on', () => {
    beforeEach(() => {
      moment.tz.setDefault('UTC');
      window.featureFlags['standard-date-formatting'] = true;
    });

    afterEach(() => {
      moment.tz.setDefault();
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('returns the correct details if the eventType is game', () => {
      const selectedGames = [
        {
          date: '2019-04-24T23:00:00Z',
          id: 1234,
          opponent_score: '2',
          opponent_team_name: 'Opponent Team',
          score: '0',
          team_name: 'Kitman',
          venue_type_name: 'Home',
        },
        {
          date: '2019-04-25T23:00:00Z',
          id: 5678,
          opponent_score: '10',
          opponent_team_name: 'Opponent Team',
          score: '3',
          team_name: 'Kitman',
          venue_type_name: 'Away',
        },
      ];
      expect(getEventsDetails('game', selectedGames, [])).toEqual(
        'Apr 24, 2019 - Opponent Team (H) 0 - 2 | Apr 25, 2019 - Opponent Team (A) 10 - 3'
      );
    });

    it('returns the correct details if the eventType is training_session', () => {
      const selectedTrainingSessions = [
        {
          date: '2019-04-24T23:00:00Z',
          duration: 100,
          id: 1234,
          session_type_name: 'Training',
        },
        {
          date: '2019-04-25T23:00:00Z',
          duration: 40,
          id: 5678,
          session_type_name: 'Training',
        },
      ];
      expect(
        getEventsDetails('training_session', [], selectedTrainingSessions)
      ).toEqual(
        'Apr 24, 2019 11:00 PM - Training (100 mins) | Apr 25, 2019 11:00 PM - Training (40 mins)'
      );
    });
  });

  describe('getMetricName', () => {
    it('returns the correct metric name when the metric object contains the metric name', () => {
      const metric = {
        name: 'Metric Name',
      };
      expect(getMetricName(metric)).toEqual('Metric Name');
    });

    it('returns the correct metric name when the metric type is metric', () => {
      const metric = {
        type: 'metric',
        status: {
          name: 'Metric name',
        },
      };
      expect(getMetricName(metric)).toEqual('Metric name');
    });

    it('returns the correct metric name when the metric type is medical', () => {
      const metric = {
        type: 'medical',
        main_category: 'injury',
        category: 'pathology',
        category_division: 'session_type',
      };
      expect(getMetricName(metric)).toEqual(
        'Injury - Pathology & Session Type'
      );
    });
  });

  describe('isDrillGraph', () => {
    describe('If the graph group is not summary', () => {
      it('returns true when the event type is game', () => {
        const graphDataGameEvent = {
          metrics: [
            {
              status: {
                event_type_time_period: 'game',
              },
            },
          ],
        };
        expect(isDrillGraph(graphDataGameEvent)).toEqual(true);
      });

      it('returns true when the event type is training_session', () => {
        const graphDataTrainingSessionEvent = {
          metrics: [
            {
              status: {
                event_type_time_period: 'training_session',
              },
            },
          ],
        };
        expect(isDrillGraph(graphDataTrainingSessionEvent)).toEqual(true);
      });

      it('returns false when there is no event type', () => {
        const graphDataNoEvent = {
          metrics: [
            {
              status: {
                event_type_time_period: null,
              },
            },
          ],
        };
        expect(isDrillGraph(graphDataNoEvent)).toEqual(false);
      });
    });

    describe('If the graph group is summary', () => {
      it('returns true when the event type is game', () => {
        const graphDataGameEvent = {
          graphGroup: 'summary',
          series: [
            {
              event_type_time_period: 'game',
            },
          ],
        };
        expect(isDrillGraph(graphDataGameEvent)).toEqual(true);
      });

      it('returns true when the event type is training_session', () => {
        const graphDataTrainingSessionEvent = {
          graphGroup: 'summary',
          series: [
            {
              event_type_time_period: 'training_session',
            },
          ],
        };
        expect(isDrillGraph(graphDataTrainingSessionEvent)).toEqual(true);
      });

      it('returns false when there is no event type', () => {
        const graphDataNoEvent = {
          graphGroup: 'summary',
          series: [
            {
              event_type_time_period: null,
            },
          ],
        };
        expect(isDrillGraph(graphDataNoEvent)).toEqual(false);
      });
    });
  });

  describe('buildEventTypeTimePeriodSelectOptions', () => {
    const defaultOptions = [
      {
        label: 'Rolling Period',
        options: [
          { label: 'Last (x) Period', value: 'last_x_days' },
          { label: 'Today', value: 'today' },
          { label: 'Yesterday', value: 'yesterday' },
          { label: 'This Week', value: 'this_week' },
          { label: 'Last Week', value: 'last_week' },
        ],
      },
      {
        label: 'Season',
        options: [
          { label: 'This Season So Far', value: 'this_season_so_far' },
          { label: 'This Season', value: 'this_season' },
          { label: 'This Pre-season', value: 'this_pre_season' },
          { label: 'This In-season', value: 'this_in_season' },
        ],
      },
      {
        label: 'Set Period',
        options: [{ label: 'Custom Date Range', value: 'custom_date_range' }],
      },
    ];
    it('returns correct items when pivoted', () => {
      expect(buildEventTypeTimePeriodSelectOptions(true)).toEqual(
        defaultOptions
      );
    });

    it('returns correct options when not pivoted', () => {
      expect(buildEventTypeTimePeriodSelectOptions(false)).toEqual([
        {
          label: 'Sessions',
          options: [
            { label: 'Game', value: 'game' },
            { label: 'Training Session', value: 'training_session' },
          ],
        },
        ...defaultOptions,
      ]);
    });

    it('returns events options when withEvents flag is true', () => {
      expect(buildEventTypeTimePeriodSelectOptions(false, true)).toEqual([
        {
          label: 'Events',
          options: [{ label: 'Last (x) Events', value: 'last_x_events' }],
        },
        {
          label: 'Sessions',
          options: [
            { label: 'Game', value: 'game' },
            { label: 'Training Session', value: 'training_session' },
          ],
        },
        ...defaultOptions,
      ]);
    });
    it('returns games and sessions options when withGamesAndSession flag is true', () => {
      expect(buildEventTypeTimePeriodSelectOptions(false, false, true)).toEqual(
        [
          {
            label: 'Events',
            options: [
              {
                label: 'Last (x) Games/Sessions',
                value: EVENT_TIME_PERIODS.lastXGamesAndSessions,
              },
              {
                label: 'Last (x) Games',
                value: EVENT_TIME_PERIODS.lastXGames,
              },
              {
                label: 'Last (x) Sessions',
                value: EVENT_TIME_PERIODS.lastXSessions,
              },
            ],
          },
          {
            label: 'Sessions',
            options: [
              { label: 'Game', value: 'game' },
              { label: 'Training Session', value: 'training_session' },
            ],
          },
          ...defaultOptions,
        ]
      );
    });
  });

  describe('getPeriodName', () => {
    it('returns last 5 events when last_x_events and time period supplied', () => {
      expect(getPeriodName('last_x_events', {}, 6)).toEqual('Last 6 events');
    });

    it('returns a value from the getTimePeriodName for other time period', () => {
      expect(getPeriodName('this_week', {})).toEqual('This Week');
    });

    it('returns last 5 - 10 events when period is last_x_events and offset is supplied', () => {
      expect(getPeriodName('last_x_events', {}, 5, 5)).toEqual(
        'Last 5 - 10 events'
      );
    });
  });
});

describe('convertDataSourceToInputs', () => {
  it('converts dataSource', () => {
    const dataSource = structuredClone(
      formulaColumnServerResponse.table_element.data_source
    );
    expect(convertDataSourceToInputs(dataSource)).toEqual(
      CONVERTED_FORMULA_DATASOURCE
    );
  });

  it('converts dataSource with ParticipationLevel', () => {
    const dataSource = structuredClone(
      formulaColumnServerResponse.table_element.data_source
    );

    dataSource.A.data_source_type = 'ParticipationLevel';
    dataSource.A.input_params.ids = [1, 2, 3];

    expect(convertDataSourceToInputs(dataSource)).toEqual({
      A: {
        ...CONVERTED_FORMULA_DATASOURCE.A,
        dataSource: {
          ...CONVERTED_FORMULA_DATASOURCE.A.dataSource,
          ids: [1, 2, 3],
          status: 'participation_levels',
          type: 'ParticipationLevel',
        },
        panel_source: 'participation',
      },
      B: CONVERTED_FORMULA_DATASOURCE.B,
    });
  });
});

describe('processDataToAddMissingValues', () => {
  const processDataForTest = (data) => [
    {
      chart: data,
    },
  ];
  it('adds missing values', () => {
    expect(
      processDataToAddMissingValues(
        processDataForTest([
          {
            label: 'category',
            values: [
              { label: 'first', value: 1 },
              { label: 'second', value: 2 },
              { label: 'third', value: 3 },
            ],
          },
          {
            label: 'category 2',
            values: [
              { label: 'first', value: 1 },
              // missing value here for "second"
              { label: 'third', value: 3 },
            ],
          },
        ])
      )
    ).toEqual(
      processDataForTest([
        {
          label: 'category',
          values: [
            { label: 'first', value: 1 },
            { label: 'second', value: 2 },
            { label: 'third', value: 3 },
          ],
        },
        {
          label: 'category 2',
          values: [
            { label: 'first', value: 1 },
            { label: 'second', value: null },
            { label: 'third', value: 3 },
          ],
        },
      ])
    );
  });

  it('doesnt modify values when no groups apply', () => {
    expect(
      processDataToAddMissingValues(
        processDataForTest([
          { label: 'first', value: 1 },
          { label: 'second', value: 2 },
          { label: 'third', value: 3 },
        ])
      )
    ).toEqual(
      processDataForTest([
        { label: 'first', value: 1 },
        { label: 'second', value: 2 },
        { label: 'third', value: 3 },
      ])
    );
  });

  it('doesnt modify values when value vis widgets', () => {
    expect(
      processDataToAddMissingValues(processDataForTest([{ value: 1 }]))
    ).toEqual(processDataForTest([{ value: 1 }]));
  });

  it('handles undefined chart property', () => {
    const dataWithUndefinedChart = [{}];

    expect(processDataToAddMissingValues(dataWithUndefinedChart)).toEqual([
      {
        chart: [],
      },
    ]);
  });
});

describe('getMatchingFormulaId', () => {
  it('returns the correct formula ID for a matching formula expression', () => {
    const formulaExpression = '(A/B)*100';
    const result = getMatchingFormulaId(formulaExpression);
    expect(result).toBe(1);
  });

  it('returns undefined if no formula matches the given expression', () => {
    const formulaExpression = '(C/D)*100';
    const result = getMatchingFormulaId(formulaExpression);
    expect(result).toBeUndefined();
  });
});

describe('getPopulationKeys', () => {
  it('should return keys with non-empty arrays', () => {
    const population = {
      athletes: ['athlete1', 'athlete2'],
      squads: [],
      labels: ['test'],
    };

    const result = getPopulationKeys(population);

    expect(result).toEqual(['athletes', 'labels']);
  });

  it('should filter out non-array values', () => {
    const population = {
      athletes: ['athlete1', 'athlete2'],
      squads: [],
      labels: ['test'],
      segments: null,
      context: undefined,
    };

    const result = getPopulationKeys(population);

    expect(result).toEqual(['athletes', 'labels']);
  });
});
