import {
  screen,
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setI18n } from 'react-i18next';
import i18n from 'i18next';
import { AttachmentAnswerTranslated as AttachmentAnswer } from '@kitman/modules/src/HumanInput/shared/components/InputElements/Answer/components/AttachmentAnswer';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';

const i18nT = i18nextTranslateStub();

setI18n(i18n);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const elementId = 1;
const props = {
  t: i18nT,
  text: 'Attachment',
  elementId,
};

const queuedAttachment = {
  state: 'SUCCESS',
  file: {
    fileSize: 50,
    fileTitle: 'A file title',
    fileType: 'jpeg',
    filename: 'A file title',
    filenameWithoutExtension: 'blob',
    id: 1,
    blobUrl: 'https://localhost:3002/someBlobUrl',
    createdDate: '2024-05-01T15:43:18Z',
  },
  message: null,
};

const formAttachmentSlice = {
  queue: {
    [elementId]: queuedAttachment,
  },
};

describe('<AttachmentAnswer/>', () => {
  it('renders attachment answer', async () => {
    render(
      <Provider
        store={storeFake({
          formAttachmentSlice,
        })}
      >
        <AttachmentAnswer {...props} />
      </Provider>
    );

    expect(await screen.findByText('Attachment')).toBeInTheDocument();
    expect(screen.getByText(/a file title/i)).toBeInTheDocument();
    expect(screen.getByText(/uploaded may 1, 2024/i)).toBeInTheDocument();
  });

  it('renders attachment answer for element child of repeatable group', async () => {
    const repeatableGroupFormAttachmentSlice = {
      queue: {
        [elementId]: [null, queuedAttachment],
      },
    };

    render(
      <Provider
        store={storeFake({
          formAttachmentSlice: repeatableGroupFormAttachmentSlice,
        })}
      >
        <AttachmentAnswer
          {...props}
          repeatableGroupInfo={{ repeatable: true, groupNumber: 1 }}
        />
      </Provider>
    );

    expect(await screen.findByText('Attachment')).toBeInTheDocument();
    expect(screen.getByText(/a file title/i)).toBeInTheDocument();
    expect(screen.getByText(/uploaded may 1, 2024/i)).toBeInTheDocument();
  });

  it('opens preview modal when clicking filename', async () => {
    const user = userEvent.setup();
    render(
      <Provider
        store={storeFake({
          formAttachmentSlice,
        })}
      >
        <AttachmentAnswer {...props} />
      </Provider>
    );

    expect(await screen.findByText('Attachment')).toBeInTheDocument();
    const viewButton = screen.getByText('View');

    await user.click(viewButton);

    // Dialog opens and tab label is visible
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: /a file title/i })
    ).toBeInTheDocument();
  });

  it('closes preview modal when clicking close button', async () => {
    const user = userEvent.setup();
    render(
      <Provider
        store={storeFake({
          formAttachmentSlice,
        })}
      >
        <AttachmentAnswer {...props} />
      </Provider>
    );

    const viewButton = screen.getByText('View');
    await user.click(viewButton);

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: 'close' });
    await user.click(closeButton);
    await waitForElementToBeRemoved(dialog);
  });
});
