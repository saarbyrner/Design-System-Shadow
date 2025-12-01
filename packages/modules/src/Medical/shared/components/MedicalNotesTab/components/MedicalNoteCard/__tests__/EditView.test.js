import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import selectEvent from 'react-select-event';
import moment from 'moment-timezone';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import {
  storeFake,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import PermissionsContext, {
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';
import { mockedPastAthlete } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import {
  useGetAthleteDataQuery,
  useLazyGetAthleteDataQuery,
  useGetAncillaryEligibleRangesQuery
} from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { rehabMedicalNote as MockRehabMedicalNote } from '@kitman//services/src/mocks/handlers/medical/getMedicalNotes';
import {
  MockMedicalNote,
  MockDiagnosticNote,
  MockAthleteIssues,
} from '../mocks';
import EditView from '../EditView';

// Uses the mocked version of component (in __mocks__ dir at component level)
jest.mock('@kitman/components/src/DatePicker');

jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    useGetAthleteDataQuery: jest.fn(),
    useLazyGetAthleteDataQuery: jest.fn(),
    useGetAncillaryEligibleRangesQuery: jest.fn(),
  })
);

const defaultProps = {
  isLoading: false,
  note: MockMedicalNote,
  requestStatus: null,
  athleteIssues: MockAthleteIssues,
  formState: {
    organisation_annotation_type_id:
      MockMedicalNote.organisation_annotation_type.id,
    title: MockMedicalNote.title,
    annotation_date: MockMedicalNote.annotation_date,
    content: MockMedicalNote.content,
    illness_occurrence_ids: MockMedicalNote.illness_occurrences.map(
      (illness) => illness.id
    ),
    injury_occurrence_ids: MockMedicalNote.injury_occurrences.map(
      (injury) => injury.id
    ),
    chronic_issue_ids: MockMedicalNote.chronic_issues.map((issue) => issue.id),
    restricted_to_doc: false,
    restricted_to_psych: false,
    squad_id: MockMedicalNote.annotationable.athlete_squads[0].id,
    annotation_actions_attributes: [],
    scope_to_org: true,
    attachments_attributes: MockMedicalNote.attachments,
    author_id: MockMedicalNote.author.id,
  },
  onSetViewType: jest.fn(),
  onSetFileUploadQueue: jest.fn(),
  onSaveNote: jest.fn(),
  onUpdateIssues: jest.fn(),
  onUpdateTitle: jest.fn(),
  onUpdateDate: jest.fn(),
  onUpdateContent: jest.fn(),
  onUpdateVisibility: jest.fn(),
  onNoteVisibilityChange: jest.fn(),
  onUpdateSquad: jest.fn(),
  onResetAttachments: jest.fn(),
  isPastAthlete: false,
  athleteData: {},
  staffUsers: {
    data: [
      {
        value: 1,
        label: 'A Staff',
        firstname: 'A',
        lastname: 'Staff',
      },
    ],
    isLoading: false,
  },
  t: i18nextTranslateStub(),
};

const store = storeFake({
  medicalApi: {},
});

