import { renderHook } from '@testing-library/react-hooks';
import useScoreDropdown from '../useScoreDropdown';

// Most commonly used increment values for training variables
const organisationTrainingVariables = [
  {
    training_variable: { id: 1, min: 0, max: 10 },
    scale_increment: '1.0',
  },
  {
    training_variable: { id: 2, min: 0, max: 5 },
    scale_increment: '0.5',
  },
  {
    training_variable: { id: 3, min: 0, max: 5 },
    scale_increment: '0.01',
  },
];

describe('useScoreDropdown', () => {
  it('should display the correct values and amount of options for a 1.0 scale increment', () => {
    const { result } = renderHook(() =>
      useScoreDropdown(organisationTrainingVariables, 1)
    );
    const scoreDropdownItems = result.current;

    expect(scoreDropdownItems).toHaveLength(11);
    expect(scoreDropdownItems[0].name).toBe('0');
    expect(scoreDropdownItems[10].name).toBe('10');
  });

  it('should display the correct values and amount of options for a 0.5 scale increment', () => {
    const { result } = renderHook(() =>
      useScoreDropdown(organisationTrainingVariables, 2)
    );
    const scoreDropdownItems = result.current;

    expect(scoreDropdownItems).toHaveLength(11);
    expect(scoreDropdownItems[0].name).toBe('0');
    expect(scoreDropdownItems[10].name).toBe('5');
    expect(scoreDropdownItems[5].name).toBe('2.5');
  });

  it('should display the correct values and amount of options for a 0.01 scale increment', () => {
    const { result } = renderHook(() =>
      useScoreDropdown(organisationTrainingVariables, 3)
    );
    const scoreDropdownItems = result.current;

    expect(scoreDropdownItems).toHaveLength(501);
    expect(scoreDropdownItems[0].name).toBe('0');
    expect(scoreDropdownItems[500].name).toBe('5');
    expect(scoreDropdownItems[250].name).toBe('2.5');
    expect(scoreDropdownItems[499].name).toBe('4.99');
  });
});
