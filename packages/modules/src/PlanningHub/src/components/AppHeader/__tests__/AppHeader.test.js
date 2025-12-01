import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupStore } from '@kitman/modules/src/AppRoot/store';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import AppHeader from '../index';

describe('<AppHeader />', () => {
  const props = {
    isGamesAdmin: true,
    canCreateGames: true,
    isTrainingSessionsAdmin: true,
    seasonMarkerRange: ['2014-06-14T00:00:00.000Z', '2023-12-31T00:00:00.000Z'],
    preferences: {},
    t: i18nextTranslateStub(),
  };
  const renderTestComponent = (additionalProps = {}) =>
    render(
      <Provider store={setupStore({})}>
        {props.children}
        <AppHeader {...props} {...additionalProps} />
      </Provider>
    );

  describe('renders correctly', () => {
    it('opens the shared sidepanel for a game, and it closes when clicking close', async () => {
      const user = userEvent.setup();
      renderTestComponent();
      await user.click(screen.getByText('Add'));
      await user.click(screen.getByText('Game'));
      expect(screen.getByText('New Game')).toBeInTheDocument();

      await user.click(screen.getByText('Cancel'));

      expect(screen.queryByText('New Game')).not.toBeInTheDocument();
    });

    it('opens the shared sidepanel for a session, and it closes when clicking close', async () => {
      const user = userEvent.setup();
      renderTestComponent();

      await user.click(screen.getByText('Add'));
      await user.click(screen.getByText('Session'));
      expect(screen.getByText('New Session')).toBeInTheDocument();

      await user.click(screen.getByText('Cancel'));

      expect(screen.queryByText('New Practice')).not.toBeInTheDocument();
    });
  });

  it('renders the correct menu when the user does not have games admin but does have create games', async () => {
    const user = userEvent.setup();
    renderTestComponent();
    await user.click(screen.getByText('Add'));
    expect(screen.getByText('Game')).toBeInTheDocument();
    expect(screen.getByText('Session')).toBeInTheDocument();
    expect(screen.getByText('Turnaround')).toBeInTheDocument();
  });

  it('renders the correct menu when the user is not training sessions admin', async () => {
    const user = userEvent.setup();
    renderTestComponent({ isTrainingSessionsAdmin: false });
    await user.click(screen.getByText('Add'));
    expect(screen.getByText('Game')).toBeInTheDocument();
    expect(screen.queryByText('Session')).not.toBeInTheDocument();
    expect(screen.getByText('Turnaround')).toBeInTheDocument();
    renderTestComponent({ isTrainingSessionsAdmin: false });
  });

  it('renders the correct menu when the user does not have create games or games admin permission', async () => {
    const user = userEvent.setup();
    renderTestComponent({ canCreateGames: false, isGamesAdmin: false });

    await user.click(screen.getByText('Add'));
    expect(screen.queryByText('Game')).not.toBeInTheDocument();
    expect(screen.getByText('Session')).toBeInTheDocument();
  });

  it('does not render the menu when the user does not have any permissions for it', async () => {
    renderTestComponent({
      canCreateGames: false,
      isGamesAdmin: false,
      isTrainingSessionsAdmin: false,
    });

    expect(screen.queryByText('Add')).not.toBeInTheDocument();
  });

  it('does not render the menu when the user has the preference league_game_schedule on', async () => {
    renderTestComponent({
      preferences: {
        league_game_schedule: true,
      },
    });

    expect(screen.queryByText('Add')).not.toBeInTheDocument();
  });
});
