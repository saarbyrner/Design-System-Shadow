import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import ImageUploadModal from '..';

describe('<ImageUploadModal />', () => {
  const props = {
    title: 'Image Upload Modal Title',
    onClickCloseModal: jest.fn(),
    onClickSaveImage: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('contains a modal', () => {
    render(<ImageUploadModal {...props} />);
    expect(
      screen
        .getByText('Image Upload Modal Title')
        .closest('.ReactModal__Content')
    ).toBeInTheDocument();
  });

  it('has the correct modal title', () => {
    render(<ImageUploadModal {...props} />);
    expect(screen.getByText('Image Upload Modal Title')).toBeInTheDocument();
  });

  it('has an empty modal footer', () => {
    render(<ImageUploadModal {...props} />);
    expect(
      screen
        .getByText('Image Upload Modal Title')
        .closest('.ReactModal__Content')
        .querySelector('footer')
    ).toBeEmptyDOMElement();
  });

  it('calls the correct callback when closing the modal', async () => {
    render(<ImageUploadModal {...props} />);
    await userEvent.click(
      screen
        .getByText('Image Upload Modal Title')
        .parentNode.querySelector('button.reactModal__closeBtn')
    );
    expect(props.onClickCloseModal).toHaveBeenCalled();
  });
});
