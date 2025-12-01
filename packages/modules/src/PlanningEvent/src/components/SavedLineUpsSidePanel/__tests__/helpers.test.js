import { filterLineUps, processLineUpsData } from '../helpers';

describe('SavedLineUpsSidePanel helpers', () => {
  describe('filterLineUps', () => {
    const lineUps = [
      {
        name: 'lineup 1',
        gameFormat: { id: 1, name: 'format 1' },
        formation: { id: 1, name: 'formation 1' },
        author: { id: 1, fullname: 'author 1' },
        organisation_format_id: 1,
      },
      {
        name: 'lineup 2',
        gameFormat: { id: 2, name: 'format 2' },
        formation: { id: 2, name: 'formation 2' },
        author: { id: 2, fullname: 'author 2' },
        organisation_format_id: 2,
      },
    ];

    const filters = {
      gameFormat: {},
      formation: {},
      author: {},
      query: '',
    };

    it('should filter lineUps based on the provided filters', () => {
      const filteredLineUps = filterLineUps(lineUps, {
        gameFormat: { id: 1 },
        formation: { id: 1 },
        author: { id: 1, fullname: 'author 1' },
        query: '',
      });

      expect(filteredLineUps).toEqual([
        {
          name: 'lineup 1',
          gameFormat: { id: 1, name: 'format 1' },
          formation: { id: 1, name: 'formation 1' },
          author: { id: 1, fullname: 'author 1' },
          organisation_format_id: 1,
        },
      ]);
    });

    it('should return all lineUps when no filters are provided', () => {
      const filteredLineUps = filterLineUps(lineUps, {});

      expect(filteredLineUps).toEqual(lineUps);
    });

    it('should filter lineUps based on the query filter', () => {
      const filteredLineUps = filterLineUps(lineUps, {
        ...filters,
        query: 'lineup',
      });

      expect(filteredLineUps).toEqual(lineUps);
    });

    it('should handle case insensitive filtering', () => {
      const filteredLineUps = filterLineUps(lineUps, {
        query: 'FoRmAt',
      });
      expect(filteredLineUps).toEqual(lineUps);
    });
  });

  describe('processLineUpsData', () => {
    const lineUps = [
      {
        id: 1,
        organisation_format_id: 1,
        formation_id: 1,
        author: { id: 1, name: 'author 1' },
      },
      {
        id: 2,
        organisation_format_id: 2,
        formation_id: 2,
        author: { id: 2, name: 'author 2' },
      },
    ];

    const gameFormats = [
      { id: 1, name: 'format 1' },
      { id: 2, name: 'format 2' },
      { id: 3, name: 'format 3' },
    ];

    const formations = [
      { id: 1, name: 'formation 1' },
      { id: 2, name: 'formation 2' },
      { id: 3, name: 'formation 3' },
    ];

    it('should format lineUps correctly', () => {
      const processedData = processLineUpsData(
        lineUps,
        gameFormats,
        formations
      );

      expect(processedData).toEqual({
        gameFormats: [
          { id: 1, name: 'format 1' },
          { id: 2, name: 'format 2' },
        ],
        formations: [
          { id: 1, name: 'formation 1' },
          { id: 2, name: 'formation 2' },
        ],
        authors: {
          1: { id: 1, name: 'author 1' },
          2: { id: 2, name: 'author 2' },
        },
        processedLineUps: [
          {
            id: 1,
            organisation_format_id: 1,
            formation_id: 1,
            author: { id: 1, name: 'author 1' },
            gameFormat: { id: 1, name: 'format 1' },
            formation: { id: 1, name: 'formation 1' },
          },
          {
            id: 2,
            organisation_format_id: 2,
            formation_id: 2,
            author: { id: 2, name: 'author 2' },
            gameFormat: { id: 2, name: 'format 2' },
            formation: { id: 2, name: 'formation 2' },
          },
        ],
      });
    });
  });
});
