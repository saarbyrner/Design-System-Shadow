import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FavouriteButton from '../index';

jest.mock('@kitman/components/src/DelayedLoadingFeedback');

describe('<RehabFilters />', () => {
  const onClickButtonSpy = jest.fn();

  const props = {
    itemId: 1,
    isFavourite: false,
    onToggle: onClickButtonSpy,
  };

  it('displays the favourite button', async () => {
    render(<FavouriteButton {...props} />);
    const button = await screen.findByRole('button');
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    expect(onClickButtonSpy).toHaveBeenCalledWith(false, 1);
  });
});
