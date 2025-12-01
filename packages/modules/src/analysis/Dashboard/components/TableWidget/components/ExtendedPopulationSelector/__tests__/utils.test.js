import { searchListByKey } from '../utils';

describe('ExtendedPopulationSelector | utils.js', () => {
  describe('searchListByKey', () => {
    const TEST_LIST = [
      { testKey: 'David' },
      { testKey: 'Alice' },
      { testKey: 'Charlie' },
      { testKey: 'Olivia' },
      { testKey: 'Jack' },
      { testKey: 'Victor' },
      { testKey: 'Hannah' },
      { testKey: 'Grace' },
      { testKey: 'Jane' },
      { testKey: 'Mia' },
    ];

    it('returns the list if search text is empty', () => {
      expect(searchListByKey('', TEST_LIST, 'testKey')).toStrictEqual(
        TEST_LIST
      );
    });

    it('returns values related to the search text supplied', () => {
      expect(searchListByKey('David', TEST_LIST, 'testKey')).toStrictEqual([
        TEST_LIST[0],
      ]);

      expect(searchListByKey('Ja', TEST_LIST, 'testKey')).toStrictEqual([
        TEST_LIST[4],
        TEST_LIST[8],
      ]);
    });

    it('ignores upper case or lower case and returns correct results', () => {
      expect(searchListByKey('david', TEST_LIST, 'testKey')).toStrictEqual([
        TEST_LIST[0],
      ]);

      expect(searchListByKey('ja', TEST_LIST, 'testKey')).toStrictEqual([
        TEST_LIST[4],
        TEST_LIST[8],
      ]);
    });
  });
});
