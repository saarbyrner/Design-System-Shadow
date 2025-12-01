import { data } from '@kitman/modules/src/shared/MassUpload/services/mocks/data/mock_benchmark_csv';
import buildCellContent from '../cellBuilder';

describe('cellBuilder', () => {
  it('should render as expected if isInvalid', () => {
    expect(
      buildCellContent(
        { row_key: 'athlete_id' },
        data.invalidData,
        'This cell has an error'
      )
    ).toMatchSnapshot();
  });

  it('should render as expected if valid', () => {
    expect(
      buildCellContent({ row_key: 'athlete_id' }, data.validData, null)
    ).toMatchSnapshot();
  });
});
