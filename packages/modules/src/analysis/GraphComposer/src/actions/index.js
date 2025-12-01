/* eslint-disable default-case */
// @flow
import $ from 'jquery';
import type { GraphType, GraphGroup } from '@kitman/common/src/types/Graphs';
import { searchParams } from '@kitman/common/src/utils';
import { searchCoding } from '@kitman/services';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import type {
  Pathologies,
  Classifications,
  BodyAreas,
} from '@kitman/modules/src/Medical/shared/types/medical/MultiCodingV2';
import type { CodingSystemKey } from '@kitman/common/src/types/Coding';
import {
  buildSummaryGraphRequest,
  buildGraphRequest,
  transformSummaryResponse,
  transformGraphResponse,
} from '../utils';
import type { Action } from '../types/actions';
import type { Action as GraphFormLongitudinal } from '../types/actions/GraphForm/Longitudinal';
import type { Action as GraphFormSummary } from '../types/actions/GraphForm/Summary';
import type { Action as GraphFormSummaryBar } from '../types/actions/GraphForm/SummaryBar';
import type { Action as GraphFormSummaryStackBar } from '../types/actions/GraphForm/SummaryStackBar';
import type { Action as GraphFormSummaryDonut } from '../types/actions/GraphForm/SummaryDonut';
import type { Action as GraphFormValueVisualisation } from '../types/actions/GraphForm/ValueVisualisation';
import getCodingSystemCategories from '../../../../Medical/shared/services/getCodingSystemCategories';

export type CodingSystemCategories = {
  injuryPathologies: Pathologies,
  illnessPathologies: Pathologies,
  injuryClassifications: Classifications,
  illnessClassifications: Classifications,
  injuryBodyAreas: BodyAreas,
  illnessBodyAreas: BodyAreas,
};

export const updateGraphFormType = (
  graphType: GraphType,
  graphGroup: GraphGroup
): Action => ({
  type: 'UPDATE_GRAPH_FORM_TYPE',
  payload: {
    graphType,
    graphGroup,
  },
});

export const updateCodingSystemCategorySelections = (
  payload: CodingSystemCategories
): Action => ({
  type: 'UPDATE_CODING_SYSTEM_CATEGORY_SELECTIONS',
  payload,
});

export const serverRequest = (): Action => ({
  type: 'SERVER_REQUEST',
});

export const serverRequestError = (): Action => ({
  type: 'SERVER_REQUEST_ERROR',
});

export const hideAppStatus = (): Action => ({
  type: 'HIDE_APP_STATUS',
});

export const searchIssuesPerCoding =
  (filter: string, codingSystem: CodingSystemKey) =>
  (dispatch: (action: Action) => void, getState: Function) => {
    searchCoding({ filter, codingSystem })
      .then((response) => {
        const {
          injuryClassifications,
          illnessClassifications,
          injuryBodyAreas,
          illnessBodyAreas,
        } = getState().StaticData;
        const isICD = codingSystem === codingSystemKeys.ICD;
        const results: Object[] = response.results;

        const parsePathologyData = (results || []).map((data) => {
          let name = typeof data.pathology === 'string' ? data.pathology : '';
          if (isICD) name = data.diagnosis;
          const id = isICD ? data.icd_id : data.id;
          return {
            id,
            name,
            code: data.code,
          };
        });

        dispatch(
          updateCodingSystemCategorySelections({
            injuryPathologies: parsePathologyData,
            illnessPathologies: parsePathologyData,
            injuryClassifications,
            illnessClassifications,
            injuryBodyAreas,
            illnessBodyAreas,
          })
        );
      })
      .catch(() => {
        dispatch(serverRequestError());
      });
  };

