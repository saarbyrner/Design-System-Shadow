// @flow
import { configureStore } from '@reduxjs/toolkit';
import _cloneDeep from 'lodash/cloneDeep';
import annotationEmptyData from '@kitman/modules/src/Annotations/components/AnnotationModal/resources/annotationEmptyData';
import { searchParams, isDevEnvironment } from '@kitman/common/src/utils';
import { availableVariablesHash } from '@kitman/modules/src/analysis/GraphComposer/src/utils';
import { globalApi } from '@kitman/common/src/redux/global/services/globalApi';
import { medicalSharedApi } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';
import { getInitialPivotData, emptySquadAthletes } from '../components/utils';
import { getEmptyDevelopmentGoalForm } from './reducers/developmentGoalForm';
import rootReducer from './reducers';
import { dashboardApi } from './services/dashboard';
import { medicalApi } from './services/medical';
import { chartBuilderApi } from './services/chartBuilder';
import {
  initialState as initialChartBuilderState,
  REDUCER_KEY as chartBuilderReducerKey,
} from './slices/chartBuilder';

import {
  initialState as initialColumnFormulaPanelState,
  REDUCER_KEY as columnFormulaPanelReducerKey,
} from './slices/columnFormulaPanelSlice';

import type { InitialData } from '../types';
import type { Store } from './types/store';

const getActiveDashboard = (dashboard) => ({
  ...dashboard,
  // BE is expecting the layout here
  // We can remove it once the old graph code is removed from BE
  layout:
    typeof dashboard.layout === 'string' ? JSON.parse(dashboard.layout) : {},
});

const dashboardLayout = [];
const appliedSquadAthletes = _cloneDeep(emptySquadAthletes);

const activeSquad = {
  id: null,
  name: '',
};

const pivotData = getInitialPivotData({
  pivot: searchParams('pivot'),
  squadAthletesSelection: {
    applies_to_squad: searchParams('applies_to_squad'),
    position_groups: searchParams('position_groups'),
    positions: searchParams('positions'),
    athletes: searchParams('athletes'),
    all_squads: searchParams('all_squads'),
    squads: searchParams('squads'),
  },
  timePeriod: searchParams('time_period'),
  timePeriodLength: searchParams('time_period_length'),
  startDate: searchParams('start_date'),
  endDate: searchParams('end_date'),
});

