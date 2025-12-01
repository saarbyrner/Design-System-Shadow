import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { setLastKnownSquad } from '@kitman/modules/src/initialiseProfiler/modules/utilities/openLastKnownPageOnSignIn';
import DivisionSquadSelector from '..';

jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock(
  '@kitman/modules/src/initialiseProfiler/modules/utilities/openLastKnownPageOnSignIn',
  () => ({
    setLastKnownSquad: jest.fn(),
  })
);

describe('<DivisionSquadSelector />', () => {
  beforeEach(() => {
    useLeagueOperations.mockReturnValue({
      isLeague: true,
    });
  });

  const mockProps = {
    locale: 'en',
    availableSquads: [
      { id: '1', name: 'Squad A', indent_level: 0, disabled: false },
      { id: '2', name: 'Squad B', indent_level: 1, disabled: false },
    ],
    currentUser: { id: '123', athlete: false },
    currentSquad: { id: '1', name: 'Squad A' },
  };

  it('renders without crashing', () => {
    render(<DivisionSquadSelector {...mockProps} />);
    expect(screen.getByTestId('divisionSquadSelector')).toBeInTheDocument();
  });

  it('displays the current squad name', () => {
    render(<DivisionSquadSelector {...mockProps} />);
    expect(screen.getByText('Squad A')).toBeInTheDocument();
  });

  it('opens the selector when clicked, and renders squads', async () => {
    const user = userEvent.setup();
    render(<DivisionSquadSelector {...mockProps} />);
    const selectButton = screen.getByRole('button');
    await user.click(selectButton);

    expect(screen.getByRole('option', { name: 'Squad A' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Squad B' })).toBeInTheDocument();
  });

  it('calls setLastKnownSquad on squad change', async () => {
    const user = userEvent.setup();
    const setLastKnownSquadMock = jest.fn();
    setLastKnownSquad.mockImplementation(setLastKnownSquadMock);
    render(<DivisionSquadSelector {...mockProps} />);
    const selectButton = screen.getByRole('button');
    await user.click(selectButton);
    const optionB = screen.getByRole('option', { name: 'Squad B' });
    await user.click(optionB);

    expect(setLastKnownSquadMock).toHaveBeenCalledWith('2', '123');
  });

  it('handles resize events to close the selector', async () => {
    const user = userEvent.setup();
    render(<DivisionSquadSelector {...mockProps} />);
    const selectButton = screen.getByRole('button');
    await user.click(selectButton);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await act(async () => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
