import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import moment from 'moment-timezone';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { data } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssues';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import getDefaultAddIssuePanelStore from '@kitman/modules/src/Medical/shared/redux/stores/addIssuePanel';
import addIssuePanelReducer from '@kitman/modules/src/Medical/rosters/src/redux/reducers/addIssuePanel';

import ChronicIssuesTable from '../ChronicIssuesTable';

const { chronicIssues } = data;

const props = {
  athleteId: 123,
  issues: chronicIssues,
  t: i18nextTranslateStub(),
};

describe('<ChronicIssuesTable />', () => {
  const store = createStore(
    combineReducers({
      addIssuePanel: addIssuePanelReducer,
    }),
    {
      addIssuePanel: getDefaultAddIssuePanelStore(),
    }
  );

  const checkTableHeadersAreCorect = () => {
    const table = screen.getByRole('table');

    const tableRows = table.querySelectorAll('tr');
    const [firstRow, ...rows] = tableRows;

    // First row - table headers
    const tableHeaders = firstRow.querySelectorAll('th');

    expect(tableHeaders[0]).toHaveTextContent('Onset Date');
    expect(tableHeaders[1]).toHaveTextContent('Type');
    expect(tableHeaders[2]).toHaveTextContent('Title');
    expect(tableHeaders[3]).toHaveTextContent(''); // fillercell

    // has the correct number of rows
    expect(rows.length).toBe(chronicIssues.length);
  };

  it('renders the columns correctly', async () => {
    render(
      <Provider store={store}>
        <ChronicIssuesTable {...props} />
      </Provider>
    );

    expect(screen.getByText('Chronic conditions')).toBeInTheDocument();

    checkTableHeadersAreCorect();
  });

  it('renders the correct title and data, with links to correct url', async () => {
    render(
      <Provider store={store}>
        <ChronicIssuesTable {...props} />
      </Provider>
    );

    expect(screen.getAllByText('Chronic condition')[0]).toBeInTheDocument();

    const tableRows = Array.from(
      screen.getByRole('table').querySelectorAll('tr')
    ).slice(1); // skip first row (header)

    // renders the correct information
    tableRows.forEach((row, index) => {
      const cells = row.querySelectorAll('td');
      const expectedTitle =
        chronicIssues[index].title !== null
          ? chronicIssues[index].title
          : chronicIssues[index].pathology;

      expect(cells[0]).toHaveTextContent(
        formatStandard({
          date: moment(chronicIssues[index].occurrence_date),
          displayLongDate: true,
        })
      );
      expect(cells[1]).toHaveTextContent('Chronic condition');
      expect(cells[2]).toHaveTextContent(expectedTitle);
      expect(row.querySelector('a')).toHaveAttribute(
        'href',
        `/medical/athletes/123/chronic_issues/${chronicIssues[index].id}`
      );
    });
  });
});
