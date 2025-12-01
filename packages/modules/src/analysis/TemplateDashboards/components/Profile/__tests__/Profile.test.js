import { screen, waitFor } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { render } from '../../../testUtils';
import Profile from '../index';

const props = {
  t: i18nextTranslateStub(),
};

const mockPopulationFilter = {
  templateDashboardsFilter: {
    isPanelOpen: false,
    editable: {
      population: {
        applies_to_squad: false,
        all_squads: false,
        position_groups: [],
        positions: [],
        athletes: [1],
        squads: [],
        context_squads: [8],
      },
      timescope: {
        time_period: 'today',
      },
    },
    active: {
      population: {
        applies_to_squad: false,
        all_squads: false,
        position_groups: [],
        positions: [],
        athletes: [1],
        squads: [],
        context_squads: [],
      },
      timescope: {
        time_period: 'today',
      },
    },
  },
};

describe('TemplateDashboards|<Profile />', () => {
  it('renders no content correctly', () => {
    render(<Profile {...props} />, {}, {});

    expect(screen.queryByText('No Data Available')).toBeInTheDocument();
  });

  it('renders data correctly with mock population filter', async () => {
    const { getAllByRole } = render(
      <Profile {...props} />,
      {},
      mockPopulationFilter
    );

    await waitFor(() => {
      const [avatar] = getAllByRole('img');
      expect(screen.queryByText('No Data Available')).not.toBeInTheDocument();
      expect(screen.queryByText('Squad')).toBeInTheDocument();
      expect(screen.queryByText('Height')).toBeInTheDocument();
      expect(screen.queryByText('DoB')).toBeInTheDocument();
      expect(screen.queryByText('12 Oct 1990 (31)')).toBeInTheDocument();
      expect(
        screen.queryByText('International Squad, Academy Squad')
      ).toBeInTheDocument();
      expect(avatar.querySelector('img')).toHaveAttribute(
        'src',
        'https://kitman-staging.imgix.net/avatar.jpg'
      );
      expect(avatar.querySelector('img')).toHaveAttribute('alt', '');
    });
  });
});
