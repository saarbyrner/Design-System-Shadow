import { buildParentLabel, buildParentsLabel } from '../utils';

describe('LocationSelect utils', () => {
  describe('build parent label', () => {
    const topLevelParentInput = {
      id: 10,
      name: 'Top Level',
      parent_event_location_id: null,
    };
    it('builds parent label properly with one level', () => {
      const connectedLocationsInput = [
        { id: 3, name: 'Second Level', parent_event_location_id: 10 },
      ];

      const receivedOutput = buildParentLabel(
        topLevelParentInput,
        connectedLocationsInput
      );
      expect(receivedOutput).toEqual('Second Level - ');
    });

    it('builds parent label properly with two levels', () => {
      const connectedLocationsInput = [
        { id: 3, name: 'Second Level', parent_event_location_id: 10 },
        { id: 4, name: 'Third Level', parent_event_location_id: 3 },
      ];

      const receivedOutput = buildParentLabel(
        topLevelParentInput,
        connectedLocationsInput
      );
      expect(receivedOutput).toEqual('Second Level - Third Level - ');
    });

    it('does not build a label if there are no parents', () => {
      const receivedOutput = buildParentLabel(topLevelParentInput, []);
      expect(receivedOutput).toEqual('');
    });
  });

  describe('build parents label', () => {
    describe('when exclude name is false', () => {
      const locationParent = {
        id: 13,
        name: 'Pitch 1',
        parent_event_location_id: null,
      };
      it('builds the ancestor label correctly with one parent', () => {
        const eventLocationResponse = {
          id: 10,
          name: 'Selected Location',
          parent_event_location_id: 2,
          parents: [locationParent],
        };

        const receivedOutput = buildParentsLabel(eventLocationResponse);
        expect(receivedOutput).toEqual(
          `${locationParent.name} - ${eventLocationResponse.name}`
        );
      });
      it('builds the ancestor label correctly with five parents', () => {
        const eventLocationResponse = {
          id: 10,
          name: 'Selected Location',
          parent_event_location_id: 2,
          parents: [
            { id: 13, name: '5', parent_event_location_id: 14 },
            { id: 14, name: '4', parent_event_location_id: 15 },
            { id: 15, name: '3', parent_event_location_id: 16 },
            { id: 16, name: '2', parent_event_location_id: 17 },
            { id: 17, name: '1', parent_event_location_id: null },
          ],
        };

        const receivedOutput = buildParentsLabel(eventLocationResponse);
        expect(receivedOutput).toEqual('1 - 2 - 3 - 4 - 5 - Selected Location');
      });
      it('builds label when no ancestors exist', () => {
        const eventLocationResponse = {
          id: 10,
          name: 'Selected Location',
          parent_event_location_id: 2,
          parents: [],
        };

        const receivedOutput = buildParentsLabel(eventLocationResponse);
        expect(receivedOutput).toEqual('Selected Location');
      });
    });

    describe('when exclude name is true', () => {
      const commonType = {
        id: 10,
        name: 'Custom Event Type Selectable',
        is_selectable: true,
      };
      const parents = [
        { id: 13, name: 'Parent 1', parent_custom_event_type_id: 130 },
        { id: 130, name: 'Grandparent', parent_custom_event_type_id: null },
      ];
      it('builds the ancestor label correctly with two parents', () => {
        const customEventTypeResponse = {
          ...commonType,
          parents,
        };

        const receivedOutput = buildParentsLabel(customEventTypeResponse, true);
        expect(receivedOutput).toEqual(
          `${parents[1].name} - ${parents[0].name}`
        );
      });

      it('correctly builds empty label when no parents exist', () => {
        const customEventTypeResponse = {
          ...commonType,
          parents: [],
        };

        const receivedOutput = buildParentsLabel(customEventTypeResponse, true);
        expect(receivedOutput).toEqual('');
      });
    });
  });
});
