import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import PermissionsContext, {
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';
import Header from '@kitman/modules/src/Medical/issues/src/components/AdditionalInformation/Header';
import {
  mockedIssueContextValue,
  MockedIssueContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/IssueContext/utils/mocks';

describe('<Header />', () => {
  const props = {
    t: i18nextTranslateStub(),
  };

  test('renders the correct title', () => {
    render(<Header {...props} />, {
      wrapper: ({ children }) => (
        <PermissionsContext.Provider
          value={{
            permissions: {
              medical: {
                ...DEFAULT_CONTEXT_VALUE.permissions.medical,
                issues: { canEdit: true },
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          }}
        >
          {children}
        </PermissionsContext.Provider>
      ),
    });
    expect(screen.getByText('Additional information')).toBeInTheDocument();
  });

  test('renders the correct action when view type is PRESENTATION', () => {
    render(<Header {...props} viewType="PRESENTATION" />, {
      wrapper: ({ children }) => (
        <PermissionsContext.Provider
          value={{
            permissions: {
              medical: {
                ...DEFAULT_CONTEXT_VALUE.permissions.medical,
                issues: { canEdit: true },
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          }}
        >
          {children}
        </PermissionsContext.Provider>
      ),
    });
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  test('renders the correct actions when view type is EDIT', () => {
    render(<Header {...props} viewType="EDIT" />, {
      wrapper: ({ children }) => (
        <PermissionsContext.Provider
          value={{
            permissions: {
              medical: {
                ...DEFAULT_CONTEXT_VALUE.permissions.medical,
                issues: { canEdit: true },
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          }}
        >
          {children}
        </PermissionsContext.Provider>
      ),
    });
    expect(
      screen.getByRole('button', { name: 'Discard changes' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  test('disables the buttons when a request is pending', () => {
    render(<Header {...props} isRequestPending viewType="EDIT" />, {
      wrapper: ({ children }) => (
        <PermissionsContext.Provider
          value={{
            permissions: {
              medical: {
                ...DEFAULT_CONTEXT_VALUE.permissions.medical,
                issues: { canEdit: true },
              },
            },
            permissionsRequestStatus: 'FAILURE',
          }}
        >
          {children}
        </PermissionsContext.Provider>
      ),
    });
    expect(
      screen.getByRole('button', { name: 'Discard changes' })
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  test('hides the edit button when permissions.medical.issues.canEdit is false', () => {
    render(<Header {...props} />, {
      wrapper: ({ children }) => (
        <PermissionsContext.Provider
          value={{
            permissions: {
              medical: {
                ...DEFAULT_CONTEXT_VALUE.permissions.medical,
                issues: { canEdit: false },
              },
            },
            permissionsRequestStatus: 'SUCCESS',
          }}
        >
          {children}
        </PermissionsContext.Provider>
      ),
    });
    expect(
      screen.queryByRole('button', { name: 'Edit' })
    ).not.toBeInTheDocument();
  });

  test('hides the edit button when the issue is read only regardless of permissions', () => {
    render(
      <MockedIssueContextProvider
        issueContext={{
          ...mockedIssueContextValue,
          isReadOnly: true,
        }}
      >
        <Header {...props} viewType="PRESENTATION" isRequestPending />
      </MockedIssueContextProvider>
    );
    expect(
      screen.queryByRole('button', { name: 'Edit' })
    ).not.toBeInTheDocument();
  });
});
