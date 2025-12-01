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
import HeaderTitle from '@kitman/modules/src/Medical/issues/src/components/IssueHeader/HeaderTitle';

describe('<HeaderTitle />', () => {
  const defaultProps = {
    t: i18nextTranslateStub(),
    onEnterEditMode: jest.fn(),
    editActionDisabled: false,
    onDiscardChanges: jest.fn(),
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

  const renderTestComponent = ({
    permissions = defaultPermissions,
    issueContext = defaultIssueContext,
    props = defaultProps,
  } = {}) => {
    return renderWithProvider(
      <MockedPermissionContextProvider
        permissionsContext={{ ...DEFAULT_CONTEXT_VALUE, ...permissions }}
      >
        <MockedIssueContextProvider
          issueContext={{ ...defaultIssueContext, ...issueContext }}
        >
          <HeaderTitle {...{ ...defaultProps, ...props }} />
        </MockedIssueContextProvider>
      </MockedPermissionContextProvider>,
      storeFake({
        medicalApi: {},
      })
    );
  };

  describe('[permissions] permissions.medical.issues.canEdit', () => {
    it('renders the correct title when the issue type is Injury', () => {
      renderTestComponent({
        issueContext: {
          issueType: 'Injury',
        },
      });

      expect(
        screen.getByRole('heading', { name: 'Injury details', level: 2 })
      ).toBeInTheDocument();
    });
    it('renders the correct title when the issue type is Illness', () => {
      renderTestComponent({
        issueContext: {
          issueType: 'Illness',
        },
      });

      expect(
        screen.getByRole('heading', { name: 'Illness details', level: 2 })
      ).toBeInTheDocument();
    });

    it('renders the correct action when view type is PRESENTATION', () => {
      renderTestComponent({
        props: {
          viewType: 'PRESENTATION',
        },
      });

      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    it('disables the edit button when editActionDisabled = TRUE', () => {
      renderTestComponent({
        props: {
          viewType: 'PRESENTATION',
          editActionDisabled: true
        },
      });

      expect(screen.getByRole('button', { name: 'Edit' })).toBeDisabled();
    });

    it('does not disable the edit button when editActionDisabled = FALSE', () => {
      renderTestComponent({
        props: {
          viewType: 'PRESENTATION',
          editActionDisabled: false
        },
      });
      expect(screen.getByRole('button', { name: 'Edit' })).toBeEnabled();
    });

    it('renders the correct action when view type is EDIT', () => {
      renderTestComponent({
        props: {
          viewType: 'EDIT',
        },
      });

      expect(
        screen.getByRole('button', { name: 'Discard changes' })
      ).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });
  });

  it('disables the buttons when a request is pending', () => {
    renderTestComponent({
      props: {
        isRequestPending: true,
      },
    });

    expect(
      screen.getByRole('button', { name: 'Discard changes' })
    ).toBeDisabled();

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });
  it('hides the edit button when permissions.medical.issues.canEdit = false', async () => {
    renderTestComponent({
      permission: {
        permissions: {
          medical: {
            ...DEFAULT_CONTEXT_VALUE.permissions.medical,
            issues: {
              canEdit: false,
            },
          },
        },
      },
    });

    expect(
      screen.queryByRole('button', { name: 'Edit' })
    ).not.toBeInTheDocument();
  });

  describe('when the issue is read only', () => {
    it('hides the edit button the issue isReadOnly, regardless of permissions', async () => {
      renderTestComponent({
        issueContext: {
          isReadOnly: true,
        },
      });

      expect(
        screen.queryByRole('button', { name: 'Edit' })
      ).not.toBeInTheDocument();
    });
  });

  describe('when the issue is new', () => {
    it('does render the Edit button', () => {
      renderTestComponent({
        issueContext: {
          issue: {
            ...mockedIssueContextValue.issue,
            occurrence_type: 'new',
          },
        },
        props: { viewType: 'PRESENTATION' },
      });

      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });
  });

  describe('when the issue is recurrence', () => {
    it('does not render the Edit button', () => {
      renderTestComponent({
        issueContext: {
          issue: {
            ...mockedIssueContextValue.issue,
            occurrence_type: 'recurrence',
          },
        },
      });

      expect(
        screen.queryByRole('button', { name: 'Edit' })
      ).not.toBeInTheDocument();
    });
  });
});