export const fetchCodingSystemCategories =
  (codingSystemKey: CodingSystemKey) =>
  (dispatch: (action: Action) => void) => {
    const promises = getCodingSystemCategories(codingSystemKey);
    switch (codingSystemKey) {
      case codingSystemKeys.OSICS_10:
        Promise.all(promises)
          .then(
            ([
              injuryPathologies,
              illnessPathologies,
              injuryClassifications,
              illnessClassifications,
              injuryBodyAreas,
              illnessBodyAreas,
            ]) => {
              dispatch(
                updateCodingSystemCategorySelections({
                  injuryPathologies,
                  illnessPathologies,
                  injuryClassifications,
                  illnessClassifications,
                  injuryBodyAreas,
                  illnessBodyAreas,
                })
              );
            }
          )
          .catch(() => {
            dispatch(serverRequestError());
          });
        return;

      case codingSystemKeys.DATALYS:
        Promise.all(promises)
          .then(([classifications, bodyAreas]) => {
            dispatch(
              updateCodingSystemCategorySelections({
                injuryPathologies: [],
                illnessPathologies: [],
                injuryClassifications: classifications,
                illnessClassifications: classifications,
                injuryBodyAreas: bodyAreas,
                illnessBodyAreas: bodyAreas,
              })
            );
          })
          .catch(() => {
            dispatch(serverRequestError());
          });
        return;

      case codingSystemKeys.CLINICAL_IMPRESSIONS:
        Promise.all(promises)
          .then(([classificationsData, bodyAreasData]) => {
            dispatch(
              updateCodingSystemCategorySelections({
                injuryPathologies: [],
                illnessPathologies: [],
                injuryClassifications: classificationsData,
                illnessClassifications: [],
                injuryBodyAreas: bodyAreasData,
                illnessBodyAreas: [],
              })
            );
          })
          .catch(() => {
            dispatch(serverRequestError());
          });
        return;

      case codingSystemKeys.ICD:
        Promise.all(promises)
          .then(
            ([
              injuryClassifications,
              illnessClassifications,
              injuryBodyAreas,
              illnessBodyAreas,
            ]) => {
              dispatch(
                updateCodingSystemCategorySelections({
                  injuryPathologies: [],
                  illnessPathologies: [],
                  injuryClassifications,
                  illnessClassifications,
                  injuryBodyAreas,
                  illnessBodyAreas,
                })
              );
            }
          )
          .catch(() => {
            dispatch(serverRequestError());
          });
    }
  };

