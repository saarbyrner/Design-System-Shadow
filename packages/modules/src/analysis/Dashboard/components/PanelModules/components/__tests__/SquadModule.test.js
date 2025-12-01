import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VirtuosoMockContext } from 'react-virtuoso';

import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import * as Services from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import { EMPTY_SELECTION } from '@kitman/components/src/Athletes/constants';
import {
  NO_GROUPING,
  EDIT_GROUPING_KEY,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';
import * as SelectHooks from '@kitman/components/src/Select/hooks';

import SquadModule from '../SquadModule';

const squadAthletes = {
  squads: [
    {
      id: 8,
      name: 'International Squad',
      position_groups: [
        {
          id: 25,
          name: 'Forward',
          order: 1,
          positions: [
            {
              id: 72,
              name: 'Loose-head Prop',
              order: 1,
              athletes: [
                {
                  id: 33196,
                  firstname: 'Test',
                  lastname: 'Welcome Process',
                  fullname: 'Test Welcome Process',
                  shortname: 'T Welcome Process',
                  user_id: 37463,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

describe('analysis dashboard | <SquadModule />', () => {
  const props = {
    t: i18nextTranslateStub(),
    selectedPopulation: [],
    onSetPopulation: jest.fn(),
  };

  beforeEach(() => {
    jest.spyOn(Services, 'useGetAllSquadAthletesQuery').mockReturnValue({
      data: squadAthletes,
      isFetching: false,
    });

    jest.spyOn(Services, 'useGetActiveSquadQuery').mockReturnValue({
      data: { id: 9, name: 'International Squad', owner_id: 6 },
    });
  });

  const renderWithVirtuoso = (inputProps = props) => {
    const { container } = renderWithStore(<SquadModule {...inputProps} />, {
      wrapper: ({ children }) => (
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 2000, itemHeight: 50 }}
        >
          {children}
        </VirtuosoMockContext.Provider>
      ),
    });

    return container;
  };

  it('calls useGetAllSquadAthletesQuery with refreshCache: true', () => {
    const useGetAllSquadAthletesQuerySpy = jest.spyOn(
      Services,
      'useGetAllSquadAthletesQuery'
    );

    renderWithStore(<SquadModule {...props} />);

    expect(useGetAllSquadAthletesQuerySpy).toHaveBeenCalledWith({
      refreshCache: true,
    });
  });

  describe('athlete field', () => {
    it('renders the Athlete Select field', () => {
      renderWithStore(<SquadModule {...props} />);

      expect(screen.getByLabelText('Athletes')).toBeInTheDocument();
    });

    it('renders the Athlete Select field label from prop', () => {
      renderWithStore(<SquadModule {...props} label="Custom label" />);
      expect(screen.queryByLabelText('Athletes')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
    });

    it('renders a list of Athletes', async () => {
      const container = renderWithVirtuoso();

      // click on athlete select field
      await userEvent.click(
        container.querySelectorAll('.kitmanReactSelect input')[0]
      );

      expect(screen.getByText('Test Welcome Process')).toBeVisible();
    });

    it('calls onSetPopulation when athlete is selected', async () => {
      const container = renderWithVirtuoso();

      // click on athlete select field
      await userEvent.click(
        container.querySelectorAll('.kitmanReactSelect input')[0]
      );

      // click on athlete
      await userEvent.click(screen.getByText('Test Welcome Process'));

      expect(props.onSetPopulation).toHaveBeenCalledWith([
        {
          applies_to_squad: false,
          all_squads: false,
          position_groups: [],
          positions: [],
          athletes: [33196],
          squads: [],
          context_squads: [],
          users: [],
          labels: [],
          segments: [],
        },
      ]);
    });

    describe('ExtendedPopulation Athlete Select', () => {
      beforeEach(() => {
        window.setFlag('rep-labels-and-groups', true);

        jest.spyOn(Services, 'useGetPermissionsQuery').mockReturnValue({
          data: {
            analysis: {
              labelsAndGroups: { canReport: true },
              historicReporting: { canReport: false },
            },
          },
          isSuccess: true,
        });
      });

      afterEach(() => {
        window.setFlag('rep-labels-and-groups', false);
      });

      it('shows labels and groups tabs when FF, permissions, and props are configured properly', async () => {
        const container = renderWithVirtuoso({
          ...props,
          showExtendedPopulationOptions: true,
        });

        // click on the select field
        await userEvent.click(
          container.querySelectorAll('.kitmanReactSelect input')[0]
        );

        // the three tabs should be visible
        expect(screen.getByText('Squads')).toBeInTheDocument();
        expect(screen.getByText('Athlete Labels')).toBeInTheDocument();
        expect(screen.getByText('Athlete Groups')).toBeInTheDocument();
      });

      it('hides the menu after a user selects', async () => {
        const container = renderWithVirtuoso({
          ...props,
          showExtendedPopulationOptions: true,
        });

        // click on the select field
        await userEvent.click(
          container.querySelectorAll('.kitmanReactSelect input')[0]
        );

        // the three tabs should be visible - this is the select menu
        expect(screen.getByText('Squads')).toBeInTheDocument();
        expect(screen.getByText('Athlete Labels')).toBeInTheDocument();
        expect(screen.getByText('Athlete Groups')).toBeInTheDocument();

        await userEvent.click(screen.getByText('Test Welcome Process'));

        // the three tabs should no longer be visible
        expect(screen.queryByText('Squads')).not.toBeInTheDocument();
        expect(screen.queryByText('Athlete Labels')).not.toBeInTheDocument();
        expect(screen.queryByText('Athlete Groups')).not.toBeInTheDocument();
      });
    });

    it('keeps the menu open when isMultiSelect is true', async () => {
      const user = userEvent.setup();
      const container = renderWithVirtuoso({
        ...props,
        showExtendedPopulationOptions: true,
        isMultiSelect: true,
      });

      await user.click(
        container.querySelectorAll('.kitmanReactSelect input')[0]
      );
      await user.click(screen.getByText('Test Welcome Process'));

      // Menu should still be visible
      expect(await screen.findByText('Athletes')).toBeVisible();
      expect(await screen.findByText('Test Welcome Process')).toBeVisible();
    });
  });

  describe('squad field', () => {
    it('hides the squad field when a population has not been defined and FF table-widget-filter-test is false', () => {
      window.setFlag('table-widget-filter-test', false);

      renderWithStore(<SquadModule {...props} />);

      expect(
        screen.queryByLabelText('Include data from')
      ).not.toBeInTheDocument();
    });

    describe('when FF table-widget-filter-test is true', () => {
      beforeEach(() => {
        window.setFlag('table-widget-filter-test', true);
      });

      afterEach(() => {
        window.setFlag('table-widget-filter-test', false);
      });

      it('renders the squad field', () => {
        renderWithStore(<SquadModule {...props} />);

        expect(screen.getByLabelText('Include data from')).toBeInTheDocument();
      });
    });

    it('renders the Squad Select field once a population is defined', async () => {
      const updatedProps = {
        ...props,
        selectedPopulation: [
          {
            applies_to_squad: false,
            all_squads: false,
            position_groups: [],
            positions: [],
            athletes: [33196],
            squads: [],
            context_squads: [],
            users: [],
          },
        ],
      };

      renderWithStore(<SquadModule {...updatedProps} />);

      expect(screen.getByLabelText('Include data from')).toBeInTheDocument();
    });

    it('renders a list of Squads', async () => {
      const user = userEvent.setup();

      const updatedProps = {
        ...props,
        selectedPopulation: [
          {
            applies_to_squad: false,
            all_squads: false,
            position_groups: [],
            positions: [],
            athletes: [33196],
            squads: [],
            context_squads: [],
            users: [],
          },
        ],
      };

      const container = renderWithVirtuoso(updatedProps);

      // click on squad select field
      await user.click(
        container.querySelectorAll('.kitmanReactSelect input')[1]
      );

      expect(screen.getByText('All squads')).toBeVisible();
      expect(screen.getByText('International Squad')).toBeVisible();
    });

    it('prepopulates the selected squad if context_squad is defined in population', async () => {
      const updatedProps = {
        ...props,
        selectedPopulation: [
          {
            applies_to_squad: false,
            all_squads: false,
            position_groups: [],
            positions: [],
            athletes: [33196],
            squads: [],
            context_squads: [8],
            users: [],
          },
        ],
      };

      renderWithStore(<SquadModule {...updatedProps} />);

      expect(screen.getByText('International Squad')).toBeVisible();
    });

    it('calls onSetPopulation when a squad is selected with the context squad', async () => {
      const updatedProps = {
        ...props,
        selectedPopulation: [
          {
            applies_to_squad: false,
            all_squads: false,
            position_groups: [],
            positions: [],
            athletes: [33196],
            squads: [],
            context_squads: [],
            users: [],
          },
        ],
      };

      const container = renderWithVirtuoso(updatedProps);

      // click on squad select field
      await userEvent.click(
        container.querySelectorAll('.kitmanReactSelect input')[1]
      );

      // click on squad
      await userEvent.click(screen.getByText('International Squad'));

      expect(props.onSetPopulation).toHaveBeenCalledWith([
        {
          applies_to_squad: false,
          all_squads: false,
          position_groups: [],
          positions: [],
          athletes: [33196],
          squads: [],
          context_squads: [8],
          users: [],
        },
      ]);
    });

    it('calls onSetPopulation when a squad is selected and does not fill squad-context', async () => {
      const updatedProps = {
        ...props,
        selectedPopulation: [
          {
            applies_to_squad: false,
            all_squads: false,
            position_groups: [],
            positions: [],
            athletes: [33196],
            squads: [],
            context_squads: [],
            users: [],
          },
        ],
      };

      const container = renderWithVirtuoso(updatedProps);

      // click on athletes select field
      await userEvent.click(
        container.querySelectorAll('.kitmanReactSelect input')[0]
      );

      // click on International Squad
      const elements = screen.getAllByText('International Squad');
      await userEvent.click(elements[1]);

      expect(props.onSetPopulation).toHaveBeenCalledWith([
        {
          applies_to_squad: false,
          all_squads: false,
          position_groups: [],
          positions: [],
          athletes: [],
          squads: [8], // populated squad
          context_squads: [], // empty context squad
          users: [],
          labels: [],
          segments: [],
        },
      ]);
    });
  });

  describe('when FF rep-historic-reporting is true and the permission is true', () => {
    beforeEach(() => {
      window.setFlag('rep-historic-reporting', true);
      jest.spyOn(Services, 'useGetPermissionsQuery').mockReturnValue({
        data: {
          analysis: {
            historicReporting: { canReport: true },
            labelsAndGroups: { canReport: false },
          },
        },
        isSuccess: true,
      });
    });

    afterEach(() => {
      window.setFlag('rep-historic-reporting', false);
    });

    it('displays the current and historical segmented control', () => {
      renderWithStore(<SquadModule {...props} />);

      expect(screen.getByText('Current squads')).toBeInTheDocument();
      expect(screen.getByText('Historical squads')).toBeInTheDocument();
    });

    it('displays the regular module when historic is false', () => {
      renderWithStore(<SquadModule {...props} />);
      expect(screen.getByLabelText('Athletes')).toBeInTheDocument();
      expect(screen.queryByLabelText('Squads')).not.toBeInTheDocument();
    });

    it('displays the historic squad selector when historic is true', async () => {
      const user = userEvent.setup();
      renderWithStore(
        <SquadModule
          {...props}
          selectedPopulation={[
            {
              athletes: [],
              positions: [],
              position_groups: [],
              squads: [],
              historic: true,
            },
          ]}
        />
      );
      await user.click(screen.getByText('Historical squads'));
      expect(screen.getByLabelText('Squads')).toBeInTheDocument();
      expect(screen.queryByLabelText('Athletes')).not.toBeInTheDocument();
    });

    it('callS onSetPopulation with the expected payload', async () => {
      const user = userEvent.setup();
      renderWithStore(
        <SquadModule
          {...props}
          selectedPopulation={[
            {
              athletes: [],
              positions: [],
              position_groups: [],
              squads: [],
              historic: true,
            },
          ]}
        />
      );
      await user.click(screen.getByText('Current squads'));
      expect(props.onSetPopulation).toHaveBeenCalledWith([EMPTY_SELECTION]);
    });

    it('displays the context squad filter', async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();
      window.setFlag('table-widget-filter-test', true);
      renderWithStore(
        <SquadModule
          {...props}
          selectedPopulation={[
            {
              athletes: [],
              positions: [],
              position_groups: [],
              squads: [],
              historic: true,
            },
          ]}
          onSelectGrouping={onSelect}
        />
      );
      await user.click(screen.getByText('Historical squads'));
      expect(screen.getByLabelText('Squads')).toBeInTheDocument();
      expect(screen.queryByLabelText('Athletes')).not.toBeInTheDocument();
      expect(screen.getByText('Include data from')).toBeInTheDocument();
      expect(onSelect).toHaveBeenCalledWith({
        [EDIT_GROUPING_KEY]: NO_GROUPING,
      });

      window.setFlag('table-widget-filter-test', false);
    });

    it('does not show the toggle when the permission is false', () => {
      jest.spyOn(Services, 'useGetPermissionsQuery').mockReturnValue({
        data: {
          analysis: {
            historicReporting: { canReport: false },
            labelsAndGroups: { canReport: false },
          },
        },
        isSuccess: true,
      });
      renderWithStore(<SquadModule {...props} />);

      expect(screen.queryByText('Current squads')).not.toBeInTheDocument();
      expect(screen.queryByText('Historical squads')).not.toBeInTheDocument();
    });
  });

  describe('MenuListOverride', () => {
    let mockOnBlur;

    beforeEach(() => {
      window.setFlag('rep-labels-and-groups', true);

      jest.spyOn(Services, 'useGetPermissionsQuery').mockReturnValue({
        data: {
          analysis: {
            labelsAndGroups: { canReport: true },
            historicReporting: { canReport: false },
          },
        },
        isSuccess: true,
      });

      mockOnBlur = jest.fn();
      jest.spyOn(SelectHooks, 'useSelectContext').mockReturnValue({
        setSearchInputProps: jest.fn(),
        searchInputProps: {
          onBlur: mockOnBlur,
        },
      });
    });

    afterEach(() => {
      window.setFlag('rep-labels-and-groups', false);
      jest.restoreAllMocks();
    });

    it('close athlete menu when clicking away from the menu dropdown', async () => {
      const user = userEvent.setup();
      renderWithVirtuoso({
        ...props,
        showExtendedPopulationOptions: true,
        isMultiSelect: true,
      });

      // Open the select menu
      await user.click(screen.getByLabelText('Athletes'));

      // Menu is open, verify tabs are visible
      expect(screen.getByText('Athlete Groups')).toBeVisible();
      expect(screen.getByText('Athlete Labels')).toBeVisible();

      // Trigger ClickAwayListener
      await user.click(document.body);

      // Verify menu was closed
      expect(screen.queryByText('Athlete Groups')).not.toBeInTheDocument();
      expect(screen.queryByText('Athlete Labels')).not.toBeInTheDocument();
    });
  });
});
