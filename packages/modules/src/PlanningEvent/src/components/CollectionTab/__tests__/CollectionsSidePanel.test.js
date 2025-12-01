import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { buildEvent } from '@kitman/common/src/utils/test_utils';
import CollectionsSidePanel from '../CollectionsSidePanel';

describe('<CollectionsSidePanel />', () => {
  let props;

  beforeEach(() => {
    props = {
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
      onSetSelectedGridDetails: jest.fn(),
      fetchAssessmentGrid: jest.fn(),
      saveAssessment: jest.fn(),
      t: jest.fn(),
    };
  });

  it('renders the correct content', () => {
    render(<CollectionsSidePanel {...props} />);

    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('fetches the correct grid when clicking the button', async () => {
    const user = userEvent.setup();
    render(<CollectionsSidePanel {...props} />);
    const gridButtons = document.querySelectorAll('.collectionSidePanel__item');
    expect(gridButtons.length).toBe(3);

    await user.click(gridButtons[0]);
    expect(props.setShowForbiddenError).toHaveBeenCalledWith(false);
    expect(props.fetchWorkloadGrid).toHaveBeenCalledWith(
      props.event.id,
      true,
      null
    );
    expect(props.setIsCollectionsPanelOpen).toHaveBeenCalledWith(false);
  });

  it('fetches the correct grid when clicking the assessment button', async () => {
    const user = userEvent.setup();
    render(<CollectionsSidePanel {...props} />);
    const gridButtons = document.querySelectorAll('.collectionSidePanel__item');
    expect(gridButtons.length).toBe(3);

    expect(gridButtons[1]).toHaveTextContent(props.assessmentGroups[0].name);
    await user.click(gridButtons[1]);
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
    expect(screen.getByRole('button')).toBeInTheDocument();
    // only the close button should be present
    expect(screen.getByTestId('panel-close-button')).toBeInTheDocument();
  });

  it('renders the locked state when user does not have permission to view assessments', () => {
    props.canViewAssessments = false;
    render(<CollectionsSidePanel {...props} />);
    // only the close button should be present
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(
      document.querySelectorAll('.collectionSidePanel__item--locked')
    ).toHaveLength(1);
  });

  it('displays the assessment form modal when create button is clicked', async () => {
    const user = userEvent.setup();
    props.canViewAssessments = true;
    props.canCreateAssessment = true;
    props.canCreateAssessmentFromTemplate = true;
    render(<CollectionsSidePanel {...props} />);
    const createButton = screen.getAllByRole('button');
    await user.click(createButton[1]);

    expect(
      screen.getByRole('heading', { name: 'Add form' })
    ).toBeInTheDocument();
  });

  it('triggers the correct save action when filling out the form', async () => {
    const user = userEvent.setup();

    props.canViewAssessments = true;
    props.canCreateAssessment = true;
    props.canCreateAssessmentFromTemplate = true;
    render(<CollectionsSidePanel {...props} />);
    const createButton = screen.getAllByRole('button');
    await user.click(createButton[1]);

    // Fill out required form fields before submitting
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Assessment' } });

    const submitButton = screen.getByRole('button', { name: 'Save' });

    await user.click(submitButton);
    expect(props.saveAssessment).toHaveBeenCalled();
  });
});
