import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import Modal from '..';

describe('Modal component', () => {
  const props = {
    isOpen: true,
    width: 'large',
    onPressEscape: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('renders the correct content', () => {
    render(
      <Modal {...props}>
        <Modal.Header>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Content>Modal content</Modal.Content>
        <Modal.Footer>Modal footer</Modal.Footer>
      </Modal>
    );

    expect(screen.getByTestId('Modal|Title')).toHaveTextContent('Modal title');
    expect(screen.getByTestId('Modal|Content')).toHaveTextContent(
      'Modal content'
    );
    expect(screen.getByTestId('Modal|Footer')).toHaveTextContent(
      'Modal footer'
    );
  });

  describe('When the user presses escape', () => {
    it('calls onPressEscape', () => {
      render(<Modal {...props} />);

      const escapeEvent = new KeyboardEvent('keydown', { keyCode: 27 });
      document.dispatchEvent(escapeEvent);

      expect(props.onPressEscape).toHaveBeenCalledTimes(1);
    });
  });
});
