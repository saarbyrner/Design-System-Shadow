import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import alertsDummyData from '../../../resources/alertDummyData';
import AppContainer from '../App';

describe('Alerts <App /> Container', () => {
  let preloadedState;

  beforeEach(() => {
    preloadedState = {
      alerts: {
        permissions: {
          canEdit: true,
          canAdd: true,
          canDelete: true,
        },
        alertList: alertsDummyData,
        openModal: 'none',
        currentAlert: {
          training_variable_ids: [],
          notification_recipient_ids: [],
        },
        staticData: {
          users: [{ id: 1916, name: 'Jon Doe' }],
          variables: [{ id: 4, name: 'Mood' }],
          activeSquad: { id: 1 },
          squads: {
            data: [],
            isLoading: false,
            hasErrored: false,
          },
        },
      },
      appStatus: {
        message: null,
        status: null,
      },
    };
  });

  it('renders and maps state to props correctly', () => {
    renderWithRedux(<AppContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    expect(
      screen.getByRole('columnheader', { name: /name/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /variables/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /message/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /send to/i })
    ).toBeInTheDocument();

    expect(screen.getByText('Screening Alert')).toBeInTheDocument();
    expect(screen.getByText('Screening Alert 2')).toBeInTheDocument();
    expect(screen.getByText('Diagnostic Alert')).toBeInTheDocument();
  });
});
