import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { axios } from '@kitman/common/src/utils/services';
import WorkloadUnitFields from '../common/WorkloadUnitFields';

describe('PlanningEventSidePanel <WorkloadUnitFields /> component', () => {
  const testEvent = {
    type: 'game_event',
    workload_units: {
      rugby_scrums: 1,
      rugby_rucks: 2,
      meters_ran: 200,
    },
  };

  const props = {
    event: testEvent,
    onUpdateEventDetails: jest.fn(),
    onDataLoadingStatusChanged: jest.fn(),
  };

  const getActiveSquadResponse = {
    id: 8,
    name: 'International Squad',
  };

  const getEventQuantitiesResponse = {
    setlist: {
      metadata: {
        id: 2,
        name: 'Mock data setlist',
        description: 'A setlist for testing',
        sport_id: 2,
        level: 'event',
      },
      units: [
        {
          id: 10298,
          name: 'Scrums',
          description: 'Number of rugby scrums',
          perma_id: 'rugby_scrums',
          variable_type_id: 1,
          min: 0,
          max: null,
          unit: null,
          rounding_places: 0,
        },
        {
          id: 10300,
          name: 'Rucks',
          description: 'Number of rugby rucks',
          perma_id: 'rugby_rucks',
          variable_type_id: 1,
          min: 0,
          max: null,
          unit: null,
          rounding_places: 1,
        },
        {
          id: 10301,
          name: 'Meters Ran',
          description: 'Number of meters ran',
          perma_id: 'meters_ran',
          variable_type_id: 1,
          min: 0,
          max: 100,
          unit: 'm',
          rounding_places: 0,
        },
      ],
    },
  };

  describe('when WorkloadUnitFields loads', () => {
    let getActiveSquadRequest;
    let getEventQuantitiesRequest;

    beforeEach(() => {
      getActiveSquadRequest = jest
        .spyOn(axios, 'get')
        .mockImplementation(() =>
          Promise.resolve({ data: getActiveSquadResponse })
        );
      getEventQuantitiesRequest = jest
        .spyOn(axios, 'post')
        .mockImplementation(() =>
          Promise.resolve({ data: getEventQuantitiesResponse })
        );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('renders Numeric inputs for each workload unit', async () => {
      render(<WorkloadUnitFields {...props} />);

      // Fetch the active squad and event quantities
      await waitFor(() => {
        expect(getActiveSquadRequest).toHaveBeenCalled();
        expect(getEventQuantitiesRequest).toHaveBeenCalled();
      });

      expect(getActiveSquadRequest).toHaveBeenCalledWith(
        '/ui/squads/active_squad'
      );
      expect(getEventQuantitiesRequest).toHaveBeenCalledWith(
        '/workloads/events/event_quantities',
        {
          event_type: 'game',
          squad_id: 8,
        }
      );

      const inputs = screen.getAllByRole('spinbutton');
      expect(inputs).toHaveLength(3);

      const scrums = inputs[0];
      expect(screen.getByText('Scrums')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1')).toBeInTheDocument();
      expect(scrums).toBeEnabled();

      const rucks = inputs[1];
      expect(screen.getByText('Rucks')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2')).toBeInTheDocument();
      expect(rucks).toBeEnabled();

      const metersRan = inputs[2];
      expect(screen.getByText('Meters Ran')).toBeInTheDocument();
      expect(screen.getByDisplayValue('200')).toBeInTheDocument();
      expect(screen.getByText('m')).toBeInTheDocument();
      expect(metersRan).toBeEnabled();
    });

    it('calls onUpdateEventDetails callback for each Numeric input', async () => {
      render(<WorkloadUnitFields {...props} />);

      // Fetch the active squad and event quantities
      await waitFor(() => {
        expect(getActiveSquadRequest).toHaveBeenCalled();
        expect(getEventQuantitiesRequest).toHaveBeenCalled();
      });

      const inputs = screen.getAllByRole('spinbutton');
      const scrums = inputs[0];
      const rucks = inputs[1];
      const metersRan = inputs[2];

      await fireEvent.change(scrums, { target: { value: '-3' } });

      expect(props.onUpdateEventDetails).toHaveBeenNthCalledWith(1, {
        workload_units: {
          rugby_scrums: -3,
          rugby_rucks: 2,
          meters_ran: 200,
        },
      });

      await fireEvent.change(rucks, { target: { value: '4' } });

      expect(props.onUpdateEventDetails).toHaveBeenNthCalledWith(2, {
        workload_units: {
          rugby_scrums: -3,
          rugby_rucks: 4,
          meters_ran: 200,
        },
      });

      await fireEvent.change(metersRan, { target: { value: '99' } });

      expect(props.onUpdateEventDetails).toHaveBeenNthCalledWith(3, {
        workload_units: {
          rugby_scrums: -3,
          rugby_rucks: 4,
          meters_ran: 99,
        },
      });
    });
  });
});
