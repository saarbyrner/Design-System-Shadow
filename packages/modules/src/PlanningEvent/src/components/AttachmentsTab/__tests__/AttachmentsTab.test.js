/* eslint-disable camelcase */
/* eslint-disable jest/no-mocks-import */
import { fireEvent, render, screen, within } from '@testing-library/react';

import AttachmentsTab from '../index';
import {
  mockedAttachments,
  transformedDateMock,
} from '../__mocks__/AttachmentsTab.mock';
import { deleteButtonText, downloadButtonText } from '../utils/consts';

describe('AttachmentsTab', () => {
  const {
    attachment: { name, filename, download_url },
    event_attachment_categories,
  } = mockedAttachments[0];

  const getActionsButton = () => {
    const { getByRole } = within(screen.getAllByRole('row')[1]); // The first row is the header
    const actionsButton = getByRole('button');
    return actionsButton;
  };

  const props = {
    attachments: mockedAttachments,
    canDeleteAttachments: true,
    canDownload: true,
    setChosenAttachment: jest.fn(),
    setIsDeleteAttachmentModalOpen: jest.fn(),
    t: jest.fn(),
  };

  it('should render the attachments in the table', () => {
    render(<AttachmentsTab {...props} />);
    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByText(filename)).toBeInTheDocument();
    expect(screen.getByText(transformedDateMock)).toBeInTheDocument();
    event_attachment_categories.forEach((category) =>
      expect(screen.getByText(category.name)).toBeInTheDocument()
    );
  });

  it('should contain a button that upon clicking will open a menu', () => {
    render(<AttachmentsTab {...props} />);

    const actionsButton = getActionsButton();
    fireEvent.click(actionsButton);

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText(downloadButtonText)).toBeInTheDocument();
    expect(screen.getByText(deleteButtonText)).toBeInTheDocument();
  });

  it('filename should contain an href attribute', () => {
    render(<AttachmentsTab {...props} />);
    expect(screen.getByText(filename)).toHaveAttribute('href', download_url);
  });

  it('should not show the delete attachment text if canDeleteAttachments is false', () => {
    render(<AttachmentsTab {...props} canDeleteAttachments={false} />);

    const actionsButton = getActionsButton();
    fireEvent.click(actionsButton);

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText(downloadButtonText)).toBeInTheDocument();
    expect(screen.queryByText(deleteButtonText)).not.toBeInTheDocument();
  });
});
