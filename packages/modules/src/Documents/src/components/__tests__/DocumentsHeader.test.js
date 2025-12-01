import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DocumentsHeader from '../DocumentsHeader';

describe('<DocumentsHeader />', () => {
  const props = {
    allowedExtensions: ['jpg', 'png', 'csv', 'pdf', 'mp4', 'mp3'],
    t: i18nextTranslateStub(),
  };

  it('displays the correct title', () => {
    render(<DocumentsHeader {...props} />);
    expect(screen.getByText('Organization Documents')).toBeInTheDocument();
  });

  it('sets the allowed extensions on the input file', () => {
    render(<DocumentsHeader {...props} />);

    const fileInput = screen.getByLabelText(/upload file:/i);
    expect(fileInput).toHaveAttribute(
      'accept',
      '.jpg,.png,.csv,.pdf,.mp4,.mp3'
    );
  });
});
