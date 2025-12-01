import { screen, render } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from 'i18next';
import { Provider } from 'react-redux';
import { AvatarAnswerTranslated as AvatarAnswer } from '@kitman/modules/src/HumanInput/shared/components/InputElements/Answer/components/AvatarAnswer';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

const i18nT = i18nextTranslateStub();

setI18n(i18n);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const elementId = 123;
const props = {
  t: i18nT,
  text: 'Headshot',
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

describe('<AvatarAnswer/>', () => {
  it('renders avatar img', async () => {
    render(
      <Provider
        store={storeFake({
          formAttachmentSlice,
        })}
      >
        <AvatarAnswer {...props} />
      </Provider>
    );

    expect(await screen.findByText('Headshot')).toBeInTheDocument();
    expect(await screen.findByRole('img')).toBeInTheDocument();
  });

  it('renders no image selected and empty avatar if no attachmentId is provided', () => {
    render(
      <Provider
        store={storeFake({
          formAttachmentSlice: {
            queue: {},
          },
        })}
      >
        <AvatarAnswer t={i18nT} text="Headshot" elementId={elementId} />
      </Provider>
    );

    expect(screen.getByText('Headshot')).toBeInTheDocument();
    expect(screen.getByText('No image selected')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders avatar img for element child of repeatable group', async () => {
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
        <AvatarAnswer
          {...props}
          repeatableGroupInfo={{ repeatable: true, groupNumber: 1 }}
        />
      </Provider>
    );

    expect(await screen.findByText('Headshot')).toBeInTheDocument();
    expect(await screen.findByRole('img')).toBeInTheDocument();
  });
});
