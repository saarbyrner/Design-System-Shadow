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
import LinkedIssues from '..';

const props = {
  t: i18nextTranslateStub(),
  allAthleteIssues: { open_issues: [], closed_issues: [] },
  isLoadingIssues: false,
};

const mockIssues = {
  open_issues: [
    {
      id: 1,
      occurrence_date: '2022-10-18T00:00:00-05:00',
      closed: false,
      full_pathology: 'Test Injury',
      issue_occurrence_title: 'Test INjury',
      issue: null,
      issue_type: 'Injury',
      injury_status: null,
      resolved_date: null,
    },
    {
      id: 123,
      occurrence_date: '2022-10-17T00:00:00-05:00',
      closed: false,
      full_pathology: 'Test Pathology',
      issue_occurrence_title: 'Test Closed Illness',
      issue: null,
      issue_type: 'Illness',
      injury_status: null,
      resolved_date: null,
    },
    {
      id: mockedIssueContextValue.issue.id,
      occurrence_date: mockedIssueContextValue.issue.occurrence_date,
      closed: false,
      full_pathology: 'Current issue',
      issue_occurrence_title: 'Current issue',
      issue: null,
      injury_status: null,
      resolved_date: null,
    },
  ],
  closed_issues: [
    {
      id: 12,
      occurrence_date: '2022-10-17T00:00:00-05:00',
      closed: true,
      full_pathology: 'Test Pathology',
      issue_occurrence_title: 'Test Illness',
      issue: null,
      issue_type: 'Illness',
      injury_status: null,
      resolved_date: null,
    },
  ],
};

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
  linkedIssues = [],
  mockedProps = {},
  mockedIssue = mockedIssueContextValue.issue,
  issueIsReadOnly = false,
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
            linked_issues: linkedIssues,
          },
          isReadOnly: issueIsReadOnly,
        }}
      >
        <LinkedIssues {...props} {...mockedProps} />
      </MockedIssueContextProvider>
    </MockedPermissionContextProvider>
  );
};

describe('Injury Overview | <LinkedIssues />', () => {
  it('should render an empty list with an add button', async () => {
    const wrapper = renderWithContext({});

    const result = render(wrapper);

    expect(result.queryByText('Associated issues')).toBeInTheDocument();
    expect(result.queryByRole('button', { text: 'Add' })).toBeInTheDocument();
  });

  it('should render a list of links for each linked issue', () => {
    const wrapper = renderWithContext({
      linkedIssues: [...mockIssues.open_issues, ...mockIssues.closed_issues],
    });

    const result = render(wrapper);

    expect(result.queryByText('Associated issues')).toBeInTheDocument();

    expect(
      result.queryByText('Oct 18, 2022 - Test INjury')
    ).toBeInTheDocument();
    expect(
      result.queryByText('Oct 18, 2022 - Test INjury').closest('a')
    ).toHaveAttribute(
      'href',
      `/medical/athletes/${mockedIssueContextValue.issue.athlete_id}/injuries/1`
    );
    expect(
      result.queryByText('Oct 17, 2022 - Test Illness')
    ).toBeInTheDocument();
    expect(
      result.queryByText('Oct 17, 2022 - Test Illness').closest('a')
    ).toHaveAttribute(
      'href',
      `/medical/athletes/${mockedIssueContextValue.issue.athlete_id}/illnesses/12`
    );
    expect(
      result.queryByText('Oct 17, 2022 - Test Closed Illness')
    ).toBeInTheDocument();
    expect(
      result.queryByText('Oct 17, 2022 - Test Closed Illness').closest('a')
    ).toHaveAttribute(
      'href',
      `/medical/athletes/${mockedIssueContextValue.issue.athlete_id}/illnesses/123`
    );
  });

  it('renders a select dropdown of issues when clicking add', async () => {
    const wrapper = renderWithContext({
      mockedProps: {
        allAthleteIssues: mockIssues,
      },
    });

    const result = render(wrapper);

    await userEvent.click(screen.getByText('Add'));

    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Discard changes')).toBeInTheDocument();

    const selectContainer = result.getByTestId(
      'LinkedIssues|UpdateLinkedIssues'
    );

    selectEvent.openMenu(
      selectContainer.querySelector('.kitmanReactSelect input')
    );
    expect(screen.getByText('Oct 18, 2022 - Test INjury')).toBeInTheDocument();
    expect(screen.getByText('Oct 17, 2022 - Test Illness')).toBeInTheDocument();
    expect(
      screen.getByText('Oct 17, 2022 - Test Closed Illness')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Jan 13, 2022 - Current issue')
    ).toBeInTheDocument();
  });

  it('does not render the actions button when the current org when the issue is readOnly', async () => {
    renderWithContext({
      mockedProps: {
        allAthleteIssues: [
          ...mockIssues.open_issues,
          {
            id: mockedIssueContextValue.issue.id,
            occurrence_date: mockedIssueContextValue.issue.occurrence_date,
            closed: false,
            full_pathology: 'Current issue',
            issue_occurrence_title: 'Current issue',
            issue: null,
            injury_status: null,
            resolved_date: null,
          },
        ],
      },
      issueIsReadOnly: true,
    });

    expect(() => screen.getByText('Add')).toThrow();
  });
  it('should render without error when linkedIssue is null and return the list of links for each linked issue', () => {
    const wrapper = renderWithContext({
      linkedIssues: [
        ...mockIssues.open_issues,
        null,
        ...mockIssues.closed_issues,
      ],
    });

    const result = render(wrapper);

    expect(result.queryByText('Associated issues')).toBeInTheDocument();

    expect(
      result.queryByText('Oct 18, 2022 - Test INjury')
    ).toBeInTheDocument();
    expect(
      result.queryByText('Oct 18, 2022 - Test INjury').closest('a')
    ).toHaveAttribute(
      'href',
      `/medical/athletes/${mockedIssueContextValue.issue.athlete_id}/injuries/1`
    );
    expect(
      result.queryByText('Oct 17, 2022 - Test Illness')
    ).toBeInTheDocument();
    expect(
      result.queryByText('Oct 17, 2022 - Test Illness').closest('a')
    ).toHaveAttribute(
      'href',
      `/medical/athletes/${mockedIssueContextValue.issue.athlete_id}/illnesses/12`
    );
    expect(
      result.queryByText('Oct 17, 2022 - Test Closed Illness')
    ).toBeInTheDocument();
    expect(
      result.queryByText('Oct 17, 2022 - Test Closed Illness').closest('a')
    ).toHaveAttribute(
      'href',
      `/medical/athletes/${mockedIssueContextValue.issue.athlete_id}/illnesses/123`
    );
  });
});
