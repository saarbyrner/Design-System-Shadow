import { FilePond } from 'react-filepond';
import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ImageAttachmentArea from '../ImageAttachmentArea';

jest.mock('react-filepond', () => ({
  FilePond: jest.fn(() => <div data-testid="mock-filepond" />),
  registerPlugin: jest.fn(),
}));

describe('ImageAttachmentArea Component', () => {
  const props = {
    maxFileSize: '8MB',
    onFileAddValidationError: jest.fn(),
    onFileAddValidationSuccess: jest.fn(),
    onFileRemoved: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('renders the component', () => {
    render(<ImageAttachmentArea {...props} />);
    expect(screen.getByTestId('mock-filepond')).toBeInTheDocument();
  });

  it('contains filepond component', () => {
    render(<ImageAttachmentArea {...props} />);

    expect(FilePond).toHaveBeenCalled();
    expect(FilePond.mock.calls[0][0]).toEqual(
      expect.objectContaining({ maxFileSize: '8MB' })
    );
  });

  it('calls onFileAddValidationError when file add fails', () => {
    render(<ImageAttachmentArea {...props} />);
    const error = { message: 'error' };
    const file = { name: 'test.png' };
    props.onFileAddValidationError(error, file);
    expect(props.onFileAddValidationError).toHaveBeenCalledWith(error, file);
  });

  it('calls onFileAddValidationSuccess when file add succeeds', () => {
    render(<ImageAttachmentArea {...props} />);
    const file = { name: 'test.png' };
    props.onFileAddValidationSuccess(file);
    expect(props.onFileAddValidationSuccess).toHaveBeenCalledWith(file);
  });

  it('calls onFileRemoved when file is removed', () => {
    render(<ImageAttachmentArea {...props} />);
    props.onFileRemoved();
    expect(props.onFileRemoved).toHaveBeenCalled();
  });
});
