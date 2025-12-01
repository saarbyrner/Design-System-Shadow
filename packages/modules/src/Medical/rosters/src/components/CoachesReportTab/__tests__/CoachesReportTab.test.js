import { Provider } from 'react-redux';
import { render, screen, waitFor, within, act } from '@testing-library/react';
import moment from 'moment-timezone';
import { axios } from '@kitman/common/src/utils/services';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import {
  useGetAnnotationMedicalTypesQuery,
  useGetAthleteDataQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medical';

import CoachesReportTab from '../index';

jest.mock('axios', () => jest.requireActual('axios'));

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/Medical/shared/redux/services/medical'
  ),
  useGetAthleteDataQuery: jest.fn(),
  useGetAnnotationMedicalTypesQuery: jest.fn(),
}));

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const i18nT = i18nextTranslateStub();

const store = storeFake({
  medicalApi: {
    useGetAnnotationMedicalTypesQuery: jest.fn(),
    useGetAthleteDataQuery: jest.fn(),
  },
});

const props = {
  permissions: {
    medical: {
      availability: {
        canView: true,
        canEdit: true,
      },
      issues: {
        canView: true,
        canEdit: true,
        canCreate: true,
        canExport: true,
        canArchive: false,
      },
      notes: {
        canCreate: true,
      },
    },
  },
  t: i18nT,
  grid: {
    columns: [
      {
        row_key: 'athlete',
        datatype: 'object',
        name: 'Athlete',
        assessment_item_id: null,
        training_variable_id: null,
        readonly: true,
        id: null,
        active: true,
        default: true,
        container_id: null,
        order: null,
        protected: false,
        status_definition: null,
        workload_unit: false,
      },
      {
        row_key: 'availability_status',
        datatype: 'object',
        name: 'Availability Status',
        assessment_item_id: null,
        training_variable_id: null,
        readonly: true,
        id: null,
        active: true,
        default: true,
        container_id: null,
        order: null,
        protected: false,
        status_definition: null,
        workload_unit: false,
      },
      {
        row_key: 'open_injuries_illnesses',
        datatype: 'plain',
        name: 'Open Injury/ Illness',
        assessment_item_id: null,
        training_variable_id: null,
        readonly: true,
        id: null,
        active: true,
        default: true,
        container_id: null,
        order: null,
        protected: false,
        status_definition: null,
        workload_unit: false,
      },
      {
        row_key: 'availability_comment',
        datatype: 'plain',
        name: 'Availability Comment',
        assessment_item_id: null,
        training_variable_id: null,
        readonly: true,
        id: null,
        active: true,
        default: true,
        container_id: null,
        order: null,
        protected: false,
        status_definition: null,
        workload_unit: false,
      },
    ],
    next_id: 30693,
    rows: [
      {
        id: 78041,
        athlete: {
          fullname: 'Test Athlete',
          position: 'Loose-head Prop',
          avatar_url:
            'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
          availability: 'unavailable',
          extended_attributes: {},
        },
        availability_status: {
          availability: 'unavailable',
          unavailable_since: '310 days',
        },
        open_injuries_illnesses: {
          has_more: false,
          issues: [],
        },
        availability_comment: 'ttttttt',
      },
      {
        id: 39894,
        athlete: {
          fullname: 'Test Email Athlete',
          position: 'Hooker',
          avatar_url:
            'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
          availability: 'injured',
          extended_attributes: {},
        },
        availability_status: {
          availability: 'injured',
          unavailable_since: null,
        },
        open_injuries_illnesses: {
          has_more: false,
          issues: [],
        },
        availability_comment: null,
      },
      {
        id: 333441,
        athlete: {
          fullname: 'Mohamed Athlete Test',
          position: 'No. 8',
          avatar_url:
            'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P2JnPTk1MjQyZjM4JnR4dDY0PU9BJnR4dGFsaWduPWNlbnRlciZ0eHRjbHI9ZmZmJnR4dGZvbnQ9QXZlbmlyK05leHQrQ29uZGVuc2VkK01lZGl1bSZ0eHRwYWQ9NSZ0eHRzaGFkPTImdHh0c2l6ZT0xNiZ3PTM2&markalign=left%2Cbottom&markfit=max&markpad=0&w=100',
          availability: 'unavailable',
          extended_attributes: {},
        },
        availability_status: {
          availability: 'unavailable',
          unavailable_since: null,
        },
        open_injuries_illnesses: {
          has_more: false,
          issues: [],
        },
        availability_comment: null,
      },
    ],
  },
  fetchGrid: jest.fn(),
  requestStatus: 'SUCCESS',
  filters: { squads: [] },
  addEditComment: jest.fn(),
  onFiltersUpdate: jest.fn(),
  onSetRequestStatus: jest.fn(),
};

