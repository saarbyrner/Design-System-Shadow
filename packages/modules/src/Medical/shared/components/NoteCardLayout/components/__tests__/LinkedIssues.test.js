import { render, screen } from '@testing-library/react';

import LinkedIssues from '../LinkedIssues';

describe('<LinkedIssues/>', () => {
  const props = {
    issues: [
      {
        id: 1,
        issue_type: 'injury',
        occurrence_date: '2022-07-05T00:00:00+00:00',
        full_pathology:
          'Respiratory tract infection (bacterial or viral) [N/A]',
      },
    ],
    annotationableId: 1,
    t: () => {},
  };

  it('renders successfully', () => {
    render(<LinkedIssues {...props} />);
    expect(screen.getByRole('listitem')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent(
      'Jul 05, 2022 - Respiratory tract infection (bacterial or viral) [N/A]'
    );

    expect(screen.getAllByRole('link')[0]).toHaveAttribute(
      'href',
      '/medical/athletes/1/injuries/1'
    );
  });

  it('renders chronic issues with full pathology as title, if title as empty.', () => {
    const updatedProps = {
      ...props,
      chronicIssues: [
        {
          id: 1,
          full_pathology: 'Cervical rib',
          title: '',
        },
      ],
    };
    render(<LinkedIssues {...updatedProps} />);
    expect(screen.getAllByRole('listitem')[1]).toHaveTextContent(
      'Cervical rib'
    );
  });

  it('renders chronic issues without full pathology, if title is available.', () => {
    const updatedProps = {
      ...props,
      chronicIssues: [
        {
          id: 1,
          full_pathology: 'Cervical rib',
          title: 'Testing Chronic Title',
        },
      ],
    };
    render(<LinkedIssues {...updatedProps} />);
    expect(screen.getAllByRole('listitem')[1]).toHaveTextContent(
      'Testing Chronic Title'
    );
  });
});
