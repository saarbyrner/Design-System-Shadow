import { screen } from '@testing-library/react';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import NotesWidget from '../index';

describe('<NotesWidget />', () => {
  const mockOnAddNote = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDuplicate = jest.fn();
  const mockOnRemove = jest.fn();
  const mockOnClickActionCheckbox = jest.fn();
  const mockOnClickViewArchivedNotes = jest.fn();
  const mockOnArchiveNote = jest.fn();
  const mockOnEditNote = jest.fn();
  const mockOnDuplicateNote = jest.fn();
  const mockOnFetchNextNotes = jest.fn();
  const mockOnRestoreNote = jest.fn();

  const defaultProps = {
    widgetName: 'Notes',
    canManageDashboard: true,
    canViewNotes: true,
    canCreateNotes: true,
    canEditNotes: true,
    t: i18nextTranslateStub(),
    annotations: [],
    nextPage: null,
    onAddNote: mockOnAddNote,
    onEdit: mockOnEdit,
    onDuplicate: mockOnDuplicate,
    onRemove: mockOnRemove,
    onClickActionCheckbox: mockOnClickActionCheckbox,
    onClickViewArchivedNotes: mockOnClickViewArchivedNotes,
    onArchiveNote: mockOnArchiveNote,
    onEditNote: mockOnEditNote,
    onDuplicateNote: mockOnDuplicateNote,
    onFetchNextNotes: mockOnFetchNextNotes,
    onRestoreNote: mockOnRestoreNote,
    selectedAnnotationTypes: [],
    selectedPopulation: {},
    selectedTimeScope: {},
    updatedAction: {},
    users: [],
    totalNotes: 0,
  };

  const mockAnnotations = [
    {
      annotation_actions: [],
      annotation_date: '2019-10-21T23:00:00Z',
      annotationable: { id: 28022, fullname: 'Fabi Menghini' },
      annotationable_type: 'Athlete',
      archived: false,
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
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    window.featureFlags = {};
  });

  it('renders', () => {
    renderWithStore(<NotesWidget {...defaultProps} />);

    expect(screen.getByText('Notes (0)')).toBeInTheDocument();
    expect(screen.getByText('Add Note')).toBeInTheDocument();
  });

  it('shows the correct header if the widget is not loading', () => {
    renderWithStore(
      <NotesWidget
        {...defaultProps}
        annotations={mockAnnotations}
        totalNotes={4}
      />
    );

    expect(screen.getByText('Notes (4)')).toBeInTheDocument();
  });

  it('calls the correct callback when the add note button is clicked', async () => {
    const user = userEvent.setup();
    const propsWithTypes = {
      ...defaultProps,
      selectedAnnotationTypes: [{ organisation_annotation_type_id: 1 }],
    };

    renderWithStore(<NotesWidget {...propsWithTypes} />);

    const addNoteIcon = screen.getByText('Add Note');
    await user.click(addNoteIcon);

    expect(mockOnAddNote).toHaveBeenCalledTimes(1);
  });
  it('contains the correct class if the widget has an error', () => {
    const { container } = renderWithStore(
      <NotesWidget {...defaultProps} hasError />
    );

    expect(container.querySelector('.notesWidget--error')).toBeInTheDocument();
  });

  it('renders a WidgetMenu component when the user has the correct permissions', async () => {
    const user = userEvent.setup();
    renderWithStore(<NotesWidget {...defaultProps} />);

    const menuButton = screen.getByRole('button', {
      name: '',
    });
    await user.click(menuButton);

    const menuItems = [
      'Remove Notes Widget',
      'View Archived Notes',
      'Notes Widget Settings',
    ];

    menuItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  describe('when the widget isLoading', () => {
    it('has the correct class', () => {
      const { container } = renderWithStore(
        <NotesWidget {...defaultProps} isLoading />
      );

      expect(
        container.querySelector('.notesWidget--loading')
      ).toBeInTheDocument();
    });

    it('shows the placeholder image', () => {
      renderWithStore(<NotesWidget {...defaultProps} isLoading />);

      const loadingImage = screen.getByRole('img');
      expect(loadingImage).toBeInTheDocument();
    });

    it('does not show the add note button', () => {
      renderWithStore(<NotesWidget {...defaultProps} isLoading />);

      // When loading, the add note button should not be present
      expect(screen.queryByText('Add Note')).not.toBeInTheDocument();
    });
  });

  describe('when the user does not have the create notes permission', () => {
    it('does not render the add note button', () => {
      renderWithStore(<NotesWidget {...defaultProps} canCreateNotes={false} />);

      // When user can't create notes, the add note functionality should not be present
      expect(screen.queryByText('Add Note')).not.toBeInTheDocument();
    });
  });

  describe('when the user does not have the view notes permission', () => {
    it('does not render the notes', () => {
      renderWithStore(
        <NotesWidget
          {...defaultProps}
          canViewNotes={false}
          annotations={mockAnnotations}
        />
      );

      expect(screen.queryByText('Add Note')).not.toBeInTheDocument();
    });

    it('shows a message and the loading image', () => {
      renderWithStore(<NotesWidget {...defaultProps} canViewNotes={false} />);

      expect(
        screen.getByText(
          /Please contact your administrator for permission to view this data/
        )
      ).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  describe('when the rep-dashboard-ui-upgrade feature flag is enabled', () => {
    beforeEach(() => {
      window.setFlag('rep-dashboard-ui-upgrade', true);
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('renders the correct classes', () => {
      const updatedProps = {
        ...defaultProps,
        annotations: mockAnnotations,
      };
      const { container } = renderWithStore(<NotesWidget {...updatedProps} />);

      expect(
        container.querySelector('.notesWidget__noteV2')
      ).toBeInTheDocument();
      expect(
        container.querySelector('.notesWidget__contentV2')
      ).toBeInTheDocument();
    });
  });
});
