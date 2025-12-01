import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import store from '@kitman/modules/src/AdditionalUsers/shared/redux/store';
import useManageAdditionalUsersGrid from '@kitman/modules/src/AdditionalUsers/shared/hooks/useManageAdditionalUsersGrid';
import AdditionalUsersGrid from '../AdditionalUsersGrid';

jest.mock(
  '@kitman/modules/src/AdditionalUsers/shared/hooks/useManageAdditionalUsersGrid'
);

describe('AdditionalUsersGrid', () => {
  beforeEach(() => {
    useManageAdditionalUsersGrid.mockImplementation(() => ({
      ...jest
        .requireActual(
          '@kitman/modules/src/AdditionalUsers/shared/hooks/useManageAdditionalUsersGrid'
        )
        .default({ is_active: true }),
      manageableUserTypes: ['official', 'match_director'],
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const defaultStore = {
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...defaultStore }),
  };

  it('renders the grid with loading status', async () => {
    render(
      <Provider store={defaultStore}>
        <AdditionalUsersGrid isActive />
      </Provider>
    );

    expect(screen.getByTestId('Loading')).toBeInTheDocument();
  });

  it('renders the grid with data', async () => {
    render(
      <Provider store={store}>
        <AdditionalUsersGrid isActive />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Name')).toBeInTheDocument();
    });
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('Creation Date')).toBeInTheDocument();
    expect(screen.getByText('Pierluigi Collina')).toBeInTheDocument();
  });

  it('filters the role dropdown based on the manageableUserTypes', async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <AdditionalUsersGrid isActive />
      </Provider>
    );

    await user.click(await screen.findByLabelText('Role', { selector: 'div' }));

    await waitFor(() => {
      expect(
        screen.getByText('Official', { selector: 'li' })
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText('Match director', { selector: 'li' })
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Scout', { selector: 'li' })
    ).not.toBeInTheDocument();
  });
});
