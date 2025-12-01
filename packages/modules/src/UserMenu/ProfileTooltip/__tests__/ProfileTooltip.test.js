import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import ProfileTooltip from '..';

describe('<ProfileTooltip />', () => {
  const props = {
    currentUser: {
      firstname: 'Jon',
      lastname: 'Doe',
      username: 'jon_doe',
      athlete_id: null,
      athlete: false,
    },
    userInitials: 'PZ',
    t: i18nextTranslateStub(),
  };

  it('renders correctly', () => {
    const { container } = render(<ProfileTooltip {...props} />);
    expect(container).toBeInTheDocument();
  });

  it('renders the user initials in avatar', () => {
    render(<ProfileTooltip {...props} />);
    expect(screen.getByText('PZ')).toBeInTheDocument();
  });

  it('renders the menu when the user is clicking the component', async () => {
    const { container } = render(<ProfileTooltip {...props} />);

    const profileAvatar = container.querySelector('.profileTooltip__avatar');

    expect(profileAvatar).toHaveTextContent('PZ');

    await userEvent.click(profileAvatar);

    expect(screen.getByText('Jon Doe')).toBeInTheDocument();
    expect(screen.getByText('jon_doe')).toBeInTheDocument();

    const list = document.querySelector('.profileTooltipMenu__items');
    const listItems = list.querySelectorAll('.profileTooltipMenu__item');

    expect(listItems.length).toEqual(2);

    expect(listItems[0]).toHaveTextContent('View Profile');
    expect(listItems[0].querySelector('a').href).toEqual(
      'http://localhost/user_profile/edit'
    );

    expect(listItems[1]).toHaveTextContent('Sign Out');
    expect(listItems[1].querySelector('a').href).toEqual(
      'http://localhost/auth/sign_out'
    );

    const footer = document.querySelector('.profileTooltipMenu__footer');

    expect(footer.querySelector('a').href).toEqual(
      'https://www.kitmanlabs.com/privacy'
    );

    expect(footer.querySelector('a')).toHaveTextContent('Terms and Policies');
  });

  describe('[feature-flag] nfl-player-portal-web', () => {
    it('hides View Profile when FF is off', async () => {
      const { container } = render(
        <ProfileTooltip {...props} currentUser={{ ...props.currentUser }} />
      );

      const profileAvatar = container.querySelector('.profileTooltip__avatar');

      await userEvent.click(profileAvatar);

      const list = document.querySelector('.profileTooltipMenu__items');
      const listItems = list.querySelectorAll('.profileTooltipMenu__item');

      expect(listItems.length).toEqual(2);
    });

    it('hides View Profile when FF is on', async () => {
      window.setFlag('nfl-player-portal-web', true);

      const { container } = render(<ProfileTooltip {...props} />);

      const profileAvatar = container.querySelector('.profileTooltip__avatar');

      await userEvent.click(profileAvatar);

      const list = document.querySelector('.profileTooltipMenu__items');
      const listItems = list.querySelectorAll('.profileTooltipMenu__item');

      expect(listItems.length).toEqual(1);

      window.setFlag('nfl-player-portal-web', false);
    });
  });
});
