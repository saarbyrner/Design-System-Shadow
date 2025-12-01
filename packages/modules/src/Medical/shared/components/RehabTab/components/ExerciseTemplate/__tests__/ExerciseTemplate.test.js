import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExerciseTemplate from '../index';

describe('<ExerciseTemplate />', () => {
  const onFavouriteButtonSpy = jest.fn();
  const onClickedSpy = jest.fn();

  const props = {
    title: 'My Exercise template',
    templateId: 'test',
    isFavourite: false,
    onToggleFavourite: onFavouriteButtonSpy,
    disabled: false,
    onClicked: onClickedSpy,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays the correct template details', async () => {
    render(<ExerciseTemplate {...props} />);
    expect(screen.getByText('My Exercise template')).toBeInTheDocument();

    const dragHandle = screen.getByTestId('Rehab|DragHandle');
    expect(dragHandle).toBeVisible();

    const favouriteButtonContainer = screen.queryByTestId(
      'Rehab|FavouriteButton'
    );
    expect(favouriteButtonContainer).toBeInTheDocument();

    const favouriteButton = await within(favouriteButtonContainer).findByRole(
      'button'
    );
    expect(favouriteButton).toBeInTheDocument();
    await userEvent.click(favouriteButton);
    expect(onFavouriteButtonSpy).toHaveBeenCalledWith(false, 'test');
  });

  it('call to onClicked when clicked', async () => {
    render(<ExerciseTemplate {...props} />);

    const dragHandle = screen.getByTestId('Rehab|DragHandle');
    expect(dragHandle).toBeVisible();

    const clickArea = screen.getByTestId('Rehab|ExerciseTemplateClickArea');
    expect(clickArea).toBeInTheDocument();
    await userEvent.click(clickArea);
    expect(onClickedSpy).toHaveBeenCalled();
  });

  it('does not call to onClicked when disabled', async () => {
    render(<ExerciseTemplate {...props} disabled />);

    const clickArea = screen.queryByTestId('Rehab|ExerciseTemplateClickArea');
    expect(clickArea).toBeInTheDocument();
    await userEvent.click(clickArea);
    expect(onClickedSpy).not.toHaveBeenCalled();
  });
});
