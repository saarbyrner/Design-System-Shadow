import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  setTableRowDataSourceType,
  setTableRowTitle,
} from '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget/panel';
import RowMedicalModule, { MedicalData as RowMedicalData } from '../Row';

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget/panel',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget/panel'
    ),
    setTableRowDataSourceType: jest.fn(() => ({
      type: 'SET_TABLE_ROW_DATASOURCE_TYPE',
      payload: { type: 'MedicalInjury' },
    })),
    setTableRowTitle: jest.fn(() => ({
      type: 'SET_TABLE_ROW_TITLE',
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
    rowPanel: {
      columnId: null,
      isEditMode: false,
      dataSource: {
        name: 'Medical Module',
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

describe('RowMedicalModule - Container', () => {
  it('renders the container with correct context of MedicalInjury', () => {
    renderWithRedux(<RowMedicalModule />, {
      preloadedState: defaultState,
      useGlobalStore: false,
    });

    expect(screen.getByText('Injuries')).toBeVisible();
  });

  it('dispatches the correct action when setSelectedType is called with injuries', async () => {
    const user = userEvent.setup();

    renderWithRedux(<RowMedicalModule />, {
      preloadedState: defaultState,
      useGlobalStore: false,
    });

    const setTypeButton = screen.getByRole('button', { name: 'Injuries' });
    await user.click(setTypeButton);

    expect(setTableRowDataSourceType).toHaveBeenCalledWith('MedicalInjury');
  });

  it('dispatches the correct action when setSelectedType is called with illnesses', async () => {
    const user = userEvent.setup();

    renderWithRedux(<RowMedicalModule />, {
      preloadedState: defaultState,
      useGlobalStore: false,
    });

    const setTypeButton = screen.getByRole('button', { name: 'Illnesses' });
    await user.click(setTypeButton);

    expect(setTableRowDataSourceType).toHaveBeenCalledWith('MedicalIllness');
  });

  describe('Row MedicalData container', () => {
    it('renders the Medical Data component', () => {
      renderWithRedux(<RowMedicalData />, {
        preloadedState: defaultState,
        useGlobalStore: false,
      });

      expect(screen.getByText('Add filter')).toBeVisible();
      expect(screen.getByText('Row Title')).toBeVisible();
    });

    it('dispatches the correct action when onSetRowTitle is called', () => {
      renderWithRedux(<RowMedicalData />, {
        preloadedState: defaultState,
        useGlobalStore: false,
      });

      const setTitleButton = screen.getByLabelText('Row Title');

      fireEvent.change(setTitleButton, {
        target: { value: 'New Title' },
      });

      expect(setTableRowTitle).toHaveBeenCalledWith('New Title');
    });
  });
});
