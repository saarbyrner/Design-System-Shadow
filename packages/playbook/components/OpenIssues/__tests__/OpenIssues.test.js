import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import {
  i18nextTranslateStub,
  storeFake,
} from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { colors } from '@kitman/common/src/variables';
import { getOpenIssuesForAthleteByDate } from '@kitman/services/src/services/medical';
import PermissionsContext from '@kitman/common/src/contexts/PermissionsContext';
import OpenIssues from '../index';

jest.mock('@kitman/services/src/services/medical');

const responseData = {
  id: 1,
  issue_id: 1,
  name: 'New issue title here',
};

describe('<OpenIssues />', () => {
  beforeEach(() => {
    getOpenIssuesForAthleteByDate.mockResolvedValue({
      has_more: true,
      issues: [responseData],
    });
  });

  const mockStore = storeFake();
  const props = {
    athleteId: 1,
    issueDate: '16-12-2024',
    hasMore: true,
    openIssues: [
      {
        id: 2,
        issue_id: 11,
        issue_type: 'Injury',
        name: 'Broken Ankle',
        status: 'unavailable',
        causing_unavailability: true,
      },
      {
        id: 3,
        issue_id: 11,
        issue_type: 'Illness',
        name: 'Anemia',
        status: 'available',
        causing_unavailability: false,
      },
    ],
    t: i18nextTranslateStub(),
  };

  const renderComponent = () => {
    render(
      <Provider store={mockStore}>
        <PermissionsContext.Provider
          value={{
            permissions: {
              medical: {
                availability: {
                  canView: true,
                },
              },
            },
          }}
        >
          <OpenIssues {...props} />
        </PermissionsContext.Provider>
      </Provider>
    );
  };

  it('renders the correct content for the first open issue', () => {
    renderComponent();

    const issueLink = screen.getByText('Broken Ankle');
    expect(issueLink).toBeInTheDocument();
    expect(issueLink.closest('a')).toHaveAttribute(
      'href',
      '/medical/athletes/1/injuries/2'
    );

    const issueStatus = screen.getByText('unavailable');
    expect(issueStatus).toBeInTheDocument();

    const availabilityDot = issueLink.parentNode.parentNode
      .querySelector('div')
      .querySelector('div');

    expect(availabilityDot).toHaveStyle({ backgroundColor: colors.red_100 });
  });

  it('renders the correct content for the second open issue', () => {
    renderComponent();

    const issueLink = screen.getByText('Anemia');
    expect(issueLink).toBeInTheDocument();
    expect(issueLink.closest('a')).toHaveAttribute(
      'href',
      '/medical/athletes/1/illnesses/3'
    );

    const issueStatus = screen.getByText('available');
    expect(issueStatus).toBeInTheDocument();

    const availabilityDot = issueLink.parentNode.parentNode
      .querySelector('div')
      .querySelector('div');
    expect(availabilityDot).toHaveStyle({ backgroundColor: colors.green_200 });
  });

  it('loads more issues when "Show all" is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    const loadMoreButton = screen.getByText('Show all');
    expect(loadMoreButton).toBeInTheDocument();

    await user.click(loadMoreButton);

    expect(getOpenIssuesForAthleteByDate).toHaveBeenCalledTimes(1);
    expect(getOpenIssuesForAthleteByDate).toHaveBeenCalledWith(
      props.athleteId,
      props.issueDate
    );

    expect(screen.getByText(responseData.name)).toBeInTheDocument();
  });
});
