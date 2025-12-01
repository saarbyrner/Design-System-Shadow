import { screen } from '@testing-library/react';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import userEvent from '@testing-library/user-event';
import ActionsMenu from '../ActionsMenu';

describe('ActionsMenu', () => {
  const props = {
    items: [
      { id: 'item_1', title: 'Item 1', onClick: jest.fn() },
      { id: 'item_2', title: 'Item 2', onClick: jest.fn() },
    ],
  };

  it('renders the action buttons and menu', async () => {
    renderWithProviders(<ActionsMenu {...props} />);

    await userEvent.click(screen.getAllByTestId('MoreVertIcon')[0]);

    await userEvent.click(screen.getByRole('menuitem', { name: /Item 1/i }));
    expect(props.items[0].onClick).toHaveBeenCalled();

    await userEvent.click(screen.getByRole('menuitem', { name: /Item 2/i }));
    expect(props.items[1].onClick).toHaveBeenCalled();
  });
});
