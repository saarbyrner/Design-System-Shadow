import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { VirtuosoMockContext } from 'react-virtuoso';
import {
  useGetActiveSquadQuery,
  useGetOrganisationQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { staffUser1 } from '@kitman/services/src/mocks/handlers/medical/getStaffUsers';
import athletesMockData, {
  athlete1,
} from '@kitman/services/src/mocks/handlers/getSquadAthletes/squadAthletesData.mock';

import { getIsRepeatEvent } from '@kitman/common/src/utils/events';

import {
  eventTypeWithParentAssociation,
  eventTypeWithSquads,
  data as mockCustomEventData,
  squadResponseData,
} from '@kitman/services/src/mocks/handlers/planning/getCustomEventTypes';

import { CustomEventLayoutTranslated as CustomEventLayout } from '../CustomEventLayout';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/common/src/utils/events');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  globalApi: {
    useGetActiveSquadQuery: jest.fn(),
  },
});

const renderComponent = (children) => {
  return render(<Provider store={defaultStore}>{children}</Provider>);
};

describe('CustomEventLayout', () => {
  const testValidity = {
    event_location: { isInvalid: false },
  };
  const baseProps = {
    event: {
      id: 5,
      custom_event_type: mockCustomEventData[0],
      type: 'custom_event',
    },
    eventValidity: testValidity,
    onUpdateEventDetails: jest.fn(),
    onUpdateEventTitle: jest.fn(),
  };

  beforeEach(() => {
    getIsRepeatEvent.mockReturnValue(false);
    useGetActiveSquadQuery.mockReturnValue({
      data: {
        id: 8,
        name: 'International Squad',
        owner_id: 1234,
      },
      isSuccess: true,
    });

    useGetOrganisationQuery.mockReturnValue({
      data: {
        id: 1,
        name: 'Test Org',
        association_name: 'Test Association',
      },
    });
  });

  describe('event type select', () => {
    const PCLearningSessionsTypeText = 'Player Care - Learning Sessions';

    it('renders', async () => {
      renderComponent(<CustomEventLayout {...baseProps} />);
      expect(await screen.findByLabelText('Event Type')).toBeInTheDocument();
    });

    it('shows group headers and ungrouped options on the first page', async () => {
      renderComponent(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 200, itemHeight: 50 }}
        >
          <CustomEventLayout {...baseProps} />
        </VirtuosoMockContext.Provider>
      );

      // Wait for the currently selected data to load
      const selectLabel = await screen.findByText(mockCustomEventData[0].name);

      // Click to open the menu
      selectEvent.openMenu(selectLabel);
      const occurrences = await screen.findAllByText(
        mockCustomEventData[0].name
      );
      expect(occurrences.length).toEqual(2);
      expect(screen.getByText(mockCustomEventData[3].name)).toBeInTheDocument();

      expect(
        screen.getByText('Player Care - Mental Wellbeing')
      ).toBeInTheDocument();
      expect(screen.getByText(PCLearningSessionsTypeText)).toBeInTheDocument();
    });

    it('shows children when selecting a parent', async () => {
      renderComponent(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 200, itemHeight: 50 }}
        >
          <CustomEventLayout {...baseProps} />{' '}
        </VirtuosoMockContext.Provider>
      );

      // Wait for the currently selected data to load
      const selectLabel = await screen.findByText(mockCustomEventData[0].name);

      // Click to open the menu
      selectEvent.openMenu(selectLabel);

      expect(
        await screen.findByText(PCLearningSessionsTypeText)
      ).toBeInTheDocument();

      // Click to select the parent
      await userEvent.click(
        await screen.findByText(PCLearningSessionsTypeText)
      );

      expect(
        await screen.findByText(mockCustomEventData[2].name)
      ).toBeInTheDocument();
    });

    it('shows archived custom event type if it is not in the list', async () => {
      const newProps = {
        ...baseProps,
        event: {
          custom_event_type: {
            id: 84726,
            name: 'Event Type NOT in mock hander',
            parents: [],
            is_selectable: true,
          },
        },
      };
      renderComponent(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 200, itemHeight: 50 }}
        >
          <CustomEventLayout {...newProps} />{' '}
        </VirtuosoMockContext.Provider>
      );

      // Wait for the currently selected data to load
      const selectLabel = await screen.findByText(
        newProps.event.custom_event_type.name
      );
      // Click to open the menu
      selectEvent.openMenu(selectLabel);

      const allWithTypeName = await screen.findAllByText(
        newProps.event.custom_event_type.name
      );
      expect(allWithTypeName.length).toEqual(2);

      expect(screen.getByText(mockCustomEventData[0].name)).toBeInTheDocument();
    });

    it('calls onUpdateEventDetails with the correct data', async () => {
      renderComponent(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 200, itemHeight: 50 }}
        >
          <CustomEventLayout {...baseProps} />
        </VirtuosoMockContext.Provider>
      );

      // Wait for the currently selected data to load
      const selectLabel = await screen.findByText(mockCustomEventData[0].name);

      // Click to open the menu
      selectEvent.openMenu(selectLabel);

      // Click on a parent
      await userEvent.click(
        await screen.findByText('Player Care - Mental Wellbeing')
      );

      // Click on a child
      await userEvent.click(
        await screen.findByText(mockCustomEventData[1].name)
      );

      expect(baseProps.onUpdateEventDetails).toHaveBeenCalledWith({
        custom_event_type: { id: mockCustomEventData[1].id },
        // title should autofill when a custom event type is created
        title: mockCustomEventData[1].name,
      });
    });

    describe('when squad-scoped-custom-events FF is on', () => {
      beforeEach(() => {
        window.featureFlags['squad-scoped-custom-events'] = true;
        renderComponent(
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 200, itemHeight: 50 }}
          >
            <CustomEventLayout
              {...baseProps}
              event={{
                ...baseProps.event,
                custom_event_type: squadResponseData[0],
                athlete_ids: [4, 5, 6],
              }}
            />
          </VirtuosoMockContext.Provider>
        );
      });

      afterEach(() => {
        window.featureFlags['squad-scoped-custom-events'] = false;
      });

      it('passes through current squad id correctly', async () => {
        // Wait for the currently selected data to load
        const selectLabel = await screen.findByText(squadResponseData[0].name);

        // Click to open the menu
        selectEvent.openMenu(selectLabel);
        const occurrences = await screen.findAllByText(
          squadResponseData[0].name
        );
        expect(occurrences.length).toEqual(2);
        expect(screen.getByText(squadResponseData[1].name)).toBeInTheDocument();
      });

      it('clears athlete list when custom event type switches', async () => {
        // Wait for the currently selected data to load
        const selectLabel = await screen.findByText(squadResponseData[0].name);

        // Click to open the menu
        selectEvent.openMenu(selectLabel);
        await userEvent.click(screen.getByText(squadResponseData[1].name));

        expect(baseProps.onUpdateEventDetails).toHaveBeenCalledWith({
          custom_event_type: {
            id: squadResponseData[1].id,
            squads: [{ id: 8 }],
          },
          // title should autofill when a custom event type is created
          title: squadResponseData[1].name,
          // clear the athlete ids
          athlete_ids: [],
        });
      });
    });
  });

  describe('common fields', () => {
    it('renders', async () => {
      renderComponent(<CustomEventLayout {...baseProps} />);
      expect(await screen.findByText('Title')).toBeInTheDocument();
      expect(await screen.findByText('Date')).toBeInTheDocument();
      expect(await screen.findByText('Start Time')).toBeInTheDocument();
      expect(await screen.findByText('Duration')).toBeInTheDocument();
      expect(await screen.findByText('Timezone')).toBeInTheDocument();
      expect(await screen.findByText('Description')).toBeInTheDocument();
    });
  });

  describe('staff select', () => {
    it('renders', async () => {
      renderComponent(<CustomEventLayout {...baseProps} />);
      expect(await screen.findByLabelText('Staff')).toBeInTheDocument();
    });

    it('finds the selected staff member in the DOM after they have already been chosen before', async () => {
      const normalisedStaffName = 'Stuart O Brien';
      renderComponent(
        <CustomEventLayout
          {...baseProps}
          event={{ ...baseProps.event, user_ids: [staffUser1.id] }}
        />
      );

      const staffSelectLabel = screen.getByLabelText('Staff');

      await waitFor(() => {
        expect(screen.queryByText('No staff selected')).not.toBeInTheDocument();
      });

      selectEvent.openMenu(staffSelectLabel);

      const allWithTextOfStaffUserFullName = await screen.findAllByText(
        normalisedStaffName
      );

      expect(allWithTextOfStaffUserFullName.length).toEqual(2); // One in the Select, one in the menu
    });
  });

  describe('athlete select', () => {
    const internationalSquadAthleteIds =
      athletesMockData.squads[0].position_groups[0].positions[0].athletes.map(
        (athlete) => athlete.id
      );

    it('renders', async () => {
      renderComponent(<CustomEventLayout {...baseProps} />);
      expect(await screen.findByLabelText('Athletes')).toBeInTheDocument();
    });

    it('finds the selected athletes in the DOM after they have already been chosen before', async () => {
      renderComponent(
        <CustomEventLayout
          {...baseProps}
          event={{ ...baseProps.event, athlete_ids: [athlete1.id] }}
        />
      );

      const athletesSelectLabel = screen.getByLabelText('Athletes');

      expect(await screen.findByText(athlete1.fullname)).toBeInTheDocument();

      selectEvent.openMenu(athletesSelectLabel);

      const allWithTextOfAthleteUserFullName = await screen.findAllByText(
        athlete1.fullname
      );

      expect(allWithTextOfAthleteUserFullName.length).toEqual(1);
    });

    /**
     * @param {string} squadName
     */
    const selectSquad = async (squadName) => {
      await waitFor(async () => {
        const options = screen.getAllByTestId('List.Option|title');
        const squadOption = options.find(
          (option) => option.textContent === squadName
        );
        await selectEvent.select(squadOption, squadName);
      });
    };

    const getSelectAllButton = () => screen.getByText('Select all');

    describe('when squad-scoped-custom-events FF is on', () => {
      beforeEach(() => {
        window.featureFlags['squad-scoped-custom-events'] = true;
      });

      afterEach(() => {
        window.featureFlags['squad-scoped-custom-events'] = false;
      });
      test('that athletes are scoped to custom event with squads', async () => {
        renderComponent(
          <CustomEventLayout
            {...baseProps}
            event={{
              ...baseProps.event,
              id: 5,
              custom_event_type: eventTypeWithSquads,
            }}
          />
        );
        expect(
          await screen.findByText(eventTypeWithSquads.name)
        ).toBeInTheDocument();

        const athletesSelectLabel = screen.getByLabelText('Athletes');
        selectEvent.openMenu(athletesSelectLabel);

        expect(
          await screen.findByText(athletesMockData.squads[0].name)
        ).toBeInTheDocument();
        expect(
          screen.queryByText(athletesMockData.squads[1].name)
        ).not.toBeInTheDocument();
      });

      test('that athletes are not scoped to custom event without squads - all appear', async () => {
        renderComponent(
          <CustomEventLayout
            {...baseProps}
            event={{
              ...baseProps.event,
              id: 5,
              custom_event_type: eventTypeWithParentAssociation,
            }}
          />
        );

        expect(
          await screen.findByText(eventTypeWithParentAssociation.name)
        ).toBeInTheDocument();

        const athletesSelectLabel = screen.getByLabelText('Athletes');
        selectEvent.openMenu(athletesSelectLabel);

        expect(
          screen.getByText(athletesMockData.squads[0].name)
        ).toBeInTheDocument();
        expect(
          screen.getByText(athletesMockData.squads[1].name)
        ).toBeInTheDocument();
      });
    });

    test('that selectAll of squad works', async () => {
      const user = userEvent.setup();
      renderComponent(<CustomEventLayout {...baseProps} />);

      const athletesSelectLabel = await screen.findByLabelText('Athletes');
      selectEvent.openMenu(athletesSelectLabel);

      const squadName = athletesMockData.squads[0].name;

      await selectSquad(squadName);

      const selectAllButton = getSelectAllButton();
      expect(selectAllButton).toBeInTheDocument();

      await waitFor(async () => {
        await user.click(selectAllButton);
        expect(baseProps.onUpdateEventDetails).toHaveBeenCalledWith({
          athlete_ids: internationalSquadAthleteIds,
        });
      });
    });

    test('that clicking on selectAll will add ids to existing choice and not replace', async () => {
      const user = userEvent.setup();
      renderComponent(
        <CustomEventLayout
          {...{
            ...baseProps,
            event: {
              ...baseProps.event,
              athlete_ids: internationalSquadAthleteIds,
            },
          }}
        />
      );

      const athletesSelectLabel = await screen.findByLabelText('Athletes');
      selectEvent.openMenu(athletesSelectLabel);

      const squad = athletesMockData.squads[1];
      const squadName = squad.name;
      const squadAthleteIds =
        squad.position_groups[0].positions[0].athletes.map(
          (athelte) => athelte.id
        );

      await selectSquad(squadName);

      await waitFor(async () => {
        await user.click(getSelectAllButton());
        expect(baseProps.onUpdateEventDetails).toHaveBeenCalledWith({
          athlete_ids: [...squadAthleteIds, ...internationalSquadAthleteIds],
        });
      });
    });
  });

  describe('when event-locations FF is on', () => {
    beforeEach(() => {
      window.featureFlags['event-locations'] = true;
    });
    afterEach(() => {
      window.featureFlags['event-locations'] = true;
    });
    it('renders', async () => {
      renderComponent(<CustomEventLayout {...baseProps} />);
      expect(await screen.findByText('Location')).toBeInTheDocument();
    });
  });
});
