import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import DeleteAttachmentContainer from '../DeleteAttachmentContainer';

describe('<DeleteAttachmentModal />', () => {
  beforeEach(() => {
    i18nextTranslateStub();
  });

  const props = {
    t: () => {},
  };

  describe('<DeleteAttachment />', () => {
    it('renders the actions buttons', async () => {
      render(<DeleteAttachmentContainer {...props} isOpen />);

      // Check for modal action buttons
      const cancelButton = screen.getByRole('button', {
        name: 'Cancel',
        hidden: true,
      });

      const deleteButton = screen.getByRole('button', {
        name: 'Delete',
        hidden: true,
      });

      expect(cancelButton).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
    });
  });
});
