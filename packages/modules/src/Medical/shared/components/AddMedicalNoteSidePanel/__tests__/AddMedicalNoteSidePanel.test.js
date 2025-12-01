import $ from 'jquery';
import moment from 'moment-timezone';
import selectEvent from 'react-select-event';
import { act } from 'react-dom/test-utils';
import { fireEvent, screen, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import {
  storeFake,
  i18nextTranslateStub,
  renderWithUserEventSetup,
} from '@kitman/common/src/utils/test_utils';
import { server, rest } from '@kitman/services/src/mocks/server';
import { data as mockedAnnotationTypes } from '@kitman/services/src/mocks/handlers/medical/getAnnotationMedicalTypes';
import { rehabMedicalNote as MockRehabMedicalNote } from '@kitman//services/src/mocks/handlers/medical/getMedicalNotes';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { data as mockedDiagnostics } from '@kitman/services/src/mocks/handlers/medical/getDiagnostics';
import { saveMedicalNote as saveMedicalNoteSingle } from '@kitman/services';
import useDiagnostics from '@kitman/modules/src/Medical/shared/hooks/useDiagnostics';
import { useGetPermittedSquadsQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { useLazyGetAthleteDataQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import AddMedicalNoteSidePanel from '@kitman/modules/src/Medical/shared/components/AddMedicalNoteSidePanel';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import tabHashes from '@kitman/modules/src/Medical/shared/constants/tabHashes';

jest.mock('@kitman/components/src/DatePicker');
jest.mock('@kitman/common/src/hooks/useEventTracking');
jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/PermissionsContext'),
  usePermissions: jest.fn(),
}));

jest.mock('@kitman/modules/src/Medical/shared/hooks/useDiagnostics');

jest.mock('@kitman/services/src/services/medical/saveMedicalNote');

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/Medical/shared/redux/services/medical'
  ),
  useGetPermittedSquadsQuery: jest.fn(),
}));
jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useLazyGetAthleteDataQuery: jest.fn(),
  })
);

const trackEventMock = jest.fn();

const store = storeFake({
  medicalApi: {},
  medicalSharedApi: {},
});

