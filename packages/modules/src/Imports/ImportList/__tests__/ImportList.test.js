import { render, screen } from '@testing-library/react';
import moment from 'moment-timezone';
import '@testing-library/jest-dom';
import { data as mockedData } from '@kitman/services/src/mocks/handlers/imports/importMassAthletes';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ImportList from '..';

describe('<ImportList />', () => {
  const props = {
    fetchedData: mockedData.data,
    isLoading: false,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  it('displays the table with the correct content', () => {
    render(<ImportList {...props} />);

    const table = screen.getByRole('table');
    const tableRows = table.querySelectorAll('tr');
    const [firstRow, secondRow, thirdRow] = tableRows;

    // First row - table headers
    const tableHeaders = firstRow.querySelectorAll('th');
    expect(tableHeaders[0]).toHaveTextContent('Name');
    expect(tableHeaders[1]).toHaveTextContent('Import Type');
    expect(tableHeaders[2]).toHaveTextContent('Created Date & Time');
    expect(tableHeaders[3]).toHaveTextContent('Download link');
    expect(tableHeaders[4]).toHaveTextContent('Status');
    expect(tableHeaders[5]).toHaveTextContent('Creator');
    expect(tableHeaders[6]).toHaveTextContent('Errors');

    // Second row
    const secondRowCells = secondRow.querySelectorAll('td');
    expect(secondRowCells[0]).toHaveTextContent('myfile.txt');
    expect(secondRowCells[1]).toHaveTextContent('Athlete Import');
    expect(secondRowCells[2]).toHaveTextContent('Dec 17, 1995 12:00 AM');
    expect(secondRowCells[3]).toHaveTextContent('Link');
    expect(secondRowCells[4]).toHaveTextContent('Completed');
    expect(secondRowCells[5]).toHaveTextContent('user');
    expect(secondRowCells[6]).toHaveTextContent('this errored on line 1');
    expect(secondRowCells[6]).toHaveTextContent('this errored on line 2');
    expect(secondRowCells[6]).toHaveTextContent('this errored on line 3');

    // Third row
    const thirdRowCells = thirdRow.querySelectorAll('td');
    expect(thirdRowCells[0]).toHaveTextContent('myfile.txt');
    expect(thirdRowCells[1]).toHaveTextContent('Staff Import');
    expect(thirdRowCells[2]).toHaveTextContent('Dec 17, 1995 12:00 AM');
    expect(thirdRowCells[3]).toHaveTextContent('--');
    expect(secondRowCells[4]).toHaveTextContent('Completed');
    expect(secondRowCells[5]).toHaveTextContent('user');
    expect(thirdRowCells[6]).toHaveTextContent('error_message');
  });
});