export const saveGraph =
  () => (dispatch: (action: Action) => void, getState: Function) => {
    const containerType = getState().StaticData?.containerType;
    let configuration = '';
    let graphId = '';
    let graphName = '';
    let dashboardId = '';
    let requestUrl = '';

    switch (getState().GraphGroup) {
      case 'summary':
        graphId = getState().GraphData.summary.id;
        graphName = getState().GraphData.summary.name;
        configuration = buildSummaryGraphRequest(
          getState().GraphFormSummary,
          getState().GraphFormType
        );
        break;
      case 'longitudinal':
        graphId = getState().GraphData.longitudinal.id;
        graphName = getState().GraphData.longitudinal.name;
        configuration = buildGraphRequest(
          getState().GraphGroup,
          getState().GraphForm,
          getState().GraphFormType,
          {
            aggregationPeriod:
              getState().GraphData.longitudinal.aggregationPeriod,
            decorators: getState().GraphData.longitudinal.decorators,
          }
        );
        break;
      case 'summary_bar':
        graphId = getState().GraphData.summaryBar.id;
        graphName = getState().GraphData.summaryBar.name;
        configuration = buildGraphRequest(
          getState().GraphGroup,
          getState().GraphForm,
          getState().GraphFormType,
          { decorators: getState().GraphData.summaryBar.decorators }
        );
        break;
      case 'summary_stack_bar':
        graphId = getState().GraphData.summaryStackBar.id;
        graphName = getState().GraphData.summaryStackBar.name;
        configuration = buildGraphRequest(
          getState().GraphGroup,
          getState().GraphForm,
          getState().GraphFormType,
          { decorators: getState().GraphData.summaryStackBar.decorators }
        );
        break;
      case 'summary_donut':
        graphId = getState().GraphData.summaryDonut.id;
        graphName = getState().GraphData.summaryDonut.name;
        configuration = buildGraphRequest(
          getState().GraphGroup,
          getState().GraphForm,
          getState().GraphFormType
        );
        break;
      case 'value_visualisation':
        graphId = getState().GraphData.valueVisualisation.id;
        graphName = getState().GraphData.valueVisualisation.name;
        configuration = buildGraphRequest(
          getState().GraphGroup,
          getState().GraphForm,
          getState().GraphFormType
        );
        break;
      default:
        break;
    }

    // If the graph id exist, the user is editing the graph,
    // otherwise, the user is creating the graph
    const requestMethod = graphId ? 'PATCH' : 'POST';

    // If editing a dashboard, the dashboard id is the URL param analytical_dashboard_id
    // otherwise, the dashboard id is the one selected in the dashboard selector modal
    if (getState().StaticData.isEditingDashboard) {
      dashboardId = searchParams('analytical_dashboard_id') || '';
    } else {
      dashboardId = getState().DashboardSelectorModal.selectedDashboard;
    }

    const data: {
      configuration: Object,
      name?: string,
      widget_container_type?: string,
    } = { configuration };

    if (containerType === 'HomeDashboard') {
      if (requestMethod === 'PATCH') {
        requestUrl = `/analysis/graph/${graphId}`;
      } else {
        requestUrl = `/analysis/graph/`;
        data.widget_container_type = 'HomeDashboard';
      }
    } else {
      requestUrl =
        requestMethod === 'PATCH'
          ? `/analysis/graph/${graphId}?analytical_dashboard_id=${dashboardId}`
          : `/analysis/graph?analytical_dashboard_id=${dashboardId}`;
    }

    if (graphName) {
      data.name = graphName;
    }

    dispatch(serverRequest());
    $.ajax({
      method: requestMethod,
      url: requestUrl,
      contentType: 'application/json',
      data: JSON.stringify(data),
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
    })
      .done(() => {
        if (containerType === 'HomeDashboard') {
          window.location.assign(`/home_dashboards`);
        } else {
          window.location.assign(`/analysis/dashboard/${dashboardId}`);
        }
      })
      .fail(() => {
        dispatch(serverRequestError());
      });
  };

