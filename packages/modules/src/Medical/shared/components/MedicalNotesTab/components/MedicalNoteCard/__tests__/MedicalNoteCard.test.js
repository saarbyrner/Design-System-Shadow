import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import {
  defaultMedicalPermissions,
  mockedDefaultPermissionsContextValue,
} from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { MedicalNoteCardTranslated as MedicalNoteCard } from '..';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

describe('<MedicalNoteCardContainer/>', () => {
  let store;
  const dispatchSpy = sinon.spy();

  beforeEach(() => {
    i18nextTranslateStub();
    store = storeFake({
      medicalApi: {},
      medicalHistory: {},
    });
    store.dispatch = dispatchSpy;
  });

  const props = {
    athleteId: null,
    note: {
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
          occurrence_date: 'Jul  5, 2022',
          full_pathology:
            'Respiratory tract infection (bacterial or viral) [N/A]',
        },
      ],
      chronic_issues: [
        {
          id: 123,
          occurrence_date: '2022-07-06T00:00:00+00:00',
          full_pathology: 'Chronic issue',
        },
      ],
      injury_occurrences: [],
      author: {
        id: 1,
        fullname: 'A Staff',
      },
      squad: {
        id: 1,
        name: 'Squad',
      },
      expired: false,
      organisation_id: 1111,
    },
    hasActions: true,
    t: () => {},
  };

  describe('rendering content', () => {
    it('renders PRESENTATION view by default', () => {
      render(
        <Provider store={store}>
          <MedicalNoteCard {...props} />
        </Provider>
      );
      expect(screen.getByTestId('NoteCardLayout|Content')).toBeInTheDocument();
    });
  });

  describe('[permissions] permissions.medical.note.canEdit', () => {
    it('renders the actions buttons', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                notes: {
                  canEdit: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <MedicalNoteCard {...props} />
          </Provider>
        </MockedPermissionContextProvider>
      );
      const actionMenu = screen.getByRole('button');
      expect(actionMenu).toBeInTheDocument();
    });

    it('renders EDIT view when toggled', async () => {
      render(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              medical: {
                ...defaultMedicalPermissions,
                notes: {
                  canEdit: true,
                },
              },
            },
          }}
        >
          <Provider store={store}>
            <MedicalNoteCard {...props} />
          </Provider>
        </MockedPermissionContextProvider>
      );
      const actionMenu = screen.getByRole('button');
      await userEvent.click(actionMenu);
      const editAction = screen.getAllByTestId('TooltipMenu|ListItemButton')[0];
      await userEvent.click(editAction);
      expect(screen.getByTestId('NoteCardLayout|Content')).toBeInTheDocument();
    });
  });

  describe('external organisation created the note', () => {
    it('does not render the actions buttons', async () => {
      render(
        <MockedOrganisationContextProvider
          organisationContext={{
            organisation: { id: 999 },
          }}
        >
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedDefaultPermissionsContextValue,
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...defaultMedicalPermissions,
                  notes: {
                    canEdit: true,
                  },
                },
              },
            }}
          >
            <Provider store={store}>
              <MedicalNoteCard {...props} hasActions={false} />
            </Provider>
          </MockedPermissionContextProvider>
        </MockedOrganisationContextProvider>
      );
      expect(() => screen.getByRole('button')).toThrow();
    });
  });
});
