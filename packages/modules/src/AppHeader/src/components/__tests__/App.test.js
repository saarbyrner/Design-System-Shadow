import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import {
  useGetAthleteIssuesQuery,
  useGetSquadAthletesQuery,
} from '@kitman/modules/src/PlayerSelectSidePanel/services/api/playerSelectApi';
import {
  useGetPermissionsQuery,
  useGetSquadsQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import AppHeader from '../App';

jest.mock('@kitman/common/src/hooks/useEventTracking');
jest.mock(
  '@kitman/modules/src/PlayerSelectSidePanel/services/api/playerSelectApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/PlayerSelectSidePanel/services/api/playerSelectApi'
    ),
    useGetAthleteIssuesQuery: jest.fn(),
    useGetSquadAthletesQuery: jest.fn(),
  })
);
jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetPermissionsQuery: jest.fn(),
  useGetSquadsQuery: jest.fn(),
}));

const mockPermissions = {
  medical: { issues: { canView: true } },
  workloads: { canViewWorkload: false },
};

const mockCurrentUser = {
  id: 1,
  athlete: null,
  firstname: 'John',
  lastname: 'Doe',
};

const mockCurrentSquad = {
  id: 10,
  name: 'Test Squad',
};

const renderComponent = (isPlayerSelectOpen = false) => {
  return renderWithProviders(
    <AppHeader
      currentUser={mockCurrentUser}
      currentSquad={mockCurrentSquad}
      availableSquads={[]}
    />,
    {
      preloadedState: {
        playerSelectSlice: {
          isPlayerSelectOpen,
          filters: [],
          grouping: [],
        },
        eventSwitcherSlice: { isEventSwitcherOpen: false },
      },
      permissions: mockPermissions,
    }
  );
};

describe('<AppHeader />', () => {
  let trackEventMock;

  beforeEach(() => {
    trackEventMock = jest.fn();
    useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
    window.setFlag('player-selector-side-nav', true);
    useGetAthleteIssuesQuery.mockReturnValue({
      data: { issues: [] },
      isError: false,
      isFetching: false,
    });
    useGetSquadAthletesQuery.mockReturnValue({
      data: [],
      isError: false,
      isFetching: false,
    });
    useGetPermissionsQuery.mockReturnValue({
      data: mockPermissions,
      isError: false,
      isLoading: false,
    });
    useGetSquadsQuery.mockReturnValue({
      data: [],
      isError: false,
      isFetching: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('tracks playerListOpened event when player list is opened', async () => {
    const user = userEvent.setup();
    renderComponent(false);

    const playerListButton = await screen.findByRole('button', {
      name: /Player list/i,
    });
    await user.click(playerListButton);

    expect(trackEventMock).toHaveBeenCalledWith(
      performanceMedicineEventNames.playerListOpened
    );
  });

  it('tracks playerListClosed event when player list is closed', async () => {
    const user = userEvent.setup();
    renderComponent(true);

    const playerListButton = await screen.findByRole('button', {
      name: /Player list/i,
    });
    await user.click(playerListButton);

    expect(trackEventMock).toHaveBeenCalledWith(
      performanceMedicineEventNames.playerListClosed
    );
  });
});
