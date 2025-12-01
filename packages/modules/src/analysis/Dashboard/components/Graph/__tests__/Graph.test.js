import { render, screen } from '@testing-library/react';
import {
  getDummyResponseData,
  DummyVariablesHash,
} from '@kitman/modules/src/analysis/shared/resources/graph/DummyData';
import {
  transformGraphResponse,
  transformSummaryResponse,
} from '@kitman/modules/src/analysis/GraphComposer/src/utils';
import ResizeObserverPolyfill from 'resize-observer-polyfill';
import Graph from '..';

describe('<Graph />', () => {
  const longitudinalGraphData = transformGraphResponse(
    getDummyResponseData('longitudinal', 'line', 123),
    'longitudinal'
  ).graphData;

  const props = {
    graphData: longitudinalGraphData,
    condensed: false,
    onUpdateAggregationPeriod: jest.fn(),
  };

  const { ResizeObserver } = window;

  beforeEach(() => {
    delete window.ResizeObserver;
    window.ResizeObserver = ResizeObserverPolyfill;
    window.HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 1000,
      height: 600,
    }));
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    jest.resetAllMocks();
  });

  it('renders', () => {
    const { container } = render(<Graph {...props} />);

    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText('This Week')).toBeInTheDocument();
    expect(screen.getByText('Legend')).toBeInTheDocument();
  });

  describe('When the graph is a summary graph', () => {
    const summaryGraphData = transformSummaryResponse(
      getDummyResponseData('summary'),
      DummyVariablesHash
    ).graphData;

    it('renders the graph', () => {
      const { container } = render(
        <Graph {...props} graphData={summaryGraphData} />
      );

      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText('Entire Squad')).toBeInTheDocument();
      expect(screen.getByText('Loose-head Prop:')).toBeInTheDocument();
    });
  });

  describe('When the graph is a summary bar graph', () => {
    const summaryBarGraphData = transformGraphResponse(
      getDummyResponseData('summaryBar'),
      'summary_bar'
    ).graphData;

    it('renders the graph', () => {
      const { container } = render(
        <Graph {...props} graphData={summaryBarGraphData} />
      );

      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText('Athlete 1')).toBeInTheDocument();
    });
  });

  describe('When the graph is a summary donut graph', () => {
    const summaryDonutGraphData = transformGraphResponse(
      getDummyResponseData('summaryDonut'),
      'summary_donut'
    ).graphData;

    it('renders the graph', () => {
      const { container } = render(
        <Graph {...props} graphData={summaryDonutGraphData} />
      );

      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText('Chest')).toBeInTheDocument();
      expect(screen.getByText('Ankle')).toBeInTheDocument();
    });
  });

  describe('When the graph is a longitudinal table graph', () => {
    const tableGraphData = transformGraphResponse(
      getDummyResponseData('longitudinal', 'table', 123),
      'longitudinal'
    ).graphData;

    it('renders the graph', () => {
      const { container } = render(
        <Graph {...props} graphData={tableGraphData} />
      );

      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText('23/07')).toBeInTheDocument();
      expect(screen.getByText('24/07')).toBeInTheDocument();
    });
  });

  describe('When the graph is a summary donut table graph', () => {
    const summaryDonutGraphData = transformGraphResponse(
      getDummyResponseData('summaryDonut', 'table'),
      'summary_donut'
    ).graphData;

    it('renders the graph', () => {
      const { container } = render(
        <Graph {...props} graphData={summaryDonutGraphData} />
      );

      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText('Ankle')).toBeInTheDocument();
      expect(screen.getByText('45')).toBeInTheDocument();
    });
  });
});
