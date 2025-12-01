import $ from 'jquery';
import { render, screen, act } from '@testing-library/react';
import moment from 'moment-timezone';
import { data } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssues';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { getIssueTitle } from '@kitman/modules/src/Medical/shared/utils';

import ArchivedIssuesTable from '../ArchivedIssuesTable';

const { archivedIssues } = data;

describe('<ArchivedIssuesTable />', () => {
  let issues;
  let table;
  let tableRows;

  const props = {
    t: i18nextTranslateStub(),
    athleteId: 123,
    issues: archivedIssues.issues,
  };

  beforeEach(async () => {
    moment.tz.setDefault('UTC');

    issues = archivedIssues.issues;

    const deferred = $.Deferred();
    jest.spyOn($, 'ajax').mockImplementation(() => deferred.resolve(issues));
    await act(() => {
      render(<ArchivedIssuesTable {...props} />);
    });

    table = screen.getByRole('table');

    tableRows = table.querySelectorAll('tr');
  });
  afterEach(() => {
    moment.tz.setDefault();
  });
  it('table header renders correctly', async () => {
    expect(screen.getByText('Archived injuries/illnesses')).toBeInTheDocument();
  });

  it('column headers renders correctly', async () => {
    const [firstRow] = tableRows;

    act(() => {
      jest.advanceTimersToNextTimer();
    });

    const tableHeaders = firstRow.querySelectorAll('th');
    expect(tableHeaders[0]).toHaveTextContent('Title');
    expect(tableHeaders[1]).toHaveTextContent('Archive Reason');
    expect(tableHeaders[2]).toHaveTextContent('Type');
    expect(tableHeaders[3]).toHaveTextContent('Date of Injury/Illness');
    expect(tableHeaders[4]).toHaveTextContent('Date Injury/Illness Archived');
  });

  it('renders all the rows correctly', async () => {
    const [, ...rows] = tableRows;

    act(() => {
      jest.advanceTimersToNextTimer();
    });

    expect(rows.length).toBe(issues.length);
  });

  it('renders the data correctly to the table', async () => {
    const [, ...rows] = tableRows;

    act(() => {
      jest.advanceTimersToNextTimer();
    });

    rows.forEach((row, index) => {
      const cells = row.querySelectorAll('td');
      const expectedTitle = getIssueTitle(issues[index]);
      const archivedReason = 'Incorrect Athlete';
      const expectedType = issues[index].issue_type;
      const expectedDate = issues[index].occurrence_date;
      const archivedDate = issues[index].archived_date;
      const archivedBy = issues[index].archived_by.fullname;

      expect(cells[0]).toHaveTextContent(expectedTitle);
      expect('Incorrect Athlete').toEqual(archivedReason);
      expect(cells[2]).toHaveTextContent(expectedType);
      expect(cells[3]).toHaveTextContent(
        `${DateFormatter.formatStandard({
          date: moment(expectedDate),
          showCompleteDate: true,
          displayLongDate: true,
        })}`
      );
      expect(cells[4]).toHaveTextContent(
        `${DateFormatter.formatStandard({
          date: moment(archivedDate),
          showCompleteDate: true,
          displayLongDate: true,
        })}`
      );
      expect(cells[5]).toHaveTextContent(archivedBy);
    });
  });
});
