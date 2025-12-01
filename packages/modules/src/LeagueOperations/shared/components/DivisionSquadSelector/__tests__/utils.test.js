import { getFlatHierarchy } from '../utils';
import mocks from '../mocks';

describe('getFlatHierarchy', () => {
  const locale = 'en-US';

  it('should handle empty squads array for both modes', () => {
    expect(getFlatHierarchy([], locale, 'divisionsAndSquads')).toEqual([]);
    expect(getFlatHierarchy([], locale, 'divisionsAndConferences')).toEqual([]);
  });

  it('should correctly list orphan squads (squads without a division) at indentLevel 0', () => {
    const squads = [
      { name: 'Squad A', id: 1, division: null },
      { name: 'Squad B', id: 2 },
    ];
    const resultDivisionsAndSquads = getFlatHierarchy(
      squads,
      locale,
      'divisionsAndSquads'
    );
    const resultDivisionsAndConferences = getFlatHierarchy(
      squads,
      locale,
      'divisionsAndConferences'
    );

    const expected = [
      { name: 'Squad A', id: 1, indentLevel: 0, disabled: false },
      { name: 'Squad B', id: 2, indentLevel: 0, disabled: false },
    ]; // Sorting expected for predictable test output

    expect(resultDivisionsAndSquads).toEqual(expected);
    expect(resultDivisionsAndConferences).toEqual(expected);
  });

  it('should handle divisionsAndConferences in divisionsAndSquads mode', () => {
    const result = getFlatHierarchy(
      mocks.divisionsAndConferences,
      locale,
      'divisionsAndSquads'
    );

    expect(result).toEqual(mocks.divisionsAndConferencesInDivisionsAndSquads);
  });

  it('should handle divisionsAndConferences in divisionsAndConferences mode', () => {
    const result = getFlatHierarchy(
      mocks.divisionsAndConferences,
      locale,
      'divisionsAndConferences'
    );

    expect(result).toEqual(
      mocks.divisionsAndConferencesInDivisionsAndConferences
    );
  });

  it('should handle divisionsAndSquadsToSort in divisionsAndSquads mode', () => {
    const result = getFlatHierarchy(
      mocks.divisionsAndSquadsToSort,
      locale,
      'divisionsAndSquads'
    );

    expect(result).toEqual(mocks.divisionsAndSquadsToSortInDivisionsAndSquads);
  });

  it('should handle divisionsAndSquadsToSort in divisionsAndConferences mode', () => {
    const result = getFlatHierarchy(
      mocks.divisionsAndSquadsToSort,
      locale,
      'divisionsAndConferences'
    );

    expect(result).toEqual(
      mocks.divisionsAndSquadsToSortInDivisionsAndConferences
    );
  });

  it('should handle divisionsAndSquads in divisionsAndSquads mode', () => {
    const result = getFlatHierarchy(
      mocks.divisionsAndSquads,
      locale,
      'divisionsAndSquads'
    );

    expect(result).toEqual(mocks.divisionsAndSquadsInDivisionsAndSquads);
  });

  it('should handle divisionsAndSquads in divisionsAndConferences mode', () => {
    const result = getFlatHierarchy(
      mocks.divisionsAndSquads,
      locale,
      'divisionsAndConferences'
    );

    expect(result).toEqual(mocks.divisionsAndSquadsInDivisionsAndConferences);
  });
});
