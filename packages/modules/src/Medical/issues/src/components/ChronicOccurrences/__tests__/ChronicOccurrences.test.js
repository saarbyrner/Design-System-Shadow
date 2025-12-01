import $ from 'jquery';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { defaultMedicalPermissions } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { data as mockIssueData } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssue';
import { Provider } from 'react-redux';
import selectEvent from 'react-select-event';
import {
  mockedIssueContextValue,
  MockedIssueContextProvider,
} from '../../../../../shared/contexts/IssueContext/utils/mocks';
import store from '../../../redux/store';
import ChronicOccurrences from '..';

const props = {
  t: i18nextTranslateStub(),
  athleteIssues: [],
  isLoadingIssues: false,
};

const mockIssues = [
  {
    id: 122,
    occurrence_date: '2022-10-18T00:00:00-05:00',
    closed: false,
    full_pathology: 'Test Injury',
    issue_occurrence_title: 'Test Injury',
    issue: null,
    issue_type: 'Injury',
    injury_status: null,
    resolved_date: null,
  },
  {
    id: 107,
    occurrence_date: '2022-10-17T00:00:00-05:00',
    closed: false,
    full_pathology: 'Test Pathology',
    issue_occurrence_title: 'Test Illness',
    issue: null,
    issue_type: 'Illness',
    injury_status: null,
    resolved_date: null,
  },
  {
    id: 123,
    occurrence_date: '2022-10-17T00:00:00-05:00',
    closed: true,
    full_pathology: 'Test Pathology',
    issue_occurrence_title: 'Test Closed Illness',
    issue: null,
    issue_type: 'Illness',
    injury_status: null,
    resolved_date: null,
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
  mockedProps = {},
  mockedIssue = mockIssueData.chronicIssue,
}) => {
  return (
    <Provider store={store}>
      <MockedPermissionContextProvider
        permissionsContext={mockedPermissionsContextValue}
      >
        <MockedIssueContextProvider
          issueContext={{
            ...mockedIssueContextValue,
            issue: {
              ...mockedIssue,
            },
          }}
        >
          <ChronicOccurrences {...props} {...mockedProps} />
        </MockedIssueContextProvider>
      </MockedPermissionContextProvider>
    </Provider>
  );
};

describe('Injury Overview | <ChronicOccurrences />', () => {
  beforeEach(() => {
    const deferred = $.Deferred();

    jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve({ issues: mockIssues }));
  });

  it('should render an empty list with an add button', async () => {
    const wrapper = renderWithContext({});

    const result = render(wrapper);

    expect(result.queryByText('Occurrence History')).toBeInTheDocument();
    expect(result.queryByText('Add occurrence')).toBeInTheDocument();

    expect(
      result.queryByText('Oct 28, 2022 - Reccurrence outside system')
    ).toBeInTheDocument();
    expect(
      result
        .queryByText('Oct 28, 2022 - Reccurrence outside system')
        .closest('a')
    ).toHaveAttribute(
      'href',
      `/medical/athletes/${mockIssueData.chronicIssue.athlete_id}/injuries/122`
    );
    expect(
      result.queryByText('Oct 28, 2022 - Reccurrence in system')
    ).toBeInTheDocument();
    expect(
      result.queryByText('Oct 28, 2022 - Reccurrence in system').closest('a')
    ).toHaveAttribute(
      'href',
      `/medical/athletes/${mockIssueData.chronicIssue.athlete_id}/injuries/123`
    );
    expect(
      result.queryByText('Oct 17, 2022 - Preliminary')
    ).toBeInTheDocument();
    expect(
      result.queryByText('Oct 17, 2022 - Preliminary').closest('a')
    ).toHaveAttribute(
      'href',
      `/medical/athletes/${mockIssueData.chronicIssue.athlete_id}/injuries/107`
    );
  });

  it('renders a select dropdown of issues when clicking add, excluding the global issue', async () => {
    const wrapper = renderWithContext({
      mockedProps: {
        athleteIssues: [
          ...mockIssues,
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
    });

    const result = render(wrapper);

    await userEvent.click(screen.getByText('Add occurrence'));

    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Discard changes')).toBeInTheDocument();

    const selectContainer = result.getByTestId(
      'ChronicOccurrences|UpdateChronicOccurrences'
    );

    selectEvent.openMenu(
      selectContainer.querySelector('.kitmanReactSelect input')
    );

    expect(screen.getByTitle('Oct 18, 2022 - Test Injury')).toBeInTheDocument();
    expect(
      screen.getByTitle('Oct 17, 2022 - Test Illness')
    ).toBeInTheDocument();
    expect(
      screen.getByTitle('Oct 17, 2022 - Test Closed Illness')
    ).toBeInTheDocument();
    // Excludes the current issue from selection
    expect(
      screen.queryByText('Jan 13, 2022 - Current issue')
    ).not.toBeInTheDocument();
  });
});
