import { DEFAULT_BIO_BAND_RANGE } from '@kitman/modules/src/analysis/BenchmarkReport/consts';
import {
  getHasDefaultBioBandRange,
  renderToolTip,
  getColumnsData,
} from '../utils';

describe('utils', () => {
  describe('getHasDefaultBioBandRange', () => {
    it('should return true if filter and default value are equal', () => {
      expect(getHasDefaultBioBandRange(DEFAULT_BIO_BAND_RANGE)).toBe(true);
    });

    it('should return false if filter and default value are equal', () => {
      expect(getHasDefaultBioBandRange([1, 2, 3])).toBe(false);
    });
  });

  it('renderToolTip', () => {
    const columnHeaderTitle = 'Test title';
    const tooltipText = 'This is tooltip text';
    expect(renderToolTip(columnHeaderTitle, tooltipText)).toMatchSnapshot();
  });

  describe('getColumnsData', () => {
    it('must match the snapshot', () => {
      expect(getColumnsData()).toMatchSnapshot();
    });

    it('must sort rows correctly via `age_group` column’s `sortComparator`', () => {
      const comparator = getColumnsData().find(
        ({ field }) => field === 'age_group'
      ).sortComparator;
      expect(['U11', 'U20', 'U9', 'U13', 'U14'].sort(comparator)).toEqual([
        'U9',
        'U11',
        'U13',
        'U14',
        'U20',
      ]);
    });
  });
});
