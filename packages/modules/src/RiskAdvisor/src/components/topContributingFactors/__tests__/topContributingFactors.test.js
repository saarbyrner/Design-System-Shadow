import { render, screen } from '@testing-library/react';
import ResizeObserverPolyfill from 'resize-observer-polyfill';

import TopContributingFactors, {
  transformGraphData,
  filterData,
} from '../index';
import {
  mockedTCFGraphDataResponse,
  mockTCFGraphData,
} from '../resources/chartDummyData';

describe('topContributingFactors', () => {
  beforeEach(() => {
    // Setup ResizeObserver polyfill
    delete window.ResizeObserver;
    window.ResizeObserver = ResizeObserverPolyfill;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('transformGraphData', () => {
    it('returns the correct graph data', () => {
      const result = transformGraphData(mockedTCFGraphDataResponse);
      expect(result).toEqual(mockTCFGraphData);
    });
  });

  describe('filterData', () => {
    it('filters the first 10 data points correctly', () => {
      const filteredData = mockTCFGraphData.slice(0, 10);
      const result = filterData(mockTCFGraphData, 'top_10');
      expect(result).toEqual(filteredData);
    });

    it('filters the first 20 data points correctly', () => {
      const filteredData = mockTCFGraphData.slice(0, 20);
      const result = filterData(mockTCFGraphData, 'top_20');
      expect(result).toEqual(filteredData);
    });

    it('filters the first 40 data points correctly', () => {
      const filteredData = mockTCFGraphData.slice(0, 40);
      const result = filterData(mockTCFGraphData, 'top_40');
      expect(result).toEqual(filteredData);
    });
  });

  describe('TopContributingFactors component', () => {
    const defaultProps = {
      graphData: mockedTCFGraphDataResponse,
      t: (key) => key,
    };

    it('renders successfully', () => {
      render(<TopContributingFactors {...defaultProps} />);

      expect(screen.getByText('Top influencing factors')).toBeInTheDocument();
    });

    it('renders no data message when graphData is empty', () => {
      render(<TopContributingFactors {...defaultProps} graphData={[]} />);

      expect(screen.getByText('No data to display')).toBeInTheDocument();
    });

    it('renders filter options when data is available', () => {
      render(<TopContributingFactors {...defaultProps} />);

      expect(screen.getByText('Show')).toBeInTheDocument();
    });

    it('does not render filter options when no data is available', () => {
      render(<TopContributingFactors {...defaultProps} graphData={[]} />);

      expect(screen.queryByText('Show')).not.toBeInTheDocument();
    });

    it('renders info icon with tooltip content', () => {
      render(<TopContributingFactors {...defaultProps} />);

      const infoIcon = document.querySelector('.icon-info');
      expect(infoIcon).toBeInTheDocument();
    });
  });
});
