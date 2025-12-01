import { render, screen } from '@testing-library/react';
import selectEvent from 'react-select-event';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { defaultMedicalPermissions } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import {
  mockedIssueContextValue,
  MockedIssueContextProvider,
} from '../../../../../shared/contexts/IssueContext/utils/mocks';
import LinkedChronicIssues from '..';

const props = {
  t: i18nextTranslateStub(),

  athleteIssues: [],
  isLoadingIssues: false,
};

const mockChronicIssues = [
  {
    id: 1,
    pathology: 'Chronic Issue 1',
    title: null,
    full_pathology: 'Chronic Issue 1 Full Pathology',
    reported_date: '2022-11-23T00:00:00+00:00',
    status: null,
  },
  {
    id: 2,
    pathology: 'Chronic Issue 2',
    title: null,
    full_pathology: 'Chronic Issue 2 Full Pathology',
    reported_date: '2022-11-23T00:00:00+00:00',
    status: null,
  },
  {
    id: 3,
    full_pathology: 'Chronic Issue 3 Full Pathology',
    reported_date: '2022-11-23T00:00:00+00:00',
    status: null,
    pathology: 'Chronic Issue 3',
    title: null,
  },
];

const mockLinkedChronicIssues = [
  {
    chronic_issue: {
      id: 1,
      pathology: 'Chronic Issue 1',
      title: null,
    },
  },
  {
    chronic_issue: {
      id: 2,
      pathology: 'Chronic Issue 2',
      title: null,
    },
  },
  {
    chronic_issue: {
      id: 3,
      pathology: 'Chronic Issue 3',
      title: null,
    },
  },
];

const mockedPermissionsContextValue = {
  permissions: {
    medical: {
      ...defaultMedicalPermissions,
      issues: {
        canEdit: true,
      },
    },
  },
  permissionsRequestStatus: 'SUCCESS',
};

const renderWithContext = ({
  mockedProps = {
    chronicIssues: mockChronicIssues,
    athleteId: mockedIssueContextValue.issue.athlete_id,
  },
  mockedIssue = mockedIssueContextValue.issue,
}) => {
  return (
    <MockedPermissionContextProvider
      permissionsContext={mockedPermissionsContextValue}
    >
      <MockedIssueContextProvider
        issueContext={{
          ...mockedIssueContextValue,
          issue: {
            ...mockedIssue,
            linked_chronic_issues: mockLinkedChronicIssues,
          },
        }}
      >
        <LinkedChronicIssues {...props} {...mockedProps} />
      </MockedIssueContextProvider>
    </MockedPermissionContextProvider>
  );
};

describe('Injury Overview | <LinkedChronicIssues />', () => {
  it('should render an empty list with correct title and an add button', async () => {
    const wrapper = renderWithContext({});

    const result = render(wrapper);

    expect(result.queryByText('Linked Chronic condition')).toBeInTheDocument();
    expect(result.queryByRole('button', { text: 'Add' })).toBeInTheDocument();
  });

  it('should render a list of links for each chronic issues', () => {
    const wrapper = renderWithContext({
      linkedChronicIssues: mockLinkedChronicIssues,
    });

    const result = render(wrapper);

    expect(
      result.queryByText('Nov 23, 2022 - Chronic Issue 1 Full Pathology')
    ).toBeInTheDocument();
    expect(
      result
        .queryByText('Nov 23, 2022 - Chronic Issue 1 Full Pathology')
        .closest('a')
    ).toHaveAttribute(
      'href',
      `/medical/athletes/${mockedIssueContextValue.issue.athlete_id}/chronic_issues/1`
    );

    expect(
      result.queryByText('Nov 23, 2022 - Chronic Issue 2 Full Pathology')
    ).toBeInTheDocument();
    expect(
      result
        .queryByText('Nov 23, 2022 - Chronic Issue 2 Full Pathology')
        .closest('a')
    ).toHaveAttribute(
      'href',
      `/medical/athletes/${mockedIssueContextValue.issue.athlete_id}/chronic_issues/2`
    );

    expect(
      result.queryByText('Nov 23, 2022 - Chronic Issue 3 Full Pathology')
    ).toBeInTheDocument();
    expect(
      result
        .queryByText('Nov 23, 2022 - Chronic Issue 3 Full Pathology')
        .closest('a')
    ).toHaveAttribute(
      'href',
      `/medical/athletes/${mockedIssueContextValue.issue.athlete_id}/chronic_issues/3`
    );
  });

  it('renders a select dropdown of issues when clicking add, excluding the global issue', async () => {
    const user = userEvent.setup();
    const wrapper = renderWithContext({
      mockedProps: {
        chronicIssues: mockChronicIssues,
      },
    });

    const result = render(wrapper);

    await user.click(screen.getByText('Edit'));

    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Discard changes')).toBeInTheDocument();

    const selectContainer = result.getByTestId(
      'LinkedChronicIssues|UpdateLinkedChronicIssues'
    );

    selectEvent.openMenu(
      selectContainer.querySelector('.kitmanReactSelect input')
    );
    expect(
      screen.getByText('Nov 23, 2022 - Chronic Issue 1 Full Pathology')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Nov 23, 2022 - Chronic Issue 2 Full Pathology')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Nov 23, 2022 - Chronic Issue 3 Full Pathology')
    ).toBeInTheDocument();
  });

  describe('when the issue is read only', () => {
    it('does not render the add button', () => {
      const wrapper = renderWithContext({
        linkedChronicIssues: mockLinkedChronicIssues,
        mockedIssue: {
          ...mockedIssueContextValue.issue,
          isReadOnly: true,
        },
      });

      render(wrapper);
      expect(() => screen.getByText('Add')).toThrow();
    });
  });

  it('renders a SnackBar with a message when a chronic issue is linked', async () => {
    const user = userEvent.setup();
    const wrapper = renderWithContext({
      mockedProps: {
        chronicIssues: mockChronicIssues,
      },
    });

    const result = render(wrapper);

    await user.click(screen.getByText('Edit'));

    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Discard changes')).toBeInTheDocument();

    const selectContainer = result.getByTestId(
      'LinkedChronicIssues|UpdateLinkedChronicIssues'
    );

    // Open dropdown with chronic issue
    selectEvent.openMenu(
      selectContainer.querySelector('.kitmanReactSelect input')
    );

    // select first one
    await user.click(
      screen.getByText('Nov 23, 2022 - Chronic Issue 1 Full Pathology')
    );

    // the SnackBar should not be rendered yet
    expect(
      screen.queryByText('Chronic condition linked')
    ).not.toBeInTheDocument();

    // send request to link the issue
    await user.click(screen.getByText('Save'));

    // now the snackbar should render
    expect(screen.getByText('Chronic condition linked')).toBeInTheDocument();
  });
});
