import { localeSort, localeSortByField } from '../localeSort';

describe('localeSort', () => {
  const defaultLocale = 'en-IE';

  describe('sorting an array of strings', () => {
    it('can sort ascending', () => {
      const arr = ['Charlie', 'Alpha', 'Beta', 'Delta', 'Foxtrot', 'Echo'];

      const sorted = localeSort(arr, defaultLocale);

      expect(sorted).toEqual([
        'Alpha',
        'Beta',
        'Charlie',
        'Delta',
        'Echo',
        'Foxtrot',
      ]);
    });

    it('can sort descending', () => {
      const arr = ['Charlie', 'Alpha', 'Beta', 'Delta', 'Foxtrot', 'Echo'];

      const sorted = localeSort(arr, defaultLocale, 'desc');

      expect(sorted).toEqual([
        'Foxtrot',
        'Echo',
        'Delta',
        'Charlie',
        'Beta',
        'Alpha',
      ]);
    });

    it('can sort ascending and order numbers correctly', () => {
      const arr = ['U8s', 'First Team', 'U12s', 'U9s', 'U10s', 'U23s', 'U18s'];

      const sorted = localeSort(arr, defaultLocale);
      expect(sorted).toEqual([
        'First Team',
        'U8s',
        'U9s',
        'U10s',
        'U12s',
        'U18s',
        'U23s',
      ]);
    });

    it('can sort descending and order alpha numeric strings correctly', () => {
      const arr = ['U8s', 'First Team', 'U12s', 'U9s', 'U10s', 'U23s', 'U18s'];

      const sorted = localeSort(arr, defaultLocale, 'desc');
      expect(sorted).toEqual([
        'U23s',
        'U18s',
        'U12s',
        'U10s',
        'U9s',
        'U8s',
        'First Team',
      ]);
    });

    it('moves empty values to the end of the array when emptyAtEnd is true', () => {
      const arr = ['20', '10', '30', '', '50', '40', '', '80', ''];
      const sortedAsc = localeSort(arr, defaultLocale, 'asc', {
        emptyAtEnd: true,
      });
      const sortedDesc = localeSort(arr, defaultLocale, 'desc', {
        emptyAtEnd: true,
      });

      expect(sortedAsc).toEqual([
        '10',
        '20',
        '30',
        '40',
        '50',
        '80',
        '',
        '',
        '',
      ]);
      expect(sortedDesc).toEqual([
        '80',
        '50',
        '40',
        '30',
        '20',
        '10',
        '',
        '',
        '',
      ]);
    });
  });

  describe('sorting an array of objects', () => {
    it('can sort ascending', () => {
      const arr = [
        { name: 'Charlie' },
        { name: 'Alpha' },
        { name: 'Beta' },
        { name: 'Delta' },
        { name: 'Foxtrot' },
        { name: 'Echo' },
      ];

      const sorted = localeSortByField(arr, 'name', defaultLocale);

      expect(sorted).toEqual([
        { name: 'Alpha' },
        { name: 'Beta' },
        { name: 'Charlie' },
        { name: 'Delta' },
        { name: 'Echo' },
        { name: 'Foxtrot' },
      ]);
    });

    it('can sort descending', () => {
      const arr = [
        { name: 'Charlie' },
        { name: 'Alpha' },
        { name: 'Beta' },
        { name: 'Delta' },
        { name: 'Foxtrot' },
        { name: 'Echo' },
      ];

      const sorted = localeSortByField(arr, 'name', defaultLocale, 'desc');

      expect(sorted).toEqual([
        { name: 'Foxtrot' },
        { name: 'Echo' },
        { name: 'Delta' },
        { name: 'Charlie' },
        { name: 'Beta' },
        { name: 'Alpha' },
      ]);
    });

    it('can sort ascending and order numbers correctly', () => {
      const arr = [
        { name: 'U8s' },
        { name: 'First Team' },
        { name: 'U12s' },
        { name: 'U9s' },
        { name: 'U10s' },
        { name: 'U23s' },
        { name: 'U18s' },
      ];

      const sorted = localeSortByField(arr, 'name', defaultLocale);
      expect(sorted).toEqual([
        { name: 'First Team' },
        { name: 'U8s' },
        { name: 'U9s' },
        { name: 'U10s' },
        { name: 'U12s' },
        { name: 'U18s' },
        { name: 'U23s' },
      ]);
    });

    it('can sort descending and order numbers correctly', () => {
      const arr = [
        { name: 'U8s' },
        { name: 'First Team' },
        { name: 'U12s' },
        { name: 'U9s' },
        { name: 'U10s' },
        { name: 'U23s' },
        { name: 'U18s' },
      ];

      const sorted = localeSortByField(arr, 'name', defaultLocale, 'desc');
      expect(sorted).toEqual([
        { name: 'U23s' },
        { name: 'U18s' },
        { name: 'U12s' },
        { name: 'U10s' },
        { name: 'U9s' },
        { name: 'U8s' },
        { name: 'First Team' },
      ]);
    });

    it('moves empty values to the end of the array when emptyAtEnd is true', () => {
      const arr = [
        { name: '20' },
        { name: '10' },
        { name: '30' },
        { name: null },
        { name: '50' },
        { name: '40' },
        { name: '' },
        { name: '80' },
        { name: '' },
      ];

      const sortedAsc = localeSortByField(arr, 'name', defaultLocale, 'asc', {
        emptyAtEnd: true,
      });
      const sortedDesc = localeSortByField(arr, 'name', defaultLocale, 'desc', {
        emptyAtEnd: true,
      });

      expect(sortedAsc).toEqual([
        { name: '10' },
        { name: '20' },
        { name: '30' },
        { name: '40' },
        { name: '50' },
        { name: '80' },
        { name: null },
        { name: '' },
        { name: '' },
      ]);
      expect(sortedDesc).toEqual([
        { name: '80' },
        { name: '50' },
        { name: '40' },
        { name: '30' },
        { name: '20' },
        { name: '10' },
        { name: null },
        { name: '' },
        { name: '' },
      ]);
    });
  });
});
