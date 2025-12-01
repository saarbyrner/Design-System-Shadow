/** @typedef {import("../types").Locations} Locations */
/** @typedef {import("../types").EventTypeArray} EventTypeArray */
import {
  reduceLocationsIntoLocationNames,
  getEventTypesText,
  findLocationsToUpdateOrCreate,
  createEventTypeValueToLabelMap,
} from '../helpers';
import {
  locationsMock,
  eventTypesJoinSeparator,
  NEW_LOCATION_ID_PREFIX,
} from '../consts';

describe('helpers', () => {
  describe('reduceLocationsIntoLocationNames', () => {
    const name1 = 'name1';
    const name2 = 'name2';
    const nameSet = new Set([name1, name2]);
    /** @type {Locations} */
    const locationNames = [
      {
        name: name1,
        id: '1',
        eventTypes: [],
        locationType: '',
      },
      {
        name: name2,
        id: '2',
        eventTypes: [],
        locationType: '',
      },
    ];

    it('should return the name set - no duplicates', () => {
      expect(reduceLocationsIntoLocationNames(locationNames)).toEqual({
        locationNamesSet: nameSet,
        duplicatesExist: false,
      });
    });
    it('should return the name set - with duplicates', () => {
      const locationNamesWithDuplicates = [
        ...locationNames,
        {
          name: name1,
          id: '3',
          eventTypes: [],
          locationType: '',
        },
      ];
      expect(
        reduceLocationsIntoLocationNames(locationNamesWithDuplicates)
      ).toEqual({
        locationNamesSet: nameSet,
        duplicatesExist: true,
      });
    });
  });

  describe('getEventTypesText', () => {
    const type1 = 'custom';
    const type2 = 'game';
    /** @type {EventTypeArray} */
    const eventTypes = [type1, type2];

    it('should return a valid string', () => {
      const eventTypeValueToLabelMap = createEventTypeValueToLabelMap();
      const result = `${eventTypeValueToLabelMap[type1]}${eventTypesJoinSeparator}${eventTypeValueToLabelMap[type2]}`;
      expect(getEventTypesText(eventTypes)).toEqual(result);
    });
  });

  describe('findLocationsToUpdateOrCreate', () => {
    const originalFormData = locationsMock.map((location) => ({
      ...location,
      modified: false,
    }));

    it('does not return any locations if the form data is all unmodified', () => {
      const result = findLocationsToUpdateOrCreate(originalFormData);
      expect(result).toEqual({ locationsToUpdate: [], locationsToCreate: [] });
    });

    it('returns new locations if new locations were added', () => {
      const newFormData = [
        ...locationsMock,
        {
          id: NEW_LOCATION_ID_PREFIX,
          name: 'my new locations',
          modified: true,
        },
      ];
      const result = findLocationsToUpdateOrCreate(newFormData);
      expect(result).toEqual({
        locationsToUpdate: [],
        locationsToCreate: [
          { id: NEW_LOCATION_ID_PREFIX, name: 'my new locations' },
        ],
      });
    });

    it('returns modified locations if any locations were changed', () => {
      const locationToUpdate = locationsMock.shift();
      const newFormData = [
        ...locationsMock,
        {
          ...locationToUpdate,
          name: 'My New Name',
          event_types: ['session'],
          modified: true,
        },
        {
          id: NEW_LOCATION_ID_PREFIX,
          name: 'my new locations',
          modified: true,
        },
      ];
      const result = findLocationsToUpdateOrCreate(newFormData);
      expect(result).toEqual({
        locationsToUpdate: [
          {
            ...locationToUpdate,
            name: 'My New Name',
            event_types: ['session'],
          },
        ],
        locationsToCreate: [
          { id: NEW_LOCATION_ID_PREFIX, name: 'my new locations' },
        ],
      });
    });
  });
});
