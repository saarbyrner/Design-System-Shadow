import { screen, render } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from 'i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import { AvatarInputTranslated as Avatar } from '@kitman/modules/src/HumanInput/shared/components/InputElements/Attachment/components/Avatar';

const MOCK_ELEMENT = {
  id: 2692,
  element_type: 'Forms::Elements::Inputs::Attachment',
  config: {
    text: 'Headshot',
    data_point: false,
    element_id: 'headshot',
    optional: false,
    type: 'avatar',
  },
  visible: true,
  order: 1,
  form_elements: [],
};

const queuedAttachment = {
  state: 'IDLE',
  file: {
    file: new File([''], {}),
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

const i18nT = i18nextTranslateStub();

setI18n(i18n);

const props = {
  t: i18nT,
  element: MOCK_ELEMENT,
  onAddAttachment: jest.fn(),
  queuedAttachment: null,
};

describe('<Avatar/>', () => {
  it('renders', () => {
    render(<Avatar {...props} />);

    expect(screen.getByText('Select Headshot')).toBeInTheDocument();
    expect(screen.getByTestId('PersonIcon')).toBeInTheDocument();
  });

  it('renders an avatar if present', () => {
    render(<Avatar {...props} queuedAttachment={queuedAttachment} />);

    expect(screen.getByText('Select a different Headshot')).toBeInTheDocument();
    expect(screen.getByTestId('PersonIcon')).toBeInTheDocument();
  });

  it('renders avatar img if queuedItem status is SUCCESS', () => {
    render(
      <Avatar
        {...props}
        queuedAttachment={{ ...queuedAttachment, state: 'SUCCESS' }}
      />
    );

    expect(screen.getByText('Select a different Headshot')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
