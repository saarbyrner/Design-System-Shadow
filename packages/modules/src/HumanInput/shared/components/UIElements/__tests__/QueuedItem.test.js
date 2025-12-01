import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import QueuedItem from '@kitman/modules/src/HumanInput/shared/components/UIElements/QueuedItem';

const i18nT = i18nextTranslateStub();

const props = {
  queuedItem: {
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
  },
  onUpload: jest.fn(),
  onDelete: jest.fn(),
  t: i18nT,
};

describe('<QueuedItem/>', () => {
  it('renders in an IDLE state', () => {
    render(<QueuedItem {...props} />);

    expect(screen.getByTestId('UploadFileIcon')).toBeInTheDocument();
    expect(screen.getByText('A file title')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
  });

  it('renders in a PENDING state', () => {
    render(
      <QueuedItem
        {...props}
        queuedItem={{ ...props.queuedItem, state: 'PENDING' }}
      />
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('A file title')).toBeInTheDocument();
  });

  it('renders in a FAILURE state', () => {
    render(
      <QueuedItem
        {...props}
        queuedItem={{ ...props.queuedItem, state: 'FAILURE' }}
      />
    );
    expect(screen.getByTestId('DeleteIcon')).toBeInTheDocument();
    expect(screen.getByText('A file title')).toBeInTheDocument();
  });

  it('renders in a SUCCESS state', () => {
    render(
      <QueuedItem
        {...props}
        queuedItem={{ ...props.queuedItem, state: 'SUCCESS' }}
      />
    );
    expect(screen.getByTestId('CheckCircleIcon')).toBeInTheDocument();
    expect(screen.getByText('A file title')).toBeInTheDocument();
  });
});
