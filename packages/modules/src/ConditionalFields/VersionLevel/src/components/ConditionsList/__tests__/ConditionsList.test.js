import { render } from '@testing-library/react';

import ConditionsListComponent from '../index';
import { ConditionCardComponentTranslated as ConditionCardComponent } from '../../ConditionCard';
import { ConditionsListHeaderComponentTranslated as ConditionsListHeader } from '../../ConditionsListHeader';

jest.mock('../../ConditionCard', () => ({
  ConditionCardComponentTranslated: jest.fn(() => null),
}));

jest.mock('../../ConditionsListHeader', () => ({
  ConditionsListHeaderComponentTranslated: jest.fn(() => null),
}));

describe('ConditionsListComponent', () => {
  const mockConditions = [
    { id: 'cond1', order: 1, name: 'Condition 1' },
    { id: 'cond2', order: 2, name: 'Condition 2' },
  ];

  const defaultProps = {
    allConditions: mockConditions,
    isPublished: false,
    t: (key) => key,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders ConditionsListHeader with correct props', () => {
    render(<ConditionsListComponent {...defaultProps} />);

    expect(ConditionsListHeader).toHaveBeenCalledWith(
      expect.objectContaining({
        allConditions: mockConditions,
        isPublished: false,
      }),
      {}
    );
  });

  it('renders ConditionCardComponent for each condition', () => {
    render(<ConditionsListComponent {...defaultProps} />);

    expect(ConditionCardComponent).toHaveBeenCalledTimes(mockConditions.length);
    expect(ConditionCardComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        condition: mockConditions[0],
        index: 0,
        isPublished: false,
      }),
      {}
    );
    expect(ConditionCardComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        condition: mockConditions[1],
        index: 1,
        isPublished: false,
      }),
      {}
    );
  });

  it('does not render ConditionCardComponent if allConditions is empty', () => {
    render(<ConditionsListComponent {...defaultProps} allConditions={[]} />);

    expect(ConditionCardComponent).not.toHaveBeenCalled();
  });
});
