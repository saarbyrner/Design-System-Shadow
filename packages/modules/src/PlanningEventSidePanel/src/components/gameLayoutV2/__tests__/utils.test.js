import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import {
  extractDataBasedOnGameKey,
  getFeedOppositionOptions,
  getFormatValue,
} from '../utils';

jest.mock('@kitman/components/src/Select/utils', () => {
  const originalModule = jest.requireActual(
    '@kitman/components/src/Select/utils'
  );
  return {
    ...originalModule,
    defaultMapToOptions: jest.fn((categories) =>
      categories.map((category) => ({
        label: category.name,
        value: category.id,
        ...category,
      }))
    ),
  };
});

describe('utils for GameLayout', () => {
  describe('extractDataBasedOnGameKey', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('returns the correct result when fas_game_key is present', () => {
      const event = {
        fas_game_key: '12345',
        opponent_team: { id: 101, name: 'Opposition Team' },
        venue_type: { id: 201, name: 'Venue Type' },
      };

      const result = extractDataBasedOnGameKey(event);

      const expectedData = {
        hasGameKey: true,
        fasGameOpposition: [
          {
            label: 'Opposition Team',
            value: 101,
            id: 101,
            name: 'Opposition Team',
          },
        ],
        fasGameVenue: [
          { label: 'Venue Type', value: 201, id: 201, name: 'Venue Type' },
        ],
        isMLS: false,
      };
      expect(result).toEqual(expectedData);
      expect(defaultMapToOptions).toHaveBeenCalledTimes(2);
    });

    it('returns the correct result when mls_game_key is present', () => {
      const event = {
        mls_game_key: '678910',
        opponent_team: { id: 101, name: 'Opposition Team' },
        venue_type: { id: 201, name: 'Venue Type' },
      };

      const result = extractDataBasedOnGameKey(event);

      const expectedData = {
        hasGameKey: true,
        fasGameOpposition: [
          {
            label: 'Opposition Team',
            value: 101,
            id: 101,
            name: 'Opposition Team',
          },
        ],
        fasGameVenue: [
          { label: 'Venue Type', value: 201, id: 201, name: 'Venue Type' },
        ],
        isMLS: true,
      };
      expect(result).toEqual(expectedData);
      expect(defaultMapToOptions).toHaveBeenCalledTimes(2);
    });

    it('returns the correct result when neither game key is defined', () => {
      const event = {
        opponent_team: { id: 101, name: 'Opposition Team' },
        venue_type: { id: 201, name: 'Venue Type' },
      };

      const result = extractDataBasedOnGameKey(event);

      const expectedData = {
        hasGameKey: false,
        fasGameOpposition: [
          {
            label: 'Opposition Team',
            value: 101,
            id: 101,
            name: 'Opposition Team',
          },
        ],
        fasGameVenue: [
          {
            label: 'Venue Type',
            value: 201,
            id: 201,
            name: 'Venue Type',
          },
        ],
        isMLS: false,
      };
      expect(result).toEqual(expectedData);
      expect(defaultMapToOptions).toHaveBeenCalledTimes(2);
    });

    it('returns null for fasGameOpposition and fasGameVenue when opponent_team and venue_type are not present', () => {
      const event = {
        fas_game_key: '12345',
        opponent_team: null,
        venue_type: null,
      };

      const result = extractDataBasedOnGameKey(event);

      const expectedData = {
        hasGameKey: true,
        fasGameOpposition: null,
        fasGameVenue: null,
        isMLS: false,
      };
      expect(result).toEqual(expectedData);
      expect(defaultMapToOptions).toHaveBeenCalledTimes(0);
    });
  });

  describe('getFeedOppositionOptions', () => {
    it('returns null when hasGameKey is false', () => {
      const event = {
        opponent_squad: { id: 101, name: 'Opponent Squad' },
        opponent_team: { id: 201, name: 'Opponent Team' },
      };
      const extractDataBasedOnGameKeyTypes = { hasGameKey: false };

      const result = getFeedOppositionOptions(
        event,
        extractDataBasedOnGameKeyTypes
      );

      expect(result).toBeNull();
    });

    it('returns options when hasGameKey is true and opponent_squad is present', () => {
      const event = {
        opponent_squad: {
          id: 101,
          name: 'Opponent Squad',
          owner_name: 'Owner',
        },
        opponent_team: null,
      };
      const extractDataBasedOnGameKeyTypes = { hasGameKey: true };

      const result = getFeedOppositionOptions(
        event,
        extractDataBasedOnGameKeyTypes
      );

      const expectedOptions = [
        {
          label: 'Opponent Squad Owner',
          value: 101,
          id: 101,
          name: 'Opponent Squad Owner',
          owner_name: 'Owner',
        },
      ];
      expect(result).toEqual(expectedOptions);
    });

    it('returns options when hasGameKey is true and opponent_team is present', () => {
      const event = {
        opponent_squad: null,
        opponent_team: { id: 201, name: 'Opponent Team' },
      };
      const extractDataBasedOnGameKeyTypes = { hasGameKey: true };

      const result = getFeedOppositionOptions(
        event,
        extractDataBasedOnGameKeyTypes
      );

      const expectedOptions = [
        { label: 'Opponent Team', value: 201, id: 201, name: 'Opponent Team' },
      ];
      expect(result).toEqual(expectedOptions);
    });

    it('returns null when hasGameKey is true and both opponent_squad and opponent_team are null', () => {
      const event = {
        opponent_squad: null,
        opponent_team: null,
      };
      const extractDataBasedOnGameKeyTypes = { hasGameKey: true };

      const result = getFeedOppositionOptions(
        event,
        extractDataBasedOnGameKeyTypes
      );

      expect(result).toBeNull();
    });
  });

  describe('getFormatValue', () => {
    const formats = [
      { label: '1v1', value: 101 },
      { label: '2v2', value: 102 },
    ];
    it('returns the correct value when formatName is found in formats', () => {
      const formatName = '1v1';

      const result = getFormatValue(formatName, formats);

      expect(result).toEqual(101);
    });

    it('returns null when formatName is not found in formats', () => {
      const formatName = '11v11';

      const result = getFormatValue(formatName, formats);

      expect(result).toBeNull();
    });

    it('returns null when formats array is empty', () => {
      const emptyFormats = [];
      const formatName = '1v1';

      const result = getFormatValue(formatName, emptyFormats);

      expect(result).toBeNull();
    });
  });
});
