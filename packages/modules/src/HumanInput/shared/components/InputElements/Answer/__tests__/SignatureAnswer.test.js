import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import SignatureAnswer from '@kitman/modules/src/HumanInput/shared/components/InputElements/Answer/components/SignatureAnswer';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const elementId = 123;
const props = {
  text: 'Player Signature',
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
  },
  message: null,
};

const formAttachmentSlice = {
  queue: {
    [elementId]: queuedAttachment,
  },
};

describe('<SignatureAnswer/>', () => {
  it('renders signature img', async () => {
    render(
      <Provider
        store={storeFake({
          formAttachmentSlice,
        })}
      >
        <SignatureAnswer {...props} />
      </Provider>
    );

    expect(await screen.findByText('Player Signature')).toBeInTheDocument();
    expect(await screen.findByRole('img')).toBeInTheDocument();
  });

  it('renders signature img for element child of repeatable group', async () => {
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
        <SignatureAnswer
          {...props}
          repeatableGroupInfo={{ repeatable: true, groupNumber: 1 }}
        />
      </Provider>
    );

    expect(await screen.findByText('Player Signature')).toBeInTheDocument();
    expect(await screen.findByRole('img')).toBeInTheDocument();
  });
});
