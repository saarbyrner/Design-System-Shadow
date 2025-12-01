import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DeleteDocumentModal from '../DeleteDocumentModal';

describe('<DeleteDocumentModal />', () => {
  const props = {
    isDeleteModalShown: true,
    getDeletableDocumentName: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('displays the modal title', () => {
    render(<DeleteDocumentModal {...props} />);
    expect(
      screen.getByText((content) => content.startsWith('Delete'))
    ).toBeInTheDocument();
  });

  it('displays the modal content', () => {
    render(<DeleteDocumentModal {...props} />);
    expect(
      screen.getByText('This action cannot be undone')
    ).toBeInTheDocument();
  });

  it('displays the modal actions', () => {
    render(<DeleteDocumentModal {...props} />);
    const modalFooter = screen.getByTestId('Modal|Footer');

    const cancelButton = modalFooter.querySelector('button');
    expect(cancelButton).toBeInTheDocument();

    const destructButton = modalFooter.querySelectorAll('button')[1];
    expect(destructButton).toBeInTheDocument();
  });
});
