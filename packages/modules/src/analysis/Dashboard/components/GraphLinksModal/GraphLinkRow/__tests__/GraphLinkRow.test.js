import { screen } from '@testing-library/react';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import GraphLinkRow from '..';

describe('<GraphLinkRow />', () => {
  const props = {
    index: 1,
    graphLink: {
      dashboardId: '4',
      metrics: ['1'],
    },
    metricList: [
      { id: '1', name: 'Metric 1' },
      { id: '2', name: 'Metric 2' },
    ],
    disabledMetrics: ['1'],
    dashboardList: [{ id: '4', title: 'Dashboard 4' }],
    onClickRemoveGraphLinkRow: jest.fn(),
    onSelectGraphLinkOrigin: jest.fn(),
    onUnselectGraphLinkOrigin: jest.fn(),
    onSelectGraphLinkTarget: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the row index', () => {
    renderWithStore(<GraphLinkRow {...props} />);

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders a dashboard list dropdown', () => {
    renderWithStore(<GraphLinkRow {...props} />);

    expect(screen.getAllByText('Dashboard 4')[0]).toBeInTheDocument();
  });

  it('renders a metric list dropdown', () => {
    renderWithStore(<GraphLinkRow {...props} />);

    expect(screen.getByText('Metric 1')).toBeInTheDocument();
  });

  describe('when revealIncompleteEntries is true', () => {
    it('reveals incomplete entries: dashboardId is null, metrics has items', () => {
      const propsWithNullDashboard = {
        ...props,
        revealIncompleteEntries: true,
        graphLink: {
          dashboardId: null,
          metrics: ['1'],
        },
      };

      renderWithStore(<GraphLinkRow {...propsWithNullDashboard} />);

      expect(
        screen.getByText('Please select a dashboard to proceed')
      ).toBeInTheDocument();
    });

    it('reveals incomplete entries: dashboardId has value, metrics is empty', () => {
      const propsWithEmptyMetrics = {
        ...props,
        revealIncompleteEntries: true,
        graphLink: {
          dashboardId: '1',
          metrics: [],
        },
      };

      renderWithStore(<GraphLinkRow {...propsWithEmptyMetrics} />);

      expect(
        screen.getByText('Please select a metric to proceed')
      ).toBeInTheDocument();
    });

    it('reveals incomplete entries: both dashboardId and metrics are empty/null', () => {
      const propsWithBothEmpty = {
        ...props,
        revealIncompleteEntries: true,
        graphLink: {
          dashboardId: null,
          metrics: [],
        },
      };

      renderWithStore(<GraphLinkRow {...propsWithBothEmpty} />);

      expect(
        screen.queryByText('Please select a dashboard to proceed')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Please select a metric to proceed')
      ).not.toBeInTheDocument();
    });
  });

  describe('when revealIncompleteEntries is false', () => {
    it("doesn't reveal incomplete entries: dashboardId is null, metrics has items", () => {
      const propsWithNullDashboard = {
        ...props,
        revealIncompleteEntries: false,
        graphLink: {
          dashboardId: null,
          metrics: ['1'],
        },
      };

      renderWithStore(<GraphLinkRow {...propsWithNullDashboard} />);

      expect(
        screen.queryByText('Please select a dashboard to proceed')
      ).not.toBeInTheDocument();
    });

    it("doesn't reveal incomplete entries: dashboardId has value, metrics is empty", () => {
      const propsWithEmptyMetrics = {
        ...props,
        revealIncompleteEntries: false,
        graphLink: {
          dashboardId: '1',
          metrics: [],
        },
      };

      renderWithStore(<GraphLinkRow {...propsWithEmptyMetrics} />);

      expect(
        screen.queryByText('Please select a metric to proceed')
      ).not.toBeInTheDocument();
    });

    it("doesn't reveal incomplete entries:both dashboardId and metrics are empty/null", () => {
      const propsWithBothEmpty = {
        ...props,
        revealIncompleteEntries: false,
        graphLink: {
          dashboardId: null,
          metrics: [],
        },
      };

      renderWithStore(<GraphLinkRow {...propsWithBothEmpty} />);

      expect(
        screen.queryByText('Please select a dashboard to proceed')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Please select a metric to proceed')
      ).not.toBeInTheDocument();
    });
  });
});
