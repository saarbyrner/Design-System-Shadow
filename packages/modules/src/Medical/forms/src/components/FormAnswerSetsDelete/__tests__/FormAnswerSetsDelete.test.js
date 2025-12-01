import { render, screen } from '@testing-library/react';
import Modal from 'react-modal';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import FormAnswerSetsDelete from '../index';

describe('<FormAnswerSetsDelete />', () => {
  const props = {
    isOpen: true,
    formMeta: {
      fullname: 'PAC - Concussion incident form',
    },
    onDelete: jest.fn(),
    onClose: jest.fn(),
    t: i18nextTranslateStub(),
  };

  // Setup for react-modal
  beforeAll(() => {
    const appRoot = document.createElement('div');
    appRoot.setAttribute('id', 'root');
    document.body.appendChild(appRoot);
    Modal.setAppElement('#root');
  });

  it('renders the delete confirmation modal with the correct content', async () => {
    render(<FormAnswerSetsDelete {...props} />);

    const modalTitle = await screen.findByTestId('Modal|Title');

    // Assert that the title has the correct text. This also confirms the modal is open.
    expect(modalTitle).toHaveTextContent(
      'Delete PAC - Concussion incident form'
    );

    // Now that we know the modal is present, we can find the other elements synchronously.
    expect(
      screen.getByText(
        /deleting this pac - concussion incident form will delete it for all users/i
      )
    ).toBeInTheDocument();

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
});