describe('<AddMedicalNoteSidePanel />', () => {
  const mockedSquadAthletes = [
    {
      label: 'Squad A Name',
      options: [
        {
          value: 1,
          label: 'Athlete 1 Name',
        },
        {
          value: 2,
          label: 'Athlete 2 Name',
        },
      ],
    },
    {
      label: 'Squad B Name',
      options: [
        {
          value: 3,
          label: 'Athlete 1 Name',
        },
        {
          value: 4,
          label: 'Athlete 3 Name',
        },
      ],
    },
  ];

  const mockMedicalNote = {
    id: 1,
    organisation_annotation_type: {
      id: 1,
      name: 'Medical note',
      type: 'OrganisationAnnotationTypes::Medical',
    },
    document_note_category_ids: [],
    annotationable_type: 'Athlete',
    annotationable: {
      id: 1,
      fullname: 'An Athlete',
      avatar_url: 'img/url',
      availability: 'unavailable',
      athlete_squads: [
        {
          id: 8,
          name: 'International Squad',
        },
      ],
      type: 'Athlete',
    },
    title: '1',
    content: '<p>My content</p>',
    annotation_date: '2022-07-14T23:00:00Z',
    annotation_actions: [],
    expiration_date: null,
    attachments: [
      {
        filetype: 'binary/octet-stream',
        filesize: 1010043,
        filename: 'file.xls',
        url: 'attachment/url',
      },
    ],
    archived: false,
    created_by: {
      id: 1,
      fullname: 'A Staff',
    },
    created_at: '2022-07-15T08:51:20Z',
    updated_by: null,
    updated_at: '2022-07-15T08:51:20Z',
    restricted_to_doc: false,
    restricted_to_psych: false,
    illness_occurrences: [
      {
        id: 11523,
        issue_type: 'illness',
        occurrence_date: 'Jul  5, 2022',
        full_pathology:
          'Respiratory tract infection (bacterial or viral) [N/A]',
      },
    ],
    injury_occurrences: [],
    author: {
      id: 1,
      fullname: 'A Staff',
    },
    expired: false,
  };

  const mockDocumentCategoryOptions = [
    {
      value: 1,
      label: 'Document Category 1',
    },
    {
      value: 2,
      label: 'Document Category 2',
    },
    {
      value: 3,
      label: 'Document Category 3',
    },
  ];

  const mockedStaffUsers = [
    {
      value: 1,
      label: 'Staff User 1',
    },
    {
      value: 2,
      label: 'Staff User 2',
    },
  ];

  const mockIssues = {
    open_issues: [
      {
        id: 11523,
        occurrence_date: '2022-07-05T00:00:00+01:00',
        closed: false,
        injury_status: {
          description: 'Not affecting availability (medical attention)',
          cause_unavailability: false,
          restore_availability: true,
        },
        resolved_date: null,
        issue_type: 'Illness',
        full_pathology:
          'Respiratory tract infection (bacterial or viral) [N/A]',
      },
    ],
    closed_issues: [],
  };

  const mockedAnnotationTypesOptions = mockedAnnotationTypes.map(
    ({ id, name, type }) => ({
      value: id,
      label: name,
      type,
    })
  );

  const defaultProps = {
    isOpen: true,
    isAthleteSelectable: false,
    annotationTypes: mockedAnnotationTypesOptions,
    squadAthletes: mockedSquadAthletes,
    defaultAnnotationType: 1,
    athleteId: null,
    isDuplicatingNote: false,
    duplicateNote: mockMedicalNote,
    initialDataRequestStatus: null,
    documentCategoryOptions: mockDocumentCategoryOptions,
    staffUsers: mockedStaffUsers,
    onSaveNote: jest.fn(),
    onClose: jest.fn(),
    onFileUploadStart: jest.fn(),
    onFileUploadSuccess: jest.fn(),
    onFileUploadFailure: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const renderComponent = (props = defaultProps) =>
    renderWithUserEventSetup(
      <Provider store={store}>
        <AddMedicalNoteSidePanel {...props} />
      </Provider>
    );

  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
    saveMedicalNoteSingle.mockResolvedValue({});

    usePermissions.mockReturnValue({
      permissions: {
        medical: { privateNotes: { canCreate: false } },
      },
      permissionsRequestStatus: 'SUCCESS',
    });
    useDiagnostics.mockReturnValue({
      diagnostics: [],
      fetchDiagnostics: jest.fn().mockImplementation(() => Promise.resolve([])),
    });
    useGetPermittedSquadsQuery.mockReturnValue({
      data: [
        { id: 1, name: 'First Squad' },
        { id: 2, name: 'Second Squad' },
      ],
      isLoading: false,
      isSuccess: true,
    });
    useLazyGetAthleteDataQuery.mockReturnValue([
      jest.fn(),
      {
        data: {
          squad_names: [
            { id: 1, name: 'First Squad' },
            { id: 2, name: 'Second Squad' },
            { id: 3, name: 'Third Squad' },
          ],
        },
        isFetching: false,
        status: 'fulfilled',
      },
    ]);
  });

  it('renders the default form', async () => {
    renderComponent();

    expect(
      screen.getByTestId('AddMedicalNoteSidePanel|Parent')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddMedicalNoteSidePanel|TopRow')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddMedicalNoteSidePanel|SecondRow')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddMedicalNoteSidePanel|NoteInput')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddMedicalNoteSidePanel|Issues')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('AddMedicalNoteSidePanel|Attachments')
    ).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');

    // buttons[2...7] are the richtext input
    expect(buttons).toHaveLength(10);

    const closeIcon = buttons[0];
    expect(closeIcon).toBeInTheDocument();

    expect(screen.getByText('Copy last note')).toBeInTheDocument();

    const copyNoteButton = buttons[1];
    expect(copyNoteButton).toHaveTextContent('Copy last note');

    const addAttachmentButton = buttons[8];
    expect(addAttachmentButton).toHaveTextContent('Add');

    const saveButton = buttons[9];
    expect(saveButton).toHaveTextContent('Save');

    const textboxes = screen.getAllByRole('textbox');
    expect(textboxes).toHaveLength(8);

    expect(screen.getByTestId('RichTextEditorAlt|editor')).toBeInTheDocument();
  });

  it('has the correct date when annotationDate prop supplied', async () => {
    renderComponent({
      ...defaultProps,
      annotationDate: '2023-04-17T00:00:00+01:00',
    });

    expect(screen.getByText('Add medical note')).toBeInTheDocument();

    expect(
      screen.getByTestId('AddMedicalNoteSidePanel|Parent')
    ).toBeInTheDocument();

    const datePicker = screen.getByTestId(
      'AddMedicalNoteSidePanel|MedicalNoteDate'
    );
    expect(
      within(datePicker).getByDisplayValue('2023-04-17T00:00:00+01:00')
    ).toBeInTheDocument();
  });

  describe('note-author-field is enabled', () => {
    beforeEach(() => {
      window.featureFlags['note-author-field'] = true;
    });

    afterEach(() => {
      window.featureFlags['note-author-field'] = false;
    });

    it("renders the 'On behalf of' field", () => {
      renderComponent();

      const onBehalfOfSelectContainer = screen.getByTestId(
        'AddMedicalNoteSidePanel|ThirdRow'
      );

      selectEvent.openMenu(
        onBehalfOfSelectContainer.querySelector('.kitmanReactSelect input')
      );

      expect(screen.getByText('Staff User 1')).toBeInTheDocument();
      expect(screen.getByText('Staff User 2')).toBeInTheDocument();
    });
  });

  describe('button interactions', () => {
    it('calls onClose when userEvent clicks the close icon', async () => {
      const { user } = renderComponent();

      const buttons = screen.getAllByRole('button');

      await user.click(buttons[0]);

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('makes a call to get the last note when userEvent clicks fetch last note', async () => {
      const { user } = renderComponent();

      const getLastNoteRequest = jest.spyOn($, 'ajax');

      const buttons = screen.getAllByRole('button');

      await user.click(buttons[1]);

      expect(getLastNoteRequest).toHaveBeenCalled();
    });

    it('makes a calls to saveMedicalNoteRequest when userEvent clicks the save button', async () => {
      const { user } = renderComponent();

      const occurredInSquadSelector = screen
        .getByTestId('AddMedicalNoteSidePanel|FourthRow')
        .querySelectorAll('.kitmanReactSelect input')[0];

      await selectEvent.openMenu(occurredInSquadSelector);

      expect(screen.getByText('First Squad')).toBeInTheDocument();

      await user.click(screen.getByText('First Squad'));

      const saveMedicalNoteRequest = jest.spyOn($, 'ajax');

      await user.click(screen.getAllByRole('button')[1]);

      fireEvent.change(screen.getByLabelText('Date'), {
        target: { value: '2023-03-11' },
      });

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(saveMedicalNoteRequest).toHaveBeenCalled();
      expect(saveMedicalNoteSingle).toHaveBeenCalledTimes(1);
      expect(trackEventMock).toHaveBeenCalledWith(
        performanceMedicineEventNames.createdMedicalNote,
        {
          level: 'team',
          tab: tabHashes.OVERVIEW,
        }
      );
    });

    it('[TRACK-EVENT] tracks Duplicated Medical Note', async () => {
      const { user } = renderComponent({
        ...defaultProps,
        isDuplicatingNote: true,
      });

      const occurredInSquadSelector = screen
        .getByTestId('AddMedicalNoteSidePanel|FourthRow')
        .querySelectorAll('.kitmanReactSelect input')[0];

      await selectEvent.openMenu(occurredInSquadSelector);

      expect(screen.getByText('First Squad')).toBeInTheDocument();

      await user.click(screen.getByText('First Squad'));

      const saveMedicalNoteRequest = jest.spyOn($, 'ajax');

      await user.click(screen.getAllByRole('button')[1]);

      fireEvent.change(screen.getByLabelText('Date'), {
        target: { value: '2023-03-11' },
      });

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(saveMedicalNoteRequest).toHaveBeenCalled();
      expect(saveMedicalNoteSingle).toHaveBeenCalledTimes(1);
      expect(trackEventMock).toHaveBeenCalledWith(
        performanceMedicineEventNames.duplicatedMedicalNote,
        {
          level: 'team',
          tab: tabHashes.OVERVIEW,
        }
      );
    });

    it('disables the save button when the user clicks save', async () => {
      const { user } = renderComponent();

      server.use(
        rest.post('/medical/notes', (req, res, ctx) =>
          res(ctx.delay(2000), ctx.json({ attachments: [] }))
        )
      );

      await user.click(screen.getAllByRole('button')[1]);

      fireEvent.change(screen.getAllByRole('textbox')[0], {
        target: { value: '2023, February 10' },
      });

      expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();

      await user.click(screen.getByRole('button', { name: 'Save' }));
    });
  });

  describe('an athleteId is present', () => {
    const athleteId = 1;
    beforeEach(() => {
      moment.tz.setDefault('UTC');
      server.use(
        rest.get(
          `/ui/medical/athletes/${athleteId}/issue_occurrences`,
          (req, res, ctx) => res(ctx.json(mockIssues))
        )
      );
      server.use(
        rest.get(
          `/medical/athletes/${athleteId}/notes/last_authored`,
          (req, res, ctx) =>
            res(
              ctx.json({
                id: 1,
                title: 'Previous note title',
                content: 'Previous note content',
                annotation_date: '2022-10-27T12:00:00.000+01:00',
              })
            )
        )
      );
    });
    afterEach(() => {
      moment.tz.setDefault();
    });

    it('has the correct name for the athlete id', async () => {
      renderComponent({ ...defaultProps, athleteId });

      expect(await screen.findByText('Athlete 1 Name')).toBeInTheDocument();
    });

    it('has the correct issues for the athlete id', async () => {
      renderComponent({ ...defaultProps, athleteId });

      expect(
        await screen.findByText(
          'Jul 4, 2022 - Respiratory tract infection (bacterial or viral) [N/A]'
        )
      ).toBeInTheDocument();
    });

    it('renders the alternative rich text editor correctly', async () => {
      renderComponent({ ...defaultProps, athleteId });

      expect(
        await screen.findByTestId('RichTextEditorAlt|editor')
      ).toBeInTheDocument();
    });

    it('copies last note when clicking the copy button', async () => {
      const { user } = renderComponent({ ...defaultProps, athleteId });

      await user.click(screen.getByRole('button', { name: 'Copy last note' }));

      expect(
        within(screen.getByTestId('RichTextEditorAlt|editor')).getByText(
          '[Copied from note: Oct 27, 2022] Previous note content'
        )
      ).toBeInTheDocument();
    });
  });

  describe('when a note is being duplicated', () => {
    let getAthleteIssues;
    const mockDate = new Date('2025-06-21T13:33:33Z');

    beforeEach(() => {
      moment.tz.setDefault('UTC');
      const deferred = $.Deferred();
      getAthleteIssues = jest
        .spyOn($, 'ajax')
        .mockImplementation(() => deferred.resolve(mockIssues));

      jest.useFakeTimers();
      jest.setSystemTime(mockDate);
    });
    afterEach(() => {
      moment.tz.setDefault();
      moment.tz.setDefault();
      jest.useRealTimers();
    });

    it('has the correct content prepopulated', async () => {
      renderComponent({
        ...defaultProps,
        athleteId: 2,
        isDuplicatingNote: true,
      });

      expect(getAthleteIssues).toHaveBeenCalled();
      expect(screen.getByText('Duplicate medical note')).toBeInTheDocument();
      expect(screen.getByText('Athlete 1 Name')).toBeInTheDocument();
      expect(
        await screen.findByText(
          'Jul 4, 2022 - Respiratory tract infection (bacterial or viral) [N/A]'
        )
      ).toBeInTheDocument();

      const datePicker = screen.getByTestId(
        'AddMedicalNoteSidePanel|MedicalNoteDate'
      );
      const expectedDateString = moment(mockDate).format(
        'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ'
      );
      const dateInput = within(datePicker).getByRole('textbox');

      expect(dateInput).toHaveValue(expectedDateString);
      expect(screen.getByText('Default visibility')).toBeInTheDocument();
    });
  });

  it('renders copy last note for Rehab notes', async () => {
    const rehabProps = {
      ...defaultProps,
      duplicateNote: MockRehabMedicalNote,
      defaultAnnotationType: 3,
    };

    renderComponent({ ...rehabProps });

    const copyNote = screen.getByText('Copy last note');
    expect(copyNote).toBeInTheDocument();
  });

  describe('when viewing a past athlete', () => {
    beforeEach(() => {
      moment.tz.setDefault('UTC');
    });
    afterEach(() => {
      moment.tz.setDefault();
    });

    it('has the correct name for the athlete id', async () => {
      renderComponent({
        ...defaultProps,
        athleteId: 1,
      });

      expect(await screen.findByText('Athlete 1 Name')).toBeInTheDocument();
    });
  });

  describe('title interaction', () => {
    beforeEach(() => {
      window.featureFlags['medical-note-inherit-name'] = true;
    });

    afterEach(() => {
      window.featureFlags['medical-note-inherit-name'] = false;
    });

    it('matches note type when feature flag is enabled', async () => {
      renderComponent();

      const titleInput = screen.getByLabelText('Title');
      expect(titleInput.value).toBe('Medical note');
    });
  });

  describe('[feature-flag] confidential-notes flag is on', () => {
    beforeEach(() => {
      usePermissions.mockReturnValue({
        permissions: {
          medical: { privateNotes: { canCreate: true } },
        },
        permissionsRequestStatus: 'SUCCESS',
      });
      window.featureFlags['confidential-notes'] = true;
    });

    afterEach(() => {
      usePermissions.mockReturnValue({
        permissions: {
          medical: { privateNotes: { canCreate: false } },
        },
        permissionsRequestStatus: 'SUCCESS',
      });
      window.featureFlags['confidential-notes'] = false;
    });

    it('renders confidential notes visibility <Select />', async () => {
      renderComponent();

      selectEvent.openMenu(screen.getByLabelText('Visibility'));

      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Only me')).toBeInTheDocument();
      expect(screen.getByText('Me and specific users')).toBeInTheDocument();
    });
  });

  describe('Diagnostic note', () => {
    beforeEach(() => {
      moment.tz.setDefault('UTC');
      server.use(
        rest.get(
          `/ui/medical/athletes/${1}/issue_occurrences`,
          (req, res, ctx) => res(ctx.json(mockIssues))
        )
      );
      useDiagnostics.mockReturnValue({
        diagnostics: mockedDiagnostics.diagnostics,
        fetchDiagnostics: jest
          .fn()
          .mockImplementation(() => Promise.resolve(mockedDiagnostics)),
      });
      useGetPermittedSquadsQuery.mockReturnValue({
        data: [
          { id: 1, name: 'First Squad' },
          { id: 2, name: 'Second Squad' },
        ],
        isLoading: false,
        isSuccess: true,
      });
      useLazyGetAthleteDataQuery.mockReturnValue([
        jest.fn(),
        {
          data: {
            squad_names: [
              { id: 1, name: 'First Squad' },
              { id: 2, name: 'Second Squad' },
              { id: 3, name: 'Third Squad' },
            ],
          },
          isFetching: false,
          status: 'fulfilled',
        },
      ]);
    });
    afterEach(() => {
      moment.tz.setDefault();
    });

    it('sets the correct associated injury from the associated diagnostic', async () => {
      const { user } = renderComponent({ ...defaultProps, athleteId: 1 });

      const typeWrapper = await screen.findByTestId(
        'AddMedicalNoteSidePanel|TopRow'
      );

      const typeSelects = typeWrapper.querySelectorAll(
        '.kitmanReactSelect input'
      );

      selectEvent.openMenu(typeSelects[0]);

      expect(screen.getByText('Diagnostic note')).toBeInTheDocument();
      await act(async () => {
        await selectEvent.select(typeSelects[0], 'Diagnostic note');
      });
      const occurredInSquadSelector = screen
        .getByTestId('AddMedicalNoteSidePanel|FourthRow')
        .querySelectorAll('.kitmanReactSelect input')[0];

      await selectEvent.openMenu(occurredInSquadSelector);

      expect(screen.getByText('First Squad')).toBeInTheDocument();

      await user.click(screen.getByText('First Squad'));

      expect(screen.getByText('Associated diagnostic')).toBeInTheDocument();

      const diagWrapper = screen.getByTestId(
        'AddMedicalNoteSidePanel|Diagnostic'
      );
      const diagSelects = diagWrapper.querySelectorAll(
        '.kitmanReactSelect input'
      );

      selectEvent.openMenu(diagSelects[0]);

      expect(
        screen.getByText(
          'May 15, 2022 - Cardiac Data - Mock company - Injury/ Illness: Adductor strain [Right]'
        )
      ).toBeInTheDocument();

      await selectEvent.select(
        diagSelects[0],
        'May 15, 2022 - Cardiac Data - Mock company - Injury/ Illness: Adductor strain [Right]'
      );

      fireEvent.change(screen.getByLabelText('Date'), {
        target: { value: '2023-03-11' },
      });

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(saveMedicalNoteSingle).toHaveBeenCalledTimes(1);
      expect(saveMedicalNoteSingle).toHaveBeenLastCalledWith({
        annotationable_type: 'Diagnostic',
        organisation_annotation_type_id: 5,
        document_note_category_ids: [],
        annotationable_id: 180094,
        athlete_id: 1,
        diagnostic_id: 180094,
        title: '1',
        annotation_date: '2023-03-11T00:00:00+00:00',
        athlete_active_period: null,
        content: '<p>My content</p>',
        illness_occurrence_ids: [],
        injury_occurrence_ids: [2],
        chronic_issue_ids: [],
        procedure_id: undefined,
        rehab_session_ids: undefined,
        restricted_to_doc: false,
        restricted_to_psych: false,
        attachments_attributes: [],
        annotation_actions_attributes: [],
        scope_to_org: true,
        author_id: null,
        note_visibility_ids: [],
        squad_id: 1,
      });
      expect(trackEventMock).toHaveBeenCalledWith(
        performanceMedicineEventNames.createdMedicalNote,
        {
          level: 'team',
          tab: tabHashes.OVERVIEW,
        }
      );
    });
  });
});
