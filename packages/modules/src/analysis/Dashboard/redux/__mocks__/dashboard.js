// @flow

export const MOCK_DASHBOARD_STATE = {
  dashboardApi: {
    queries: {},
    mutations: {},
    provided: {},
    subscriptions: {},
    config: {
      online: true,
      focused: true,
      middlewareRegistered: true,
      refetchOnFocus: false,
      refetchOnReconnect: false,
      refetchOnMountOrArgChange: false,
      keepUnusedDataFor: 60,
      reducerPath: 'dashboardApi',
    },
  },
  tableWidget: {
    columnPanel: {
      columnId: null,
      isEditMode: false,
      name: '',
      metrics: [],
      population: {
        applies_to_squad: false,
        position_groups: [],
        positions: [],
        athletes: [],
        all_squads: false,
        squads: [],
      },
      calculation: '',
      time_scope: {
        time_period: '',
        start_time: undefined,
        end_time: undefined,
        time_period_length: undefined,
        time_period_length_offset: undefined,
      },
      filters: {
        time_loss: [],
        competitions: [],
        event_types: [],
        session_type: [],
        training_session_types: [],
        match_days: [],
      },
    },
  },
};