let user;

const componentRender = (passedProps = props) =>
  render(
    <Provider store={store}>
      <CoachesReportTab {...passedProps} />
    </Provider>
  );

describe('Export button', () => {
  beforeEach(() => {
    useGetAnnotationMedicalTypesQuery.mockReturnValue({
      data: [
        { id: 11446, type: 'OrganisationAnnotationTypes::DailyStatusNote' },
      ],
      error: false,
      isLoading: false,
    });
    useGetAthleteDataQuery.mockReturnValue({
      data: [{ id: 1, name: 'Squad name' }],
      error: false,
      isLoading: false,
    });
  });

  describe('Coaches Report Version 1', () => {
    beforeEach(() => {
      window.featureFlags = {
        'nfl-coaches-report': true,
        'coaches-report-v2': false,
      };
    });
    afterEach(() => {
      window.featureFlags = {
        'nfl-coaches-report': false,
        'coaches-report-v2': false,
      };
    });

    it('renders the Export button with proper permissions', () => {
      componentRender();
      const exportButton = screen.getByRole('button', { name: 'Export' });
      expect(exportButton).toBeInTheDocument();
    });
    it('noes not render the Export button without proper permissions', () => {
      componentRender({
        ...props,
        permissions: {
          ...props.permissions,
          medical: {
            ...props.permissions.medical,
            issues: { ...props.permissions.medical.issues, canExport: false },
          },
        },
      });
      const exportButton = screen.queryByRole('button', { name: 'Export' });
      expect(exportButton).not.toBeInTheDocument();
    });
  });
  describe('Coaches Report Version 2', () => {
    beforeEach(() => {
      window.featureFlags = { 'coaches-report-v2': true };
      useGetAnnotationMedicalTypesQuery.mockReturnValue({
        data: [
          { id: 11446, type: 'OrganisationAnnotationTypes::DailyStatusNote' },
        ],
        error: false,
        isLoading: false,
      });
      useGetAthleteDataQuery.mockReturnValue({
        data: [{ id: 1, name: 'Squad name' }],
        error: false,
        isLoading: false,
      });
    });
    afterEach(() => {
      window.featureFlags = { 'coaches-report-v2': false };
    });

    it('renders the Export button with proper permissions', () => {
      componentRender();
      const exportButton = screen.getByRole('button', { name: 'Export' });
      expect(exportButton).toBeInTheDocument();
    });
    it('noes not render the Export button without proper permissions', () => {
      componentRender({
        ...props,
        permissions: {
          ...props.permissions,
          medical: {
            ...props.permissions.medical,
            issues: { ...props.permissions.medical.issues, canExport: false },
          },
        },
      });
      const exportButton = screen.queryByRole('button', { name: 'Export' });
      expect(exportButton).not.toBeInTheDocument();
    });
  });
});

