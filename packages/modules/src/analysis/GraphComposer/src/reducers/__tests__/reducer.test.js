import {
  GraphFormType,
  GraphGroup,
  AppStatus,
  DashboardSelectorModal,
  RenameGraphModal,
  StaticData,
} from '../reducer';

describe('graphComposer - GraphFormType reducer', () => {
  it('returns correct state on UPDATE_GRAPH_FORM_TYPE', () => {
    const initialState = 'line';

    const action = {
      type: 'UPDATE_GRAPH_FORM_TYPE',
      payload: {
        graphType: 'bar',
        graphGroup: 'longitudinal',
      },
    };

    const nextState = GraphFormType(initialState, action);
    expect(nextState).toBe('bar');
  });
});

describe('graphComposer - GraphGroup reducer', () => {
  it('returns correct state on UPDATE_GRAPH_FORM_TYPE', () => {
    const initialState = 'line';

    const action = {
      type: 'UPDATE_GRAPH_FORM_TYPE',
      payload: {
        graphType: 'bar',
        graphGroup: 'longitudinal',
      },
    };

    const nextState = GraphGroup(initialState, action);
    expect(nextState).toBe('longitudinal');
  });
});

describe('graphComposer - AppStatus reducer', () => {
  it('returns correct state on SERVER_REQUEST', () => {
    const initialState = {};
    const action = {
      type: 'SERVER_REQUEST',
    };

    const nextState = AppStatus(initialState, action);
    expect(nextState).toStrictEqual({
      status: 'loading',
    });
  });

  it('returns correct state on EVENT_TYPE_REQUEST', () => {
    const initialState = {};
    const action = {
      type: 'EVENT_TYPE_REQUEST',
    };

    const nextState = AppStatus(initialState, action);
    expect(nextState).toStrictEqual({
      status: 'loading',
      message: 'Fetching data...',
    });
  });

  it('returns correct state on SERVER_REQUEST_ERROR', () => {
    const initialState = {};
    const action = {
      type: 'SERVER_REQUEST_ERROR',
    };

    const nextState = AppStatus(initialState, action);
    expect(nextState).toStrictEqual({
      status: 'error',
    });
  });

  it('returns correct state on formLongitudinal/COMPOSE_GRAPH_SUCCESS', () => {
    const initialState = {};
    const action = {
      type: 'formLongitudinal/COMPOSE_GRAPH_SUCCESS',
    };

    const nextState = AppStatus(initialState, action);
    expect(nextState).toStrictEqual({
      status: 'success',
      message: 'Success',
    });
  });

  it('returns correct state on HIDE_APP_STATUS', () => {
    const initialState = {
      status: 'success',
    };
    const action = {
      type: 'HIDE_APP_STATUS',
    };

    const nextState = AppStatus(initialState, action);
    expect(nextState).toStrictEqual({
      status: null,
    });
  });
});

describe('graphComposer - DashboardSelectorModal reducer', () => {
  it('returns correct state on SELECT_DASHBOARD', () => {
    const initialState = {
      isOpen: true,
      selectedDashboard: '1',
    };

    const action = {
      type: 'SELECT_DASHBOARD',
      payload: {
        selectedDashboard: '4',
      },
    };

    const nextState = DashboardSelectorModal(initialState, action);
    expect(nextState).toStrictEqual({
      isOpen: true,
      selectedDashboard: '4',
    });
  });

  it('returns correct state on OPEN_DASHBOARD_SELECTOR_MODAL', () => {
    const initialState = {
      isOpen: false,
      selectedDashboard: '1',
    };

    const action = {
      type: 'OPEN_DASHBOARD_SELECTOR_MODAL',
    };

    const nextState = DashboardSelectorModal(initialState, action);
    expect(nextState).toStrictEqual({
      isOpen: true,
      selectedDashboard: '1',
    });
  });

  it('returns correct state on CLOSE_DASHBOARD_SELECTOR_MODAL', () => {
    const initialState = {
      isOpen: true,
      selectedDashboard: '1',
    };

    const action = {
      type: 'CLOSE_DASHBOARD_SELECTOR_MODAL',
    };

    const nextState = DashboardSelectorModal(initialState, action);
    expect(nextState).toStrictEqual({
      isOpen: false,
      selectedDashboard: '1',
    });
  });
});

