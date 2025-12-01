import { render, screen, fireEvent } from '@testing-library/react';
import { MandatoryFieldsToastTranslated as MandatoryFieldsToast } from '../MandatoryFieldsToast';

describe('MandatoryFieldsToast', () => {
  it('should render correctly and respond to user actions', () => {
    const mockEditGame = jest.fn();
    const mockClose = jest.fn();

    render(
      <MandatoryFieldsToast
        isVisible
        t={(text) => text}
        editGame={mockEditGame}
        close={mockClose}
      />
    );

    expect(
      screen.getByText(
        'Game events cannot be added until mandatory game details are complete.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Edit game details')).toBeInTheDocument();
    expect(screen.getByText('Ignore')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Edit game details'));

    expect(mockEditGame).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Ignore'));

    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
