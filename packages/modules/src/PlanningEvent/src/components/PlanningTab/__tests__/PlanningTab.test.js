import {
  render,
  screen,
  within,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VirtuosoMockContext } from 'react-virtuoso';

import { intensities } from '@kitman/common/src/types/Event';
import { data as activityTypes } from '@kitman/services/src/mocks/handlers/planningHub/getActivityTypes';
import { PlanningEventContextProvider } from '@kitman/modules/src/PlanningEvent/src/contexts/PlanningEventContext';
import {
  buildEvent,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import PlanningTab from '../index';

jest.mock(
  '@kitman/modules/src/img/planning/soccer_drill_diagram_placeholder.svg',
  () => null
);
jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<PlanningTab />', () => {
  const trackEventMock = jest.fn();

  beforeAll(() => {
    const spy = jest.spyOn(document, 'getElementById');
    const mockElement = document.createElement('div');
    mockElement.setAttribute('id', 'planningEvent-Slideout');
    document.body.appendChild(mockElement);
    spy.mockReturnValue(mockElement);
    useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
  });

  const noteContent = 'Note.';

  const sharedLabels = [
    { name: 'shared label 1', id: 99 },
    { name: 'shared label 2', id: 100 },
  ];
  const getActivity = (id) => {
    return {
      id,
      duration: 65,
      event_activity_drill: {
        id,
        name: `Name ${id}`,
        notes: `<div>${id} ${noteContent}</div>`,
        intensity: intensities.Moderate,
        diagram: {
          id,
          url: `https://example.com/${id}.jpeg`,
        },
        event_activity_type: {
          event_activity_type_category: null,
          id: 2,
          name: 'Training',
        },
        library: true,
        attachments: [],
        links: [],
        principles: [1, 2, 3].map((principleId) => ({
          id: principleId,
          name: `principle ${principleId}`,
        })),
        event_activity_drill_labels: [
          { name: `label ${id}`, id },
          ...sharedLabels,
        ],
        squads: [{ id: 1 }],
      },
    };
  };
  const props = {
    event: buildEvent(),
    activityTypes,
    t: i18nextTranslateStub(),
    squadId: 1,
    organisationSport: 'soccer',
    areCoachingPrinciplesEnabled: true,
  };
  const planningEventContextProviderValue = {
    dispatch: jest.fn(),
    athleteEvents: [],
    selectionHeadersSummaryState: [],
  };

  it('shows activities in the order they are received', async () => {
    const activities = [1, 2, 3].map(getActivity);

    render(
      <PlanningEventContextProvider value={planningEventContextProviderValue}>
        <PlanningTab {...props} activities={activities} />
      </PlanningEventContextProvider>
    );

    await screen.findByText(activities[0].event_activity_drill.name);

    const wrappers = screen.getAllByTestId('activity-wrapper');

    activities.forEach(({ event_activity_drill: drill }, i) => {
      expect(within(wrappers[i]).getByText(drill.name)).toBeInTheDocument();
    });
  });

  describe('Drill item actions', () => {
    let activities;
    beforeEach(() => {
      activities = [1, 2, 3].map(getActivity);
    });

    it('correctly creates a drill item', async () => {
      const user = userEvent.setup();
      render(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 160, itemHeight: 40 }}
        >
          <PlanningEventContextProvider
            value={planningEventContextProviderValue}
          >
            <PlanningTab
              activityTypes={activityTypes}
              activities={activities}
              event={{ ...buildEvent(), type: 'session_event' }}
              onActivitiesUpdate={jest.fn()}
              t={(key) => key}
            />
          </PlanningEventContextProvider>
        </VirtuosoMockContext.Provider>
      );

      expect(
        await screen.findAllByRole('img', { name: /drill diagram/i })
      ).toHaveLength(3);

      // open create drill side panel
      await user.click(screen.getByTestId('create-new-drill-button'));

      fireEvent.change(screen.getByRole('textbox', { name: 'drill_name' }), {
        target: { value: 'Paris Marathon' },
      });

      await user.click(screen.getByText('Select'));
      await user.click(screen.getAllByText('Training')[1]);

      await user.click(screen.getAllByRole('button', { name: 'Add' })[1]);
      // fourth diagram added = fourth drill
      expect(
        screen.getAllByRole('img', { name: /drill diagram/i })
      ).toHaveLength(4);

      expect(trackEventMock).toHaveBeenNthCalledWith(
        1,
        'Calendar — Session details — Planning tab — Add drill — Create new drill — Add (create a new drill)',
        {
          '# of principles added': 0,
          From: 'Coaching library',
          Library: false,
        }
      );
      expect(trackEventMock).toHaveBeenNthCalledWith(
        2,
        'Calendar — Session details — Planning — Add drill (Add a drill to a session)',
        {
          Favourites: false,
        }
      );
    });

    it('correctly edits a drill item', async () => {
      const user = userEvent.setup();

      render(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 160, itemHeight: 40 }}
        >
          <PlanningEventContextProvider
            value={planningEventContextProviderValue}
          >
            <PlanningTab
              activityTypes={activityTypes}
              activities={activities}
              event={{ ...buildEvent(), type: 'session_event' }}
              onActivitiesUpdate={jest.fn()}
              t={(key) => key}
            />
          </PlanningEventContextProvider>
        </VirtuosoMockContext.Provider>
      );

      await waitFor(() =>
        expect(screen.getByText('Name 1')).toBeInTheDocument()
      );

      // open edit side‑panel
      await user.click(screen.getByText('Name 1'));

      fireEvent.change(screen.getByRole('textbox', { name: 'drill_name' }), {
        target: { value: 'Updating Drill item' },
      });

      await user.click(screen.getByRole('button', { name: 'Update' }));
      await user.click(screen.getAllByText('Update in the session only')[1]);

      expect(screen.queryByText('Name 1')).not.toBeInTheDocument();
      expect(screen.getByText('Updating Drill item')).toBeInTheDocument();
    });

    // Current code should always update `Session Level Type` & `Drill Level type` to be the same but this test is to ensure they point to the different/correct values
    it('correctly displays `Session Level Type` on the drill and the `Drill Level type` on the drill', async () => {
      const newActivities = [1].map(getActivity);
      newActivities[0].event_activity_type = {
        id: 83,
        event_activity_type_category: null,
        name: 'Tester',
      };
      render(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 160, itemHeight: 40 }}
        >
          <PlanningEventContextProvider
            value={planningEventContextProviderValue}
          >
            <PlanningTab
              event={buildEvent()}
              activityTypes={activityTypes}
              activities={newActivities}
              onActivitiesUpdate={jest.fn()}
              t={(key) => key}
            />
          </PlanningEventContextProvider>
        </VirtuosoMockContext.Provider>
      );

      await waitFor(() =>
        expect(screen.getByText('Tester')).toBeInTheDocument()
      );

      expect(screen.getByText('Training')).toBeInTheDocument();

      // open edit side panel
      await userEvent.click(screen.getByText('Name 1'));
      expect(screen.getAllByText('Training').length).toBe(2);
    });

    it('shows ‘Add drill from library’ if coaching-library feature flag is on', () => {
      window.featureFlags = { 'coaching-library': true };
      render(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 160, itemHeight: 40 }}
        >
          <PlanningEventContextProvider
            value={planningEventContextProviderValue}
          >
            <PlanningTab
              activityTypes={activityTypes}
              activities={activities}
              event={buildEvent()}
              onActivitiesUpdate={jest.fn()}
              t={(key) => key}
            />
          </PlanningEventContextProvider>
        </VirtuosoMockContext.Provider>
      );

      expect(
        screen.getByRole('button', {
          name: 'Add drill from library',
        })
      ).toBeInTheDocument();

      window.featureFlags = { 'coaching-library': false };
    });

    it('doesn’t show ‘Add drill from library’ if coaching-library feature flag is off', () => {
      render(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 160, itemHeight: 40 }}
        >
          <PlanningEventContextProvider
            value={planningEventContextProviderValue}
          >
            <PlanningTab
              activityTypes={activityTypes}
              activities={activities}
              event={buildEvent()}
              onActivitiesUpdate={jest.fn()}
              t={(key) => key}
            />
          </PlanningEventContextProvider>
        </VirtuosoMockContext.Provider>
      );

      expect(
        screen.queryByRole('button', {
          name: 'Add drill from library',
        })
      ).not.toBeInTheDocument();
    });
  });
});
