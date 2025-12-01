import { render, screen } from '@testing-library/react';
import { XYChart, DataContext } from '@visx/xychart';
import GroupDataLabel from '../components/GroupDataLabel';

const mockData = {
  groupKeys: ['Left', 'Center'],
  label: 'Center',
  showLabels: true,
  dataKey: '267_0-Left',
  data: [
    {
      label: 'Knee',
      values: [
        { label: 'Left', value: '1' },
        { label: 'Right', value: '1' },
      ],
    },
    {
      label: 'Other',
      values: [{ label: 'Left', value: '1' }],
    },
  ],
  valueFormatter: ({ value }) => value,
  labelAccessor: ({ value }) => value ?? null,
};

const mockDataRegistry = {
  key: '267_0-Left',
  data: [
    {
      label: 'Knee',
      value: '1',
    },
    {
      label: 'Other',
      value: '1',
    },
    {
      label: 'Shoulder',
      value: '1',
    },
  ],
};

const renderGroupDataLabel = (
  xScale,
  yScale,
  dataRegistry,
  dataProps = mockData
) => {
  return render(
    <XYChart
      xScale={{ type: 'band' }}
      yScale={{ type: 'linear' }}
      height={300}
      width={400}
    >
      <DataContext.Provider value={{ xScale, yScale, dataRegistry }}>
        <GroupDataLabel {...dataProps} />
      </DataContext.Provider>
    </XYChart>
  );
};

describe('XY Chart|<GroupDataLabel />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all group data labels correctly with nested values', () => {
    const xScale = jest.fn().mockImplementation((label) => {
      switch (label) {
        case 'Knee':
          return 50;
        case 'Other':
          return 150;
        default:
          return 0;
      }
    });
    xScale.bandwidth = jest.fn().mockReturnValue(100);

    const yScale = jest.fn().mockReturnValue(200);
    const dataRegistry = new Map().set(mockData.dataKey, {
      data: mockDataRegistry.data,
    });

    renderGroupDataLabel(xScale, yScale, dataRegistry);

    mockData.data.forEach((group) => {
      group.values.forEach((datum) => {
        const textElements = screen.getAllByText(datum.value);

        textElements.forEach((element) => {
          expect(element).toBeInTheDocument();
          expect(element).toHaveStyle('opacity: 1');
        });
      });
    });
  });

  it('renders with different scale values', () => {
    const xScale = jest.fn().mockImplementation((label) => {
      switch (label) {
        case 'Knee':
          return 100;
        case 'Other':
          return 200;
        default:
          return 0;
      }
    });
    xScale.bandwidth = jest.fn().mockReturnValue(120);

    const yScale = jest.fn().mockReturnValue(300);
    const dataRegistry = new Map().set(mockData.dataKey, {
      data: mockDataRegistry.data,
    });

    renderGroupDataLabel(xScale, yScale, dataRegistry);

    mockData.data.forEach((group) => {
      group.values.forEach((datum) => {
        const textElements = screen.getAllByText(datum.value);

        textElements.forEach((element) => {
          expect(element).toBeInTheDocument();
          expect(element).toHaveStyle('opacity: 1');
        });
      });
    });
  });

  it('handles undefined values', () => {
    const xScale = jest.fn().mockReturnValue(50);
    xScale.bandwidth = jest.fn().mockReturnValue(100);

    const yScale = jest.fn().mockReturnValue(200);

    const dataRegistry = new Map().set(mockData.dataKey, {
      data: [
        { label: 'Knee', value: undefined },
        { label: 'Other', value: null },
        { label: 'Shoulder', value: '1' },
      ],
    });

    renderGroupDataLabel(xScale, yScale, dataRegistry);

    expect(screen.queryAllByText('undefined').length).toBe(0);
    expect(screen.queryAllByText('null').length).toBe(0);

    const textElements = screen.getAllByText('1');
    textElements.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
  });

  it('does not render labels when showLabels is false', () => {
    const xScale = jest.fn().mockReturnValue(50);
    xScale.bandwidth = jest.fn().mockReturnValue(100);

    const yScale = jest.fn().mockReturnValue(200);

    const dataRegistry = new Map().set(mockData.dataKey, {
      data: mockDataRegistry.data,
    });

    const modifiedMockData = { ...mockData, showLabels: false };

    renderGroupDataLabel(xScale, yScale, dataRegistry, modifiedMockData);

    mockData.data.forEach((group) => {
      group.values.forEach((datum) => {
        const textElements = screen.queryAllByText(datum.value);

        textElements.forEach((element) => {
          expect(element).toBeInTheDocument();
          expect(element).toHaveStyle('opacity: 0');
        });
      });
    });
  });
});
