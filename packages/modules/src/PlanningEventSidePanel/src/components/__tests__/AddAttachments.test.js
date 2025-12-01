import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { AddAttachmentsTranslated as AddAttachments } from '../common/AddAttachments';

describe('<AddAttachments />', () => {
  const props = {
    event: {
      type: 'session_event',
      season_type_id: 1,
      field_condition: 2,
      temperature: 30,
      unUploadedFiles: [],
      unUploadedLinks: [],
    },
    onUpdateEventDetails: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('renders the unUploaded files properly', async () => {
    const propsWithUnUploadedFiles = {
      ...props,
      event: {
        ...props.event,
        unUploadedFiles: [
          {
            filename: 'lexie file name',
            fileTitle: 'custom file title',
            id: 23,
            file: { file: { size: 1234000 } },
          },
        ],
      },
    };
    act(() => {
      render(<AddAttachments {...propsWithUnUploadedFiles} />);
    });

    const titleInputs = screen.getAllByRole('textbox');

    await waitFor(() => {
      expect(titleInputs[2]).toHaveValue(
        propsWithUnUploadedFiles.event.unUploadedFiles[0].fileTitle
      );
    });
  });

  it('renders the add link fields properly', async () => {
    await act(async () => render(<AddAttachments {...props} />));
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Link')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('renders the set all categories select when only files exist', async () => {
    await act(async () =>
      render(
        <AddAttachments
          {...props}
          event={{
            ...props.event,
            unUploadedFiles: [
              {
                filename: 'test file name',
                id: 10,
                fileTitle: 'test title',
                file: { size: 10 },
                event_attachment_category_ids: [],
              },
            ],
          }}
        />
      )
    );

    expect(
      screen.getByLabelText('Set categories for all uploads')
    ).toBeInTheDocument();
  });

  it('renders the set all categories select when only links exist', async () => {
    await act(async () =>
      render(
        <AddAttachments
          {...props}
          event={{
            ...props.event,
            unUploadedLinks: [
              {
                title: 'test title',
                uri: 'www.google.com',
                event_attachment_category_ids: [],
              },
            ],
          }}
        />
      )
    );
    expect(
      screen.getByLabelText('Set categories for all uploads')
    ).toBeInTheDocument();
  });

  it('does NOT render the set all categories select when links and files are not yet uploaded', async () => {
    await act(async () => render(<AddAttachments {...props} />));
    expect(
      screen.queryByLabelText('Set categories for all uploads')
    ).not.toBeInTheDocument();
  });
});
