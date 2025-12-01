import $ from 'jquery';
import { render, screen } from '@testing-library/react';
import moment from 'moment';
import selectEvent from 'react-select-event';
import userEvent from '@testing-library/user-event';
import { data } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssues';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { VirtuosoMockContext } from 'react-virtuoso';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import ChronicIssueQuestions from '../ChronicIssueQuestions';
import { getIssueTitle } from '../../../../../../shared/utils';

describe('<ChronicIssueQuestions />', () => {
  const mockOnSelect = jest.fn();
  const i18nT = i18nextTranslateStub();

  const defaultProps = {
    t: i18nT,
    selectedIssueType: 'CHRONIC_INJURY',
    selectedAthlete: 1,
    // Chronic issues
    relatedChronicIssues: [],
    onSelectRelatedChronicIssues: mockOnSelect,
  };

  const renderComponent = (props = {}) => {
    const length =
      data.groupedIssues.closed_issues.length +
      data.groupedIssues.open_issues.length;
    const itemHeight = 10;
    const viewportHeight = length * itemHeight;

    render(
      <VirtuosoMockContext.Provider value={{ viewportHeight, itemHeight }}>
        <ChronicIssueQuestions {...defaultProps} {...props} />
      </VirtuosoMockContext.Provider>
    );
  };

  beforeEach(() => {
    const deferred = $.Deferred();
    window.featureFlags['chronic-injury-illness'] = true;
    jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data.groupedIssues));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    window.featureFlags['chronic-injury-illness'] = false;
  });

  it('renders', async () => {
    renderComponent();

    expect(
      screen.queryByText(
        'Are there injury/ illness documented related to this chronic condition?'
      )
    ).toBeInTheDocument();
    expect(screen.queryByText('Yes')).toBeInTheDocument();
    expect(screen.queryByText('No')).toBeInTheDocument();
  });

  it('renders the Select injury/ illness dropdown when clicking "yes"', async () => {
    renderComponent({
      selectedIssueType: 'CHRONIC_INJURY',
    });

    expect(
      screen.queryByTestId('ChronicIssueQuestions|SelectIssue')
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', {
        name: 'Yes',
      })
    );

    expect(
      screen.getByTestId('ChronicIssueQuestions|SelectIssue')
    ).toBeInTheDocument();

    selectEvent.openMenu(
      screen
        .getByTestId('ChronicIssueQuestions|SelectIssue')
        .querySelector('.kitmanReactSelect input')
    );

    data.groupedIssues.open_issues.forEach((targetIssue) => {
      // const targetIssue = data.groupedIssues.open_issues[2];
      const optionTitle = `${formatStandard({
        date: moment(targetIssue.occurrence_date),
      })} - ${getIssueTitle(targetIssue)}`;

      expect(
        screen.getByTitle(optionTitle, {
          exact: false,
        })
      ).toBeInTheDocument();
    });

    data.groupedIssues.closed_issues.forEach((targetIssue) => {
      const optionTitle = `${formatStandard({
        date: moment(targetIssue.occurrence_date),
      })} - ${getIssueTitle(targetIssue)}`;

      expect(
        screen.getByTitle(optionTitle, {
          exact: false,
        })
      ).toBeInTheDocument();
    });
  });
});