describe('graphComposer - RenameGraphModal reducer', () => {
  it('returns correct state on ON_RENAME_VALUE_CHANGE', () => {
    const initialState = {
      isOpen: true,
      updatedGraphTitle: null,
    };

    const action = {
      type: 'ON_RENAME_VALUE_CHANGE',
      payload: {
        value: 'new title',
      },
    };

    const nextState = RenameGraphModal(initialState, action);
    expect(nextState).toStrictEqual({
      isOpen: true,
      updatedGraphTitle: 'new title',
    });
  });

  it('returns correct state on OPEN_RENAME_GRAPH_MODAL', () => {
    const initialState = {
      isOpen: false,
    };

    const action = {
      type: 'OPEN_RENAME_GRAPH_MODAL',
    };

    const nextState = RenameGraphModal(initialState, action);
    expect(nextState).toStrictEqual({
      isOpen: true,
    });
  });

  it('returns correct state on CLOSE_RENAME_GRAPH_MODAL', () => {
    const initialState = {
      isOpen: true,
      updatedGraphTitle: 'edited name',
    };

    const action = {
      type: 'CLOSE_RENAME_GRAPH_MODAL',
    };

    const nextState = RenameGraphModal(initialState, action);
    expect(nextState).toStrictEqual({
      isOpen: false,
      updatedGraphTitle: null,
    });
  });

  it('returns correct state on CONFIRM_RENAME_GRAPH', () => {
    const initialState = {
      isOpen: true,
    };

    const action = {
      type: 'CONFIRM_RENAME_GRAPH',
    };

    const nextState = RenameGraphModal(initialState, action);
    expect(nextState).toStrictEqual({
      isOpen: false,
    });
  });
});

describe('graphComposer - StaticData reducer', () => {
  it('returns correct state on UPDATE_CODING_SYSTEM_CATEGORY_SELECTIONS', () => {
    const initialState = {
      injuryPathologies: [],
      illnessPathologies: [],
      injuryClassifications: [],
      illnessClassifications: [],
      injuryBodyAreas: [],
      illnessBodyAreas: [],
    };

    const action = {
      type: 'UPDATE_CODING_SYSTEM_CATEGORY_SELECTIONS',
      payload: {
        injuryPathologies: [
          {
            id: 1,
            name: 'Test Injury Pathology',
          },
        ],
        illnessPathologies: [
          {
            id: 2,
            name: 'Test Illness Pathology',
          },
        ],
        injuryClassifications: [
          {
            id: 3,
            name: 'Test Injury Classification',
          },
        ],
        illnessClassifications: [
          {
            id: 4,
            name: 'Test Illness Classification',
          },
        ],
        injuryBodyAreas: [
          {
            id: 5,
            name: 'Test Injury Body Area',
          },
        ],
        illnessBodyAreas: [
          {
            id: 6,
            name: 'Test Illness Body Area',
          },
        ],
      },
    };

    const nextState = StaticData(initialState, action);
    expect(nextState).toStrictEqual({
      injuryPathologies: [
        {
          id: 1,
          name: 'Test Injury Pathology',
        },
      ],
      illnessPathologies: [
        {
          id: 2,
          name: 'Test Illness Pathology',
        },
      ],
      injuryClassifications: [
        {
          id: 3,
          name: 'Test Injury Classification',
        },
      ],
      illnessClassifications: [
        {
          id: 4,
          name: 'Test Illness Classification',
        },
      ],
      injuryBodyAreas: [
        {
          id: 5,
          name: 'Test Injury Body Area',
        },
      ],
      illnessBodyAreas: [
        {
          id: 6,
          name: 'Test Illness Body Area',
        },
      ],
    });
  });
});
