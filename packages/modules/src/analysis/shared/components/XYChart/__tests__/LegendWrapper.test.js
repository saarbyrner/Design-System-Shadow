import { render, screen } from '@testing-library/react';
import useChartContext from '../hooks/useChartContext';
import LegendWrapper from '../components/LegendWrapper';
import { generateTestSeries } from './testUtils';

jest.mock('../hooks/useChartContext');

describe('XY Chart|<LegendWrapper />', () => {
  const mockSetHiddenSeries = jest.fn();

  describe('when it is not a multi series and the series is not grouped', () => {
    beforeEach(() => {
      useChartContext.mockReturnValue({
        series: {
          123: {
            ...generateTestSeries(),
            isGrouped: false,
            data: [
              {
                label: 'label 1',
                values: [
                  {
                    label: 'Series 1',
                    value: 123,
                  },
                  {
                    label: 'Series 2',
                    value: 456,
                  },
                ],
              },
              {
                label: 'label 2',
                values: [
                  {
                    label: 'Series 1',
                    value: 123,
                  },
                  {
                    label: 'Series 2',
                    value: 456,
                  },
                ],
              },
            ],
          },
        },
        controls: {
          hiddenSeries: [],
        },
        controlsApi: {
          setHiddenSeries: mockSetHiddenSeries,
        },
      });
    });

    it('does not render the Legend', () => {
      render(<LegendWrapper />);

      expect(
        screen.queryByTestId('XYChart|LegendWrapper')
      ).not.toBeInTheDocument();
    });
  });
});
