import { render, screen } from '@testing-library/react';

import LinkedDiagnostic from '../LinkedDiagnostic';

describe('<LinkedDiagnostic/>', () => {
  const props = {
    diagnostic: {
      id: 2,
      type: 'MRI',
    },

    annotationableId: 1,
    t: () => {},
  };

  it('renders successfully', () => {
    render(<LinkedDiagnostic {...props} />);
    expect(screen.getByRole('listitem')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('MRI');

    expect(screen.getAllByRole('link')[0]).toHaveAttribute(
      'href',
      '/medical/athletes/1/diagnostics/2'
    );
  });
});
