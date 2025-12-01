/* eslint-disable flowtype/require-valid-file-annotation */
import i18n from '@kitman/common/src/utils/i18n';
import _orderBy from 'lodash/orderBy';
import _uniqBy from 'lodash/uniqBy';

export default function (state = {}, action) {
  switch (action.type) {
    case 'FETCH_WIDGETS_LOADING': {
      return {
        ...state,
        status: 'loading',
        appStatusText: i18n.t('Loading...'),
      };
    }
    case 'FETCH_WIDGETS_SUCCESS': {
      return {
        ...state,
        widgets: action.payload.widgets,
        status: null,
      };
    }
    case 'SAVE_DEVELOPMENT_GOAL_WIDGET_FAILURE': {
      return {
        ...state,
        status: 'error',
        appStatusText: null,
      };
    }
    case 'FETCH_WIDGETS_FAILURE': {
      return {
        ...state,
        status: 'error',
        appStatusText: i18n.t('Could not load dashboard'),
      };
    }
    case 'FETCH_WIDGET_CONTENT_LOADING': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            const updatedWidget = {
              ...widget,
              widget_render: {
                isLoading: true,
                error: false,
              },
            };
            return updatedWidget;
          }
          return widget;
        }),
      };
    }
    case 'FETCH_WIDGET_CONTENT_SUCCESS': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            const updatedWidget = {
              ...widget,
              widget_render: {
                ...action.payload.widgetContent,
                isLoading: false,
                error: false,
              },
            };
            return updatedWidget;
          }
          return widget;
        }),
      };
    }
    case 'FETCH_WIDGET_CONTENT_FORBIDDEN': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            const updatedWidget = {
              ...widget,
              widget_render: {
                error: false,
                isLoading: false,
                forbidden: true,
              },
            };
            return updatedWidget;
          }
          return widget;
        }),
      };
    }
    case 'FETCH_WIDGET_CONTENT_FAILURE': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            const updatedWidget = {
              ...widget,
              widget_render: {
                isLoading: false,
                error: true,
                errorMessage: action.payload.errorMessage,
              },
            };
            return updatedWidget;
          }
          return widget;
        }),
      };
    }
    case 'UPDATE_EXISTING_WIDGET_Y_POSITION': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          return {
            ...widget,
            vertical_position:
              widget.vertical_position + action.payload.widget.rows,
          };
        }),
      };
    }
    case 'SAVE_WIDGET_SUCCESS': {
      return {
        ...state,
        widgets: [...state.widgets, action.payload.widget],
      };
    }
    case 'EDIT_WIDGET_SUCCESS': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widget.id) {
            const updatedWidget = {
              ...action.payload.widget,
            };
            return updatedWidget;
          }
          return widget;
        }),
      };
    }
    case 'DELETE_WIDGET_SUCCESS': {
      return {
        ...state,
        widgets: state.widgets.filter(
          (widget) => `${widget.id}` !== `${action.payload.widgetId}`
        ),
        dashboardLayout: state.dashboardLayout.filter(
          (widgetLayout) => `${widgetLayout.i}` !== `${action.payload.widgetId}`
        ),
      };
    }
    case 'UPDATE_ANNOTATION': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            return {
              ...widget,
              widget_render: {
                ...widget.widget_render,
                annotations: widget.widget_render.annotations.map(
                  (annotation) => {
                    return annotation.id === action.payload.annotation.id
                      ? action.payload.annotation
                      : annotation;
                  }
                ),
              },
            };
          }

          return widget;
        }),
      };
    }
    case 'ADD_TABLE_ROW_SUCCESS': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            const newRows = widget.widget.table_container.rows.slice();
            newRows.push(action.payload.newRow);
            return {
              ...widget,
              widget: {
                ...widget.widget,
                table_container: {
                  ...widget.widget.table_container,
                  rows: newRows,
                },
              },
            };
          }

          return widget;
        }),
      };
    }
    case 'ADD_MULTIPLE_TABLE_ROW_SUCCESS': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            const newRows = [
              ...widget.widget.table_container.rows,
              ...action.payload.newRows,
            ];
            return {
              ...widget,
              widget: {
                ...widget.widget,
                table_container: {
                  ...widget.widget.table_container,
                  rows: newRows,
                },
              },
            };
          }

          return widget;
        }),
      };
    }
    case 'EDIT_COMPARISON_TABLE_ROW_SUCCESS': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            return {
              ...widget,
              widget: {
                ...widget.widget,
                table_container: {
                  ...widget.widget.table_container,
                  rows: widget.widget.table_container.rows.map((row) => {
                    if (row.id === action.payload.rowPanelDetails.rowId) {
                      return {
                        ...row,
                        row_id: action.payload.newRow.row_id,
                        population:
                          action.payload.rowPanelDetails.population[0],
                        config: action.payload.rowPanelDetails.config,
                      };
                    }
                    return row;
                  }),
                },
              },
            };
          }

          return widget;
        }),
      };
    }
    case 'EDIT_SCORECARD_TABLE_ROW_SUCCESS': {
      const { ids, source, status, variable, kinds, type } =
        action.payload.rowPanelDetails.dataSource;

      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            return {
              ...widget,
              widget: {
                ...widget.widget,
                table_container: {
                  ...widget.widget.table_container,
                  rows: widget.widget.table_container.rows.map((row) => {
                    if (row.id === action.payload.rowPanelDetails.rowId) {
                      return {
                        ...row,
                        name: action.payload.rowPanelDetails.dataSource.name,
                        table_element: {
                          ...row.table_element,
                          calculation:
                            action.payload.rowPanelDetails.calculation,
                          name: action.payload.rowPanelDetails.dataSource.name,
                          data_source: {
                            ...row.table_element.data_source,
                            data_source_type: type,
                            ids,
                            source,
                            status,
                            participation_level_ids: ids,
                            variable,
                            kinds,
                          },
                          config: {
                            filters: {
                              ...action.payload.rowPanelDetails.filters,
                            },
                            calculation_params: {
                              ...action.payload.rowPanelDetails
                                .calculation_params,
                            },
                          },
                        },
                      };
                    }
                    return row;
                  }),
                },
              },
            };
          }

          return widget;
        }),
      };
    }
    case 'EDIT_LONGITUDINAL_TABLE_ROW_SUCCESS': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            return {
              ...widget,
              widget: {
                ...widget.widget,
                table_container: {
                  ...widget.widget.table_container,
                  rows: widget.widget.table_container.rows.map((row) => {
                    if (row.id === action.payload.rowPanelDetails.rowId) {
                      return {
                        ...row,
                        time_scope: action.payload.rowPanelDetails.time_scope,
                      };
                    }
                    return row;
                  }),
                },
              },
            };
          }

          return widget;
        }),
      };
    }
    case 'UPDATE_TABLE_SUMMARY_VISIBILITY_SUCCESS': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.updatedWidget.id) {
            return {
              ...widget,
              widget: {
                ...widget.widget,
                table_container: {
                  ...widget.widget.table_container,
                  config: {
                    ...widget.widget.table_container.config,
                    show_summary:
                      action.payload.updatedWidget.widget.table_container.config
                        .show_summary,
                  },
                },
              },
            };
          }

          return widget;
        }),
      };
    }
    case 'ADD_TABLE_COLUMN_SUCCESS': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            const newColumns = widget.widget.table_container.columns.slice();
            newColumns.push(action.payload.newColumn);
            return {
              ...widget,
              widget: {
                ...widget.widget,
                table_container: {
                  ...widget.widget.table_container,
                  columns: newColumns,
                },
              },
            };
          }

          return widget;
        }),
      };
    }
    case 'EDIT_COMPARISON_TABLE_COLUMN_SUCCESS': {
      const payloadDetails = action.payload.columnPanelDetails;
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            return {
              ...widget,
              widget: {
                ...widget.widget,
                table_container: {
                  ...widget.widget.table_container,
                  columns: widget.widget.table_container.columns.map(
                    (column) => {
                      if (
                        payloadDetails.table_element?.calculation ===
                          'formula' &&
                        column.id === payloadDetails.id
                      ) {
                        return payloadDetails;
                      }
                      if (column.id === payloadDetails.columnId) {
                        return {
                          ...column,
                          name: payloadDetails.name,
                          table_element: {
                            ...column.table_element,
                            calculation: payloadDetails.calculation,
                            data_source: payloadDetails.dataSource,
                            config: {
                              filters: {
                                ...payloadDetails.filters,
                              },
                              calculation_params: {
                                ...payloadDetails.calculation_params,
                              },
                            },
                            name: payloadDetails.name,
                          },
                          time_scope: payloadDetails.time_scope,
                        };
                      }

                      return column;
                    }
                  ),
                },
              },
            };
          }

          return widget;
        }),
      };
    }
    case 'EDIT_SCORECARD_TABLE_COLUMN_SUCCESS': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            return {
              ...widget,
              widget: {
                ...widget.widget,
                table_container: {
                  ...widget.widget.table_container,
                  columns: widget.widget.table_container.columns.map(
                    (column) => {
                      if (
                        column.id === action.payload.columnPanelDetails.columnId
                      ) {
                        return {
                          ...column,
                          population:
                            action.payload.columnPanelDetails.population,
                          time_scope:
                            action.payload.columnPanelDetails.time_scope,
                          column_id:
                            action.payload.columnPanelDetails.column_id,
                        };
                      }
                      return column;
                    }
                  ),
                },
              },
            };
          }

          return widget;
        }),
      };
    }

    case 'EDIT_LONGITUDINAL_TABLE_COLUMN_SUCCESS': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            return {
              ...widget,
              widget: {
                ...widget.widget,
                table_container: {
                  ...widget.widget.table_container,
                  columns: widget.widget.table_container.columns.map(
                    (column) => {
                      if (
                        column.id === action.payload.columnPanelDetails.columnId
                      ) {
                        return {
                          ...column,
                          table_element: {
                            ...column.table_element,
                            calculation:
                              action.payload.columnPanelDetails.calculation,
                            data_source:
                              action.payload.columnPanelDetails.dataSource,
                            name: action.payload.columnPanelDetails.name,
                            config: {
                              filters: {
                                ...action.payload.columnPanelDetails.filters,
                              },
                              calculation_params: {
                                ...action.payload.columnPanelDetails
                                  .calculation_params,
                              },
                            },
                          },
                          name: action.payload.columnPanelDetails.name,
                          population:
                            action.payload.columnPanelDetails.population,
                        };
                      }
                      return column;
                    }
                  ),
                },
              },
            };
          }

          return widget;
        }),
      };
    }
    case 'DELETE_TABLE_COLUMN_SUCCESS': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            return {
              ...widget,
              widget: {
                ...widget.widget,
                table_container: {
                  ...widget.widget.table_container,
                  columns: widget.widget.table_container.columns.filter(
                    (column) => `${column.id}` !== `${action.payload.columnId}`
                  ),
                },
              },
            };
          }

          return widget;
        }),
      };
    }
    case 'DELETE_TABLE_ROW_SUCCESS': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            return {
              ...widget,
              widget: {
                ...widget.widget,
                table_container: {
                  ...widget.widget.table_container,
                  rows: widget.widget.table_container.rows.filter(
                    (row) => `${row.id}` !== `${action.payload.rowId}`
                  ),
                },
              },
            };
          }

          return widget;
        }),
      };
    }
    case 'SORT_GRAPH_WIDGET_SUCCESS': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            return {
              ...widget,
              widget: {
                ...widget.widget,
                configuration: {
                  ...widget.widget.configuration,
                  sorting: action.payload.sortOptions,
                },
              },
            };
          }
          return widget;
        }),
      };
    }
    case 'SORT_GRAPH_WIDGET_FAILURE': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            return {
              ...widget,
              widget_render: {
                isLoading: false,
                error: true,
                errorMessage: i18n.t('Error sorting graph'),
              },
            };
          }
          return widget;
        }),
      };
    }
    case 'UPDATE_NOTES': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            return {
              ...widget,
              widget_render: {
                ...widget.widget_render,
                annotations: widget.widget_render.annotations.concat(
                  action.payload.nextNotes
                ),
                next_page: action.payload.nextPage,
              },
            };
          }
          return widget;
        }),
      };
    }
    case 'UPDATE_ACTIONS': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            return {
              ...widget,
              widget_render: {
                ...widget.widget_render,
                actions: widget.widget_render.actions
                  ? widget.widget_render.actions.concat(action.payload.actions)
                  : action.payload.actions,
                next_id: action.payload.nextId,
                isLoading: false,
              },
            };
          }
          return widget;
        }),
      };
    }
    case 'RESET_ACTION_LIST': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            return {
              ...widget,
              widget_render: {
                ...widget.widget_render,
                actions: [],
              },
            };
          }
          return widget;
        }),
      };
    }
    case 'UPDATE_ACTION': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.widget_type === 'action') {
            return {
              ...widget,
              widget_render: {
                ...widget.widget_render,
                actions: widget.widget_render.actions.map((annotationAction) =>
                  annotationAction.id === action.payload.action.id
                    ? {
                        ...annotationAction,
                        completed: action.payload.action.completed,
                      }
                    : annotationAction
                ),
              },
            };
          }
          return widget;
        }),
      };
    }
    case 'ON_DELETE_DEVELOPMENT_GOAL_SUCCESS': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.widget_type === 'development_goal') {
            return {
              ...widget,
              widget_render: {
                ...widget.widget_render,
                development_goals:
                  widget.widget_render.development_goals.filter(
                    (developmentGoal) =>
                      developmentGoal.id !== action.payload.developmentGoalId
                  ),
              },
            };
          }
          return widget;
        }),
      };
    }
    case 'EDIT_DEVELOPMENT_GOAL_SUCCESS': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.widget_type === 'development_goal') {
            return {
              ...widget,
              widget_render: {
                ...widget.widget_render,
                development_goals: widget.widget_render.development_goals.map(
                  (developmentGoal) =>
                    developmentGoal.id === action.payload.developmentGoal.id
                      ? action.payload.developmentGoal
                      : developmentGoal
                ),
              },
            };
          }
          return widget;
        }),
      };
    }
    case 'UPDATE_DEVELOPMENT_GOALS': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            return {
              ...widget,
              widget_render: {
                ...widget.widget_render,
                development_goals: _uniqBy(
                  widget.widget_render.development_goals.concat(
                    action.payload.nextDevelopmentGoals
                  ),
                  'id'
                ),
                next_id: action.payload.nextId,
              },
            };
          }
          return widget;
        }),
      };
    }
    case 'FETCH_ACTIONS_LOADING': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            return {
              ...widget,
              widget_render: {
                ...widget.widget_render,
                isLoading: true,
              },
            };
          }
          return widget;
        }),
      };
    }
    case 'ARCHIVE_NOTE_SUCCESS': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.widget_type === 'annotation') {
            return {
              ...widget,
              widget_render: {
                ...widget.widget_render,
                annotations: widget.widget_render.annotations.map(
                  (annotation) => {
                    if (annotation.id === action.payload.noteId) {
                      return {
                        ...annotation,
                        archived: true,
                      };
                    }
                    return annotation;
                  }
                ),
                total_count: widget.widget_render.total_count - 1,
              },
            };
          }
          return widget;
        }),
      };
    }
    case 'RESTORE_NOTE_SUCCESS': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.widget_type === 'annotation') {
            return {
              ...widget,
              widget_render: {
                ...widget.widget_render,
                annotations: widget.widget_render.annotations.map(
                  (annotation) => {
                    if (annotation.id === action.payload.noteId) {
                      return {
                        ...annotation,
                        archived: false,
                      };
                    }
                    return annotation;
                  }
                ),
              },
            };
          }
          return widget;
        }),
      };
    }
    case 'GET_DASHBOARD_LAYOUT': {
      const widgetList = action.payload.widgets || [];
      const sortedWidgetsList = _orderBy(
        widgetList,
        ['vertical_position', 'id'],
        ['asc', 'desc']
      );
      return {
        ...state,
        dashboardLayout: [
          ...sortedWidgetsList.map((widget) => ({
            i: `${widget.id}`,
            x: widget.horizontal_position,
            y: widget.vertical_position,
            w: widget.cols,
            h: widget.rows,
            minH: widget.rows_range[0],
            maxH: widget.rows_range[1],
            minW: widget.cols_range[0],
            maxW: widget.cols_range[1],
          })),
        ],
        dashboardPrintLayout: [
          ...sortedWidgetsList.map((widget) => ({
            i: `${widget.id}`,
            x: widget.print_horizontal_position,
            y: widget.print_vertical_position,
            w: widget.print_cols,
            h: widget.print_rows,
            minH: widget.rows_range[0],
            maxH: widget.rows_range[1],
            minW: widget.cols_range[0],
            maxW: widget.cols_range[1],
          })),
        ],
        widgets: sortedWidgetsList,
      };
    }
    case 'UPDATE_DASHBOARD_LAYOUT': {
      return {
        ...state,
        dashboardLayout: action.payload.dashboardLayout,
        widgets: state.widgets.map((widget) => {
          let updatedWidget = widget;
          action.payload.dashboardLayout.forEach((item) => {
            if (item.i === widget.id.toString()) {
              updatedWidget = {
                ...widget,
                horizontal_position: item.x,
                vertical_position: item.y,
                cols: item.w,
                rows: item.h,
              };
            }
          });
          return updatedWidget;
        }),
      };
    }
    case 'UPDATE_DASHBOARD_PRINT_LAYOUT': {
      return {
        ...state,
        dashboardPrintLayout: action.payload.dashboardPrintLayout,
        widgets: state.widgets.map((widget) => {
          let updatedWidget = widget;
          action.payload.dashboardPrintLayout.forEach((item) => {
            if (item.i === widget.id.toString()) {
              updatedWidget = {
                ...widget,
                print_horizontal_position: item.x,
                print_vertical_position: item.y,
                print_cols: item.w,
                print_rows: item.h,
              };
            }
          });
          return updatedWidget;
        }),
      };
    }
    case 'UPDATE_AGGREGATION_PERIOD': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.widget_render.id === action.payload.graphId) {
            return {
              ...widget,
              widget_render: {
                ...widget.widget_render,
                aggregationPeriod: action.payload.aggregationPeriod,
              },
            };
          }

          return widget;
        }),
      };
    }
    case 'UPDATE_DASHBOARD': {
      return {
        ...state,
        activeDashboard: action.payload.dashboard,
      };
    }
    case 'CLOSE_REORDER_MODAL': {
      return {
        ...state,
        isReorderModalOpen: false,
      };
    }
    case 'OPEN_REORDER_MODAL': {
      return {
        ...state,
        isReorderModalOpen: true,
      };
    }
    case 'OPEN_TABLE_COLUMN_FORMATTING_PANEL':
    case 'OPEN_SCORECARD_TABLE_FORMATTING_PANEL': {
      return {
        ...state,
        isTableFormattingPanelOpen: true,
      };
    }
    case 'OPEN_TABLE_COLUMN_PANEL':
    case 'EDIT_COMPARISON_TABLE_COLUMN':
    case 'EDIT_SCORECARD_TABLE_COLUMN':
    case 'EDIT_LONGITUDINAL_TABLE_COLUMN': {
      return {
        ...state,
        isTableColumnPanelOpen: true,
        isTableColumnFormulaPanelOpen: false,
        isTableRowPanelOpen: false,
      };
    }
    case 'OPEN_TABLE_COLUMN_FORMULA_PANEL': {
      return {
        ...state,
        isTableColumnFormulaPanelOpen: true,
        isTableColumnPanelOpen: false,
        isTableRowPanelOpen: false,
      };
    }
    case 'OPEN_TABLE_ROW_PANEL':
    case 'EDIT_TABLE_ROW': {
      return {
        ...state,
        isTableColumnPanelOpen: false,
        isTableColumnFormulaPanelOpen: false,
        isTableRowPanelOpen: true,
      };
    }
    case 'TOGGLE_TABLE_FORMATTING_PANEL': {
      return {
        ...state,
        isTableFormattingPanelOpen: !state.isTableFormattingPanelOpen,
      };
    }
    case 'TOGGLE_TABLE_COLUMN_PANEL': {
      return {
        ...state,
        isTableColumnPanelOpen: !state.isTableColumnPanelOpen,
      };
    }
    case 'TOGGLE_TABLE_COLUMN_FORMULA_PANEL': {
      return {
        ...state,
        isTableColumnFormulaPanelOpen: !state.isTableColumnFormulaPanelOpen,
      };
    }
    case 'TOGGLE_TABLE_ROW_PANEL': {
      return {
        ...state,
        isTableRowPanelOpen: !state.isTableRowPanelOpen,
      };
    }
    case 'TOGGLE_SLIDING_PANEL': {
      return {
        ...state,
        isSlidingPanelOpen: !state.isSlidingPanelOpen,
      };
    }
    case 'CREATE_GRAPH_LINKS_SUCCESS': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.widget_render.id === action.payload.graphId) {
            const updatedWidget = {
              ...widget,
              widget_render: {
                ...widget.widget_render,
                metrics: widget.widget_render.metrics.map((metric) => ({
                  ...metric,
                  linked_dashboard_id: null,
                })),
              },
            };

            action.payload.graphLinks.forEach((graphLink) => {
              graphLink.metrics.forEach((metricIndex) => {
                updatedWidget.widget_render.metrics[
                  metricIndex
                ].linked_dashboard_id = graphLink.dashboardId;
              });
            });

            return updatedWidget;
          }
          return widget;
        }),
      };
    }
    case 'ADD_DASHBOARD_TOAST': {
      const toast = JSON.parse(JSON.stringify(state.toast));
      toast.push(action.payload.item);
      return {
        ...state,
        toast,
      };
    }
    case 'UPDATE_DASHBOARD_TOAST': {
      const toast = JSON.parse(JSON.stringify(state.toast));

      const index = toast.findIndex(
        (toastItem) => toastItem.id === action.payload.itemId
      );
      if (index !== -1) {
        toast[index] = action.payload.item;
        return {
          ...state,
          toast,
        };
      }

      return {
        ...state,
      };
    }
    case 'CLOSE_TOAST_ITEM': {
      const toast = state.toast.filter(
        (item) => item.id !== action.payload.itemId
      );
      return {
        ...state,
        toast,
      };
    }
    case 'UPDATE_PRINT_ORIENTATION': {
      return {
        ...state,
        activeDashboard: {
          ...state.activeDashboard,
          print_orientation: action.payload.printOrientation,
        },
      };
    }
    case 'UPDATE_PRINT_PAPER_SIZE': {
      return {
        ...state,
        activeDashboard: {
          ...state.activeDashboard,
          print_paper_size: action.payload.printPaperSize,
        },
      };
    }
    case 'UPDATE_NOTES_NAME_SUCCESS': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (
            widget.widget_type === 'annotation' &&
            widget.id === action.payload.widgetId
          ) {
            return {
              ...widget,
              widget: {
                ...widget.widget,
                name: action.payload.widgetName,
              },
            };
          }
          return widget;
        }),
      };
    }
    case 'UPDATE_COLUMN_ORDER': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            return {
              ...widget,
              widget: {
                ...widget.widget,
                table_container: {
                  ...widget.widget.table_container,
                  columns: widget.widget.table_container.columns.map(
                    (column) => {
                      if (column.id === action.payload.columnId) {
                        return {
                          ...column,
                          order: action.payload.newOrder,
                        };
                      }
                      return column;
                    }
                  ),
                },
              },
            };
          }

          return widget;
        }),
      };
    }
    case 'SET_COLUMN_WIDTH_TYPE': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            return {
              ...widget,
              widget: {
                ...widget.widget,
                table_container: {
                  ...widget.widget.table_container,
                  config: {
                    ...widget.widget.table_container.config,
                    column_width_type: action.payload.columnWidthType,
                  },
                },
              },
            };
          }

          return widget;
        }),
      };
    }
    case 'SET_TABLE_SORT_ORDER': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            return {
              ...widget,
              widget: {
                ...widget.widget,
                table_container: {
                  ...widget.widget.table_container,
                  config: {
                    ...widget.widget.table_container.config,
                    table_sort: [
                      {
                        column_id: action.payload.columnId,
                        order_direction: action.payload.order,
                      },
                    ],
                  },
                },
              },
            };
          }

          return widget;
        }),
      };
    }
    case 'UPDATE_COLUMN_CONFIG': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            return {
              ...widget,
              widget: {
                ...widget.widget,
                table_container: {
                  ...widget.widget.table_container,
                  columns: widget.widget.table_container.columns.map(
                    (column) => {
                      if (column.id === action.payload.columnId) {
                        return {
                          ...column,
                          config: action.payload.newConfig,
                        };
                      }
                      return column;
                    }
                  ),
                },
              },
            };
          }

          return widget;
        }),
      };
    }
    case 'UPDATE_ROW_CONFIG': {
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          if (widget.id === action.payload.widgetId) {
            return {
              ...widget,
              widget: {
                ...widget.widget,
                table_container: {
                  ...widget.widget.table_container,
                  rows: widget.widget.table_container.rows.map((row) => {
                    if (row.id === action.payload.rowId) {
                      return {
                        ...row,
                        config: action.payload.newConfig,
                      };
                    }
                    return row;
                  }),
                },
              },
            };
          }

          return widget;
        }),
      };
    }
    case 'SET_REFRESH_WIDGET_CACHE_STATUS': {
      return {
        ...state,
        widgets: state.widgets.map((w) => {
          if (w.widget.table_container?.id === action.payload.widgetId) {
            return {
              ...w,
              widget: {
                ...w.widget,
                table_container: {
                  ...w.widget.table_container,
                  refreshCacheStatus: action.payload.status,
                },
              },
            };
          }
          return w;
        }),
      };
    }
    case 'SET_COLUMN_CALCULATED_CACHED_AT_UPDATE': {
      return {
        ...state,
        widgets: state.widgets.map((w) => {
          if (w.id === action.payload.widgetId) {
            return {
              ...w,
              widget: {
                ...w.widget,
                table_container: {
                  ...w.widget.table_container,
                  columns: w.widget.table_container?.columns.map((col) =>
                    col.id === action.payload.columnId
                      ? {
                          ...col,
                          calculatedCachedAt: new Date().toISOString(),
                        }
                      : col
                  ),
                },
              },
            };
          }
          return w;
        }),
      };
    }
    case 'SET_COLUMN_CALCULATED_CACHED_AT_REFRESH_CACHE': {
      return {
        ...state,
        widgets: state.widgets.map((w) => {
          if (w.id === action.payload.widgetId) {
            return {
              ...w,
              widget: {
                ...w.widget,
                table_container: {
                  ...w.widget.table_container,
                  columns: w.widget.table_container?.columns.map((col) => {
                    return {
                      ...col,
                      calculatedCachedAt: new Date().toISOString(),
                    };
                  }),
                },
              },
            };
          }
          return w;
        }),
      };
    }

    case 'SET_ROW_CALCULATED_CACHED_AT_UPDATE': {
      return {
        ...state,
        widgets: state.widgets.map((w) => {
          if (w.id === action.payload.widgetId) {
            return {
              ...w,
              widget: {
                ...w.widget,
                table_container: {
                  ...w.widget.table_container,
                  rows: w.widget.table_container?.rows.map((row) =>
                    row.id === action.payload.rowId
                      ? {
                          ...row,
                          calculatedCachedAt: new Date().toISOString(),
                        }
                      : row
                  ),
                },
              },
            };
          }
          return w;
        }),
      };
    }

    case 'SET_ROW_CALCULATED_CACHED_AT_REFRESH_CACHE': {
      return {
        ...state,
        widgets: state.widgets.map((w) => {
          if (w.id === action.payload.widgetId) {
            return {
              ...w,
              widget: {
                ...w.widget,
                table_container: {
                  ...w.widget.table_container,
                  rows: w.widget.table_container?.rows.map((row) => {
                    return {
                      ...row,
                      calculatedCachedAt: new Date().toISOString(),
                    };
                  }),
                },
              },
            };
          }
          return w;
        }),
      };
    }

    case 'SET_COLUMN_LOADING_STATUS': {
      return {
        ...state,
        widgets: state.widgets.map((w) => {
          if (
            w.widget.table_container?.id === action.payload.tableContainerId
          ) {
            return {
              ...w,
              widget: {
                ...w.widget,
                table_container: {
                  ...w.widget.table_container,
                  columns: w.widget.table_container?.columns.map((col) =>
                    col.id === action.payload.columnId
                      ? {
                          ...col,
                          loadingStatus: action.payload.loadingStatus,
                        }
                      : col
                  ),
                },
              },
            };
          }
          return w;
        }),
      };
    }

    case 'SET_ROW_LOADING_STATUS': {
      return {
        ...state,
        widgets: state.widgets.map((w) => {
          if (
            w.widget.table_container?.id === action.payload.tableContainerId
          ) {
            return {
              ...w,
              widget: {
                ...w.widget,
                table_container: {
                  ...w.widget.table_container,
                  rows: w.widget.table_container?.rows.map((row) =>
                    row.id === action.payload.rowId
                      ? {
                          ...row,
                          loadingStatus: action.payload.loadingStatus,
                        }
                      : row
                  ),
                },
              },
            };
          }
          return w;
        }),
      };
    }

    case 'SET_CODING_SYSTEM_KEY': {
      return {
        ...state,
        codingSystemKey: action.payload.codingSystemKey,
      };
    }
    case 'REFRESH_DASHBOARD': {
      return {
        ...state,
        dashboardCacheRefreshKey: action.payload.dashboardCacheRefreshKey,
        lastCalculatedCachedAt: new Date().toISOString(),
      };
    }
    default:
      return state;
  }
}
