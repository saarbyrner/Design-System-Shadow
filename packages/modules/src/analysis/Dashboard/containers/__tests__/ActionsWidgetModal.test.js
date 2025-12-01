import { screen } from '@testing-library/react';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { emptySquadAthletes } from '../../components/utils';
import ActionsWidgetModalContainer from '../ActionsWidgetModal';
import {
  closeActionsWidgetModal,
  selectAnnotationType,
  unselectAnnotationType,
  setPopulation,
  closeActionsWidgetAppStatus,
  setHiddenColumns,
} from '../../redux/actions/actionsWidgetModal';

jest.mock('../../redux/actions/actionsWidgetModal', () => ({
  closeActionsWidgetModal: jest.fn(),
  selectAnnotationType: jest.fn(),
  unselectAnnotationType: jest.fn(),
  setPopulation: jest.fn(),
  saveActionsWidget: jest.fn(),
  editActionsWidget: jest.fn(),
  closeActionsWidgetAppStatus: jest.fn(),
  setHiddenColumns: jest.fn(),
}));

describe('ActionsWidgetModal Container', () => {
  const containerProps = {
    squadAthletes: emptySquadAthletes,
    squads: [
      {
        id: 1,
        name: 'Squad 1',
      },
    ],
    annotationTypes: [],
    t: (key) => key,
  };

  const mockStore = {
    dashboard: {},
    dashboardApi: {},
    actionsWidgetModal: {
      isOpen: true,
      population: {
        applies_to_squad: true,
        position_groups: [],
        positions: [],
        athletes: [],
        all_squads: false,
        squads: [],
      },
      organisation_annotation_type_ids: [],
      hidden_columns: [],
      widgetId: null,
      status: null,
    },
    staticData: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sets props correctly', () => {
    renderWithStore(
      <ActionsWidgetModalContainer {...containerProps} />,
      {},
      mockStore
    );

    expect(screen.getByText('Actions Widget Settings')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('dispatches the correct action when onClickCloseModal is called', () => {
    closeActionsWidgetModal.mockReturnValue({
      type: 'CLOSE_ACTIONS_WIDGET_MODAL',
    });

    renderWithStore(
      <ActionsWidgetModalContainer {...containerProps} />,
      {},
      mockStore
    );

    const result = closeActionsWidgetModal();
    expect(result).toStrictEqual({
      type: 'CLOSE_ACTIONS_WIDGET_MODAL',
    });
  });

  it('dispatches the correct action when onSelectAnnotationType is called', () => {
    selectAnnotationType.mockReturnValue({
      type: 'SELECT_ACTIONS_WIDGET_ANNOTATION_TYPE',
      payload: {
        annotationTypeId: 6,
      },
    });

    renderWithStore(
      <ActionsWidgetModalContainer {...containerProps} />,
      {},
      mockStore
    );

    const result = selectAnnotationType(6);
    expect(result).toStrictEqual({
      type: 'SELECT_ACTIONS_WIDGET_ANNOTATION_TYPE',
      payload: {
        annotationTypeId: 6,
      },
    });
  });

  it('dispatches the correct action when onUnselectAnnotationType is called', () => {
    unselectAnnotationType.mockReturnValue({
      type: 'UNSELECT_ACTIONS_WIDGET_ANNOTATION_TYPE',
      payload: {
        annotationTypeId: 12,
      },
    });

    renderWithStore(
      <ActionsWidgetModalContainer {...containerProps} />,
      {},
      mockStore
    );

    const result = unselectAnnotationType(12);
    expect(result).toStrictEqual({
      type: 'UNSELECT_ACTIONS_WIDGET_ANNOTATION_TYPE',
      payload: {
        annotationTypeId: 12,
      },
    });
  });

  it('dispatches the correct action when onSetPopulation is called', () => {
    setPopulation.mockReturnValue({
      type: 'SET_ACTIONS_WIDGET_POPULATION',
      payload: {
        population: {
          applies_to_squad: false,
        },
      },
    });

    renderWithStore(
      <ActionsWidgetModalContainer {...containerProps} />,
      {},
      mockStore
    );

    const result = setPopulation({
      applies_to_squad: false,
    });
    expect(result).toStrictEqual({
      type: 'SET_ACTIONS_WIDGET_POPULATION',
      payload: {
        population: {
          applies_to_squad: false,
        },
      },
    });
  });

  it('dispatches the correct action when onClickCloseAppStatus is called', () => {
    closeActionsWidgetAppStatus.mockReturnValue({
      type: 'CLOSE_ACTIONS_WIDGET_APP_STATUS',
    });

    renderWithStore(
      <ActionsWidgetModalContainer {...containerProps} />,
      {},
      mockStore
    );

    const result = closeActionsWidgetAppStatus();
    expect(result).toStrictEqual({
      type: 'CLOSE_ACTIONS_WIDGET_APP_STATUS',
    });
  });

  it('dispatches the correct action when onHiddenColumnsChange is called', () => {
    setHiddenColumns.mockReturnValue({
      type: 'SET_ACTIONS_WIDGET_HIDDEN_COLUMNS',
      payload: {
        hiddenColumns: ['due_date'],
      },
    });

    renderWithStore(
      <ActionsWidgetModalContainer {...containerProps} />,
      {},
      mockStore
    );

    const result = setHiddenColumns(['due_date']);
    expect(result).toStrictEqual({
      type: 'SET_ACTIONS_WIDGET_HIDDEN_COLUMNS',
      payload: {
        hiddenColumns: ['due_date'],
      },
    });
  });
});
