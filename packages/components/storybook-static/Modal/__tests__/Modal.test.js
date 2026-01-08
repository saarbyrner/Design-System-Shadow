import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../index';

describe('Modal component', () => {
  const closeModal = jest.fn();
  const props = {
    isOpen: true,
    title: 'Modal Title',
    close: closeModal,
  };

  it('displays the title', () => {
    render(
      <Modal {...props}>
        <p>Child element</p>
      </Modal>
    );
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
      'Modal Title'
    );
  });

  it('fires the close callback', async () => {
    render(
      <Modal {...props}>
        <p>Child element</p>
      </Modal>
    );

    await userEvent.click(screen.getByRole('button'));
    expect(props.close).toHaveBeenCalledTimes(1);
  });

  it('renders its children', () => {
    render(
      <Modal {...props}>
        <p data-testid="Modal|Content">Child element</p>
      </Modal>
    );
    expect(screen.getByTestId('Modal|Content')).toHaveTextContent(
      'Child element'
    );
  });

  describe('when a width is provided', () => {
    it('sets the width', () => {
      render(
        <Modal {...props} width={500}>
          <p>Child element</p>
        </Modal>
      );
      expect(screen.getByRole('dialog')).toHaveStyle({ width: '500px' });
    });
  });

  describe('when a width is not provided', () => {
    it('sets the default width as 860', () => {
      render(
        <Modal {...props}>
          <p>Child element</p>
        </Modal>
      );
      expect(screen.getByRole('dialog')).toHaveStyle({ width: '860px' });
    });
  });

  describe('When the user presses escape', () => {
    it('closes the modal', () => {
      render(
        <Modal {...props}>
          <p>Child element</p>
        </Modal>
      );

      const escapeEvent = new KeyboardEvent('keydown', { keyCode: 27 });
      document.dispatchEvent(escapeEvent);
      expect(closeModal).toHaveBeenCalledTimes(1);
    });
  });
});
