import { screen, render, waitFor } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import DeleteAttachment from '..';

describe('<DeleteAttachmentModal />', () => {
  beforeEach(() => {
    i18nextTranslateStub();
  });

  const props = {
    isOpen: true,
    onClose: jest.fn(),
    attachmentTitle: 'Test Attachment Title',
    onDeleteAttachment: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('renders title properly', () => {
    render(<DeleteAttachment {...props} />);

    expect(
      screen.getByText(`Delete ${props.attachmentTitle}?`)
    ).toBeInTheDocument();
  });

  it('calls on delete attachment when Delete button is clicked', async () => {
    render(<DeleteAttachment {...props} />);

    const deleteButton = screen.getByText('Delete');
    userEvent.click(deleteButton);

    await waitFor(() => {
      expect(props.onDeleteAttachment).toHaveBeenCalled();
    });
  });
});
