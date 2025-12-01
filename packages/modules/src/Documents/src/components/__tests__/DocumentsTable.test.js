import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DocumentsTable from '../DocumentsTable';

describe('<DocumentsTable />', () => {
  const props = {
    isLoading: false,
    documents: [
      {
        id: 124565,
        name: 'mock-video.mp4',
        modifiedDate: '2020-07-27T11:27:03Z',
        owner: 'John Doe',
        size: 1207850,
        url: 'http://www.mock-video.com',
        downloadUrl: 'http://www.mock-video-download.com',
      },
      {
        id: 142354,
        name: 'mock-audio.mp3',
        modifiedDate: '2021-05-27T12:25:00Z',
        owner: 'John Doe',
        size: 934147,
        url: 'http://www.mock-audio.com',
        downloadUrl: 'http://www.mock-audio-download.com',
      },
      {
        id: 196670,
        name: 'mock-image.jpg',
        modifiedDate: '2021-11-27T09:15:00Z',
        owner: 'John Doe',
        size: 24521,
        url: 'http://www.mock-image.com',
        downloadUrl: 'http://www.mock-image-download.com',
      },
    ],
    t: i18nextTranslateStub(),
  };

  it('displays the table with the correct content', () => {
    render(<DocumentsTable {...props} />);
    const table = screen.getByRole('table');

    const tableRows = table.querySelectorAll('tr');
    const [firstRow, secondRow, thirdRow, fourthRow] = tableRows;

    // First row - table headers
    const tableHeaders = firstRow.querySelectorAll('th');
    expect(tableHeaders[0]).toHaveTextContent('Name');
    expect(tableHeaders[1]).toHaveTextContent('Last Modified');
    expect(tableHeaders[2]).toHaveTextContent('Owner');
    expect(tableHeaders[3]).toHaveTextContent('Size');

    // Second row
    const secondRowCells = secondRow.querySelectorAll('td');
    expect(secondRowCells[0]).toHaveTextContent('mock-video.mp4');
    expect(secondRowCells[1]).toHaveTextContent('27 Jul 2020 at 11:27 am');
    expect(secondRowCells[2]).toHaveTextContent('John Doe');
    expect(secondRowCells[3]).toHaveTextContent('1.2 MB');

    // Third row
    const thirdRowCells = thirdRow.querySelectorAll('td');
    expect(thirdRowCells[0]).toHaveTextContent('mock-audio.mp3');
    expect(thirdRowCells[1]).toHaveTextContent('27 May 2021 at 12:25 pm');
    expect(thirdRowCells[2]).toHaveTextContent('John Doe');
    expect(thirdRowCells[3]).toHaveTextContent('934.1 kB');

    // Fourth row
    const fourthRowCells = fourthRow.querySelectorAll('td');
    expect(fourthRowCells[0]).toHaveTextContent('mock-image.jpg');
    expect(fourthRowCells[1]).toHaveTextContent('27 Nov 2021 at 9:15 am');
    expect(fourthRowCells[2]).toHaveTextContent('John Doe');
    expect(fourthRowCells[3]).toHaveTextContent('24.5 kB');
  });

  it('displays the empty table message when no documents', () => {
    render(<DocumentsTable {...props} documents={[]} />);
    expect(screen.getByText('No documents saved')).toBeInTheDocument();
  });
});
