import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import UserMenu from '../index';

describe('<UserMenu /> component', () => {
  let props;

  beforeEach(() => {
    props = {
      logoPath: 'dummy/logo/path.png',
      currentUser: {
        firstname: 'Jon',
        lastname: 'Doe',
        athlete_id: null,
      },
      currentSquad: {
        created: '2013-10-17T16:10:14.000+01:00',
        created_by: null,
        duration: 80,
        id: 8,
        is_default: null,
        name: 'International Squad',
        updated: null,
      },
      availableSquads: [
        {
          created: '2015-09-07T13:29:54.000+01:00',
          created_by: null,
          duration: 80,
          id: 73,
          is_default: null,
          name: 'Academy Squad',
          updated: '2015-09-07T13:29:54.000+01:00',
        },
        {
          created: '2013-10-17T16:10:14.000+01:00',
          created_by: null,
          duration: 80,
          id: 8,
          is_default: null,
          name: 'International Squad',
          updated: null,
        },
        {
          created: '2016-04-22T21:56:44.000+01:00',
          created_by: null,
          duration: null,
          id: 262,
          is_default: null,
          name: 'Test',
          updated: '2016-04-22T21:56:44.000+01:00',
        },
      ],
      t: i18nextTranslateStub(),
    };
  });

  it('renders the squad logo', () => {
    render(<UserMenu {...props} />);

    expect(screen.getByAltText('Squad Logo')).toHaveAttribute(
      'src',
      'dummy/logo/path.png'
    );
  });

  it('renders the squad selector', () => {
    render(<UserMenu {...props} />);

    expect(screen.queryByTestId('squadSelector')).toBeInTheDocument();
    expect(screen.getByTestId('squadSelector')).toHaveTextContent(
      'International Squad'
    );
  });

  describe('when currentSquad is null', () => {
    it("doesn't render the squad selector", () => {
      render(<UserMenu {...props} currentSquad={null} />);
      expect(screen.queryByTestId('squadSelector')).not.toBeInTheDocument();
    });
  });

  it('renders the profile tooltip', () => {
    render(<UserMenu {...props} />);
    expect(screen.getByTestId('profileTooltip')).toHaveTextContent('JD');
  });

  describe('when ip-branding flag is on', () => {
    beforeEach(() => {
      window.featureFlags['ip-login-branding'] = true;
    });

    afterEach(() => {
      window.featureFlags['ip-login-branding'] = false;
    });

    it('renders the ip-organisation logo', () => {
      render(<UserMenu {...props} orgNickname="org-nickname" />);
      expect(screen.getByAltText(`org-nickname's logo`)).toBeInTheDocument();
    });

    it('does not render the default-squad logo', () => {
      render(<UserMenu {...props} />);
      expect(screen.queryByAltText('Squad Logo')).not.toBeInTheDocument();
    });
  });

  describe('when league-ops-hide-squad-selector is enabled', () => {
    beforeEach(() => {
      window.featureFlags = {
        'league-ops-hide-squad-selector': true,
      };
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('hides the squad selector', () => {
      render(<UserMenu {...props} />);
      expect(screen.queryByTestId('profileTooltip')).toHaveStyle(
        'border: none'
      );
      expect(screen.queryByTestId('squadSelector')).not.toBeInTheDocument();
      expect(screen.queryByAltText('Squad Logo')).not.toBeInTheDocument();
    });
  });
});
