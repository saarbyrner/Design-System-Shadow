import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Legend from '..';
import { generateTestSeries } from '../../XYChart/__tests__/testUtils';

describe('XY Chart|<Legend />', () => {
  const mockSetHiddenSeries = jest.fn();
  const mockSeries = {
    123: {
      ...generateTestSeries(),
      isGrouped: true,
      name: 'Series 123',
      data: [
        {
          label: 'Athlete 1',
          values: [
            {
              label: 'International Squad',
              value: '100',
            },
            {
              label: 'Academy Team',
              value: '50',
            },
          ],
        },
        {
          label: 'Athlete 2',
          values: [
            {
              label: 'International Squad',
              value: '50',
            },
            {
              label: 'Academy Squad',
              value: '50',
            },
          ],
        },
      ],
    },
  };

  const labels = [
    // first 3 are series 123, split into groupings
    {
      datum: '123-International Squad',
      index: 0,
      text: 'International Squad',
      value: '#F39C11',
    },
    {
      datum: '123-Academy Squad',
      index: 1,
      text: 'Academy Squad',
      value: '#3A8DEE',
    },
    {
      datum: '123-Academy Team',
      index: 2,
      text: 'Academy Team',
      value: '#F8CD47',
    },
    // this is series 456
    {
      datum: '456',
      index: 3,
      text: '456',
      value: '#00FF00',
    },
  ];

  const props = {
    labels,
    hiddenSeries: [],
    setHiddenSeries: mockSetHiddenSeries,
    series: mockSeries,
    isMultiSeries: false,
  };

  describe('when the series is not a multi series and is grouped', () => {
    it('renders all labels formatted to display the grouping', () => {
      render(<Legend {...props} />);

      const expectedLabels = [
        'International Squad',
        'Academy Squad',
        'Academy Team',
      ];

      expectedLabels.forEach((label) => {
        expect(screen.getByText(label)).toBeVisible();
      });
    });
  });

  describe('when the series is a multi series and contains a grouped series and non-grouped series', () => {
    it('renders the grouped labels formatted to display the series name - grouping', () => {
      const multiSeries = {
        ...mockSeries,
        456: {
          ...generateTestSeries(),
          isGrouped: false,
          name: 'Series 456',
          data: [
            {
              label: 'Athlete 1',
              value: '200',
            },
            {
              label: 'Athlete 2',
              value: '150',
            },
          ],
        },
      };
      render(<Legend {...props} series={multiSeries} isMultiSeries />);
      // formatted: seriesName - grouping
      const expectedLabels = [
        'Series 123 - International Squad',
        'Series 123 - Academy Squad',
        'Series 123 - Academy Team',
      ];

      expectedLabels.forEach((label) => {
        expect(screen.getByText(label)).toBeVisible();
      });
    });

    it('renders the non-grouped labels formatted to display the series name', () => {
      const multiSeries = {
        ...mockSeries,
        456: {
          ...generateTestSeries(),
          isGrouped: false,
          name: 'Series 456',
          data: [
            {
              label: 'Athlete 1',
              value: '200',
            },
            {
              label: 'Athlete 2',
              value: '150',
            },
          ],
        },
      };
      render(<Legend {...props} series={multiSeries} isMultiSeries />);
      // formatted: seriesName
      const expectedLabel = 'Series 456';

      expect(screen.getByText(expectedLabel)).toBeVisible();
    });
  });

  describe('clicking the labels', () => {
    it('handles hiding a series', async () => {
      const user = userEvent.setup();

      render(<Legend {...props} />);

      await user.click(screen.getByText('International Squad'));

      expect(mockSetHiddenSeries).toHaveBeenCalledWith([labels[0]]);
    });

    it('handles showing a hidden series', async () => {
      const user = userEvent.setup();

      render(<Legend {...props} hiddenSeries={[labels[0]]} />);

      await user.click(screen.getByText('International Squad'));

      expect(mockSetHiddenSeries).toHaveBeenCalledWith([]);
    });
  });

  describe('clicking the legend circle keys', () => {
    it('handles hiding a series', async () => {
      const user = userEvent.setup();

      render(<Legend {...props} />);

      await user.click(screen.getByTestId(`Chart|Cicle-${labels[0].text}`));

      expect(mockSetHiddenSeries).toHaveBeenCalledWith([labels[0]]);
    });

    it('handles showing a hidden series', async () => {
      const user = userEvent.setup();

      render(<Legend {...props} hiddenSeries={[labels[0]]} />);

      await user.click(screen.getByTestId(`Chart|Cicle-${labels[0].text}`));

      expect(mockSetHiddenSeries).toHaveBeenCalledWith([]);
    });
  });

  describe('Legend label formatting cases', () => {
    const legendCases = [
      {
        datum: '123_0-4-3-3',
        index: 0,
        text: '123_0-4-3-3',
        value: '3',
      },
      {
        datum: '123_0--Center',
        index: 1,
        text: '123_0--Center',
        value: '6',
      },
      {
        datum: undefined,
        index: 3,
        text: 'undefined',
        value: '7',
      },
      {
        datum: '278_0-5-4-1 Flat',
        index: 4,
        text: '278_0-5-4-1 Flat',
        value: '7',
      },
    ];

    const propsWithCases = {
      labels: legendCases,
      hiddenSeries: [],
      setHiddenSeries: mockSetHiddenSeries,
      series: mockSeries,
      isMultiSeries: false,
    };

    it('handles single dash in label.datum', () => {
      render(<Legend {...propsWithCases} />);
      expect(screen.getByText('4-3-3')).toBeVisible();
    });

    it('handles double dash in label.datum', () => {
      render(<Legend {...propsWithCases} />);
      expect(screen.getByText('-Center')).toBeVisible(); // Expect the first dash to be removed
    });

    it('handles undefined label.datum', () => {
      render(<Legend {...propsWithCases} />);
      expect(screen.queryByText('undefined')).not.toBeInTheDocument(); // Should not display 'undefined'
    });

    it('handles empty spaces in label.datum', () => {
      render(<Legend {...propsWithCases} />);
      expect(screen.queryByText('5-4-1 Flat')).toBeVisible();
    });
  });

  describe('when prop isStatic is true', () => {
    it('renders all text labels', () => {
      render(<Legend {...props} isStatic />);

      const expectedLabels = [
        'International Squad',
        'Academy Squad',
        'Academy Team',
        '456',
      ];

      expectedLabels.forEach((label) => {
        expect(screen.getByText(label)).toBeVisible();
      });
    });
  });
});
