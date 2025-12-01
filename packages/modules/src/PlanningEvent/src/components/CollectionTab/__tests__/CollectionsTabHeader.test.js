import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { buildEvent } from '@kitman/common/src/utils/test_utils';
import CollectionsTabHeader from '../CollectionsTabHeader';

describe('<CollectionsTabHeader />', () => {
  const props = {
    event: buildEvent(),
    bulkUpdateAttributes: jest.fn(),
    cancelUpdate: jest.fn(),
    canAnswerAssessment: true,
    canCreateAssessment: true,
    canEditEvent: true,
    disableSave: false,
    editMode: false,
    isGridLoading: false,
    setEditMode: jest.fn(),
    onClickOpenReorderColumnModal: jest.fn(),
    selectedCollection: { name: 'Workload', type: 'DEFAULT' },
    showComments: true,
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
    onSetSelectedGridDetails: jest.fn(),
    fetchAssessmentGrid: jest.fn(),
    saveAssessment: jest.fn(),
    t: (t) => t,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the correct content', () => {
    render(<CollectionsTabHeader {...props} />);
    expect(screen.getByText('Edit values')).toBeInTheDocument();
    expect(screen.getByText('Columns')).toBeInTheDocument();
    expect(screen.getByText('Collection channels')).toBeInTheDocument();
  });

  it('disables the columns and edit values buttons when the grid is loading', () => {
    render(<CollectionsTabHeader {...props} isGridLoading />);
    expect(screen.getByRole('button', { name: 'Edit values' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Columns' })).toBeDisabled();
  });

  it('renders the correct title when the default collection is selected', () => {
    render(<CollectionsTabHeader {...props} />);
    expect(screen.getByText('Workload')).toBeInTheDocument();
  });

  describe('when the selected collection is of type ASSESSMENT', () => {
    const assessmentProps = {
      ...props,
      selectedCollection: { name: 'Test Assessment', type: 'ASSESSMENT' },
    };

    it('renders the correct title', () => {
      render(<CollectionsTabHeader {...assessmentProps} />);
      expect(screen.getByText('Test Assessment')).toBeInTheDocument();
    });

    it('disables the edit values button when canAnswerAssessment is false', () => {
      render(
        <CollectionsTabHeader
          {...assessmentProps}
          canAnswerAssessment={false}
        />
      );
      expect(
        screen.getByRole('button', { name: 'Edit values' })
      ).toBeDisabled();
    });

    it('disables the columns button when canCreateAssessment is false', () => {
      render(
        <CollectionsTabHeader
          {...assessmentProps}
          canCreateAssessment={false}
        />
      );
      expect(screen.getByRole('button', { name: 'Columns' })).toBeDisabled();
    });

    it('renders the columns button', () => {
      render(<CollectionsTabHeader {...assessmentProps} />);
      expect(
        screen.getByRole('button', { name: 'Columns' })
      ).toBeInTheDocument();
    });

    it('renders the comments button', () => {
      render(<CollectionsTabHeader {...assessmentProps} />);
      expect(
        screen.getByRole('button', { name: 'Comments' })
      ).toBeInTheDocument();
    });

    it('does not render the comments button if showComments is false', () => {
      render(
        <CollectionsTabHeader {...assessmentProps} showComments={false} />
      );
      expect(
        screen.queryByRole('button', { name: 'Comments' })
      ).not.toBeInTheDocument();
    });

    it('renders the correct items in the tooltipMenu', async () => {
      const user = userEvent.setup();
      render(<CollectionsTabHeader {...assessmentProps} />);

      const buttons = screen.getAllByRole('button');

      await user.click(buttons[4]);
      expect(
        screen.getByRole('button', { name: 'Reorder' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Edit details' })
      ).toBeInTheDocument();
    });
  });

  it('renders the edit state', () => {
    render(<CollectionsTabHeader {...props} editMode />);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('cancels when the cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<CollectionsTabHeader {...props} editMode />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(props.cancelUpdate).toHaveBeenCalledTimes(1);
  });

  it('prevents saves when no changes have been made', () => {
    render(<CollectionsTabHeader {...props} disableSave editMode />);
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('triggers a save when changes have been made', async () => {
    const user = userEvent.setup();
    render(<CollectionsTabHeader {...props} editMode />);
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(props.bulkUpdateAttributes).toHaveBeenCalledTimes(1);
  });

  it('hides the edit button when canEditEvent is false', () => {
    render(<CollectionsTabHeader {...props} canEditEvent={false} />);
    expect(
      screen.queryByRole('button', { name: 'Edit values' })
    ).not.toBeInTheDocument();
  });

  it('hides the save/cancel buttons when canEditEvent is false but somehow editMode is true', () => {
    render(<CollectionsTabHeader {...props} editMode canEditEvent={false} />);
    expect(
      screen.queryByRole('button', { name: 'Save' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Cancel' })
    ).not.toBeInTheDocument();
  });

  it('renders participation levels when present', () => {
    render(
      <CollectionsTabHeader
        {...props}
        selectedCollection={{
          name: 'Test Assessment',
          type: 'ASSESSMENT',
          participationLevels: [
            { id: 123, name: 'Test hello' },
            { id: 234, name: 'testing hi' },
          ],
        }}
      />
    );
    expect(screen.getByText(/Test hello/)).toBeInTheDocument();
    expect(screen.getByText(/testing hi/)).toBeInTheDocument();
  });

  it('opens the assessment form when requested', async () => {
    const user = userEvent.setup();
    render(
      <CollectionsTabHeader
        {...props}
        selectedCollection={{
          name: 'Test Assessment',
          type: 'ASSESSMENT',
          participationLevels: [
            { id: 123, name: 'Test hello' },
            { id: 234, name: 'testing hi' },
          ],
        }}
      />
    );

    // Check participation levels are rendered
    expect(screen.getByText('Test hello | testing hi')).toBeInTheDocument();

    // Assessment form should not be visible initially
    expect(screen.queryByTestId('assessment-form')).not.toBeInTheDocument();
    // Find and click the "Edit details" menu item
    const buttons = screen.getAllByRole('button');

    await user.click(buttons[4]);
    const editDetailsButton = screen.getByRole('button', {
      name: 'Edit details',
    });
    await user.click(editDetailsButton);

    // Assessment form should now be visible
    expect(screen.getByText('Add form')).toBeInTheDocument();
  });
});
