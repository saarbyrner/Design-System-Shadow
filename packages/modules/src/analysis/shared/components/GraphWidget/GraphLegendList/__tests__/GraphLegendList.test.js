import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { colors } from '@kitman/common/src/variables';
import GraphLegendList from '..';

describe('Graph Composer <GraphLegendList /> component', () => {
  const mockOnClick = jest.fn();

  const defaultProps = {
    legendList: [
      {
        label: 'Legend 1',
        items: [
          {
            id: 1,
            type: 'serie',
            name: 'Item 1',
            colour: colors.white,
            isDisabled: false,
            serieIndex: 0,
          },
          {
            id: 2,
            type: 'serie',
            name: 'Item 2',
            colour: colors.white,
            isDisabled: true,
            serieIndex: 0,
          },
        ],
      },
      {
        label: 'Legend 2',
        items: [
          {
            id: 3,
            type: 'serie',
            name: 'Item 3',
            colour: colors.white,
            isDisabled: false,
            serieIndex: 0,
          },
          {
            id: 4,
            type: 'serie',
            name: 'Item 4',
            colour: colors.white,
            isDisabled: true,
            serieIndex: 0,
          },
        ],
      },
    ],
    onClick: mockOnClick,
    condensed: true,
    t: (text) => text,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the graph legend list', () => {
    const { container } = render(<GraphLegendList {...defaultProps} />);

    // Check that the main container is rendered
    const legendContainer = container.querySelector('.graphLegendList');
    expect(legendContainer).toBeInTheDocument();
    expect(legendContainer).toHaveClass('graphLegendList');

    // Check that both legend labels are present
    expect(screen.getByText('Legend 1')).toBeInTheDocument();
    expect(screen.getByText('Legend 2')).toBeInTheDocument();

    // Check that all legend items are present
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
    expect(screen.getByText('Item 4')).toBeInTheDocument();
  });

  it('calls the click prop when clicking a legend item', async () => {
    const user = userEvent.setup();
    render(<GraphLegendList {...defaultProps} />);

    // Click on the first item in the second legend (Item 3)
    const item3 = screen.getByText('Item 3');
    await user.click(item3);

    // Verify the onClick was called with the correct parameters
    expect(mockOnClick).toHaveBeenCalledWith(
      1,
      defaultProps.legendList[1].items[0]
    );
  });

  it('renders a toggleable legend when props.toggleable is true', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <GraphLegendList {...defaultProps} toggleable />
    );

    const legendContainer = container.querySelector('.graphLegendList');

    // Check that the toggleable class is applied
    expect(legendContainer).toHaveClass('graphLegendList--toggleable');

    // The legend is closed on the first render
    expect(legendContainer).toHaveClass('graphLegendList--close');
    expect(legendContainer).not.toHaveClass('graphLegendList--open');

    // Find and click the legend toggle button
    const toggleButton = screen.getByText('Legend');
    await user.click(toggleButton);

    // Verify the legend opens after clicking
    expect(legendContainer).not.toHaveClass('graphLegendList--close');
    expect(legendContainer).toHaveClass('graphLegendList--open');
  });

  it("doesn't render a toggleable legend when props.toggleable is false", () => {
    const { container } = render(<GraphLegendList {...defaultProps} />);

    const legendContainer = container.querySelector('.graphLegendList');

    // Check that the toggleable class is not applied
    expect(legendContainer).not.toHaveClass('graphLegendList--toggleable');
  });
});
