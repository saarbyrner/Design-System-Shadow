import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { emptySquadAthletes } from '../../components/utils';
import ActionsWidgetContainer from '../ActionsWidget';
import { openActionsWidgetModal } from '../../redux/actions/actionsWidgetModal';
import { openNoteDetailModal } from '../../redux/actions/noteDetailModal';

jest.mock('../../redux/actions/actionsWidgetModal', () => ({
  openActionsWidgetModal: jest.fn(),
}));

jest.mock('../../redux/actions/actionsWidget', () => ({
  fetchActions: jest.fn(),
}));

jest.mock('../../redux/actions/notesWidget', () => ({
  clickActionCheckbox: jest.fn(),
}));

jest.mock('../../redux/actions/noteDetailModal', () => ({
  openNoteDetailModal: jest.fn(),
  fetchNoteDetail: jest.fn(),
}));

describe('<ActionsWidget /> Container', () => {
  const containerProps = {
    widgetId: 1,
    widgetSettings: {
      population: emptySquadAthletes,
      organisation_annotation_type_ids: [1],
      hidden_columns: [],
    },
    actions: [
      {
        id: 1,
        content: 'First action',
        completed: true,
        due_date: '2020-02-27',
        annotation: {
          annotationable: {
            avatar_url: '/avatar_url.png',
            fullname: 'Annotationable name',
          },
        },
        users: [],
      },
      {
        id: 2,
        content: 'Second action',
        completed: false,
        due_date: null,
        annotation: {
          annotationable: {
            avatar_url: '/avatar_url.png',
            fullname: 'Annotationable name',
          },
        },
        users: [],
      },
    ],
    squadAthletes: emptySquadAthletes,
    squads: [],
    nextId: null,
    currentUser: { id: 1, fullname: 'User Name' },
    annotationTypes: [],
  };

  const defaultState = {
    staticData: {
      containerType: 'AnalyticalDashboard',
      canEditNotes: true,
      canManageDashboard: true,
    },
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
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches the correct action when onClickWidgetSettings is called', () => {
    renderWithStore(
      <ActionsWidgetContainer {...containerProps} />,
      {},
      defaultState
    );

    const mockAction = {
      type: 'OPEN_ACTIONS_WIDGET_MODAL',
      payload: {
        widgetId: 1,
        annotationTypes: [1],
        population: emptySquadAthletes,
        hiddenColumns: ['due_date'],
      },
    };

    openActionsWidgetModal.mockReturnValue(mockAction);
    const result = openActionsWidgetModal(1, [1], emptySquadAthletes, [
      'due_date',
    ]);

    expect(openActionsWidgetModal).toHaveBeenCalledWith(
      1,
      [1],
      emptySquadAthletes,
      ['due_date']
    );
    expect(result).toStrictEqual(mockAction);
  });

  it('dispatches the correct action when onClickActionText is called', () => {
    renderWithStore(
      <ActionsWidgetContainer {...containerProps} />,
      {},
      defaultState
    );

    const mockAction = {
      type: 'OPEN_NOTE_DETAIL_MODAL',
    };

    openNoteDetailModal.mockReturnValue(mockAction);

    const result = openNoteDetailModal();
    expect(openNoteDetailModal).toHaveBeenCalled();
    expect(result).toStrictEqual(mockAction);
  });
});
