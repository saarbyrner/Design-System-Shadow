import { render, screen, within } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import { ExportWarningModalTranslated as ExportWarningModal } from '../index';

describe('<ExportWarningModal />', () => {
  const supportedFileTypesNames = ['png', 'tiff', 'jpeg', 'pdf', 'doc', 'docx']; // For display in modal. Does not need to be extensive

  const props = {
    openModal: true,
    setOpenModal: jest.fn(),
    numExcludedFiles: 4,
    supportedFileTypesNames,
    onExport: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const expectedContent =
    'Only the following file formats will be included in your export; png, tiff, jpeg, pdf, doc, docx';

  describe('valid and invalid files are selected', () => {
    const additionalProps = {
      ...props,
      selectedExports: [3, 5, 1, 7, 10, 2],
    };
    it('displays the modal title', () => {
      render(<ExportWarningModal {...additionalProps} />);
      expect(screen.getByText('Unsupported file type')).toBeInTheDocument();
    });

    it('displays the modal actions', async () => {
      render(<ExportWarningModal {...additionalProps} />);
      const buttons = screen.getAllByRole('button', { hidden: true });
      expect(buttons.length).toEqual(2);

      const cancelButton = within(buttons[0]).getByText('Cancel');
      expect(cancelButton).toBeInTheDocument();
      expect(buttons[0]).toHaveAttribute(
        'class',
        expect.stringContaining('subtle')
      );

      const exportButton = within(buttons[1]).getByText('Export');
      expect(exportButton).toBeInTheDocument();
      expect(buttons[1]).toHaveAttribute(
        'class',
        expect.stringContaining('warning')
      );
    });

    it('displays the correct content', () => {
      render(<ExportWarningModal {...additionalProps} />);

      const content = screen.getByTestId('Modal|Content');
      expect(within(content).getByText(expectedContent)).toBeInTheDocument();
    });
  });

  describe('only invalid files are selected', () => {
    const additionalProps = {
      ...props,
      selectedExports: [3, 5, 1, 7],
    };
    it('displays the modal title', () => {
      render(<ExportWarningModal {...additionalProps} />);
      expect(screen.getByText('Unsupported file type')).toBeInTheDocument();
    });

    it('displays the modal actions', async () => {
      render(<ExportWarningModal {...additionalProps} />);
      const buttons = screen.getAllByRole('button', { hidden: true });
      expect(buttons.length).toEqual(1);

      const cancelButton = within(buttons[0]).getByText('Cancel');
      expect(cancelButton).toBeInTheDocument();
      expect(buttons[0]).toHaveAttribute(
        'class',
        expect.stringContaining('primary')
      );
    });

    it('displays the correct content', () => {
      render(<ExportWarningModal {...additionalProps} />);

      const content = screen.getByTestId('Modal|Content');
      expect(within(content).getByText(expectedContent)).toBeInTheDocument();
    });
  });
});
