import { render, fireEvent, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import FormationChangeConfirmationModal from '..';

describe('FormationChangeConfirmationModal', () => {
  it('should render the modal with the correct content', () => {
    const props = {
      show: true,
      setShow: jest.fn(),
      name: 'formation',
      changeName: '5-3-2',
      onConfirm: jest.fn(),
      t: i18nextTranslateStub(),
    };

    render(<FormationChangeConfirmationModal {...props} />);

    expect(screen.getByText('Formation change')).toBeInTheDocument();

    expect(
      screen.getByText(
        'Changing the formation will clear the current period and reset the format for subsequent unedited periods. Are you sure you want to continue?'
      )
    ).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton);
    expect(props.setShow).toHaveBeenCalledWith(false);

    const changeButton = screen.getByText('Change formation to 5-3-2');
    expect(changeButton).toBeInTheDocument();
    fireEvent.click(changeButton);
    expect(props.onConfirm).toHaveBeenCalled();
  });
});