const renderComponent = ({
  props = defaultProps,
  permissions = DEFAULT_CONTEXT_VALUE.permissions,
} = {}) =>
  render(
    <LocalizationProvider>
      <Provider store={store}>
        <PermissionsContext.Provider
          value={{
            permissions: {
              ...permissions,
              notes: {
                canEdit: true,
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          }}
        >
          <EditView {...props} />
        </PermissionsContext.Provider>
      </Provider>
    </LocalizationProvider>
  );

describe('<EditView/>', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
    useGetAthleteDataQuery.mockReturnValue({ data: mockedPastAthlete });
    useLazyGetAthleteDataQuery.mockReturnValue([
      jest.fn(),
      {
        data: {},
        isFetching: false,
        isError: false,
        isLoading: true,
      },
    ]);
     useGetAncillaryEligibleRangesQuery.mockReturnValue({
      data: {
        eligible_ranges: [],
      },
    });
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  describe('render content', () => {
    let container;
    let titleInput;
    let noteDateInput;
    let richTextInput;
    let selectInputs;
    let buttons;

    beforeEach(() => {
      window.featureFlags = { 'naming-uploaded-files': true };
      container = renderComponent().container;

      titleInput = container.querySelector('input[name="title"]');
      noteDateInput = screen
        .getByLabelText('Date of note')
        .parentNode.querySelector('input');
      richTextInput = container.querySelector(
        '.richTextEditor--kitmanDesignSystem__textarea'
      );
      selectInputs = container.querySelectorAll('.kitmanReactSelect');
      buttons = container.getElementsByClassName(
        'textButton--kitmanDesignSystem'
      );
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('renders the default content', () => {
      expect(screen.getByTestId('MetaData|AuthorDetails')).toHaveTextContent(
        'Created Jul 15, 2022 by A Staff'
      );
      // This is painfully necessary as we do not have aria roles on the components ..
      expect(titleInput).toHaveValue('1');
      expect(noteDateInput).toHaveValue('2022-07-14T23:00:00Z');
      expect(richTextInput).toHaveTextContent('My content');

      const visibilitySelect = selectInputs[0];
      expect(visibilitySelect).toHaveTextContent('Visibility');
      expect(visibilitySelect).toHaveTextContent('Default visibility');

      const issueSelect = selectInputs[4];
      expect(issueSelect).toHaveTextContent('Associated injury/ illness');

      expect(issueSelect).toHaveTextContent(
        'Respiratory tract infection (bacterial or viral) [N/A]Optional'
      );
      expect(issueSelect).toHaveTextContent(
        'Jul 4, 2022 - Respiratory tract infection (bacterial or viral) [N/A]Optional'
      );
      expect(issueSelect).toHaveTextContent('Jul 5, 2022 - Chronic issue');

      expect(screen.getByTestId('MetaData|AuthorDetails')).toHaveTextContent(
        'Created Jul 15, 2022 by A Staff'
      );

      expect(buttons).toHaveLength(3);
      expect(buttons[0]).toHaveTextContent('Add');
      expect(buttons[1]).toHaveTextContent('Discard changes');
      expect(buttons[2]).toHaveTextContent('Save');

      expect(screen.getByRole('link')).toHaveTextContent('file.xls');
    });

    it('enables RichTextEditor when Notes are not created via the Command Health so the content_editable is true', () => {
      const richTextContentDiv = container.querySelector(
        '.public-DraftEditor-content'
      );
      expect(richTextContentDiv).toHaveAttribute('contenteditable', 'true');
    });

    it('toggles presentation view by calling onSetViewType', async () => {
      await userEvent.click(buttons[1]);
      expect(defaultProps.onSetViewType).toHaveBeenCalled();
    });

    it('calls onSaveNote', async () => {
      await userEvent.click(buttons[2]);
      expect(defaultProps.onSaveNote).toHaveBeenCalled();
    });

    it('updates the title and calls onUpdateTitle', async () => {
      await userEvent.type(titleInput, '2');
      expect(defaultProps.onUpdateTitle).toHaveBeenCalled();
      expect(defaultProps.onUpdateTitle).toHaveBeenCalledWith('12');
    });

    it('updates the attachments and calls onSetFileUploadQueue', async () => {
      await userEvent.click(buttons[0]);
      const fileAction = screen.getAllByTestId('TooltipMenu|ListItemButton')[0];
      await userEvent.click(fileAction);
      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toBeTruthy();
    });
  });

  describe('render RichTextEditor disabled when Notes are created via the Command Health and content_editable is false', () => {
    let container;
    beforeEach(() => {
      container = renderComponent({
        props: {
          ...defaultProps,
          note: { ...defaultProps.note, content_editable: false },
        },
      }).container;
    });

    it('disables RichTextEditor', () => {
      const richTextContentDiv = container.querySelector(
        '.public-DraftEditor-content'
      );
      expect(richTextContentDiv).toHaveAttribute('contenteditable', 'false');
    });
  });

  describe('note-author-field is enabled', () => {
    beforeEach(() => {
      window.featureFlags['note-author-field'] = true;
    });

    afterEach(() => {
      window.featureFlags['note-author-field'] = false;
    });

    it("renders the 'On behalf of' field and information", () => {
      const { container } = renderComponent();

      const selectInputs = container.querySelectorAll('.kitmanReactSelect');
      const onBehalfOfSelect = selectInputs[4];
      expect(onBehalfOfSelect).toHaveTextContent('On behalf of');
      expect(onBehalfOfSelect).toHaveTextContent('A Staff');

      expect(screen.getByTestId('MetaData|AuthorDetails')).toHaveTextContent(
        'Created Jul 15, 2022 by A Staff on behalf of A Staff'
      );
    });
  });

  describe('document note type', () => {
    const documentNote = {
      ...defaultProps.note,
      organisation_annotation_type: {
        id: 246,
        name: 'Document note',
        type: 'OrganisationAnnotationTypes::Document',
      },
      document_note_categories: [
        {
          created_at: '2022-12-05T09:40:59Z',
          id: 1,
          name: 'Category Note 1',
          updated_at: '2022-12-05T09:40:59Z',
        },
        {
          created_at: '2022-12-05T09:40:59Z',
          id: 2,
          name: 'Category Note 2',
          updated_at: '2022-12-05T09:40:59Z',
        },
      ],
    };

    it('renders the document category content', () => {
      renderComponent({
        props: {
          ...defaultProps,
          note: documentNote,
        },
      });

      expect(
        screen.getByTestId('MetaData|DocumentCategory')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('MetaData|DocumentCategoryTitle')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('MetaData|DocumentCategoryValue')
      ).toBeInTheDocument();
    });
  });

  describe('renders rehab note', () => {
    let container;
    let titleInput;
    let noteDateInput;
    let richTextInput;
    let selectInputs;

    const rehabFormState = {
      organisation_annotation_type_id:
        MockRehabMedicalNote.organisation_annotation_type.id,
      title: MockRehabMedicalNote.title,
      annotation_date: MockRehabMedicalNote.annotation_date,
      content: MockRehabMedicalNote.content,
      illness_occurrence_ids: MockRehabMedicalNote.illness_occurrences.map(
        (illness) => illness.id
      ),
      injury_occurrence_ids: MockRehabMedicalNote.injury_occurrences.map(
        (injury) => injury.id
      ),
      restricted_to_doc: false,
      restricted_to_psych: false,
      squad_id: MockRehabMedicalNote.annotationable.athlete_squads[0].id,
      annotation_actions_attributes: [],
      scope_to_org: true,
      attachments_attributes: MockRehabMedicalNote.attachments,
    };

    beforeEach(() => {
      container = renderComponent({
        props: {
          ...defaultProps,
          note: MockRehabMedicalNote,
          formState: rehabFormState,
        },
      }).container;

      titleInput = container.querySelector('input[name="title"]');
      noteDateInput = screen
        .getByLabelText('Date of note')
        .parentNode.querySelector('input');
      richTextInput = container.querySelector(
        '.richTextEditor--kitmanDesignSystem__textarea'
      );
      selectInputs = container.querySelectorAll('.kitmanReactSelect');
    });

    it('renders the rehab content', () => {
      // This is painfully necessary as we do not have aria roles on the components ..
      expect(titleInput).toHaveValue('Test rehab note');
      expect(noteDateInput).toHaveValue('2022-12-14T00:00:00Z');
      expect(richTextInput).toHaveTextContent('Test rehab note content');

      const visibilitySelect = selectInputs[0];
      expect(visibilitySelect).toHaveTextContent('Visibility');
      expect(visibilitySelect).toHaveTextContent('Default visibility');

      const issueSelect = selectInputs[4];
      expect(issueSelect).toHaveTextContent('Associated injury/ illness');
    });
  });

  describe('[feature-flag] confidential-notes is enabled', () => {
    beforeEach(() => {
      window.featureFlags['confidential-notes'] = true;
    });

    afterEach(() => {
      window.featureFlags['confidential-notes'] = false;
    });

    it('renders the confidential notes <Select />', async () => {
      renderComponent({
        permissions: {
          ...DEFAULT_CONTEXT_VALUE.permissions,
          notes: {
            canEdit: true,
          },
          medical: {
            privateNotes: { canCreate: true },
          },
        },
      });

      selectEvent.openMenu(screen.getByLabelText('Visibility'));

      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Only me')).toBeInTheDocument();
      expect(screen.getByText('Me and specific users')).toBeInTheDocument();
    });

    it('does not render the confidential notes <Select /> when annotationable_type = Diagnostic', async () => {
      renderComponent({
        props: {
          ...defaultProps,
          note: {
            ...MockDiagnosticNote,
            annotationable_type: 'Diagnostic',
          },
        },
        permissions: {
          ...DEFAULT_CONTEXT_VALUE.permissions,
          notes: {
            canEdit: true,
          },
          medical: {
            privateNotes: { canCreate: true },
          },
        },
      });

      selectEvent.openMenu(screen.getByLabelText('Visibility'));

      expect(screen.queryByText('All')).not.toBeInTheDocument();
      expect(screen.queryByText('Only me')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Me and specific users')
      ).not.toBeInTheDocument();
    });

    it('renders the indicator message when Me and specific users is selected', async () => {
      const { container, rerender } = renderComponent({
        permissions: {
          ...DEFAULT_CONTEXT_VALUE.permissions,
          notes: {
            canEdit: true,
          },
          medical: {
            privateNotes: { canCreate: true },
          },
        },
      });

      const selects = container.querySelectorAll('.kitmanReactSelect input');

      selectEvent.openMenu(selects[0]);
      expect(screen.getByText('All')).toBeInTheDocument();
      await userEvent.click(screen.getByText('All'));
      expect(defaultProps.onNoteVisibilityChange).toHaveBeenCalledTimes(1);

      expect(
        screen.queryByText(
          /You are changing the visibility of the note.After saving, this note will only be visible to the selected users./i
        )
      ).not.toBeInTheDocument();

      selectEvent.openMenu(selects[0]);
      expect(screen.getByText('Only me')).toBeInTheDocument();
      await userEvent.click(screen.getByText('Only me'));
      expect(defaultProps.onNoteVisibilityChange).toHaveBeenCalledTimes(2);

      expect(
        screen.queryByText(
          /You are changing the visibility of the note.After saving, this note will only be visible to the selected users./i
        )
      ).not.toBeInTheDocument();

      selectEvent.openMenu(selects[0]);
      expect(screen.getByText('Me and specific users')).toBeInTheDocument();
      await userEvent.hover(screen.getByText('Me and specific users'));

      const staffCheckbox = screen.getByRole('checkbox', {
        name: 'Staff, A',
      });
      await userEvent.click(staffCheckbox);
      expect(defaultProps.onNoteVisibilityChange).toHaveBeenCalledTimes(3);
      expect(defaultProps.onNoteVisibilityChange).toHaveBeenLastCalledWith([
        { label: 'Staff, A', value: 1 },
      ]);

      rerender(
        <Provider store={store}>
          <PermissionsContext.Provider
            value={{
              permissions: {
                ...DEFAULT_CONTEXT_VALUE.permissions,
                notes: {
                  canEdit: true,
                },
                medical: {
                  privateNotes: { canCreate: true },
                },
              },
              permissionsRequestStatus: 'SUCCESS',
            }}
          >
            <EditView
              {...defaultProps}
              formState={{
                ...defaultProps.formState,
                note_visibility_ids: [{ label: 'Staff, A', value: 1 }],
              }}
            />
          </PermissionsContext.Provider>
        </Provider>
      );

      expect(
        screen.getByText(
          /You are changing the visibility of the note.After saving, this note will only be visible to the selected users./i
        )
      ).toBeInTheDocument();
    });
  });

  describe('[feature-flag] player-movement-entity-emr-annotations is enabled', () => {
    beforeEach(() => {
      window.featureFlags['player-movement-entity-emr-annotations'] = true;
    });

    afterEach(() => {
      window.featureFlags['player-movement-entity-emr-annotations'] = false;
    });

    it('renders the passed values for the date field', () => {
      renderComponent({
        props: {
          ...defaultProps,
          athleteId: 1,
        },
        permissions: {
          ...DEFAULT_CONTEXT_VALUE.permissions,
          notes: {
            canEdit: true,
          },
          medical: {
            privateNotes: { canCreate: true },
          },
        },
      });

      expect(screen.getByText('Date of note')).toBeInTheDocument();
      expect(screen.getByTestId('maximum-date')).toHaveTextContent(
        '2023-01-28T23:59:59'
      );
      expect(screen.getByTestId('minimum-date')).toHaveTextContent(
        '2022-12-16T05:04:33'
      );
    });
  });

  describe('[feature-flag] player-movement-entity-emr-annotations is disabled', () => {
    beforeEach(() => {
      window.featureFlags['player-movement-entity-emr-annotations'] = false;
    });

    it('renders the passed values for the date field', () => {
      renderComponent({
        permissions: {
          ...DEFAULT_CONTEXT_VALUE.permissions,
          notes: {
            canEdit: true,
          },
          medical: {
            privateNotes: { canCreate: true },
          },
        },
      });

      expect(screen.getByText('Date of note')).toBeInTheDocument();

      // Mocked DatePicker component does not render the field if val is null
      expect(screen.queryByTestId('minimum-date')).not.toBeInTheDocument();
      expect(screen.queryByTestId('maximum-date')).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] player-movement-aware-datepicker', () => {
    beforeEach(() => {
      window.featureFlags['player-movement-aware-datepicker'] = true;
    });
    afterEach(() => {
      window.featureFlags['player-movement-aware-datepicker'] = false;
    });

    it('does not render non movement aware datepicker', async () => {
      renderComponent();

      expect(screen.queryByLabelText('Date of note')).not.toBeInTheDocument();
    });

    it('renders movement datepicker', async () => {
      renderComponent();

      expect(screen.getByPlaceholderText('MM/DD/YYYY')).toBeInTheDocument();
    });
  });
});
