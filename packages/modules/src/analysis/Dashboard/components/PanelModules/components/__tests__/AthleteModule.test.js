import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import AthleteModule from '../AthleteModule';

describe('<AthleteModule />', () => {
  const squadAthletes = {
    position_groups: [
      {
        id: '1',
        name: 'Position Group 1',
        positions: [
          {
            id: '1',
            name: 'Position 1',
            athletes: [
              {
                id: '1',
                fullname: 'Athlete 1',
              },
              {
                id: '2',
                fullname: 'Athlete 2',
              },
            ],
          },
          {
            id: '2',
            name: 'Position 2',
            athletes: [
              {
                id: '3',
                fullname: 'Athlete 3',
              },
            ],
          },
        ],
      },
      {
        id: '2',
        name: 'Position Group 2',
        positions: [
          {
            id: '3',
            name: 'Position 3',
            athletes: [
              {
                id: '4',
                fullname: 'Athlete 4',
              },
            ],
          },
        ],
      },
    ],
  };

  const squads = [
    {
      id: '1',
      name: 'Squad 1',
    },
    {
      id: '2',
      name: 'Squad 2',
    },
  ];

  const emptySquadAthletesSelection = {
    applies_to_squad: false,
    position_groups: [],
    positions: [],
    athletes: [],
    all_squads: false,
    squads: [],
  };

  const props = {
    selectedPopulation: { ...emptySquadAthletesSelection },
    squadAthletes,
    squads,
    onSetPopulation: jest.fn(),
    t: (key) => key,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    renderWithStore(<AthleteModule {...props} />);

    expect(screen.getByText('Athlete')).toBeInTheDocument();
  });

  it('renders a Select component with custom label text', () => {
    renderWithStore(<AthleteModule {...props} label="Test label" />);

    expect(screen.getByText('Test label')).toBeInTheDocument();
  });

  it('returns correct squad selection when selecting entire squad', async () => {
    const user = userEvent.setup();
    const onSetPopulation = jest.fn();
    renderWithStore(
      <AthleteModule {...props} onSetPopulation={onSetPopulation} />
    );

    const selectComponent = screen.getByTestId('selectInput');
    await user.click(selectComponent);

    // Select first option
    await user.keyboard('{Enter}');

    expect(onSetPopulation).toHaveBeenCalledWith({
      applies_to_squad: true,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: [],
    });
  });

  it('returns correct squad selection when selecting a position group', async () => {
    const user = userEvent.setup();
    const onSetPopulation = jest.fn();
    renderWithStore(
      <AthleteModule {...props} onSetPopulation={onSetPopulation} />
    );

    const selectComponent = screen.getByTestId('selectInput');
    await user.click(selectComponent);

    // Navigate down to the position group option
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(onSetPopulation).toHaveBeenCalledWith({
      applies_to_squad: false,
      position_groups: [1],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: [],
    });
  });

  it('returns correct squad selection when selecting an athlete', async () => {
    const user = userEvent.setup();
    const onSetPopulation = jest.fn();
    renderWithStore(
      <AthleteModule {...props} onSetPopulation={onSetPopulation} />
    );

    const selectComponent = screen.getByTestId('selectInput');
    await user.click(selectComponent);

    // Navigate to Athlete 1
    await user.keyboard('{ArrowDown}'.repeat(3));
    await user.keyboard('{Enter}');

    expect(onSetPopulation).toHaveBeenCalledWith({
      applies_to_squad: false,
      position_groups: [],
      positions: [],
      athletes: [1],
      all_squads: false,
      squads: [],
    });
  });

  it('returns correct squad selection when selecting all squads', async () => {
    const user = userEvent.setup();
    const onSetPopulation = jest.fn();
    renderWithStore(
      <AthleteModule {...props} onSetPopulation={onSetPopulation} />
    );

    const selectComponent = screen.getByTestId('selectInput');
    await user.click(selectComponent);

    // Navigate to "All Squads (group)"
    await user.keyboard('{ArrowDown}'.repeat(10));
    await user.keyboard('{Enter}');

    expect(onSetPopulation).toHaveBeenCalledWith({
      applies_to_squad: false,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: true,
      squads: [],
    });
  });

  it('returns correct squad selection when selecting squads', async () => {
    const user = userEvent.setup();
    const onSetPopulation = jest.fn();
    renderWithStore(
      <AthleteModule {...props} onSetPopulation={onSetPopulation} />
    );

    const selectComponent = screen.getByTestId('selectInput');
    await user.click(selectComponent);

    // Navigate to "Squad 1"
    await user.keyboard('{ArrowDown}'.repeat(11));
    await user.keyboard('{Enter}');

    expect(onSetPopulation).toHaveBeenCalledWith({
      applies_to_squad: false,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: [1],
    });
  });
});
