import { render, screen, waitFor } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import i18n from 'i18next';
import { setI18n } from 'react-i18next';
import '@kitman/common/src/utils/fileSizeLabel';
import { PreviousUploadsTranslated as PreviousUploads } from '../common/PreviousUploads';

// mock the file size label function
jest.mock('@kitman/common/src/utils/fileSizeLabel');

// set the i18n instance
setI18n(i18n);
describe('<PreviousUploads/>', () => {
  const props = {
    event: {
      type: 'session_event',
      season_type_id: 1,
      field_condition: 2,
      temperature: 30,
      attachments: [],
      attached_links: [],
    },
    t: i18nextTranslateStub(),
  };
  it('renders the attachments', async () => {
    const attachmentProps = {
      ...props,
      event: {
        ...props.event,
        attachments: [
          {
            attachment: {
              filename: 'original file name',
              name: 'custom name',
              download_url: 'download url',
              confirmed: true,
            },
          },
        ],
      },
    };
    render(<PreviousUploads {...attachmentProps} />);

    await waitFor(() => {
      expect(screen.getByText(/custom name/)).toBeInTheDocument();
      expect(screen.queryByText('original file name')).not.toBeInTheDocument();
    });
    expect(screen.getAllByRole('button').length).toEqual(1);
  });

  it('renders the associated attachment category names in a comma separated list', async () => {
    const attachmentProps = {
      ...props,
      event: {
        ...props.event,
        attachments: [
          {
            attachment: {
              filename: 'original file name',
              name: 'custom name',
              download_url: 'download url',
              confirmed: true,
            },
            event_attachment_categories: [
              { id: 43, name: 'Example Category' },
              { id: 83, name: 'Second Category' },
            ],
          },
        ],
      },
    };
    render(<PreviousUploads {...attachmentProps} />);

    await waitFor(() => {
      expect(screen.getByText(/Categories/)).toBeInTheDocument();
      expect(screen.getByText(/Example Category/)).toBeInTheDocument();
      expect(screen.queryByText(/Second Category/)).toBeInTheDocument();
    });
  });

  it('shows file name if name prop doesnt exist', async () => {
    const attachmentProps = {
      ...props,
      event: {
        ...props.event,
        attachments: [
          {
            attachment: {
              filename: 'original file name',
              download_url: 'download url',
              confirmed: true,
            },
            event_attachment_categories: [{ id: 2, name: 'Category 1' }],
          },
          {
            attachment: {
              filename: 'my other file',
              download_url: 'download url',
              confirmed: true,
            },
            event_attachment_categories: [{ id: 3, name: 'Category Three' }],
          },
        ],
      },
    };
    render(<PreviousUploads {...attachmentProps} />);

    await waitFor(() => {
      expect(screen.getByText(/original file name/)).toBeInTheDocument();
    });
    expect(screen.getAllByRole('button').length).toEqual(2);
  });

  it('renders the links and their categories (in a comma separated list)', async () => {
    const linkProps = {
      ...props,
      event: {
        ...props.event,
        attached_links: [
          {
            attached_link: { title: 'link title', uri: 'google.com' },
            event_attachment_categories: [
              { id: 9483, name: 'Category 1' },
              { id: 92874, name: 'Second' },
            ],
          },
        ],
      },
    };
    render(<PreviousUploads {...linkProps} />);

    await waitFor(() => {
      expect(screen.getByText('link title')).toBeInTheDocument();
      expect(screen.queryByText('google.com')).not.toBeInTheDocument();
    });
    expect(screen.getByText(/Categories:/)).toBeInTheDocument();
    expect(screen.getByText(/Category 1, Second/)).toBeInTheDocument();
  });

  it('renders the links trash bins', async () => {
    const linkProps = {
      ...props,
      event: {
        ...props.event,
        attached_links: [
          {
            attached_link: { title: 'link title', uri: 'google.com' },
            event_attachment_categories: [
              { id: 9483, name: 'Category 1' },
              { id: 92874, name: 'Second' },
            ],
          },
        ],
      },
    };
    render(<PreviousUploads {...linkProps} />);

    await waitFor(() => {
      expect(screen.getByText('link title')).toBeInTheDocument();
    });

    expect(screen.getByTestId('AttachedLink|BinIcon')).toBeInTheDocument();
  });

  it('does not render unconfirmed attachments', async () => {
    const attachmentProps = {
      ...props,
      event: {
        ...props.event,
        attachments: [
          {
            attachment: {
              filename: 'confirmed file',
              name: 'confirmed file title',
              download_url: 'download url',
              confirmed: true,
            },
          },
          {
            attachment: {
              filename: 'test',
              name: 'name',
              download_url: 'test',
              confirmed: false,
            },
          },
        ],
      },
    };
    render(<PreviousUploads {...attachmentProps} />);

    await waitFor(() => {
      // the unconfirmed file should not be visible
      expect(screen.queryByText(/name/)).not.toBeInTheDocument();
      expect(screen.queryByText(/test/)).not.toBeInTheDocument();

      // the confirmed file should be visible
      expect(screen.getByText(/confirmed file title/)).toBeInTheDocument();
    });
  });
});
