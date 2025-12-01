import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import { onUpdateErrorState } from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/slices/segmentSlice';
import { labels as mockLabels } from '@kitman/services/src/mocks/handlers/OrganisationSettings/DynamicCohorts/Labels/getAllLabels';
import { createLabelExpression } from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/src/utils';
import { getInitialState } from '../../slices/segmentSlice';
import useValidationHook from '../useValidationHook';

jest.mock(
  '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/slices/segmentSlice'
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  segmentSlice: getInitialState(),
});

describe('useValidationHook', () => {
  const getWrapper = ({ children }) => {
    return <Provider store={defaultStore}>{children}</Provider>;
  };

  beforeEach(() => {
    onUpdateErrorState.mockReturnValue(() => {});
  });

  it('invalidates an empty string name', () => {
    const {
      result: {
        current: { validateName },
      },
    } = renderHook(() => useValidationHook(), {
      wrapper: getWrapper,
    });

    validateName('');
    expect(onUpdateErrorState).toHaveBeenCalledWith({
      formInputKey: 'name',
      isInvalid: true,
    });
  });

  it('validates an acceptable name properly', () => {
    const {
      result: {
        current: { validateName },
      },
    } = renderHook(() => useValidationHook(), {
      wrapper: getWrapper,
    });

    validateName('my test string');
    expect(onUpdateErrorState).toHaveBeenCalledWith({
      formInputKey: 'name',
      isInvalid: false,
    });
  });

  it('invalidates an empty expression', () => {
    const {
      result: {
        current: { validateExpression },
      },
    } = renderHook(() => useValidationHook(), {
      wrapper: getWrapper,
    });

    validateExpression({ operator: '', operands: [] });
    expect(onUpdateErrorState).toHaveBeenCalledWith({
      formInputKey: 'expression',
      isInvalid: true,
    });
  });

  it('validates an acceptable expression properly', () => {
    const {
      result: {
        current: { validateExpression },
      },
    } = renderHook(() => useValidationHook(), {
      wrapper: getWrapper,
    });

    validateExpression(
      createLabelExpression(mockLabels.map((label) => label.name))
    );
    expect(onUpdateErrorState).toHaveBeenCalledWith({
      formInputKey: 'expression',
      isInvalid: false,
    });
  });
});
