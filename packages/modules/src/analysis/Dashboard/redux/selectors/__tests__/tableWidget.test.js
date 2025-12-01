import {
  getTableContainerByWidgetId,
  getTableContainerByIdFactory,
  getTableColumnByIdFactory,
  getTableColumnsByWidgetId,
  getTableRowsByTableContainerIdFactory,
  getColumnConfigByColumnIdFactory,
  getDuplicateColumn,
  getDuplicateColumnError,
  getDuplicateColumnLoading,
  isColumnDuplicating,
  hasColumnErroredDuplicting,
  getColumnTypeFactory,
  getTableSortOrderFactory,
  getTableSortColumnIdFactory,
  getTableRowByIdFactory,
  getTableColumnsByTableContainerIdFactory,
} from '../tableWidget';
// eslint-disable-next-line jest/no-mocks-import
import { SCORECARD_WIDGET_MOCK } from '../../__mocks__/tableWidget';

describe('analyticalDashboard - tableWidgetSelectors selectors', () => {
  const state = {
    tableWidget: {
      duplicateColumn: {
        error: [],
        loading: [],
      },
    },
  };

  describe('getTableContainerByIdFactory() selector', () => {
    it('returns the table container object when supplied a table container id', () => {
      const testState = {
        ...state,
        dashboard: {
          widgets: [
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 9,
              widget: {},
              widget_render: {},
              widget_type: 'header',
            },
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 10,
              widget: {
                id: 902,
                name: 'Test: Comparison Table dsdsd',
                table_container: {
                  id: 123,
                  config: { table_type: 'COMPARISON', show_summary: true },
                  definitions: [],
                  columns: [],
                  population: {
                    athletes: [],
                    positions: [],
                    position_groups: [],
                    squads: [],
                    applies_to_squad: true,
                    all_squads: false,
                  },
                  table_metrics: [],
                  time_scopes: [],
                },
              },
              widget_render: {},
              widget_type: 'table',
            },
          ],
        },
      };
      const selector = getTableContainerByIdFactory(123);
      const selectedState = selector(testState);

      expect(selectedState).toStrictEqual(
        testState.dashboard.widgets[1].widget.table_container
      );
    });
  });

  describe('getTableContainerByWidgetId() selector', () => {
    it('returns the table container object when supplied a widget id', () => {
      const testState = {
        ...state,
        dashboard: {
          widgets: [
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 9,
              widget: {},
              widget_render: {},
              widget_type: 'header',
            },
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 10,
              widget: {
                id: 902,
                name: 'Test: Comparison Table dsdsd',
                table_container: {
                  id: 123,
                  config: { table_type: 'COMPARISON', show_summary: true },
                  definitions: [],
                  columns: [],
                  population: {
                    athletes: [],
                    positions: [],
                    position_groups: [],
                    squads: [],
                    applies_to_squad: true,
                    all_squads: false,
                  },
                  table_metrics: [],
                  time_scopes: [],
                },
              },
              widget_render: {},
              widget_type: 'table',
            },
          ],
        },
      };
      const selectedState = getTableContainerByWidgetId(testState, 10);

      expect(selectedState).toStrictEqual(
        testState.dashboard.widgets[1].widget.table_container
      );
    });
  });

  describe('getTableColumnsByWidgetId() selector', () => {
    it('returns table columns when given a widget id', () => {
      const testState = {
        ...state,
        dashboard: {
          widgets: [
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 9,
              widget: {},
              widget_render: {},
              widget_type: 'header',
            },
            SCORECARD_WIDGET_MOCK,
          ],
        },
      };

      const selectedState = getTableColumnsByWidgetId(testState, 42612);
      expect(selectedState).toStrictEqual(
        SCORECARD_WIDGET_MOCK.widget.table_container.columns
      );
    });
  });

  describe('getTableRowsByTableContainerIdFactory() selector', () => {
    it('returns table rows when given a container id', () => {
      const testState = {
        ...state,
        dashboard: {
          widgets: [
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 9,
              widget: {},
              widget_render: {},
              widget_type: 'header',
            },
            SCORECARD_WIDGET_MOCK,
          ],
        },
      };

      const selector = getTableRowsByTableContainerIdFactory(1968);
      const selectedState = selector(testState);

      expect(selectedState).toStrictEqual(
        SCORECARD_WIDGET_MOCK.widget.table_container.rows
      );
    });
  });

  describe('getTableColumnsByTableContainerIdFactory() selector', () => {
    it('returns table columns when given a container id', () => {
      const testState = {
        ...state,
        dashboard: {
          widgets: [
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 9,
              widget: {},
              widget_render: {},
              widget_type: 'header',
            },
            SCORECARD_WIDGET_MOCK,
          ],
        },
      };

      const selector = getTableColumnsByTableContainerIdFactory(1968);
      const selectedState = selector(testState);

      expect(selectedState).toStrictEqual(
        SCORECARD_WIDGET_MOCK.widget.table_container.columns
      );
    });
  });

  describe('getTableColumnByIdFactory() selector', () => {
    it('returns table columns when given a column id', () => {
      const testState = {
        ...state,
        dashboard: {
          widgets: [
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 9,
              widget: {},
              widget_render: {},
              widget_type: 'header',
            },
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 10,
              widget: {
                id: 902,
                name: 'Test: Comparison Table dsdsd',
                table_container: {
                  id: 123,
                  config: { table_type: 'COMPARISON', show_summary: true },
                  definitions: [],
                  columns: [
                    {
                      id: 3026,
                      name: 'aBJ (cm)',
                      population: null,
                      config: null,
                      metric: {
                        key_name: 'kitman:tv|bj',
                        unit: 'cm',
                      },
                      time_scope: {
                        time_period: 'this_week',
                        start_time: null,
                        end_time: null,
                        time_period_length: null,
                        time_period_length_offset: null,
                      },
                      summary: 'mean',
                      order: 1,
                    },
                    {
                      id: 3029,
                      name: 'CounterMovement',
                      population: null,
                      config: {
                        pivot_locked: true,
                      },
                      metric: {
                        key_name:
                          'combination|countermovement_jump_minus_body_weight_lbs',
                        unit: '',
                      },
                      time_scope: {
                        time_period: 'this_season',
                        start_time: null,
                        end_time: null,
                        time_period_length: null,
                        time_period_length_offset: null,
                      },
                      summary: 'sum',
                      order: 5,
                    },
                  ],
                  population: {
                    athletes: [],
                    positions: [],
                    position_groups: [],
                    squads: [],
                    applies_to_squad: true,
                    all_squads: false,
                  },
                  table_metrics: [],
                  time_scopes: [],
                },
              },
              widget_render: {},
              widget_type: 'table',
            },
          ],
        },
      };
      const selector = getTableColumnByIdFactory(3029);

      const selectedState = selector(testState);
      expect(selectedState).toStrictEqual(
        testState.dashboard.widgets[1].widget.table_container.columns[1]
      );
    });
  });

  describe('getColumnConfigByColumnIdFactory() selector', () => {
    it('returns table column config when given a column id', () => {
      const testState = {
        ...state,
        dashboard: {
          widgets: [
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 9,
              widget: {},
              widget_render: {},
              widget_type: 'header',
            },
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 10,
              widget: {
                id: 902,
                name: 'Test: Comparison Table dsdsd',
                table_container: {
                  id: 123,
                  config: { table_type: 'COMPARISON', show_summary: true },
                  definitions: [],
                  columns: [
                    {
                      id: 3026,
                      name: 'aBJ (cm)',
                      population: null,
                      config: null,
                      metric: {
                        key_name: 'kitman:tv|bj',
                        unit: 'cm',
                      },
                      time_scope: {
                        time_period: 'this_week',
                        start_time: null,
                        end_time: null,
                        time_period_length: null,
                        time_period_length_offset: null,
                      },
                      summary: 'mean',
                      order: 1,
                    },
                    {
                      id: 3029,
                      name: 'CounterMovement',
                      population: null,
                      config: {
                        pivot_locked: true,
                      },
                      metric: {
                        key_name:
                          'combination|countermovement_jump_minus_body_weight_lbs',
                        unit: '',
                      },
                      time_scope: {
                        time_period: 'this_season',
                        start_time: null,
                        end_time: null,
                        time_period_length: null,
                        time_period_length_offset: null,
                      },
                      summary: 'sum',
                      order: 5,
                    },
                  ],
                  population: {
                    athletes: [],
                    positions: [],
                    position_groups: [],
                    squads: [],
                    applies_to_squad: true,
                    all_squads: false,
                  },
                  table_metrics: [],
                  time_scopes: [],
                },
              },
              widget_render: {},
              widget_type: 'table',
            },
          ],
        },
      };
      const selector = getColumnConfigByColumnIdFactory(3029);

      const selectedState = selector(testState);
      expect(selectedState).toStrictEqual(
        testState.dashboard.widgets[1].widget.table_container.columns[1].config
      );
    });
  });

  describe('getDuplicateColumn() selector', () => {
    it('returns the duplicate column state', () => {
      const selectedState = getDuplicateColumn(state);
      expect(selectedState).toStrictEqual({
        loading: [],
        error: [],
      });
    });
  });

  describe('getDuplicateColumnError() selector', () => {
    it('returns the error array', () => {
      const selectedState = getDuplicateColumnError({
        ...state,
        tableWidget: {
          ...state.tableWidget,
          duplicateColumn: { ...state.tableWidget.duplicateColumn, error: [1] },
        },
      });
      expect(selectedState).toStrictEqual([1]);
    });
  });

  describe('getDuplicateColumnLoading() selector', () => {
    it('returns the loading array', () => {
      const selectedState = getDuplicateColumnLoading({
        ...state,
        tableWidget: {
          ...state.tableWidget,
          duplicateColumn: {
            ...state.tableWidget.duplicateColumn,
            loading: [1],
          },
        },
      });
      expect(selectedState).toStrictEqual([1]);
    });
  });

  describe('isColumnDuplicating() selector', () => {
    const testState = {
      ...state,
      tableWidget: {
        ...state.tableWidget,
        duplicateColumn: { ...state.tableWidget.duplicateColumn, loading: [1] },
      },
    };

    it('returns true if id is loading', () => {
      const selectedState = isColumnDuplicating(testState, 1);

      expect(selectedState).toBe(true);
    });

    it('returns false if id supplied is not loading', () => {
      const selectedState = isColumnDuplicating(testState, 2);

      expect(selectedState).toBe(false);
    });
  });

  describe('hasColumnErroredDuplicting() selector', () => {
    const testState = {
      ...state,
      tableWidget: {
        ...state.tableWidget,
        duplicateColumn: { ...state.tableWidget.duplicateColumn, error: [1] },
      },
    };

    it('returns true if id has errored', () => {
      const selectedState = hasColumnErroredDuplicting(testState, 1);

      expect(selectedState).toBe(true);
    });

    it('returns false if id supplied is not loading', () => {
      const selectedState = hasColumnErroredDuplicting(testState, 2);

      expect(selectedState).toBe(false);
    });
  });

  describe('getColumnTypeFactory() selector', () => {
    it('returns NORMAL if isnt defined', () => {
      const testState = {
        ...state,
        dashboard: {
          widgets: [
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 9,
              widget: {},
              widget_render: {},
              widget_type: 'header',
            },
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 10,
              widget: {
                id: 902,
                name: 'Test: Comparison Table dsdsd',
                table_container: {
                  id: 123,
                  config: { table_type: 'COMPARISON', show_summary: true },
                  definitions: [],
                  columns: [],
                  population: {
                    athletes: [],
                    positions: [],
                    position_groups: [],
                    squads: [],
                    applies_to_squad: true,
                    all_squads: false,
                  },
                  table_metrics: [],
                  time_scopes: [],
                },
              },
              widget_render: {},
              widget_type: 'table',
            },
          ],
        },
      };

      const selector = getColumnTypeFactory(10);
      const selectedState = selector(testState);

      expect(selectedState).toBe('NORMAL');
    });

    it('returns value if on the state', () => {
      const testState = {
        ...state,
        dashboard: {
          widgets: [
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 9,
              widget: {},
              widget_render: {},
              widget_type: 'header',
            },
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 10,
              widget: {
                id: 902,
                name: 'Test: Comparison Table dsdsd',
                table_container: {
                  id: 123,
                  config: {
                    table_type: 'COMPARISON',
                    show_summary: true,
                    column_width_type: 'FIT_TO_WIDTH',
                  },
                  definitions: [],
                  columns: [],
                  population: {
                    athletes: [],
                    positions: [],
                    position_groups: [],
                    squads: [],
                    applies_to_squad: true,
                    all_squads: false,
                  },
                  table_metrics: [],
                  time_scopes: [],
                },
              },
              widget_render: {},
              widget_type: 'table',
            },
          ],
        },
      };
      const selector = getColumnTypeFactory(10);
      const selectedState = selector(testState);

      expect(selectedState).toBe('FIT_TO_WIDTH');
    });
  });

  describe('getTableSortOrderFactory() selector', () => {
    it('returns DEFAULT if isnt defined', () => {
      const testState = {
        ...state,
        dashboard: {
          widgets: [
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 9,
              widget: {},
              widget_render: {},
              widget_type: 'header',
            },
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 10,
              widget: {
                id: 902,
                name: 'Test: Comparison Table dsdsd',
                table_container: {
                  id: 123,
                  config: { table_type: 'COMPARISON', show_summary: true },
                  definitions: [],
                  columns: [],
                  population: {
                    athletes: [],
                    positions: [],
                    position_groups: [],
                    squads: [],
                    applies_to_squad: true,
                    all_squads: false,
                  },
                  table_metrics: [],
                  time_scopes: [],
                },
              },
              widget_render: {},
              widget_type: 'table',
            },
          ],
        },
      };

      const selector = getTableSortOrderFactory(10);
      const selectedState = selector(testState);

      expect(selectedState).toBe('DEFAULT');
    });

    it('returns value if on the state', () => {
      const testState = {
        ...state,
        dashboard: {
          widgets: [
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 9,
              widget: {},
              widget_render: {},
              widget_type: 'header',
            },
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 10,
              widget: {
                id: 902,
                name: 'Test: Comparison Table dsdsd',
                table_container: {
                  id: 123,
                  config: {
                    table_type: 'COMPARISON',
                    show_summary: true,
                    table_sort: [
                      {
                        column_id: 123,
                        order_direction: 'HIGH_TO_LOW',
                      },
                    ],
                  },
                  definitions: [],
                  columns: [],
                  population: {
                    athletes: [],
                    positions: [],
                    position_groups: [],
                    squads: [],
                    applies_to_squad: true,
                    all_squads: false,
                  },
                  table_metrics: [],
                  time_scopes: [],
                },
              },
              widget_render: {},
              widget_type: 'table',
            },
          ],
        },
      };
      const selector = getTableSortOrderFactory(10);
      const selectedState = selector(testState);

      expect(selectedState).toBe('HIGH_TO_LOW');
    });
  });

  describe('getTableSortColumnIdFactory() selector', () => {
    it('returns null if isnt defined', () => {
      const testState = {
        ...state,
        dashboard: {
          widgets: [
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 9,
              widget: {},
              widget_render: {},
              widget_type: 'header',
            },
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 10,
              widget: {
                id: 902,
                name: 'Test: Comparison Table dsdsd',
                table_container: {
                  id: 123,
                  config: { table_type: 'COMPARISON', show_summary: true },
                  definitions: [],
                  columns: [],
                  population: {
                    athletes: [],
                    positions: [],
                    position_groups: [],
                    squads: [],
                    applies_to_squad: true,
                    all_squads: false,
                  },
                  table_metrics: [],
                  time_scopes: [],
                },
              },
              widget_render: {},
              widget_type: 'table',
            },
          ],
        },
      };

      const selector = getTableSortColumnIdFactory(10);
      const selectedState = selector(testState);

      expect(selectedState).toBeNull();
    });

    it('returns value if on the state', () => {
      const testState = {
        ...state,
        dashboard: {
          widgets: [
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 9,
              widget: {},
              widget_render: {},
              widget_type: 'header',
            },
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 10,
              widget: {
                id: 902,
                name: 'Test: Comparison Table dsdsd',
                table_container: {
                  id: 123,
                  config: {
                    table_type: 'COMPARISON',
                    show_summary: true,
                    table_sort: [
                      {
                        column_id: 123,
                        order_direction: 'HIGH_TO_LOW',
                      },
                    ],
                  },
                  definitions: [],
                  columns: [],
                  population: {
                    athletes: [],
                    positions: [],
                    position_groups: [],
                    squads: [],
                    applies_to_squad: true,
                    all_squads: false,
                  },
                  table_metrics: [],
                  time_scopes: [],
                },
              },
              widget_render: {},
              widget_type: 'table',
            },
          ],
        },
      };
      const selector = getTableSortColumnIdFactory(10);
      const selectedState = selector(testState);

      expect(selectedState).toBe(123);
    });
  });

  describe('getTableRowByIdFactory() selector', () => {
    it('returns a row when given an Id', () => {
      const testState = {
        ...state,
        dashboard: {
          widgets: [
            {
              cols: 6,
              rows: 2,
              horizontal_position: 0,
              vertical_position: 0,
              id: 9,
              widget: {},
              widget_render: {},
              widget_type: 'header',
            },
            SCORECARD_WIDGET_MOCK,
          ],
        },
      };

      const selector = getTableRowByIdFactory(75987);
      const selectedState = selector(testState);

      expect(selectedState).toStrictEqual(
        SCORECARD_WIDGET_MOCK.widget.table_container.rows[1]
      );
    });
  });
});
