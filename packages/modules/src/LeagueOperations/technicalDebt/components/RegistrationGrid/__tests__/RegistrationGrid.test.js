import { render, screen } from '@testing-library/react';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { data as mockOrganisations } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_organisations_list';

import { gridStyle } from '@kitman/modules/src/LeagueOperations/technicalDebt/components/CommonGridStyle';
import RegistrationGrid from '../index';
import style from '../style';

const columns = [
  {
    id: 'club_name',
    row_key: 'club_name',
    content: <div>Club</div>,
    isHeader: true,
  },
  {
    id: 'total_teams',
    row_key: 'total_teams',
    content: <div>Total Teams</div>,
    isHeader: true,
  },
  {
    id: 'total_staff',
    row_key: 'total_staff',
    content: <div>Total Staff</div>,
    isHeader: true,
  },
  {
    id: 'total_players',
    row_key: 'total_players',
    content: <div>Total Players</div>,
    isHeader: true,
  },
  {
    id: 'location',
    row_key: 'location',
    content: <div>State / Province</div>,
    isHeader: true,
  },
  {
    id: 'unpaid_balance',
    row_key: 'balance',
    content: <div>Unpaid Balance</div>,
    isHeader: true,
  },
];

describe('<RegistrationGrid />', () => {
  const props = {
    t: i18nextTranslateStub(),
    grid: {
      columns,
      rows: mockOrganisations.map((org) => ({
        id: org.id,
        cells: [
          {
            id: 'club_name',
            content: <span>{org.name}</span>,
          },
          {
            id: 'total_teams',
            content: <span>{org.total_squads}</span>,
          },
          {
            id: 'total_staff',
            content: <span>{org.total_staff}</span>,
          },
          {
            id: 'total_players',
            content: <span>{org.total_athletes}</span>,
          },
          {
            id: 'location',
            content: <span>{org?.address?.country?.name || 'N/A'}</span>,
          },
          {
            id: 'unpaid_balance',
            content: <span>{org.registration_balance}</span>,
          },
        ],
      })),
    },
    isLoading: false,
    onFetchData: jest.fn(),
    rowActions: [],
    meta: {
      current_page: 0,
      next_page: null,
      prev_page: null,
      total_count: 0,
      total_pages: 0,
    },
  };

  const defaultStyles = Object.fromEntries(
    Object.entries(gridStyle.grid).filter(
      // Remove any nested style definitions and leave out only the ones
      // applied to the component.
      ([, value]) => typeof value !== 'object'
    )
  );

  it('renders the correct content', async () => {
    render(<RegistrationGrid {...props} />);

    const table = screen.getByRole('table');

    const container = table.parentNode.parentNode;

    expect(container).toHaveStyle(defaultStyles);
    expect(container).not.toHaveStyle(style.allDataIsValidMessage);

    const tableRows = table.querySelectorAll('tr');
    expect(tableRows.length).toBe(mockOrganisations.length + 1);

    const [headerRow, firstRow] = tableRows;
    const tableHeaders = headerRow.querySelectorAll('th');

    expect(tableHeaders[0]).toHaveTextContent('Club');
    expect(tableHeaders[1]).toHaveTextContent('Total Teams');
    expect(tableHeaders[2]).toHaveTextContent('Total Staff');
    expect(tableHeaders[3]).toHaveTextContent('Total Players');
    expect(tableHeaders[4]).toHaveTextContent('State / Province');
    expect(tableHeaders[5]).toHaveTextContent('Unpaid Balance');

    const data = mockOrganisations;

    expect(firstRow.querySelectorAll('td')[0]).toHaveTextContent(data[0].name);
    expect(firstRow.querySelectorAll('td')[1]).toHaveTextContent(
      data[0].total_squads
    );
    expect(firstRow.querySelectorAll('td')[2]).toHaveTextContent(
      data[0].total_staff
    );
    expect(firstRow.querySelectorAll('td')[3]).toHaveTextContent(
      data[0].total_athletes
    );
    expect(firstRow.querySelectorAll('td')[4]).toHaveTextContent('N/A');
    expect(firstRow.querySelectorAll('td')[5]).toHaveTextContent('1000');
  });

  it('renders the correct content when we have no data', async () => {
    render(
      <RegistrationGrid
        {...props}
        grid={{ rows: [], columns }}
        emptyTableText="Nada, no, zero, zilch"
      />
    );

    const table = screen.getByRole('table');

    const container = table.parentNode.parentNode;

    expect(container).toHaveStyle(defaultStyles);
    expect(container).not.toHaveStyle(style.allDataIsValidMessage);

    const [headerRow] = table.querySelectorAll('tr');

    const tableHeaders = headerRow.querySelectorAll('th');
    expect(tableHeaders[0]).toHaveTextContent('Club');
    expect(tableHeaders[1]).toHaveTextContent('Total Teams');
    expect(tableHeaders[2]).toHaveTextContent('Total Staff');
    expect(tableHeaders[3]).toHaveTextContent('Total Players');
    expect(tableHeaders[4]).toHaveTextContent('State / Province');
    expect(tableHeaders[5]).toHaveTextContent('Unpaid Balance');
    await Promise.resolve();
    expect(
      await screen.findByText('Nada, no, zero, zilch')
    ).toBeInTheDocument();
  });

  it(
    'renders the correct content when we have no data,' +
      ' `mustShowOnlyRowsWithErrorsOnParseStateComplete` prop is passed and' +
      '`rows.length` in `grid` prop is 0',
    () => {
      render(
        <RegistrationGrid
          {...props}
          grid={{ rows: [], columns }}
          mustShowOnlyRowsWithErrorsOnParseStateComplete
          emptyTableText="Nada, no, zero, zilch"
        />
      );

      expect(screen.getByText('All data is valid')).toHaveStyle(
        style.allDataIsValidMessage
      );
    }
  );

  it(
    'doesn’t render the correct content when' +
      ' `mustShowOnlyRowsWithErrorsOnParseStateComplete` prop is passed and' +
      '`rows.length` in `grid` prop is not 0',
    () => {
      render(
        <RegistrationGrid
          {...props}
          grid={{ rows: props.grid.rows, columns }}
          mustShowOnlyRowsWithErrorsOnParseStateComplete
          emptyTableText="Nada, no, zero, zilch"
        />
      );

      expect(screen.queryByText('All data is valid')).not.toBeInTheDocument();
    }
  );
});
