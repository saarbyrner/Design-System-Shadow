import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { showAlarmsEditorModal } from '@kitman/modules/src/MetricsDashboard/src/actions';
import AlarmsEditorButton from '@kitman/modules/src/MetricsDashboard/src/containers/AlarmsEditorButton';

// Mock the actions
jest.mock('@kitman/modules/src/MetricsDashboard/src/actions', () => ({
  ...jest.requireActual('@kitman/modules/src/MetricsDashboard/src/actions'),
  showAlarmsEditorModal: jest.fn((statusId) => ({
    type: 'SHOW_MODAL',
    modalType: 'alarms',
    modalProps: {
      statusId,
    },
  })),
  setAlarmDefinitionsForStatus: jest.fn(),
}));

describe('<AlarmsEditorButton />', () => {
  const defaultState = {
    alarmDefinitions: {
      1234: [
        {
          alarmId: '1111',
        },
        {
          alarmId: '22222',
        },
      ],
    },
  };

  test('renders', () => {
    renderWithRedux(<AlarmsEditorButton statusId="1234" />, {
      preloadedState: defaultState,
      useGlobalStore: false,
    });

    expect(screen.getByText(/Alarms \(2 Alarms defined\)/)).toBeInTheDocument();
    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  test('displays correct alarm count when alarms exist', () => {
    renderWithRedux(<AlarmsEditorButton statusId="1234" />, {
      preloadedState: defaultState,
      useGlobalStore: false,
    });

    expect(screen.getByText(/Alarms \(2 Alarms defined\)/)).toBeInTheDocument();
  });

  test('displays basic alarm text when no alarms exist', () => {
    const emptyState = {
      alarmDefinitions: {},
    };

    renderWithRedux(<AlarmsEditorButton statusId="1234" />, {
      preloadedState: emptyState,
      useGlobalStore: false,
    });

    expect(screen.getByText('Alarms')).toBeInTheDocument();
    expect(screen.queryByText(/\d+ Alarms defined/)).not.toBeInTheDocument();
  });

  test('triggers dispatch when clicked', async () => {
    const user = userEvent.setup();

    renderWithRedux(<AlarmsEditorButton statusId="1234" />, {
      preloadedState: defaultState,
      useGlobalStore: false,
    });

    const alarmButton = screen.getByRole('listitem');
    await user.click(alarmButton);

    expect(showAlarmsEditorModal).toHaveBeenCalledWith('1234');
  });
});
