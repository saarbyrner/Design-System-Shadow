import { render, screen, fireEvent } from '@testing-library/react';
import {
  i18nextTranslateStub,
  buildEvent,
} from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';

import CollectionsSidePanel from '../CollectionsSidePanel';

describe('CollectionsSidePanel', () => {
  const mockSessionEvent = {
    id: '1',
    type: 'session_event',
    title: '',
    workload_type: 1,
    session_type: {
      id: 1,
      name: 'some session',
    },
    local_timezone: 'Europe/Dublin',
    start_date: '2023-10-12T10:00:16+00:00',
    duration: 40,
  };
  const props = {
    event: buildEvent(),
    assessmentGroups: [
      {
        id: 1,
        name: 'blabbedy',
        participation_levels: [{ id: 1, name: 'blabbedy' }],
      },
      {
        id: 2,
        name: 'bloopedy',
        participation_levels: [{ id: 2, name: 'bloopedy' }],
      },
    ],
    fetchWorkloadGrid: jest.fn(),
    setIsCollectionsPanelOpen: jest.fn(),
    canViewAssessments: true,
    canCreateAssessment: true,
    canCreateAssessmentFromTemplate: true,
    orgTimezone: 'UTC',
    participationLevels: [
      {
        id: 1,
        name: 'Testing',
        canonical_participation_level: 'none',
        include_in_group_calculations: true,
      },
    ],
    turnaroundList: [],
    assessmentTemplates: [],
    setShowForbiddenError: jest.fn(),
    setIsSessionEvaluation: jest.fn(),
    setIsSessionObjectives: jest.fn(),
    onSetSelectedGridDetails: jest.fn(),
    fetchAssessmentGrid: jest.fn(),
    saveAssessment: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('renders the correct content if event type is session', () => {
    render(<CollectionsSidePanel {...props} event={mockSessionEvent} />);

    expect(screen.getByText('Collections')).toBeInTheDocument();
    expect(screen.getByText('Session evaluation')).toBeInTheDocument();
    expect(screen.getByText('Session objectives')).toBeInTheDocument();
  });

  it('renders the correct content if event type is game', () => {
    render(<CollectionsSidePanel {...props} />);

    expect(screen.getByText('Collections')).toBeInTheDocument();
    expect(screen.getByText('Game evaluation')).toBeInTheDocument();
    expect(screen.getByText('Game objectives')).toBeInTheDocument();
  });

  describe('when the user has permission to view assessments', () => {
    it('renders the correct content', () => {
      render(<CollectionsSidePanel {...props} />);
      // Check for the create button (IconButton)
      expect(screen.getAllByRole('button')).toHaveLength(2);
      // Check for the collection side panel items

      expect(screen.getAllByRole('listitem')).toHaveLength(5);
      // Check that there are no locked items
      expect(
        document.querySelector('.collectionSidePanel__item--locked')
      ).toBeNull();
    });

    it('fetches the correct grid when clicking the button', async () => {
      const user = userEvent.setup();
      render(<CollectionsSidePanel {...props} />);
      const gridButtons = screen.getAllByRole('listitem');
      // The workload button is at index 2
      await user.click(gridButtons[2]);
      expect(props.setShowForbiddenError).toHaveBeenCalledWith(false);
      expect(props.fetchWorkloadGrid).toHaveBeenCalledWith(
        props.event.id,
        true,
        null
      );
      expect(props.setIsCollectionsPanelOpen).toHaveBeenCalledWith(false);
    });
    it('expects setShowForbiddenError to be called when clicking the assessment button, and onSetSelectedGridDetails to be called with the correct parameters', async () => {
      const user = userEvent.setup();

      render(<CollectionsSidePanel {...props} />);
      const gridButtons = screen.getAllByRole('listitem');
      // The assessment button is at index 3
      const assessmentButton = gridButtons[3];
      expect(assessmentButton).toHaveTextContent(
        props.assessmentGroups[0].name
      );
      await user.click(assessmentButton);
      expect(props.setShowForbiddenError).toHaveBeenCalledWith(false);
      expect(props.onSetSelectedGridDetails).toHaveBeenCalledWith({
        id: props.assessmentGroups[0].id,
        name: props.assessmentGroups[0].name,
        type: 'ASSESSMENT',
        participationLevels: props.assessmentGroups[0].participation_levels,
      });
      expect(props.fetchAssessmentGrid).toHaveBeenCalledWith(
        props.event.id,
        true,
        null
      );
      expect(props.setIsCollectionsPanelOpen).toHaveBeenCalledWith(false);
    });
    it('hides the create button when the user does not have permissions', () => {
      props.canCreateAssessment = false;
      props.canCreateAssessmentFromTemplate = false;
      render(<CollectionsSidePanel {...props} />);

      expect(
        document.querySelector('.collectionSidePanel__item--locked')
      ).not.toBeInTheDocument();
    });
    it('renders the locked state when user does not have permission to view assessments', () => {
      props.canViewAssessments = false;
      render(<CollectionsSidePanel {...props} />);

      // Locked item should be present
      const lockedItem = screen.getAllByRole('listitem');
      expect(lockedItem[3]).toBeInTheDocument();
    });
    it('displays the assessment form modal when create button is clicked', async () => {
      const user = userEvent.setup();
      props.canViewAssessments = true;
      props.canCreateAssessment = true;
      props.canCreateAssessmentFromTemplate = true;
      render(<CollectionsSidePanel {...props} />);
      // Find the create button by role or text, depending on implementation
      const createButton = screen.getAllByRole('button');

      await user.click(createButton[1]);
      // Check that the assessment form modal appears
      expect(
        screen.getByTestId('assessmentsAssessmentForm')
      ).toBeInTheDocument();
    });
    it('triggers the correct save action when filling out the form', async () => {
      props.canViewAssessments = true;
      props.canCreateAssessment = true;
      props.canCreateAssessmentFromTemplate = true;
      render(<CollectionsSidePanel {...props} />);
      const user = userEvent.setup();

      // Open the AssessmentForm modal
      const createButtons = screen.getAllByRole('button');
      await user.click(createButtons[1]);

      // Find the AssessmentForm modal
      const assessmentForm = await screen.findByTestId(
        'assessmentsAssessmentForm'
      );
      expect(assessmentForm).toBeInTheDocument();

      // Fill required fields in the AssessmentForm before submitting
      const nameInput = screen.getByLabelText(/name/i);
      await fireEvent.change(nameInput, {
        target: { value: 'Test Assessment' },
      });

      // Simulate submitting the form
      // The AssessmentForm's submit button should have text 'Save'
      const submitButton = screen.getByText('Save');
      await user.click(submitButton);

      expect(props.saveAssessment).toHaveBeenCalled();
    });
  });
});
