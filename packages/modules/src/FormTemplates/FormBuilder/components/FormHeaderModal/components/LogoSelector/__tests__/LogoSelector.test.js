import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import uploadAttachment from '@kitman/services/src/services/uploadAttachment';

import { LogoSelectorTranslated as LogoSelector } from '../index';

jest.mock('@kitman/services/src/services/uploadAttachment');

describe('<LogoSelector />', () => {
  const props = {
    image: {
      hidden: false,
      current_organisation_logo: false,
      attachment: {
        id: 1495819,
        url: 'https://s3:9000/',
        filename: 'Manchester_United_FC_crest.svg.png',
        filetype: 'image/png',
        filesize: 580976,
        created: '2025-04-09T20:45:02Z',
        created_by: {
          id: 155134,
          firstname: 'Cathal',
          lastname: 'Diver',
          fullname: 'Cathal Diver',
        },
        attachment_date: '2025-04-09T20:45:02Z',
      },
    },
    handleChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component with data', async () => {
    render(<LogoSelector {...props} />);

    expect(screen.getByText(/select a different image/i)).toBeInTheDocument();
    expect(await screen.findByRole('img')).toHaveAttribute(
      'src',
      'https://s3:9000/'
    );
  });

  it('should call handleChange when a new file is selected', async () => {
    const user = userEvent.setup();

    uploadAttachment.mockResolvedValue({
      attachment_id: 67890,
      attachment: props.image.attachment,
    });

    render(<LogoSelector {...props} />);

    const fileInput = screen.getByLabelText(/select a different image/i);

    const file = new File(['dummy content'], 'example.png', {
      type: 'image/png',
    });

    await user.upload(fileInput, file);

    await waitFor(() =>
      expect(props.handleChange).toHaveBeenCalledWith(props.image.attachment)
    );
  });

  it('should display an error message if uploading the logo fails', async () => {
    const user = userEvent.setup();
    uploadAttachment.mockRejectedValue(new Error('Error uploading the logo'));

    render(<LogoSelector {...props} />);

    const fileInput = screen.getByLabelText(/select a different image/i);

    const file = new File(['dummy content'], 'example.png', {
      type: 'image/png',
    });

    await user.upload(fileInput, file);

    await waitFor(() =>
      expect(screen.getByText(/Error uploading the logo/i)).toBeInTheDocument()
    );
  });

  it('should display an error message if the file size exceeds the limit', async () => {
    const user = userEvent.setup();

    render(<LogoSelector {...props} />);

    const fileInput = screen.getByLabelText(/select a different image/i);

    const file = new File(
      [new Array(6 * 1024 * 1024).fill('a').join('')],
      'example.png',
      {
        type: 'image/png',
      }
    );

    await user.upload(fileInput, file);

    await waitFor(() =>
      expect(
        screen.getByText(/File size exceeds the limit of 5MB./i)
      ).toBeInTheDocument()
    );
  });
});
