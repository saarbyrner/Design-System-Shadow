import {
  mockFormulaInputParams,
  mockFormulaDataSourceData,
} from '@kitman/common/src/utils/TrackingData/src/mocks/analysis';
import getFormulaDataSources from '../getFormulaEventData';

describe('getFormulaDataSources()', () => {
  it('returns the correct data', () => {
    expect(getFormulaDataSources(mockFormulaInputParams)).toStrictEqual(
      mockFormulaDataSourceData
    );
  });
  it('matches the snapshot', () => {
    expect(getFormulaDataSources(mockFormulaInputParams)).toMatchSnapshot();
  });
});
