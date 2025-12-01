import { render, screen } from '@testing-library/react';
import ResizeObserverPolyfill from 'resize-observer-polyfill';
import { getOtherSegementLabel } from '../constants';
import PieChart from '../components/PieChart';

describe('<PieChart />', () => {
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
    chartOptions: {
      show_label: true,
      show_legend: true,
    },
  };

  it('returns null when width is less than 10', () => {
    const { container } = render(<PieChart {...mockProps} width={1} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('returns pie segment labels when width is greater than 10', () => {
    render(<PieChart {...mockProps} />);

    expect(screen.getByText('International Squad')).toBeVisible();
    expect(screen.getByText('Academy Squad')).toBeVisible();
  });

  it('hides series specified in hiddenSeries prop', () => {
    const hiddenSeries = [{ datum: 'International Squad', hidden: true }];

    render(<PieChart {...mockProps} hiddenSeries={hiddenSeries} />);

    expect(screen.queryByText('International Squad')).not.toBeInTheDocument();
    expect(screen.getByText('Academy Squad')).toBeVisible();
  });

  it('shows all series when hiddenSeries is empty', () => {
    render(<PieChart {...mockProps} hiddenSeries={[]} />);

    expect(screen.getByText('International Squad')).toBeVisible();
    expect(screen.getByText('Academy Squad')).toBeVisible();
  });

  it('renders the Other Categories label', () => {
    const otherLabel = getOtherSegementLabel();
    const data = [
      { label: 'Openside Flanker', value: '1000' },
      { label: 'Blindside Flanker', value: '1000' },
      { label: 'Wing', value: '800' },
      { label: 'Loose-head Prop', value: '800' },
      { label: 'Tight-head Prop', value: '600' },
      { label: 'Hooker', value: '600' },
      { label: 'Inside Center', value: '500' },
      { label: 'No 8', value: '500' },
      { label: 'Other', value: '500' },
      { label: otherLabel, value: '400' },
    ];

    render(<PieChart {...mockProps} hiddenSeries={[]} data={data} />);

    expect(screen.getByText(otherLabel)).toBeVisible();
  });
});
