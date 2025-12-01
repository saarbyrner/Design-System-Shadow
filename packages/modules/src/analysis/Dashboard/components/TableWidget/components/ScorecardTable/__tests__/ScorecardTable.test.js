import { useDispatch } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { screen } from '@testing-library/react';
import i18n from 'i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ScorecardTable from '../index';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),

  connect: jest.fn(() => (Component) => {
    return Component;
  }),
  useSelector: jest.fn(),
  Provider: ({ children }) => children,
}));

jest.mock('axios');

const componentSelector = (key) => `[data-testid="ScorecardTable|${key}"]`;

describe('ScorecardTable Component', () => {
  const i18nT = i18nextTranslateStub(i18n);

  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
  });

  const props = {
    appliedColumnDetails: [
      {
        id: 1,
        time_scope: {},
        population: {
          applies_to_squad: false,
          position_groups: [25],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
        },
      },
      {
        id: 2,
        time_scope: {},
        population: {
          applies_to_squad: false,
          position_groups: [25],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
        },
      },
      {
        id: 3,
        time_scope: {},
        population: {
          applies_to_squad: false,
          position_groups: [25],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
        },
      },
    ],
    appliedRowDetails: [
      {
        id: 12,
        name: 'Fatigue',
        summary: 'mean',
        table_element: { calculation: '', cached_at: new Date().toISOString() },
      },
      {
        id: 35,
        name: 'Muscle Soreness',
        summary: 'sum',
        table_element: { calculation: '' },
      },
      {
        id: 267,
        name: 'Sleep Duration',
        summary: 'min',
        table_element: {
          calculation: '',
          cached_at: '2025-08-26T12:09:24.143+01:00',
        },
        calculatedCachedAt: new Date().toISOString(),
      },
    ],
    isEditMode: false,
    showSummary: true,
    squadAthletes: {
      id: 8,
      name: 'International Squad',
      position_groups: [
        {
          id: 25,
          name: 'Forward',
          positions: [
            {
              id: 123,
              name: 'Hooker',
              athletes: [],
            },
            {
              id: 456,
              name: 'Prop',
              athletes: [],
            },
          ],
        },
      ],
    },
    squads: [
      {
        id: 8,
        name: 'International Squad',
      },
    ],
    t: i18nT,
  };

  it('renders a metric column', () => {
    const { container } = renderWithStore(<ScorecardTable {...props} />);
    expect(
      container.getElementsByClassName('tableWidget__metric')
    ).toHaveLength(1);
  });

  it('renders a population row for each appliedMetric', () => {
    const { container } = renderWithStore(<ScorecardTable {...props} />);

    const appliedTimeScopeDOMSelector = `.tableWidget__metric
      ${componentSelector('AppliedMetric')}
      `;

    const appliedTimeScopes = container.querySelectorAll(
      appliedTimeScopeDOMSelector
    );

    expect(appliedTimeScopes).toHaveLength(3);
  });

  it('renders a column for each appliedColumnDetail', () => {
    const { container } = renderWithStore(<ScorecardTable {...props} />);
    expect(
      container.getElementsByClassName('tableWidget__column')
    ).toHaveLength(3);
  });

  it('renders the edit button when isEditMode', () => {
    const { container } = renderWithStore(
      <ScorecardTable {...props} isEditMode />
    );
    expect(
      container.getElementsByClassName('tableWidget__addColumn')
    ).toHaveLength(1);
  });

  describe('when showing the summary', () => {
    it('shows the summary column', () => {
      const { container } = renderWithStore(<ScorecardTable {...props} />);
      expect(
        container.getElementsByClassName('tableWidget__summaryColumn')
      ).toHaveLength(1);
    });

    describe('when showSummary is false', () => {
      it('does not show the summary row', () => {
        const { container } = renderWithStore(
          <ScorecardTable {...props} showSummary={false} />
        );
        expect(
          container.getElementsByClassName('tableWidget__summaryColumn')
        ).toHaveLength(0);
      });
    });

    describe('when showSummary is true', () => {
      it('renders `tableWidget__summaryColumn--disabled` when the dashboard cannot be managed', () => {
        const { container } = renderWithStore(
          <ScorecardTable
            {...props}
            canManageDashboard={false}
            dataStatus="SUCCESS"
          />
        );

        expect(
          container.getElementsByClassName(
            'tableWidget__summaryColumn--disabled'
          )
        ).toHaveLength(1);
      });

      it('does not render `tableWidget__summaryColumn--disabled` when the dashboard can be managed', () => {
        const { container } = renderWithStore(
          <ScorecardTable {...props} canManageDashboard dataStatus="SUCCESS" />
        );
        expect(
          container.getElementsByClassName(
            'tableWidget__summaryColumn--disabled'
          )
        ).toHaveLength(0);
      });
    });

    describe('cached_at rollover', () => {
      it('should display cached_at time when feature flag is enabled', async () => {
        const user = userEvent.setup();
        window.setFlag('rep-table-widget-caching', true);

        const { container } = renderWithStore(
          <ScorecardTable {...props} dataStatus="CACHING" />
        );
        const tooltipTrigger = container.getElementsByClassName(
          'tableWidget__rowHeader--calculation'
        )[0];

        await user.hover(tooltipTrigger);
        const content = await screen.findByText(
          'Last Calculated: a few seconds ago'
        );
        expect(content).toBeInTheDocument();
      });

      it('should display cached_at based on table_element.cached_at', async () => {
        const user = userEvent.setup();
        window.setFlag('rep-table-widget-caching', true);
        const { container } = renderWithStore(<ScorecardTable {...props} />);
        const tooltipTrigger = container.getElementsByClassName(
          'tableWidget__rowHeader--calculation'
        )[0];

        await user.hover(tooltipTrigger);
        const content = await screen.findByText(
          'Last Calculated: a few seconds ago'
        );
        expect(content).toBeInTheDocument();
      });

      it('should display nothing if table_element.cached_at is null', async () => {
        const user = userEvent.setup();
        window.setFlag('rep-table-widget-caching', true);
        const { container } = renderWithStore(<ScorecardTable {...props} />);
        const tooltipTrigger = container.getElementsByClassName(
          'tableWidget__rowHeader--calculation'
        )[1];

        await user.hover(tooltipTrigger);
        const content = screen.queryByText(
          'Last Calculated: a few seconds ago'
        );
        expect(content).not.toBeInTheDocument();
      });

      it('should display calculated timestamp if table_element.cached_at is present and row was updated', async () => {
        const user = userEvent.setup();
        window.setFlag('rep-table-widget-caching', true);
        const { container } = renderWithStore(<ScorecardTable {...props} />);
        const tooltipTrigger = container.getElementsByClassName(
          'tableWidget__rowHeader--calculation'
        )[2];

        await user.hover(tooltipTrigger);
        const content = await screen.findByText(
          'Last Calculated: a few seconds ago'
        );
        expect(content).toBeInTheDocument();
      });

      it('should not display cached_at time when feature flag is disabled', async () => {
        const user = userEvent.setup();
        window.setFlag('rep-table-widget-caching', false);
        const { container } = renderWithStore(
          <ScorecardTable {...props} dataStatus="CACHING" />
        );
        const tooltipTrigger = container.getElementsByClassName(
          'tableWidget__rowHeader--calculation'
        )[0];

        await user.hover(tooltipTrigger);
        const content = screen.queryByText(
          'Last Calculated: a few seconds ago'
        );
        expect(content).not.toBeInTheDocument();
      });
    });
  });
});
