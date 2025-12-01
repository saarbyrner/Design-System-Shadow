import { Provider } from 'react-redux';
import { render, screen, within } from '@testing-library/react';
import { axios } from '@kitman/common/src/utils/services';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { saveMedicalNote as saveMedicalNoteSingle } from '@kitman/services';
import {
  useGetAnnotationMedicalTypesQuery,
  useGetLastCoachesReportNoteQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { cellNotBeingEditedValue } from '@kitman/modules/src/Medical/shared/components/CoachesReportRefactorTab/utils/utils';
import CoachesReportRefactorOverviewGrid from '../components/CoachesReportRefactorOverviewGrid';

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  medicalApi: {
    useGetAnnotationMedicalTypesQuery: jest.fn(),
    useGetLastCoachesReportNoteQuery: jest.fn(),
  },
});
jest.mock('@kitman/services/src/services/medical/saveMedicalNote.js');

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('<CoachesReportRefactorOverviewGrid />', () => {
  let user = userEvent.setup();
  let editingCellId = cellNotBeingEditedValue;
  const i18nT = i18nextTranslateStub();
  let getSingleCoachesNote;
  const defaultProps = {
    t: i18nT,
    grid: {
      rows: [
        {
          id: 40211,
          player_id: null,
          allergies: [],
          athlete_medical_alerts: [],
          availability_comment: 'comment here ath 1',
          athlete: {
            fullname: 'Tomas Albornoz',
            position: 'Second Row',
            avatar_url: 'url_here',
            availability: 'unavailable',
            extended_attributes: {},
          },
          availability_status: {
            availability: 'unavailable',
            unavailable_since: '282 days',
          },
          most_recent_coaches_note: {
            id: 6988898,
            title: 'Note Title 6988898',
            content: '<p>coach note here tomas</p>',
            annotation_date: '2024-05-07T23:00:00Z',
            created_by: {
              id: 137860,
              fullname: 'Kendrick woo',
            },
            updated_by: {
              id: 16860,
              fullname: 'Fredrick foo',
            },
            created_at: '2024-05-07T23:00:00Z',
            updated_at: '2024-05-07T23:00:00Z',
          },
          open_injuries_illnesses: {
            has_more: false,
            issues: [
              {
                id: 13899,
                issue_id: 13900,
                name: 'Oct  6, 2022 - Abcess Ankle (excl. Joint) [Left]',
                status: 'Causing unavailability (time-loss)',
                causing_unavailability: true,
                issue_type: 'Illness',
              },
            ],
          },
          latest_note: {
            title: 'Note Title 7753585',
            content:
              "He's an absolute dream! -- Quaerat quibusdam ipsa molestiae cupiditate aut. Fugit accusantium aspernatur ut aut iure et.",
            date: 'Jun  2, 2023',
            restricted_annotation: false,
          },
          squad: [
            {
              name: 'International Squad',
              primary: true,
            },
          ],
        },
        {
          id: 96981,
          player_id: null,
          allergies: [],
          athlete_medical_alerts: [],
          availability_comment: 'comment here ath 2',
          athlete: {
            fullname: 'Janet Athlete',
            position: 'Wing',
            avatar_url: 'url_here2',
            availability: 'available',
            extended_attributes: {},
          },
          availability_status: {
            availability: 'available',
            unavailable_since: null,
          },

          most_recent_coaches_note: {
            id: 6398,
            title: 'Note Title 6398',
            content: '<div><h1>coach note here janet</h1></div>',
            annotation_date: '2024-05-07T23:00:00Z',
            created_by: {
              id: 147860,
              fullname: 'Allan Munro2',
            },
            created_at: '2024-05-07T23:00:00Z',
            updated_by: {
              id: 137860,
              fullname: 'Allan Munro1',
            },
            updated_at: '2024-05-07T23:00:00Z',
          },
          open_injuries_illnesses: {
            has_more: false,
            issues: [],
          },
          latest_note: null,
          squad: [
            {
              name: 'International Squad',
              primary: false,
            },
          ],
        },
        {
          id: 96321,
          player_id: null,
          allergies: [],
          athlete_medical_alerts: [],
          athlete: {
            fullname: 'Kendrick Cole',
            position: 'Wing',
            avatar_url: 'url_here3',
            availability: 'available',
            extended_attributes: {},
          },
          availability_status: {
            availability: 'available',
            unavailable_since: null,
          },
          most_recent_coaches_note: null,
          open_injuries_illnesses: {
            has_more: false,
            issues: [],
          },
          latest_note: null,
          squad: [
            {
              name: 'International Squad',
              primary: false,
            },
          ],
        },
      ],
      next_id: null,
    },
    dataGridCurrentDate: 'Wed May 22 2029 17:55:15 GMT+0100',
    canViewMedicalAvailability: true,
    canViewInjuries: true,
    canViewAvailabilityStatus: true,
    setRowSelectionModel: jest.fn(),
    setModalIsOpen: jest.fn(),
    rehydrateGrid: jest.fn(),
    fetchNextGridRows: jest.fn(),
    updateCoachesNoteInlinePayLoad: jest.fn(),
    isInMultiCopyNoteMode: false,
    setRequestStatus: jest.fn(),
    addMedicalNote: jest.fn(),
    updatePayload: jest.fn(),
  };
  const mockResponse = {
    annotationable_type: 'Athlete',
    organisation_annotation_type_id: 11446,
    annotationable_id: 96321,
    athlete_id: 96321,
    title: 'Daily status note',
    annotation_date: defaultProps.dataGridCurrentDate,
    content: '<p></p><p>injured1</p>',
    illness_occurrence_ids: [],
    injury_occurrence_ids: [],
    chronic_issue_ids: [],
    restricted_to_doc: false,
    restricted_to_psych: false,
    attachments_attributes: [],
    annotation_actions_attributes: [],
    scope_to_org: true,
  };
  const newTextValue = 'hello coach';

  const TestingComponent = (props) => {
    return (
      <Provider store={store}>
        <CoachesReportRefactorOverviewGrid {...defaultProps} {...props} />;
      </Provider>
    );
  };

  const richTextEditorShouldBeRendered = (expectedRenderedState) => {
    const toolbarButtons = screen.queryByRole('group');

    if (expectedRenderedState) {
      // Assert that RichTextEditor is rendered
      expect(toolbarButtons).toBeInTheDocument();

      const editorWrapper = toolbarButtons.parentElement.parentElement;
      expect(editorWrapper).toHaveClass('remirror-theme');

      const editorTextInput = within(editorWrapper).queryByRole('textbox');
      expect(editorTextInput).toBeInTheDocument();

      const saveButton = within(
        editorWrapper.parentNode.parentNode.parentNode
      ).getByRole('button', {
        name: 'Save',
      });
      expect(saveButton).toBeInTheDocument();
    } else {
      // Assert that RichTextEditor is not rendered
      expect(toolbarButtons).not.toBeInTheDocument();
    }
  };

  beforeEach(() => {
    mockDispatch.mockClear();
    editingCellId = cellNotBeingEditedValue;
    saveMedicalNoteSingle.mockResolvedValue(mockResponse);
    window.featureFlags = { 'nfl-comments-tab': true };

    useGetAnnotationMedicalTypesQuery.mockReturnValue({
      data: [
        { id: 11446, type: 'OrganisationAnnotationTypes::DailyStatusNote' },
      ],
      error: false,
      isLoading: false,
    });
    useGetLastCoachesReportNoteQuery.mockReturnValue({
      id: 16239540,
      organisation_annotation_type: {
        id: 12291,
        name: 'Daily status note',
        type: 'OrganisationAnnotationTypes::DailyStatusNote',
      },
      annotationable_type: 'Athlete',
      annotationable: {
        id: 192866,
        fullname: 'Mark AccessLink',
        position: 'Hooker',
      },
      title: 'Daily status note',
      content:
        '<p>[Copied from 13 Sep 2025 IST]</p><p>[Copied from 3 May 2025 IST]</p><p>[Copied from 2 May 2025 IST]</p><p>[Copied from 1 May 2025 IST]</p><p>[Copied from 30 Apr 2025 IST]</p><p>[Copied from 20 Mar 2025 GMT]</p><p>[Copied from 19 Mar 2025 GMT]</p><p>[Copied from 15 Dec 2024 GMT]</p><p>[Copied from 14 Dec 2024 GMT]</p><p>Some note value mark</p>',
      annotation_date: '2025-09-12T23:00:00Z',
      annotation_actions: [],
      expiration_date: null,
      attachments: [],
      archived: false,
      created_by: {
        id: 139077,
        fullname: 'Ryan Dowler',
      },
      created_at: '2024-09-09T15:25:57Z',
      updated_by: null,
      updated_at: '2024-09-09T15:25:57Z',
      document_note_categories: [],
      organisation_id: 6,
      note_summary:
        '[Copied from 3 May 2025 IST]  [Copied from 2 May 2025 IST]  [Copied from 1 May 2025 IST]  [Copied from 30 Apr 2025 IST]  [Copied from 20 Mar 2025 GMT]  [Copied from 19 Mar 2025 GMT]  [Copied from 15 Dec 2024 GMT]  [Copied from 14 Dec 2024 GMT]  fwefefefeffefe mark',
      author: null,
      allow_list: [],
    });
  });

  afterEach(() => {
    window.featureFlags = { ' nfl-comments-tab': false };
    jest.clearAllMocks();
  });

  it('renders the data grid', () => {
    render(<TestingComponent canViewMedicalIssues />);

    // Data grid
    const dataGrid = screen.getByRole('grid');
    const tableHeaders = dataGrid.querySelectorAll(
      '.MuiDataGrid-columnHeaderTitle'
    );

    expect(tableHeaders.length).toBe(5);

    // Table Rows
    const tableRows = dataGrid.parentNode
      .querySelector('.MuiDataGrid-root')
      .querySelectorAll('.MuiDataGrid-row');

    expect(tableRows.length).toBe(defaultProps.grid.rows.length);

    // DataGrid row counter
    const rowCounterTextValue = `Total Rows: ${defaultProps.grid.rows.length}`;
    const rowCounterElement = screen.getByText(rowCounterTextValue);

    expect(rowCounterElement).toBeInTheDocument();
  });

  it('renders the athlete avatar and position', () => {
    render(<TestingComponent />);

    const athleteCard = screen.getAllByTestId('coachesReport|AthleteCell')[0];
    const athleteAvatar = athleteCard.querySelector('img');
    const athleteName = athleteCard.querySelector('a');
    const athletePosition = athleteCard.querySelector('span');

    expect(athleteAvatar).toHaveAttribute(
      'src',
      defaultProps.grid.rows[0].athlete.avatar_url
    );
    expect(athleteName).toHaveTextContent(
      defaultProps.grid.rows[0].athlete.fullname
    );
    expect(athleteName).toHaveAttribute(
      'href',
      `/medical/athletes/${defaultProps.grid.rows[0].id}`
    );
    expect(athletePosition).toHaveTextContent(
      defaultProps.grid.rows[0].athlete.position
    );
  });

  it('renders the availability status correctly', () => {
    render(<TestingComponent />);

    const athleteCard = screen.getAllByTestId('Storybook|AvailabilityLabel')[0]
      .parentNode;
    const availabilityStatus = athleteCard.querySelectorAll('p')[0];
    const unavailableSince = athleteCard.querySelectorAll('p')[1];

    expect(availabilityStatus.textContent.toLowerCase()).toEqual(
      defaultProps.grid.rows[0].availability_status.availability
    );
    expect(availabilityStatus).toHaveStyle({ textTransform: 'capitalize' });
    expect(unavailableSince).toHaveTextContent(
      defaultProps.grid.rows[0].availability_status.unavailable_since
    );
  });

  it('renders the default columns (without injury & availability permissions)', () => {
    render(
      <TestingComponent
        canViewInjuries={false}
        canViewAvailabilityStatus={false}
      />
    );
    const columnNames = ['Athlete', 'Note', 'Updated by'];

    // Data grid
    const dataGrid = screen.getByRole('grid');
    const tableHeaders = dataGrid.querySelectorAll(
      '.MuiDataGrid-columnHeaderTitle'
    );
    const tableHeaderLabels = Array.from(tableHeaders).map(
      (header) => header.textContent
    );

    columnNames.forEach((columnName, i) => {
      expect(columnName).toEqual(tableHeaderLabels[i]);
    });
  });

  it('does not render the availability status column when canViewAvailabilityStatus = false', () => {
    render(<TestingComponent canViewAvailabilityStatus={false} />);

    const athleteCard = screen.queryByTestId('Storybook|AvailabilityLabel');
    expect(athleteCard).not.toBeInTheDocument();
  });

  it('renders the default columns and Availability column when canViewAvailabilityStatus = true', () => {
    render(
      <TestingComponent canViewInjuries={false} canViewAvailabilityStatus />
    );
    const columnNames = [
      'Athlete',
      'Availability status',
      // 'Open Injury/ Illness',
      'Note',
      'Updated by',
    ];

    // Data grid
    const dataGrid = screen.getByRole('grid');
    const tableHeaders = dataGrid.querySelectorAll(
      '.MuiDataGrid-columnHeaderTitle'
    );
    const tableHeaderLabels = Array.from(tableHeaders).map(
      (header) => header.textContent
    );

    columnNames.forEach((columnName, i) => {
      expect(columnName).toEqual(tableHeaderLabels[i]);
    });
  });

  it('renders the default columns and Open Injury column when canViewInjuries = true', () => {
    render(
      <TestingComponent canViewInjuries canViewAvailabilityStatus={false} />
    );
    const columnNames = [
      'Athlete',
      'Open Injury/ Illness',
      'Note',
      'Updated by',
    ];

    // Data grid
    const dataGrid = screen.getByRole('grid');
    const tableHeaders = dataGrid.querySelectorAll(
      '.MuiDataGrid-columnHeaderTitle'
    );
    const tableHeaderLabels = Array.from(tableHeaders).map(
      (header) => header.textContent
    );

    columnNames.forEach((columnName, i) => {
      expect(columnName).toEqual(tableHeaderLabels[i]);
    });
  });

  it('does not render the Open Injury column when canViewInjuries = false', () => {
    render(
      <TestingComponent
        canViewInjuries={false}
        canViewAvailabilityStatus={false}
      />
    );
    const columnNames = ['Athlete', 'Note', 'Updated by'];

    // Data grid
    const dataGrid = screen.getByRole('grid');
    const tableHeaders = dataGrid.querySelectorAll(
      '.MuiDataGrid-columnHeaderTitle'
    );
    const tableHeaderLabels = Array.from(tableHeaders).map(
      (header) => header.textContent
    );

    columnNames.forEach((columnName, i) => {
      expect(columnName).toEqual(tableHeaderLabels[i]);
    });
  });

  it('renders the default columns and Availability and Open Injury column columns when permissions present', () => {
    render(<TestingComponent canViewInjuries canViewAvailabilityStatus />);
    const columnNames = [
      'Athlete',
      'Availability status',
      'Open Injury/ Illness',
      'Note',
      'Updated by',
    ];

    // Data grid
    const dataGrid = screen.getByRole('grid');
    const tableHeaders = dataGrid.querySelectorAll(
      '.MuiDataGrid-columnHeaderTitle'
    );
    const tableHeaderLabels = Array.from(tableHeaders).map(
      (header) => header.textContent
    );

    columnNames.forEach((columnName, i) => {
      expect(columnName).toEqual(tableHeaderLabels[i]);
    });
  });

  it('renders richTextEditor within note cell when clicked when not in multi edit/create mode', async () => {
    let setEditingCellId;

    // Initial render
    const { rerender } = render(
      <TestingComponent
        rowSelectionModel={[]}
        canCreateNotes
        editingCellId={editingCellId}
        setEditingCellId={(newId) => setEditingCellId(newId)}
      />
    );

    // Used to re-render to update editingCellId as state in parent now
    setEditingCellId = (newId) => {
      editingCellId = newId;
      rerender(
        <TestingComponent
          rowSelectionModel={[]}
          canCreateNotes
          editingCellId={editingCellId}
          setEditingCellId={setEditingCellId}
        />
      );
    };

    const firstNote = screen.getByText('coach note here tomas');

    richTextEditorShouldBeRendered(false);

    await user.click(firstNote);

    richTextEditorShouldBeRendered(true);
    expect(screen.getByText('coach note here tomas')).toBeInTheDocument();
  });

  it('filters the note column correctly', async () => {
    render(<TestingComponent rowSelectionModel={[1]} />);

    const noteColumnHeader = screen.getByLabelText('Note');
    let athleteNameCells = screen.getAllByRole('cell', {
      name: (_content, element) =>
        element.getAttribute('data-field') === 'athlete',
    });

    // click on column header to re-sort
    expect(athleteNameCells[0]).toHaveTextContent('Tomas Albornoz');
    await user.click(noteColumnHeader);

    // check who is now at top of grid after sort
    athleteNameCells = screen.getAllByRole('cell', {
      name: (_content, element) =>
        element.getAttribute('data-field') === 'athlete',
    });
    expect(athleteNameCells[0]).toHaveTextContent('Kendrick Cole');
  });

  it('renders richTextEditor within note cell when clicked when grid is in multi edit/create mode', async () => {
    // rowSelectionModel contains ids from rows selected by their checkbox - meaning multi edit mode is on if more than 1 id and single row input should be off

    let setEditingCellId;

    // Initial render
    const { rerender } = render(
      <TestingComponent
        rowSelectionModel={[1, 2]}
        canCreateNotes
        editingCellId={editingCellId}
        setEditingCellId={(newId) => setEditingCellId(newId)}
      />
    );

    // Used to re-render to update editingCellId as state in parent now
    setEditingCellId = (newId) => {
      editingCellId = newId;
      rerender(
        <TestingComponent
          rowSelectionModel={[1, 2]}
          canCreateNotes
          editingCellId={editingCellId}
          setEditingCellId={setEditingCellId}
        />
      );
    };

    const firstNote = screen.getByText('coach note here tomas');

    richTextEditorShouldBeRendered(false);

    await user.click(firstNote);

    richTextEditorShouldBeRendered(false);
    expect(screen.getByText('coach note here tomas')).toBeInTheDocument();
  });

  it('renders note cells', () => {
    render(<TestingComponent />);

    // Data grid
    const dataGrid = screen.getByRole('grid');

    // Table Rows
    const tableRows = dataGrid.parentNode
      .querySelector('.MuiDataGrid-root')
      .querySelectorAll('.MuiDataGrid-row');
    const firstRow = tableRows[0];
    const secondRow = tableRows[1];

    expect(
      within(firstRow).getByText('coach note here tomas')
    ).toBeInTheDocument();
    expect(
      within(secondRow).getByText('coach note here janet')
    ).toBeInTheDocument();
  });

  it('does not render the injury column when medical.issues.canView is false', () => {
    render(<TestingComponent canViewInjuries={false} />);
    expect(screen.queryByText('Open Injury/ Illness')).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'Oct 6, 2022 - Abcess Ankle (excl. Joint) [Left]Causing unavailability (time-loss)'
      )
    ).not.toBeInTheDocument();
  });

  it('renders copy last note button in richTextEditor when theres no content and editor not in focus when canCreateNotes prop/permission is TRUE', async () => {
    let setEditingCellId;

    // Initial render
    const { rerender } = render(
      <TestingComponent
        rowSelectionModel={[1]}
        canCreateNotes
        editingCellId={editingCellId}
        setEditingCellId={(newId) => setEditingCellId(newId)}
      />
    );

    // Used to re-render to update editingCellId as state in parent now
    setEditingCellId = (newId) => {
      editingCellId = newId;
      rerender(
        <TestingComponent
          rowSelectionModel={[1]}
          canCreateNotes
          editingCellId={editingCellId}
          setEditingCellId={setEditingCellId}
        />
      );
    };

    const cellWithNoNote = screen.getByTestId('AddIcon');

    // Button not yet rendered
    expect(screen.queryByText('Copy last note')).not.toBeInTheDocument();

    // Render empty (new note) richTextEditor input
    await user.click(cellWithNoNote);

    // Button is now rendered
    expect(screen.getByText('Copy last note')).toBeInTheDocument();

    // Editor gets focused so button is removed
    const editorTextInput = screen.getByRole('textbox');
    await user.click(editorTextInput);
    expect(screen.queryByText('Copy last note')).not.toBeInTheDocument();
  });

  it('calls the correct endpoint when the user uses the copy last note feature inline and canCreateNotes prop/permission is TRUE', async () => {
    let setEditingCellId;

    // Initial render
    const { rerender } = render(
      <TestingComponent
        rowSelectionModel={[1]}
        isInMultiCopyNoteMode
        canCreateNotes
        editingCellId={editingCellId}
        setEditingCellId={(newId) => setEditingCellId(newId)}
      />
    );

    // Used to re-render to update editingCellId as state in parent now
    setEditingCellId = (newId) => {
      editingCellId = newId;
      rerender(
        <TestingComponent
          rowSelectionModel={[1]}
          isInMultiCopyNoteMode
          canCreateNotes
          editingCellId={editingCellId}
          setEditingCellId={setEditingCellId}
        />
      );
    };

    const cellWithNoNote = screen.getByTestId('AddIcon');

    // Button not yet rendered
    expect(screen.queryByText('Copy last note')).not.toBeInTheDocument();

    // Render empty (new note) richTextEditor input
    await user.click(cellWithNoNote);

    // Button is now rendered
    expect(screen.getByText('Copy last note')).toBeInTheDocument();

    await user.click(screen.getByText('Copy last note'));
    expect(defaultProps.updateCoachesNoteInlinePayLoad).toHaveBeenCalled();
    expect(defaultProps.updateCoachesNoteInlinePayLoad).toHaveBeenCalledWith({
      athleteId: mockResponse.athlete_id,
      beforeDate: defaultProps.dataGridCurrentDate,
      includeCopiedFrom: true,
      organisationAnnotationTypes: [
        'OrganisationAnnotationTypes::DailyStatusNote',
      ],
    });
  });

  it('does not call the annotation (notes) endpoint when prop/permission is FALSE', async () => {
    // mock endpoint and ensure .then block reached
    getSingleCoachesNote = jest.spyOn(axios, 'get').mockImplementation(() => {
      return { data: {} };
    });
    const rowsToAddNotesTo = [1];
    render(
      <TestingComponent
        rowSelectionModel={rowsToAddNotesTo}
        isInMultiCopyNoteMode
        canCreateNotes={false}
      />
    );

    const cellWithNoNote = screen.queryByTestId('AddIcon');

    expect(screen.queryByText('Copy last note')).not.toBeInTheDocument();

    // attempt to render empty (new note) richTextEditor input
    await user.click(cellWithNoNote);

    expect(screen.queryByText('Copy last note')).not.toBeInTheDocument();

    await user.click(screen.queryByText('Copy last note'));
    expect(getSingleCoachesNote).toHaveBeenCalledTimes(0);
  });

  it('does not render the copy last note button when canCreateNotes prop/permission is FALSE', async () => {
    // canCreateNotes prop = medical.notes.canCreate permission
    render(<TestingComponent rowSelectionModel={[1]} canCreateNotes={false} />);

    const cellWithNoNote = screen.queryByTestId('AddIcon');

    expect(screen.queryByText('Copy last note')).not.toBeInTheDocument();
    expect(cellWithNoNote).not.toBeInTheDocument();
  });

  it('does not render the copy last note button in richTextEditor when there is content', async () => {
    let setEditingCellId;

    // Initial render
    const { rerender } = render(
      <TestingComponent
        rowSelectionModel={[1]}
        isInMultiCopyNoteMode
        canCreateNotes
        editingCellId={editingCellId}
        setEditingCellId={(newId) => setEditingCellId(newId)}
      />
    );

    // Used to re-render to update editingCellId as state in parent now
    setEditingCellId = (newId) => {
      editingCellId = newId;
      rerender(
        <TestingComponent
          rowSelectionModel={[1]}
          isInMultiCopyNoteMode
          canCreateNotes
          editingCellId={editingCellId}
          setEditingCellId={setEditingCellId}
        />
      );
    };

    const cellWithNoNote = screen.getByTestId('AddIcon');

    // Button not yet rendered
    expect(screen.queryByText('Copy last note')).not.toBeInTheDocument();

    // Render empty (new note) richTextEditor input
    await user.click(cellWithNoNote);

    // Button is now rendered
    expect(screen.getByText('Copy last note')).toBeInTheDocument();

    // Editor gets focused so button is removed
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'injured1');
    expect(screen.queryByText('Copy last note')).not.toBeInTheDocument();
  });

  it('saves a single note when text entered and submitted inline in grid when canCreateNotes prop/permission is TRUE', async () => {
    // Used to re-render to update editingCellId as state in parent now
    let setEditingCellId;

    // Initial render
    const { rerender } = render(
      <TestingComponent
        rowSelectionModel={[]}
        isInMultiCopyNoteMode
        canCreateNotes
        editingCellId={editingCellId}
        setEditingCellId={(newId) => setEditingCellId(newId)}
      />
    );

    // Used to re-render to update editingCellId as state in parent now
    setEditingCellId = (newId) => {
      editingCellId = newId;
      rerender(
        <TestingComponent
          rowSelectionModel={[]}
          isInMultiCopyNoteMode
          canCreateNotes
          editingCellId={editingCellId}
          setEditingCellId={setEditingCellId}
        />
      );
    };

    const cellWithNoNote = screen.getAllByTestId('AddIcon')[0];

    // Make richTextEditor render
    await user.click(cellWithNoNote);

    // Focus in the text box, ensure input is clear and add new value
    await user.click(screen.getByRole('textbox'));
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), newTextValue);

    expect(screen.getByRole('textbox')).toHaveTextContent(newTextValue);
    expect(screen.getByText('Save')).toBeInTheDocument();

    // Save the note
    await user.click(screen.getByText('Save'));

    expect(screen.queryByText('Save')).not.toBeInTheDocument();
    expect(defaultProps.addMedicalNote).toHaveBeenCalledTimes(1);
    expect(defaultProps.addMedicalNote).toHaveBeenCalledWith({
      ...mockResponse,
      content: `${`<p></p><p>${newTextValue}</p>`}`,
    });
    expect(defaultProps.addMedicalNote).not.toHaveBeenLastCalledWith({
      url: '/medical/notes/create_bulk',
    });
  });

  it('does not render inline editing/creating elements when canCreateNotes prop/permission is FALSE', async () => {
    render(<TestingComponent rowSelectionModel={[]} canCreateNotes={false} />);

    // Icon button that triggers inline note creation/editing
    const cellWithNoNote = screen.queryByTestId('AddIcon');

    expect(cellWithNoNote).not.toBeInTheDocument();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
    expect(saveMedicalNoteSingle).toHaveBeenCalledTimes(0);
  });

  it('loads more row data when Load more button clicked', async () => {
    user = userEvent.setup();
    render(<TestingComponent grid={{ ...defaultProps.grid, next_id: 111 }} />);

    const loadMoreButton = screen.getByText('Load more');

    await user.click(loadMoreButton);

    expect(defaultProps.fetchNextGridRows).toHaveBeenCalled();
  });

  it('does not render the Load more data button when no rows available', async () => {
    // Default props has next_id of null meaning no more rows
    render(<TestingComponent />);

    const loadMoreButton = screen.queryByText('Load more');

    expect(loadMoreButton).not.toBeInTheDocument();
  });

  it('displays an error toast when a bulk note save fails', () => {
    const { rerender } = render(
      <TestingComponent isBulkMedicalNotesSaveError={false} />
    );

    expect(mockDispatch).not.toHaveBeenCalled();

    rerender(<TestingComponent isBulkMedicalNotesSaveError />);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'ADD_TOAST',
      payload: {
        toast: {
          id: 'BULK_SAVE_ERROR_TOAST',
          title: 'Error saving note',
          status: 'ERROR',
        },
      },
    });
  });
});
