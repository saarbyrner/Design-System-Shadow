/* eslint-disable jest/no-mocks-import */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from 'i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  useGetPermissionsQuery,
  useGetAllSquadAthletesQuery,
  useGetActiveSquadQuery,
  useGetAllLabelsQuery,
  useGetAllGroupsQuery,
} from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import { MOCK_CATEGORIZED_GROUPINGS } from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/chartBuilder';
import { useGetAllGroupingsQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/chartBuilder';
import { reducedSquadAthletes } from '@kitman/components/src/Athletes/__mocks__/squadAthletes';
import { VirtuosoMockContext } from 'react-virtuoso';
import ComparisonPanel from '../components/ComparisonPanel';

jest.mock('@kitman/modules/src/analysis/Dashboard/redux/services/dashboard');
jest.mock('@kitman/modules/src/analysis/Dashboard/redux/services/chartBuilder');
const onSetGroupings = jest.fn();

describe('ComparisonPanel', () => {
  const i18nT = i18nextTranslateStub(i18n);
  const baseSelectedPopulation = {
    athletes: [],
    positions: [],
    position_groups: [],
    squads: [],
    historic: false,
    all_squads: false,
    applies_to_squad: false,
    context_squads: [],
    labels: [],
    segments: [],
    users: [],
  };

  const props = {
    activeSquad: reducedSquadAthletes[0],
    selectedPopulation: [],
    onSetPopulation: jest.fn(),
    squadAthletes: reducedSquadAthletes,
    onApply: jest.fn(),
    isLoading: false,
    isOpen: true,
    isEditMode: false,
    onSetGroupings,
    t: i18nT,
  };

  const renderWithVirtuoso = (inputProps = props) => {
    render(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 2000, itemHeight: 50 }}
      >
        <ComparisonPanel {...inputProps} />
      </VirtuosoMockContext.Provider>
    );
  };

  beforeEach(() => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        analysis: {
          labelsAndGroups: { canReport: false },
          historicReporting: { canReport: false },
        },
      },
      isSuccess: true,
    });
    useGetAllSquadAthletesQuery.mockReturnValue({
      data: reducedSquadAthletes,
      isFetching: false,
    });
    useGetActiveSquadQuery.mockReturnValue({
      data: reducedSquadAthletes[0],
      isFetching: false,
    });
    useGetAllLabelsQuery.mockReturnValue({
      data: [],
    });
    useGetAllGroupsQuery.mockReturnValue({
      data: [],
    });
    useGetAllGroupingsQuery.mockReturnValue({
      data: MOCK_CATEGORIZED_GROUPINGS,
    });

    window.setFlag('rep-table-widget-dynamic-rows', true);
  });

  afterEach(() => {
    window.setFlag('rep-table-widget-dynamic-rows', false);
  });

  it('renders the AthleteSelector component', () => {
    renderWithVirtuoso();
    expect(screen.getByTestId('AthleteList|Virtuoso')).toBeInTheDocument();
  });

  it('calls "onSetGroupings" with the expected payload', async () => {
    const user = userEvent.setup();
    renderWithVirtuoso();
    await userEvent.click(
      screen.getByText(
        reducedSquadAthletes[0].position_groups[0].positions[0].athletes[0]
          .fullname
      )
    );

    await user.click(screen.getByText('Add grouping'));
    expect(screen.getByText('Groupings')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Group by'));
    await user.click(screen.getByText('Athlete'));
    expect(onSetGroupings).toHaveBeenCalledWith({
      0: 'grouping_a',
    });
  });

  describe('the actions footer', () => {
    it('renders the edit squad data button when population is selected', async () => {
      renderWithVirtuoso();
      await userEvent.click(
        screen.getByText(
          reducedSquadAthletes[0].position_groups[0].positions[0].athletes[0]
            .fullname
        )
      );
      expect(screen.getByText('Squad inclusion')).toBeInTheDocument();
      await userEvent.click(screen.getByText('Squad inclusion'));
      expect(screen.queryByText('Squad inclusion')).not.toBeInTheDocument();
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('renders the edit grouping data button when population is selected and FF is on', async () => {
      renderWithVirtuoso();
      await userEvent.click(
        screen.getByText(
          reducedSquadAthletes[0].position_groups[0].positions[0].athletes[0]
            .fullname
        )
      );
      expect(screen.getByText('Add grouping')).toBeInTheDocument();
      await userEvent.click(screen.getByText('Add grouping'));
      expect(screen.queryByText('Add grouping')).not.toBeInTheDocument();
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('does not render the edit grouping data button when population is selected and FF is off', async () => {
      window.setFlag('rep-table-widget-dynamic-rows', false);

      renderWithVirtuoso();
      await userEvent.click(
        screen.getByText(
          reducedSquadAthletes[0].position_groups[0].positions[0].athletes[0]
            .fullname
        )
      );

      expect(screen.queryByText('Add grouping')).not.toBeInTheDocument();
    });

    it('renders the Apply button', () => {
      renderWithVirtuoso();
      expect(screen.getByText('Apply')).toBeInTheDocument();
    });
  });

  describe('when editMode is active', () => {
    const updatedProps = {
      ...props,
      isEditMode: true,
    };

    it('doesnt render the athlete selector', () => {
      renderWithVirtuoso(updatedProps);
      expect(
        screen.queryByTestId('AthleteList|Virtuoso')
      ).not.toBeInTheDocument();
    });

    it('renders the squad module', () => {
      renderWithVirtuoso(updatedProps);
      expect(screen.getByText('Athletes')).toBeInTheDocument();
    });

    it('renders the grouping selector with a list of population groupings', async () => {
      const user = userEvent.setup();
      renderWithVirtuoso(updatedProps);

      const groupBySelector = screen.getByLabelText('Group by');

      expect(groupBySelector).toBeInTheDocument();

      await user.click(groupBySelector);

      expect(screen.getByText('Athlete')).toBeVisible();
      expect(screen.getByText('No grouping')).toBeVisible();
    });

    describe('group by drill', () => {
      it('renders Drill as a grouping option when FF rep-group-by-drill is true', async () => {
        window.setFlag('rep-group-by-drill', true);

        const user = userEvent.setup();
        renderWithVirtuoso(updatedProps);

        const groupBySelector = screen.getByLabelText('Group by');

        expect(groupBySelector).toBeInTheDocument();

        await user.click(groupBySelector);

        expect(screen.getByText('Drill')).toBeVisible();
      });

      it('does not render Drill as a grouping option when FF rep-group-by-drill is false', async () => {
        window.setFlag('rep-group-by-drill', false);

        const user = userEvent.setup();
        renderWithVirtuoso(updatedProps);

        const groupBySelector = screen.getByLabelText('Group by');

        expect(groupBySelector).toBeInTheDocument();

        await user.click(groupBySelector);

        expect(screen.queryByText('Drill')).not.toBeInTheDocument();
      });
    });

    it('does not render the grouping selector when FF is off', () => {
      window.setFlag('rep-table-widget-dynamic-rows', false);
      renderWithVirtuoso(updatedProps);

      expect(screen.queryByText('No grouping')).not.toBeInTheDocument();
    });

    it('doesnt render the edit squad data button', () => {
      renderWithVirtuoso(updatedProps);
      expect(screen.queryByText('Squad inclusion')).not.toBeInTheDocument();
    });

    it('does not render the edit grouping data button', () => {
      renderWithVirtuoso(updatedProps);
      expect(screen.queryByText('Add grouping')).not.toBeInTheDocument();
    });
  });

  describe('when FF rep-historic-reporting is on', () => {
    const baseHistoricPopulation = {
      ...props,
      selectedPopulation: [{ ...baseSelectedPopulation, historic: true }],
    };
    beforeEach(() => {
      window.setFlag('rep-historic-reporting', true);
      useGetPermissionsQuery.mockReturnValue({
        data: {
          analysis: {
            historicReporting: { canReport: true },
          },
        },
        isSuccess: true,
      });
    });

    afterEach(() => {
      window.setFlag('rep-historic-reporting', false);
    });
    it('displays the current and historical segmented control', () => {
      renderWithVirtuoso();

      expect(screen.getByText('Current squads')).toBeInTheDocument();
      expect(screen.getByText('Historical squads')).toBeInTheDocument();
    });

    it('displays the regular module when historic is false', () => {
      renderWithVirtuoso();
      expect(
        screen.queryByTestId('HistoricalSquadList')
      ).not.toBeInTheDocument();
    });
    it('displays the historic squad list when isHistoricSquadActive is true', async () => {
      const user = userEvent.setup();
      renderWithVirtuoso(baseHistoricPopulation);

      await user.click(screen.getByText('Historical squads'));
      expect(screen.getByTestId('HistoricalSquadList')).toBeInTheDocument();
      expect(screen.queryByLabelText('Athletes')).not.toBeInTheDocument();
    });

    it('calls onSetPopulation with the correct payload when selecting a squad', async () => {
      const user = userEvent.setup();
      renderWithVirtuoso(baseHistoricPopulation);

      await user.click(screen.getByText('Historical squads'));
      await userEvent.click(screen.getByText(reducedSquadAthletes[1].name));
      expect(props.onSetPopulation).toHaveBeenCalledWith([
        {
          ...baseSelectedPopulation,
          historic: true,
          squads: [reducedSquadAthletes[1].id],
        },
      ]);
    });

    it('does not display grouping selector when population is historic', async () => {
      const user = userEvent.setup();
      renderWithVirtuoso(baseHistoricPopulation);

      await user.click(screen.getByText('Historical squads'));
      await user.click(screen.getByText(reducedSquadAthletes[1].name));
      await user.click(screen.getByText(reducedSquadAthletes[0].name));

      expect(screen.queryByText('Add grouping')).not.toBeInTheDocument();
    });

    it('calls onSetPopulation with the correct payload when de-selecting a squad', async () => {
      const user = userEvent.setup();
      renderWithVirtuoso(baseHistoricPopulation);

      await user.click(screen.getByText('Historical squads'));
      // select two options
      await user.click(screen.getByText(reducedSquadAthletes[0].name));
      await user.click(screen.getByText(reducedSquadAthletes[1].name));
      // un-select one option
      await user.click(screen.getByText(reducedSquadAthletes[1].name));
      expect(props.onSetPopulation).toHaveBeenCalledWith([
        {
          ...baseSelectedPopulation,
          historic: true,
          squads: [reducedSquadAthletes[0].id],
        },
      ]);
    });

    it('displays the Squad inclusion button when historical squad is selected', async () => {
      const user = userEvent.setup();
      renderWithVirtuoso(baseHistoricPopulation);

      await user.click(screen.getByText('Historical squads'));
      await user.click(screen.getByText(reducedSquadAthletes[1].name));
      expect(screen.getByText('Squad inclusion')).toBeInTheDocument();
    });

    it('does not show toggle when permission is false', () => {
      useGetPermissionsQuery.mockReturnValue({
        data: {
          analysis: {
            historicReporting: { canReport: false },
          },
        },
        isSuccess: true,
      });

      renderWithVirtuoso();

      expect(screen.queryByText('Current squads')).not.toBeInTheDocument();
      expect(screen.queryByText('Historical squads')).not.toBeInTheDocument();
    });
  });
});
