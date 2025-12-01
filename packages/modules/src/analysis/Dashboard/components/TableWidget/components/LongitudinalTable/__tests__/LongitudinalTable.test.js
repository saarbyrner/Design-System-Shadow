import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import i18n from 'i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import LongitudinalTable from '../index';

const componentSelector = (key) => `[data-testid="LongitudinalTable|${key}"]`;

describe('LongitudinalTable Component', () => {
  const i18nT = i18nextTranslateStub(i18n);

  const props = {
    appliedColumnDetails: [
      {
        id: 1,
        population: {
          applies_to_squad: false,
          position_groups: [25],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
          context_squads: [8],
        },
        table_element: {
          calculation: 'mean',
        },
      },
      {
        id: 2,
        population: {
          applies_to_squad: false,
          position_groups: [25],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
          context_squads: [8, 73],
        },
        table_element: {
          calculation: 'mean',
        },
      },
      {
        id: 3,
        population: {
          applies_to_squad: false,
          position_groups: [25],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
          context_squads: [],
        },
        table_element: {
          calculation: 'mean',
        },
      },
    ],
    appliedRowDetails: [
      { id: 10, time_scope: { time_period: 'today' } },
      { id: 11, time_scope: { time_period: 'this_season' } },
    ],
    isEditMode: false,
    showSummary: false,
    squadAthletes: {
      id: 8,
      name: 'International Squad',
      position_groups: [
        {
          id: 25,
          name: 'Forward',
          positions: [
            {
              id: 123,
              name: 'Hooker',
              athletes: [],
            },
            {
              id: 456,
              name: 'Prop',
              athletes: [],
            },
          ],
        },
      ],
    },
    squads: [
      {
        id: 8,
        name: 'International Squad',
      },
      {
        id: 73,
        name: 'Academy Squad',
      },
    ],
    t: i18nT,
  };

  it('renders a dateRange column', () => {
    const { container } = renderWithStore(<LongitudinalTable {...props} />);
    expect(
      container.getElementsByClassName('tableWidget__dateRange')
    ).toHaveLength(1);
  });

  it('renders a row for each appliedRowDetails', () => {
    const { container } = renderWithStore(<LongitudinalTable {...props} />);

    const appliedTimeScopeDOMSelector = `.tableWidget__dateRange ${componentSelector(
      'AppliedTimeScope'
    )}`;

    const appliedTimeScopes = container.querySelectorAll(
      appliedTimeScopeDOMSelector
    );

    // expect 2 applied timescopes
    expect(appliedTimeScopes).toHaveLength(2);
  });

  it('passes the selected squads to the longitudinal columns', () => {
    const { container } = renderWithStore(<LongitudinalTable {...props} />);

    const populationRows = container.querySelectorAll(
      '.tableWidget__populationRow'
    );

    const firstPopulationRow = populationRows[0];
    const firstSquadSpan = firstPopulationRow.querySelector(
      '.tableWidget__columnHeader--contextSquad'
    );
    expect(firstSquadSpan).toHaveTextContent('International Squad');

    const secondPopulationRow = populationRows[1];
    const secondSquadSpan = secondPopulationRow.querySelector(
      '.tableWidget__columnHeader--contextSquad'
    );
    expect(secondSquadSpan).toHaveTextContent(
      'International Squad, Academy Squad'
    );
  });

  it('renders an a row button when isEditMode', () => {
    const { container } = renderWithStore(
      <LongitudinalTable {...props} isEditMode />
    );
    expect(
      container.getElementsByClassName('tableWidget__addRow')
    ).toHaveLength(1);
  });

  it('renders the SourceSelector when isEditMode', () => {
    const { container } = renderWithStore(
      <LongitudinalTable {...props} isEditMode />
    );

    const columnAddIcons = container.getElementsByClassName(
      'tableWidget__addColumn icon-add'
    );
    expect(columnAddIcons).toHaveLength(1);
    const rowAddIcons = container.getElementsByClassName(
      'tableWidget__addRow icon-add'
    );
    expect(rowAddIcons).toHaveLength(1);
  });

  describe('when showing summary', () => {
    it('shows the summary row if showSummary is true', () => {
      const { container } = renderWithStore(
        <LongitudinalTable {...props} showSummary />
      );

      expect(
        container.getElementsByClassName('tableWidget__summaryRow')
      ).toBeTruthy();
    });

    it('should not throw error if `calculation` is missing from column details', () => {
      const updatedProps = {
        ...props,
        appliedColumnDetails: [
          {
            id: 1,
            population: {
              applies_to_squad: false,
              position_groups: [25],
              positions: [],
              athletes: [],
              all_squads: false,
              squads: [],
              context_squads: [8],
            },
          },
        ],
      };
      const { container } = renderWithStore(
        <LongitudinalTable {...updatedProps} showSummary />
      );
      expect(
        container.getElementsByClassName('tableWidget__summaryRow')
      ).toBeTruthy();
    });
  });

  it('renders a column for each appliedColumnDetail', () => {
    const { container } = renderWithStore(<LongitudinalTable {...props} />);
    expect(
      container.getElementsByClassName('tableWidget__column')
    ).toHaveLength(3);
  });

  it('renders `tableWidget__rowHeader--disabled` when the dashboard cannot be managed', () => {
    const { container } = renderWithStore(
      <LongitudinalTable
        {...props}
        canManageDashboard={false}
        dataStatus="SUCCESS"
      />
    );

    expect(
      container.getElementsByClassName('tableWidget__rowHeader--disabled')
    ).toHaveLength(2);
  });

  it('does not render `tableWidget__rowHeader--disabled` when the dashboard can be managed', () => {
    const { container } = renderWithStore(
      <LongitudinalTable {...props} canManageDashboard dataStatus="SUCCESS" />
    );

    expect(
      container.getElementsByClassName('tableWidget__rowHeader--disabled')
    ).toHaveLength(0);
  });
});
