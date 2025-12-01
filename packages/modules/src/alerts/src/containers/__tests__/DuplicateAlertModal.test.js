import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import alertsDummyData from '../../../resources/alertDummyData';
import DuplicateAlertModalContainer from '../DuplicateAlertModal';
import * as alertActions from '../../actions';

jest.mock('../../actions');

describe('Alerts <DuplicateAlertModal /> Container', () => {
  let user;
  let preloadedState;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();

    preloadedState = {
      alerts: {
        alertList: alertsDummyData,
        openModal: 'duplicate',
        currentAlert: { ...alertsDummyData[0] },
        staticData: {
          users: [],
          variables: [],
          activeSquad: { id: 1, name: 'First Team' },
          squads: {
            data: [
              { id: 1, name: 'First Team' },
              { id: 2, name: 'U-23s' },
              { id: 3, name: 'U-18s' },
            ],
            isLoading: false,
            hasErrored: false,
          },
        },
        permissions: {
          canEdit: true,
          canAdd: true,
          canDelete: true,
        },
      },
      appStatus: {
        message: null,
        status: null,
      },
    };
  });

  it('renders the modal and maps state to props correctly', () => {
    renderWithRedux(<DuplicateAlertModalContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    expect(screen.getByText('Duplicate Alert')).toBeInTheDocument();

    const squadSelect = screen.getByText('Select Squad').parentElement;

    expect(squadSelect).toBeInTheDocument();
  });

  it('dispatches the fetchSquads action on mount', () => {
    renderWithRedux(<DuplicateAlertModalContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    // The container should dispatch fetchSquads when it mounts.
    expect(alertActions.fetchSquads).toHaveBeenCalledTimes(1);
  });

  it('maps dispatch to props and calls the correct action on Close', async () => {
    renderWithRedux(<DuplicateAlertModalContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const cancelButton = screen.getByText('Cancel');

    await user.click(cancelButton);

    expect(alertActions.closeAlertModal).toHaveBeenCalledTimes(1);
  });
});
