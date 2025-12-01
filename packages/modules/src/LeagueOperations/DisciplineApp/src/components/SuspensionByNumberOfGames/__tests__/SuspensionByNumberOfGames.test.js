import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { getUserToBeDisciplined } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors';
import { Provider } from 'react-redux';
import useNextGameDisciplineIssue from '@kitman/modules/src/LeagueOperations/shared/hooks/useNextGameDisciplineIssue';

import SuspensionByNumberOfGames from '../SuspensionByNumberOfGames';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors'
    ),
    getUserToBeDisciplined: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useNextGameDisciplineIssue',
  () =>
    jest.fn(() => ({
      isNextGameValid: true,
    }))
);
const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});
const mockSelectors = () => {
  getUserToBeDisciplined.mockReturnValue({
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    squads: [
      { id: 1, name: 'Squad A' },
      { id: 2, name: 'Squad B' },
    ],
  });
};
const renderComponent = (props = {}) => {
  const defaultProps = {
    onIssueChange: jest.fn(),
    locale: 'en-IE',
    issue: {
      number_of_games: null,
      start_date: null,
      squad_id: null,
    },
  };
  mockSelectors();
  return render(
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Provider store={storeFake({})}>
        <SuspensionByNumberOfGames {...defaultProps} {...props} />
      </Provider>
    </LocalizationProvider>
  );
};

describe('SuspensionByNumberOfGames', () => {
  it('renders correctly with default props', () => {
    renderComponent();
    expect(screen.getByLabelText('Number of games')).toBeInTheDocument();
    expect(screen.getByLabelText('Start date and time')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Team to apply suspension')
    ).toBeInTheDocument();
  });

  it('calls onIssueChange when number of games is changed', async () => {
    const user = userEvent.setup();

    const onIssueChangeMock = jest.fn();
    renderComponent({ onIssueChange: onIssueChangeMock });
    const input = screen.getByLabelText('Number of games');
    await user.click(input);
    const option = screen.getByRole('option', { name: '3' });
    expect(option).toBeInTheDocument();
    await user.click(option);
    expect(input).toHaveValue('3');
    expect(onIssueChangeMock).toHaveBeenCalledTimes(1);
    expect(onIssueChangeMock).toHaveBeenCalledWith('number_of_games', 3);
  });

  it('calls onIssueChange when squad is changed', async () => {
    const user = userEvent.setup();

    const onIssueChangeMock = jest.fn();
    renderComponent({ onIssueChange: onIssueChangeMock });
    const select = screen.getByLabelText('Team to apply suspension');
    await user.click(select);
    const option = screen.getByRole('option', { name: 'Squad A' });
    expect(option).toBeInTheDocument();
    await user.click(option);
    expect(select).toHaveValue('Squad A');
    expect(onIssueChangeMock).toHaveBeenCalledWith('squad_id', 1);
  });

  it('renders issue data when data is set', async () => {
    const onIssueChangeMock = jest.fn();
    renderComponent({
      onIssueChange: onIssueChangeMock,
      locale: 'en',
      issue: {
        number_of_games: 2,
        start_date: '2023-10-01T01:00:00.000Z',
        squad_id: 1,
      },
    });
    expect(screen.getByLabelText('Number of games')).toHaveValue('2');
    expect(screen.getByLabelText('Start date and time')).toHaveValue(
      '01/10/2023  01:00'
    );
    expect(screen.getByLabelText('Team to apply suspension')).toHaveValue(
      'Squad A'
    );
  });

  it('renders error state when next game is invalid', () => {
    useNextGameDisciplineIssue.mockReturnValue({ isNextGameValid: true });
    renderComponent();

    expect(
      screen.getByText('Suspension exceeds remaining games')
    ).toBeInTheDocument();
  });

  it('lists 10 options for number of games', async () => {
    const user = userEvent.setup();

    const onIssueChangeMock = jest.fn();
    renderComponent({ onIssueChange: onIssueChangeMock });
    const input = screen.getByLabelText('Number of games');
    await user.click(input);
    const options = screen.getAllByRole('option');

    expect(options).toHaveLength(10);
  });
});
