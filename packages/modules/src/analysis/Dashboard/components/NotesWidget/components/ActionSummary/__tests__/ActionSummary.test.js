import { screen } from '@testing-library/react';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ActionSummary from '../index';

const annotation = {
  annotation_actions: [],
  annotation_date: '2019-10-21T23:00:00Z',
  annotationable: { id: 28022, fullname: 'Fabi Menghini' },
  annotationable_type: 'Athlete',
  content: 'Blah Blah Blah',
  created_at: '2019-10-22T09:43:11Z',
  created_by: { id: 31369, fullname: 'Rory Thornburgh' },
  id: 2,
  organisation_annotation_type: {
    id: 1,
    name: 'CSR',
    type: 'Evaluation',
  },
  title: 'Test 2',
};

describe('<ActionSummary />', () => {
  const defaultProps = {
    t: i18nextTranslateStub(),
  };

  it('does not render anything if there are no actions in the note', () => {
    renderWithStore(
      <ActionSummary {...defaultProps} annotation={annotation} />
    );

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('displays the action summary if there are any actions in the note', () => {
    const annotationWithAction = {
      ...annotation,
      annotation_actions: [
        {
          completed_at: null,
          content: 'Does it work?',
          id: 2,
          user: {
            id: 1,
            fullname: 'Test User',
          },
        },
      ],
    };

    renderWithStore(
      <ActionSummary {...defaultProps} annotation={annotationWithAction} />
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('0/1')).toBeInTheDocument();
  });

  it('shows the correct details if an updatedAction prop is passed', () => {
    const annotationWithUpdate = {
      ...annotation,
      annotation_actions: [
        {
          completed: false,
          completed_at: null,
          content: 'Check if this works',
          id: 1,
          user: {
            id: 1,
            fullname: 'Test User',
          },
        },
        {
          completed: false,
          completed_at: null,
          content: 'Update this action',
          id: 2,
          user: {
            id: 1,
            fullname: 'Test User',
          },
        },
      ],
    };

    const updatedAction = {
      completed: true,
      completed_at: '2019-10-25T11:00:00Z',
      content: 'Update this action',
      id: 2,
      user: {
        id: 1,
        fullname: 'Test User',
      },
    };

    renderWithStore(
      <ActionSummary
        {...defaultProps}
        annotation={annotationWithUpdate}
        updatedAction={updatedAction}
      />
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('1/2')).toBeInTheDocument();
  });
});
