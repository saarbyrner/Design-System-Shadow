import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VirtuosoMockContext } from 'react-virtuoso';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import PaginatedList from '../PaginatedList';
import { useGetAthleteIssuesQuery } from '../../../services/api/playerSelectApi';

jest.mock('@kitman/common/src/hooks/useEventTracking');
jest.mock('../../../services/api/playerSelectApi');

const mockSquadOption = {
  parent: true,
  value: 1,
  label: 'Test Squad',
  options: [{ id: 10, label: 'Player 1' }],
};

const mockAthleteOption = {
  id: 2,
  value: 2,
  label: 'Doe, John',
  firstname: 'John',
  lastname: 'Doe',
  nfl_player_id: 123,
  date_of_birth: '1990-01-01',
  has_injuries: false,
};

const mockAthleteWithInjuriesOption = {
  ...mockAthleteOption,
  id: 3,
  value: 3,
  has_injuries: true,
};

const mockPositionGroupOption = {
  name: 'Quarterbacks',
  athletes: [
    { ...mockAthleteOption, id: 4, value: 4 },
    { ...mockAthleteWithInjuriesOption, id: 5, value: 5 },
  ],
};

const mockFilteredOptions = [
  mockSquadOption,
  mockAthleteOption,
  mockAthleteWithInjuriesOption,
  mockPositionGroupOption,
];

const renderComponent = (props) => {
  return render(
    <VirtuosoMockContext.Provider
      value={{ viewportHeight: 1000, itemHeight: 100 }}
    >
      <PaginatedList
        setSelectedParentOption={jest.fn()}
        filteredOptions={mockFilteredOptions}
        {...props}
      />
    </VirtuosoMockContext.Provider>
  );
};

describe('<PaginatedList />', () => {
  let trackEventMock;

  beforeEach(() => {
    trackEventMock = jest.fn();
    useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
    useGetAthleteIssuesQuery.mockReturnValue({
      data: {
        issues: [
          {
            id: 101,
            issue_type: 'INJURY',
            issue_occurrence_title: 'Knee Injury',
            full_pathology: 'Knee Injury',
          },
        ],
      },
      isError: false,
      isFetching: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('tracks squad selection event when a squad is clicked', async () => {
    const user = userEvent.setup();
    const setSelectedParentOption = jest.fn();
    renderComponent({ setSelectedParentOption });

    const squad = screen.getByText('Test Squad');
    await user.click(squad);

    expect(trackEventMock).toHaveBeenCalledWith(
      performanceMedicineEventNames.playerListSquadSelected
    );
    expect(setSelectedParentOption).toHaveBeenCalledWith(mockSquadOption);
  });

  it('tracks player selection event when a player without injuries is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    const players = screen.getAllByText('Doe, John');
    await user.click(players[0]);

    expect(trackEventMock).toHaveBeenCalledWith(
      performanceMedicineEventNames.playerListPlayerSelected
    );
  });

  it('tracks player selection event when a player with injuries is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    const players = screen.getAllByText('Doe, John');
    await user.click(players[1]); // Index 1 corresponds to mockAthleteWithInjuriesOption (id: 3)

    expect(trackEventMock).toHaveBeenCalledWith(
      performanceMedicineEventNames.playerListPlayerSelected
    );
  });

  it('tracks player selection for players without injuries in a position group', async () => {
    const user = userEvent.setup();
    renderComponent();

    const players = screen.getAllByText('Doe, John');
    await user.click(players[2]); // Index 2 corresponds to mockPositionGroupOption.athletes[0] (id: 4)

    expect(trackEventMock).toHaveBeenCalledWith(
      performanceMedicineEventNames.playerListPlayerSelected
    );
  });

  it('tracks player selection for players with injuries in a position group', async () => {
    const user = userEvent.setup();
    renderComponent();

    const players = screen.getAllByText('Doe, John');
    await user.click(players[3]); // Index 3 corresponds to mockPositionGroupOption.athletes[1] (id: 5)

    expect(trackEventMock).toHaveBeenCalledWith(
      performanceMedicineEventNames.playerListPlayerSelected
    );
  });
});
