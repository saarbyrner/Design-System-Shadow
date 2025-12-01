import { render, screen } from '@testing-library/react';

import Attachments from '../Attachments';

describe('<Attachments/>', () => {
  const props = {
    attachments: [
      {
        id: 1,
        url: 'url',
        filename: 'filename',
        filetype: 'image/png',
        filesize: 2,
      },
    ],
    t: () => {},
  };

  it('renders successfully', () => {
    render(<Attachments {...props} />);
    expect(screen.getByRole('listitem')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('filename');
    expect(screen.getAllByRole('link')[0]).toHaveAttribute('href', 'url');
  });
});
