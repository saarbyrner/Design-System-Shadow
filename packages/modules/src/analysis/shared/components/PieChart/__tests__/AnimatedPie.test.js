import { render, screen } from '@testing-library/react';
import ResizeObserverPolyfill from 'resize-observer-polyfill';
import userEvent from '@testing-library/user-event';

import PieChart from '../components/PieChart';
import AnimatedPie from '../components/AnimatedPie';

describe('<AnimatedPie />', () => {
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
  });

  const mockProps = {
    animate: true,
    arcs: [
      {
        data: {
          label: 'International Squad',
          value: `100`,
        },
        index: 0,
        value: 100,
        startAngle: 0,
        endAngle: 3.7385165311101796,
        padAngle: 0.015,
      },
      {
        data: {
          label: 'Academy Squad',
          value: `200`,
        },
        index: 0,
        value: 200,
        startAngle: 3.7385165311101796,
        endAngle: 6.7385165311101796,
        padAngle: 0.015,
      },
    ],
    getKey: jest.fn(),
    colorAccessor: jest.fn(),
    onClickDatum: jest.fn(),
    valueFormatter: ({ value }) => `${value}`,
  };

  const pieMockProps = {
    width: 1000,
    height: 1000,
    type: 'donut',
    data: [
      {
        label: 'International Squad',
        value: 100,
      },
      {
        label: 'Academy Squad',
        value: 200,
      },
    ],
    colors: ['#2A6EBB', '#E86427', '#279C9C'],
    valueAccessor: ({ value }) => value,
    labelAccessor: ({ label }) => label,
    valueFormatter: ({ value }) => `${value}`,
    chartOptions: {
      show_label: true,
      show_values: true,
      show_percentage: true,
    },
    onMouseOut: jest.fn(),
    onMouseOver: jest.fn(),
  };

  const renderWrapper = (pieProps = pieMockProps, animteProps = mockProps) => {
    render(
      <PieChart {...pieProps}>
        <AnimatedPie {...animteProps} />
      </PieChart>
    );
  };

  it('renders the labels of the arcs', () => {
    renderWrapper();

    expect(screen.getByText('International Squad')).toBeVisible();
    expect(screen.getByText('Academy Squad')).toBeVisible();
  });

  it('renders the values of the arcs based on user selection', () => {
    renderWrapper();

    expect(screen.getByText('100')).toBeVisible();
    expect(screen.getByText('200')).toBeVisible();
  });

  it('calls the props.valueFormatter when rendering values', () => {
    const valueFormatterMock = jest.fn();
    const pieProps = { ...pieMockProps, valueFormatter: valueFormatterMock };
    const animateProps = { ...mockProps, valueFormatter: valueFormatterMock };

    renderWrapper(pieProps, animateProps);

    expect(valueFormatterMock).toHaveBeenCalledTimes(2); // 2 values rendered
  });

  it('renders the percentages of the arcs based on user selection', () => {
    renderWrapper();

    expect(screen.getByText('33%')).toBeVisible();
    expect(screen.getByText('67%')).toBeVisible();
  });

  it('calls onMouseOver when hovering over an arc', async () => {
    const user = userEvent.setup();
    renderWrapper();

    const arc = document.querySelector('path');
    await user.hover(arc);

    expect(pieMockProps.onMouseOver).toHaveBeenCalledTimes(1);
  });
});
