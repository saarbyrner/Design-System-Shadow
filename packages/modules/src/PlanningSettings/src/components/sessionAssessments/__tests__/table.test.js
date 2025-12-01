import { render, screen } from '@testing-library/react';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import Table from '../table';

const props = {
  assessmentTemplates: [],
  editedSessionAssessments: {},
  isEditMode: false,
  onSelectAssessmentType: jest.fn(),
  sessionAssessments: [],
  t: i18nextTranslateStub(),
};

describe('<Table />', () => {
  it('renders the correct content', () => {
    render(<Table {...props} />);

    expect(screen.getByRole('main')).toHaveClass('sessionAssessmentTable');
    expect(screen.getByText('Session type')).toBeInTheDocument();
    expect(screen.getByText('Assessment type')).toBeInTheDocument();
  });

  it('renders the correct content when in edit mode', () => {
    render(<Table {...props} isEditMode />);

    expect(screen.getByRole('main')).toHaveClass(
      'sessionAssessmentTable--edit'
    );
    expect(screen.getByText('Session type')).toBeInTheDocument();
    expect(screen.getByText('Assessment type')).toBeInTheDocument();
  });

  it('renders the correct content when sessionAssessments is empty', () => {
    render(<Table {...props} />);

    expect(screen.getByText('No session types')).toBeInTheDocument();
  });

  it('renders the correct content when the table is not empty', () => {
    const sessionAssessments = [
      {
        id: 48,
        name: 'Line Outs',
        templates: [
          {
            id: 182,
            name: 'Create Template',
          },
        ],
      },
      {
        id: 49,
        name: 'Scrums',
        templates: [
          {
            id: 14,
            name: 'FMS',
          },
        ],
      },
    ];
    render(<Table {...props} sessionAssessments={sessionAssessments} />);

    expect(screen.queryByText('No session types')).not.toBeInTheDocument();
    expect(screen.getByText('Session type')).toBeInTheDocument();
    expect(screen.getByText('Assessment type')).toBeInTheDocument();
    expect(screen.getByText('Line Outs')).toBeInTheDocument();
    expect(screen.getByText('Create Template')).toBeInTheDocument();
    expect(screen.getByText('Scrums')).toBeInTheDocument();
    expect(screen.getByText('FMS')).toBeInTheDocument();
  });
});
