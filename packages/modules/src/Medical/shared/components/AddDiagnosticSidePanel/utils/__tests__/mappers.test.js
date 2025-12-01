import {
  transformQueuedDiagnostics,
  sortQuestionsById,
} from '@kitman/modules/src/Medical/shared/components/AddDiagnosticSidePanel/utils/mappers';

describe('mappers', () => {
  describe('transformQueuedDiagnostics', () => {
    it('flattens items with multiple diagnosticTypes into individual items', () => {
      const input = [
        { id: 1, diagnosticTypes: [{ id: 10 }, { id: 20 }], other: 'a' },
        { id: 2, diagnosticTypes: [], other: 'b' },
        { id: 3, diagnosticTypes: [{ id: 30 }], other: 'c' },
      ];

      const result = transformQueuedDiagnostics(input);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: 1,
          diagnosticType: { id: 10 },
          other: 'a',
        })
      );
      expect(result[1]).toEqual(
        expect.objectContaining({
          id: 1,
          diagnosticType: { id: 20 },
          other: 'a',
        })
      );
      expect(result[2]).toEqual(
        expect.objectContaining({
          id: 3,
          diagnosticType: { id: 30 },
          other: 'c',
        })
      );
    });

    it('returns original item when diagnosticTypes is not an array', () => {
      const input = [{ id: 1, other: 'x' }];
      const result = transformQueuedDiagnostics(input);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(input[0]);
    });
  });

  describe('sortQuestionsById', () => {
    it('returns a new array sorted by id asc', () => {
      const input = [{ id: 3 }, { id: 1 }, { id: 2 }];
      const result = sortQuestionsById(input);
      expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
      expect(result).not.toBe(input);
      // original remains unchanged
      expect(input).toEqual([{ id: 3 }, { id: 1 }, { id: 2 }]);
    });
  });
});
