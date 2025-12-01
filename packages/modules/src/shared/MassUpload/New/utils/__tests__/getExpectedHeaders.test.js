import getExpectedHeaders from '../getExpectedHeaders';
import { IMPORT_TYPES } from '../consts';

describe('getExpectedHeaders', () => {
  it('should return correct headers based on growth_and_maturation import type', () => {
    expect(
      getExpectedHeaders(IMPORT_TYPES.GrowthAndMaturation)
    ).toMatchSnapshot();
  });

  it('should return correct headers based on baselines import type', () => {
    expect(getExpectedHeaders(IMPORT_TYPES.Baselines)).toMatchSnapshot();
  });

  it('should return correct headers based on league_benchmarking import type', () => {
    expect(
      getExpectedHeaders(IMPORT_TYPES.LeagueBenchmarking)
    ).toMatchSnapshot();
  });

  it('should return correct headers based on training_variables_answer import type', () => {
    expect(
      getExpectedHeaders(IMPORT_TYPES.TrainingVariablesAnswer)
    ).toMatchSnapshot();
  });
  it('should return correct headers based on kit_matrix import type', () => {
    expect(getExpectedHeaders(IMPORT_TYPES.KitMatrix)).toMatchSnapshot();
  });
});
