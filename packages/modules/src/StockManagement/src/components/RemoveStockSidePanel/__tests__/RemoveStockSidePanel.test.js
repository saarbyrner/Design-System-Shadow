import { act, render, screen, within } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import RemoveStockSidePanel from '..';

const props = {
  t: i18nextTranslateStub(),
  onSaveStock: Function,
};

// tests to be revisited.
describe('<RemoveStockSidePanel/>', () => {
  it('renders correct default sidepanel', async () => {
    act(() => {
      render(<RemoveStockSidePanel {...props} />);
    });

    expect(screen.getByText('Remove Stock')).toBeInTheDocument();

    // Close & Save buttons
    expect(
      screen.getByTestId('sliding-panel|close-button')
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId('StockManagement|Actions')).getByRole(
        'button',
        { hidden: true }
      )
    ).toHaveTextContent('Remove');

    expect(screen.getByText('Item name / strength')).toBeInTheDocument();
    expect(screen.getByText('Lot no.')).toBeInTheDocument();
    expect(screen.getByText('Exp. date')).toBeInTheDocument();
    expect(screen.getByText('On hand')).toBeInTheDocument();

    expect(screen.getByTestId('StockManagement|Actions')).toBeInTheDocument();
  });
});
