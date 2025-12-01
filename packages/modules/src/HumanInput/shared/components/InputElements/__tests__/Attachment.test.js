import { screen, render } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from 'i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import Attachment from '../Attachment';

const MOCK_ELEMENT = {
  id: 2692,
  element_type: 'Forms::Elements::Inputs::Attachment',
  config: {
    text: 'Attachment',
    data_point: false,
    element_id: 'arbitrary_field',
    optional: false,
  },
  visible: true,
  order: 1,
  form_elements: [],
};

const i18nT = i18nextTranslateStub();

setI18n(i18n);

const props = {
  t: i18nT,
  element: MOCK_ELEMENT,
  onSelectFile: jest.fn(),
  onUploadAttachment: jest.fn(),
  onDeleteAttachment: jest.fn(),
  queuedAttachment: null,
  acceptedFilesTypes: ['image/jpeg', 'image/jpg'],
};

describe('<Attachment/>', () => {
  it('renders', () => {
    render(<Attachment {...props} />);

    const uploadField = document.querySelector('.filepond--wrapper input');

    expect(screen.getByText('Attachment')).toBeInTheDocument();
    expect(uploadField).toBeInTheDocument();
  });

  it('renders an attachment if present', () => {
    render(
      <Attachment
        {...props}
        queuedAttachment={{
          state: 'IDLE',
          file: {
            file: new File([''], {}),
            fileSize: 50,
            fileTitle: 'A file title',
            fileType: 'jpeg',
            filename: 'A file title',
            filenameWithoutExtension: 'blob',
            id: 1,
          },
          message: null,
        }}
      />
    );

    expect(screen.getByText('A file title')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('renders avatar variation if element has config.type as avatar', () => {
    render(
      <Attachment
        {...props}
        element={{
          ...MOCK_ELEMENT,
          config: {
            ...MOCK_ELEMENT.config,
            custom_params: { type: 'avatar' },
            text: 'Headshot',
          },
        }}
        queuedAttachment={{
          state: 'IDLE',
          file: {
            file: new File([''], {}),
            fileSize: 50,
            fileTitle: 'A img file title',
            fileType: 'jpeg',
            filename: 'A img file title',
            filenameWithoutExtension: 'blob',
            id: 1,
            blobUrl: 'https://localhost:3002/someBlobUrl',
          },
          message: null,
        }}
      />
    );

    expect(screen.getByTestId('PersonIcon')).toBeInTheDocument();
    expect(screen.getByText('Select a different Headshot')).toBeInTheDocument();

    expect(screen.getByText('A img file title')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });
});
