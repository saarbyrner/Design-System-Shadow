import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import moment from 'moment-timezone';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { data } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssues';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import getDefaultAddIssuePanelStore from '@kitman/modules/src/Medical/shared/redux/stores/addIssuePanel';
import addIssuePanelReducer from '@kitman/modules/src/Medical/rosters/src/redux/reducers/addIssuePanel';

import ClosedChronicIssuesTable from '../ClosedChronicIssuesTable';

const { closedChronicIssues } = data;

const props = {
  athleteId: 123,
  issues: closedChronicIssues,
  t: i18nextTranslateStub(),
};

const checkTableHeadersAreCorect = () => {
  const table = screen.getByRole('table');

  const tableRows = table.querySelectorAll('tr');
  const [firstRow, ...rows] = tableRows;

  // First row - table headers
  const tableHeaders = firstRow.querySelectorAll('th');

  expect(tableHeaders[0]).toHaveTextContent('Onset Date');
  expect(tableHeaders[1]).toHaveTextContent('Type');
  expect(tableHeaders[2]).toHaveTextContent('Title');
  expect(tableHeaders[3]).toHaveTextContent('Date of resolution');

  // has the correct number of rows
  expect(rows.length).toBe(closedChronicIssues.length);
};

const checkDataIsValid = () => {
  const tableRows = Array.from(
    screen.getByRole('table').querySelectorAll('tr')
  ).slice(1); // skip first row (header)

  // renders the correct information
  tableRows.forEach((row, index) => {
    const cells = row.querySelectorAll('td');
    const expectedTitle =
      closedChronicIssues[index].title ?? closedChronicIssues[index].pathology;

    expect(cells[0]).toHaveTextContent(expectedTitle);
    expect(row.querySelector('a')).toHaveAttribute(
      'href',
      `/medical/athletes/123/chronic_issues/${closedChronicIssues[index].id}`
    );
    expect(cells[2]).toHaveTextContent(
      `Resolved: ${formatStandard({
        date: moment(closedChronicIssues[index].resolved_date),
        displayLongDate: true,
      })}`
    );

    expect(cells[1]).toHaveTextContent('Chronic condition');
  });
};

describe('<ClosedChronicIssuesTable />', () => {
  const store = createStore(
    combineReducers({
      addIssuePanel: addIssuePanelReducer,
    }),
    {
      addIssuePanel: getDefaultAddIssuePanelStore(),
    }
  );

  beforeEach(() => {
    moment.tz.setDefault('UTC');
    jest.useFakeTimers();
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  it('renders the correct title and data, with links to correct url', async () => {
    render(
      <Provider store={store}>
        <ClosedChronicIssuesTable {...props} />
      </Provider>
    );

    expect(screen.getByText('Prior Chronic Conditions')).toBeInTheDocument();

    checkTableHeadersAreCorect();
    checkDataIsValid();
  });

  it('renders the correct label for Date of Resolution value for Past Athletes', async () => {
    render(
      <Provider store={store}>
        <ClosedChronicIssuesTable {...props} isPastAthlete />
      </Provider>
    );

    expect(screen.getByText('Prior Chronic Conditions')).toBeInTheDocument();

    const tableRows = Array.from(
      screen.getByRole('table').querySelectorAll('tr')
    ).slice(1); // skip first row (header)

    // renders the correct information
    tableRows.forEach((row, index) => {
      const cells = row.querySelectorAll('td');
      expect(cells[2]).toHaveTextContent(
        `Left club: ${formatStandard({
          date: moment(closedChronicIssues[index].resolved_date),
          displayLongDate: true,
        })}`
      );
    });
  });
});
