import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PermissionsContext, {
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';
import {
  mockedIssueContextValue,
  MockedIssueContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/IssueContext/utils/mocks';

import IssueDetails from '@kitman/modules/src/Medical/issues/src/components/IssueDetails';

jest.mock('@kitman/common/src/hooks/useEventTracking', () => ({
  __esModule: true,
  default: () => ({ trackEvent: jest.fn() }),
}));

jest.mock('@kitman/services', () => ({
  getSides: jest.fn(() =>
    Promise.resolve([
      { id: 1, name: 'Left' },
      { id: 2, name: 'Right' },
    ])
  ),
  getIllnessOnset: jest.fn(() => Promise.resolve([{ id: 1, name: 'Acute' }])),
  getInjuryOnset: jest.fn(() => Promise.resolve([{ id: 1, name: 'Overuse' }])),
  getInjuryOsicsBodyAreas: jest.fn(() => Promise.resolve([])),
  getInjuryOsicsClassifications: jest.fn(() => Promise.resolve([])),
  getInjuryOsicsPathologies: jest.fn(() => Promise.resolve([])),
  getIllnessOsicsBodyAreas: jest.fn(() => Promise.resolve([])),
  getIllnessOsicsClassifications: jest.fn(() => Promise.resolve([])),
  getIllnessOsicsPathologies: jest.fn(() => Promise.resolve([])),
  getGrades: jest.fn(() => Promise.resolve([])),
  getOsicsInfo: jest.fn(() =>
    Promise.resolve({
      id: 'RFUM',
      osics_classification_id: 8,
      osics_body_area_id: 4,
    })
  ),
  saveIssue: jest.fn(() => Promise.resolve(mockedIssueContextValue.issue)),
}));

describe('<IssueDetails />', () => {
  beforeEach(() => {
    window.featureFlags = { 'examination-date': true };
  });

  afterEach(() => {
    window.featureFlags = {};
  });

  test('renders the presentation view initially', () => {
    render(
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
        <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
          <IssueDetails onEnterEditMode={jest.fn()} />
        </MockedIssueContextProvider>
      </PermissionsContext.Provider>
    );

    expect(screen.getByText('Primary Pathology')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  test('renders the edit view after clicking Edit', async () => {
    const user = userEvent.setup();

    render(
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
        <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
          <IssueDetails onEnterEditMode={jest.fn()} />
        </MockedIssueContextProvider>
      </PermissionsContext.Provider>
    );

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    expect(
      await screen.findByRole('button', { name: 'Save' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Discard changes' })
    ).toBeInTheDocument();
  });
});
