import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment';
import {
  rehabMedicalNote as MockRehabMedicalNote,
  telephoneNote as MockTelephoneNote,
} from '@kitman//services/src/mocks/handlers/medical/getMedicalNotes';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import tabHashes from '@kitman/modules/src/Medical/shared/constants/tabHashes';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import {
  MockMedicalNote,
  MockDiagnosticNote,
  MockArchivedMedicalNote,
  MockMedicalVersions,
} from '../mocks';
import PresentationView from '../PresentationView';
import {
  DEFAULT_CONTEXT_VALUE,
  defaultProps,
  onTrialProps,
  renderFunction,
  wrapRenderWithPermissions,
} from './testUtils';

jest.mock('@kitman/common/src/hooks/useEventTracking');

const mockTrackEvent = jest.fn();

describe('<PresentationView/>', () => {
  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: mockTrackEvent });
    delete window.location;
    window.location = new URL(
      'http://localhost/medical/athletes/40211#medical_notes'
    );
    i18nextTranslateStub();
  });

  const checkForRosterAndVisibilityText = () => {
    // Checkes the two title values
    screen.getAllByTestId('MetaData|Title').forEach((elem, i) => {
      if (i === 0) {
        expect(elem).toHaveTextContent('Visibility');
      } else {
        expect(elem).toHaveTextContent('Occurred in Squad');
      }
    });
  };

  describe('[permissions]', () => {
    describe('default permissions', () => {
      it('renders the default content', () => {
        renderFunction({});
        expect(
          screen.getByTestId('NoteCardLayout|Content')
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('Attachments|Attachments')
        ).toBeInTheDocument();
        expect(screen.getByTestId('Note|Title')).toHaveTextContent('1');
        expect(screen.getByTestId('Note|Tag')).toHaveTextContent(
          'Medical note'
        );
        checkForRosterAndVisibilityText();
      });

      it('renders the document category content', () => {
        const documentNote = {
          ...defaultProps.note,
          organisation_annotation_type: {
            id: 246,
            name: 'Document note',
            type: 'OrganisationAnnotationTypes::Document',
          },
          document_note_categories: [
            { id: 1, name: 'Category Note 1' },
            { id: 2, name: 'Category Note 2' },
          ],
        };
        renderFunction({ note: documentNote });
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

      it('renders the avatar when withAvatar is true', async () => {
        renderFunction({ withAvatar: true });
        expect(screen.getByTestId('Athlete|Root')).toBeInTheDocument();
        expect(screen.getByTestId('Athlete|Root')).toHaveTextContent(
          'An Athlete'
        );
      });
    });

    describe('permissions canCreate, canEdit, canArchive', () => {
      it('renders the rehab note content', () => {
        renderFunction({ note: MockRehabMedicalNote });
        const content = screen.getByTestId('NoteCardLayout|Content');
        expect(content).toBeInTheDocument();
        expect(screen.getByTestId('Note|Title')).toHaveTextContent(
          'Test rehab note'
        );
        expect(screen.getByTestId('Note|Tag')).toHaveTextContent('Rehab Note');
        checkForRosterAndVisibilityText();
      });

      it('renders Duplicate button when a rehab note', async () => {
        render(
          wrapRenderWithPermissions({}, null, {
            ...defaultProps,
            note: MockRehabMedicalNote,
          })
        );

        const actionMenu = screen.getByRole('button');
        expect(actionMenu).toBeInTheDocument();
        await userEvent.click(actionMenu);
        const actions = screen.getAllByTestId('TooltipMenu|ListItemButton');
        expect(actions).toHaveLength(3);
        expect(actions[0]).toHaveTextContent('Edit');
        expect(actions[1]).toHaveTextContent('Duplicate');
        expect(actions[2]).toHaveTextContent('Archive');
      });

      it('does not render Edit and Duplicate buttons when a Telephone note', async () => {
        render(
          wrapRenderWithPermissions({}, null, {
            ...defaultProps,
            note: MockTelephoneNote,
          })
        );

        const actionMenu = screen.getByRole('button');
        expect(actionMenu).toBeInTheDocument();
        await userEvent.click(actionMenu);
        const action = screen.getByTestId('TooltipMenu|ListItemButton');
        expect(action).toBeInTheDocument();
        expect(action).toHaveTextContent('Archive');
      });
    });

    describe('permissions.medical.notes.canCreate', () => {
      it('renders the action button with the Duplicate action', async () => {
        render(wrapRenderWithPermissions({}, null, {}, { canEdit: false }));

        const actionMenu = screen.getByRole('button');
        expect(actionMenu).toBeInTheDocument();
        await userEvent.click(actionMenu);
        const firstAction = screen.getAllByTestId(
          'TooltipMenu|ListItemButton'
        )[0];
        expect(firstAction).toBeInTheDocument();
        expect(firstAction).toHaveTextContent('Duplicate');
      });
    });

    describe('permissions.medical.issues.canView', () => {
      it('renders the linked issues', async () => {
        render(
          wrapRenderWithPermissions(
            {
              medical: {
                ...DEFAULT_CONTEXT_VALUE.permissions.medical,
                issues: {
                  canView: true,
                },
              },
            },
            null
          )
        );
        expect(
          screen.getByTestId('PresentationView|LinkedIssues')
        ).toBeInTheDocument();
        const firstIssue = screen.getAllByTestId(
          'PresentationView|LinkedIssues'
        )[0];
        expect(
          within(firstIssue).getAllByRole('listitem')[0]
        ).toHaveTextContent(
          'Jul 05, 2022 - Respiratory tract infection (bacterial or viral) [N/A]'
        );
      });
    });

    describe('medical note history', () => {
      it('renders the history', async () => {
        const noteWithVersions = {
          ...MockMedicalNote,
          versions: [MockMedicalVersions[0]],
        };
        renderFunction({ note: noteWithVersions });
        expect(screen.getByTestId('NoteHistory|root')).toBeInTheDocument();
      });
    });

    describe('archived note metadata display', () => {
      it('renders the archived by', async () => {
        renderFunction({ note: MockArchivedMedicalNote });
        expect(
          screen.getByTestId('MetaData|ArchivedDetails')
        ).toBeInTheDocument();
      });
    });
  });

  describe('the issue is read only', () => {
    it('does not render the actions tooltip, regardless of permissions', async () => {
      render(
        wrapRenderWithPermissions({}, null, {
          hasActions: false,
        })
      );
      expect(() => screen.getByRole('button')).toThrow();
    });
  });

  describe('note-author-field is enabled', () => {
    beforeEach(() => {
      window.featureFlags['note-author-field'] = true;
    });

    afterEach(() => {
      window.featureFlags['note-author-field'] = false;
    });

    it('renders the note author(s)', async () => {
      renderFunction({ hasActions: false });
      const noteDate = formatStandard({
        date: moment(defaultProps.note.created_at),
      });
      const noteAuthor = defaultProps.note.created_by?.fullname;
      const noteForUser = defaultProps?.note?.author?.fullname;

      expect(screen.getByTestId('MetaData|AuthorDetails')).toHaveTextContent(
        `Created ${noteDate} by ${noteAuthor} on behalf of ${noteForUser}`
      );
    });
  });

  describe('confidential-notes is enabled', () => {
    beforeEach(() => {
      window.featureFlags['confidential-notes'] = true;
    });

    afterEach(() => {
      window.featureFlags['confidential-notes'] = false;
    });

    it('renders the lock-icon & assigned viewers for confidential note', async () => {
      const { container } = render(
        wrapRenderWithPermissions(
          {
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              privateNotes: { canCreate: true },
            },
          },
          <PresentationView
            {...defaultProps}
            note={{
              ...MockMedicalNote,
              allow_list: [
                {
                  id: 3702,
                  fullname: 'Marlon Wyman',
                },
                {
                  id: 3717,
                  fullname: 'Colt Wuckert',
                },
              ],
            }}
            hasActions={false}
          />
        )
      );

      expect(container.querySelector('i')).toHaveClass('icon-lock');
      expect(
        screen.getByText('Private - Specific users (2)')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Colt Wuckert, Marlon Wyman')
      ).toBeInTheDocument();
    });

    it('does not render the lock-icon & assigned viewers for confidential note when annotationable_type = Diagnostic', async () => {
      const { container } = render(
        wrapRenderWithPermissions(
          {
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              privateNotes: { canCreate: true },
            },
          },
          <PresentationView
            {...defaultProps}
            note={{
              ...MockDiagnosticNote,
              allow_list: [
                {
                  id: 3702,
                  fullname: 'Marlon Wyman',
                },
                {
                  id: 3717,
                  fullname: 'Colt Wuckert',
                },
              ],
            }}
            hasActions={false}
          />
        )
      );

      expect(container.querySelector('i.icon-lock')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Private - Specific users (2)')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Colt Wuckert, Marlon Wyman')
      ).not.toBeInTheDocument();
    });
  });

  describe('the action buttons for a note', () => {
    beforeEach(() => {
      window.featureFlags['confidential-notes'] = true;
    });

    afterEach(() => {
      window.featureFlags['confidential-notes'] = false;
    });

    it('renders the Edit, Archive & Duplicate buttons when athlete NOT on Trial', async () => {
      render(
        wrapRenderWithPermissions(
          {
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              privateNotes: { canCreate: true },
              notes: {
                canEdit: true,
                canArchive: true,
                canCreate: true,
              },
            },
          },
          <PresentationView
            {...defaultProps}
            hasActions
            note={{
              ...MockMedicalNote,
            }}
          />
        )
      );

      // Menu with 3 dots on each note
      const actionsMenuButton = screen.getByRole('button', (button) =>
        button.className.endsWith('-actionButton')
      );

      // Expand the options within this menu
      await userEvent.click(actionsMenuButton);

      const editButton = screen.getByText('Edit');
      const archiveButton = screen.getByText('Archive');
      const duplicateButton = screen.getByText('Duplicate');

      expect(editButton).toBeInTheDocument();
      expect(archiveButton).toBeInTheDocument();
      expect(duplicateButton).toBeInTheDocument();
    });

    it('[TRACK-EVENT] tracks Click Edit -> Medical Note', async () => {
      render(
        wrapRenderWithPermissions(
          {
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              privateNotes: { canCreate: true },
              notes: {
                canEdit: true,
                canArchive: true,
                canCreate: true,
              },
            },
          },
          <PresentationView
            {...defaultProps}
            hasActions
            note={{
              ...MockMedicalNote,
            }}
          />
        )
      );

      // Menu with 3 dots on each note
      const actionsMenuButton = screen.getByRole('button', (button) =>
        button.className.endsWith('-actionButton')
      );

      // Expand the options within this menu
      await userEvent.click(actionsMenuButton);

      const editButton = screen.getByText('Edit');
      await userEvent.click(editButton);

      expect(mockTrackEvent).toHaveBeenCalledWith(
        performanceMedicineEventNames.clickEditMedicalNote,
        {
          level: 'athlete',
          tab: tabHashes.MEDICAL_NOTES,
          actionElement: 'Note meatball',
        }
      );
    });

    it('[TRACK-EVENT] tracks Click Archive -> Medical Note', async () => {
      render(
        wrapRenderWithPermissions(
          {
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              privateNotes: { canCreate: true },
              notes: {
                canEdit: true,
                canArchive: true,
                canCreate: true,
              },
            },
          },
          <PresentationView
            {...defaultProps}
            hasActions
            note={{
              ...MockMedicalNote,
            }}
          />
        )
      );

      // Menu with 3 dots on each note
      const actionsMenuButton = screen.getByRole('button', (button) =>
        button.className.endsWith('-actionButton')
      );

      // Expand the options within this menu
      await userEvent.click(actionsMenuButton);

      const archiveButton = screen.getByText('Archive');

      await userEvent.click(archiveButton);
      expect(mockTrackEvent).toHaveBeenCalledWith(
        performanceMedicineEventNames.clickArchiveMedicalNote,
        {
          level: 'athlete',
          tab: tabHashes.MEDICAL_NOTES,
          actionElement: 'Note meatball',
        }
      );
    });

    it('[TRACK-EVENT] tracks Click Duplicate -> Medical Note', async () => {
      render(
        wrapRenderWithPermissions(
          {
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              privateNotes: { canCreate: true },
              notes: {
                canEdit: true,
                canArchive: true,
                canCreate: true,
              },
            },
          },
          <PresentationView
            {...defaultProps}
            hasActions
            note={{
              ...MockMedicalNote,
            }}
          />
        )
      );

      // Menu with 3 dots on each note
      const actionsMenuButton = screen.getByRole('button', (button) =>
        button.className.endsWith('-actionButton')
      );

      // Expand the options within this menu
      await userEvent.click(actionsMenuButton);

      const duplicateButton = screen.getByText('Duplicate');

      await userEvent.click(duplicateButton);
      expect(mockTrackEvent).toHaveBeenCalledWith(
        performanceMedicineEventNames.clickDuplicateMedicalNote,
        {
          level: 'athlete',
          tab: tabHashes.MEDICAL_NOTES,
          actionElement: 'Note meatball',
        }
      );
    });

    it('does not render the Edit, Archive & Duplicate buttons when athlete on Trial', async () => {
      render(
        wrapRenderWithPermissions(
          {
            medical: {
              ...DEFAULT_CONTEXT_VALUE.permissions.medical,
              privateNotes: { canCreate: true },
              notes: {
                canEdit: true,
                canArchive: true,
              },
            },
          },
          <PresentationView
            {...onTrialProps}
            hasActions
            note={{
              ...MockMedicalNote,
            }}
          />
        )
      );

      // Menu with 3 dots on each note
      const actionsMenuButton = screen.queryByRole('button', (button) =>
        button.className.endsWith('-actionButton')
      );

      // Expand the options within this menu
      await userEvent.click(actionsMenuButton);

      const editButton = screen.queryByText('Edit');
      const archiveButton = screen.queryByText('Archive');
      const duplicateButton = screen.queryByText('Duplicate');

      expect(editButton).not.toBeInTheDocument();
      expect(archiveButton).not.toBeInTheDocument();
      expect(duplicateButton).not.toBeInTheDocument();
    });
  });
});