export const getInitialStore = ({
  dashboard,
  organisationAnnotationTypes,
  availableVariables,
  containerType,
  dashboardManager,
  homepageManager,
  canViewNotes,
  canCreateNotes,
  canEditNotes,
  canSeeHiddenVariables,
  canViewDevelopmentGoals,
  canCreateDevelopmentGoals,
  canEditDevelopmentGoals,
  canDeleteDevelopmentGoals,
  canViewMetrics,
  dashboardList,
  turnaroundList,
  organisationModules,
}: InitialData) => ({
  dashboard: {
    status: null,
    appStatusText: '',
    dashboardLayout,
    isReorderModalOpen: false,
    isSlidingPanelOpen: false,
    isTableFormattingPanelOpen: false,
    isTableColumnPanelOpen: false,
    isTableRowPanelOpen: false,
    isTableColumnFormulaPanelOpen: false,
    activeDashboard: getActiveDashboard(dashboard) || null,
    widgets: [],
    toast: [],
    ...pivotData,
  },
  graphLinksModal: {
    graphId: null,
    open: false,
    graphLinks: [],
    status: null,
  },
  duplicateDashboardModal: {
    dashboardName: '',
    isOpen: false,
    status: null,
    activeSquad,
    selectedSquad: activeSquad || {},
  },
  duplicateWidgetModal: {
    isNameEditable: false,
    isOpen: false,
    activeDashboard: getActiveDashboard(dashboard) || null,
    activeSquad,
    selectedDashboard: getActiveDashboard(dashboard) || {},
    selectedSquad: activeSquad || {},
    status: null,
    widgetId: null,
    widgetName: '',
    widgetType: '',
  },
  headerWidgetModal: {
    color: '#ffffff',
    name: getActiveDashboard(dashboard)?.name || '',
    open: false,
    population: appliedSquadAthletes,
    showOrgLogo: true,
    showOrgName: true,
    widgetId: null,
  },
  profileWidgetModal: {
    athlete_id: null,
    avatar_availability: false,
    avatar_squad_number: false,
    fields: [
      { name: 'name' },
      { name: 'availability' },
      { name: 'date_of_birth' },
      { name: 'position' },
    ],
    open: false,
    preview: {},
    widgetId: null,
    backgroundColour: '',
  },
  noteDetailModal: {
    isOpen: false,
    annotation: null,
    requestStatus: null,
  },
  notesWidgetSettingsModal: {
    isOpen: false,
    population: {
      applies_to_squad: true,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: [],
    },
    time_scope: {
      time_period: TIME_PERIODS.thisSeason,
      start_time: undefined,
      end_time: undefined,
      time_period_length: null,
    },
    widget_annotation_types: [],
    widgetId: null,
  },
  notesWidget: {
    population: {
      applies_to_squad: true,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: [],
    },
    time_scope: {
      time_period: TIME_PERIODS.thisSeason,
      start_time: undefined,
      end_time: undefined,
      time_period_length: null,
    },
    widget_annotation_types: [],
    widgetId: null,
    availableAthletes: [],
    updatedAction: null,
    notesModal: {
      isNotesModalOpen: false,
      status: null,
      message: null,
      widgetId: null,
    },
    notesWidgetStatus: {
      annotation: null,
      fileId: null,
      status: null,
      message: null,
      secondaryMessage: null,
    },
    noteViewStatus: {
      status: null,
      message: null,
    },
    toast: {
      fileOrder: [],
      fileMap: {},
    },
  },
  tableWidget: {
    appliedColumns: [],
    appliedMetrics: [],
    appliedRows: [],
    columnPanel: {
      calculation: '',
      calculation_params: {},
      columnId: null,
      dataSource: {},
      isEditMode: false,
      name: '',
      population: appliedSquadAthletes,
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
        match_days: [],
      },
    },
    rowPanel: {
      calculation: '',
      calculation_params: {},
      isEditMode: false,
      rowId: null,
      dataSource: {},
      population: [],
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
    formattingPanel: {
      formattableId: null,
      panelName: null,
      ruleUnit: null,
      appliedFormat: [],
    },
    showSummary: false,
    tableContainerId: null,
    tableName: '',
    tableType: '',
    widgetId: null,
    duplicateColumn: {
      error: [],
      loading: [],
    },
  },
  tableWidgetModal: {
    isOpen: false,
    status: null,
  },
  actionsWidgetModal: {
    isOpen: false,
    widgetId: null,
    organisation_annotation_type_ids: [],
    population: {
      applies_to_squad: true,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: [],
    },
    hidden_columns: [],
    status: null,
  },
  printBuilder: {
    printSettings: {
      layout: 'portrait',
      paperType: 'a_4',
    },
    isOpen: false,
  },
  annotation: { ...annotationEmptyData(organisationAnnotationTypes) },
  staticData: {
    availableVariablesHash: availableVariablesHash(availableVariables),
    canManageDashboard:
      (containerType === 'AnalyticalDashboard' && dashboardManager) ||
      (containerType === 'HomeDashboard' && homepageManager),
    canViewNotes,
    canCreateNotes,
    canEditNotes,
    containerType,
    canSeeHiddenVariables,
    canViewDevelopmentGoals,
    canCreateDevelopmentGoals,
    canEditDevelopmentGoals,
    canDeleteDevelopmentGoals,
    hasDevelopmentGoalsModule:
      organisationModules.includes('development-goals'),
    canViewMetrics,
  },
  dashboardList,
  injuryRiskMetrics: {
    isLoading: false,
    hasErrored: false,
    metrics: [],
  },
  developmentGoalForm: {
    initialFormData: getEmptyDevelopmentGoalForm(),
    isOpen: false,
    status: null,
  },
  coachingPrinciples: { isEnabled: false },
  turnaroundList,
  [chartBuilderReducerKey]: initialChartBuilderState,
  [columnFormulaPanelReducerKey]: initialColumnFormulaPanelState,
});

export default (initialData: ?InitialData, preloadedState: ?Store) =>
  configureStore({
    reducer: (state, action) => {
      if (action.type === 'RESET_DASHBOARD_DATA') {
        window.graphColours = action.payload.data.graphColours;

        return rootReducer(getInitialStore(action.payload.data), action);
      }

      return rootReducer(state, action);
    },
    preloadedState: preloadedState || getInitialStore(initialData || {}),
    devTools: isDevEnvironment(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // Disabling this check because the dashbaord
        // is littered with immutability issues
        immutableCheck: false,
      }).concat([
        globalApi.middleware,
        dashboardApi.middleware,
        medicalApi.middleware,
        chartBuilderApi.middleware,
        medicalSharedApi.middleware,
      ]),
  });
