import { screen } from '@testing-library/react';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { annotation as annotationDummyData } from '@kitman/modules/src/Annotations/components/AnnotationModal/resources/AnnotationDummyData';
import ExpandedNoteDetails from '../index';

describe('ExpandedNoteDetails Component', () => {
  const props = {
    users: [
      {
        id: 1,
        name: 'Test User',
      },
      {
        id: 2,
        name: 'Test User number 2',
      },
    ],
    widgetId: 1234,
    annotation: {
      ...annotationDummyData(),
      annotation_actions: [
        {
          completed_at: null,
          completed: false,
          content: 'Does it work?',
          id: 1,
          user_ids: ['1'],
          due_date: '2019-06-25T23:00:00Z',
        },
        {
          completed_at: 'today',
          completed: true,
          content: 'Check when it will work!',
          id: 2,
          user_ids: ['2'],
          due_date: null,
        },
      ],
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
      updated_by: null,
      updated_at: null,
    },
    canEditNotes: true,
    updatedAction: null,
    t: i18nextTranslateStub(),
  };

  it('renders the expanded note details if there are actions', () => {
    renderWithStore(<ExpandedNoteDetails {...props} />);

    const actionsSection = screen.getByText('Actions 1/2');
    expect(actionsSection).toBeInTheDocument();
  });

  it('displays the correct amount of ActionCheckbox components', () => {
    renderWithStore(<ExpandedNoteDetails {...props} />);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
  });

  it('displays the correct action content', () => {
    renderWithStore(<ExpandedNoteDetails {...props} />);

    expect(screen.getByText('Does it work?')).toBeInTheDocument();
    expect(screen.getByText('Check when it will work!')).toBeInTheDocument();
  });

  it('displays the correct action content if an updatedAction prop is passed', () => {
    const updatedActionProps = {
      ...props,
      updatedAction: {
        completed_at: '2019-10-22T09:45:11Z',
        completed: true,
        content: 'Does it work?',
        id: 1,
        user_ids: ['1'],
        due_date: '2019-06-25T23:00:00Z',
      },
    };

    renderWithStore(<ExpandedNoteDetails {...updatedActionProps} />);

    expect(screen.getByText('Actions 2/2')).toBeInTheDocument();
  });

  it('displays the action assignee', () => {
    renderWithStore(<ExpandedNoteDetails {...props} />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  describe('when the standard-date-formatting flag is off the note metadata', () => {
    beforeEach(() => {
      window.setFlag('standard-date-formatting', false);
    });

    it('displays the correct note metadata', () => {
      renderWithStore(<ExpandedNoteDetails {...props} />);

      expect(
        screen.getByText('Created by Rory Thornburgh on 22 Oct 2019')
      ).toBeInTheDocument();
    });

    it('displays the correct created by details even if there are no actions', () => {
      const noActionsProps = {
        ...props,
        annotation: {
          ...annotationDummyData(),
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
        },
      };

      renderWithStore(<ExpandedNoteDetails {...noActionsProps} />);

      expect(
        screen.getByText('Created by Rory Thornburgh on 22 Oct 2019')
      ).toBeInTheDocument();
    });

    it('displays the last edited details', () => {
      const lastEditedProps = {
        ...props,
        annotation: {
          ...annotationDummyData(),
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
          updated_by: { id: 112, fullname: 'John Doyle' },
          updated_at: '2019-10-25T09:43:11Z',
        },
      };

      renderWithStore(<ExpandedNoteDetails {...lastEditedProps} />);

      expect(
        screen.getByText('Last Edited by John Doyle on 25 Oct 2019')
      ).toBeInTheDocument();
    });
  });

  describe('when the standard-date-formatting flag is on the note metadata', () => {
    beforeEach(() => {
      window.setFlag('standard-date-formatting', true);
    });

    afterEach(() => {
      window.setFlag('standard-date-formatting', false);
    });

    it('displays the correct note metadata', () => {
      renderWithStore(<ExpandedNoteDetails {...props} />);

      expect(
        screen.getByText('Created by Rory Thornburgh on Oct 22, 2019')
      ).toBeInTheDocument();
    });

    it('displays the correct created by details even if there are no actions', () => {
      const noActionsProps = {
        ...props,
        annotation: {
          ...annotationDummyData(),
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
        },
      };

      renderWithStore(<ExpandedNoteDetails {...noActionsProps} />);

      expect(
        screen.getByText('Created by Rory Thornburgh on Oct 22, 2019')
      ).toBeInTheDocument();
    });

    it('displays the last edited details', () => {
      const lastEditedProps = {
        ...props,
        annotation: {
          ...annotationDummyData(),
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
          updated_by: { id: 112, fullname: 'John Doyle' },
          updated_at: '2019-10-25T09:43:11Z',
        },
      };

      renderWithStore(<ExpandedNoteDetails {...lastEditedProps} />);

      expect(
        screen.getByText('Last Edited by John Doyle on Oct 25, 2019')
      ).toBeInTheDocument();
    });
  });

  describe('the note metadata', () => {
    it('does not display the last edited details if updated_by is null', () => {
      renderWithStore(<ExpandedNoteDetails {...props} />);

      expect(screen.queryByText('Last Edited by')).not.toBeInTheDocument();
    });
  });

  describe('when there are attachments', () => {
    it('renders an attachment section', () => {
      renderWithStore(<ExpandedNoteDetails {...props} />);

      expect(screen.getByText('1.6 kB')).toBeInTheDocument();
      expect(screen.getByText('123 B')).toBeInTheDocument();
    });
  });

  describe('when the mls-emr-action-due-date feature flag is enabled', () => {
    beforeEach(() => {
      window.setFlag('mls-emr-action-due-date', true);
    });

    afterEach(() => {
      window.setFlag('mls-emr-action-due-date', true);
    });

    it('renders the action due date', () => {
      renderWithStore(<ExpandedNoteDetails {...props} />);

      expect(screen.getByText('Due date: 25 Jun 2019')).toBeInTheDocument();
    });
  });
});
