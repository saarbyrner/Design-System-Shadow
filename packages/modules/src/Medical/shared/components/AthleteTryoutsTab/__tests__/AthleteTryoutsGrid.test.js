import { render, screen } from '@testing-library/react';
import { data as mockedAthleteTryouts } from '@kitman/services/src/mocks/handlers/medical/getTryoutAthletes';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import AthleteTryoutsGrid from '../components/AthleteTryoutsGrid';

const columns = [
  {
    id: 'athlete',
    row_key: 'athlete',
    content: <div>Athlete</div>,
    isHeader: true,
  },
  {
    id: 'parent_organisation',
    row_key: 'parent_organisation',
    content: <div>Parent club</div>,
    isHeader: true,
  },
  {
    id: 'athlete_joined_date',
    row_key: 'athlete_joined_date',
    content: <div>Joined date</div>,
    isHeader: true,
  },
  {
    id: 'trial_expires_date',
    row_key: 'trial_expires_date',
    content: <div>Expires</div>,
    isHeader: true,
  },
];

describe('<AthleteTryoutsGrid />', () => {
  const props = {
    t: i18nextTranslateStub(),
    grid: {
      columns,
      rows: mockedAthleteTryouts.athletes.map((athlete) => ({
        id: athlete.id,
        cells: [
          {
            id: 'athlete',
            content: <span>{athlete.fullname}</span>,
          },
          {
            id: 'parent_organisation',
            content: <span>{athlete.organisations[0].name}</span>,
          },
          {
            id: 'athlete_joined_date',
            content: <span>{athlete.trial_record.joined_at}</span>,
          },
          {
            id: 'trial_expires_date',
            content: <span>{athlete.trial_record.left_at}</span>,
          },
        ],
        classnames: {
          athlete__row: true,
        },
      })),
    },
  };

  it('renders the correct content', async () => {
    render(<AthleteTryoutsGrid {...props} />);

    const tableRows = screen.getByRole('table').querySelectorAll('tr');
    expect(tableRows.length).toBe(mockedAthleteTryouts.athletes.length + 1);

    const [headerRow, firstRow, secondRow] = tableRows;
    const tableHeaders = headerRow.querySelectorAll('th');

    expect(tableHeaders[0]).toHaveTextContent('Athlete');
    expect(tableHeaders[1]).toHaveTextContent('Parent club');
    expect(tableHeaders[2]).toHaveTextContent('Joined date');
    expect(tableHeaders[3]).toHaveTextContent('Expires');

    const data = mockedAthleteTryouts.athletes;

    const joinedDate = /2022-11-22T05:01:08/i;
    const expiresDate = /2022-11-25T05:01:08/i;

    expect(firstRow.querySelectorAll('td')[0]).toHaveTextContent(
      data[0].fullname
    );

    expect(firstRow.querySelectorAll('td')[1]).toHaveTextContent(
      /Kitman Football/i
    );
    expect(firstRow.querySelectorAll('td')[2]).toHaveTextContent(joinedDate);
    expect(firstRow.querySelectorAll('td')[3]).toHaveTextContent('-1');

    expect(secondRow.querySelectorAll('td')[1]).toHaveTextContent(
      /Kitman Football/i
    );
    expect(secondRow.querySelectorAll('td')[2]).toHaveTextContent(joinedDate);
    expect(secondRow.querySelectorAll('td')[3]).toHaveTextContent(expiresDate);
  });

  it('renders the correct content when we have no data', async () => {
    render(
      <AthleteTryoutsGrid
        {...props}
        grid={{ rows: [], columns }}
        emptyTableText="No tryout athletes for this period"
      />
    );

    const [headerRow] = screen.getByRole('table').querySelectorAll('tr');

    const tableHeaders = headerRow.querySelectorAll('th');
    expect(tableHeaders[0]).toHaveTextContent('Athlete');
    expect(tableHeaders[1]).toHaveTextContent('Parent club');
    expect(tableHeaders[2]).toHaveTextContent('Joined date');
    expect(tableHeaders[3]).toHaveTextContent('Expires');
    expect(
      await screen.findByText('No tryout athletes for this period')
    ).toBeInTheDocument();
  });
});
