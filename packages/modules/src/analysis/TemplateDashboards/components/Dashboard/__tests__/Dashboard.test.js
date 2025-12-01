import userEvent from '@testing-library/user-event';
import { VirtuosoMockContext } from 'react-virtuoso';
import { screen, waitFor } from '@testing-library/react';
import {
  i18nextTranslateStub,
  mockLocalStorage,
} from '@kitman/common/src/utils/test_utils';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import { data as MOCK_SQUAD_ATHLETES } from '@kitman/services/src/mocks/handlers/getSquadAthletes';
import { useGetAllSquadAthletesQuery } from '@kitman/modules/src/analysis/TemplateDashboards/redux/services/templateDashboards';

import { render } from '../../../testUtils';
import Dashboard from '../index';

jest.mock(
  '@kitman/modules/src/analysis/TemplateDashboards/redux/services/templateDashboards',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/analysis/TemplateDashboards/redux/services/templateDashboards'
    ),
    useGetAllSquadAthletesQuery: jest.fn(),
  })
);

jest.mock('@kitman/common/src/hooks/useLocationPathname', () => jest.fn());
jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),

  getLocalStorageKey: jest
    .fn()
    .mockReturnValue('Reporting|templateDashboardsFilterCoaching'),
}));

const props = {
  t: i18nextTranslateStub(),
};

const mockFilter = {
  population: {
    applies_to_squad: false,
    all_squads: false,
    position_groups: [],
    positions: [],
    athletes: [],
    squads: [],
    context_squads: [8], // International Squad
  },
  timescope: {
    time_period: 'today',
  },
};

const applyFiltersInteraction = async (user, isGrowthAndMaturation = false) => {
  // Set and apply filters as will have been cleared by resetState in useEffect
  if (isGrowthAndMaturation) {
    await user.click(screen.getByLabelText('Athletes'));
    await user.click(screen.getByText('International Squad'));
    await user.click(screen.getByText('Athlete One'));
    await user.click(screen.getByText('Athlete Two'));
  } else {
    await user.click(screen.getByText('All Squads'));
    await user.click(screen.getByText('International Squad'));
    // A TimeScopeFilter is also needed as getIfFiltersAreEmpty will consider filters empty without
    await user.click(screen.getByLabelText('Date'));
    await user.click(screen.getByText('Today'));
  }

  await user.click(screen.getByText('Apply'));
};

const forcePathname = (pathname) => {
  Object.defineProperty(window, 'location', {
    value: { assign: jest.fn() },
  });
  window.location.pathname = pathname;
};