export const createGraph =
  () =>
  (
    dispatch: (
      action:
        | Action
        | GraphFormLongitudinal
        | GraphFormSummary
        | GraphFormSummaryBar
        | GraphFormSummaryStackBar
        | GraphFormSummaryDonut
        | GraphFormValueVisualisation
    ) => void,
    getState: Function
  ) => {
    let configuration = '';

    switch (getState().GraphGroup) {
      case 'summary':
        configuration = buildSummaryGraphRequest(
          getState().GraphFormSummary,
          getState().GraphFormType
        );
        break;
      case 'longitudinal': {
        const decorators = getState().GraphData.longitudinal
          ? getState().GraphData.longitudinal.decorators
          : {};
        const aggregationPeriod = getState().GraphData.longitudinal
          ? getState().GraphData.longitudinal.aggregationPeriod
          : null;

        configuration = buildGraphRequest(
          getState().GraphGroup,
          getState().GraphForm,
          getState().GraphFormType,
          { aggregationPeriod, decorators }
        );
        break;
      }
      case 'summary_bar': {
        const decorators = getState().GraphData.summaryBar
          ? getState().GraphData.summaryBar.decorators
          : {};
        configuration = buildGraphRequest(
          getState().GraphGroup,
          getState().GraphForm,
          getState().GraphFormType,
          { decorators }
        );
        break;
      }
      case 'summary_stack_bar': {
        const decorators = getState().GraphData.summaryStackBar
          ? getState().GraphData.summaryStackBar.decorators
          : {};
        configuration = buildGraphRequest(
          getState().GraphGroup,
          getState().GraphForm,
          getState().GraphFormType,
          { decorators }
        );
        break;
      }
      case 'summary_donut':
        configuration = buildGraphRequest(
          getState().GraphGroup,
          getState().GraphForm,
          getState().GraphFormType
        );
        break;
      case 'value_visualisation':
        configuration = buildGraphRequest(
          getState().GraphGroup,
          getState().GraphForm,
          getState().GraphFormType
        );
        break;
      default:
        break;
    }

    const data = { configuration };

    dispatch(serverRequest());
    $.ajax({
      method: 'POST',
      url: '/analysis/graph/builder',
      contentType: 'application/json',
      data: JSON.stringify(data),
      headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
    })
      .done((response) => {
        const updatedResponse = {
          ...response,
          // TODO: Remove the snippet below when BE is ready.
          // Temporary fix: The above API do no return graph id, so updating the `graph_id` from search params.
          id: response.id || searchParams('graph_id'),
        };
        location.hash = 'graphView'; // eslint-disable-line no-restricted-globals
        let state = null;

        switch (getState().GraphGroup) {
          case 'summary':
            state = transformSummaryResponse(
              updatedResponse,
              getState().StaticData.availableVariablesHash
            );
            dispatch({
              type: 'formSummary/COMPOSE_GRAPH_SUCCESS',
              payload: state,
            });
            break;
          case 'longitudinal':
            state = transformGraphResponse(
              updatedResponse,
              getState().GraphGroup
            );
            dispatch({
              type: 'formLongitudinal/COMPOSE_GRAPH_SUCCESS',
              payload: state,
            });
            break;
          case 'summary_bar':
            state = transformGraphResponse(
              updatedResponse,
              getState().GraphGroup
            );
            dispatch({
              type: 'formSummaryBar/COMPOSE_GRAPH_SUCCESS',
              payload: state,
            });
            break;
          case 'summary_stack_bar':
            state = transformGraphResponse(
              updatedResponse,
              getState().GraphGroup
            );
            dispatch({
              type: 'formSummaryStackBar/COMPOSE_GRAPH_SUCCESS',
              payload: state,
            });
            break;
          case 'summary_donut':
            state = transformGraphResponse(
              updatedResponse,
              getState().GraphGroup
            );
            dispatch({
              type: 'formSummaryDonut/COMPOSE_GRAPH_SUCCESS',
              payload: state,
            });
            break;
          case 'value_visualisation':
            state = transformGraphResponse(
              updatedResponse,
              getState().GraphGroup
            );
            dispatch({
              type: 'formValueVisualisation/COMPOSE_GRAPH_SUCCESS',
              payload: state,
            });
            break;
          default:
            break;
        }

        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
      })
      .fail(() => {
        dispatch(serverRequestError());
      });
  };

export const createNewGraph = (): Action => ({
  type: 'CREATE_NEW_GRAPH',
});

export const closeDashboardSelectorModal = (): Action => ({
  type: 'CLOSE_DASHBOARD_SELECTOR_MODAL',
});

export const openDashboardSelectorModal = (): Action => ({
  type: 'OPEN_DASHBOARD_SELECTOR_MODAL',
});

export const selectDashboard = (selectedDashboard: string): Action => ({
  type: 'SELECT_DASHBOARD',
  payload: {
    selectedDashboard,
  },
});

export const closeRenameGraphModal = (): Action => ({
  type: 'CLOSE_RENAME_GRAPH_MODAL',
});

export const openRenameGraphModal = (): Action => ({
  type: 'OPEN_RENAME_GRAPH_MODAL',
});

export const onRenameGraphValueChange = (value: string): Action => ({
  type: 'ON_RENAME_VALUE_CHANGE',
  payload: {
    value,
  },
});

export const eventTypeRequest = (): Action => ({
  type: 'EVENT_TYPE_REQUEST',
});

export const confirmRenameGraph = (
  newGraphName: string,
  graphGroup: GraphGroup
): Action => ({
  type: 'CONFIRM_RENAME_GRAPH',
  payload: {
    newGraphName,
    graphGroup,
  },
});
