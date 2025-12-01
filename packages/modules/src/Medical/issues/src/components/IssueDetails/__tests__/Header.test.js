import { screen } from '@testing-library/react';
import {
  storeFake,
  renderWithProvider,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { defaultMedicalPermissions } from '@kitman/common/src/contexts/PermissionsContext/medical';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import {
  mockedIssueContextValue,
  MockedIssueContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/IssueContext/utils/mocks';
import { data as mockIssueData } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssue';
import Header from '../Header';

describe('<Header />', () => {
  const defaultProps = {
    t: i18nextTranslateStub(),
    editActionDisabled: false
  };

  const defaultPermissions = {
    permissions: {
      medical: {
        defaultMedicalPermissions,
        issues: {
          canEdit: true,
        },
      },
    },
    permissionsRequestStatus: 'SUCCESS',
  };

  const defaultIssueContext = {
    ...mockedIssueContextValue,
  };

  const renderTestComponent = (
    permissions = defaultPermissions,
    issueContext = defaultIssueContext,
    props
  ) => {
    return renderWithProvider(
      <MockedPermissionContextProvider
        permissionsContext={{ ...DEFAULT_CONTEXT_VALUE, ...permissions }}
      >
        <MockedIssueContextProvider
          issueContext={{ ...defaultIssueContext, ...issueContext }}
        >
          <Header {...{ ...defaultProps, ...props }} />
        </MockedIssueContextProvider>
      </MockedPermissionContextProvider>,
      storeFake({
        medicalApi: {},
      })
    );
  };

  describe('[permissions] permissions.medical.issues.canEdit', () => {
    it('renders the correct heading', () => {
      renderTestComponent(undefined, {
        issueType: 'Illness',
      });

      expect(screen.getByText('Primary Pathology')).toBeInTheDocument();
    });

    it('renders the correct action when view type is PRESENTATION', () => {
      renderTestComponent(undefined, undefined, {
        viewType: 'PRESENTATION',
      });

      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    it('renders the correct action when view type is EDIT', () => {
      renderTestComponent(undefined, undefined, {
        viewType: 'EDIT',
      });

      expect(
        screen.getByRole('button', { name: 'Discard changes' })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    
  });

  it('disables the buttons when a request is pending', () => {
    renderTestComponent(undefined, undefined, {
      isRequestPending: true,
    });

    expect(
      screen.getByRole('button', { name: 'Discard changes' })
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });
  it('hides the edit button when permissions.medical.issues.canEdit is false', async () => {
    renderTestComponent(
      {
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            issues: {
              canEdit: false,
            },
          },
        },
      },
      undefined
    );

    expect(
      screen.queryByRole('button', { name: 'Edit' })
    ).not.toBeInTheDocument();
  });

  describe('when the issue is read only', () => {
    it('hides the edit button the issue isReadOnly, regardless of permissions', async () => {
      renderTestComponent(undefined, {
        isReadOnly: true,
      });

      expect(
        screen.queryByRole('button', { name: 'Edit' })
      ).not.toBeInTheDocument();
    });
  });

  describe('[editable-chronic-conditions] feature flag', () => {
    describe('when feature flag is off', () => {
      it('hides the edit button when view type is PRESENTATION', async () => {
        renderTestComponent(
          undefined,
          {
            issue: {
              ...mockIssueData.chronicIssue,
            },
            isChronicIssue: true,
          },
          { viewType: 'PRESENTATION' }
        );

        expect(
          screen.queryByRole('button', { name: 'Edit' })
        ).not.toBeInTheDocument();
      });
      it('hides the edit button when view type is EDIT', async () => {
        renderTestComponent(
          undefined,
          {
            issue: {
              ...mockIssueData.chronicIssue,
            },
            isChronicIssue: true,
          },
          { viewType: 'EDIT' }
        );

        expect(
          screen.queryByRole('button', { name: 'Discard changes' })
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole('button', { name: 'Save' })
        ).not.toBeInTheDocument();
      });
    });
    describe('when feature flag is on', () => {
      beforeEach(() => {
        window.featureFlags['editable-chronic-conditions'] = true;
      });
      afterEach(() => {
        window.featureFlags['editable-chronic-conditions'] = false;
      });

      it('shows the edit button when view type is PRESENTATION', async () => {
        renderTestComponent(
          undefined,
          {
            issue: {
              ...mockIssueData.chronicIssue,
            },
            isChronicIssue: true,
          },
          { viewType: 'PRESENTATION' }
        );

        expect(
          screen.getByRole('button', { name: 'Edit' })
        ).toBeInTheDocument();
      });
   
      it('disables the edit button when editActionDisabled = TRUE', async () => {
        renderTestComponent(
          undefined,
          {
            issue: {
              ...mockIssueData.chronicIssue,
            },
            isChronicIssue: true
          },
          { viewType: 'PRESENTATION', editActionDisabled: true }
        );

        expect(
          screen.getByRole('button', { name: 'Edit' })
        ).toBeDisabled()
      });

      it('does not disable the edit button when editActionDisabled = FALSE', async () => {
        renderTestComponent(
          undefined,
          {
            issue: {
              ...mockIssueData.chronicIssue,
            },
            isChronicIssue: true
          },
          { viewType: 'PRESENTATION', editActionDisabled: false }
        );

        expect(
          screen.getByRole('button', { name: 'Edit' })
        ).toBeEnabled()
      });

      it('shows the save button when view type is EDIT', async () => {
        renderTestComponent(
          undefined,
          {
            issue: {
              ...mockIssueData.chronicIssue,
            },
            isChronicIssue: true,
          },
          { viewType: 'EDIT' }
        );

        expect(
          screen.getByRole('button', { name: 'Discard changes' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Save' })
        ).toBeInTheDocument();
      });
    });
  });
});
