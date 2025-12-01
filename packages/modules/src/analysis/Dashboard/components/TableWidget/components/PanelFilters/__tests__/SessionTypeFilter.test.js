import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { data as MOCK_SESSION_TYPES } from '@kitman/services/src/mocks/handlers/getSessionTypes';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import * as DashboardApi from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import SessionTypeFilter from '../components/SessionTypeFilter';

describe('<SessionTypeFilter />', () => {
  beforeEach(() => {
    jest.spyOn(DashboardApi, 'useGetSessionTypesQuery').mockReturnValue({
      data: MOCK_SESSION_TYPES,
      isFetching: false,
    });
  });

  const props = {
    t: i18nextTranslateStub(),
    onSelectSessionTypes: jest.fn(),
    onSelectEventTypes: jest.fn(),
    selectedSessionTypes: [],
    selectedEventTypes: [],
  };
  it('renders the session type filters selector', () => {
    renderWithStore(<SessionTypeFilter {...props} />);

    expect(screen.getByLabelText('Session Type')).toBeInTheDocument();
  });

  it('renders the available session type options', async () => {
    const user = userEvent.setup();

    renderWithStore(<SessionTypeFilter {...props} />);

    await user.click(screen.getByLabelText('Session Type'));

    MOCK_SESSION_TYPES.forEach((session) => {
      expect(screen.getByText(session.name)).toBeVisible();
    });
  });

  it('calls props.onSelectSessionTypes when clicking on a session type', async () => {
    const user = userEvent.setup();

    renderWithStore(<SessionTypeFilter {...props} />);

    await user.click(screen.getByLabelText('Session Type'));

    await user.click(screen.getByText(MOCK_SESSION_TYPES[0].name));

    expect(props.onSelectSessionTypes).toHaveBeenCalledWith([
      MOCK_SESSION_TYPES[0].id,
    ]);
  });

  it('calls props.onSelectEventTypes when clicking on an event type', async () => {
    const user = userEvent.setup();

    renderWithStore(<SessionTypeFilter {...props} />);

    await user.click(screen.getByLabelText('Session Type'));

    // There are two "Game" strings - one is the header of the event group options
    // The other is the game option to be selected
    await user.click(screen.getAllByText('Game')[1]);

    expect(props.onSelectEventTypes).toHaveBeenCalledWith(['game']);
  });

  it('renders the filters prefilled from props', () => {
    const updatedProps = {
      ...props,
      selectedEventTypes: ['game'],
      selectedSessionTypes: [MOCK_SESSION_TYPES[0].id],
    };
    renderWithStore(<SessionTypeFilter {...updatedProps} />);

    const selectedFilterString = ['Game', MOCK_SESSION_TYPES[0].name].join(
      ', '
    );

    expect(screen.getByText(selectedFilterString)).toBeVisible();
  });

  it('calls back with empty arrays on unmount', () => {
    const updatedProps = {
      ...props,
      selectedEventTypes: ['game'],
      selectedSessionTypes: [MOCK_SESSION_TYPES[0].id],
    };
    const { unmount } = renderWithStore(
      <SessionTypeFilter {...updatedProps} />
    );

    unmount();
    expect(props.onSelectEventTypes).toHaveBeenCalledWith([]);
    expect(props.onSelectSessionTypes).toHaveBeenCalledWith([]);
  });

  it('will not call back with empty arrays on unmount when noChangeOnUnload is true', () => {
    const updatedProps = {
      ...props,
      selectedEventTypes: ['game'],
      selectedSessionTypes: [MOCK_SESSION_TYPES[0].id],
      noChangeOnUnload: true,
    };
    const { unmount } = renderWithStore(
      <SessionTypeFilter {...updatedProps} />
    );

    unmount();
    expect(props.onSelectEventTypes).not.toHaveBeenCalledWith([]);
    expect(props.onSelectSessionTypes).not.toHaveBeenCalledWith([]);
  });
});
