import { render, within, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getDummyData } from '@kitman/modules/src/analysis/shared/resources/graph/DummyData';
import ResizeObserverPolyfill from 'resize-observer-polyfill';
import ValueVisualisation from '..';

const { ResizeObserver } = window;

describe('<ValueVisualisation />', () => {
  const mockCloseGraphModal = jest.fn();
  const mockOpenRenameGraphModal = jest.fn();

  const defaultProps = {
    canSaveGraph: true,
    closeGraphModal: mockCloseGraphModal,
    graphType: 'value',
    graphData: getDummyData('value_visualisation'),
    openRenameGraphModal: mockOpenRenameGraphModal,
    isGraphExpanded: false,
  };

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

  it('renders the value visualisation graph', () => {
    render(<ValueVisualisation {...defaultProps} />);

    const value = screen.getByText('32');
    expect(value).toBeInTheDocument();
    expect(value).toHaveClass('valueVisualisation__value');

    const labelUnit = screen.getByText('Total');
    expect(labelUnit).toBeInTheDocument();
    expect(labelUnit).toHaveClass('valueVisualisation__unit');
  });

  it('expands the graph when isGraphExpanded is true', () => {
    render(<ValueVisualisation {...defaultProps} isGraphExpanded />);

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
  });

  it('calls the correct callback when closing the modal', async () => {
    const user = userEvent.setup();
    render(<ValueVisualisation {...defaultProps} isGraphExpanded />);

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();

    const buttons = within(modal).getAllByRole('button');

    // Close button
    await user.click(buttons[0]);
    expect(mockCloseGraphModal).toHaveBeenCalledTimes(1);
  });

  it('shows the table graph when graphType is table', () => {
    render(<ValueVisualisation {...defaultProps} graphType="table" />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    expect(within(table).getByText('Name')).toBeInTheDocument();
    expect(within(table).getByText('Data')).toBeInTheDocument();
    expect(within(table).getByText('Value')).toBeInTheDocument();
  });
});
