import { render, screen } from '@testing-library/react';
import { data as mockAthleteRoster } from '@kitman/services/src/mocks/handlers/medical/getAthleteRoster';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AthleteRosterGrid from '../AthleteRosterGrid';

const columns = [
  {
    id: 'athlete',
    row_key: 'athlete',
    content: <div>Athlete</div>,
    isHeader: true,
  },
  {
    id: 'availability_status',
    row_key: 'availability_status',
    content: <div>Availability Status</div>,
    isHeader: true,
  },
  {
    id: 'open_injuries_illnesses',
    row_key: 'open_injuries_illnesses',
    content: <div>Open Injury/ Illness</div>,
    isHeader: true,
  },
  {
    id: 'latest_note',
    row_key: 'latest_note',
    content: <div>Latest Note</div>,
    isHeader: true,
  },
  {
    id: 'allergies',
    row_key: 'allergies',
    content: <div>Allergies</div>,
    isHeader: true,
  },
  {
    id: 'squad',
    row_key: 'squad',
    content: <div>Squad</div>,
    isHeader: true,
  },
];

describe('<AthleteRosterGrid />', () => {
  const props = {
    t: i18nextTranslateStub(),
    grid: {
      columns,
      rows: mockAthleteRoster.rows.map((athlete) => ({
        id: athlete.id,
        cells: [
          {
            id: 'athlete',
            content: <span>{athlete.athlete.fullname}</span>,
          },
          {
            id: 'availability_status',
            content: <span>{athlete.availability_status.availability}</span>,
          },
          {
            id: 'latest_note',
            content: <span>{athlete.latest_note?.content}</span>,
          },
          {
            id: 'open_injuries_illnesses',
            content: (
              <span>{athlete.open_injuries_illnesses.issues[0].name}</span>
            ),
          },
          {
            id: 'allergies',
            content: <span>{athlete.allergies[0]}</span>,
          },
          {
            id: 'squad',
            content: <span>{athlete.squad[0].name}</span>,
          },
        ],
        classnames: {
          athlete__row: true,
        },
      })),
    },
    isLoading: false,
    fetchMoreData: jest.fn(),
    rowActions: [],
  };

  it('renders the correct content', async () => {
    render(<AthleteRosterGrid {...props} />);

    const tableRows = screen.getByRole('table').querySelectorAll('tr');
    expect(tableRows.length).toBe(mockAthleteRoster.rows.length + 1);

    const [headerRow, firstRow, secondRow, thirdRow] = tableRows;
    const tableHeaders = headerRow.querySelectorAll('th');

    expect(tableHeaders[0]).toHaveTextContent('Athlete');
    expect(tableHeaders[1]).toHaveTextContent('Availability Status');
    expect(tableHeaders[2]).toHaveTextContent('Open Injury/ Illness');
    expect(tableHeaders[3]).toHaveTextContent('Latest Note');
    expect(tableHeaders[4]).toHaveTextContent('Allergies');
    expect(tableHeaders[5]).toHaveTextContent('Squad');

    const data = mockAthleteRoster.rows;

    expect(firstRow.querySelectorAll('td')[0]).toHaveTextContent(
      data[0].athlete.fullname
    );
    expect(firstRow.querySelectorAll('td')[1]).toHaveTextContent('unavailable');
    expect(firstRow.querySelectorAll('td')[3]).toHaveTextContent(
      'Dec 2, 2022 - ACL'
    );
    expect(firstRow.querySelectorAll('td')[4]).toHaveTextContent('Water');
    expect(firstRow.querySelectorAll('td')[5]).toHaveTextContent(
      /Kitman Football/i
    );

    expect(secondRow.querySelectorAll('td')[0]).toHaveTextContent(
      data[1].athlete.fullname
    );
    expect(secondRow.querySelectorAll('td')[1]).toHaveTextContent('available');
    expect(secondRow.querySelectorAll('td')[3]).toHaveTextContent(
      'Oct 11, 2022 - 1st version for head contusion'
    );
    expect(secondRow.querySelectorAll('td')[4]).toHaveTextContent('Hay fever');
    expect(secondRow.querySelectorAll('td')[5]).toHaveTextContent(
      /Kitman Football/i
    );

    expect(thirdRow.querySelectorAll('td')[0]).toHaveTextContent(
      data[2].athlete.fullname
    );
    expect(thirdRow.querySelectorAll('td')[1]).toHaveTextContent('available');
    expect(thirdRow.querySelectorAll('td')[3]).toHaveTextContent(
      'Oct 11, 2022 - Wrist Fracture/Navicular (Scaphoid) - Waist [Bilateral]'
    );
    expect(thirdRow.querySelectorAll('td')[4]).toHaveTextContent('Lactose');
    expect(thirdRow.querySelectorAll('td')[5]).toHaveTextContent(
      /Kitman Football/i
    );
  });

  it('renders the correct content when we have no data', async () => {
    render(
      <AthleteRosterGrid
        {...props}
        grid={{ rows: [], columns, next_id: null }}
        requestStatus="DORMANT"
        emptyTableText="Nada, no, zero, zilch"
      />
    );

    const [headerRow] = screen.getByRole('table').querySelectorAll('tr');

    const tableHeaders = headerRow.querySelectorAll('th');
    expect(tableHeaders[0]).toHaveTextContent('Athlete');
    expect(tableHeaders[1]).toHaveTextContent('Availability Status');
    expect(tableHeaders[2]).toHaveTextContent('Open Injury/ Illness');
    expect(tableHeaders[3]).toHaveTextContent('Latest Note');
    expect(tableHeaders[4]).toHaveTextContent('Allergies');
    expect(tableHeaders[5]).toHaveTextContent('Squad');
    await Promise.resolve();
    expect(
      await screen.findByText('Nada, no, zero, zilch')
    ).toBeInTheDocument();
  });
});
