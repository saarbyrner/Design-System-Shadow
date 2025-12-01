import { Provider } from 'react-redux';
import { render, screen, within, waitFor } from '@testing-library/react';
import { axios } from '@kitman/common/src/utils/services';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext/index';
import { saveMedicalNote as saveMedicalNoteSingle } from '@kitman/services';
import { useGetAnnotationMedicalTypesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import CommentsOverviewGrid from '../components/CoachesReportOverviewGrid';

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
  },
});
jest.mock('@kitman/services/src/services/medical/saveMedicalNote.js');

describe('<CommentsOverviewGrid />', () => {
  const user = userEvent.setup();
  const i18nT = i18nextTranslateStub();
  let getMultipleCoachesNotes;
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
            avatar_url:
              'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_189778?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P2JnPTk1MjQyZjM4JnR4dDY0PU1nJnR4dGFsaWduPWNlbnRlciZ0eHRjbHI9ZmZmJnR4dGZvbnQ9QXZlbmlyK05leHQrQ29uZGVuc2VkK01lZGl1bSZ0eHRwYWQ9NSZ0eHRzaGFkPTImdHh0c2l6ZT0xNiZ3PTM2&markalign=left%2Cbottom&markfit=max&markpad=0&w=100',
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
            avatar_url:
              'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
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
            avatar_url:
              'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
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
    canViewInjuries: true,
    canViewMedicalAvailability: true,
    setRowSelectionModel: jest.fn(),
    setModalIsOpen: jest.fn(),
    rehydrateGrid: jest.fn(),
    dataGridCurrentDate: 'Wed May 22 2029 17:55:15 GMT+0100',
    isInMultiCopyNoteMode: false,
    setRequestStatus: jest.fn(),
  };
  const mockResponse = {
    annotationable_type: 'Athlete',
    organisation_annotation_type_id: 11446,
    annotationable_id: 96321,
    athlete_id: 96321,
    title: 'Daily Status Note',
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
  const newTextValue = 'injured122222222';

  const TestingComponent = (props) => {
    const { permissions } = usePermissions();
    permissions.medical.issues.canView = true;
    return (
      <Provider store={store}>
        <CommentsOverviewGrid {...defaultProps} {...props} />;
      </Provider>
    );
  };

  const TestingComponentWithoutPermissions = () => {
    const { permissions } = usePermissions();
    permissions.medical.issues.canView = false;
    return (
      <Provider store={store}>
        <CommentsOverviewGrid
          {...defaultProps}
          canViewInjuries={false}
          canViewMedicalAvailability={false}
        />
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
    saveMedicalNoteSingle.mockResolvedValue(mockResponse);
    window.featureFlags = { 'nfl-comments-tab': true };

    useGetAnnotationMedicalTypesQuery.mockReturnValue({
      data: [
        { id: 11446, type: 'OrganisationAnnotationTypes::DailyStatusNote' },
      ],
      error: false,
      isLoading: false,
    });
  });

  afterEach(() => {
    window.featureFlags = { ' nfl-comments-tab': false };
    jest.restoreAllMocks();
  });

  it('renders the Kitman data grid when coaches-report-v2 OFF', () => {
    render(<TestingComponent />);
    const componentWrapper = screen
      .getByText('Athlete')
      .closest('div#rosterGridRef');
    const dataGrid = componentWrapper.querySelector('div.dataGrid');

    expect(
      screen.getByText('Athlete').closest('div#rosterGridRef')
    ).toBeInTheDocument();
    expect(dataGrid).toBeInTheDocument();
  });

  it('renders the MUI data grid when coaches-report-v2 ON', () => {
    render(<TestingComponent coachesReportV2Enabled />);

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

    // Mui row counter
    const rowCounterTextValue = `Total Rows: ${defaultProps.grid.rows.length}`;
    const rowCounterElement = screen.getByText(rowCounterTextValue);

    expect(rowCounterElement).toBeInTheDocument();
  });

  it('renders the athlete avatar and position when coaches-report-v2 ON', () => {
    render(<TestingComponent coachesReportV2Enabled />);

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

  it('renders the availability status correctly when coaches-report-v2 ON', () => {
    render(<TestingComponent coachesReportV2Enabled />);

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

  it('renders the correct MUI column labels when coaches-report-v2 ON', () => {
    render(<TestingComponent coachesReportV2Enabled />);
    const columnNames = [
      'Player',
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

  it('renders richTextEditor within note cell when clicked when FF coaches-report-v2 ON and not in multi edit/create mode', async () => {
    // rowSelectionModel contains ids from rows selected by their checkbox - meaning multi edit mode is on if more than 1 id and single row input should be off
    render(
      <TestingComponent
        coachesReportV2Enabled
        canCreateNotes
        rowSelectionModel={[1]}
      />
    );

    const firstNote = screen.getByText('coach note here tomas');

    richTextEditorShouldBeRendered(false);

    await user.click(firstNote);

    richTextEditorShouldBeRendered(true);
    expect(screen.getByText('coach note here tomas')).toBeInTheDocument();
  });

  it('does not render richTextEditor when canCreateNotes prop/permission is FALSE', async () => {
    render(
      <TestingComponent
        coachesReportV2Enabled
        canCreateNotes={false}
        rowSelectionModel={[1]}
      />
    );

    const firstNote = screen.getByText('coach note here tomas');

    richTextEditorShouldBeRendered(false);

    await user.click(firstNote);

    richTextEditorShouldBeRendered(false);
  });

  it('filters the note column correctly', async () => {
    render(<TestingComponent coachesReportV2Enabled rowSelectionModel={[1]} />);

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

  it('renders richTextEditor within note cell when clicked when FF coaches-report-v2 ON and grid is in multi edit/create mode', async () => {
    // rowSelectionModel contains ids from rows selected by their checkbox - meaning multi edit mode is on if more than 1 id and single row input should be off
    render(
      <TestingComponent coachesReportV2Enabled rowSelectionModel={[1, 2]} />
    );

    const firstNote = screen.getByText('coach note here tomas');

    richTextEditorShouldBeRendered(false);

    await user.click(firstNote);

    richTextEditorShouldBeRendered(false);
    expect(screen.getByText('coach note here tomas')).toBeInTheDocument();
  });

  // isInMultiCopyNoteMode passed by parent component when multi note creation button clicked in header
  it('calls correct endpoint when in multi note creation mode and copy last note button in header clicked', async () => {
    getMultipleCoachesNotes = jest.spyOn(axios, 'post');
    const rowsToAddNotesTo = [1, 2];
    render(
      <TestingComponent
        coachesReportV2Enabled
        rowSelectionModel={rowsToAddNotesTo}
        isInMultiCopyNoteMode
      />
    );

    expect(getMultipleCoachesNotes).toHaveBeenCalledTimes(1);
    expect(getMultipleCoachesNotes).toHaveBeenCalledWith(
      '/medical/notes/bulk_copy_last_daily_status',
      {
        athlete_ids: rowsToAddNotesTo,
        organisation_annotation_types: [
          'OrganisationAnnotationTypes::DailyStatusNote',
        ],
        annotation_date: defaultProps.dataGridCurrentDate,
        include_copied_from: false,
      }
    );
  });

  it('renders note cells when FF coaches-report-v2 ON', () => {
    render(<TestingComponent coachesReportV2Enabled />);

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
    render(<TestingComponentWithoutPermissions />);
    expect(screen.queryByText('Open Injury/ Illness')).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'Oct 6, 2022 - Abcess Ankle (excl. Joint) [Left]Causing unavailability (time-loss)'
      )
    ).not.toBeInTheDocument();
  });

  it('renders the table structure correctly', () => {
    render(<TestingComponent />);

    const componentWrapper = screen
      .getByText('Athlete')
      .closest('div#rosterGridRef');
    const dataGrid = componentWrapper.querySelector('div.dataGrid');
    const tableHeaderContainer = componentWrapper.querySelector(
      'thead.dataGrid__head'
    );
    const tableHeaders = tableHeaderContainer.querySelectorAll('th');
    const expectedTableHeaders = [
      'Athlete',
      'Open Injury/ Illness',
      'Comment',
      '',
    ]; // filter column added by grid component has no label

    expect(dataGrid.querySelector('table')).toBeInTheDocument();
    expect(dataGrid.querySelectorAll('tr')).toHaveLength(
      defaultProps.grid.rows.length + 1
    ); //  athletes rows and column heading

    expect(tableHeaderContainer).toBeInTheDocument();
    expect(tableHeaders).toHaveLength(4); // 3 column headers and filtercell added by grid component
    tableHeaders.forEach((header, index) => {
      expect(header).toHaveTextContent(expectedTableHeaders[index]);
    });
  });

  it('renders the table data correctly', () => {
    render(<TestingComponent />);
    const componentWrapper = screen
      .getByText('Athlete')
      .closest('div#rosterGridRef');
    const tableBody = componentWrapper.querySelector('tbody.dataGrid__body');
    const tableRows = tableBody.querySelectorAll('tr');
    const athlete1NameColumn = tableRows[0].querySelectorAll('td')[0];
    const athlete2NameColumn = tableRows[1].querySelectorAll('td')[0];
    const athlete1InjuryColumn = tableRows[0].querySelectorAll('td')[1];
    const athlete1CommentColumn = tableRows[0].querySelectorAll('td')[2];
    const athlete2InjuryColumn = tableRows[1].querySelectorAll('td')[1];
    const athlete2CommentColumn = tableRows[1].querySelectorAll('td')[2];

    expect(tableBody).toBeInTheDocument();
    expect(tableRows).toHaveLength(defaultProps.grid.rows.length); // athletes rows
    expect(tableRows[0].querySelectorAll('td')).toHaveLength(4);
    expect(tableRows[0].querySelectorAll('td')).toHaveLength(4); // athlete 1 data columns - Name, open injuries, comment and action button
    expect(tableRows[1].querySelectorAll('td')).toHaveLength(4); // athlete 2 data columns - Name, open injuries, comment and action button
    expect(tableRows[1].querySelectorAll('td')).toHaveLength(4);
    expect(tableRows[0].querySelectorAll('td')).toHaveLength(4); // athlete 1 data columns - Name, open injuries, comment and action button
    expect(tableRows[1].querySelectorAll('td')).toHaveLength(4); // athlete 2 data columns - Name, open injuries, comment and action button

    // Athlete name column
    expect(athlete1NameColumn).toHaveTextContent('Tomas AlbornozSecond Row');
    expect(athlete2NameColumn).toHaveTextContent('Janet AthleteWing');

    // Athlete injury column
    expect(athlete1InjuryColumn).toHaveTextContent(
      'Oct 6, 2022 - Abcess Ankle (excl. Joint) [Left]Causing unavailability (time-loss)'
    ); // Athlete 1 has an open injury
    expect(athlete2InjuryColumn).toHaveTextContent(''); // Athlete 2 does not have an open injury

    // Athlete comment column
    expect(athlete1CommentColumn).toHaveTextContent('comment here ath 1');
    expect(athlete2CommentColumn).toHaveTextContent('comment here ath 2');
  });

  it('renders copy last note button in richTextEditor when theres no content and editor not in focus when canCreateNotes prop/permission is TRUE', async () => {
    render(
      <TestingComponent
        coachesReportV2Enabled
        rowSelectionModel={[1]}
        canCreateNotes
      />
    );

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
    // mock endpoint and ensure .then block reached
    getSingleCoachesNote = jest.spyOn(axios, 'get').mockImplementation(() => {
      return { data: {} };
    });
    const rowsToAddNotesTo = [1];
    render(
      <TestingComponent
        coachesReportV2Enabled
        rowSelectionModel={rowsToAddNotesTo}
        isInMultiCopyNoteMode
        canCreateNotes
      />
    );

    const cellWithNoNote = screen.getByTestId('AddIcon');

    // Button not yet rendered
    expect(screen.queryByText('Copy last note')).not.toBeInTheDocument();

    // Render empty (new note) richTextEditor input
    await user.click(cellWithNoNote);

    // Button is now rendered
    expect(screen.getByText('Copy last note')).toBeInTheDocument();

    await user.click(screen.getByText('Copy last note'));

    expect(getSingleCoachesNote).toHaveBeenCalledWith(
      '/medical/notes/last_annotation',

      {
        params: {
          athlete_id: mockResponse.athlete_id,
          organisation_annotation_types: [
            'OrganisationAnnotationTypes::DailyStatusNote',
          ],
          before_date: defaultProps.dataGridCurrentDate,
          include_copied_from: false,
        },
      }
    );
  });

  it('does not call the annotation (notes) endpoint when prop/permission is FALSE', async () => {
    // mock endpoint and ensure .then block reached
    getSingleCoachesNote = jest.spyOn(axios, 'get').mockImplementation(() => {
      return { data: {} };
    });
    const rowsToAddNotesTo = [1];
    render(
      <TestingComponent
        coachesReportV2Enabled
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
    render(
      <TestingComponent
        coachesReportV2Enabled
        rowSelectionModel={[1]}
        canCreateNotes={false}
      />
    );

    const cellWithNoNote = screen.queryByTestId('AddIcon');

    expect(screen.queryByText('Copy last note')).not.toBeInTheDocument();
    expect(cellWithNoNote).not.toBeInTheDocument();
  });

  it('does not render the copy last note button in richTextEditor when there is content', async () => {
    render(
      <TestingComponent
        coachesReportV2Enabled
        rowSelectionModel={[1]}
        canCreateNotes
      />
    );

    const cellWithNoNote = screen.getByTestId('AddIcon');

    // Button not yet rendered
    expect(screen.queryByText('Copy last note')).not.toBeInTheDocument();

    // Render empty (new note) richTextEditor input
    await user.click(cellWithNoNote);

    // Button is now rendered
    expect(screen.getByText('Copy last note')).toBeInTheDocument();

    // Editor gets text input so button is removed
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'injured1');
    expect(screen.queryByText('Copy last note')).not.toBeInTheDocument();
  });

  it('saves a single note when text entered and submitted inline in grid when canCreateNotes prop/permission is TRUE', async () => {
    render(
      <TestingComponent
        coachesReportV2Enabled
        rowSelectionModel={[]}
        canCreateNotes
      />
    );

    const cellWithNoNote = await screen.findByTestId('AddIcon');

    // Make richTextEditor render
    await user.click(cellWithNoNote);

    // Focus in the text box, ensure input is clear and add new value
    const textBox = await screen.findByRole('textbox');
    await user.click(textBox);
    await user.clear(textBox);
    await user.type(textBox, newTextValue);

    expect(textBox).toHaveTextContent(newTextValue);

    const saveButton = await screen.findByText('Save');
    expect(saveButton).toBeInTheDocument();

    // Save the note
    await user.click(saveButton);

    // Wait for the button to disappear
    await waitFor(() => {
      expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });

    expect(saveMedicalNoteSingle).toHaveBeenCalledTimes(1);
    expect(saveMedicalNoteSingle).toHaveBeenCalledWith({
      ...mockResponse,
      content: `<p></p><p>${newTextValue}</p>`,
    });
    expect(saveMedicalNoteSingle).not.toHaveBeenLastCalledWith({
      url: '/medical/notes/create_bulk',
    });
  });

  it('does not render inline editing/creating elements when canCreateNotes prop/permission is FALSE', async () => {
    render(
      <TestingComponent
        coachesReportV2Enabled
        rowSelectionModel={[]}
        canCreateNotes={false}
      />
    );

    // Icon button that triggers inline note creation/editing
    const cellWithNoNote = screen.queryByTestId('AddIcon');

    expect(cellWithNoNote).not.toBeInTheDocument();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
    expect(saveMedicalNoteSingle).toHaveBeenCalledTimes(0);
  });
});
