import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import AppliesToSearch from '@kitman/modules/src/MetricsDashboard/src/containers/AppliesToSearch';

describe('<AppliesToSearch />', () => {
  const defaultState = {
    alarmDefinitionsForStatus: {
      alarms: [
        {
          positions: [71],
          position_groups: [26],
          athletes: [
            {
              id: 23,
              firstname: 'Frank',
              lastname: 'Beans',
              on_dashboard: true,
            },
            {
              id: 28,
              firstname: 'John',
              lastname: 'Jones',
              on_dashboard: false,
            },
          ],
          applies_to_squad: false,
          alarm_id: 'fake_alarm_id',
        },
      ],
    },
    alarmSquadSearch: {
      positions: {
        70: 'Tight-head Prop',
        71: 'Hooker',
        72: 'Loose-head Prop',
      },
      positionOrder: [70, 71, 72],
      positionGroups: {
        25: 'Forward',
        26: 'Back',
        27: 'Other',
      },
      positionGroupOrder: [25, 26, 27],
      athletes: {
        23: {
          id: 23,
          firstname: 'Frank',
          lastname: 'Beans',
        },
      },
      athleteOrder: [23],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders', () => {
    renderWithRedux(<AppliesToSearch position={0} />, {
      preloadedState: defaultState,
      useGlobalStore: false,
    });

    expect(document.querySelector('.squadSearch')).toBeInTheDocument();
  });

  test('displays correct squad search items', () => {
    renderWithRedux(<AppliesToSearch position={0} />, {
      preloadedState: defaultState,
      useGlobalStore: false,
    });

    expect(screen.getByText('Entire Squad')).toBeInTheDocument();
    expect(screen.getByText('Forward')).toBeInTheDocument();
    expect(screen.getAllByText('Back')).toHaveLength(2);
    expect(screen.getByText('Tight-head Prop')).toBeInTheDocument();
    expect(screen.getAllByText('Hooker')).toHaveLength(2); // Selected in both places
    expect(screen.getByText('Loose-head Prop')).toBeInTheDocument();

    // Check that athletes are displayed
    expect(screen.getAllByText('Frank Beans')).toHaveLength(2);
    expect(screen.getAllByText('John Jones')).toHaveLength(2);

    // Verify that selected items are marked as selected in the UI
    const selectedItems = document.querySelectorAll(
      '.multiSelect__item--selected'
    );
    expect(selectedItems).toHaveLength(4); // Back, Hooker, Frank Beans, John Jones

    expect(
      screen.getByText('Athlete not in current squad: John Jones')
    ).toBeInTheDocument();
  });
});
