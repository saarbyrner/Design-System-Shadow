import 'core-js/stable/structured-clone';

import { data as squadAthletesData } from '@kitman/services/src/mocks/handlers/getSquadAthletes';
import {
  mapParentChildEventTypes,
  athletesExistInSquad,
  filterSquads,
  mapToEventTypes,
} from '../utils';

describe('utils', () => {
  describe('mapParentChildEventTypes', () => {
    const squads = [{ id: 8 }];
    const input = [
      {
        id: 1,
        name: 'Child 1',
        parentLabel: 'Parent 1 - Test',
        squads,
      },
      {
        id: 2,
        name: 'Child 2',
        parentLabel: 'Parent 1 - Test',
        squads,
      },
      {
        id: 3,
        name: 'Child 3',
        parentLabel: 'Parent 1 - Test',
        squads,
      },
      {
        id: 4,
        name: 'Child 4',
        parentLabel: 'Parent 2 - Test 1',
        squads,
      },
      {
        id: 5,
        name: 'Child 5',
        parentLabel: 'Parent 2 - Test 1',
        squads,
      },
    ];
    it('returns the expected map', () => {
      const result = mapParentChildEventTypes(input);
      expect(result).toEqual([
        {
          label: input[0].parentLabel,
          options: [
            { label: input[0].name, value: input[0].id },
            { label: input[1].name, value: input[1].id },
            { label: input[2].name, value: input[2].id },
          ],
        },
        {
          label: input[3].parentLabel,
          options: [
            { label: input[3].name, value: input[3].id },
            { label: input[4].name, value: input[4].id },
          ],
        },
      ]);
    });

    describe('when squad scoped custom events FF is on', () => {
      beforeEach(() => {
        window.featureFlags['squad-scoped-custom-events'] = true;
      });

      afterEach(() => {
        window.featureFlags['squad-scoped-custom-events'] = false;
      });
      it('includes the squads in response', () => {
        const result = mapParentChildEventTypes(input);
        expect(result).toEqual([
          {
            label: input[0].parentLabel,
            options: [
              { label: input[0].name, value: input[0].id, squads },
              { label: input[1].name, value: input[1].id, squads },
              { label: input[2].name, value: input[2].id, squads },
            ],
          },
          {
            label: input[3].parentLabel,
            options: [
              { label: input[3].name, value: input[3].id, squads },
              { label: input[4].name, value: input[4].id, squads },
            ],
          },
        ]);
      });
    });
  });

  describe('athletesExistInSquad', () => {
    it('returns true if any of the athletes are in the squad', () => {
      const response = athletesExistInSquad(squadAthletesData.squads[0], [1]);
      expect(response).toBe(true);
    });
    it('returns false when none of the athletes are in that squad', () => {
      const response = athletesExistInSquad(
        squadAthletesData.squads[0],
        [8, 9, 10]
      );
      expect(response).toBe(false);
    });

    it('returns false when the athlete list is empty', () => {
      const response = athletesExistInSquad(squadAthletesData.squads[0], []);
      expect(response).toBe(false);
    });
  });

  describe('filterSquads', () => {
    it('returns only the custom event scoped squads when no athletes are passed in', () => {
      const customEventScopedSquads = [squadAthletesData.squads[0]];
      const response = filterSquads(
        customEventScopedSquads,
        squadAthletesData.squads,
        []
      );
      expect(response).toEqual(customEventScopedSquads);
    });

    it('returns only the custom event scoped squads when the athletes are in that squad', () => {
      const customEventScopedSquads = [squadAthletesData.squads[0]];
      const response = filterSquads(
        customEventScopedSquads,
        squadAthletesData.squads,
        [1]
      );
      expect(response).toEqual(customEventScopedSquads);
    });

    it('returns the custom event scoped squads and the additional squad when the selected athlete is in the additional squad', () => {
      const customEventScopedSquads = [squadAthletesData.squads[0]];
      const selectedAthlete =
        squadAthletesData.squads[1].position_groups[0].positions[0].athletes[0]
          .id;
      const response = filterSquads(
        customEventScopedSquads,
        squadAthletesData.squads,
        [selectedAthlete]
      );
      expect(response).toEqual(squadAthletesData.squads);
    });
  });

  describe('mapToEventTypes', () => {
    const squads = [
      {
        id: 8,
        name: 'International Squad',
      },
    ];

    const organisation = {
      id: 6,
      handle: 'kitman',
      name: 'Kitman Rugby Club',
    };

    const organisationId = organisation.id;

    const commonFields = {
      organisation_id: organisationId,
      organisation,
      parent_association: null,
      squads,
      is_archived: false,
      is_selectable: true,
    };

    const ungroupedEventType = {
      id: 491,
      parent_custom_event_type_id: null,
      name: 'NZSNY3',
      ...commonFields,
      parents: [],
    };

    const parent = {
      id: 610,
      name: 'WZLFT2',
      parent_custom_event_type_id: null,
    };

    const grouped1 = {
      id: 612,
      parent_custom_event_type_id: parent.id,
      name: 'AVOXR',
      parents: [parent],
      ...commonFields,
    };

    const grouped2 = {
      id: 611,
      parent_custom_event_type_id: parent.id,
      name: 'SSLLS2sdsd22',
      parents: [parent],
      ...commonFields,
    };

    const input = [grouped1, ungroupedEventType, grouped2];

    const expectedOutput = [
      {
        label: parent.name,
        options: [
          {
            value: grouped1.id,
            label: grouped1.name,
          },
          {
            value: grouped2.id,
            label: grouped2.name,
          },
        ],
      },
      {
        value: ungroupedEventType.id,
        label: ungroupedEventType.name,
      },
    ];

    it('should map the event types properly - without squads (FF is off)', () => {
      expect(mapToEventTypes(input)).toEqual(expectedOutput);
    });

    it('should map the event types properly - with squads (FF is on)', () => {
      window.featureFlags['squad-scoped-custom-events'] = true;
      const expectedOutputWithSquads = [
        {
          label: parent.name,
          options: [
            {
              value: grouped1.id,
              label: grouped1.name,
              squads,
            },
            {
              value: grouped2.id,
              label: grouped2.name,
              squads,
            },
          ],
        },
        {
          value: ungroupedEventType.id,
          label: ungroupedEventType.name,
          squads,
        },
      ];
      expect(mapToEventTypes(input)).toEqual(expectedOutputWithSquads);
      window.featureFlags['squad-scoped-custom-events'] = false;
    });

    describe('with current event type', () => {
      const currentEventTypeUngrouped = {
        id: 503,
        parent_custom_event_type_id: null,
        name: 'sKJSD1',
        parents: [],
        ...commonFields,
      };

      const currentEventTypeGrouped = {
        id: 504,
        parent_custom_event_type_id: parent.id,
        name: 'sKPOLL1',
        parents: [parent],
        ...commonFields,
      };

      const currentEventTypeUngroupedExpectedOutput =
        window.structuredClone(expectedOutput);

      currentEventTypeUngroupedExpectedOutput.push({
        value: currentEventTypeUngrouped.id,
        label: currentEventTypeUngrouped.name,
      });

      const currentEventTypeGroupedExpectedOutput =
        window.structuredClone(expectedOutput);

      currentEventTypeGroupedExpectedOutput[0].options.push({
        value: currentEventTypeGrouped.id,
        label: currentEventTypeGrouped.name,
      });

      it('should map the event types properly - current event type is not in the list (ungrouped)', () => {
        expect(
          mapToEventTypes(input.concat(currentEventTypeUngrouped))
        ).toEqual(currentEventTypeUngroupedExpectedOutput);
      });

      it('should map the event types properly - current event type is not in the list (grouped)', () => {
        expect(mapToEventTypes(input.concat(currentEventTypeGrouped))).toEqual(
          currentEventTypeGroupedExpectedOutput
        );
      });

      it('should map the event types properly - current event type is in the list (ungrouped)', () => {
        expect(
          mapToEventTypes(input.concat(currentEventTypeUngrouped))
        ).toEqual(currentEventTypeUngroupedExpectedOutput);
      });

      it('should map the event types properly - current event type is in the list (grouped)', () => {
        expect(mapToEventTypes(input.concat(currentEventTypeGrouped))).toEqual(
          currentEventTypeGroupedExpectedOutput
        );
      });
    });
  });
});
