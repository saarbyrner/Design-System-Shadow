import {
  getWidgetRowPanel,
  getWidgetColumnPanel,
  getPanelFactory,
  getPanelDataSourceFactory,
  getPanelSubtypeValueFactory,
  getPanelCalculationParamFactory,
} from '../panel';

describe('analyticalDashboard - tableWidgetSelectors selectors', () => {
  const state = {
    tableWidget: {
      columnPanel: {
        calculation: '',
        columnId: null,
        dataSource: {
          type: 'TableMetric',
        },
        isEditMode: false,
        name: '',
        population: {
          applies_to_squad: false,
          position_groups: [],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
        },
        time_scope: {
          time_period: '',
          start_time: undefined,
          end_time: undefined,
          time_period_length: undefined,
          time_period_length_offset: undefined,
        },
        requestStatus: {
          status: 'dormant',
          data: {},
        },
        filters: {
          time_loss: [],
          session_type: [],
          competitions: [],
          event_types: [],
          training_session_types: [],
        },
      },
      rowPanel: {
        calculation: '',
        isEditMode: false,
        rowId: null,
        dataSource: {
          type: 'TableMetric',
        },
        population: {
          applies_to_squad: false,
          position_groups: [],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
        },
        time_scope: {
          time_period: '',
          start_time: undefined,
          end_time: undefined,
          time_period_length: undefined,
          time_period_length_offset: undefined,
        },
        isLoading: false,
        requestStatus: {
          status: 'dormant',
          data: {},
        },
        filters: {
          time_loss: [],
          session_type: [],
          competitions: [],
          event_types: [],
          training_session_types: [],
        },
      },
    },
  };

  describe('getWidgetRowPanel', () => {
    it('returns the rowPanel', () => {
      expect(getWidgetRowPanel(state)).toEqual(state.tableWidget.rowPanel);
    });
  });

  describe('getWidgetColumnPanel', () => {
    it('returns the columnPanel', () => {
      expect(getWidgetColumnPanel(state)).toEqual(
        state.tableWidget.columnPanel
      );
    });
  });

  describe('getPanelFactory', () => {
    it('returns the rowPanel', () => {
      const selector = getPanelFactory('row');

      expect(selector(state)).toEqual(state.tableWidget.rowPanel);
    });

    it('returns the columnPanel', () => {
      const selector = getPanelFactory('column');

      expect(selector(state)).toEqual(state.tableWidget.columnPanel);
    });
  });

  describe('getPanelDataSourceFactory', () => {
    it('returns the rowPanel dataSource', () => {
      const selector = getPanelDataSourceFactory('row');

      expect(selector(state)).toEqual(state.tableWidget.rowPanel.dataSource);
    });

    it('returns the columnPanel dataSource', () => {
      const selector = getPanelDataSourceFactory('column');

      expect(selector(state)).toEqual(state.tableWidget.columnPanel.dataSource);
    });
  });

  describe('getPanelSubtypeValueFactory', () => {
    const updatedState = {
      tableWidget: {
        ...state.tableWidget,
        columnPanel: {
          ...state.tableWidget.columnPanel,
          dataSource: {
            ...state.tableWidget.columnPanel.dataSource,
            subtypes: {
              activity_group_ids: [1, 2, 3],
              exercise_ids: [11, 12, 13],
            },
          },
        },
        rowPanel: {
          ...state.tableWidget.rowPanel,
          dataSource: {
            ...state.tableWidget.rowPanel.dataSource,
            subtypes: {
              activity_group_ids: [2, 4, 6],
              exercise_ids: [12, 14, 16],
            },
          },
        },
      },
    };

    it('returns a default value for subtype that does not exist on state', () => {
      const recurrenceSelector = getPanelSubtypeValueFactory(
        'row',
        'recurrence'
      );
      const pathologySelector = getPanelSubtypeValueFactory(
        'row',
        'osics_pathology_ids'
      );

      expect(recurrenceSelector(updatedState)).toEqual(null);
      expect(pathologySelector(updatedState)).toEqual([]);
    });

    it('returns the rowPanel dataSource subtype value', () => {
      const selector = getPanelSubtypeValueFactory('row', 'activity_group_ids');

      expect(selector(updatedState)).toEqual([2, 4, 6]);
    });

    it('returns the columnPanel dataSource', () => {
      const selector = getPanelSubtypeValueFactory(
        'column',
        'activity_group_ids'
      );

      expect(selector(updatedState)).toEqual([1, 2, 3]);
    });

    it('returns the rowPanel dataSource subtype exercise_ids value', () => {
      const selector = getPanelSubtypeValueFactory('row', 'exercise_ids');

      expect(selector(updatedState)).toEqual([12, 14, 16]);
    });

    it('returns the columnPanel dataSource exercise_ids', () => {
      const selector = getPanelSubtypeValueFactory('column', 'exercise_ids');

      expect(selector(updatedState)).toEqual([11, 12, 13]);
    });
  });

  describe('getPanelCalculationParamFactory', () => {
    const updatedState = {
      tableWidget: {
        ...state.tableWidget,
        columnPanel: {
          ...state.tableWidget.columnPanel,
          calculation_params: {
            time_period_length: 7,
          },
        },
        rowPanel: {
          ...state.tableWidget.rowPanel,
          calculation_params: {
            comparative_period: 4,
          },
        },
      },
    };

    it('returns a null for subtype that does not exist on state', () => {
      const evaluatedPeriodSelector = getPanelCalculationParamFactory(
        'row',
        'evaluated_period'
      );
      const timePeriodSelector = getPanelCalculationParamFactory(
        'row',
        'time_period'
      );

      expect(evaluatedPeriodSelector(updatedState)).toEqual(null);
      expect(timePeriodSelector(updatedState)).toEqual(null);
    });

    it('returns the rowPanel calculationParam value', () => {
      const selector = getPanelCalculationParamFactory(
        'row',
        'comparative_period'
      );

      expect(selector(updatedState)).toEqual(4);
    });

    it('returns the columnPanel calculationParam', () => {
      const selector = getPanelCalculationParamFactory(
        'column',
        'time_period_length'
      );

      expect(selector(updatedState)).toEqual(7);
    });
  });
});
