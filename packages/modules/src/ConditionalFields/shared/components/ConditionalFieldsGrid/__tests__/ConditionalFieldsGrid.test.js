import { render, screen } from '@testing-library/react';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { data as mockRulesets } from '../../../services/mocks/data/mock_rulesets_list';

import ConditionalFieldsGrid from '../index';

const columns = [
  {
    id: 'name',
    content: <div>Name</div>,
    isHeader: true,
  },
  {
    id: 'published_at',
    content: <div>Published on</div>,
    isHeader: true,
  },
  {
    id: 'version',
    content: <div>Version</div>,
    isHeader: true,
  },
  {
    id: 'status',
    content: <div>Status</div>,
    isHeader: true,
  },
  {
    id: 'squads',
    content: <div>Squads</div>,
    isHeader: true,
  },
];
describe('<ConditionalFieldsGrid />', () => {
  const props = {
    t: i18nextTranslateStub(),
    grid: {
      columns,
      rows: mockRulesets.map((ruleset) => {
        return {
          id: ruleset.id,
          cells: [
            {
              id: 'name',
              content: <span>{ruleset.name}</span>,
            },
            {
              id: 'published_at',
              content: <span>{ruleset.versions[0]?.published_at}</span>,
            },
            {
              id: 'version',
              content: <span>{ruleset.versions.length}</span>,
            },
            {
              id: 'status',
              content: (
                <span>
                  {ruleset.versions[0].published_at ? 'Active' : 'Inactive'}
                </span>
              ),
            },
            {
              id: 'squads',
              content: (
                <span>
                  International Squad, Academy Squad, Test, Kitman Labs - Staff
                </span>
              ),
            },
          ],
        };
      }),
    },
    isLoading: false,
    rowActions: [],
  };


  it('renders the correct content', async () => {
    render(<ConditionalFieldsGrid {...props} />);

    const tableRows = screen.getByRole('table').querySelectorAll('tr');
    expect(tableRows.length).toBe(mockRulesets.length + 1);

    const [headerRow, firstRow] = tableRows;
    const tableHeaders = headerRow.querySelectorAll('th');

    expect(tableHeaders[0]).toHaveTextContent('Name');
    expect(tableHeaders[1]).toHaveTextContent('Published on');
    expect(tableHeaders[2]).toHaveTextContent('Version');
    expect(tableHeaders[3]).toHaveTextContent('Status');
    expect(tableHeaders[4]).toHaveTextContent('Squads');

    const data = mockRulesets;

    expect(firstRow.querySelectorAll('td')[0]).toHaveTextContent(data[0].name);
    expect(firstRow.querySelectorAll('td')[1]).toHaveTextContent(
      data[0].versions[0].published_at
    );
    expect(firstRow.querySelectorAll('td')[2]).toHaveTextContent(
      data[0].versions[0].version
    );
    expect(firstRow.querySelectorAll('td')[3]).toHaveTextContent('Active');
    expect(firstRow.querySelectorAll('td')[4]).toHaveTextContent(
      'International Squad, Academy Squad, Test, Kitman Labs - Staff'
    );
  });

  it('renders the correct content when we have no data', async () => {
    render(
      <ConditionalFieldsGrid
        {...props}
        grid={{ rows: [], columns }}
        requestStatus="DORMANT"
        emptyTableText="No data here"
      />
    );

    const [headerRow] = screen.getByRole('table').querySelectorAll('tr');

    const tableHeaders = headerRow.querySelectorAll('th');
    expect(tableHeaders[0]).toHaveTextContent('Name');
    expect(tableHeaders[1]).toHaveTextContent('Published on');
    expect(tableHeaders[2]).toHaveTextContent('Version');
    expect(tableHeaders[3]).toHaveTextContent('Status');
    expect(tableHeaders[4]).toHaveTextContent('Squads');

    await Promise.resolve();
    expect(await screen.findByText('No data here')).toBeInTheDocument();
  });
});