describe('TemplateDashboards|<Dashboard/>', () => {
  beforeEach(() => {
    window.localStorage?.removeItem(
      'Reporting|templateDashboardsFilterCoaching'
    );

    useGetAllSquadAthletesQuery.mockReturnValue({
      data: MOCK_SQUAD_ATHLETES,
      isFetching: false,
    });

    useLocationPathname.mockImplementation(
      () => '/analysis/template_dashboards/coaching_summary'
    );
    forcePathname('/analysis/template_dashboards/coaching_summary');
    window.featureFlags = {};
  });

  it('renders empty state on first load', () => {
    render(<Dashboard {...props} />);

    expect(screen.queryByText('No data available')).toBeVisible();
    expect(
      screen.queryByText('Apply some filters to render your report')
    ).toBeVisible();
  });

  describe('Development Journey', () => {
    beforeEach(() => {
      useLocationPathname.mockImplementation(
        () => '/analysis/template_dashboards/development_journey'
      );
      forcePathname('/analysis/template_dashboards/development_journey');
      window.featureFlags = {
        'rep-show-development-journey': true,
        'rep-show-player-care-dev-journey': true,
      };
    });

    it('renders the additional widgets for development_journey', async () => {
      const user = userEvent.setup();

      render(
        <Dashboard {...props} />,
        {
          wrapper: ({ children }) => (
            <VirtuosoMockContext.Provider
              value={{ viewportHeight: 2000, itemHeight: 50 }}
            >
              {children}
            </VirtuosoMockContext.Provider>
          ),
        },
        {
          templateDashboardsFilter: {
            isEditModeActive: false,
            editable: mockFilter,
            active: mockFilter,
          },
        }
      );

      await applyFiltersInteraction(user);

      await waitFor(() => {
        expect(
          screen.queryByRole('heading', {
            level: 3,
            name: 'Coaching',
          })
        ).toBeVisible();

        expect(
          screen.queryByRole('heading', {
            level: 3,
            name: 'Games',
          })
        ).toBeVisible();

        expect(
          screen.queryByRole('heading', {
            level: 3,
            name: 'Injuries/Illnesses',
          })
        ).toBeVisible();

        expect(
          screen.queryByRole('heading', {
            level: 3,
            name: 'Player Care',
          })
        ).toBeVisible();
      });
    });

    it('hides player care widgets when rep-show-player-care-dev-journey is false', async () => {
      const user = userEvent.setup();

      window.featureFlags = {
        'rep-show-player-care-dev-journey': false,
      };

      render(
        <Dashboard {...props} />,
        {
          wrapper: ({ children }) => (
            <VirtuosoMockContext.Provider
              value={{ viewportHeight: 2000, itemHeight: 50 }}
            >
              {children}
            </VirtuosoMockContext.Provider>
          ),
        },
        {
          templateDashboardsFilter: {
            isEditModeActive: false,
            editable: mockFilter,
            active: mockFilter,
          },
        }
      );

      await applyFiltersInteraction(user);

      await waitFor(() => {
        expect(
          screen.queryByRole('heading', {
            level: 3,
            name: 'Coaching',
          })
        ).toBeVisible();

        expect(
          screen.queryByRole('heading', {
            level: 3,
            name: 'Player Care',
          })
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Medical Summary - when rep-show-medical-summary is true', () => {
    beforeEach(() => {
      useLocationPathname.mockImplementation(
        () => '/analysis/template_dashboards/medical'
      );
      forcePathname('/analysis/template_dashboards/medical');
      window.featureFlags = { 'rep-show-medical-summary': true };
    });

    it('renders the additional widgets for medical_summary', async () => {
      const user = userEvent.setup();

      render(
        <Dashboard {...props} />,
        {
          wrapper: ({ children }) => (
            <VirtuosoMockContext.Provider
              value={{ viewportHeight: 2000, itemHeight: 50 }}
            >
              {children}
            </VirtuosoMockContext.Provider>
          ),
        },
        {
          templateDashboardsFilter: {
            isEditModeActive: false,
            editable: mockFilter,
            active: mockFilter,
          },
        }
      );

      await applyFiltersInteraction(user);

      await waitFor(() => {
        expect(
          screen.queryByRole('heading', {
            level: 3,
            name: 'Injuries & Illnesses',
          })
        ).toBeVisible();
      });
    });
  });

  describe('Growth & Maturation Report', () => {
    // created new mock filters as G&M only depends on population.
    const newMockFilters = {
      population: {
        applies_to_squad: false,
        all_squads: false,
        position_groups: [],
        positions: [],
        athletes: [1, 2],
        squads: [],
        context_squads: [],
      },
      timescope: {
        time_period: null,
      },
    };

    beforeEach(() => {
      useLocationPathname.mockImplementation(
        () => '/analysis/template_dashboards/growth_and_maturation'
      );
      forcePathname('/analysis/template_dashboards/growth_and_maturation');
      window.featureFlags = { 'rep-show-growth-and-maturation-report': true };
    });

    it('renders the additional widgets for growth_and_maturation', async () => {
      const user = userEvent.setup();

      render(
        <Dashboard {...props} />,
        {
          wrapper: ({ children }) => (
            <VirtuosoMockContext.Provider
              value={{ viewportHeight: 2000, itemHeight: 50 }}
            >
              {children}
            </VirtuosoMockContext.Provider>
          ),
        },
        {
          templateDashboardsFilter: {
            isEditModeActive: false,
            editable: newMockFilters,
            active: newMockFilters,
          },
        }
      );

      await applyFiltersInteraction(user, true);

      await waitFor(() => {
        expect(
          screen.queryByRole('heading', {
            level: 3,
            name: 'Growth & Maturation',
          })
        ).toBeVisible();
      });
    });
  });

  describe('isTabFormat', () => {
    beforeEach(() => {
      useLocationPathname.mockImplementation(
        () => '/analysis/template_dashboards/coaching_summary'
      );
      forcePathname('/analysis/template_dashboards/coaching_summary');
    });

    it('renders session and game summary tabs', async () => {
      const user = userEvent.setup();

      const updatedProps = {
        ...props,
        isTabFormat: true,
      };
      render(
        <Dashboard {...updatedProps} />,
        {
          wrapper: ({ children }) => (
            <VirtuosoMockContext.Provider
              value={{ viewportHeight: 2000, itemHeight: 50 }}
            >
              {children}
            </VirtuosoMockContext.Provider>
          ),
        },
        {
          templateDashboardsFilter: {
            isEditModeActive: false,
            editable: mockFilter,
            active: mockFilter,
          },
        }
      );

      await applyFiltersInteraction(user);

      await waitFor(() => {
        expect(screen.queryByText('Session Summary')).toBeVisible();
        expect(screen.queryByText('Game Summary')).toBeVisible();
      });
    });
  });

  describe('for cases where there is filters in local storage', () => {
    let resetEmptyMock;

    beforeEach(() => {
      resetEmptyMock = mockLocalStorage({
        'Reporting|templateDashboardsFilterCoaching':
          JSON.stringify(mockFilter),
      });

      useLocationPathname.mockImplementation(
        () => '/analysis/template_dashboards/coaching_summary'
      );
      forcePathname('/analysis/template_dashboards/coaching_summary');
    });

    afterEach(() => {
      resetEmptyMock();
    });

    it('renders the layout grid', async () => {
      const { container } = render(<Dashboard {...props} />);

      // Renders all squads
      await waitFor(() => {
        expect(container.getElementsByClassName('react-grid-item').length).toBe(
          2
        );
      });
    });
  });
});
