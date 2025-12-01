import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import {
  defaultMedicalPermissions,
  mockedDefaultPermissionsContextValue,
} from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { ModificationNoteCardTranslated as ModificationNoteCard } from '../ModificationNoteCard';

describe('<ModificationNoteCard/>', () => {
  beforeEach(() => {
    i18nextTranslateStub();
  });

  const props = {
    isLoading: false,
    withAvatar: false,
    hasActions: false,
    deactivateModification: () => ({}),
    modification: {
      id: 1,
      organisation_annotation_type: {
        id: 1,
        name: 'Medical note',
        type: 'OrganisationAnnotationTypes::Medical',
      },
      annotationable_type: 'Athlete',
      annotationable: {
        id: 1,
        fullname: 'An Athlete',
        avatar_url: 'img/url',
        availability: 'unavailable',
        athlete_squads: [
          {
            id: 1,
            name: 'Squad',
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
          occurrence_date: '2022-07-05T00:00:00+00:00',
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
      squad: {
        id: 1,
        name: 'Squad',
      },
    },
    t: () => {},
  };

  describe('default permissions', () => {
    it('renders the correct content with default permissions', () => {
      render(<ModificationNoteCard {...props} />);
      expect(screen.getByTestId('NoteCardLayout|Content')).toBeInTheDocument();
      expect(screen.getByTestId('MetaData|AuthorDetails')).toBeInTheDocument();
      expect(screen.getByTestId('MetaData|AuthorDetails')).toHaveTextContent(
        'Created Jul 15, 2022 by A Staff'
      );
      expect(screen.getByTestId('Attachments|Attachments')).toBeInTheDocument();
      expect(screen.getByTestId('Note|Title')).toHaveTextContent('1');
      expect(screen.getByTestId('Note|Tag')).toHaveTextContent('Medical note');
    });

    it('renders the avatar when withAvatar is true', () => {
      render(<ModificationNoteCard {...props} withAvatar />);
      expect(screen.getByTestId('Athlete|Root')).toBeInTheDocument();
      expect(screen.getByTestId('Athlete|Root')).toHaveTextContent(
        'An Athlete'
      );
    });
  });

  describe('[permissions] permissions.medical.issues.canView', () => {
    it('renders the linked issues when true', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                issues: {
                  canView: true,
                },
              },
            },
          }}
        >
          <ModificationNoteCard {...props} hasActions />
        </MockedPermissionContextProvider>
      );
      expect(
        screen.getByTestId('ModificationNoteCard|LinkedIssues')
      ).toBeInTheDocument();
      const firstIssue = screen.getAllByTestId(
        'ModificationNoteCard|LinkedIssues'
      )[0];
      expect(within(firstIssue).getByRole('listitem')).toHaveTextContent(
        'Jul 05, 2022 - Respiratory tract infection (bacterial or viral) [N/A]'
      );
    });
  });

  describe('[permissions] permissions.medical.modifications.canEdit', () => {
    it('renders the correct actions', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                modifications: {
                  canEdit: true,
                },
              },
            },
          }}
        >
          <ModificationNoteCard {...props} hasActions />
        </MockedPermissionContextProvider>
      );

      const actionMenu = screen.getByRole('button');
      expect(actionMenu).toBeInTheDocument();
      await userEvent.click(actionMenu);

      const deactivateAction = screen.getAllByTestId(
        'TooltipMenu|ListItemButton'
      )[0];
      expect(deactivateAction).toBeInTheDocument();
      expect(deactivateAction).toHaveTextContent('Deactivate');
    });
  });
});
