import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  setTableColumnDataSourceType,
  setTableColumnTitle,
} from '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget/panel';
import ColumnMedicalModule, {
  MedicalData as ColumnMedicalData,
} from '../Column';

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget/panel',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget/panel'
    ),
    setTableColumnDataSourceType: jest.fn(() => ({
      type: 'SET_TABLE_COLUMN_DATASOURCE_TYPE',
      payload: { type: 'MedicalInjury' },
    })),
    setTableColumnTitle: jest.fn(() => ({
      type: 'SET_TABLE_COLUMN_TITLE',
      payload: { title: 'New Title' },
    })),
  })
);

const defaultState = {
  dashboardApi: {},
  dashboard: {
    isTableColumnPanelOpen: true,
  },
  tableWidget: {
    tableId: null,
    appliedColumns: [],
    appliedPopulation: {
      applies_to_squad: false,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: [],
    },
    columnPanel: {
      columnId: null,
      isEditMode: false,
      name: 'Medical Module',
      dataSource: {
        type: 'MedicalInjury',
        subtypes: {},
      },
      population: {
        applies_to_squad: false,
        position_groups: [],
        positions: [],
        athletes: [],
        all_squads: false,
        squads: [],
      },
      calculation: 'sum',
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
      },
    },
    formattingPanel: {
      columnId: null,
      columnName: null,
      columnUnit: null,
      widgetId: null,
      appliedFormat: [],
    },
    tableContainerId: null,
    tableName: '',
    widgetId: null,
  },
};

describe('ColumnMedicalModule - Container', () => {
  it('renders the container with correct context of MedicalInjury', () => {
    renderWithRedux(<ColumnMedicalModule />, {
      preloadedState: defaultState,
      useGlobalStore: false,
    });

    expect(screen.getByText('Injuries')).toBeVisible();
  });

  it('dispatches the correct action when setSelectedType is called with injuries', async () => {
    const user = userEvent.setup();

    renderWithRedux(<ColumnMedicalModule />, {
      preloadedState: defaultState,
      useGlobalStore: false,
    });

    const setTypeButton = screen.getByRole('button', { name: 'Injuries' });
    await user.click(setTypeButton);

    expect(setTableColumnDataSourceType).toHaveBeenCalledWith('MedicalInjury');
  });

  it('dispatches the correct action when setSelectedType is called with illnesses', async () => {
    const user = userEvent.setup();

    renderWithRedux(<ColumnMedicalModule />, {
      preloadedState: defaultState,
      useGlobalStore: false,
    });

    const setTypeButton = screen.getByRole('button', { name: 'Illnesses' });
    await user.click(setTypeButton);

    expect(setTableColumnDataSourceType).toHaveBeenCalledWith('MedicalIllness');
  });

  describe('Column MedicalData container', () => {
    it('renders the Medical Data component', () => {
      renderWithRedux(<ColumnMedicalData />, {
        preloadedState: defaultState,
        useGlobalStore: false,
      });

      expect(screen.getByText('Add filter')).toBeVisible();
      expect(screen.getByText('Column Title')).toBeVisible();
    });

    it('dispatches the correct action when onSetColumnTitle is called', () => {
      renderWithRedux(<ColumnMedicalData />, {
        preloadedState: defaultState,
        useGlobalStore: false,
      });

      const setTitleButton = screen.getByLabelText('Column Title');

      fireEvent.change(setTitleButton, {
        target: { value: 'New Title' },
      });

      expect(setTableColumnTitle).toHaveBeenCalledWith('New Title');
    });
  });
});