describe('<CoachesReportTab />', () => {
  moment.tz.setDefault('UTC');
  user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  let saveMedicalNote;

  const bulkPayload = {
    organisation_annotation_type_id: 11446,
    annotationables: [
      {
        annotationable_type: 'Athlete',
        annotationable_id: props.grid.rows[props.grid.rows.length - 1].id,
      },
      {
        annotationable_type: 'Athlete',
        annotationable_id: props.grid.rows[props.grid.rows.length - 2].id,
      },
    ],
    title: 'Daily Status Note',
    annotation_date: 'Sun Apr 14 2024 18:00:00 GMT+0000',
    content: '<p></p><p>injured111</p>',
    scope_to_org: true,
  };

  beforeEach(() => {
    useGetAnnotationMedicalTypesQuery.mockReturnValue({
      data: [
        { id: 11446, type: 'OrganisationAnnotationTypes::DailyStatusNote' },
      ],
      error: false,
      isLoading: false,
    });
    useGetAthleteDataQuery.mockReturnValue({
      data: [{ id: 1, name: 'Squad name' }],
      error: false,
      isLoading: false,
    });
    saveMedicalNote = jest.spyOn(axios, 'post');
    const fakeDate = new Date('2024-04-14T18:00:00Z'); // UTC FORMAT
    jest.useFakeTimers();
    jest.setSystemTime(fakeDate);
    window.featureFlags = { 'coaches-report-v2': true };
    componentRender();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const richTextEditorShouldBeRendered = (expectedRenderedState) => {
    const toolbarButtons = screen.queryByRole('group');

    if (expectedRenderedState) {
      // Assert that RichTextEditor is rendered
      expect(toolbarButtons).toBeInTheDocument();

      const editorWrapper = toolbarButtons.parentElement.parentElement;
      expect(editorWrapper).toHaveClass('remirror-theme');

      const editorTextInput = within(editorWrapper).queryByRole('textbox');
      expect(editorTextInput).toBeInTheDocument();
    } else {
      // Assert that RichTextEditor is not rendered
      expect(toolbarButtons).not.toBeInTheDocument();
    }
  };

  // Perform async action then run a callback after it has complted
  const asyncActAndWaitFor = async (asyncAction, callback) => {
    await act(async () => {
      await asyncAction();
    });
    await waitFor(callback);
  };

  it('Renders the component', () => {
    expect(screen.getByTestId('CoachesReportTab')).toBeInTheDocument();
    expect(
      screen.getByTestId('CoachesReportTab').querySelector('header')
    ).toBeInTheDocument();
  });

  it('renders the filters container', async () => {
    expect(
      screen.getByTestId('CoachesReport|DesktopFiltersMui')
    ).toBeInTheDocument();
  });

  it('renders the Kitman Search filter when coaches-report-v2 OFF', async () => {
    window.featureFlags = { 'coaches-report-v2': false };
    componentRender();
    const searchbarFilter = screen.getAllByTestId(
      'coachesReportTab|SearchBar'
    )[0];
    expect(searchbarFilter).toBeInTheDocument();
  });

  it('renders the MUI Search filter when coaches-report-v2 ON', async () => {
    const searchbarFilter = screen.getAllByTestId(
      'coachesReportTab|SearchBarMui'
    )[0];
    expect(searchbarFilter).toBeInTheDocument();
  });

  it('renders the Kitman Squad filter when coaches-report-v2 OFF', async () => {
    window.featureFlags = { 'coaches-report-v2': false };
    componentRender();
    const squadSelectFilter = screen.getAllByTestId(
      'coachesReportTab|SquadSelect'
    )[0];
    expect(squadSelectFilter).toBeInTheDocument();
  });

  it('renders the MUI Squad filter when coaches-report-v2 ON', async () => {
    const squadSelectFilter = screen.getAllByTestId(
      'coachesReportTab|SquadSelectMui'
    )[0];
    expect(squadSelectFilter).toBeInTheDocument();
  });

  it('renders the Kitman Issue filter when coaches-report-v2 OFF', async () => {
    window.featureFlags = { 'coaches-report-v2': false };
    componentRender();
    const issueSelectFilter = screen.getAllByTestId(
      'coachesReportTab|IssueSelect'
    )[0];
    expect(issueSelectFilter).toBeInTheDocument();
  });

  it('renders the MUI Issue filter when coaches-report-v2 ON', async () => {
    const searchbarFilter = screen.getAllByTestId(
      'coachesReportTab|IssueSelectMui'
    )[0];
    expect(searchbarFilter).toBeInTheDocument();
  });

  it('renders the Kitman Position Select filter when coaches-report-v2 OFF', async () => {
    window.featureFlags = { 'coaches-report-v2': false };
    componentRender();
    const positionSelect = screen.getAllByTestId(
      'coachesReportTab|PositionSelect'
    )[0];
    expect(positionSelect).toBeInTheDocument();
  });

  it('renders the MUI Position filter when coaches-report-v2 ON', async () => {
    const searchbarFilter = screen.getAllByTestId(
      'coachesReportTab|PositionSelectMui'
    )[0];
    expect(searchbarFilter).toBeInTheDocument();
  });

  it('renders the Kitman mobile filters when coaches-report-v2 OFF', async () => {
    window.featureFlags = { 'coaches-report-v2': false };
    componentRender();

    const mobileFilters = screen.getAllByTestId('TeamFilters|MobileFilters')[0];
    const searchBarMui = screen.getAllByTestId('coachesReportTab|SearchBar')[0];

    const issueSelectMui = screen.getAllByTestId(
      'coachesReportTab|IssueSelect'
    )[0];
    const squadSelectMui = screen.getAllByTestId(
      'coachesReportTab|SquadSelect'
    )[0];
    const positionSelectMui = screen.getAllByTestId(
      'coachesReportTab|PositionSelect'
    )[0];

    expect(mobileFilters).toBeInTheDocument();
    expect(searchBarMui).toBeInTheDocument();
    expect(issueSelectMui).toBeInTheDocument();
    expect(squadSelectMui).toBeInTheDocument();
    expect(positionSelectMui).toBeInTheDocument();
  });

  it('renders the MUI mobile filters when coaches-report-v2 ON', async () => {
    window.featureFlags = { 'coaches-report-v2': true };
    componentRender();

    const mobileFilters = screen.getAllByTestId('TeamFilters|MobileFilters')[0];
    const searchBarMui = within(mobileFilters).getByTestId(
      'coachesReportTab|SearchBarMui'
    );
    const issueSelectMui = within(mobileFilters).getByTestId(
      'coachesReportTab|IssueSelectMui'
    );
    const squadSelectMui = within(mobileFilters).getByTestId(
      'coachesReportTab|SquadSelectMui'
    );
    const positionSelectMui = within(mobileFilters).getByTestId(
      'coachesReportTab|PositionSelectMui'
    );

    expect(mobileFilters).toBeInTheDocument();
    expect(searchBarMui).toBeInTheDocument();
    expect(issueSelectMui).toBeInTheDocument();
    expect(squadSelectMui).toBeInTheDocument();
    expect(positionSelectMui).toBeInTheDocument();
  });

  it('opens the modal when at least one checkbox selected and the "Add notes" button clicked', async () => {
    window.featureFlags = { 'coaches-report-v2': true };
    componentRender();

    const grid = screen.getAllByRole('grid')[0];
    const checkboxes = within(grid).getAllByRole('checkbox', { hidden: true });

    expect(checkboxes.length).toBeGreaterThan(0);

    // modal is not open
    richTextEditorShouldBeRendered(false);

    // Click the first checkbox to add item to needed state
    await asyncActAndWaitFor(
      () => user.click(checkboxes[0]),
      async () => {
        await user.click(screen.getByText('Add notes'));

        richTextEditorShouldBeRendered(true);
      }
    );
  });

  // multi note add/edit mode ON by clicking 'Add notes' with at least 2 checkboxes checked
  it('saves bulk notes when in multi note add/edit mode is ON', async () => {
    window.featureFlags = { 'coaches-report-v2': true };
    componentRender();

    const grid = screen.getAllByRole('grid')[0];
    const checkboxes = within(grid).getAllByRole('checkbox');

    // Click 2 checkboxes and then enter Multi Note creation mode by clicking 'Add notes'
    await user.click(checkboxes[checkboxes.length - 1]);
    await user.click(checkboxes[checkboxes.length - 2]);
    await user.click(screen.getByText('Add notes'));

    // Focus in the text box, ensure input is clear and add new value
    await user.click(screen.getByRole('textbox'));
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'injured111');

    // Save the note
    await user.click(screen.getByText('Add'));
    await waitFor(() => {
      expect(screen.queryByText('Add')).not.toBeInTheDocument();
    });

    // multiple notes endpoint
    expect(saveMedicalNote).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      '/medical/notes/create_bulk',
      bulkPayload
    );

    // single note endpoint
    expect(saveMedicalNote).not.toHaveBeenCalledWith('/medical/notes');
  });

  it('renders the Note Creation header(Action buttons) when coaches-report-v2 FF is ON and at least one checkbox selected and medical.notes.canCreate is TRUE', async () => {
    window.featureFlags = { 'coaches-report-v2': true };
    componentRender();

    const grid = screen.getAllByRole('grid')[0];
    const checkboxes = within(grid).getAllByRole('checkbox', { hidden: true });
    expect(checkboxes.length).toBeGreaterThan(0);

    await asyncActAndWaitFor(
      () => user.click(checkboxes[0]),
      () => {
        const addNotesButton = screen.getByText('Add notes');
        expect(addNotesButton).toBeInTheDocument();

        const copyLastNotesButton = screen.getByText('Copy last note');
        expect(copyLastNotesButton).toBeInTheDocument();
      }
    );
  });

  it('does not render the Note Creation header(Action buttons) when coaches-report-v2 FF is ON and at least one checkbox selected and medical.notes.canCreate is FALSE', async () => {
    window.featureFlags = { 'coaches-report-v2': true };

    componentRender({
      ...props,
      permissions: {
        ...props.permissions,
        medical: {
          ...props.permissions.medical,
          notes: { ...props.permissions.medical.notes, canCreate: false },
        },
      },
    });

    const addNotesButton = screen.queryByText('Add notes');
    expect(addNotesButton).not.toBeInTheDocument();

    const copyLastNotesButton = screen.queryByText('Copy last note');
    expect(copyLastNotesButton).not.toBeInTheDocument();
  });

  it('renders the Date Cycling & Calendar elements within title container when in Note Creation mode', async () => {
    window.featureFlags = { 'coaches-report-v2': true };
    componentRender();

    // Enter note creation mode
    const grid = screen.getAllByRole('grid')[0];
    const checkboxes = within(grid).getAllByRole('checkbox', { hidden: true });
    const headerElement = screen
      .getAllByTestId('CoachesReportTab')[0]
      .querySelector('header[class$="-coachesReportTab"]');

    await asyncActAndWaitFor(
      () => user.click(checkboxes[0]),
      () => {
        // Date Cycle Left Button
        expect(
          within(headerElement).getAllByTestId('KeyboardArrowLeftIcon')[0]
        ).toBeInTheDocument();
        // Date Cycle Right Button
        expect(
          within(headerElement).getByTestId('KeyboardArrowRightIcon')
        ).toBeInTheDocument();
        // Calendar icon button
        expect(
          within(headerElement).getAllByTestId('CalendarTodayIcon')[0]
        ).toBeInTheDocument();
      }
    );
  });

  it('opens the Calendar element when calendar icon clicked', async () => {
    window.featureFlags = { 'coaches-report-v2': true };
    componentRender();

    // Enter note creation mode
    const grid = screen.getAllByRole('grid')[0];
    const checkboxes = within(grid).getAllByRole('checkbox', { hidden: true });

    await asyncActAndWaitFor(
      () => user.click(checkboxes[0]),
      async () => {
        const calendarButton = screen.getAllByTestId('CalendarTodayIcon')[0];
        let calendarPopover = screen.queryByRole('presentation', {
          id: 'calendar-popover',
        });

        // Calendar popover should not be in the document yet
        expect(calendarPopover).not.toBeInTheDocument();

        // Click calendar icon to open the popover
        await user.click(calendarButton);
        // popover should now be in the document
        calendarPopover = screen.getAllByRole('presentation', {
          id: 'calendar-popover',
        })[0];

        expect(calendarPopover).toBeInTheDocument();
      }
    );
  });

  it('cycles through dates when arrows clicked', async () => {
    window.featureFlags = { 'coaches-report-v2': true };
    componentRender();

    // Enter note creation mode
    const grid = screen.getAllByRole('grid')[0];
    const checkboxes = within(grid).getAllByRole('checkbox', { hidden: true });
    const headerElement = screen
      .getAllByTestId('CoachesReportTab')[0]
      .querySelector('header[class$="-coachesReportTab"]');

    await asyncActAndWaitFor(
      () => user.click(checkboxes[0]),
      () => {
        expect(headerElement.querySelector('h3')).toHaveTextContent(
          'Coaches Report - Apr 14, 2024'
        );
      }
    );

    // Cycle date
    await waitFor(() => {
      user.click(screen.getAllByTestId('KeyboardArrowLeftIcon')[0]);
    });

    await waitFor(() => {
      expect(headerElement.querySelector('h3')).toHaveTextContent(
        'Coaches Report - Apr 13, 2024'
      );
    });
  });

  it('fetches data based on date set by cycling through dates', async () => {
    window.featureFlags = { 'coaches-report-v2': true };
    componentRender();

    // Enter note creation mode
    const grid = screen.getAllByRole('grid')[0];
    const checkboxes = within(grid).getAllByRole('checkbox', { hidden: true });
    await user.click(checkboxes[0]);

    // Click date cycle arrow (back one day)
    await user.click(screen.getAllByTestId('KeyboardArrowLeftIcon')[0]);

    // Check endpoint called correctly
    await waitFor(() => {
      // Initial fetch  - current date set to April 14
      expect(props.fetchGrid.mock.calls[1]).toEqual([
        false,
        props.grid.next_id,
        moment('2024-04-14T18:00:00.000Z').toString(),
      ]);
      // Most recent Fetch  - after date cycle back one day
      expect(
        props.fetchGrid.mock.calls[props.fetchGrid.mock.calls.length - 1]
      ).toEqual([true, null, moment('2024-04-13T18:00:00.000Z').toString()]);
    });
  });

  it('changes date values when clicking avaliable dates in calendar', async () => {
    user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    window.featureFlags = { 'coaches-report-v2': true };
    componentRender();

    const calendarButton = screen.getAllByTestId('CalendarTodayIcon')[0];

    // open calendar
    await user.click(calendarButton);

    const twentiethOfApril = screen.getByText('20');
    expect(
      screen.getAllByText('Coaches Report - Apr 14, 2024')
    )[0]?.toBeInTheDocument();

    // click new date and check for changes
    await user.click(twentiethOfApril);

    expect(
      screen.getAllByText('Coaches Report - Apr 20, 2024')
    )[0]?.toBeInTheDocument();
  });
});
