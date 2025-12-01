import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import LimitedChips from '..';

const renderLimitedChips = (props) => <LimitedChips {...props} />;

describe('LimitedChips', () => {
  const mockItems = [
    { id: '1', name: 'apple', color: 'red' },
    { id: '2', name: 'banana', color: 'yellow' },
    { id: '3', name: 'cherry', color: 'darkred' },
    { id: '4', name: 'date', color: 'brown' },
  ];

  it('should render the correct number of visible chips and a "more" chip', () => {
    render(renderLimitedChips({ items: mockItems }));

    expect(screen.getByTestId('chip-1-apple')).toBeInTheDocument();
    expect(screen.getByTestId('chip-2-banana')).toBeInTheDocument();

    const moreChip = screen.getByTestId('more-chip');
    expect(moreChip).toBeInTheDocument();
    expect(screen.getByTestId('AddIcon')).toBeInTheDocument();
    expect(moreChip).toHaveTextContent('2');
  });

  it('should show the tooltip with remaining items on hover using fireEvent', async () => {
    render(renderLimitedChips({ items: mockItems, maxVisible: 2 }));

    const moreChip = screen.getByTestId('more-chip');

    fireEvent.mouseEnter(moreChip);

    await waitFor(() => {
      const tooltipTitle = screen.getByTestId('remaining-results-tooltip');
      expect(tooltipTitle).toHaveTextContent('cherry');
      expect(tooltipTitle).toHaveTextContent('date');
    });
  });

  it('should render all chips and no "more" chip if items do not exceed maxVisible', () => {
    render(renderLimitedChips({ items: mockItems, maxVisible: 4 }));

    expect(screen.getByTestId('chip-1-apple')).toBeInTheDocument();
    expect(screen.getByTestId('chip-2-banana')).toBeInTheDocument();
    expect(screen.getByTestId('chip-3-cherry')).toBeInTheDocument();
    expect(screen.getByTestId('chip-4-date')).toBeInTheDocument();

    expect(screen.queryByTestId('more-chip')).not.toBeInTheDocument();
  });

  it('should return null if the items array is empty', () => {
    const { container } = render(renderLimitedChips({ items: [] }));
    expect(container).toBeEmptyDOMElement();
  });
});
