import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import CollectionsTabHeader from '../CollectionsTabHeader';

const defaultProps = {
  event: {},
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
  t: i18nextTranslateStub(),
};

describe('<CollectionsTabHeader />', () => {
  // Cleanup after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the correct content', () => {
    render(<CollectionsTabHeader {...defaultProps} />);

    // Check for the header element by its class name
    expect(
      document.querySelector('.planningEventGridTab__header')
    ).toBeInTheDocument();

    // Check for text buttons by their text content
    const editButton = screen.getByRole('button', { name: /Edit values/i });
    const columnsButton = screen.getByRole('button', { name: /Columns/i });
    const collectionChannelsButton = screen.getByRole('button', {
      name: /Collection channels/i,
    });

    expect(editButton).toBeInTheDocument();
    expect(columnsButton).toBeInTheDocument();
    expect(collectionChannelsButton).toBeInTheDocument();
  });

  it('disables the columns and edit values buttons when the grid is loading', () => {
    render(<CollectionsTabHeader {...defaultProps} isGridLoading />);

    const editButton = screen.getByRole('button', { name: /Edit values/i });
    const columnsButton = screen.getByRole('button', { name: /Columns/i });

    expect(editButton).toBeDisabled();
    expect(columnsButton).toBeDisabled();
  });

  it('renders the correct title when the default collection is selected', () => {
    render(<CollectionsTabHeader {...defaultProps} />);
    const title = screen.getByText('Workload');
    expect(title).toBeInTheDocument();
    expect(
      document.querySelector('.planningEventGridTab__title')
    ).toBeInTheDocument();
  });

  // -- The rest of the tests follow a similar pattern --

  describe('when the selected collection is of type ASSESSMENT', () => {
    const assessmentProps = {
      ...defaultProps,
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
        screen.getByRole('button', { name: /Edit values/i })
      ).toBeDisabled();
    });

    it('disables the columns button when canCreateAssessment is false', () => {
      render(
        <CollectionsTabHeader
          {...assessmentProps}
          canCreateAssessment={false}
        />
      );
      expect(screen.getByRole('button', { name: /Columns/i })).toBeDisabled();
    });

    it('renders the columns button', () => {
      render(<CollectionsTabHeader {...assessmentProps} />);
      expect(
        screen.getByRole('button', { name: /Columns/i })
      ).toBeInTheDocument();
    });

    it('renders the comments button', () => {
      render(<CollectionsTabHeader {...assessmentProps} />);
      expect(
        screen.getByRole('button', { name: /Comments/i })
      ).toBeInTheDocument();
    });

    it('does not render the comments button if showComments is false', () => {
      render(
        <CollectionsTabHeader {...assessmentProps} showComments={false} />
      );
      expect(screen.queryByText(/Comments/i)).not.toBeInTheDocument();
    });

    it('renders the correct items in the tooltipMenu', async () => {
      const user = userEvent.setup();

      render(<CollectionsTabHeader {...assessmentProps} />);
      await user.click(screen.getAllByRole('button')[4]);
      const editDetailsMenuItem = screen.getByRole('button', {
        name: /Edit details/i,
      });
      const reorderMenuItem = screen.getByRole('button', {
        name: /Reorder/i,
      });

      expect(editDetailsMenuItem).toBeInTheDocument();
      expect(reorderMenuItem).toBeInTheDocument();
    });
  });

  it('renders the edit state', () => {
    render(<CollectionsTabHeader {...defaultProps} editMode />);
    // In edit mode, there should be "Save" and "Cancel" buttons
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('cancels when the cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(<CollectionsTabHeader {...defaultProps} editMode />);
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);
    expect(defaultProps.cancelUpdate).toHaveBeenCalledTimes(1);
  });

  it('prevents saves when no changes have been made', () => {
    render(<CollectionsTabHeader {...defaultProps} disableSave editMode />);
    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeDisabled();
  });

  it('triggers a save when changes have been made', async () => {
    const user = userEvent.setup();

    render(<CollectionsTabHeader {...defaultProps} editMode />);
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);
    expect(defaultProps.bulkUpdateAttributes).toHaveBeenCalledTimes(1);
  });

  it('hides the edit button when canEditEvent is false', () => {
    render(<CollectionsTabHeader {...defaultProps} canEditEvent={false} />);
    expect(screen.queryByText(/Edit values/i)).not.toBeInTheDocument();
  });

  it('hides the save/cancel buttons when canEditEvent is false but somehow editMode is true', () => {
    render(
      <CollectionsTabHeader {...defaultProps} editMode canEditEvent={false} />
    );
    expect(screen.queryByText(/Save/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Cancel/i)).not.toBeInTheDocument();
  });

  it('renders participation levels when present', () => {
    const propsWithParticipation = {
      ...defaultProps,
      selectedCollection: {
        ...defaultProps.selectedCollection,
        name: 'Test Assessment',
        type: 'ASSESSMENT',
        participationLevels: [{ id: 123, name: 'Test hello' }],
      },
    };
    render(<CollectionsTabHeader {...propsWithParticipation} />);
    expect(
      document.querySelector(
        '.planningEventGridTab__assessment--participationLevels'
      )
    ).toBeInTheDocument();
  });

  it('opens the assessment form when requested', async () => {
    const user = userEvent.setup();
    const propsWithAssessment = {
      ...defaultProps,
      selectedCollection: {
        ...defaultProps.selectedCollection,
        name: 'Test Assessment',
        type: 'ASSESSMENT',
        participationLevels: [
          { id: 123, name: 'Test hello' },
          { id: 234, name: 'testing hi' },
        ],
      },
    };
    render(<CollectionsTabHeader {...propsWithAssessment} />);

    // Check for the mock form before the click
    expect(
      screen.queryByTestId('assessmentsAssessmentForm')
    ).not.toBeInTheDocument();

    // console.log(screen.getAllByRole('button'))
    await user.click(screen.getAllByRole('button')[4]);

    await user.click(screen.getAllByTestId('TooltipMenu|ListItemButton')[1]);

    expect(screen.getByTestId('assessmentsAssessmentForm')).toBeInTheDocument();
  });
});
